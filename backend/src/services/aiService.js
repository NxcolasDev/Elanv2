const axios = require("axios");

async function generate(prompt) {
  const res = await axios.post(
    "URL_DA_IA",
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`
      }
    }
  );

  return res.data;
}

module.exports = { generate };