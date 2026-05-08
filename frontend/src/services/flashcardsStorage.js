import { scopedKey } from "../utils/storageScope";

const FLASHCARDS_KEY = "elan.flashcards";

const defaultDecks = [
  {
    id: "ielts-vocabulary",
    name: "IELTS Vocabulary",
    cards: [
      {
        id: "sample-card-1",
        front: "coherence",
        back: "logical connection and clarity between ideas",
        intervalDays: 1,
        repetitions: 0,
        dueAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export function getFlashcardDecks() {
  try {
    const value = window.localStorage.getItem(scopedKey(FLASHCARDS_KEY));
    const parsed = value ? JSON.parse(value) : defaultDecks;
    return Array.isArray(parsed) ? parsed : defaultDecks;
  } catch {
    return defaultDecks;
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

export function createFlashcardCard({ deckId, front, back }) {
  const decks = getFlashcardDecks();
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
          intervalDays: 1,
          repetitions: 0,
          dueAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
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

        const repetitions = quality === "again" ? 0 : Number(card.repetitions || 0) + 1;
        const intervalDays =
          quality === "again" ? 1 : Math.min(30, Math.max(1, Number(card.intervalDays || 1) * 2));
        const dueAt = new Date();
        dueAt.setDate(dueAt.getDate() + intervalDays);

        return {
          ...card,
          repetitions,
          intervalDays,
          dueAt: dueAt.toISOString(),
          lastReviewedAt: new Date().toISOString(),
        };
      }),
    };
  });

  return saveFlashcardDecks(nextDecks);
}
