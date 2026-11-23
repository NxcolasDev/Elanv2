const { GoogleGenAI } = require("@google/genai");
const { setTimeout: delay } = require("node:timers/promises");
const Ajv = require("ajv");
const { definitions, instructions, version } = require("./aiPrompts");

const AI_DEMO_UNAVAILABLE_MESSAGE =
  "As funcionalidades de Inteligência Artificial dependem de uma chave de API própria. Consulte o README para saber como configurar.";

function aiError(status, message, code) {
  return Object.assign(new Error(message), { status, code });
}

const ajv = new Ajv({ strict: true });
const validators = Object.fromEntries(Object.entries(definitions)
  .filter(([, definition]) => definition.schema)
  .map(([mode, { schema }]) => [mode, ajv.compile(schema)]));

function validateInput(mode, exam, input) {
  if (!Object.hasOwn(definitions, mode) || !["IELTS", "DELF"].includes(exam)) {
    throw aiError(400, "Modo ou exame inválido.", "AI_INPUT");
  }
  const data = {};
  for (const [key, max] of Object.entries({ text: 12000, context: 4000, focus: 300 })) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.length > max) {
      throw aiError(400, `Campo inválido: ${key}.`, "AI_INPUT");
    }
    data[key] = value.trim();
  }
  if (["correction", "speaking", "studyAssistant"].includes(mode) && !data.text) {
    throw aiError(400, "Informe o texto da resposta ou pergunta.", "AI_INPUT");
  }
  return data;
}

function containsBlank(value) {
  if (typeof value === "string") return !value.trim();
  return value !== null && typeof value === "object" && Object.values(value).some(containsBlank);
}

function validateOutput(mode, exam, output) {
  const invalid = () => aiError(502, "A IA retornou conteúdo incompleto ou inválido. Tente novamente.", "AI_OUTPUT");
  if (!validators[mode]) {
    if (typeof output !== "string" || !output.trim()) throw invalid();
    return output.trim();
  }

  let value;
  try {
    value = typeof output === "string" ? JSON.parse(output) : output;
  } catch {
    throw invalid();
  }
  if (!validators[mode](value) || containsBlank(value)) throw invalid();
  if (value.band !== undefined && (value.band > (exam === "DELF" ? 25 : 9) || value.band * 2 % 1)) {
    throw invalid();
  }
  const groups = mode === "reading" ? [{ script: value.text, questions: value.questions }] : value.sections;
  if (groups) {
    const normalize = (text) => text.trim().replace(/\s+/g, " ").toLocaleLowerCase();
    const ids = new Set();
    const questions = new Set();
    const scripts = new Set();
    for (const { script, questions: items } of groups) {
      const source = normalize(script);
      if (source.split(" ").length < (mode === "reading" ? 85 : 60) || scripts.has(source)) {
        throw invalid();
      }
      scripts.add(source);
      for (const item of items) {
        const options = new Set(item.options.map(normalize));
        const evidence = normalize(item.evidence);
        const question = normalize(item.question);
        if (ids.has(item.id) || !question || questions.has(question) || options.size !== 4 ||
            options.has("") || !item.options.includes(item.correct) ||
            evidence.length < 10 || !source.includes(evidence) || !evidence.includes(normalize(item.correct))) {
          throw invalid();
        }
        ids.add(item.id);
        questions.add(question);
      }
    }
  }
  return value;
}

function isAiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

async function requestGemini({ model, system, contents, schema, timeout }) {
  if (!isAiConfigured()) throw aiError(503, AI_DEMO_UNAVAILABLE_MESSAGE, "AI_PROVIDER_UNAVAILABLE");
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY.trim(),
    vertexai: false,
    httpOptions: { timeout, retryOptions: { attempts: 1 } },
  });
  return client.models.generateContent({
    model, contents,
    config: {
      systemInstruction: system,
      maxOutputTokens: schema ? 6500 : 1800,
      abortSignal: AbortSignal.timeout(timeout),
      ...(schema && { responseMimeType: "application/json", responseJsonSchema: schema }),
    },
  });
}

