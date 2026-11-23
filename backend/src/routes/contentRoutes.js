const express = require("express");
const { isObjectIdOrHexString, connection } = require("mongoose");
const Content = require("../models/StudyContent");
const { authenticate, requireAdmin } = require("../middlewares/authMiddleware");
const { aiLimit } = require("../middlewares/rateLimit");
const { aiError, harness, isAiConfigured, validateOutput } = require("../services/aiHarness");

const admin = express.Router();
const published = express.Router();
const kinds = ["reading", "listening", "modelStudy"];
const exams = ["IELTS", "DELF"];

function checkKind(kind, exam) {
  if (!kinds.includes(kind) || !exams.includes(exam)) throw aiError(400, "Tipo ou exame inválido.");
}

function audit(req, operation, record) {
  console.info(JSON.stringify({
    event: "admin.content", operation, actor: req.user.uid, id: record.id, status: record.status,
  }));
}

admin.use(authenticate({ checkRevoked: true }), requireAdmin);
admin.get("/status", (req, res) => res.json({
  role: "admin", database: connection.readyState === 1 ? "connected" : "unavailable",
  geminiConfigured: isAiConfigured(), ...harness.status(),
}));
admin.get("/generations", (req, res) => res.json(harness.recent()));
admin.get("/content", async (req, res) => {
  const before = req.query.before;
  if (before !== undefined && !isObjectIdOrHexString(before)) throw aiError(400, "Cursor inválido.");
  const filter = before ? { _id: { $lt: before } } : {};
  return res.json(await Content.find(filter).sort({ _id: -1 }).limit(25).lean());
});
admin.post("/preview", aiLimit(3), async (req, res) => {
  const { kind, exam, focus } = req.body || {};
  checkKind(kind, exam);
  return res.json({ payload: await harness.run(kind, exam, { focus }) });
});

admin.post("/content", async (req, res) => {
  const { kind, exam, payload } = req.body || {};
  checkKind(kind, exam);
  const data = validateOutput(kind, exam, payload);
  const record = await Content.create({ kind, exam, payload: data, updatedBy: req.user.uid });
  audit(req, "create", record);
  return res.status(201).json({ ...record.toObject(), updatedBy: undefined });
});

admin.patch("/content/:id", async (req, res) => {
  if (!isObjectIdOrHexString(req.params.id)) throw aiError(404, "Conteúdo não encontrado.");
  const record = await Content.findById(req.params.id).lean();
  if (!record) throw aiError(404, "Conteúdo não encontrado.");
  const { action, payload, revision } = req.body || {};
  if (revision !== record.__v) throw aiError(409, "Atualize a lista antes de salvar.");
  const update = { updatedBy: req.user.uid };
  if (action === "edit" && record.status !== "published") {
    update.payload = validateOutput(record.kind, record.exam, payload);
    update.status = "draft";
  } else if (action === "review" && record.status === "draft") {
    update.status = "reviewed";
  } else if (action === "publish" && record.status === "reviewed") {
    update.status = "published";
  } else if (action === "unpublish" && record.status === "published") {
    update.status = "reviewed";
  } else {
    throw aiError(409, "A ação não corresponde ao estado do conteúdo.");
  }
  const updated = await Content.findOneAndUpdate(
    { _id: record._id, __v: revision, status: record.status },
    { $set: update, $inc: { __v: 1 } }, { returnDocument: "after" },
  );
  if (!updated) throw aiError(409, "Atualize a lista antes de salvar.");
  audit(req, action, updated);
  return res.json(updated);
});

published.get("/:exam/:kind", async (req, res) => {
  const { kind, exam } = req.params;
  checkKind(kind, exam);
  const items = await Content.find({ kind, exam, status: "published" })
    .select("payload").sort({ updatedAt: -1 }).limit(kind === "modelStudy" ? 12 : 1).lean();
  return res.json(items.map(({ _id, payload }) => ({ id: _id, payload })));
});

module.exports = { admin, published };
