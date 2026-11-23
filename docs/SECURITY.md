# Security

## Application boundaries

- Firebase Admin verifies ID tokens. Profile and flashcard operations derive the owner from the token. Admin routes require the custom role claim and check revocation. Production startup rejects Firebase emulator configuration.
- CORS uses an explicit origin list. Helmet adds API response headers. JSON requests have a size cap. API errors omit upstream bodies and sensitive provider data.
- The Gemini key and MongoDB URI belong to backend configuration. Firebase browser configuration is public by design. Keep all server credentials out of VITE_ variables, Git, logs, and images.
- Cloud Run operates with a dedicated runtime identity and access to specific secrets. GitHub Actions uses WIF with repository and branch/environment restrictions. Operator access to set Firebase claims is a separate permission.
- Keep retention and access policies for logs with identity references. Generation telemetry excludes learner inputs and outputs.
- Local browser namespaces prevent accidental mixing between accounts in app navigation. A person with control of the browser profile can access its storage. MongoDB API authorization is enforced independently. Existing shared Models and YouTube storage keys are retained for recovery. The application cannot assign ownership to those legacy values, so new sessions read separate per-account keys.

## Git history finding

A historical backend/.env entry in commit 31238be contains a Groq key matching the provider's credential format. Treat it as compromised regardless of its present status. Revoke or rotate it in the provider console and inspect usage and billing. Commit eed26b5 also contained a variable named GROK_API_KEY with a value of unknown validity. Review it under the same incident. The current branch ignores environment files. Coordinate history remediation separately if required, since old clones can retain previously published commits. This review used known token shapes and historical configuration paths. Broader secret detection remains a separate check.

## Dependency review

The CI job audits production dependencies from both lockfiles and fails on high or critical issues. Review advisories when upgrading lockfiles. See the engineering audit for the results of this pass.

[Admin permissions](ADMIN_SYSTEM.md) · [Network topology](architecture/NETWORK_TOPOLOGY.md)
