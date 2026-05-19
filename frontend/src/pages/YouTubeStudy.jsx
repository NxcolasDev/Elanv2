import { useMemo, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Link as LinkIcon, Plus, Search, StickyNote, Timer, Video, X } from "lucide-react";
import AIStudyAssistant from "../components/AIStudyAssistant";
import MainLayout from "../layouts/MainLayout";
import { createFlashcardCard, getFlashcardDecks } from "../services/flashcardsStorage";
import { createStudyNote } from "../services/notesStorage";
import { youtubeCategories } from "../data/youtubeStudyContent";
import { useLocalStorage } from "../hooks/useLocalStorage";

function extractYouTubeId(value) {
  const input = value.trim();
  if (!input) return "";

  const directId = /^[a-zA-Z0-9_-]{11}$/.test(input) ? input : "";
  if (directId) return directId;

  try {
    const url = new URL(input);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1]?.slice(0, 11) || "";
      }

      return url.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }

  return "";
}

export default function YouTubeStudy() {
  const [activeCategory, setActiveCategory] = useState("IELTS");
  const [videoInput, setVideoInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useLocalStorage("elan.youtube.activeVideo", {
    id: "",
    title: "Paste a YouTube URL to start",
  });
  const [notes, setNotes] = useLocalStorage("elan.youtube.notes", {});
  const [savedSessions, setSavedSessions] = useLocalStorage("elan.youtube.savedSessions", []);
  const [sessionMode, setSessionMode] = useState(false);
  const [flashcardMessage, setFlashcardMessage] = useState("");
  const [pendingFlashcard, setPendingFlashcard] = useState(null);
  const noteRef = useRef(null);

  const activeNoteKey = activeVideo.id || "draft";
  const activeNote = notes[activeNoteKey] || "";

  const effectiveSearch = useMemo(
    () => searchQuery.trim() || `${activeCategory} language learning IELTS DELF`,
    [activeCategory, searchQuery]
  );

  const loadVideo = () => {
    const videoId = extractYouTubeId(videoInput);

    if (!videoId) {
      setFlashcardMessage("Paste a valid YouTube URL or 11-character video ID.");
      return;
    }

    setActiveVideo({
      id: videoId,
      title: `YouTube video ${videoId}`,
      loadedAt: new Date().toISOString(),
    });
    setFlashcardMessage("Video loaded inside ELAN.");
  };

  const updateNote = (value) => {
    setNotes({
      ...notes,
      [activeNoteKey]: value,
    });
  };

  const saveStudyNote = () => {
    const text = activeNote.trim();
    if (!text) {
      setFlashcardMessage("Write a note before saving the session.");
      return;
    }

    setSavedSessions([
      {
        id: crypto.randomUUID?.() || `${Date.now()}`,
        videoId: activeVideo.id,
        category: activeCategory,
        note: text,
        createdAt: new Date().toISOString(),
      },
      ...savedSessions.slice(0, 9),
    ]);
    createStudyNote({
      title: activeVideo.id ? `YouTube - ${activeVideo.id}` : "Sessao de estudo YouTube",
      category: activeCategory,
      content: text,
      source: "youtube",
    });
    setFlashcardMessage("Study note saved.");
  };

  const prepareFlashcard = (mode = "note") => {
    const selectionStart = noteRef.current?.selectionStart ?? 0;
    const selectionEnd = noteRef.current?.selectionEnd ?? 0;
    const selectedText = activeNote.slice(selectionStart, selectionEnd).trim();
    const sourceText = mode === "selection" ? selectedText : activeNote.trim();

    if (!sourceText) {
      setFlashcardMessage(
        mode === "selection"
          ? "Selecione um trecho da anotacao antes de criar o flashcard."
          : "Escreva uma anotacao antes de criar o flashcard."
      );
      return;
    }

    setPendingFlashcard({
      front: mode === "selection" ? `Expressao do video - ${activeCategory}` : activeVideo.title || "Nota de estudo do YouTube",
      back: sourceText,
      context: `Categoria: ${activeCategory}${activeVideo.id ? ` | Video: ${activeVideo.id}` : ""}`,
    });
  };

  const confirmFlashcard = () => {
    const firstDeck = getFlashcardDecks()[0];

    if (!firstDeck?.id || !pendingFlashcard?.front.trim() || !pendingFlashcard?.back.trim()) {
      setFlashcardMessage("Revise frente e verso antes de salvar.");
      return;
    }

    createFlashcardCard({
      deckId: firstDeck.id,
      front: pendingFlashcard.front.trim(),
      back: pendingFlashcard.back.trim(),
      context: pendingFlashcard.context.trim(),
    });

    setPendingFlashcard(null);
    setFlashcardMessage(`Flashcard salvo em ${firstDeck.name}.`);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                <Video size={17} />
                YouTube study portal
              </div>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">Estudo com YouTube</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
                Cole uma aula real do YouTube, estude dentro do ELAN, salve anotacoes e transforme trechos importantes em flashcards.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSessionMode((current) => !current)}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                sessionMode
                  ? "bg-emerald-600 text-white"
                  : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
              }`}
            >
              <Timer size={17} />
              Modo sessao de estudo
            </button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="elan-glass rounded-3xl p-5">
            <label className="text-sm font-semibold text-purple-200" htmlFor="youtube-url">
              Cole uma URL do YouTube ou ID do video
            </label>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                <input
                  id="youtube-url"
                  value={videoInput}
                  onChange={(event) => setVideoInput(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-purple-400"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <button
                type="button"
                onClick={loadVideo}
                className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-500"
              >
                Carregar video
              </button>
            </div>
          </div>

          <div className="elan-glass rounded-3xl p-5">
            <label className="text-sm font-semibold text-purple-200" htmlFor="youtube-search">
              Busca rapida
            </label>
            <div className="mt-3 flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                <input
                  id="youtube-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-purple-400"
                  placeholder="IELTS listening traps, DELF B2 oral..."
                />
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(effectiveSearch)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-gray-100 transition hover:bg-white/10"
              >
                <ExternalLink size={17} />
              </a>
            </div>
          </div>
        </section>

        <div className="flex gap-2 overflow-auto pb-1">
          {youtubeCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery(`${category} language learning`);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-purple-600 text-white"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <section className={`grid gap-6 ${sessionMode ? "xl:grid-cols-[1.3fr_0.7fr]" : "xl:grid-cols-[1fr_360px]"}`}>
          <div className="space-y-5">
            <div className="elan-glass overflow-hidden rounded-[2rem]">
              <div className="aspect-video w-full bg-black">
                {activeVideo.id ? (
                  <iframe
                    key={activeVideo.id}
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${activeVideo.id}`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center text-gray-400">
                    Cole uma URL do YouTube acima para carregar um video real de estudo.
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-sm text-purple-200">{activeCategory}</p>
                <h2 className="mt-2 text-2xl font-black">{activeVideo.title}</h2>
                {activeVideo.id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-purple-200 transition hover:text-white"
                  >
                    Abrir no YouTube
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="elan-glass rounded-3xl p-5">
              <div className="mb-4 flex items-center gap-2 text-purple-200">
                <StickyNote size={18} />
                <h3 className="font-bold">Anotacoes de estudo</h3>
              </div>
              <textarea
                ref={noteRef}
                value={activeNote}
                onChange={(event) => updateNote(event.target.value)}
                className="h-64 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-white outline-none transition focus:border-purple-400"
                placeholder="Escreva trechos de transcricao, vocabulario, timestamps, pronuncia ou padroes gramaticais."
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={saveStudyNote}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <CheckCircle2 size={16} />
                  Salvar anotacao
                </button>
                <button
                  type="button"
                  onClick={() => prepareFlashcard("note")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-500"
                >
                  <Plus size={16} />
                  Criar flashcard da nota
                </button>
                <button
                  type="button"
                  onClick={() => prepareFlashcard("selection")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-300/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-100 transition hover:bg-purple-500/20 sm:col-span-2 xl:col-span-1"
                >
                  <Plus size={16} />
                  Criar do trecho selecionado
                </button>
              </div>
              {flashcardMessage && <p className="mt-3 text-sm text-gray-400">{flashcardMessage}</p>}
            </div>

            {savedSessions.length > 0 && (
              <div className="elan-glass rounded-3xl p-5">
                <h3 className="font-bold">Notas recentes</h3>
                <div className="mt-3 space-y-2">
                  {savedSessions.slice(0, 4).map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => {
                        if (session.videoId) {
                          setActiveVideo({
                            id: session.videoId,
                            title: `YouTube video ${session.videoId}`,
                          });
                        }
                        setActiveCategory(session.category);
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-left text-sm text-gray-300 transition hover:bg-white/5"
                    >
                      <p className="font-semibold text-purple-200">{session.category}</p>
                      <p className="mt-1 line-clamp-2 text-gray-400">{session.note}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        <AIStudyAssistant
          context={`YouTube study page. Category: ${activeCategory}. Video ID: ${activeVideo.id || "none"}. Student notes: ${activeNote.slice(0, 800)}`}
          focus="YouTube-based IELTS and DELF listening, vocabulary, pronunciation, grammar, and study strategy"
        />

        {pendingFlashcard && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm md:items-center">
            <section className="elan-glass w-full max-w-xl rounded-[2rem] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-purple-200">Confirmar flashcard</p>
                  <h2 className="text-xl font-black">Revise antes de salvar</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingFlashcard(null)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10"
                  aria-label="Fechar modal de flashcard"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <label className="block text-sm font-semibold text-purple-200">
                  Frente
                  <input
                    value={pendingFlashcard.front}
                    onChange={(event) => setPendingFlashcard({ ...pendingFlashcard, front: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400"
                  />
                </label>

                <label className="block text-sm font-semibold text-purple-200">
                  Verso
                  <textarea
                    value={pendingFlashcard.back}
                    onChange={(event) => setPendingFlashcard({ ...pendingFlashcard, back: event.target.value })}
                    className="mt-2 h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition focus:border-purple-400"
                  />
                </label>

                <label className="block text-sm font-semibold text-purple-200">
                  Contexto opcional
                  <input
                    value={pendingFlashcard.context}
                    onChange={(event) => setPendingFlashcard({ ...pendingFlashcard, context: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPendingFlashcard(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-200 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmFlashcard}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-500"
                >
                  Salvar flashcard
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
