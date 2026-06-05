# ELAN V2

ELAN is an AI-powered study platform for IELTS and DELF/DALF preparation. It uses a React/Vite frontend, a Node/Express backend, MongoDB for server data, Firebase Auth for login, and a Groq-compatible AI provider through the backend only.

## Project Structure

```text
backend/     Express API, MongoDB models, AI provider, auth middleware
frontend/    React app, study pages, Firebase client config
docs/        Technical notes and future Electron preparation
```

The browser never calls the AI provider directly. All AI requests go through the backend so provider keys stay out of frontend code.

## Environment Setup

Copy the example files and create your own local `.env` files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill `backend/.env` with your own private values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
AI_API_KEY=your_groq_api_key
```

Fill `frontend/.env` with your Firebase web app values:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

`AI_API_KEY` must be your own Groq API key. Do not reuse a key that was committed or exposed anywhere.

## Security Rules

Never commit real `.env` files, API keys, database URLs, passwords, tokens, service account files, or private credentials. Only `.env.example` files should be committed.

The backend `.env` is private because it contains `MONGO_URI` and `AI_API_KEY`. The frontend `VITE_*` values are public at runtime because they are bundled into browser JavaScript, so never put backend secrets there.

If a real key was ever pushed to GitHub, rotate or revoke it in the provider dashboard. Removing it from the latest commit is not enough because the old value may still exist in Git history.

## Development

Install dependencies in each app:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start MongoDB however you prefer. This repo includes Docker Compose for local database services:

```bash
docker compose up -d
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend expects the backend URL from `VITE_API_BASE_URL`. In local development, keep it pointed at the backend port you configured in `backend/.env`.

## AI Provider

The backend uses Groq's OpenAI-compatible chat completions endpoint. Set `AI_API_KEY` in `backend/.env` with your own Groq key.

The current provider implementation lives in `backend/src/services/aiProvider.js`. Keep provider credentials in the backend only.

## Git Hygiene

The repository ignores local environment files, dependency folders, and build output:

- `.env` files stay local.
- `.env.example` files are committed as safe templates.
- `node_modules/` is ignored.
- `dist/` and `build/` are ignored.

Before pushing, check:

```bash
git status
git diff --cached
```

## Documentation

More details are available in:

- `docs/TECHNICAL_DOCUMENTATION.md`
- `docs/ELECTRON_PREPARATION.md`
