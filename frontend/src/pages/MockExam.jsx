import { useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Reading from "./Reading";
import Listening from "./Listening";
import Writing from "./Writing";
import Speaking from "./Speaking";

const STEPS = [
  "Reading",
  "Listening",
  "Writing",
  "Speaking",
  "Resultado",
];

export default function MockExam() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([]);

  const current = STEPS[step];

  const progress = useMemo(() => {
    return Math.round((step / (STEPS.length - 1)) * 100);
  }, [step]);

  const nextStep = (score) => {
    if (score !== undefined) {
      setScores((prev) => [...prev, score]);
    }

    setStep((prev) => prev + 1);
  };

  const average = useMemo(() => {
    if (!scores.length) return 0;

    return (
      scores.reduce((acc, value) => acc + Number(value || 0), 0) /
      scores.length
    ).toFixed(1);
  }, [scores]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6 text-white">
        <section className="elan-glass rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300">
                Simulado completo
              </p>

              <h1 className="mt-2 text-4xl font-black">
                {current}
              </h1>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">
                Progresso
              </p>

              <p className="text-2xl font-bold">
                {progress}%
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 rounded-full bg-black/30">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {step === 0 && (
          <Reading mockMode onComplete={nextStep} />
        )}

        {step === 1 && (
          <Listening mockMode onComplete={nextStep} />
        )}

        {step === 2 && (
          <Writing mockMode onComplete={nextStep} />
        )}

        {step === 3 && (
          <Speaking mockMode onComplete={nextStep} />
        )}

        {step >= 4 && (
          <section className="elan-glass rounded-[2rem] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
              Resultado final
            </p>

            <h2 className="mt-4 text-6xl font-black">
              {average}
            </h2>

            <p className="mt-4 text-gray-400">
              Média geral do simulado completo
            </p>

            <div className="mt-8 flex justify-center gap-3">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <p className="text-sm text-gray-400">
                    {STEPS[index]}
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {score}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}