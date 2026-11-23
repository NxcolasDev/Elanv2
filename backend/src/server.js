require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const { once } = require("node:events");
const app = require("./app");
const connectDB = require("./config/db");

async function start() {
  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT_INVALID");
  if (process.env.NODE_ENV === "production" && (!process.env.CORS_ORIGIN || !process.env.FIREBASE_PROJECT_ID)) {
    throw new Error("PRODUCTION_CONFIG_REQUIRED");
  }
  if (process.env.NODE_ENV === "production" && process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error("PRODUCTION_AUTH_EMULATOR");
  }
  await connectDB();
  const server = app.listen(port, "0.0.0.0");
  await once(server, "listening");
  console.info(JSON.stringify({ event: "http.started", port }));
  let stopping = false;
  async function shutdown() {
    if (stopping) return;
    stopping = true;
    const timer = setTimeout(() => process.exit(1), 9000);
    timer.unref();
    try {
      await new Promise((resolve) => server.close(resolve));
      await mongoose.disconnect();
    } finally {
      clearTimeout(timer);
    }
  }
  for (const signal of ["SIGTERM", "SIGINT"]) {
    process.on(signal, () => shutdown().catch(() => { process.exitCode = 1; }));
  }
}

start().catch(async (error) => {
  console.error(JSON.stringify({ event: "startup.failed", type: error.name, code: error.code }));
  process.exitCode = 1;
  await mongoose.disconnect();
});
