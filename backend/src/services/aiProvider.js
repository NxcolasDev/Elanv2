require("dotenv").config();
const axios = require("axios");

const AI_DEMO_UNAVAILABLE_MESSAGE =
  "As funcionalidades de Inteligência Artificial dependem de uma chave de API própria. Por questões de segurança e custo, elas não estão disponíveis na demonstração pública. Consulte o README para saber como configurar.";

class AiProviderUnavailableError extends Error {
  constructor() {
    super(AI_DEMO_UNAVAILABLE_MESSAGE);
    this.name = "AiProviderUnavailableError";
    this.code = "AI_PROVIDER_UNAVAILABLE";
    this.statusCode = 503;
  }
}

function isAiConfigured() {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim());
}

const generateText = async (prompt) => {
  if (!isAiConfigured()) {
    throw new AiProviderUnavailableError();
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI provider error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  AI_DEMO_UNAVAILABLE_MESSAGE,
  AiProviderUnavailableError,
  generateText,
  isAiConfigured,
};
