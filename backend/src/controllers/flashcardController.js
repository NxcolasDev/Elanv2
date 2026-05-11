const Flashcard = require("../models/Flashcard");

const getFlashcards = async (req, res) => {
  try {
    const { userId } = req.params;

    const flashcards = await Flashcard.find({ userId });

    res.json(flashcards);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar flashcards",
    });
  }
};

const createFlashcard = async (req, res) => {
  try {
    const {
      userId,
      deckName,
      front,
      back,
    } = req.body;

    const flashcard = await Flashcard.create({
      userId,
      deckName,
      front,
      back,
    });

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar flashcard",
    });
  }
};

const deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params;

    await Flashcard.findByIdAndDelete(id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar flashcard",
    });
  }
};

const reviewFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.body;

    const flashcard = await Flashcard.findById(id);

    if (!flashcard) {
      return res.status(404).json({
        error: "Flashcard não encontrado",
      });
    }

    if (quality === "again") {
      flashcard.repetitions = 0;
      flashcard.interval = 1;
    } else {
      flashcard.repetitions += 1;
      flashcard.interval *= 2;
    }

    const nextDate = new Date();
    nextDate.setDate(
      nextDate.getDate() + flashcard.interval
    );

    flashcard.nextReview = nextDate;

    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao revisar flashcard",
    });
  }
};

module.exports = {
  getFlashcards,
  createFlashcard,
  deleteFlashcard,
  reviewFlashcard,
};