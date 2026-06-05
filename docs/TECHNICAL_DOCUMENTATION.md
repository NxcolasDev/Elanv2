# ELAN Technical Documentation

ELAN is an AI-powered language learning platform for IELTS and DELF/DALF preparation. The project is split into a React frontend and a Node/Express backend, with MongoDB used for persisted server data and LocalStorage used for fast client-side study state such as active exam, flashcards, notes, history, and practice drafts.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Recharts, Lucide icons.
- Backend: Node.js, Express, MongoDB, Mongoose, Axios, dotenv, CORS.
- AI: backend service calling an OpenAI-compatible Groq endpoint through `AI_API_KEY`.
- Persistence: MongoDB for backend entities; LocalStorage for personal study state and offline-friendly features.
- Dev infrastructure: Docker Compose currently starts MongoDB and Mongo Express.

## Architecture

The frontend and backend stay separated. The browser never calls the AI provider directly. AI requests go from React to Express, then from Express to the AI provider. This protects API keys and keeps prompt logic centralized.

Frontend organization:

- `src/pages`: route-level screens such as Dashboard, Writing, Speaking, Listening, Reading, Models, and YouTube Study.
- `src/layouts`: shared application frame. `MainLayout` owns sidebar and mobile navigation.
- `src/components`: reusable UI and feature components, including speaking subcomponents and exam switcher.
- `src/hooks`: reusable React state logic, such as auth, active exam, speech recognition, and LocalStorage.
- `src/services`: external or persistent services, including API client, Firebase, flashcards, and schedule storage.
- `src/data`: static learning content, exam banks, achievements, models, and curated YouTube recommendations.
- `src/utils`: pure helpers for scoring, scoped storage, achievements, and exam history.

Backend organization:

- `src/app.js`: Express app setup, middleware, routes, and error handler.
- `src/server.js`: environment loading, database connection, and app startup.
- `src/routes`: endpoint definitions.
- `src/controllers`: request handlers.
- `src/services`: AI provider and domain service functions.
- `src/models`: Mongoose schemas.
- `src/middlewares`: authentication and error handling.
- `src/config`: database and Firebase configuration.

## Frontend And Backend Communication

