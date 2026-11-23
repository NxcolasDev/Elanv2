import { useEffect, useMemo, useState } from "react";
import { BookMarked, CheckCircle2, Copy, Loader2, Mic, PenLine, Sparkles } from "lucide-react";
import AIStudyAssistant from "../components/AIStudyAssistant";
import AiUnavailableNotice from "../components/AiUnavailableNotice";
import MainLayout from "../layouts/MainLayout";
import {
  highBandStrategies,
  linkingGroups,
  listeningTips,
  speakingModels,
  studySections,
  vocabularyStructures,
  writingModels,
} from "../data/modelsContent";
import { useAuth } from "../hooks/useAuth";
import { scopedKey } from "../utils/storageScope";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateStudyModel } from "../services/studyAssistant";
import { getApiErrorMessage, getPublishedContent, isAiUnavailableError } from "../services/api";

const fallbackInsights = {
  whyUseThis: "This structure is useful because it gives your answer a clear job: answer, explain, support, and close.",
  whenToUse: "Use it when you need a reliable exam answer and do not want to sound memorized.",
  scoreImpact: "It usually improves coherence, task response, lexical control, and fluency because the examiner can follow your thinking.",
  typicalLevel: "Common around Band 6.5-8 or DELF B1-C1 when used naturally.",
};

const modelGroups = [
  {
    title: "Speaking",
    items: [{ id: "speaking", label: "Speaking Models" }],
  },
  {
    title: "Writing",
    items: [{ id: "writing", label: "Writing Models" }],
  },
  {
    title: "Listening",
    items: [{ id: "listening", label: "Listening Tips" }],
  },
  {
    title: "Vocabulary",
    items: [
      { id: "vocabulary", label: "Vocabulary Structures" },
      { id: "linking", label: "Linking Words" },
    ],
  },
  {
    title: "Strategies",
    items: [{ id: "band", label: "Band Strategy" }],
  },
];

export default function Models() {
  const { user } = useAuth();
  const scope = user?.uid || "demo";
  return <ModelsWorkspace key={scope} scope={scope} />;
}

