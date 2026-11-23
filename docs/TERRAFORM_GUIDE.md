# Terraform guide

dev, staging and prod are independent roots that call the same GCP module. Use separate project IDs and state per environment. The shared module manages API enablement, Artifact Registry, runtime IAM, Secret Manager containers and access bindings. Release settings activate Cloud Run. Optional Monitoring adds a public readiness probe and a policy when notification channels are supplied.

Set release to null during a deliberately authorized bootstrap. For a real release, use a pushed digest, numeric secret versions, HTTPS CORS origins, and existing network/subnet identifiers. Prod protects the API service against deletion by default. The GitHub release workflow owns subsequent image updates. Terraform manages runtime configuration and ignores revision-image drift.

Firebase Hosting configuration lives in the root firebase.json. The hosting site, Firebase Auth enrollment, WIF identity provider, Atlas and VPC egress infrastructure are external prerequisites.

[Commands and remote state](../infra/terraform/README.md) · [Deployment steps](GCP_DEPLOYMENT_GUIDE.md)
