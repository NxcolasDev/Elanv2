const criteria = [
  ["fluency", "Fluência"],
  ["grammar", "Gramática"],
  ["vocabulary", "Vocabulário"],
  ["suggestions", "Sugestões"],
];

export default function SpeakingResult({ result }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-100">
        {result.error}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-purple-400/30 bg-[#111318] p-5">
      <p className="text-sm text-gray-400">Avaliação IA</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-semibold text-white">
          {result.band ?? "-"}
        </span>
        <span className="pb-1 text-sm text-purple-200">IELTS band</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {criteria.map(([key, label]) => (
          <div key={key} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-sm leading-6 text-gray-200">
              {result[key] || "Sem feedback para este critério."}
            </p>
          </div>
        ))}
      </div>

      {result.raw && <p className="mt-4 text-sm text-gray-400">{result.raw}</p>}
    </div>
  );
}
