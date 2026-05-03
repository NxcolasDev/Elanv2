const express = require("express");
const router = express.Router();

// TESTE
router.get("/", (req, res) => {
  res.json({ message: "Users route working" });
});

module.exports = router;