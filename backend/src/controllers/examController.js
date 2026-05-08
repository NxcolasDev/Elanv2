const { getRandomTopics } = require("../utils/examGenerator");
const { generateText } = require("../services/aiProvider");

const generateExam = async (req, res) => {
  try {
    const { mode, text, task } = req.body;

    // 🔹 TEMAS
    if (mode === "topics") {
      const topics = getRandomTopics();

      return res.json({
        success: true,
        topics
      });
    }

    // 🔥 SPEAKING
    if (mode === "speaking") {
      const prompt = `
You are an IELTS speaking examiner.

Return ONLY JSON:

{
  "band": number,
  "fluency": "string",
  "vocabulary": "string",
  "grammar": "string",
  "suggestions": "string"
}

Text:
${text}
`;

      const result = await generateText(prompt);

      let parsed;

      try {
        const clean = result.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = {
          band: 0,
          fluency: "Erro",
          vocabulary: "",
          grammar: "",
          suggestions: result
        };
      }

      return res.json({
        success: true,
        feedback: parsed
      });
    }

    // 🔹 WRITING
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
      } catch {
        parsed = {
          band: 0,
          corrections: ["Erro"],
          improvedText: text,
          feedback: result
        };
      }

      return res.json({
        success: true,
        correction: parsed
      });
    }

    // 🔥 READING (AGORA SIM INTEGRADO)
    if (mode === "reading") {
      const prompt = `
You are an IELTS reading exam generator.

Create:
- One reading text (medium difficulty)
- 10 questions (for now, not 40 yet for testing)

Return ONLY JSON:

{
  "text": "string",
  "questions": [
    {
      "id": number,
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": "A"
    }
  ]
}
`;

      const result = await generateText(prompt);

      let parsed;

      try {
        const clean = result
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        parsed = JSON.parse(clean);
      } catch (err) {
        return res.json({
          success: false,
          error: "Erro IA"
        });
      }

      return res.json({
        success: true,
        data: parsed
      });
    }

    // ❌ MODO INVÁLIDO
    return res.status(400).json({
      error: "Modo inválido"
    });

  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);

    return res.status(500).json({
      error: "Erro no exame"
    });
  }
};

module.exports = { generateExam };