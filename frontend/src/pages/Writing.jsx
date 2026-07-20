import { useCallback, useEffect, useMemo, useState } from "react";
import ExamSwitcher from "../components/ExamSwitcher";
import AiUnavailableNotice from "../components/AiUnavailableNotice";
import MainLayout from "../layouts/MainLayout";
import { writingContent } from "../data/examContent";
import { useActiveExam } from "../hooks/useActiveExam";
import { saveExamResult } from "../utils/examHistory";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Clock3,
  Sparkles,
  PenLine,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { api, isAiUnavailableError } from "../services/api";

const chartExamples = [
  {
    type: "pie",
    title: "Energy Consumption by Source",
    data: [
      { name: "Oil", value: 42 },
      { name: "Gas", value: 31 },
      { name: "Coal", value: 24 },
      { name: "Renewables", value: 18 },
    ],
  },
  {
    type: "line",
    title: "Population Growth (2000-2020)",
    data: [
      { year: "2000", value: 58 },
      { year: "2005", value: 66 },
      { year: "2010", value: 73 },
      { year: "2015", value: 88 },
      { year: "2020", value: 101 },
    ],
  },
  {
    type: "bar",
    title: "Public Transport Use by Age Group",
    data: [
      { year: "18-24", value: 74 },
      { year: "25-34", value: 62 },
      { year: "35-44", value: 48 },
      { year: "45-54", value: 39 },
      { year: "55+", value: 27 },
    ],
  },
];

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function Writing() {
  const { activeExam, exam: activeExamMeta, isDelf } = useActiveExam();

  const content =
    writingContent[activeExam] || writingContent.IELTS;

  const [task, setTask] = useState("task2");
  const [topics, setTopics] = useState([]);
  const [text, setText] = useState("");
  const [correction, setCorrection] = useState(null);
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timerEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [chartIndex, setChartIndex] = useState(0);

  const chart = chartExamples[chartIndex];

  const minWords = task === "task1" ? 150 : 250;

  const wordCount = useMemo(() => {
    return text.trim()
      ? text.trim().split(/\s+/).length
      : 0;
  }, [text]);

  const progress = Math.min((wordCount / minWords) * 100, 100);

  const loadTopics = useCallback(async () => {
    if (task === "task1") {
      setChartIndex(
        (previousIndex) =>
          (previousIndex + 1) % chartExamples.length
      );

      return;
    }

    try {
      if (isDelf) {
        setTopics(content.topics);
        return;
      }

      const response = await api.post("/api/exams/generate", {
        mode: "topics",
      });

      const nextTopics = Array.isArray(response.data?.topics)
        ? response.data.topics
        : content.topics;

      setTopics(
        nextTopics.length ? nextTopics : content.topics
      );
    } catch (err) {
      console.error(err);
      setTopics(content.topics);
    }
  }, [task, isDelf, content]);

  const handleCorrection = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setAiUnavailable(false);

    try {
      const response = await api.post("/api/exams/generate", {
        mode: "correction",
        text: `
${activeExamMeta.label}
${isDelf ? "French DELF/DALF" : "IELTS English"}

Criteria:
${content.criteria.join(", ")}

Minimum words: ${minWords}

Student answer:
${text}

Return ONLY valid JSON:
{
  "band": number,
  "feedback": "short feedback",
  "strengths": [],
  "improvements": []
}
`,
      });

      const nextCorrection =
        response.data?.correction || response.data;

      setCorrection(nextCorrection);

      if (
        Number.isFinite(Number(nextCorrection?.band))
      ) {
        saveExamResult({
          skill: "Writing",
          exam: activeExam,
          score: Number(nextCorrection.band),
          label: `${activeExamMeta.label} Writing`,
          durationMinutes: task === "task1" ? 20 : 40,
        });
      }
    } catch (err) {
      console.error(err);
      if (isAiUnavailableError(err)) {
        setCorrection(null);
        setAiUnavailable(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadTopics();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTopics]);

  useEffect(() => {
    const duration = task === "task1"
      ? 20 * 60
      : 40 * 60;

    const timeoutId = window.setTimeout(() => {
      setTimeLeft(duration);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [task]);

  useEffect(() => {
    if (!timerEnabled || timeLeft <= 0) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerEnabled]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl text-white space-y-6">

        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                <Sparkles size={15} />
                {isDelf
                  ? "Production écrite"
                  : "IELTS Writing"}
              </div>

              <h1 className="mt-4 text-5xl font-black">
                {content.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
                Timer real, contador de palavras,
                critérios oficiais e correção com IA.
              </p>
            </div>

            <ExamSwitcher />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">

          <button
            onClick={() => setTask("task1")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              task === "task1"
                ? "bg-purple-600"
                : "border border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            {content.task1Label}
          </button>

          <button
            onClick={() => setTask("task2")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              task === "task2"
                ? "bg-purple-600"
                : "border border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            {content.task2Label}
          </button>

          <div className="ml-auto flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Clock3 size={18} className="text-purple-300" />

            <span className="font-semibold text-purple-200">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <section className="elan-glass rounded-3xl p-6">

          {task === "task1" ? (
            <>
              <p className="mb-5 text-sm text-gray-400">
                Analyze o gráfico abaixo:
              </p>

              <div className="h-72 rounded-2xl bg-[#07070c] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  {chart.type === "line" && (
                    <LineChart data={chart.data}>
                      <XAxis dataKey="year" stroke="#777" />
                      <YAxis stroke="#777" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#a855f7"
                      />
                    </LineChart>
                  )}

                  {chart.type === "bar" && (
                    <BarChart data={chart.data}>
                      <XAxis dataKey="year" stroke="#777" />
                      <YAxis stroke="#777" />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#60a5fa"
                      />
                    </BarChart>
                  )}

                  {chart.type === "pie" && (
                    <PieChart>
                      <Pie
                        data={chart.data}
                        dataKey="value"
                        outerRadius={90}
                      >
                        {chart.data.map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              [
                                "#a855f7",
                                "#60a5fa",
                                "#34d399",
                                "#facc15",
                              ][index % 4]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-400">
                Escolha um tema:
              </p>

              <div className="grid gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedTopic === topic
                        ? "border-purple-400 bg-purple-600/30"
                        : "border-white/10 bg-white/5 hover:border-purple-400/50"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="elan-glass rounded-3xl p-6">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Minimum words
              </p>

              <h3 className="text-xl font-bold">
                {wordCount} / {minWords}
              </h3>
            </div>

            {wordCount >= minWords ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 size={18} />
                Meta atingida
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={18} />
                Faltam {minWords - wordCount} palavras
              </div>
            )}
          </div>

          <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <textarea
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            className="h-80 w-full rounded-3xl border border-white/10 bg-[#09090f] p-5 text-sm outline-none transition focus:border-purple-500"
            placeholder={content.placeholder}
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

            <div className="text-sm text-gray-500">
              {text.length} caracteres
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setText("");
                  setCorrection(null);
                  setAiUnavailable(false);
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm hover:bg-white/10"
              >
                Limpar
              </button>

              <button
                onClick={handleCorrection}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-bold shadow-[0_0_30px_rgba(124,58,237,0.4)] transition hover:scale-[1.02]"
              >
                {loading
                  ? "Corrigindo..."
                  : "Corrigir com IA"}
              </button>
            </div>
          </div>
        </section>

        {aiUnavailable && <AiUnavailableNotice />}

        {correction && (
          <section className="elan-glass rounded-3xl p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Resultado
                </p>

                <h2 className="mt-2 text-5xl font-black text-purple-400">
                  Band {correction.band}
                </h2>
              </div>

              <PenLine
                size={42}
                className="text-purple-300"
              />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                <h3 className="mb-3 font-semibold text-green-300">
                  Pontos fortes
                </h3>

                <ul className="space-y-2 text-sm text-gray-300">
                  {(correction.strengths || []).map(
                    (item) => (
                      <li key={item}>• {item}</li>
                    )
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <h3 className="mb-3 font-semibold text-yellow-300">
                  Melhorias
                </h3>

                <ul className="space-y-2 text-sm text-gray-300">
                  {(correction.improvements || []).map(
                    (item) => (
                      <li key={item}>• {item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="mb-3 font-semibold">
                Sua redação
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                {text}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <h3 className="mb-3 font-semibold text-purple-300">
                Feedback IA
              </h3>

              <p className="text-sm leading-7 text-gray-300">
                {correction.feedback}
              </p>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
