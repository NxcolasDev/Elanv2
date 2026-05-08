import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ExamSwitcher from "../components/ExamSwitcher";
import MainLayout from "../layouts/MainLayout";
import SpeakingControls from "../components/speaking/SpeakingControls";
import SpeakingQuestion from "../components/speaking/SpeakingQuestion";
import SpeakingResult from "../components/speaking/SpeakingResult";
import SpeakingTranscript from "../components/speaking/SpeakingTranscript";
import { speakingBanks } from "../data/examContent";
import { useActiveExam } from "../hooks/useActiveExam";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { saveExamResult } from "../utils/examHistory";

const API = "http://localhost:5000/api/exams/generate";

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function parseFeedback(feedback) {
  if (typeof feedback !== "string") return feedback;

  try {
    return JSON.parse(feedback.replace(/```json|```/g, "").trim());
  } catch {
    return { raw: feedback };
  }
}

export default function Speaking() {
  const { activeExam, exam: activeExamMeta, isDelf } = useActiveExam();
  const bank = speakingBanks[activeExam] || speakingBanks.IELTS;
  const [mode, setMode] = useState("idle");
  const [questions, setQuestions] = useState(null);
  const [result, setResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const {
    listening,
    transcript,
    finalTranscript,
    speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const currentQuestions = useMemo(
    () => (Array.isArray(questions?.[currentPart]) ? questions[currentPart] : []),
    [questions, currentPart]
  );

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const speak = useCallback((text) => {
    if (!text || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = bank.lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [bank.lang]);

  const generateExam = (nextMode) => {
    window.speechSynthesis?.cancel();

    setMode(nextMode);
    setQuestions({
      1: pickRandom(bank.parts[1]),
      2: [pickRandom(bank.parts[2])],
      3: pickRandom(bank.parts[3]),
    });
    setCurrentPart(1);
    setCurrentQuestionIndex(0);
    resetTranscript();
    setResult(null);
  };

  const clearText = () => {
    resetTranscript();
    setResult(null);
  };

  const handleEvaluate = async () => {
    const fullText = finalTranscript.trim();

    if (!fullText) {
      setResult({ error: "Fale algo antes de avaliar." });
      return;
    }

    setEvaluating(true);

    try {
      const response = await axios.post(API, {
        mode: "speaking",
        text: `${activeExamMeta.label} ${isDelf ? "French DELF/DALF" : "IELTS English"} speaking answer:\n${fullText}`,
      });

      const feedback = parseFeedback(response.data?.feedback);
      setResult(feedback);

      if (Number.isFinite(Number(feedback?.band))) {
        saveExamResult({
          skill: "Speaking",
          exam: activeExam,
          score: Number(feedback.band),
          label: mode === "full" ? `${activeExamMeta.label} Speaking Simulado` : `${activeExamMeta.label} Speaking Treino`,
          durationMinutes: 15,
        });
      }
    } catch (err) {
      console.error("Erro ao avaliar speaking:", err);
      setResult({ error: "Erro ao avaliar. Tente novamente em instantes." });
    } finally {
      setEvaluating(false);
    }
  };

  const nextStep = () => {
    if (!questions) return;

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      return;
    }

    if (currentPart < 3) {
      setCurrentPart((previousPart) => previousPart + 1);
      setCurrentQuestionIndex(0);
      return;
    }

    handleEvaluate();
  };

  useEffect(() => {
    if (currentQuestion) speak(currentQuestion);
  }, [currentQuestion, speak]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-5 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-purple-200">
                {isDelf ? "Production orale · français · niveaux A1-C2" : "Part 1 · Part 2 cue card · Part 3 discussion"}
              </p>
              <h1 className="mt-2 text-4xl font-black">{bank.title}</h1>
              <p className="mt-3 text-sm text-gray-400">
                A IA analisa a fala acumulada completa, não apenas o último trecho.
              </p>
            </div>
            <ExamSwitcher />
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generateExam("full")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === "full"
                ? "bg-purple-600 text-white"
                : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
            }`}
          >
            Simulado completo
          </button>

          <button
            onClick={() => generateExam("practice")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === "practice"
                ? "bg-purple-600 text-white"
                : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
            }`}
          >
            Treino
          </button>
        </div>

        <SpeakingQuestion
          currentPart={currentPart}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={currentQuestions.length}
          onSpeak={speak}
        />

        <SpeakingControls
          listening={listening}
          onStart={startListening}
          onStop={stopListening}
          onClear={clearText}
          onEvaluate={handleEvaluate}
          onNext={nextStep}
        />

        {evaluating && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            Avaliando sua resposta com IA...
          </div>
        )}

        <SpeakingTranscript
          finalTranscript={finalTranscript}
          transcript={transcript}
          listening={listening}
          speechError={speechError}
        />

        <SpeakingResult result={result} />
      </div>
    </MainLayout>
  );
}
