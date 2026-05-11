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
You are a REAL IELTS Speaking examiner.

Your job is to evaluate the candidate realistically using official IELTS Speaking Band Descriptors.

IMPORTANT:
- Do NOT be overly strict.
- Small grammar mistakes SHOULD NOT automatically create low bands.
- Band 6 speakers make mistakes frequently.
- Band 7 speakers are NOT perfect.
- Focus on communication and fluency first.
- Evaluate like a HUMAN IELTS examiner.

Use these criteria:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation

Band Guide:
- 5 = limited but understandable
- 6 = competent with some mistakes
- 7 = good speaker with occasional inaccuracies
- 8 = very strong with rare mistakes
- 9 = expert/native-like

Return ONLY valid JSON:

{
  "band": number,
  "fluency": "string",
  "vocabulary": "string",
  "grammar": "string",
  "pronunciation": "string",
  "suggestions": "string"
}

Candidate speech:
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
          pronunciation: "",
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
You are a REAL IELTS Writing examiner.

Your job is to evaluate the essay realistically using official IELTS Writing Band Descriptors.

IMPORTANT:
- Do NOT be overly strict.
- Small grammar mistakes SHOULD NOT automatically create low bands.
- Band 6 essays can contain grammar mistakes.
- Band 7 essays are NOT perfect.
- Evaluate like a HUMAN IELTS examiner.

Use these criteria:
1. Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Band Guide:
- 5 = limited but understandable
- 6 = competent with some mistakes
- 7 = good user with occasional inaccuracies
- 8 = very strong with rare mistakes
- 9 = expert/native-like

Return ONLY valid JSON:

{
  "band": number,
  "taskResponse": "string",
  "coherence": "string",
  "lexical": "string",
  "grammar": "string",
  "corrections": ["string"],
  "improvedText": "string",
  "feedback": "string"
}

Essay:
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
          taskResponse: "",
          coherence: "",
          lexical: "",
          grammar: "",
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

    // 🔥 READING
    if (mode === "reading") {
      const prompt = `
You are an IELTS reading exam generator.

Create:
- One reading text (medium difficulty)
- 10 questions

Return ONLY valid JSON:

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