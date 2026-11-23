# Engineering audit

The audit followed the active React routes and API handlers and reviewed configuration, dependency locks, browser storage, and relevant Git history.

| Area | Finding and disposition |
| --- | --- |
| Dashboard, History, achievements | Dashboard fetches the MongoDB profile; study statistics and achievement progress come from browser history. Profile lookup now requires the owner token. Existing result schema and endpoint provide no cloud history sync. |
| IELTS and DELF/DALF | Explicit exam IDs now select Gemini prompts and practice score ranges. Speaking and Writing display DELF skill points out of 25 and keep history on the existing normalized scale. Bundled DELF/DALF practice spans levels broader than the DELF B2 default for generated materials. |
| Reading | Initial navigation used a paid generation call and expanded ten generated questions by repetition. The page now loads published or bundled content first; paid practice is explicit. Generated items keep their actual count. The bundled 40-question demonstration still reuses some seeds. |
| Listening | Existing synthesis is browser based. The timer used to continue across resets; the effect now clears it. Published scripts are selectable. Local fixture expansion still repeats some questions to fill the practice bank. |
| Writing and Speaking | The old Groq prompts always led with IELTS and JSON parse failures could become apparently successful results. Structured scoring now checks exam and schema, and Speaking renders its provided criteria. Speaking remains transcript-only. |
| Full simulation | Active route is Simulado.jsx. It uses local quiz samples and heuristic Writing/Speaking scores. MockExam.jsx is an inactive prototype. Keep it until a separate cleanup confirms any intended future use. |
| Flashcards | The screen uses browser-scoped spaced repetition. The existing MongoDB API accepted caller-selected ownership and its review previously read then saved mutable data. Owner-scoped API operations and atomic review fix those problems. There is no migration between stores. |
| Models and Lumi | Preserved private study generation and response keys; the harness rejects invalid results and uses explicit exam context. Models now shows published entries and keeps new practice data in a UID-specific namespace. |
| YouTube and News | YouTube Study uses embeds and account-scoped local metadata; News uses bundled curated links. No news or YouTube API dependency was introduced. Live external media availability varies. |
| Notes and schedule | Browser-scoped persistence remains in place. Cross-device sync and conflict resolution are future work. |
| Firebase and MongoDB | Auth middleware had no route wiring. Private endpoints now verify tokens and bind them to owner filters. Admin authorization uses Firebase custom claims. Connections start before HTTP and shut down with the server. |
| Duplicates and unused files | MockExam.jsx, Result.js and default React/Vite SVGs appear unused by the active runtime. Study features contain similar local question and timer logic. Targeted behavior fixes were safer than removing dormant features or rewriting all practice modules. |
| AI and dependencies | The live route moved to the Google Gen AI SDK. The disconnected Groq adapter and its Axios dependency remain pending a real-project Gemini check. See security notes for the historical key finding. |
| Dependency security | Updated direct and transitive dependencies flagged by npm audit. The frontend Firebase Auth usage is preserved. A targeted Firestore dependency override removes the vulnerable gRPC copy installed by the Firebase umbrella package. |
| Infrastructure | Added a production container, bounded Cloud Run runtime design, independent Terraform roots, verification CI and an opt-in keyless release. Hosting enrollment, Atlas, egress, WIF, remote state and real release remain future operations. |

[Security findings](SECURITY.md) · [Technical documentation](TECHNICAL_DOCUMENTATION.md) · [Verification procedure](TESTING_GUIDE.md)

## Verification record

- Eight backend tests passed using a disposable MongoDB 6 instance for the database integration case. The suite covered Firebase authorization with mocked token verification, owner isolation, concurrent flashcard review, publication transitions, and the official Gemini SDK against a local HTTP mock.
- Frontend ESLint, the browser-storage test, and the production Vite build passed. Chrome completed both full simulations, DELF Reading and Listening, opened Models, and redirected unauthenticated admin access. A separate Chrome run covered the administrative UI with mocked Firebase and API responses.
- Docker Compose configuration and the production image build passed. The container ran as a non-root user and returned HTTP 200 on health and readiness with the disposable database. The existing MongoDB image major is retained for compatibility with the local volume.
- Terraform formatting, initialization with the remote backend disabled, and validation passed for dev, staging, and prod. Google provider v7.19.0 was installed with a signed checksum. No infrastructure plan was executed against a project.
- Both production npm audits reported zero vulnerabilities at verification time. Internal Markdown links and all five Mermaid diagrams were checked.
- Live Firebase sign-in and claim assignment, real Gemini output and quality, Atlas connectivity, cloud deployment, and microphone recognition were outside the executed verification. Review the release smoke checks before operating an external environment.

