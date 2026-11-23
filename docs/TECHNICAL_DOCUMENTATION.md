# Technical documentation

## Application

React handles the study UI, Vite produces the static bundle, and Tailwind supplies styling. Express is the HTTP boundary for authentication, persistent API data, and Gemini. Mongoose defines MongoDB documents and translates queries. Firebase handles Google sign-in so ÉLAN can verify a signed ID token without maintaining passwords. [System architecture](architecture/SYSTEM_ARCHITECTURE.md)

## What each store owns

| Data | Store and behavior |
| --- | --- |
| Firebase account and admin claim | Firebase Authentication |
| Learner profile | MongoDB, indexed by Firebase UID and created at profile sync |
| Student flashcard screen | Per-UID browser storage, with due dates and spaced repetition. Device and browser scope apply. |
| Flashcard API | MongoDB, with owner-scoped queries and atomic review updates. The browser flashcard screen uses its own store. |
| Exam history, achievements, notes, and schedule | Per-UID browser storage. Dashboard and achievement views derive values from practice history and other local activity. |
| Models practice and YouTube sessions | Per-UID browser storage for new activity. Pre-existing unscoped keys remain in the browser. |
| Curated questions and models | MongoDB, where publication status controls visibility |
| Generation metadata | Structured stdout plus a recent history buffer per API instance |

Profile sync derives identity from Firebase token claims. A legacy profile remains readable by its owner. The browser sends an ID token on configured API requests. The backend checks revocation for admin operations and enforces role authorization. [API reference](API_REFERENCE.md) · [Security](SECURITY.md)

For legacy Models or YouTube entries you own, back up the old browser values and the destination account keys before copying or merging data. Use the same key with a dot followed by the intended Firebase UID. Shared values are never automatically assigned to an account.

## Practice

Writing and Speaking send bounded learner text to the backend. The user-facing score uses the selected rubric. DELF/DALF Writing and Speaking display a result out of 25 and normalize it onto the existing 100-point history scale. The full simulation uses local material and heuristic writing and speaking scores. Listening uses browser speech synthesis. Speaking capture depends on the browser speech recognition implementation and microphone permission. News is curated data. YouTube Study embeds a video ID and uses local notes.

## Containers and persistence

The API image installs locked production dependencies in a build stage and runs as the Node user. MongoDB starts independently under Compose and retains its named volume. Local host access binds to 127.0.0.1. The optional api profile loads backend/.env, uses the Compose MongoDB hostname, and mounts local ADC read-only. On Linux the ADC file must be readable by the container's Node user. Express connects to MongoDB before listening on PORT and drains the server on termination. /api/health checks the process. /api/ready reports MongoDB connection status.

[Local commands](../README.md) · [AI harness](AI_HARNESS.md) · [GCP design](architecture/GCP_ARCHITECTURE.md) · [Electron preparation](ELECTRON_PREPARATION.md)
