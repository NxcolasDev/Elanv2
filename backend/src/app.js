const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { admin, published } = require("./routes/contentRoutes");

const app = express();
app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    const allowed = !origin || allowedOrigins.includes(origin);
    callback(allowed ? null : Object.assign(new Error("Origin not allowed by CORS"), { status: 403 }), allowed);
  },
}));
app.use(express.json({ limit: "128kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "elan-backend", timestamp: new Date().toISOString() });
});
app.get("/api/ready", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable" });
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/flashcards", require("./routes/flashcardRoutes"));
app.use("/api/admin", admin);
app.use("/api/content", published);
app.use(require("./middlewares/errorHandler"));

module.exports = app;