function createHarness({ request = requestGemini, log = (entry) => console.info(JSON.stringify(entry)) } = {}) {
  let active = 0;
  let attemptsToday = 0;
  let day = "";
  const positive = (value, fallback) => Number.isSafeInteger(Number(value)) && Number(value) > 0
    ? Number(value) : fallback;
  const history = [];
  async function run(mode, exam, input) {
    const data = validateInput(mode, exam, input);
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    if (active >= positive(process.env.AI_CONCURRENCY, 2)) {
      throw aiError(429, "A IA está ocupada. Tente novamente em instantes.", "AI_BUSY");
    }
    active++;
    try {
      for (let attempt = 1; attempt <= 2; attempt++) {
        const today = new Date().toISOString().slice(0, 10);
        if (day !== today) {
          day = today;
          attemptsToday = 0;
        }
        if (attemptsToday >= positive(process.env.AI_DAILY_ATTEMPTS, 100)) {
          throw aiError(429, "Limite diário de IA atingido.", "AI_BUDGET");
        }
        attemptsToday++;
        const start = Date.now();
        const entry = { event: "ai.generation", mode, exam, model, version, attempt };
        try {
          const response = await request({
            model, system: instructions(mode, exam), contents: JSON.stringify(data),
            schema: definitions[mode].schema, timeout: 18000,
          });
          const usage = response.usageMetadata;
          Object.assign(entry, {
            inputTokens: usage?.promptTokenCount, outputTokens: usage?.candidatesTokenCount,
            totalTokens: usage?.totalTokenCount, thoughtTokens: usage?.thoughtsTokenCount,
          });
          const inputPrice = Number(process.env.AI_INPUT_USD_PER_MILLION);
          const outputPrice = Number(process.env.AI_OUTPUT_USD_PER_MILLION);
          if (inputPrice > 0 && outputPrice > 0 && entry.inputTokens != null && entry.outputTokens != null) {
            entry.estimatedUsd = (entry.inputTokens * inputPrice +
              (entry.outputTokens + (entry.thoughtTokens || 0)) * outputPrice) / 1_000_000;
          }
          const reason = response.candidates?.[0]?.finishReason;
          if (reason && reason !== "STOP") throw aiError(502, "Resposta da IA interrompida.", "AI_OUTPUT");
          const result = validateOutput(mode, exam, response.text);
          entry.outcome = "ok";
          return result;
        } catch (error) {
          const status = Number(error.status);
          entry.outcome = error.code?.startsWith?.("AI_") ? error.code : "AI_UPSTREAM";
          entry.upstreamStatus = Number.isInteger(status) ? status : undefined;
          const retryable = [500, 502, 503, 504].includes(status) && !error.code?.startsWith?.("AI_");
          if (attempt === 2 || !retryable) {
            if (error.code?.startsWith?.("AI_")) throw error;
            if (status === 429) throw aiError(429, "Limite do provedor de IA atingido. Tente mais tarde.", "AI_RATE");
            if (["AbortError", "TimeoutError"].includes(error.name) || status === 408 || status === 504) {
              throw aiError(504, "A IA demorou para responder.", "AI_TIMEOUT");
            }
            throw aiError(502, "Erro de comunicação com o Gemini.", "AI_UPSTREAM");
          }
        } finally {
          Object.assign(entry, { durationMs: Date.now() - start, timestamp: new Date().toISOString() });
          history.unshift(entry);
          if (history.length > 100) history.pop();
          log(entry);
        }
        await delay(300 + Math.random() * 250);
      }
    } finally {
      active--;
    }
  }

  return { run, recent: () => history.slice(), status: () => ({ active, attemptsToday, day, version }) };
}

module.exports = { createHarness, validateOutput, isAiConfigured, aiError, harness: createHarness() };
