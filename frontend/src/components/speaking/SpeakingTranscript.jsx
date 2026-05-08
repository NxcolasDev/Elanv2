export default function SpeakingTranscript({
  finalTranscript,
  transcript,
  listening,
  speechError,
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111318] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-300">Transcrição</p>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            listening
              ? "bg-emerald-500/15 text-emerald-200"
              : "bg-white/5 text-gray-400"
          }`}
        >
          {listening ? "gravando" : "parado"}
        </span>
      </div>

      {speechError && (
        <p className="mb-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {speechError}
        </p>
      )}

      <div className="min-h-[120px] space-y-2 text-sm leading-6">
        <p className="text-orange-200">
          {finalTranscript || "Sua resposta final aparecerá aqui."}
        </p>
        {transcript && <p className="text-gray-500">{transcript}</p>}
      </div>
    </div>
  );
}
