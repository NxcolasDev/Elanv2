const express = require("express");
const { generateExam } = require("../controllers/examController");
const { authenticate } = require("../middlewares/authMiddleware");
const { aiLimit } = require("../middlewares/rateLimit");
const { isAiConfigured } = require("../services/aiHarness");

const router = express.Router();
const requireUser = authenticate();
const limit = aiLimit(6);
router.post("/generate", (req, res, next) => {
  if (req.body?.mode === "topics" || !isAiConfigured()) return generateExam(req, res);
  return requireUser(req, res, next);
}, limit, generateExam);

module.exports = router;
