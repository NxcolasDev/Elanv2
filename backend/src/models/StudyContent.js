const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  kind: { type: String, enum: ["reading", "listening", "modelStudy"], required: true },
  exam: { type: String, enum: ["IELTS", "DELF"], required: true },
  status: { type: String, enum: ["draft", "reviewed", "published"], default: "draft" },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedBy: { type: String, required: true, select: false },
}, { timestamps: true });

schema.index({ status: 1, exam: 1, kind: 1, updatedAt: -1 });
module.exports = mongoose.model("StudyContent", schema);
