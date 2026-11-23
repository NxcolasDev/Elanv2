import { scopedKey } from "../utils/storageScope.js";

const FLASHCARDS_KEY = "elan.flashcards";
const DEFAULT_EASE_FACTOR = 2.5;

const defaultDecks = [
  {
    id: "ielts-vocabulary",
    name: "IELTS Vocabulary",
    cards: [
      {
        id: "sample-card-1",
        front: "coherence",
        back: "logical connection and clarity between ideas",
        easeFactor: DEFAULT_EASE_FACTOR,
        repetitions: 0,
        interval: 0,
        intervalDays: 0,
        nextReviewDate: new Date().toISOString(),
        dueAt: new Date().toISOString(),
        lastReviewed: null,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

function normalizeCard(card) {
  const nextReviewDate = card.nextReviewDate || card.dueAt || new Date().toISOString();

  return {
    ...card,
    easeFactor: Number(card.easeFactor || DEFAULT_EASE_FACTOR),
    repetitions: Number(card.repetitions || 0),
    interval: Number(card.interval ?? card.intervalDays ?? 0),
    intervalDays: Number(card.intervalDays ?? card.interval ?? 0),
    nextReviewDate,
    dueAt: nextReviewDate,
    lastReviewed: card.lastReviewed || card.lastReviewedAt || null,
  };
}

function normalizeDeck(deck) {
  return {
    ...deck,
    cards: (Array.isArray(deck.cards) ? deck.cards : []).map(normalizeCard),
  };
}

export function getFlashcardDecks() {
  try {
    const value = window.localStorage.getItem(scopedKey(FLASHCARDS_KEY));
    const parsed = value ? JSON.parse(value) : defaultDecks;
    return Array.isArray(parsed) ? parsed.map(normalizeDeck) : defaultDecks.map(normalizeDeck);
  } catch {
    return defaultDecks.map(normalizeDeck);
  }
}

export function saveFlashcardDecks(decks) {
  const safeDecks = Array.isArray(decks) ? decks : defaultDecks;

  try {
    window.localStorage.setItem(scopedKey(FLASHCARDS_KEY), JSON.stringify(safeDecks));
  } catch {
    // Keep the API silent for now; the UI can add error handling later.
  }

  return safeDecks;
}

export function createFlashcardCard({ deckId, front, back, context = "" }) {
  const decks = getFlashcardDecks();
  const now = new Date().toISOString();
  const nextDecks = decks.map((deck) => {
    if (deck.id !== deckId) return deck;

    return {
      ...deck,
      cards: [
        ...(Array.isArray(deck.cards) ? deck.cards : []),
        {
          id: crypto.randomUUID?.() || `${Date.now()}`,
          front,
          back,
          context,
          easeFactor: DEFAULT_EASE_FACTOR,
          repetitions: 0,
          interval: 0,
          intervalDays: 0,
          nextReviewDate: now,
          dueAt: now,
          lastReviewed: null,
          createdAt: now,
        },
      ],
    };
  });

  return saveFlashcardDecks(nextDecks);
}

export function createFlashcardDeck(name) {
  const decks = getFlashcardDecks();
  const nextDeck = {
    id: crypto.randomUUID?.() || `${Date.now()}`,
    name,
    cards: [],
    createdAt: new Date().toISOString(),
  };

  return saveFlashcardDecks([nextDeck, ...decks]);
}

export function deleteFlashcardDeck(deckId) {
  const decks = getFlashcardDecks();
  return saveFlashcardDecks(decks.filter((deck) => deck.id !== deckId));
}

export function deleteFlashcardCard(deckId, cardId) {
  const decks = getFlashcardDecks();
  const nextDecks = decks.map((deck) => {
    if (deck.id !== deckId) return deck;

    return {
      ...deck,
      cards: (Array.isArray(deck.cards) ? deck.cards : []).filter((card) => card.id !== cardId),
    };
  });

  return saveFlashcardDecks(nextDecks);
}

export function reviewFlashcard(deckId, cardId, quality = "good") {
  const decks = getFlashcardDecks();

  const nextDecks = decks.map((deck) => {
    if (deck.id !== deckId) return deck;

    return {
      ...deck,
      cards: (Array.isArray(deck.cards) ? deck.cards : []).map((card) => {
        if (card.id !== cardId) return card;

        const repetitions = Number(card.repetitions || 0);
        const currentEase = Number(card.easeFactor || DEFAULT_EASE_FACTOR);
        let nextEaseFactor = currentEase;
        let nextRepetitions;
        let intervalDays = Number(card.interval ?? card.intervalDays ?? 0);

        switch (quality) {
          case "hard":
            nextEaseFactor = Math.max(1.3, currentEase - 0.2);
            nextRepetitions = Math.max(0, repetitions);
            intervalDays = repetitions === 0 ? 0.04 : Math.max(0.25, Math.round(intervalDays * 0.6));
            break;

          case "good":
            nextRepetitions = repetitions + 1;
            intervalDays =
              repetitions === 0
                ? 1
                : repetitions === 1
                ? 3
                : Math.max(4, Math.round(intervalDays * currentEase));
            break;

          case "easy":
            nextEaseFactor = Math.min(3.2, currentEase + 0.15);
            nextRepetitions = repetitions + 1;
            intervalDays =
              repetitions === 0
                ? 4
                : Math.max(7, Math.round((intervalDays || 1) * nextEaseFactor * 1.25));
            break;

          default:
            nextRepetitions = repetitions + 1;
            intervalDays = repetitions === 0 ? 1 : Math.max(3, Math.round(intervalDays * currentEase));
        }

        const nextReview = new Date();

        nextReview.setMinutes(nextReview.getMinutes() + Math.round(intervalDays * 24 * 60));

        return {
          ...card,
          easeFactor: nextEaseFactor,
          repetitions: nextRepetitions,
          interval: intervalDays,
          intervalDays,
          nextReviewDate: nextReview.toISOString(),
          dueAt: nextReview.toISOString(),
          lastReviewed: new Date().toISOString(),
          lastReviewedAt: new Date().toISOString(),
        };
      }),
    };
  });

  return saveFlashcardDecks(nextDecks);
}
