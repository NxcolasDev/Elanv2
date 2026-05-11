import { useEffect, useState } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ExamSwitcher from "../components/ExamSwitcher";
import MainLayout from "../layouts/MainLayout";
import logo from "../assets/logo.png";
import { exams } from "../data/exams";
import { useActiveExam } from "../hooks/useActiveExam";
import { useAuth } from "../hooks/useAuth";
import {
  getExamBreakdown,
  getExamFilteredHistory,
  getHistoryStats,
} from "../utils/examHistory";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { activeExam } = useActiveExam();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const exam = exams[activeExam] || exams.IELTS;
  useEffect(() => {
  const filtered = getExamFilteredHistory(activeExam);

  setHistory(filtered);
}, [activeExam]);
  const stats = getHistoryStats(history);
  const skillData = getExamBreakdown(history);
  const chartData = history
    .slice(0, 10)
    .reverse()
    .map((item, index) => ({
      name: `${index + 1}`,
      score: Number(item.score) || 0,
      skill: item.skill,
    }));

  const fallbackChart = [
    { name: "S1", score: 4.5 },
    { name: "S2", score: 5.2 },
    { name: "S3", score: 5.8 },
    { name: "S4", score: 6.4 },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid") || authUser?.uid;

    if (!uid) {
      const timeoutId = window.setTimeout(() => {
        setUser(null);
        setLoading(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const loadUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${uid}`);
        setUser(response.data);
      } catch {
        setUser({
          name: authUser?.displayName || "Estudante ELAN",
          photoURL: authUser?.photoURL,
          ielts: {},
          delf: {},
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [authUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070710] text-white">
        Carregando ELAN...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070710] text-red-300">
        Usuário não encontrado
      </div>
    );
  }

  const progress = Math.min(100, Math.round((stats.average / exam.maxScore) * 100)) || 0;

  return (
    <MainLayout>
      <div className="space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="ELAN" className="h-12 w-12 drop-shadow-[0_0_22px_rgba(168,85,247,0.55)]" />
              <div>
                <p className="text-sm text-purple-200">Bem-vindo de volta</p>
                <h1 className="text-3xl font-black">{user.name || "Estudante ELAN"}</h1>
                <p className="text-sm text-gray-400">Seu painel premium de preparação {exam.label}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ExamSwitcher />
              <button
                onClick={() => navigate("/simulado")}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold shadow-[0_0_34px_rgba(124,58,237,0.38)] hover:scale-[1.02]"
              >
                Simulado completo
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Média", stats.average ? `${stats.average}` : "-", exam.scoreLabel],
            ["Melhor score", stats.best ? `${stats.best}` : "-", "recorde"],
            ["Sessões", stats.total, "histórico real"],
            ["Streak", `${stats.streak} dias`, "consistência"],
            ["Tempo", `${stats.studyMinutes} min`, "estimado"],
          ].map(([label, value, hint]) => (
            <div key={label} className="elan-glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-purple-300/35">
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-3 text-3xl font-black">{value}</p>
              <p className="mt-1 text-xs text-purple-200/80">{hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="elan-glass rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Evolução</p>
                <h2 className="text-xl font-bold">Score ao longo das tentativas</h2>
              </div>
              <Flame className="text-purple-300" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.length ? chartData : fallbackChart}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8b8b9a" />
                <YAxis stroke="#8b8b9a" domain={[0, exam.maxScore]} />
                <Tooltip contentStyle={{ background: "#111318", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }} />
                <Area type="monotone" dataKey="score" fill="url(#scoreGlow)" stroke="#a855f7" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="elan-glass rounded-3xl p-6">
            <p className="text-sm text-gray-400">Progresso geral</p>
            <h2 className="mt-1 text-xl font-bold">{progress}% do objetivo</h2>
            <div className="mt-6 h-4 rounded-full bg-black/40 p-1">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 shadow-[0_0_24px_rgba(124,58,237,0.56)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-8">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={skillData}>
                  <XAxis dataKey="skill" stroke="#8b8b9a" />
                  <YAxis stroke="#8b8b9a" />
                  <Tooltip contentStyle={{ background: "#111318", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }} />
                  <Bar dataKey="average" fill="#60a5fa" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="elan-glass rounded-3xl p-6">
            <h2 className="text-xl font-bold">Trilhas ativas</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {["IELTS", "DELF"].map((examId) => {
                const item = exams[examId];
                return (
                  <div key={examId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <img src={item.flag} alt={item.language} className="mb-4 h-9 w-9 rounded-full object-cover" />
                    <p className="font-bold">{item.label}</p>
                    <p className="mt-1 text-sm text-gray-400">{item.sections.slice(0, 4).join(" · ")}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="elan-glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Histórico recente</h2>
              <Link to="/history" className="text-sm text-purple-200 hover:text-white">Ver tudo</Link>
            </div>
            <div className="mt-5 space-y-3">
              {history.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                  Nenhum resultado salvo ainda. Complete um treino para gerar dados reais.
                </p>
              ) : (
                history.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">{item.label || item.skill}</p>
                      <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <p className="font-bold text-purple-200">{exam.scoreLabel} {item.score}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["/reading", "Reading", "Passages e questões"],
            ["/listening", "Listening", "TTS e repetição limitada"],
            ["/writing", "Writing", "Correção IA"],
            ["/speaking", "Speaking", "Transcrição + feedback"],
          ].map(([to, title, text]) => (
            <Link key={to} to={to} className="elan-glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-purple-300/35">
              <p className="font-bold">{title}</p>
              <p className="mt-2 text-sm text-gray-400">{text}</p>
            </Link>
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
