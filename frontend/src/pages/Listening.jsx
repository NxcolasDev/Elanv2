import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Headphones, Play, RotateCcw } from "lucide-react";
import ExamSwitcher from "../components/ExamSwitcher";
import MainLayout from "../layouts/MainLayout";
import { listeningContent } from "../data/examContent";
import { useActiveExam } from "../hooks/useActiveExam";
import { saveExamResult } from "../utils/examHistory";
import { toIELTSBand } from "../utils/scoring";

import { getPublishedContent } from "../services/api";

const maxPlays = 2;

function buildSections(content) {
  const baseSections = Array.isArray(content.sections) ? content.sections : [];

  return Array.from({ length: 4 }, (_, sectionIndex) => {
    const sourceSection = baseSections[sectionIndex % baseSections.length];
    const seed = Array.isArray(sourceSection.seed) ? sourceSection.seed : [];

    return {
      id: sectionIndex + 1,
      title: sourceSection.title || `Section ${sectionIndex + 1}`,
      script: sourceSection.script,
      questions: Array.from({ length: 10 }, (_, questionIndex) => {
        const source = seed[questionIndex % seed.length];
        const id = sectionIndex * 10 + questionIndex + 1;
        return {
          id,
          question: `${source[0]} (${id})`,
          options: source[1],
          answer: source[2],
        };
      }),
    };
  });
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

export default function Listening() {
  const { activeExam } = useActiveExam();
  return <ListeningPractice key={activeExam} />;
}

function ListeningPractice() {
  const { activeExam, exam: activeExamMeta, isDelf } = useActiveExam();
  const content = listeningContent[activeExam] || listeningContent.IELTS;
  const [published, setPublished] = useState(null);
  const [usePublished, setUsePublished] = useState(false);
  const listeningSections = useMemo(() => {
    if (!usePublished || !published) return buildSections(content);
    return published.sections.map((section, index) => ({
      ...section, id: index + 1,
      questions: section.questions.map((question) => ({ ...question, answer: question.correct })),
    }));
  }, [content, published, usePublished]);
  useEffect(() => {
    const controller = new AbortController();
    getPublishedContent(activeExam, "listening", controller.signal)
      .then((items) => setPublished(items[0]?.payload || null))
      .catch(() => {});
    return () => { controller.abort(); window.speechSynthesis?.cancel(); };
  }, [activeExam]);

  const [started, setStarted] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [playCounts, setPlayCounts] = useState({});
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(content.duration * 60);

  const currentSection = listeningSections[sectionIndex];
  const questions = Array.isArray(currentSection?.questions) ? currentSection.questions : [];

  const totalQuestions = useMemo(
    () =>
      listeningSections.reduce(
        (total, section) => total + (Array.isArray(section.questions) ? section.questions.length : 0),
        0
      ),
    [listeningSections]
  );

  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const playsUsed = playCounts[currentSection?.id] || 0;

  const speakSection = () => {
    if (!currentSection || playsUsed >= maxPlays || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSection.script);

const voices = window.speechSynthesis.getVoices();

const preferredVoice = voices.find((voice) =>
  isDelf
    ? voice.lang.includes("fr")
    : voice.lang.includes("en")
);

if (preferredVoice) {
  utterance.voice = preferredVoice;
}

utterance.lang = content.lang;
utterance.rate = isDelf ? 0.82 : 0.87;
utterance.pitch = 1;
utterance.volume = 1;

    setPlayCounts((previousCounts) => ({
      ...previousCounts,
      [currentSection.id]: playsUsed + 1,
    }));
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!started || result) return;
    const interval = window.setInterval(() => setTimeLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [started, result]);

  const startTest = () => {
    setStarted(true);
    setTimeLeft(content.duration * 60);
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: option,
    }));
  };

  const calculateResult = () => {
    const allQuestions = listeningSections.flatMap((section) =>
      Array.isArray(section.questions) ? section.questions : []
    );

    const correct = allQuestions.reduce(
      (total, question) => (answers[question.id] === question.answer ? total + 1 : total),
      0
    );
    const score = isDelf
      ? Math.round((correct / allQuestions.length) * activeExamMeta.maxScore)
      : toIELTSBand(correct, allQuestions.length);
    const nextResult = { correct, total: allQuestions.length, score };

    setResult(nextResult);
    saveExamResult({
      skill: "Listening",
      exam: activeExam,
      score,
      correct,
      total: allQuestions.length,
      durationMinutes: content.duration,
      label: `${activeExamMeta.label} Listening Practice`,
    });
  };

  const nextSection = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);

    if (sectionIndex < listeningSections.length - 1) {
      setSectionIndex((previousIndex) => previousIndex + 1);
      return;
    }

    calculateResult();
  };

  const resetTest = () => {
    window.speechSynthesis?.cancel();
    setStarted(false);
    setSectionIndex(0);
    setPlayCounts({});
    setAnswers({});
    setResult(null);
    setPlaying(false);
    setTimeLeft(content.duration * 60);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-5 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-purple-200">
                {content.duration} minutos · 4 sections · 40 questões · máximo 2 repetições
              </p>
              <h1 className="mt-2 text-4xl font-black">{content.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                Como funciona esta prova: escute cada documento, responda às perguntas
                sincronizadas e finalize para salvar o score no histórico.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ExamSwitcher />
              {published && !started && (
                <label className="flex items-center gap-2 text-sm text-purple-100">
                  <input type="checkbox" checked={usePublished} onChange={(event) => setUsePublished(event.target.checked)} />
                  Usar exercício publicado
                </label>
              )}
              <div className="rounded-2xl border border-purple-300/25 bg-purple-500/10 px-4 py-2 text-center">
                <p className="text-xs text-gray-400">Timer</p>
                <p className="text-lg font-black text-purple-100">{formatTime(timeLeft)}</p>
              </div>
              <button
                onClick={resetTest}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-gray-100 transition hover:bg-white/12"
              >
                <RotateCcw size={16} />
                Reiniciar
              </button>
            </div>
          </div>
        </section>

        <div className="elan-glass rounded-3xl p-5">
          <div className="mb-3 flex items-center justify-between text-sm text-gray-400">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-black/40 p-1">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!started ? (
          <button
            onClick={startTest}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(124,58,237,0.34)] transition hover:scale-[1.01]"
          >
            <Headphones size={18} />
            {isDelf ? "Commencer l'épreuve" : "Start test"}
          </button>
        ) : (
          <>
            <section className="elan-glass rounded-3xl p-5">
              <p className="text-sm text-gray-400">
                {currentSection.title} · {maxPlays - playsUsed} repetições restantes
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={speakSection}
                  disabled={playsUsed >= maxPlays || playing}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play size={16} />
                  {playing ? "Tocando..." : "Play audio"}
                </button>
                <span className="text-sm text-gray-500">
                  {isDelf ? "Audio en français." : "Audio in English."}
                </span>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {questions.map((question, index) => (
                <div key={question.id} className="elan-glass rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Question {sectionIndex * 10 + index + 1}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-100">{question.question}</p>

                  <div className="mt-3 space-y-2">
                    {Array.isArray(question.options) &&
                      question.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(question.id, option)}
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
                </div>
              ))}
            </section>

            <button
              onClick={nextSection}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              <CheckCircle2 size={18} />
              {sectionIndex < listeningSections.length - 1
                ? isDelf ? "Document suivant" : "Next section"
                : isDelf ? "Terminer" : "Finish test"}
            </button>

            {result && (
              <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4">
                <p className="text-sm text-gray-300">Final score</p>
                <p className="mt-1 text-2xl font-black text-white">
                  {result.correct}/{result.total} · {activeExamMeta.scoreLabel} {result.score}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
