const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { getFlashcards, createFlashcard, deleteFlashcard, reviewFlashcard } = require("../controllers/flashcardController");
const router = express.Router();

router.use(authenticate());
router.get("/:userId", getFlashcards);
router.post("/", createFlashcard);
router.delete("/:id", deleteFlashcard);
router.put("/review/:id", reviewFlashcard);

module.exports = router;
