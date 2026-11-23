# Testing guide

## Local and CI checks

```bash
npm ci --prefix backend
npm ci --prefix frontend
npm run check --prefix backend
npm test --prefix backend
npm run lint --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
npm audit --omit=dev --prefix backend
npm audit --omit=dev --prefix frontend
docker compose --profile api config --quiet
docker build -t elan-backend:local ./backend
```

Set ELAN_TEST_MONGO_URI to a local test server URI for the integration suite. It uses a unique database name for each run. CI supplies a disposable MongoDB service. Keep the test URI separate from production credentials and data.

The SDK HTTP test runs a local fake Gemini server with a dummy API key. Firebase verification is mocked in route tests. The unit fixtures cover malformed JSON, missing evidence, duplicate questions, Writing/Speaking feedback, exam-specific instructions, Lumi, models, retry, quotas and safe errors. Browser-storage tests check flashcard rescheduling and history by user. Terraform validation is described in the [infrastructure guide](../infra/terraform/README.md).

## Release smoke checks

Exercise public practice with Gemini disabled. Sign in to the staging Firebase project using a student and an admin. Verify a student cannot access the admin API or another profile. Generate one sample for each skill and exam using staging quotas. Review a draft, publish it, verify the study page can open it, and unpublish it. Confirm that local flashcards, notes, schedule and mock exam history survive restart and account changes. Verify microphone access and speech synthesis in supported browsers. Check that provider and startup failures surface readable errors and leave sensitive data out of logs.

[Automated evaluation limits](AI_HARNESS.md) · [Engineering audit](ENGINEERING_AUDIT.md)
