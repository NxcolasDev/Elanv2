const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    deckName: {
      type: String,
      required: true,
    },

    front: {
      type: String,
      required: true,
    },

    back: {
      type: String,
      required: true,
    },

    easeFactor: {
      type: Number,
      default: 2.5,
    },

    interval: {
      type: Number,
      default: 1,
    },

    repetitions: {
      type: Number,
      default: 0,
    },

    nextReview: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Flashcard", FlashcardSchema);