## Change inventory

### Modified files

| Files | Purpose |
| --- | --- |
| .gitignore, backend/.env.example, docker-compose.yml | Ignore local secrets and state, document Gemini/Firebase settings, isolate local database ports, and add an optional API container. |
| backend/package.json, backend/package-lock.json | Add the Gemini SDK, schema validation, Helmet, rate limiting and checks. Update flagged dependencies. |
| backend/src/app.js, server.js, config/db.js, config/firebase.js | Configure API boundaries, process and database lifecycle, and modular Firebase Admin. |
| backend/src/controllers/examController.js, flashcardController.js, userController.js | Translate AI responses to existing API contracts and enforce token ownership in profile and flashcard operations. |
| backend/src/middlewares/authMiddleware.js, errorHandler.js | Verify Firebase tokens and roles and return sanitized errors. |
| backend/src/routes/examRoutes.js, flashcardRoutes.js, userRoutes.js | Apply authentication, ownership-aware controllers, and student AI limits. |
| frontend/package.json, frontend/package-lock.json | Add the Node test command and update affected dependencies. |
| frontend/src/App.jsx, context/AuthProvider.jsx, services/api.js, services/studyAssistant.js, data/exams.js | Register the admin route, split route bundles, attach Firebase tokens and pass the selected exam. |
| frontend/src/pages/Reading.jsx, Listening.jsx, Writing.jsx, Speaking.jsx, Models.jsx, Simulado.jsx, Login.jsx, YouTubeStudy.jsx | Integrate the catalog and AI, display criterion feedback, prevent stale exam state, and limit error logging. |
| frontend/src/components/AIStudyAssistant.jsx, ExamSwitcher.jsx, speaking/SpeakingResult.jsx | Share exam selection and show service errors and transcript-based feedback. |
| frontend/src/services/flashcardsStorage.js, utils/examHistory.js | Resolve the storage helper from Node tests as well as Vite. |
| README.md, frontend/README.md, docs/TECHNICAL_DOCUMENTATION.md, docs/ELECTRON_PREPARATION.md | Document setup, data ownership, and readiness for the website and future desktop integration. |

### New files

| Files | Purpose |
| --- | --- |
| backend/Dockerfile, backend/.dockerignore | Build a non-root runtime image with a narrow build context and a health check. |
| backend/src/services/aiPrompts.js, aiHarness.js | Define prompts, structured outputs, provider calls, quotas and telemetry. |
| backend/src/middlewares/rateLimit.js | Share UID-based rate limiting across learner and admin routes. |
| backend/src/models/StudyContent.js, routes/contentRoutes.js, scripts/admin-role.js | Store publications, expose authenticated administrative workflows, and manage Firebase role claims. |
| frontend/src/pages/Admin.jsx | Provide the content workflow and operational overview. |
| backend/test/aiHarness.test.js, backend/test/http.test.js, frontend/test/storage.test.js | Cover AI contracts, HTTP guards, MongoDB persistence, publishing, and browser data separation. |
| .github/workflows/verify.yml, gcp-release.yml, firebase.json | Verify changes, prepare opt-in Cloud Run updates, and define static hosting behavior. |
| infra/terraform/environments/{dev,staging,prod} plus modules/elan and README.md | Define environment roots, example variables, provider locks, shared GCP resources, and validation steps. |
| docs/ENGINEERING_AUDIT.md, PROJECT_STRUCTURE.md, ARCHITECTURE_DECISIONS.md, SECURITY.md | Record findings, layout, decisions, and the historical security issue. |
| docs/GCP_DEPLOYMENT_GUIDE.md, TERRAFORM_GUIDE.md, AI_HARNESS.md, ADMIN_SYSTEM.md, API_REFERENCE.md, TESTING_GUIDE.md | Document setup, contracts, operations, and verification. |
| docs/architecture/SYSTEM_ARCHITECTURE.md, GCP_ARCHITECTURE.md, NETWORK_TOPOLOGY.md, AI_HARNESS_FLOW.md, DEPLOYMENT_FLOW.md | Show system, network, AI and release flows in Mermaid. |
