# Terraform

Requires Terraform 1.13.5 or another compatible 1.x version and access to download the pinned provider. From the repository root:

```bash
terraform fmt -check -recursive infra/terraform
for stage in dev staging prod; do
  terraform -chdir="infra/terraform/environments/$stage" init -backend=false -input=false
  terraform -chdir="infra/terraform/environments/$stage" validate
done
```

These commands require no project credentials and create no GCP resources. Each root has a terraform.tfvars.example. Copy it to a local terraform.tfvars only when planning for an authorized environment. Use secret version IDs in Terraform and manage secret values independently.

## Remote state for an authorized release

Provision the GCS state bucket independently under an authorized process with versioning, public access prevention, uniform access and appropriate IAM. Configure a GCS backend block within the target root before first use and provide the bucket and unique environment prefix through an ignored backend.tfbackend file. Use a separate state IAM principal and account per environment where practical. If a local state already exists, review the Terraform migration and backups before proceeding. Keep .terraform.lock.hcl tracked. No backend is currently active in source.

[Terraform design](../../docs/TERRAFORM_GUIDE.md) · [GCS backend reference](https://developer.hashicorp.com/terraform/language/backend/gcs) · [Future GCP release](../../docs/GCP_DEPLOYMENT_GUIDE.md)
