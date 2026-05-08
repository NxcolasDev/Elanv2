import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MainLayout from "../layouts/MainLayout";
import { getExamBreakdown, getExamHistory, getHistoryStats } from "../utils/examHistory";

export default function History() {
  const history = getExamHistory();
  const stats = getHistoryStats(history);
  const breakdown = getExamBreakdown(history);

  return (
    <MainLayout>
      <div className="space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <p className="text-sm text-purple-200">Resultados salvos</p>
          <h1 className="mt-2 text-4xl font-black">Histórico real</h1>
          <p className="mt-3 text-gray-400">
            Todas as tentativas salvas por Reading, Listening, Writing, Speaking e simulados.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Tentativas", stats.total],
            ["Média", stats.average || "-"],
            ["Melhor", stats.best || "-"],
            ["Streak", `${stats.streak} dias`],
          ].map(([label, value]) => (
            <div key={label} className="elan-glass rounded-3xl p-5">
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-3 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="elan-glass rounded-3xl p-6">
            <h2 className="text-xl font-bold">Média por habilidade</h2>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown}>
                  <XAxis dataKey="skill" stroke="#8b8b9a" />
                  <YAxis stroke="#8b8b9a" />
                  <Tooltip contentStyle={{ background: "#111318", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }} />
                  <Bar dataKey="average" fill="#a855f7" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="elan-glass rounded-3xl p-6">
            <h2 className="text-xl font-bold">Linha do tempo</h2>
            <div className="mt-5 space-y-3">
              {history.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-400">
                  Nenhum resultado salvo ainda.
                </p>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{item.label || item.skill}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <p className="text-lg font-black text-purple-200">{item.score}</p>
                    </div>
                    {item.correct !== undefined && item.total !== undefined && (
                      <p className="mt-2 text-sm text-gray-400">
                        Acertos: {item.correct}/{item.total}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