function ModelsWorkspace({ scope }) {
  const [activeCategory, setActiveCategory] = useState("writing");
  const [activeWritingId, setActiveWritingId] = useState(writingModels[0].id);
  const [activeSectionId, setActiveSectionId] = useState(studySections[0].id);
  const [practiceText, setPracticeText] = useLocalStorage(scopedKey("elan.models.practiceText", scope), "");
  const [aiModels, setAiModels] = useLocalStorage(scopedKey("elan.models.aiModels", scope), {});
  const [loadingModel, setLoadingModel] = useState(false);
  const [modelError, setModelError] = useState("");

  const activeWriting = useMemo(
    () => writingModels.find((model) => model.id === activeWritingId) || writingModels[0],
    [activeWritingId]
  );

  const activeSection = useMemo(
    () => studySections.find((section) => section.id === activeSectionId) || studySections[0],
    [activeSectionId]
  );

  const modelExam = activeSection.id.startsWith("delf-") ? "DELF" : "IELTS";
  const [published, setPublished] = useState({});
  useEffect(() => {
    const controller = new AbortController();
    getPublishedContent(modelExam, "modelStudy", controller.signal)
      .then((items) => setPublished((previous) => ({ ...previous, [modelExam]: items })))
      .catch(() => {});
    return () => controller.abort();
  }, [modelExam]);

  const generatedModel = aiModels[activeSection.id];
  const practiceWords = practiceText.trim() ? practiceText.trim().split(/\s+/).length : 0;
  const assistantContext = `${activeSection.label}. ${activeSection.focus}. Current writing model: ${activeWriting.title}.`;

  const loadAiModel = async () => {
    setLoadingModel(true);
    setModelError("");

    try {
      const nextModel = await generateStudyModel(activeSection.focus, modelExam);

      if (nextModel) {
        setAiModels({
          ...aiModels,
          [activeSection.id]: nextModel,
        });
      }
    } catch (error) {
      setModelError(
        isAiUnavailableError(error)
          ? "AI_UNAVAILABLE"
          : getApiErrorMessage(error, "Você pode continuar com os exemplos locais.")
      );
    } finally {
      setLoadingModel(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 text-white">
        <section className="elan-glass elan-glow-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                <BookMarked size={16} />
                Estudio de modelos com IA
              </div>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">Models</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
                Estude estruturas de IELTS e DELF, gere explicacoes com IA e pratique com modelos sem perder o fluxo visual do ELAN.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAiModel}
              disabled={loadingModel}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingModel ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
              Gerar explicacao IA
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Escolha a area", "Speaking, Writing, Listening, Vocabulary ou Strategies."],
            ["2", "Selecione a prova", "Use uma secao IELTS ou DELF para contextualizar a IA."],
            ["3", "Pratique e pergunte", "Compare modelos, escreva sua resposta e chame a Lumi."],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-purple-200">Passo {step}</p>
              <h2 className="mt-2 font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="elan-glass rounded-3xl p-4">
              <p className="text-xs uppercase tracking-wide text-purple-200">Secao da prova</p>
              <div className="mt-3 space-y-2">
                {studySections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                      activeSection.id === section.id
                        ? "border-purple-300/45 bg-purple-500/18 text-white"
                        : "border-white/10 bg-black/20 text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="elan-glass rounded-3xl p-4">
              <p className="text-xs uppercase tracking-wide text-purple-200">Area de estudo</p>
              <div className="mt-4 space-y-4">
                {modelGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{group.title}</p>
                    <div className="grid gap-2">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveCategory(item.id)}
                          className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                            activeCategory === item.id
                              ? "border-purple-300/45 bg-purple-500/18 text-white"
                              : "border-white/10 bg-black/20 text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="elan-glass rounded-3xl p-6">
              <p className="text-sm text-purple-200">{activeSection.label}</p>
              <h2 className="mt-2 text-2xl font-black">{generatedModel?.title || activeSection.starter}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Por que usar?", generatedModel?.whyUseThis || fallbackInsights.whyUseThis],
                  ["Quando usar", generatedModel?.whenToUse || fallbackInsights.whenToUse],
                  ["Impacto no score", generatedModel?.scoreImpact || fallbackInsights.scoreImpact],
                  ["Nivel comum", generatedModel?.typicalLevel || fallbackInsights.typicalLevel],
                ].map(([title, value]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-bold text-purple-200">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{value}</p>
                  </div>
                ))}
              </div>

              {generatedModel?.model && (
                <div className="mt-5 rounded-2xl border border-purple-300/20 bg-purple-500/10 p-4">
                  <p className="text-sm font-bold text-purple-100">Modelo gerado por IA</p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-200">{generatedModel.model}</p>
                </div>
              )}

              {modelError === "AI_UNAVAILABLE" ? (
                <AiUnavailableNotice className="mt-4" />
              ) : modelError ? (
                <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {modelError}
                </p>
              ) : null}
            </section>

            {(published[modelExam] || []).length > 0 && (
              <section className="elan-glass space-y-3 rounded-3xl p-6">
                <h2 className="text-xl font-bold">Modelos publicados</h2>
                {published[modelExam].map(({ id, payload }) => (
                  <details key={id} className="rounded-xl border border-white/10 p-4">
                    <summary className="cursor-pointer font-semibold">{payload.title} ? {payload.level}</summary>
                    <p className="my-3 whitespace-pre-line">{payload.model}</p>
                    <p className="text-purple-200">{payload.practicePrompt}</p>
                  </details>
                ))}
              </section>
            )}

            {activeCategory === "writing" && (
              <>
                <div className="flex flex-wrap gap-2">
                  {writingModels.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setActiveWritingId(model.id)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        activeWritingId === model.id
                          ? "bg-purple-600 text-white"
                          : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
                      }`}
                    >
                      {model.exam}
                    </button>
                  ))}
                </div>

                <section className="grid gap-5 lg:grid-cols-2">
                  <div className="elan-glass rounded-3xl p-5">
                    <div className="mb-4 flex items-center gap-2 text-purple-200">
                      <PenLine size={18} />
                      <h3 className="font-bold">{activeWriting.title}</h3>
                    </div>
                    <p className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-gray-300">
                      {activeWriting.prompt}
                    </p>
                    <p className="max-h-[520px] overflow-auto whitespace-pre-line pr-2 text-sm leading-7 text-gray-300">
                      {activeWriting.modelText}
                    </p>
                  </div>

                  <div className="elan-glass rounded-3xl p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-purple-200">
                        <Copy size={18} />
                        <h3 className="font-bold">Pratique ao lado</h3>
                      </div>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-gray-300">{practiceWords} words</span>
                    </div>
                    <textarea
                      value={practiceText}
                      onChange={(event) => setPracticeText(event.target.value)}
                      className="h-[520px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-white outline-none transition focus:border-purple-400"
                      placeholder="Reescreva o modelo com seus exemplos e compare estrutura, linking words e vocabulario."
                    />
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Structure", activeWriting.structure],
                    ["Linking words", activeWriting.linkingWords],
                    ["Strong vocabulary", activeWriting.vocabulary],
                    ["Grammar usage", activeWriting.grammar],
                  ].map(([title, items]) => (
                    <div key={title} className="elan-glass rounded-2xl p-4">
                      <h3 className="font-bold">{title}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-gray-300">
                        {items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 shrink-0 text-purple-300" size={15} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              </>
            )}

            {activeCategory === "speaking" && (
              <section className="grid gap-4 lg:grid-cols-2">
                {speakingModels.map((model) => (
                  <div key={model.title} className="elan-glass rounded-3xl p-5">
                    <div className="flex items-center gap-2 text-purple-200">
                      <Mic size={18} />
                      <h2 className="font-bold">{model.title}</h2>
                    </div>
                    <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-gray-300">
                      {model.answer}
                    </p>
                    {[
                      ["Fluency", model.fluencyTips],
                      ["Pronunciation", model.pronunciation],
                      ["Vocabulary", model.vocabulary],
                    ].map(([title, items]) => (
                      <div key={title} className="mt-4">
                        <p className="text-sm font-semibold text-purple-200">{title}</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-400">
                          {items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {activeCategory === "listening" && (
              <section className="elan-glass rounded-3xl p-6">
                <h2 className="text-2xl font-black">Listening Strategies</h2>
                <div className="mt-5 grid gap-3">
                  {listeningTips.map((tip, index) => (
                    <div key={tip} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-purple-200">Tip {index + 1}</p>
                      <p className="mt-2 text-sm leading-6 text-gray-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeCategory === "vocabulary" && (
              <section className="grid gap-4 lg:grid-cols-3">
                {vocabularyStructures.map((group) => (
                  <div key={group.category} className="elan-glass rounded-3xl p-5">
                    <h2 className="font-bold">{group.category}</h2>
                    <div className="mt-4 space-y-3">
                      {group.items.map(([structure, example]) => (
                        <div key={structure} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="font-semibold text-purple-200">{structure}</p>
                          <p className="mt-2 text-sm leading-6 text-gray-400">{example}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {activeCategory === "linking" && (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {linkingGroups.map(([purpose, ...words]) => (
                  <div key={purpose} className="elan-glass rounded-3xl p-5">
                    <h2 className="font-bold">{purpose}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {words.map((word) => (
                        <span key={word} className="rounded-full border border-purple-300/20 bg-purple-500/10 px-3 py-1 text-sm text-purple-100">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {activeCategory === "band" && (
              <section className="elan-glass rounded-3xl p-6">
                <h2 className="text-2xl font-black">Band Strategy</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {highBandStrategies.map((strategy) => (
                    <div key={strategy} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-gray-300">
                      {strategy}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        <AIStudyAssistant exam={modelExam} context={assistantContext} focus={activeSection.focus} />
      </div>
    </MainLayout>
  );
}
