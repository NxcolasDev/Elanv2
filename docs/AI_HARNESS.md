# AI harness

The backend uses the official Google Gen AI SDK with GEMINI_API_KEY and GEMINI_MODEL. Its default is gemini-3.8-flash. Leave the key empty to use bundled study material and see an explicit AI unavailable response.

| Mode | Result | Access |
| --- | --- | --- |
| correction | Writing score and criterion-specific feedback | Signed-in learner |
| speaking | Transcript-based Speaking estimate and guidance | Signed-in learner |
| studyAssistant | Lumi text reply | Signed-in learner |
| modelStudy | Model, explanations, examples, and a practice prompt | Signed-in learner or administrative preview |
| reading | Passage and ten questions | Signed-in learner or administrative preview |
| listening | Two scripts with five questions each | Administrative preview |

The registry in aiPrompts.js defines reusable instructions, IELTS and DELF rubrics, a prompt version, and JSON schemas. User data goes in a separate JSON message. The API attaches no tools or database privileges to Gemini. The model receives the minimum fields used by the task. Structured output is parsed with AJV. The harness rejects blanks, truncated results, invalid score ranges, repeated questions, mismatched answer keys, and evidence that does not quote the source passage or script and contain the correct option.

Requests have a per-attempt 18-second SDK timeout, at most two attempts on transient server errors, and jitter between attempts. Provider 429 responses return a rate error directly. Inputs are capped at 12,000 characters for text, 4,000 for context and 300 for focus. Structured output has a 6,500-token ceiling and Lumi has an 1,800-token ceiling. Signed-in student and administrative buckets allow six and three requests per minute per UID, respectively. The API defaults to two concurrent operations and 100 provider attempts per UTC day per process. Set provider quotas separately for a cross-instance budget.

Technical events include mode, exam, model, prompt version, duration, token metadata, outcome, and attempt. Optional AI_INPUT_USD_PER_MILLION and AI_OUTPUT_USD_PER_MILLION enable a rough estimate from the token counts. Supply prices for the selected model. Pricing tiers, caching and discounts can make the invoice differ. The panel shows the last 100 events per instance. Cloud Logging aggregates stdout across instances.

## Limits of automated evaluation

Matching evidence to the source checks traceability. It cannot establish that the quoted evidence proves the answer, that the distractors are plausible, that the passage reads coherently, or that the language and level are right for the target. A system instruction can reduce prompt injection risk. Treat output as untrusted and review it before publication. The procedure is to verify each answer against its evidence, read both audio scripts aloud, and review rubric feedback for specificity and score consistency. Use educator-labeled samples for calibration. A transcript cannot support a pronunciation score. An IELTS or DELF/DALF practice estimate has no official standing.

The former Groq source remains disconnected while a real Gemini run with project credentials is pending. Current tests use the SDK against a local mock HTTP server and never require paid API calls.

[Google Gen AI SDK](https://github.com/googleapis/js-genai) · [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output) · [Harness flow](architecture/AI_HARNESS_FLOW.md)