The frontend uses `src/services/api.js` as the single Axios client:

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
```

This replaces scattered hardcoded URLs. Local development still works by default, and production can use `VITE_API_BASE_URL` without changing source code.

Current key API paths:

- `POST /api/users/sync`: sync Firebase login user into MongoDB.
- `GET /api/users/:uid`: load a user by Firebase UID.
- `POST /api/exams/generate`: generate topics, reading content, speaking feedback, and writing correction.
- `POST /api/exams/generate` with `mode: "studyAssistant"`: reusable Lumi assistant for vocabulary, grammar, pronunciation, writing, speaking, listening, and IELTS/DELF strategy.
- `POST /api/exams/generate` with `mode: "modelStudy"`: AI-generated model explanations for specific IELTS/DELF sections.
- `GET/POST /api/results`: result persistence endpoints.
- `GET/POST /api/flashcards`: backend flashcard endpoints, while the current frontend primarily uses LocalStorage flashcards.

## React Concepts Used

- Components: pages and smaller feature components keep UI split into readable pieces.
- Hooks: reusable logic is isolated in hooks such as `useActiveExam`, `useAuth`, `useLocalStorage`, and `useSpeechRecognition`.
- State: local page state is used for temporary UI state such as selected tabs, answers, notes, timers, and generated results.
- Derived state: `useMemo` is used where derived values depend on larger arrays or selected data.
- Effects: `useEffect` handles loading, timers, storage changes, and speech cleanup.
- Controlled inputs: textareas, notes, answers, and search fields are bound to React state.
- Routing: `react-router-dom` maps pages to stable URLs while `MainLayout` keeps visual structure consistent.

## Reusable Systems

- Active exam system: `useActiveExam` reads the selected exam and reacts to `elan:exam-change` events.
- Scoped storage: storage helpers keep user-specific local data separated where supported.
- Flashcards: `flashcardsStorage.js` owns deck creation, card creation, delete behavior, and spaced repetition timing.
- Notes: `notesStorage.js` owns block-style study notes created manually or by study flows such as YouTube and Lumi.
- Exam history: `examHistory.js` stores local scores and powers dashboard statistics.
- API client: `api.js` centralizes backend base URL and timeout behavior.
- Layout navigation: `MainLayout` owns desktop sidebar and mobile bottom navigation, so new study pages can be added consistently.

## New Features

### Models Page

The Models page is now an AI-assisted study library for:

- Writing models.
- Speaking models.
- Listening tips.
- Vocabulary structures.
- Linking words.
- High band strategies.

It includes dedicated section contexts for:

- IELTS Speaking Part 1.
- IELTS Speaking Part 2.
- IELTS Speaking Part 3.
- IELTS Writing Task 1.
- IELTS Writing Task 2.
- DELF production orale.
- DELF production ecrite.

The page can generate AI explanations for the active section. The AI explains why a structure is useful, when to use it, how it can improve score, and what level commonly uses it. Local examples in `src/data/modelsContent.js` remain as fallbacks so the page is still useful when the AI provider is unavailable.

Writing models still include side-by-side practice: the model answer is shown on the left and a persisted student textarea is shown on the right.

### AI Study Assistant

`src/components/AIStudyAssistant.jsx` is a reusable floating assistant panel. It calls `src/services/studyAssistant.js`, which reuses the existing backend `/api/exams/generate` route through `studyAssistant` mode.

The assistant can explain:

- Vocabulary.
- Grammar.
- Pronunciation.
- Writing structures.
- Speaking answer strategy.
- IELTS and DELF band/level improvement.
- Alternative examples.

The component is currently used on Models and YouTube Study. It accepts `context` and `focus` props so each page can give the AI enough information without creating separate assistant implementations.

### YouTube Study Page

The YouTube page was reworked from curated mock cards into a real study portal. It includes:

- Category filters.
- A YouTube URL/video ID loader.
- A lightweight YouTube search helper.
- Embedded player for the pasted video.
- Persistent note-taking.
- Saved study sessions.
- Study session mode.
- Add whole note to flashcards.
- Add selected note text to flashcards.
- Lumi assistant support based on the current category, video ID, and notes.

The implementation intentionally avoids the YouTube API. This keeps the feature stable, avoids new credentials, and improves Electron compatibility later because the app only needs to embed a user-provided video URL.

### Flashcard Spaced Repetition

Flashcards now keep lightweight scheduling metadata while preserving older stored cards:

- `easeFactor`: starts at `2.5` and moves slightly down for Hard or up for Easy.
- `repetitions`: counts successful review progress.
- `interval`: stores the current review interval in days.
- `nextReviewDate`: controls when the card appears again.
- `lastReviewed`: records the last review timestamp.

Old cards with `dueAt`, `intervalDays`, or `lastReviewedAt` are normalized when decks are loaded, so existing LocalStorage data remains compatible.

The review buttons are intentionally simple:

- Hard: returns quickly and slightly lowers ease.
- Good: advances on a normal schedule.
- Easy: increases ease and pushes the card further into the future.

This is not a full Anki clone. It is a lightweight memory-retention loop designed to make easy cards appear less often and difficult cards return sooner.

### Flashcard Deck Management

The Flashcards page now has two layers:

- Review mode: shows due cards only, using `nextReviewDate || dueAt`.
- Deck inspection: shows every card in the active deck, including front, back, optional context, next review date, and a simple difficulty label.

Cards can be edited, deleted, or reviewed directly from the deck inspector. Editing preserves spaced repetition metadata and only updates learner-facing fields.

### Notes System

Notes are now independent study blocks instead of one large textarea. Each note stores:

- `title`
- `content`
- `category`
- `source`
- `createdAt`
- `updatedAt`

Manual notes are created from the Notes page. External study systems can also create notes through `createStudyNote`, currently used by:

- YouTube saved study sessions.
- Lumi assistant responses saved as notes.

This keeps study evidence centralized without adding a database dependency yet.

### Full Mock Exam

`/simulado` now runs a self-contained full mock exam flow rather than a checklist. It uses existing exam content banks and keeps individual practice pages unchanged.

The mock exam flow is:

- Reading.
- Listening.
- Writing.
- Speaking.
- Summary.

For IELTS and DELF, the page reads the active exam through `useActiveExam` and builds the appropriate section titles, prompts, durations, and scoring scale.

Scoring is intentionally lightweight:

- Reading and Listening use objective answer matching.
- IELTS objective sections convert correct answers to a band with `toIELTSBand`.
- DELF objective sections convert correct answers to points.
- Writing and Speaking use completion-based approximate scores from response length.

At the end, ELAN saves one `Full Mock Exam` result to local history with section-level results embedded in the history item.

### YouTube Flashcard Confirmation

YouTube no longer saves notes directly to flashcards. The flow now creates a draft card first, then opens a confirmation modal where the learner can edit:

- Front.
- Back.
- Optional context.

Only after confirmation does the page call the existing `createFlashcardCard` helper.

## Stability And Security Improvements

- API base URL is centralized and configurable through `.env`.
- Example environment files were added for frontend and backend.
- Backend CORS now uses `CORS_ORIGIN` while preserving local Vite development.
- Backend database connection reads `MONGO_URI` from the local environment.
- Backend error handling middleware now returns consistent JSON errors.
- Backend AI modes were extended without creating a separate AI architecture.
- Backend debug route logging was removed from app startup.
- Case-sensitive import issues were fixed for Linux/Docker compatibility.
- Flashcard creation now selects the newly created deck correctly.
- News and YouTube flashcard additions use the shared flashcard storage system.
- YouTube selected-text flashcard creation reuses the existing LocalStorage deck system.
- Full mock exam results are saved to the existing history system with section summaries.
- Reduced-motion support was added for accessibility.

## Docker

`docker-compose.yml` currently starts:

- `mongo` on port `27017`.
- `mongo-express` on port `8081`.

This is enough for local database development. The frontend and backend are still typically started with npm scripts:

```bash
cd backend
npm run dev

cd frontend
npm run dev
```

Future Docker improvements could add frontend and backend services, but that should be done only when deployment requirements are clear.

## Maintenance Guidelines

- Add route pages in `src/pages`, then register them in `App.jsx` and `MainLayout.jsx`.
- Put static learning content in `src/data` instead of hardcoding large arrays inside pages.
- Keep AI credentials only in backend `.env`.
- Keep frontend service calls through `src/services/api.js`.
- Prefer local fallbacks for AI-dependent study flows so ELAN remains usable offline or when the AI provider fails.
- Avoid moving large feature areas unless there is a clear duplication or ownership problem.
- Test build after navigation, import, or route changes.

## Scaling Guidelines

- Move repeated card, hero, empty state, and segmented-control styles into reusable components as duplication grows.
- Add request validation middleware on backend endpoints before accepting larger user-generated payloads.
- Add backend persistence for notes, models progress, and YouTube saved videos when multi-device sync becomes important.
- Add role-based auth only when ELAN has admin or teacher workflows.
- Introduce integration tests around `/api/exams/generate` before changing AI prompt contracts.
- Add Docker services for frontend/backend when preparing deployment or desktop packaging.
