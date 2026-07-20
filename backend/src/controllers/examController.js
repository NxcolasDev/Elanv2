const { getRandomTopics } = require("../utils/examGenerator");
const {
  AI_DEMO_UNAVAILABLE_MESSAGE,
  AiProviderUnavailableError,
  generateText,
} = require("../services/aiProvider");

function cleanAiJson(value) {
  return String(value || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

const generateExam = async (req, res) => {
  try {
    const { mode, text, context, focus } = req.body;

    if (!mode) {
      return res.status(400).json({
        error: "Mode is required"
      });
    }

    // 🔹 TEMAS
    if (mode === "topics") {
      const topics = getRandomTopics();

      return res.json({
        success: true,
        topics
      });
    }

    if (mode === "studyAssistant") {
      if (!text || typeof text !== "string") {
        return res.status(400).json({
          error: "Question text is required"
        });
      }

      const prompt = `
You are Lumi, ELAN's IELTS and DELF study assistant.

Help the learner with practical, exam-focused guidance.
You can explain:
- vocabulary
- grammar
- pronunciation
- IELTS Writing Task 1 and Task 2
- IELTS Speaking Part 1, Part 2, and Part 3
- DELF production orale and production ecrite
- listening strategies
- linking words
- band improvement strategies

Keep the answer concise, clear, and useful.
Explain why the structure is useful, when to use it, how it improves score, and the band/level that usually uses it when relevant.
Do not claim official scores. Use cautious wording.

Focus: ${focus || "general study support"}
Page context:
${context || "No extra context provided."}

Learner question:
${text}
`;

      const answer = await generateText(prompt);

      return res.json({
        success: true,
        answer: cleanAiJson(answer)
      });
    }

    if (mode === "modelStudy") {
      const prompt = `
Create one realistic study model for ELAN.

Topic/focus:
${focus || "IELTS and DELF language learning"}

Return ONLY valid JSON:
{
  "title": "string",
  "level": "string",
  "model": "string",
  "whyUseThis": "string",
  "whenToUse": "string",
  "scoreImpact": "string",
  "typicalLevel": "string",
  "examples": ["string", "string", "string"],
  "practicePrompt": "string"
}
`;

      const result = await generateText(prompt);

      try {
        return res.json({
          success: true,
          model: JSON.parse(cleanAiJson(result))
        });
      } catch {
        return res.json({
          success: true,
          model: {
            title: focus || "Study model",
            level: "Adaptive",
            model: result,
            whyUseThis: "This structure helps you organize your answer clearly.",
            whenToUse: "Use it when you need a reliable exam answer structure.",
            scoreImpact: "It can improve coherence, vocabulary control, and task response.",
            typicalLevel: "B1-C1 / Band 6-8",
            examples: [],
            practicePrompt: "Write your own version using the same structure."
          }
        });
      }
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
        const clean = cleanAiJson(result);

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
        const clean = cleanAiJson(result);

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
        const clean = cleanAiJson(result);

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
    if (error instanceof AiProviderUnavailableError) {
      return res.status(error.statusCode).json({
        success: false,
        code: error.code,
        aiUnavailable: true,
        message: AI_DEMO_UNAVAILABLE_MESSAGE,
      });
    }

    console.error("🔥 ERRO GERAL:", error);

    return res.status(500).json({
      error: "Erro no exame"
    });
  }
};

module.exports = { generateExam };
