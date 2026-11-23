const { getRandomTopics } = require("../utils/examGenerator");
const { aiError, harness, isAiConfigured } = require("../services/aiHarness");

const responseKeys = new Map([
  ["studyAssistant", "answer"], ["modelStudy", "model"], ["speaking", "feedback"],
  ["correction", "correction"], ["reading", "data"],
]);

async function generateExam(req, res) {
  const { mode, exam = "IELTS", ...input } = req.body || {};
  if (mode === "topics") return res.json({ success: true, topics: getRandomTopics() });

  const key = responseKeys.get(mode);
  if (!key) throw aiError(400, "Modo inválido.", "AI_INPUT");
  if (!isAiConfigured()) {
    return res.status(503).json({
      success: false, code: "AI_PROVIDER_UNAVAILABLE", aiUnavailable: true,
      message: "Configure GEMINI_API_KEY no backend para usar os recursos de IA.",
    });
  }
  const result = await harness.run(mode, exam, input);
  return res.json({ success: true, [key]: result });
}

module.exports = { generateExam };
