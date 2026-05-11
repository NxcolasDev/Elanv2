const express = require("express");

const router = express.Router();

const {
  getFlashcards,
  createFlashcard,
  deleteFlashcard,
  reviewFlashcard,
} = require("../controllers/flashcardController");

router.get("/:userId", getFlashcards);

router.post("/", createFlashcard);

router.delete("/:id", deleteFlashcard);

router.put("/review/:id", reviewFlashcard);

module.exports = router;