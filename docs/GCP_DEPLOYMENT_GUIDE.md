# GCP deployment guide

This is a future runbook. The repository contains infrastructure code and an opt-in update workflow.

## Prepare an environment

1. Choose a dedicated GCP/Firebase project, billing budget and region for the target environment. Configure Google as a Firebase Auth provider and register the web app and Hosting domain.
2. Prepare an Atlas database with a dedicated least-privilege database user, backups appropriate for the environment, and a regional GCP Direct VPC subnet plus Cloud NAT with a reserved egress address. Add only that address to the Atlas access list. Set up the associated Cloud Router and firewall policy. Keep staging credentials and data separate.
3. Bootstrap remote state independently, then follow the [Terraform guide](../infra/terraform/README.md). Review the bootstrap plan before supplying a release. Put MongoDB URI and Gemini key in Secret Manager through a secure operator channel. Keep their values out of Terraform.
4. Build the Linux AMD64 backend and publish the image to the environment's Artifact Registry. Populate release with the immutable image reference, numeric secret versions, Firebase Hosting origin, and actual egress network identifiers. Review the release plan and route access.
5. Verify /api/ready, the expected Origin headers, Firebase sign-in, administrator permissions, a small Gemini smoke test, and Atlas backup/restore. Build the SPA with the correct Vite configuration. Deploy firebase.json and frontend/dist to the intended existing Firebase Hosting site using an authorized operator.

## Optional GitHub backend releases

Create protected staging and prod GitHub Environments and require review for production. Create a GCP Workload Identity Federation provider with a repository ID and environment/ref condition. Authorize its principal to impersonate only the target release service account. Scope artifactregistry.writer to the repository, run.developer to the existing Cloud Run service, and iam.serviceAccountUser to the runtime account. The release identity needs no access to secret values or Firebase user management.

Define GCP_PROJECT, GCP_REGION, CLOUD_RUN_SERVICE, ARTIFACT_REPOSITORY, GCP_WIF_PROVIDER, and GCP_RELEASE_SERVICE_ACCOUNT as environment variables in GitHub. Enable the ELAN_ENABLE_GCP_DEPLOY repository variable explicitly. Dispatch from the default branch after verification passes. The workflow verifies the target service exists, pushes an image and updates the existing service by digest. The frontend is released independently. Roll back to a known Cloud Run revision or Firebase Hosting release and check readiness and authorization again.

## Cost and operations

Configure budgets and notifications before provisioning, cap Cloud Run instances, review Artifact Registry retention, and confirm current Atlas tier, NAT, Hosting, logging and Gemini pricing. Budget notifications are alerts. Configure provider-level Gemini quotas to cap multi-instance demand. Investigate readiness and provider errors in Cloud Logging. Monitor cold starts and request latency before raising instance minima.

[Deployment flow](architecture/DEPLOYMENT_FLOW.md) · [Cloud Run secrets](https://cloud.google.com/run/docs/configuring/services/secrets) · [GitHub OIDC for Google Cloud](https://github.com/google-github-actions/auth) · [Firebase Hosting config](https://firebase.google.com/docs/hosting/full-config)
