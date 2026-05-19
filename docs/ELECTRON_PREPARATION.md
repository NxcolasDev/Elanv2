# ELAN Electron Preparation

This project is ready to be prepared for Electron, but Electron should not be added until the web app is stable. The safest future path is to keep the existing frontend and backend architecture and let Electron orchestrate startup.

## Current Startup Flow

Development startup today:

```bash
cd backend
npm run dev

cd frontend
npm run dev
```

MongoDB can run through Docker:

```bash
docker compose up -d mongo
```

The frontend calls the backend through `VITE_API_BASE_URL`, defaulting to `http://localhost:5000`.

## Future Electron Shape

Recommended future structure:

```text
electron/
  main.js
  preload.js
  backendProcess.js
frontend/
backend/
docs/
```

Electron main process responsibilities:

- Start the backend automatically.
- Wait until the backend health check responds.
- Open the React app window.
- Stop the backend process when the desktop app closes.

Frontend responsibilities:

- Keep using `VITE_API_BASE_URL`.
- Avoid direct Node APIs in React.
- Use Electron preload only for desktop-specific capabilities later.
- Keep YouTube study lightweight by embedding user-provided video IDs instead of depending on the YouTube Data API.

Backend responsibilities:

- Keep Express independent so it can run in web, Docker, or desktop modes.
- Read configuration from environment variables.
- Avoid assuming a browser exists.

## Automatic Backend Startup

The future Electron main process can spawn the backend with Node:

```js
const { spawn } = require("child_process");

const backend = spawn("node", ["backend/src/server.js"], {
  env: {
    ...process.env,
    PORT: "5000",
    MONGO_URI: "mongodb://localhost:27017/elan",
  },
});
```

For production desktop builds, there are two options:

- Bundle a local database strategy, such as a user-managed MongoDB, embedded-compatible storage, or a cloud MongoDB connection.
- Keep MongoDB external and show a clear connection/setup screen.

The second option is easier for portfolio development. The first option is more polished but requires careful storage design.

## What Needs Adapting Later

- Add a backend health endpoint, for example `GET /api/health`.
- Preserve the existing `GET /api/health` endpoint so Electron can wait for backend readiness.
- Decide how MongoDB runs in desktop mode.
- Create Electron main and preload files.
- Configure packaging with a tool such as Electron Builder.
- Ensure `.env` values are loaded from a desktop-safe location.
- Decide whether AI keys remain local-only or are handled by a remote backend.
- Decide how to handle YouTube embeds in packaged desktop environments if an operating system or WebView policy blocks playback.

## Security Notes

- Do not expose AI keys to the renderer process.
- Keep React as a browser-like app and call Express over HTTP.
- Disable Node integration in the renderer.
- Use a preload script for any desktop-only bridge.
- Validate backend requests even in desktop mode, because desktop apps can still receive unexpected input.

## Recommended Next Step

Before implementing Electron fully, add:

- `GET /api/health`.
- A root `README.md` with setup commands.
- Optional scripts to start frontend and backend together during development.
- A decision about local MongoDB versus cloud MongoDB for desktop builds.
