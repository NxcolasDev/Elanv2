const { getRandomTopics } = require("../utils/examGenerator");
const { generateText } = require("../services/aiProvider");

const generateExam = async (req, res) => {
  try {
    const { mode, text } = req.body;

    // 🔹 TEMAS
    if (mode === "topics") {
      const topics = getRandomTopics();

      return res.json({
        success: true,
        topics
      });
    }

    // 🔹 CORREÇÃO
    if (mode === "correction") {

      const prompt = `
You are an IELTS examiner.

Return ONLY JSON:

{
  "band": number,
  "corrections": ["string"],
  "improvedText": "string",
  "feedback": "string"
}

Text:
${text}
`;

      const result = await generateText(prompt);

      let parsed;

      try {
        const clean = result.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch (err) {
        console.error("❌ PARSE ERROR:", result);

        parsed = {
          band: 0,
          corrections: ["Erro ao interpretar resposta da IA"],
          improvedText: text,
          feedback: result
        };
      }

      return res.json({
        success: true,
        correction: parsed
      });
    }

  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);
    res.status(500).json({ error: "Erro no exame" });
  }
};

module.exports = { generateExam };