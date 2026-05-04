require("dotenv").config();
const axios = require("axios");

const generateText = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ],
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
    console.error("🔥 ERRO IA:", error.response?.data || error.message);

    return JSON.stringify({
      band: 0,
      corrections: ["Erro na IA"],
      improvedText: "",
      feedback: "Não foi possível corrigir"
    });
  }
};

module.exports = { generateText };