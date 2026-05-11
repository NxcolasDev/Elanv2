import { AlertCircle, Mic, Waves } from "lucide-react";

export default function SpeakingTranscript({
  finalTranscript,
  transcript,
  listening,
  speechError,
}) {
  return (
    <div className="elan-glass elan-glow-card rounded-[2rem] border border-white/10 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
            Speech transcript
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Sua resposta
          </h2>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            listening
              ? "bg-red-500/20 text-red-200 shadow-[0_0_25px_rgba(239,68,68,0.35)]"
              : "bg-white/5 text-gray-300"
          }`}
        >
          {listening ? (
            <>
              <Waves className="animate-pulse" size={16} />
              Ouvindo...
            </>
          ) : (
            <>
              <Mic size={16} />
              Inativo
            </>
          )}
        </div>
      </div>

      {speechError && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle size={16} />
          {speechError}
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Transcrição final
          </p>

          <p className="min-h-[120px] whitespace-pre-wrap text-[15px] leading-7 text-gray-100">
            {finalTranscript || (
              <span className="text-gray-500">
                Sua resposta final aparecerá aqui...
              </span>
            )}
          </p>
        </div>

        {listening && transcript && (
          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
              Capturando em tempo real
            </p>

            <p className="italic leading-7 text-purple-100">
              {transcript}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}