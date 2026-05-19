import { useMemo, useState } from "react";
import { Edit3, Layers, Plus, RotateCcw, Trash2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import {
  createFlashcardCard,
  createFlashcardDeck,
  deleteFlashcardCard,
  deleteFlashcardDeck,
  getFlashcardDecks,
  reviewFlashcard,
  saveFlashcardDecks,
} from "../services/flashcardsStorage";

export default function Flashcards() {
  const [decks, setDecks] = useState(() => getFlashcardDecks());

  const [activeDeckId, setActiveDeckId] = useState(
    () => decks[0]?.id || ""
  );

  const [deckName, setDeckName] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [editingCard, setEditingCard] = useState(null);

  const activeDeck = useMemo(
    () => decks.find((deck) => deck.id === activeDeckId) || decks[0],
    [decks, activeDeckId]
  );

  // 🔥 FILTRA APENAS CARDS DISPONÍVEIS
  const cards = (
    Array.isArray(activeDeck?.cards)
      ? activeDeck.cards
      : []
  ).filter((card) => {
    const nextReviewDate = card.nextReviewDate || card.dueAt;
    if (!nextReviewDate) return true;

    return new Date(nextReviewDate) <= new Date();
  });

  const currentCard =
    cards[reviewIndex % Math.max(cards.length, 1)];

  const allCards = Array.isArray(activeDeck?.cards) ? activeDeck.cards : [];

  const getDifficultyState = (card) => {
    if (Number(card.repetitions || 0) === 0) return "Novo";
    if (Number(card.easeFactor || 2.5) < 2.2) return "Hard";
    if (Number(card.easeFactor || 2.5) > 2.65) return "Easy";
    return "Good";
  };

  // 🔥 CRIAR DECK
  const handleCreateDeck = () => {
    if (!deckName.trim()) return;

    const nextDecks = createFlashcardDeck(deckName.trim());

    setDecks(nextDecks);

    setActiveDeckId(nextDecks[0]?.id || "");

    setDeckName("");
  };

  // 🔥 ADICIONAR CARD
  const handleAddCard = () => {
    if (!activeDeck?.id || !front.trim() || !back.trim())
      return;

    const nextDecks = createFlashcardCard({
      deckId: activeDeck.id,
      front: front.trim(),
      back: back.trim(),
    });

    setDecks(nextDecks);

    setFront("");
    setBack("");
  };

  // 🔥 REVIEW
  const handleReview = (quality) => {
    if (!activeDeck?.id || !currentCard?.id) return;

    const nextDecks = reviewFlashcard(
      activeDeck.id,
      currentCard.id,
      quality
    );

    setDecks(nextDecks);

    setFlipped(false);

    setReviewIndex((previous) => previous + 1);
  };

  // 🔥 DELETAR DECK
  const handleDeleteDeck = (deckId) => {
    const nextDecks = deleteFlashcardDeck(deckId);

    setDecks(nextDecks);

    if (activeDeckId === deckId) {
      setActiveDeckId(nextDecks[0]?.id || "");
    }
  };

  // 🔥 DELETAR CARD
  const handleDeleteCard = () => {
    if (!activeDeck?.id || !currentCard?.id) return;

    const nextDecks = deleteFlashcardCard(
      activeDeck.id,
      currentCard.id
    );

    setDecks(nextDecks);

    setFlipped(false);

    setReviewIndex(0);
  };

  const handleDeleteSpecificCard = (cardId) => {
    if (!activeDeck?.id) return;

    const nextDecks = deleteFlashcardCard(activeDeck.id, cardId);
    setDecks(nextDecks);
    setReviewIndex(0);
  };

  const handleReviewSpecificCard = (cardId, quality = "good") => {
    if (!activeDeck?.id) return;

    setDecks(reviewFlashcard(activeDeck.id, cardId, quality));
  };

  const saveEditedCard = () => {
    if (!activeDeck?.id || !editingCard?.id) return;

    const nextDecks = decks.map((deck) => {
      if (deck.id !== activeDeck.id) return deck;

      return {
        ...deck,
        cards: (Array.isArray(deck.cards) ? deck.cards : []).map((card) =>
          card.id === editingCard.id
            ? {
                ...card,
                front: editingCard.front,
                back: editingCard.back,
                context: editingCard.context || "",
              }
            : card
        ),
      };
    });

    setDecks(saveFlashcardDecks(nextDecks));
    setEditingCard(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 text-white">

        {/* HERO */}
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <p className="text-sm text-purple-200">
            Revisão espaçada
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Flashcards ELAN
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Crie decks inteligentes, revise com spaced repetition
            e acompanhe sua evolução em IELTS e DELF.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

          {/* SIDEBAR */}
          <div className="space-y-4">

            {/* NOVO DECK */}
            <div className="elan-glass rounded-3xl p-5">
              <h2 className="font-bold">Novo deck</h2>

              <div className="mt-4 flex gap-2">
                <input
                  value={deckName}
                  onChange={(event) =>
                    setDeckName(event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  placeholder="Ex: DELF B2 expressions"
                />

                <button
                  onClick={handleCreateDeck}
                  className="rounded-xl bg-purple-600 px-4 py-2 transition hover:bg-purple-500"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* LISTA DE DECKS */}
            <div className="grid gap-3">
              {decks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setActiveDeckId(deck.id);
                    setReviewIndex(0);
                    setFlipped(false);
                  }}
                  className={`elan-glass rounded-2xl p-4 text-left transition hover:-translate-y-1 ${
                    activeDeck?.id === deck.id
                      ? "border border-purple-300/45"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <Layers
                        className="mb-3 text-purple-300"
                        size={22}
                      />

                      <p className="font-bold">
                        {deck.name}
                      </p>

                      <p className="text-sm text-gray-400">
                        {deck.cards?.length || 0} cards
                      </p>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteDeck(deck.id);
                      }}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-200"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-4">

            {/* NOVO CARD */}
            <div className="elan-glass rounded-3xl p-5">
              <h2 className="font-bold">
                Adicionar card em{" "}
                {activeDeck?.name || "deck"}
              </h2>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  value={front}
                  onChange={(event) =>
                    setFront(event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  placeholder="Frente"
                />

                <input
                  value={back}
                  onChange={(event) =>
                    setBack(event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  placeholder="Verso"
                />
              </div>

              <button
                onClick={handleAddCard}
                className="mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-2 text-sm font-bold shadow-[0_0_26px_rgba(124,58,237,0.34)] transition hover:scale-[1.02]"
              >
                Salvar card
              </button>
            </div>

            {/* REVIEW */}
            <div className="elan-glass elan-glow-card rounded-[2rem] p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-400">
                    Modo revisão
                  </p>

                  <h2 className="text-xl font-bold">
                    {activeDeck?.name || "Sem deck"}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setFlipped(false);
                    setReviewIndex(0);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                >
                  <RotateCcw size={17} />
                </button>

              </div>

              {currentCard ? (
                <>

                  {/* CARD */}
                  <button
                    onClick={() => setFlipped(!flipped)}
                    className="min-h-[260px] w-full rounded-[1.5rem] border border-purple-300/25 bg-gradient-to-br from-purple-500/20 via-black/30 to-blue-500/10 p-8 text-center shadow-[0_0_50px_rgba(124,58,237,0.18)] transition duration-300 hover:scale-[1.01]"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-purple-200">
                      {flipped ? "Verso" : "Frente"}
                    </p>

                    <p className="mt-8 text-3xl font-black">
                      {flipped
                        ? currentCard.back
                        : currentCard.front}
                    </p>

                    <p className="mt-8 text-sm text-gray-400">
                      Clique para virar
                    </p>
                  </button>

                  {/* BOTÕES REVIEW */}
                  <div className="mt-4 grid gap-2 md:grid-cols-3">

                    <button
                      onClick={() => handleReview("hard")}
                      className="rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-100 transition hover:bg-orange-500/20"
                    >
                      Difícil

                      <div className="text-xs opacity-70">
                        volta mais rapido
                      </div>
                    </button>

                    <button
                      onClick={() => handleReview("good")}
                      className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 transition hover:bg-emerald-500/20"
                    >
                      Bom

                      <div className="text-xs opacity-70">
                        intervalo normal
                      </div>
                    </button>

                    <button
                      onClick={() => handleReview("easy")}
                      className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100 transition hover:bg-blue-500/20"
                    >
                      Fácil

                      <div className="text-xs opacity-70">
                        aparece menos
                      </div>
                    </button>

                  </div>

                  {/* DELETE */}
                  <div className="mt-3">
                    <button
                      onClick={handleDeleteCard}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
                    >
                      🗑 Deletar card
                    </button>
                  </div>

                </>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-lg font-bold text-purple-200">
                    🎉 Revisão concluída
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Você terminou todos os cards disponíveis por agora.
                  </p>

                  <p className="mt-4 text-xs text-gray-500">
                    Novos cards aparecerão quando o tempo de revisão acabar.
                  </p>
                </div>
              )}

            </div>

            <div className="elan-glass rounded-3xl p-5">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conteudo do deck</p>
                  <h2 className="text-xl font-bold">{activeDeck?.name || "Sem deck"}</h2>
                </div>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-gray-300">
                  {allCards.length} cards totais
                </span>
              </div>

              <div className="space-y-3">
                {allCards.length === 0 ? (
                  <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                    Este deck ainda nao tem cards.
                  </p>
                ) : (
                  allCards.map((card) => (
                    <div key={card.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-purple-200">Frente</p>
                          <p className="mt-1 text-sm text-gray-100">{card.front}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-purple-200">Verso</p>
                          <p className="mt-1 text-sm text-gray-300">{card.back}</p>
                          {card.context && <p className="mt-2 text-xs text-gray-500">{card.context}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingCard(card)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-200 transition hover:bg-white/10"
                            aria-label="Editar card"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewSpecificCard(card.id, "good")}
                            className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 transition hover:bg-emerald-500/20"
                          >
                            Revisar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSpecificCard(card.id)}
                            className="rounded-xl border border-red-400/30 bg-red-500/10 p-2 text-red-100 transition hover:bg-red-500/20"
                            aria-label="Deletar card"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                        <span className="rounded-full bg-white/8 px-2 py-1">{getDifficultyState(card)}</span>
                        <span className="rounded-full bg-white/8 px-2 py-1">
                          Proxima revisao: {new Date(card.nextReviewDate || card.dueAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {editingCard && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm md:items-center">
            <section className="elan-glass w-full max-w-xl rounded-[2rem] p-5">
              <h2 className="text-xl font-black">Editar flashcard</h2>
              <div className="mt-5 space-y-3">
                <input
                  value={editingCard.front}
                  onChange={(event) => setEditingCard({ ...editingCard, front: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-purple-400"
                  placeholder="Frente"
                />
                <textarea
                  value={editingCard.back}
                  onChange={(event) => setEditingCard({ ...editingCard, back: event.target.value })}
                  className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm outline-none focus:border-purple-400"
                  placeholder="Verso"
                />
                <input
                  value={editingCard.context || ""}
                  onChange={(event) => setEditingCard({ ...editingCard, context: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-purple-400"
                  placeholder="Contexto opcional"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveEditedCard}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Salvar
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
