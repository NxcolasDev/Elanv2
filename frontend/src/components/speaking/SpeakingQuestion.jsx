import { Volume2 } from "lucide-react";

export default function SpeakingQuestion({
  currentPart,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onSpeak,
}) {
  if (!currentQuestion) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#111318] p-5 text-gray-400">
        Escolha um modo para gerar perguntas de Speaking.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#111318] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Part {currentPart} · Question {currentQuestionIndex + 1}/{totalQuestions}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">{currentQuestion}</h2>
        </div>

        <button
          onClick={() => onSpeak(currentQuestion)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-200 transition hover:bg-white/10"
          title="Read question aloud"
        >
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
}
