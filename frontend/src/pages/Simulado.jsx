import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Headphones, Mic, PenLine, Play, RotateCcw } from "lucide-react";
import ExamSwitcher from "../components/ExamSwitcher";
import MainLayout from "../layouts/MainLayout";
import { listeningContent, readingContent, speakingBanks, writingContent } from "../data/examContent";
import { useActiveExam } from "../hooks/useActiveExam";
import { saveExamResult } from "../utils/examHistory";
import { toIELTSBand } from "../utils/scoring";

const sectionIcons = {
  Reading: BookOpen,
  Listening: Headphones,
  Writing: PenLine,
  Speaking: Mic,
};

function normalizeAnswer(value) {
  return String(value || "").trim().toLowerCase();
}

function formatTime(minutes) {
  return `${minutes} min`;
}

function buildExamSections(activeExam) {
  const reading = readingContent[activeExam] || readingContent.IELTS;
  const listening = listeningContent[activeExam] || listeningContent.IELTS;
  const writing = writingContent[activeExam] || writingContent.IELTS;
  const speaking = speakingBanks[activeExam] || speakingBanks.IELTS;

  const readingQuestions = reading.questionSeed.slice(0, 8).map((question, index) => ({
    ...question,
    id: `reading-${index}`,
  }));

  const listeningQuestions = (listening.sections || []).flatMap((section, sectionIndex) =>
    (section.seed || []).slice(0, 2).map((item, questionIndex) => ({
      id: `listening-${sectionIndex}-${questionIndex}`,
      section: section.title,
      question: item[0],
      options: item[1],
      answer: item[2],
    }))
  );

  return [
    {
      id: "reading",
      skill: "Reading",
      title: reading.title,
      duration: reading.duration,
      type: "quiz",
      passage: reading.passage,
      questions: readingQuestions,
    },
    {
      id: "listening",
      skill: "Listening",
      title: listening.title,
      duration: listening.duration,
      type: "quiz",
      passage: (listening.sections || []).map((section) => `${section.title}\n${section.script}`).join("\n\n"),
      questions: listeningQuestions,
    },
    {
      id: "writing",
      skill: "Writing",
      title: writing.title,
      duration: activeExam === "IELTS" ? 60 : 45,
      type: "writing",
      prompt: writing.topics?.[0] || "Write a structured exam response.",
      minWords: activeExam === "IELTS" ? 250 : 180,
    },
    {
      id: "speaking",
      skill: "Speaking",
      title: speaking.title,
      duration: 15,
      type: "speaking",
      questions: [
        ...(speaking.parts?.[1]?.[0] || []),
        speaking.parts?.[2]?.[0],
        ...(speaking.parts?.[3]?.[0] || []),
      ].filter(Boolean),
    },
  ];
}

export default function Simulado() {
  const { activeExam } = useActiveExam();
  return <Simulation key={activeExam} />;
}

