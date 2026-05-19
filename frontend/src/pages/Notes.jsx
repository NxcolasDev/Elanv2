import { useMemo, useState } from "react";
import { NotebookPen, Plus, Save, Trash2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import {
  createStudyNote,
  deleteStudyNote,
  getStudyNotes,
  updateStudyNote,
} from "../services/notesStorage";

export default function Notes() {
  const [notes, setNotes] = useState(() => getStudyNotes());
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || "");
  const [draft, setDraft] = useState({
    title: "",
    category: "Geral",
    content: "",
  });

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  const createNote = () => {
    const nextNotes = createStudyNote({
      title: draft.title || "Nova anotacao",
      category: draft.category,
      content: draft.content,
    });

    setNotes(nextNotes);
    setActiveNoteId(nextNotes[0]?.id || "");
    setDraft({ title: "", category: "Geral", content: "" });
  };

  const saveActiveNote = () => {
    if (!activeNote) return;

    const nextNotes = updateStudyNote(activeNote.id, activeNote);
    setNotes(nextNotes);
  };

  const patchActiveNote = (updates) => {
    if (!activeNote) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === activeNote.id
          ? {
              ...note,
              ...updates,
            }
          : note
      )
    );
  };

  const removeNote = (noteId) => {
    const nextNotes = deleteStudyNote(noteId);
    setNotes(nextNotes);

    if (activeNoteId === noteId) {
      setActiveNoteId(nextNotes[0]?.id || "");
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm text-purple-200">Organizacao de estudo</p>
              <h1 className="mt-2 text-4xl font-black">Anotacoes</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                Crie blocos independentes para vocabulario, erros comuns, ideias de aula, sessoes do YouTube e respostas da Lumi.
              </p>
            </div>
            <div className="rounded-2xl border border-purple-300/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-100">
              {notes.length} notas
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <div className="elan-glass rounded-3xl p-5">
              <h2 className="font-bold">Nova nota</h2>
              <div className="mt-4 space-y-3">
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  placeholder="Titulo"
                />
                <input
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  placeholder="Categoria"
                />
                <textarea
                  value={draft.content}
                  onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                  className="h-28 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-purple-400"
                  placeholder="Conteudo"
                />
                <button
                  type="button"
                  onClick={createNote}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold transition hover:bg-purple-500"
                >
                  <Plus size={16} />
                  Criar nota
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              {notes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setActiveNoteId(note.id)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    activeNote?.id === note.id
                      ? "border-purple-300/45 bg-purple-500/15"
                      : "border-white/10 bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide text-purple-200">{note.category}</p>
                  <h3 className="mt-2 font-bold">{note.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-400">{note.content || "Sem conteudo"}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-5">
            {activeNote ? (
              <section className="elan-glass rounded-[2rem] p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <NotebookPen className="text-purple-300" size={26} />
                    <div>
                      <p className="text-sm text-gray-400">
                        Criada em {new Date(activeNote.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <h2 className="text-2xl font-black">Editar nota</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveActiveNote}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold transition hover:bg-purple-500"
                    >
                      <Save size={16} />
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNote(activeNote.id)}
                      className="rounded-xl border border-red-400/30 bg-red-500/10 p-2 text-red-100 transition hover:bg-red-500/20"
                      aria-label="Deletar nota"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={activeNote.title}
                    onChange={(event) => patchActiveNote({ title: event.target.value })}
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                    placeholder="Titulo"
                  />
                  <input
                    value={activeNote.category}
                    onChange={(event) => patchActiveNote({ category: event.target.value })}
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                    placeholder="Categoria"
                  />
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={(event) => patchActiveNote({ content: event.target.value })}
                  className="mt-4 min-h-[420px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 outline-none focus:border-purple-400"
                  placeholder="Escreva sua anotacao..."
                />
              </section>
            ) : (
              <section className="elan-glass rounded-[2rem] p-8 text-center text-gray-400">
                Crie uma nota para comecar seu caderno de estudos.
              </section>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
