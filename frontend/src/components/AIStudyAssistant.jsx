import { useState } from "react";
import { Loader2, MessageCircle, Save, Send, X } from "lucide-react";
import lumi from "../assets/lumi.png";
import { askStudyAssistant } from "../services/studyAssistant";
import { createStudyNote } from "../services/notesStorage";

const quickPrompts = [
  "Por que isso e util?",
  "Me de outro exemplo",
  "Como soar mais natural?",
  "Como um Band 7 responderia?",
];

export default function AIStudyAssistant({ context = "", focus = "IELTS and DELF study support" }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Pergunte sobre vocabulario, gramatica, pronuncia, estrutura de escrita ou estrategia IELTS/DELF.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [noteMessage, setNoteMessage] = useState("");

  const ask = async (nextQuestion = question) => {
    const cleanQuestion = nextQuestion.trim();
    if (!cleanQuestion || loading) return;

    setQuestion("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: cleanQuestion }]);

    try {
      const answer = await askStudyAssistant({
        question: cleanQuestion,
        context,
        focus,
      });

      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not reach the AI service right now. Try again when the backend and AI key are available.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveAssistantNote = (content) => {
    createStudyNote({
      title: "Nota da Lumi",
      category: "AI Assistant",
      content,
      source: "ai-assistant",
    });
    setNoteMessage("Resposta salva em Anotacoes.");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-3 rounded-2xl border border-purple-300/30 bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-[0_0_34px_rgba(124,58,237,0.42)] transition hover:scale-[1.02] md:bottom-6"
        aria-label="Open AI study assistant"
      >
        <MessageCircle size={18} />
        Perguntar a Lumi
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm md:items-center">
          <section className="elan-glass w-full max-w-2xl rounded-[2rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={lumi} alt="" className="h-10 w-10 rounded-2xl object-cover" />
                <div>
                  <h2 className="font-black">Lumi Study Assistant</h2>
                  <p className="text-xs text-gray-400">Suporte para IELTS e DELF</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 transition hover:bg-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 max-h-[48vh] space-y-3 overflow-auto pr-1">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`group rounded-2xl border p-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto max-w-[85%] border-purple-300/30 bg-purple-500/15 text-purple-50"
                      : "mr-auto max-w-[92%] border-white/10 bg-black/25 text-gray-200"
                  }`}
                >
                  {message.content}
                  {message.role === "assistant" && index > 0 && (
                    <button
                      type="button"
                      onClick={() => saveAssistantNote(message.content)}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 transition hover:bg-white/10"
                    >
                      <Save size={13} />
                      Salvar como nota
                    </button>
                  )}
                </div>
              ))}
              {loading && (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-gray-300">
                  <Loader2 size={15} className="animate-spin" />
                  Pensando...
                </div>
              )}
            </div>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                ask();
              }}
            >
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400"
                placeholder="Pergunte sobre expressao, estrutura, score ou exemplo..."
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-2xl bg-purple-600 px-4 py-3 text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send question"
              >
                <Send size={18} />
              </button>
            </form>
            {noteMessage && <p className="mt-3 text-sm text-gray-400">{noteMessage}</p>}
          </section>
        </div>
      )}
    </>
  );
}
