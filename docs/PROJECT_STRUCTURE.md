# Project structure

| Location | Responsibility |
| --- | --- |
| frontend/src/pages | Study flows, dashboard, history, and admin entry point |
| frontend/src/components | Shared controls, layout elements, and Lumi |
| frontend/src/context and hooks | Firebase session and exam selection |
| frontend/src/services and utils | API client, browser persistence, history, and scoring |
| frontend/src/data | Bundled exam material, models, media, news, and achievement definitions |
| backend/src/app.js and server.js | Express composition and process lifecycle |
| backend/src/routes, controllers, middlewares | HTTP endpoints, ownership, authentication, and error handling |
| backend/src/models | MongoDB profiles, flashcards, published content, and legacy result model |
| backend/src/services | Prompt registry, Gemini adapter, output validation, limits, and logs |
| backend/scripts/admin-role.js | Operator-only Firebase role management |
| backend/test and frontend/test | Regression suites |
| docs/architecture | System, network, cloud, AI, and release diagrams |
| infra/terraform | Three environment roots and a shared GCP module |
| .github/workflows | Verification and opt-in backend release |
| Assets | Existing README banner and screenshots |
