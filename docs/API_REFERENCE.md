# API reference

JSON API on http://localhost:5000 locally. Private routes use Authorization: Bearer FIREBASE_ID_TOKEN. For backward compatibility the API also accepts a raw Firebase ID token in that header.

| Method and path | Access | Contract |
| --- | --- | --- |
| GET /api/health | Public | Process health |
| GET /api/ready | Public | 200 when MongoDB is connected, otherwise 503 |
| POST /api/users/sync | Authenticated | Find or create the token holder's profile |
| GET /api/users/:uid | Owner | Read one profile |
| GET /api/flashcards/:userId | Owner | List API flashcards |
| POST /api/flashcards | Authenticated | Create a card from deckName, front and back |
| PUT /api/flashcards/review/:id | Owner | Reschedule using quality again, hard, good or easy |
| DELETE /api/flashcards/:id | Owner | Delete one card belonging to the token holder |
| POST /api/exams/generate | Public topics, signed-in AI | mode, exam, and optional text, focus or context |
| GET /api/results | Public placeholder | Service message. Exam history is stored in the browser. |
| GET /api/content/:exam/:kind | Public | Array of id and payload for published records |
| GET /api/admin/status | Admin | Database, key configuration and process quota status |
| GET /api/admin/generations | Admin | Recent process generation metadata |
| GET /api/admin/content?before=OBJECT_ID | Admin | Up to 25 records, newest first |
| POST /api/admin/preview | Admin | Generate and validate payload for kind, exam and optional focus |
| POST /api/admin/content | Admin | Validate and save a draft from kind, exam and payload |
| PATCH /api/admin/content/:id | Admin | Apply action edit, review, publish or unpublish with revision from the record’s __v value. Edit also requires payload. |

Exam generation returns success plus topics, correction, feedback, data, model, or answer according to mode. exam defaults to IELTS. AI can return 400 for invalid input, 429 for quotas, 502 for upstream/output errors, 503 when disabled, and 504 for a timeout. A disabled provider returns the AI_PROVIDER_UNAVAILABLE code and aiUnavailable flag. Authorization failures return 401 or 403. Scoped mutations on absent cards return 404. Stale and invalid publication transitions return 409.

[Prompt and response details](AI_HARNESS.md)
