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

        let intervalMinutes = 1;

        const repetitions = Number(card.repetitions || 0);

        switch (quality) {
          case "again":
            intervalMinutes = 1;
            break;

          case "hard":
            intervalMinutes = repetitions < 3 ? 5 : 60;
            break;

          case "good":
            intervalMinutes =
              repetitions === 0
                ? 10
                : repetitions === 1
                ? 1440
                : repetitions === 2
                ? 4320
                : repetitions === 3
                ? 10080
                : 43200;
            break;

          case "easy":
            intervalMinutes =
              repetitions === 0
                ? 7200
                : repetitions === 1
                ? 10080
                : repetitions === 2
                ? 43200
                : 86400;
            break;

          default:
            intervalMinutes = 10;
        }

        const dueAt = new Date();

        dueAt.setMinutes(
          dueAt.getMinutes() + intervalMinutes
        );

        return {
          ...card,
          repetitions:
            quality === "again"
              ? 0
              : repetitions + 1,

          dueAt: dueAt.toISOString(),

          lastReviewedAt: new Date().toISOString(),
        };
      }),
    };
  });

  return saveFlashcardDecks(nextDecks);
}