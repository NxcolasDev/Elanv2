import { useState } from "react";
import { CheckCircle2, Headphones, Mic, PenLine, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import ExamSwitcher from "../components/ExamSwitcher";
import MainLayout from "../layouts/MainLayout";
import { exams, getStoredExam } from "../data/exams";
import { saveExamResult } from "../utils/examHistory";

const steps = [
  { skill: "Reading", path: "/reading", icon: BookOpen, minutes: 60 },
  { skill: "Listening", path: "/listening", icon: Headphones, minutes: 30 },
  { skill: "Writing", path: "/writing", icon: PenLine, minutes: 60 },
  { skill: "Speaking", path: "/speaking", icon: Mic, minutes: 15 },
];

export default function Simulado() {
  const [activeExam] = useState(getStoredExam);
  const [completed, setCompleted] = useState({});
  const [finalResult, setFinalResult] = useState(null);
  const exam = exams[activeExam] || exams.IELTS;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const finishSimulation = () => {
    const score = completedCount === steps.length ? exam.maxScore : Number(((completedCount / steps.length) * exam.maxScore).toFixed(1));
    const result = saveExamResult({
      skill: "Simulado",
      type: "Simulado",
      score,
      correct: completedCount,
      total: steps.length,
      durationMinutes: steps.reduce((total, step) => total + step.minutes, 0),
      label: `Simulado Completo ${exam.label}`,
    });
    setFinalResult(result);
  };

  return (
    <MainLayout>
      <div className="space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-purple-200">Fluxo completo</p>
              <h1 className="mt-2 text-4xl font-black">Simulado Completo</h1>
              <p className="mt-3 max-w-2xl text-gray-400">
                Faça as quatro etapas em sequência e salve um resultado final no histórico.
              </p>
            </div>
            <ExamSwitcher />
          </div>
        </section>

        <section className="elan-glass rounded-3xl p-6">
          <div className="mb-3 flex items-center justify-between text-sm text-gray-400">
            <span>Progresso do simulado</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 rounded-full bg-black/40 p-1">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 shadow-[0_0_24px_rgba(124,58,237,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(({ skill, path, icon: Icon, minutes }, index) => (
            <div key={skill} className="elan-glass rounded-3xl p-5 transition hover:-translate-y-1">
              <div className="mb-5 flex items-center justify-between">
                <Icon className="text-purple-300" size={26} />
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-gray-300">
                  {minutes} min
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Etapa {index + 1}</p>
              <h2 className="mt-2 text-xl font-bold">{skill}</h2>
              <p className="mt-2 text-sm text-gray-400">
                {activeExam === "IELTS" ? "Formato IELTS" : "Formato DELF/DALF adaptado"}
              </p>
              <div className="mt-5 flex gap-2">
                <Link to={path} className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold hover:bg-purple-500">
                  Abrir
                </Link>
                <button
                  onClick={() => setCompleted((prev) => ({ ...prev, [skill]: !prev[skill] }))}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    completed[skill]
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : "border-white/10 bg-white/5 text-gray-300"
                  }`}
                >
                  {completed[skill] ? "Feito" : "Marcar"}
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="elan-glass rounded-3xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Finalizar e salvar</h2>
              <p className="mt-2 text-sm text-gray-400">
                O resultado usa as etapas concluídas agora. Na próxima fase, cada seção enviará score detalhado automaticamente.
              </p>
            </div>
            <button
              onClick={finishSimulation}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold shadow-[0_0_30px_rgba(124,58,237,0.36)]"
            >
              <CheckCircle2 size={18} />
              Salvar simulado
            </button>
          </div>

          {finalResult && (
            <div className="mt-5 rounded-2xl border border-purple-300/25 bg-purple-500/10 p-4">
              <p className="text-sm text-gray-300">Resultado salvo</p>
              <p className="mt-1 text-2xl font-black">
                {exam.scoreLabel} {finalResult.score}
              </p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
