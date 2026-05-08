import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ExamSwitcher from "../components/ExamSwitcher";
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

const API = "http://localhost:5000/api/exams/generate";

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
  const content = writingContent[activeExam] || writingContent.IELTS;
  const [task, setTask] = useState("task2");
  const [topics, setTopics] = useState([]);
  const [text, setText] = useState("");
  const [correction, setCorrection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [chartIndex, setChartIndex] = useState(0);

  const chart = chartExamples[chartIndex];

  const loadTopics = useCallback(async () => {
    if (task === "task1") {
      setChartIndex((previousIndex) => (previousIndex + 1) % chartExamples.length);
      setText("");
      setTopics([]);
      setSelectedTopic(null);
      setCorrection(null);
      return;
    }

    try {
      if (isDelf) {
        setTopics(content.topics);
        return;
      }

      const response = await axios.post(API, { mode: "topics" });
      const nextTopics = Array.isArray(response.data?.topics) ? response.data.topics : content.topics;
      setTopics(nextTopics.length ? nextTopics : content.topics);
    } catch (err) {
      console.error(err);
      setTopics(content.topics);
    }
  }, [task, isDelf, content]);

  const handleCorrection = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post(API, {
        mode: "correction",
        text: `${activeExamMeta.label} ${isDelf ? "French DELF/DALF" : "IELTS English"} writing answer. Criteria: ${content.criteria.join(", ")}.\n${text}`,
      });
      const nextCorrection = response.data?.correction || null;
      setCorrection(nextCorrection);

      if (Number.isFinite(Number(nextCorrection?.band))) {
        saveExamResult({
          skill: "Writing",
          exam: activeExam,
          score: Number(nextCorrection.band),
          label: `${activeExamMeta.label} Writing ${task === "task1" ? content.task1Label : content.task2Label}`,
          durationMinutes: task === "task1" ? 20 : 40,
        });
      }
    } catch (err) {
      console.error(err);
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
    const timeoutId = window.setTimeout(() => {
      setTimerEnabled(false);
      setTimeLeft(0);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [task]);

  useEffect(() => {
    if (!timerEnabled) return undefined;

    const duration = task === "task1" ? 20 * 60 : 40 * 60;
    const timeoutId = window.setTimeout(() => {
      setTimeLeft(duration);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [timerEnabled, task]);

  useEffect(() => {
    if (!timerEnabled || timeLeft <= 0) return undefined;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timeLeft, timerEnabled]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <section className="elan-glass elan-glow-card mb-6 rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-purple-200">{content.criteria.join(" · ")}</p>
              <h1 className="mt-2 text-4xl font-black">{content.title}</h1>
              <p className="mt-3 text-sm text-gray-400">
                Como funciona esta prova: timer, contador de palavras, critérios reais e histórico salvo.
              </p>
            </div>
            <ExamSwitcher />
          </div>
        </section>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTimerEnabled(!timerEnabled)}
              className={`rounded-lg px-3 py-2 text-xs ${
                timerEnabled ? "bg-green-600" : "border border-purple-900 bg-[#111318]"
              }`}
            >
              {timerEnabled ? "Timer ON" : "Timer OFF"}
            </button>

            {timerEnabled && (
              <span className="text-sm font-semibold text-purple-400">
                {formatTime(timeLeft)}
              </span>
            )}

            <button
              onClick={loadTopics}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm hover:bg-purple-700"
            >
              Atualizar
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setTask("task1");
              setTimerEnabled(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm ${
              task === "task1" ? "bg-purple-600" : "border border-purple-900 bg-[#111318]"
            }`}
          >
            {content.task1Label}
          </button>

          <button
            onClick={() => {
              setTask("task2");
              setTimerEnabled(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm ${
              task === "task2" ? "bg-purple-600" : "border border-purple-900 bg-[#111318]"
            }`}
          >
            {content.task2Label}
          </button>
        </div>

        <div className="mb-6 rounded-lg border border-purple-900/30 bg-[#111318] p-4">
          {task === "task1" ? (
            <>
              <h2 className="mb-3 text-sm text-gray-400">Descreva o gráfico:</h2>
              <p className="mb-4 text-sm text-gray-300">{chart.title}</p>

              <div className="h-64 w-full rounded-lg bg-black p-4">
                <ResponsiveContainer width="100%" height="100%">
                  {chart.type === "line" && (
                    <LineChart data={chart.data}>
                      <XAxis dataKey="year" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#a855f7" />
                    </LineChart>
                  )}

                  {chart.type === "bar" && (
                    <BarChart data={chart.data}>
                      <XAxis dataKey="year" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#60a5fa" />
                    </BarChart>
                  )}

                  {chart.type === "pie" && (
                    <PieChart>
                      <Pie data={chart.data} dataKey="value" nameKey="name" outerRadius={80}>
                        {chart.data.map((_, index) => (
                          <Cell
                            key={index}
                            fill={["#a855f7", "#60a5fa", "#34d399", "#facc15"][index % 4]}
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
              <h2 className="mb-3 text-sm text-gray-400">Temas sugeridos</h2>
              <div className="flex flex-col gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`rounded-lg border p-3 text-left text-sm transition ${
                      selectedTopic === topic
                        ? "border-purple-400 bg-purple-600"
                        : "border-purple-900 bg-[#0a0a0a] hover:border-purple-500"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {selectedTopic && (
                <div className="mt-4 rounded-lg border border-purple-900 bg-black p-3 text-sm text-gray-300">
                  <strong>Tema escolhido:</strong> {selectedTopic}
                </div>
              )}
            </>
          )}
        </div>

        <div className="rounded-lg border border-purple-900/30 bg-[#111318] p-4">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={task === "task2" && !selectedTopic}
            className="h-56 w-full rounded-lg bg-black p-4 text-sm outline-none disabled:opacity-50"
            placeholder={
              task === "task1"
                ? isDelf ? "Rédigez le document demandé..." : "Describe the chart..."
                : selectedTopic
                  ? content.placeholder
                  : isDelf ? "Choisissez un sujet ci-dessus..." : "Escolha um tema acima primeiro..."
            }
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              {text.trim() ? text.trim().split(/\s+/).length : 0} words · {text.length} caracteres
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCorrection}
                disabled={task === "task2" && !selectedTopic}
                className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold hover:bg-purple-500 disabled:opacity-50"
              >
                {loading ? "Corrigindo..." : "Corrigir com IA"}
              </button>

              <button
                onClick={() => {
                  setText("");
                  setCorrection(null);
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {correction && (
          <div className="mt-6 rounded-lg border border-purple-900/30 bg-[#111318] p-5">
            <h2 className="text-xl font-bold text-purple-400">Band: {correction.band}</h2>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">Correções</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {(Array.isArray(correction.corrections) ? correction.corrections : []).map(
                  (item) => (
                    <li key={item}>• {item}</li>
                  )
                )}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">Versão melhorada</h3>
              <p className="text-sm text-gray-300">{correction.improvedText}</p>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">Feedback</h3>
              <p className="text-sm text-gray-300">{correction.feedback}</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
