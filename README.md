# ÉLAN

<p align="center"><img src="./Assets/banner.png" width="100%" alt="ÉLAN"></p>

[![React](https://img.shields.io/badge/React-UI-20232A?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-storage-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Terraform](https://img.shields.io/badge/Terraform-GCP-844FBA?logo=terraform)](https://developer.hashicorp.com/terraform)

## Project Overview

ÉLAN is a full-stack study workspace for IELTS and DELF/DALF practice. The browser provides bundled study material and stores personal study progress locally. The API manages authenticated profiles, published content, and optional Gemini features.

## Problem & Solution

Exam preparation often spreads practice material, review schedules, and feedback across several tools. ÉLAN brings them together in a single workspace with exam-specific practice and a repeatable review routine.

## Features

- Reading, Listening, Writing, and Speaking practice, plus a four-skill simulation.
- Models and vocabulary resources, Lumi study assistance, YouTube embeds, and curated news.
- Flashcards with spaced repetition, notes, study schedules, achievement indicators, and exam history.
- Google sign-in through Firebase and an administrative publishing workflow.
- Optional Gemini feedback and practice for signed-in learners.

## Screenshots

| Dashboard | Flashcards |
| --- | --- |
| ![Dashboard](./Assets/Dashboard.png) | ![Flashcards](./Assets/flashcards.png) |

| Models | Simulation |
| --- | --- |
| ![Models](./Assets/Models.png) | ![Simulation](./Assets/Simulation.png) |

[YouTube Study screenshot](./Assets/Youtube.png)

## Tech Stack

React, Vite, Tailwind CSS, React Router, Firebase Authentication, Node.js, Express, Mongoose, MongoDB, Google Gen AI SDK, AJV, Docker Compose, Terraform, and GitHub Actions.

## System Architecture

Vite builds the React SPA. Firebase signs users in and issues ID tokens that Express verifies for private operations. MongoDB stores profiles, API flashcards, and curated content. Study history, notes, schedules, and the flashcard screen use browser storage. [System diagram](docs/architecture/SYSTEM_ARCHITECTURE.md) · [Technical documentation](docs/TECHNICAL_DOCUMENTATION.md)

## AI Engineering

The backend applies versioned IELTS and DELF prompts, validates structured output, and limits request size, concurrency, output tokens, and attempts. The practice score is an estimate. Speaking feedback uses transcripts. [AI harness](docs/AI_HARNESS.md)

## Admin System

Sign in and open /admin with a Firebase account granted the admin claim. Admins can preview exercises and models, save and edit drafts, review content, and publish or unpublish it. [Role setup and workflow](docs/ADMIN_SYSTEM.md)

## Google Cloud Architecture

The proposed environment uses Firebase Hosting for the SPA, Cloud Run for Express, Artifact Registry for images, Secret Manager for credentials, and Cloud Logging and Monitoring. MongoDB Atlas is the external database. [GCP design](docs/architecture/GCP_ARCHITECTURE.md)

## Terraform Infrastructure

The dev, staging, and production roots share one module. Validation runs without a remote backend. [Terraform guide](infra/terraform/README.md)

## Local Development

Clone [NxcolasDev/Elanv2](https://github.com/NxcolasDev/Elanv2) and use Node.js 24 with npm. Copy backend/.env.example and frontend/.env.example to .env in their respective folders. Configure Firebase on both sides and start MongoDB.

```bash
npm ci --prefix backend
npm ci --prefix frontend
docker compose up -d mongo
npm run dev --prefix backend
# In a separate terminal:
npm run dev --prefix frontend
```

Open http://localhost:5173. The API lives at http://localhost:5000 and exposes /api/health and /api/ready.

## Docker Setup

Compose starts MongoDB with a named volume. Mongo Express is available on the local loopback at port 8081. The optional api profile runs Express in a container with a read-only ADC file specified through ELAN_ADC_FILE. Use `docker compose --profile api up --build` after setting that path and backend/.env. [Container and database details](docs/TECHNICAL_DOCUMENTATION.md)

## Environment Variables

| Scope | Variables |
| --- | --- |
| Backend | `PORT`, `MONGO_URI`, `CORS_ORIGIN`, `NODE_ENV`, `FIREBASE_PROJECT_ID` |
| Local authentication | Application Default Credentials, optionally pointed to by `GOOGLE_APPLICATION_CREDENTIALS` |
| AI | `GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_CONCURRENCY`, `AI_DAILY_ATTEMPTS` |
| Frontend | `VITE_API_BASE_URL` and public `VITE_FIREBASE_*` configuration |

See the commented [backend template](backend/.env.example) and [frontend template](frontend/.env.example). Leave the backend Gemini key empty for local study without remote AI.

## Testing

```bash
npm run check --prefix backend
npm test --prefix backend
npm run lint --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
docker compose config --quiet
terraform fmt -check -recursive infra/terraform
```

The backend suite tests the official SDK against a local mock server and supports an isolated MongoDB integration test. [Testing guide](docs/TESTING_GUIDE.md)

## Security

Access control uses Firebase identities and per-user database filters. Administrative routes also check token revocation. Keep backend credentials out of Git, Vite variables, and container layers. [Security documentation and historical key finding](docs/SECURITY.md)

## Deployment Strategy

The verification workflow runs lint, tests, build, dependency audits, Docker, and Terraform. The manual backend release workflow requires a repository flag, the default branch, a configured environment, and Workload Identity Federation. [Future deployment guide](docs/GCP_DEPLOYMENT_GUIDE.md)

## Roadmap

- Validate Gemini feedback against an educator-reviewed dataset in both languages.
- Expand curated question banks and align practice scores with exam rubrics.
- Add cross-device study sync with a migration for browser data.
- Revisit the [Electron preparation](docs/ELECTRON_PREPARATION.md) after the web release is stable.

## Project Status

**Cloud infrastructure designed and implemented as code, but not deployed to GCP due to cost considerations.**

[Engineering audit](docs/ENGINEERING_AUDIT.md) · [Project structure](docs/PROJECT_STRUCTURE.md) · [Architecture decisions](docs/ARCHITECTURE_DECISIONS.md) · [API reference](docs/API_REFERENCE.md)

## Author

Nicolas Silva
