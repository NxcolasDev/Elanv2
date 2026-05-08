import { Mic, Square, Trash2 } from "lucide-react";

export default function SpeakingControls({
  listening,
  onStart,
  onStop,
  onClear,
  onEvaluate,
  onNext,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onStart}
        disabled={listening}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mic size={16} />
        Falar
      </button>

      <button
        onClick={onStop}
        disabled={!listening}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Square size={16} />
        Parar
      </button>

      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-100 transition hover:bg-white/10"
      >
        <Trash2 size={16} />
        Limpar
      </button>

      <button
        onClick={onEvaluate}
        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
      >
        Avaliar
      </button>

      <button
        onClick={onNext}
        className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20"
      >
        Próxima etapa
      </button>
    </div>
  );
}
