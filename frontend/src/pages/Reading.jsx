import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BookOpen, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import ExamSwitcher from "../components/ExamSwitcher";
import MainLayout from "../layouts/MainLayout";
import { expandQuestions, readingContent } from "../data/examContent";
import { useActiveExam } from "../hooks/useActiveExam";
import { saveExamResult } from "../utils/examHistory";
import { toIELTSBand } from "../utils/scoring";

const API = "http://localhost:5000/api/exams/generate";

function normalizeQuestion(question, index) {
  if (!question || typeof question !== "object") return null;

  const options = Array.isArray(question.options) ? question.options : [];
  return {
    id: question.id ?? index + 1,
    type: question.type || (options.length > 0 ? "multiple" : "fill_blank"),
    question: question.question || `Question ${index + 1}`,
    options,
    answer: question.answer ?? question.correct ?? "",
  };
}

function normalizeExam(data, localContent) {
  const rawQuestions = Array.isArray(data?.questions) ? data.questions : [];
  const questions = rawQuestions
    .map((question, index) => normalizeQuestion(question, index))
    .filter(Boolean);

  return {
    passage: data?.passage || data?.text || localContent.passage,
    questions: expandQuestions(questions.length ? questions : localContent.questionSeed, 40),
  };
}

function normalizeAnswer(value) {
  return String(value || "").trim().toLowerCase();
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

export default function Reading() {
  const { activeExam, exam: activeExamMeta, isDelf } = useActiveExam();
  const localContent = readingContent[activeExam] || readingContent.IELTS;
  const localExam = useMemo(
    () => ({
      passage: localContent.passage,
      questions: expandQuestions(localContent.questionSeed, 40),
    }),
    [localContent]
  );

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(localContent.duration * 60);

  const questions = useMemo(
    () => (Array.isArray(exam?.questions) ? exam.questions : []),
    [exam]
  );

  const generateExam = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setAnswers({});

    try {
      if (isDelf) {
        setExam(localExam);
        return;
      }

      const response = await axios.post(API, { mode: "reading" }, { timeout: 15000 });
      setExam(normalizeExam(response.data?.data, localContent));
    } catch (err) {
      console.error("Erro ao gerar prova:", err);
      setExam(localExam);
      setError(
        isDelf
          ? "Mode DELF/DALF actif avec banque locale en français."
          : "Usei a banca local porque a geração por IA não respondeu agora."
      );
    } finally {
      setLoading(false);
    }
  }, [isDelf, localExam, localContent]);

  const selectAnswer = (questionId, option) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: option,
    }));
  };

  const evaluate = () => {
    if (!Array.isArray(questions) || questions.length === 0) return;

    const correct = questions.reduce((total, question) => {
      const userAnswer = normalizeAnswer(answers[question.id]);
      const expectedAnswer = normalizeAnswer(question.answer);
      return userAnswer === expectedAnswer ? total + 1 : total;
    }, 0);

    const score = isDelf
      ? Math.round((correct / questions.length) * activeExamMeta.maxScore)
      : toIELTSBand(correct, questions.length);

    const nextResult = { correct, total: questions.length, score };

    setResult(nextResult);
    saveExamResult({
      skill: "Reading",
      exam: activeExam,
      score,
      correct,
      total: questions.length,
      durationMinutes: localContent.duration,
      label: `${activeExamMeta.label} Reading Practice`,
    });
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      generateExam();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeExam, generateExam]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTimeLeft(localContent.duration * 60);
    }, 0);
    const interval = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(interval);
    };
  }, [localContent.duration, activeExam]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-5 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-purple-200">{localContent.description}</p>
              <h1 className="mt-2 text-4xl font-black">{localContent.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                Como funciona esta prova: {localContent.duration} minutos, 40 questões,
                textos acadêmicos ou de compreensão escrita, múltipla escolha, matching,
                verdadeiro/falso e preenchimento.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ExamSwitcher />
              <div className="rounded-2xl border border-purple-300/25 bg-purple-500/10 px-4 py-2 text-center">
                <p className="text-xs text-gray-400">Timer</p>
                <p className="text-lg font-black text-purple-100">{formatTime(timeLeft)}</p>
              </div>
              <button
                onClick={generateExam}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-gray-100 transition hover:bg-white/12"
              >
                <RotateCcw size={16} />
                Nova prova
              </button>
            </div>
          </div>
        </section>

        {loading && (
          <div className="elan-glass flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-gray-300">
            <Loader2 size={16} className="animate-spin" />
            {isDelf ? "Préparation de l'épreuve..." : "Gerando uma prova de Reading..."}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </div>
        )}

        {!exam && !loading ? (
          <div className="elan-glass rounded-3xl p-6 text-gray-300">
            Não foi possível carregar a prova. Tente gerar novamente.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="elan-glass rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-2 text-purple-300">
                <BookOpen size={18} />
                <h2 className="font-semibold">{isDelf ? "Texte" : "Passage"}</h2>
              </div>
              <p className="whitespace-pre-line leading-7 text-gray-300">
                {exam?.passage || localExam.passage}
              </p>
            </section>

            <section className="max-h-[76vh] space-y-4 overflow-auto pr-1">
              {questions.map((question, index) => (
                <div key={question.id} className="elan-glass rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Question {index + 1} · {String(question.type).replaceAll("_", " ")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-100">{question.question}</p>

                  {Array.isArray(question.options) && question.options.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => selectAnswer(question.id, option)}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                            answers[question.id] === option
                              ? "border-purple-400 bg-purple-500/20 text-white"
                              : "border-white/10 bg-black/20 text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      value={answers[question.id] || ""}
                      onChange={(event) => selectAnswer(question.id, event.target.value)}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
                      placeholder={isDelf ? "Votre réponse" : "Type your answer"}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={evaluate}
                disabled={questions.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(124,58,237,0.34)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {isDelf ? "Corriger les réponses" : "Avaliar respostas"}
              </button>

              {result && (
                <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4">
                  <p className="text-sm text-gray-300">Resultado final</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {result.correct}/{result.total} · {activeExamMeta.scoreLabel} {result.score}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
