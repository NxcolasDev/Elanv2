const { rateLimit } = require("express-rate-limit");

function aiLimit(limit) {
  return rateLimit({
    windowMs: 60_000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) => req.user.uid,
    message: { error: "Limite de solicitações de IA atingido. Aguarde um minuto." },
  });
}

module.exports = { aiLimit };
