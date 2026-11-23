output "api_url" {
  value = one(google_cloud_run_v2_service.api[*].uri)
}

output "registry" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.backend.repository_id}"
}

output "runtime_service_account" {
  value = google_service_account.runtime.email
}

output "secret_ids" {
  value = { for key, secret in google_secret_manager_secret.backend : key => secret.secret_id }
}
