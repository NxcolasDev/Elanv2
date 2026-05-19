import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useActiveExam } from "../hooks/useActiveExam";
import { createFlashcardCard, getFlashcardDecks } from "../services/flashcardsStorage";

const englishWords = {
  improve: "melhorar",
  increase: "aumentar",
  government: "governo",
  environment: "meio ambiente",
  research: "pesquisa",
  education: "educação",
  achieve: "alcançar",
  development: "desenvolvimento",
  technology: "tecnologia",
  learning: "aprendizado",
};

const frenchWords = {
  bonjour: "olá",
  apprendre: "aprender",
  environnement: "meio ambiente",
  gouvernement: "governo",
  développement: "desenvolvimento",
  recherche: "pesquisa",
  éducation: "educação",
};

export default function News() {
  const { isDelf } = useActiveExam();

  const [selectedWord, setSelectedWord] = useState("");
  const [translation, setTranslation] = useState("");

  const dictionary = isDelf ? frenchWords : englishWords;

  const handleSelection = () => {
    const text = window
      .getSelection()
      ?.toString()
      ?.trim()
      ?.toLowerCase()
      ?.replace(/[.,!?]/g, "");

    if (!text) return;

    setSelectedWord(text);

    setTranslation(
      dictionary[text] || "Tradução não encontrada."
    );
  };

  const openWebsite = () => {
    if (isDelf) {
      window.open(
        "https://apprendre.tv5monde.com/fr",
        "_blank"
      );
    } else {
      window.open(
        "https://www.bbc.com/news",
        "_blank"
      );
    }
  };

  const addFlashcard = () => {
    if (!selectedWord || !translation) return;

    const firstDeck = getFlashcardDecks()[0];

    if (!firstDeck?.id) return;

    createFlashcardCard({
      deckId: firstDeck.id,
      front: selectedWord,
      back: translation,
    });

    alert("Flashcard salvo.");
  };

  return (
    <MainLayout>
      <div className="space-y-6 text-white">
        <section className="elan-glass rounded-[2rem] p-6">
          <h1 className="text-4xl font-black">
            News
          </h1>

          <p className="mt-3 max-w-3xl text-gray-400">
            Leia notícias reais diretamente da BBC ou TV5Monde.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-8">
            <div className="flex h-full min-h-[70vh] flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-black">
                {isDelf
                  ? "TV5Monde"
                  : "BBC News"}
              </h2>

              <p className="mt-4 max-w-xl text-gray-400">
                Abra o site oficial e utilize o tradutor hover
                do ELAN para salvar novas palavras no seu vocabulário.
              </p>

              <button
                onClick={openWebsite}
                className="mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-4 font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] transition hover:scale-[1.03]"
              >
                Abrir site oficial
              </button>
            </div>
          </div>

          <div className="elan-glass rounded-[2rem] p-5">
            <h2 className="text-xl font-bold">
              Hover Translator
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Selecione palavras abaixo para traduzir.
            </p>

            <div
              onMouseUp={handleSelection}
              className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-8 text-gray-200"
            >
              {isDelf
                ? "Bonjour. Vous pouvez apprendre le français avec des contenus réels et améliorer votre vocabulaire rapidement."
                : "You can improve your English by reading real news articles and learning new vocabulary naturally."}
            </div>

            <div className="mt-6 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-purple-200">
                Palavra selecionada
              </p>

              <p className="mt-2 text-2xl font-black">
                {selectedWord || "Nenhuma"}
              </p>

              <p className="mt-3 text-sm text-gray-300">
                {translation ||
                  "Selecione uma palavra para traduzir."}
              </p>

              <button
                onClick={addFlashcard}
                disabled={!selectedWord}
                className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Adicionar ao Flashcard
              </button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
