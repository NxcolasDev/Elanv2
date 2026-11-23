# Architecture decisions

| Decision | Rationale and trade-off |
| --- | --- |
| Keep the React SPA and Express monolith | Existing study flows share one frontend and one API. A single service keeps development and release predictable. |
| Keep Firebase Authentication | Verified tokens preserve the existing sign-in experience. Custom claims give administrators a role that clients cannot self-assign. |
| Preserve browser storage and existing MongoDB collections | A cloud migration needs conflict resolution and user consent. Current local studies keep their original data and behavior. |
| Centralize Gemini usage | One harness governs schema validation, costs and logging. Prompts remain task-specific. |
| Require explicit review before publishing | Generated study materials may contain plausible but wrong answers. The draft stage gives editors a chance to correct them. |
| Choose Firebase Hosting and Cloud Run | A static SPA needs a CDN and rewrites. Cloud Run hosts a stateless API with container packaging and an instance cap. A Storage/CDN load balancer adds setup that the current SPA can avoid. |
| Keep Atlas for production MongoDB | Existing Mongoose schemas can run without a database rewrite. TLS and a fixed allowlisted egress address give the database a bounded access path. |
| Use separate Terraform roots and one module | Each environment has its own project and state. Reusing the module keeps IAM and runtime settings consistent. |
| Use an explicitly gated release with WIF | GitHub exchanges identity for short-lived access. Terraform owns infrastructure and the release workflow owns subsequent image revisions. |

[Network design](architecture/NETWORK_TOPOLOGY.md) · [Deployment](GCP_DEPLOYMENT_GUIDE.md)
