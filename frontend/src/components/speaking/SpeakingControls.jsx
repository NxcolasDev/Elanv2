import {
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function SpeakingControls({
  listening,
  onStart,
  onStop,
  onClear,
  onEvaluate,
  onNext,
}) {
  return (
    <div className="elan-glass elan-glow-card rounded-[2rem] border border-white/10 p-5">
      <div className="flex flex-wrap gap-3">
        {!listening ? (
          <button
            onClick={onStart}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 font-semibold text-white shadow-[0_0_40px_rgba(124,58,237,0.45)] transition duration-300 hover:scale-[1.03]"
          >
            <Mic
              size={18}
              className="transition group-hover:scale-110"
            />
            Falar
          </button>
        ) : (
          <button
            onClick={onStop}
            className="group flex items-center gap-2 rounded-2xl bg-red-500/90 px-5 py-3 font-semibold text-white shadow-[0_0_35px_rgba(239,68,68,0.45)] transition duration-300 hover:scale-[1.03]"
          >
            <MicOff
              size={18}
              className="transition group-hover:scale-110"
            />
            Parar
          </button>
        )}

        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-gray-200 transition hover:bg-white/10"
        >
          <RotateCcw size={18} />
          Limpar
        </button>

        <button
          onClick={onEvaluate}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-500 px-5 py-3 font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition duration-300 hover:scale-[1.03]"
        >
          <Sparkles size={18} />
          Avaliar IA
        </button>

        <button
          onClick={onNext}
          className="ml-auto flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 font-semibold text-blue-100 transition hover:bg-blue-500/20"
        >
          Próxima etapa
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}