function Simulation() {
  const { activeExam, exam } = useActiveExam();
  const sections = useMemo(() => buildExamSections(activeExam), [activeExam]);
  const [started, setStarted] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sectionResults, setSectionResults] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  const currentSection = sections[sectionIndex];
  const progress = Math.round((sectionIndex / sections.length) * 100);

  const scoreQuiz = (section) => {
    const correct = section.questions.reduce(
      (total, question) =>
        normalizeAnswer(answers[question.id]) === normalizeAnswer(question.answer)
          ? total + 1
          : total,
      0
    );

    const score =
      activeExam === "IELTS"
        ? toIELTSBand(correct, section.questions.length)
        : Math.round((correct / section.questions.length) * exam.maxScore);

    return { correct, total: section.questions.length, score };
  };

  const scoreTextSection = (section) => {
    const text = answers[section.id] || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const completion = Math.min(1, words / (section.minWords || 90));
    const score =
      activeExam === "IELTS"
        ? Number(Math.max(4, completion * 8).toFixed(1))
        : Math.round(completion * exam.maxScore);

    return { words, score };
  };

  const finishSection = () => {
    const result =
      currentSection.type === "quiz"
        ? scoreQuiz(currentSection)
        : scoreTextSection(currentSection);

    const nextResults = [
      ...sectionResults,
      {
        skill: currentSection.skill,
        durationMinutes: currentSection.duration,
        ...result,
      },
    ];

    setSectionResults(nextResults);

    if (sectionIndex < sections.length - 1) {
      setSectionIndex((index) => index + 1);
      return;
    }

    const overallScore = Number(
      (
        nextResults.reduce((total, item) => total + Number(item.score || 0), 0) /
        nextResults.length
      ).toFixed(1)
    );

    const saved = saveExamResult({
      skill: "Simulado",
      type: "Full Mock Exam",
      exam: activeExam,
      score: overallScore,
      durationMinutes: sections.reduce((total, section) => total + section.duration, 0),
      label: `Full Mock Exam ${exam.label}`,
      sections: nextResults,
    });

    setFinalResult(saved);
    setSectionIndex(sections.length);
  };

  const resetExam = () => {
    setStarted(false);
    setSectionIndex(0);
    setAnswers({});
    setSectionResults([]);
    setFinalResult(null);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-purple-200">Full Mock Exam</p>
              <h1 className="mt-2 text-4xl font-black">Simulado completo {exam.label}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
                Fluxo completo com Reading, Listening, Writing e Speaking em ordem de prova, tempos separados e resumo final salvo no historico.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ExamSwitcher />
              <button
                type="button"
                onClick={resetExam}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10"
              >
                <RotateCcw size={16} />
                Reiniciar
              </button>
            </div>
          </div>
        </section>

        {!started ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {sections.map((section, index) => {
                const Icon = sectionIcons[section.skill];
                return (
                  <div key={section.id} className="elan-glass rounded-3xl p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <Icon className="text-purple-300" size={26} />
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-gray-300">
                        {formatTime(section.duration)}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Etapa {index + 1}</p>
                    <h2 className="mt-2 text-xl font-bold">{section.skill}</h2>
                    <p className="mt-2 text-sm text-gray-400">{section.title}</p>
                  </div>
                );
              })}
            </section>

            <button
              type="button"
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold shadow-[0_0_30px_rgba(124,58,237,0.36)] transition hover:scale-[1.02]"
            >
              <Play size={18} />
              Iniciar simulado
            </button>
          </>
        ) : sectionIndex < sections.length ? (
          <>
            <section className="elan-glass rounded-3xl p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-purple-200">
                    Etapa {sectionIndex + 1} de {sections.length}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{currentSection.skill}</h2>
                </div>
                <div className="rounded-2xl border border-purple-300/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-100">
                  Tempo recomendado: {formatTime(currentSection.duration)}
                </div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-black/40 p-1">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {(currentSection.type === "quiz") && (
              <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div className="elan-glass max-h-[72vh] overflow-auto rounded-3xl p-6">
                  <h3 className="font-bold">{currentSection.title}</h3>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-300">{currentSection.passage}</p>
                </div>
                <div className="space-y-3">
                  {currentSection.questions.map((question, index) => (
                    <div key={question.id} className="elan-glass rounded-2xl p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Questao {index + 1}</p>
                      <p className="mt-2 text-sm leading-6 text-gray-100">{question.question}</p>
                      {Array.isArray(question.options) && question.options.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAnswers({ ...answers, [question.id]: option })}
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
                          onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
                          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-purple-400"
                          placeholder="Sua resposta"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentSection.type === "writing" && (
              <section className="elan-glass rounded-3xl p-6">
                <p className="text-sm text-purple-200">Prompt</p>
                <h3 className="mt-2 text-xl font-bold">{currentSection.prompt}</h3>
                <textarea
                  value={answers[currentSection.id] || ""}
                  onChange={(event) => setAnswers({ ...answers, [currentSection.id]: event.target.value })}
                  className="mt-5 h-96 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 outline-none focus:border-purple-400"
                  placeholder="Escreva sua resposta..."
                />
              </section>
            )}

            {currentSection.type === "speaking" && (
              <section className="elan-glass rounded-3xl p-6">
                <h3 className="text-xl font-bold">Speaking prompts</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {currentSection.questions.map((question) => (
                    <div key={question} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
                      {question}
                    </div>
                  ))}
                </div>
                <textarea
                  value={answers[currentSection.id] || ""}
                  onChange={(event) => setAnswers({ ...answers, [currentSection.id]: event.target.value })}
                  className="mt-5 h-72 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 outline-none focus:border-purple-400"
                  placeholder="Digite uma transcricao/resumo da sua resposta oral para calcular um score aproximado."
                />
              </section>
            )}

            <button
              type="button"
              onClick={finishSection}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold transition hover:bg-emerald-500"
            >
              <CheckCircle2 size={18} />
              Finalizar etapa
            </button>
          </>
        ) : (
          <section className="elan-glass rounded-[2rem] p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Resumo final</p>
            <h2 className="mt-4 text-6xl font-black">
              {exam.scoreLabel} {finalResult?.score}
            </h2>
            <p className="mt-4 text-gray-400">Resultado salvo no historico como Full Mock Exam.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {sectionResults.map((result) => (
                <div key={result.skill} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-gray-400">{result.skill}</p>
                  <p className="mt-2 text-2xl font-bold">{result.score}</p>
                  <p className="mt-1 text-xs text-gray-500">{result.durationMinutes} min</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
