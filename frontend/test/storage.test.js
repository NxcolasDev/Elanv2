import assert from "node:assert/strict";
import test from "node:test";
import { createFlashcardCard, createFlashcardDeck, getFlashcardDecks, reviewFlashcard } from "../src/services/flashcardsStorage.js";
import { getExamHistory, saveExamResult } from "../src/utils/examHistory.js";
import { setActiveStorageUser } from "../src/utils/storageScope.js";
import { toIELTSBand } from "../src/utils/scoring.js";

test("flashcards and mock exam history survive scope switches in browser storage", () => {
  const storage = new Map();
  globalThis.window = { localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  } };
  try {
    setActiveStorageUser("alice");
    createFlashcardDeck("French personal notes");
    const [deck] = getFlashcardDecks().filter((item) => item.name === "French personal notes");
    createFlashcardCard({ deckId: deck.id, front: "Bonjour", back: "Hello" });
    const [card] = getFlashcardDecks().find((item) => item.id === deck.id).cards;
    reviewFlashcard(deck.id, card.id, "good");
    const updated = getFlashcardDecks().find((item) => item.id === deck.id).cards[0];
    assert.ok(Date.parse(updated.nextReviewDate) > Date.now());
    saveExamResult({ exam: "IELTS", skill: "Simulation", score: toIELTSBand(40, 40) });

    setActiveStorageUser("bob");
    assert.ok(!getFlashcardDecks().some((item) => item.id === deck.id));
    assert.deepEqual(getExamHistory(), []);
    saveExamResult({ exam: "DELF", skill: "Writing", score: 72 }, "alice");
    assert.deepEqual(getExamHistory(), []);
    setActiveStorageUser("alice");
    assert.deepEqual(getExamHistory().map((entry) => entry.score), [72, 9]);
  } finally {
    setActiveStorageUser("demo");
    delete globalThis.window;
  }
});
