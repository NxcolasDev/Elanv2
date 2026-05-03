const express = require("express");
const router = express.Router();
const { generateExam } = require("../controllers/examController");

router.post("/generate", generateExam);

module.exports = router;