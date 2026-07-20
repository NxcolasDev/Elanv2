
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import AiUnavailableNotice from "../AiUnavailableNotice";

export default function SpeakingResult({ result }) {
  if (!result) return null;

  if (result.aiUnavailable) {
    return <AiUnavailableNotice />;
  }

  if (result.error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle size={18} />
          {result.error}
        </div>
      </div>
    );
  }

  const band = Number(result.band || 0);

  return (
    <div className="elan-glass elan-glow-card rounded-[2rem] border border-white/10 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
            AI Evaluation
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Resultado da avaliação
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-gray-400">
            A IA avaliou sua fluência, coerência, gramática e vocabulário
            seguindo critérios similares aos exames oficiais.
          </p>
        </div>

        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-purple-400/20 bg-gradient-to-br from-purple-600/30 to-blue-500/20 shadow-[0_0_60px_rgba(124,58,237,0.35)]">
          <span className="text-sm uppercase tracking-[0.2em] text-purple-200">
            Band
          </span>

          <span className="mt-2 text-6xl font-black text-white">
            {band || "-"}
          </span>
        </div>
      </div>

      {Array.isArray(result.corrections) &&
        result.corrections.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-300" />

              <h3 className="text-lg font-bold text-white">
                Principais observações
              </h3>
            </div>

            <div className="grid gap-3">
              {result.corrections.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 text-purple-300"
                    />

                    <p className="text-sm leading-7 text-gray-200">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {result.feedback && (
        <div className="mt-8 rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-300" />

            <h3 className="font-bold text-white">
              Feedback geral
            </h3>
          </div>

          <p className="leading-7 text-gray-200">
            {result.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
