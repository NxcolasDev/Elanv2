const { isObjectIdOrHexString } = require("mongoose");
const Flashcard = require("../models/Flashcard");

const notFound = (res) => res.status(404).json({ error: "Flashcard não encontrado." });

async function getFlashcards(req, res) {
  if (req.params.userId !== req.user.uid) return res.status(403).json({ error: "Acesso negado." });
  return res.json(await Flashcard.find({ userId: req.user.uid }));
}

async function createFlashcard(req, res) {
  const { userId, deckName, front, back } = req.body || {};
  if (userId !== undefined && userId !== req.user.uid) {
    return res.status(403).json({ error: "Acesso negado." });
  }
  if (![deckName, front, back].every((value) => typeof value === "string" && value.trim() && value.length <= 2000)) {
    return res.status(400).json({ error: "Informe deck, frente e verso válidos." });
  }
  return res.json(await Flashcard.create({ userId: req.user.uid, deckName, front, back }));
}

async function deleteFlashcard(req, res) {
  const { id } = req.params;
  if (!isObjectIdOrHexString(id)) return notFound(res);
  const result = await Flashcard.deleteOne({ _id: id, userId: req.user.uid });
  if (!result.deletedCount) return notFound(res);
  return res.json({ success: true });
}

async function reviewFlashcard(req, res) {
  const { id } = req.params;
  const { quality } = req.body || {};
  if (!isObjectIdOrHexString(id)) return notFound(res);
  if (!["again", "hard", "good", "easy"].includes(quality)) {
    return res.status(400).json({ error: "Informe uma avaliação válida." });
  }
  const again = quality === "again";
  const interval = again ? 1 : { $min: [36500, { $multiply: [{ $ifNull: ["$interval", 1] }, 2] }] };
  const flashcard = await Flashcard.findOneAndUpdate({ _id: id, userId: req.user.uid }, [
    { $set: { interval, repetitions: again ? 0 : { $add: [{ $ifNull: ["$repetitions", 0] }, 1] } } },
    { $set: { nextReview: { $dateAdd: { startDate: "$$NOW", unit: "day", amount: "$interval" } } } },
  ], { returnDocument: "after", updatePipeline: true });
  if (!flashcard) return notFound(res);
  return res.json(flashcard);
}

module.exports = { getFlashcards, createFlashcard, deleteFlashcard, reviewFlashcard };
