const assert = require("node:assert/strict");
const test = require("node:test");
const { once } = require("node:events");
const { spawnSync } = require("node:child_process");
const { resolve } = require("node:path");
const { setDefaultBaseUrls } = require("@google/genai");
const express = require("express");
const mongoose = require("mongoose");
const firebaseAuth = require("../src/config/firebase");
const User = require("../src/models/user");
const Flashcard = require("../src/models/Flashcard");
const app = require("../src/app");

async function listen(t, application) {
  const server = application.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

function client(url) {
  return (path, { method = "GET", token, body, headers = {} } = {}) => fetch(url + path, {
    method,
    headers: { ...headers, ...(token && { Authorization: `Bearer ${token}` }),
      ...(body && { "Content-Type": "application/json" }) },
    body: body && JSON.stringify(body),
  });
}

function mockAuth(t) {
  t.mock.method(firebaseAuth, "verifyIdToken", async (token, checkRevoked) => {
    if (!["alice", "bob", "editor", "revoked"].includes(token) || (checkRevoked && token === "revoked")) {
      throw new Error("Invalid token");
    }
    return { uid: token, name: token, role: ["editor", "revoked"].includes(token) ? "admin" : "user" };
  });
}

test("production startup rejects the Firebase emulator before opening a listener", () => {
  const result = spawnSync(process.execPath, [resolve(__dirname, "../src/server.js")], {
    env: { ...process.env, NODE_ENV: "production", FIREBASE_PROJECT_ID: "elan-test",
      CORS_ORIGIN: "https://example.invalid", FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099" },
    encoding: "utf8", timeout: 5000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /startup.failed/);
  assert.doesNotMatch(result.stdout, /http.started/);
});

test("startup, auth guard, CORS, UID checks and Gemini SDK contract over HTTP", async (t) => {
  mockAuth(t);
  const api = client(await listen(t, app));
  delete process.env.GEMINI_API_KEY;
  assert.equal((await api("/api/health")).status, 200);
  assert.equal((await api("/api/ready")).status, 503);
  assert.equal((await api("/api/health", { headers: { origin: "https://example.invalid" } })).status, 403);
  const post = (mode, token, extra) => api("/api/exams/generate", { method: "POST", token, body: { mode, ...extra } });
  assert.equal((await post("topics")).status, 200);
  assert.equal((await (await post("reading")).json()).code, "AI_PROVIDER_UNAVAILABLE");
  assert.equal((await api("/api/admin/status")).status, 401);
  assert.equal((await api("/api/admin/status", { token: "alice" })).status, 403);
  assert.equal((await api("/api/admin/status", { token: "revoked" })).status, 401);
  assert.equal((await api("/api/admin/status", { token: "editor" })).status, 200);
  assert.equal((await api("/api/users/alice", { token: "bob" })).status, 403);
  assert.equal((await api("/api/flashcards/alice", { token: "bob" })).status, 403);
  assert.equal((await api("/api/flashcards", {
    token: "bob", method: "POST", body: { userId: "alice", front: "x", back: "y", deckName: "z" },
  })).status, 403);
  assert.equal((await api("/api/flashcards/alice")).status, 401);

  const model = {
    title: "Example", level: "B2", model: "Voici une lettre.", whyUseThis: "Structure",
    whenToUse: "Writing practice", scoreImpact: "Cohesion", typicalLevel: "B2",
    examples: ["Un", "Deux", "Trois"], practicePrompt: "Ecrivez une lettre.",
  };
  const gemini = express();
  gemini.use(express.json());
  let request;
  gemini.post(/:generateContent$/, (req, res) => {
    request = req.body;
    res.json({
      candidates: [{ finishReason: "STOP", content: { role: "model", parts: [{ text: JSON.stringify(model) }] } }],
      usageMetadata: { promptTokenCount: 20, candidatesTokenCount: 50, totalTokenCount: 70 },
    });
  });
  setDefaultBaseUrls({ geminiUrl: await listen(t, gemini) });
  process.env.GEMINI_API_KEY = "dummy-test-key";
  t.after(() => {
    setDefaultBaseUrls({});
    delete process.env.GEMINI_API_KEY;
  });
  assert.equal((await post("studyAssistant", undefined, { text: "test" })).status, 401);
  const result = await post("modelStudy", "alice", { exam: "DELF", focus: "Correspondance" });
  assert.equal(result.status, 200);
  assert.deepEqual((await result.json()).model, model);
  assert.equal(request.generationConfig.responseMimeType, "application/json");
  assert.ok(request.generationConfig.responseJsonSchema.properties.examples);
  assert.match(request.systemInstruction.parts[0].text, /French/);
  assert.deepEqual(JSON.parse(request.contents[0].parts[0].text), { focus: "Correspondance" });
});

test("MongoDB persistence, flashcard ownership and publication lifecycle", {
  skip: !process.env.ELAN_TEST_MONGO_URI,
}, async (t) => {
  mockAuth(t);
  const api = client(await listen(t, app));
  // Use an isolated database name even when the MongoDB server is shared.
  await mongoose.connect(process.env.ELAN_TEST_MONGO_URI, {
    dbName: `elan_test_${crypto.randomUUID().replaceAll("-", "")}`, serverSelectionTimeoutMS: 4000,
  });
  t.after(() => mongoose.disconnect());
  assert.equal((await api("/api/ready")).status, 200);
  const sync = (token) => api("/api/users/sync", { token, method: "POST", body: { role: "admin", firebaseUid: "other" } });
  await User.init();
  const [first, second] = await Promise.all([sync("alice"), sync("alice")]);
  assert.equal((await first.json()).firebaseUid, "alice");
  assert.equal((await second.json()).firebaseUid, "alice");
  assert.equal(await User.countDocuments(), 1);
  const created = await api("/api/flashcards", {
    token: "alice", method: "POST", body: { front: "Bonjour", back: "Hello", deckName: "French" },
  });
  assert.equal(created.status, 200);
  const { _id: cardId } = await created.json();
  const review = (token) => api(`/api/flashcards/review/${cardId}`, { token, method: "PUT", body: { quality: "good" } });
  assert.equal((await review("bob")).status, 404);
  assert.equal((await api(`/api/flashcards/${cardId}`, { token: "bob", method: "DELETE" })).status, 404);
  assert.equal((await (await review("alice")).json()).interval, 2);
  const concurrent = await Promise.all([review("alice"), review("alice")]);
  const results = await Promise.all(concurrent.map((response) => response.json()));
  assert.deepEqual(results.map(({ interval }) => interval).sort((a, b) => a - b), [4, 8]);
  assert.equal((await Flashcard.findById(cardId)).userId, "alice");

  const bank = "/api/admin/content";
  const list = "/api/content/IELTS/modelStudy";
  const payload = {
    title: "Task 2", level: "Band 7", model: "A sample essay.", whyUseThis: "Clear topic",
    whenToUse: "An opinion essay", scoreImpact: "Coherence", typicalLevel: "Band 7",
    examples: ["A", "B", "C"], practicePrompt: "Write an opinion essay.",
  };
  const add = await api(bank, { token: "editor", method: "POST", body: { kind: "modelStudy", exam: "IELTS", payload } });
  assert.equal(add.status, 201);
  const draft = await add.json();
  const update = (item, action) => api(`${bank}/${item._id}`, { token: "editor", method: "PATCH",
    body: { action, revision: item.__v } });
  assert.deepEqual(await (await api(list)).json(), []);
  assert.equal((await update(draft, "publish")).status, 409);
  const reviewed = await (await update(draft, "review")).json();
  assert.equal(reviewed.status, "reviewed");
  assert.equal((await update(draft, "publish")).status, 409);
  const published = await (await update(reviewed, "publish")).json();
  assert.equal(published.status, "published");
  assert.deepEqual(await (await api(list)).json(), [{ id: draft._id, payload }]);
  assert.equal((await update(published, "unpublish")).status, 200);
  assert.deepEqual(await (await api(list)).json(), []);
});
