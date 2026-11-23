terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

locals {
  name = "elan-${var.environment}"
  services = toset([
    "artifactregistry.googleapis.com",
    "compute.googleapis.com",
    "identitytoolkit.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
  ])
  secrets = toset(["GEMINI_API_KEY", "MONGO_URI"])
  labels  = { application = "elan", environment = var.environment, managed_by = "terraform" }
}

resource "google_project_service" "api" {
  for_each           = local.services
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "backend" {
  project       = var.project_id
  location      = var.region
  repository_id = local.name
  format        = "DOCKER"
  labels        = local.labels
  depends_on    = [google_project_service.api]
}

resource "google_service_account" "runtime" {
  project      = var.project_id
  account_id   = "${local.name}-runtime"
  display_name = "ELAN Cloud Run (${var.environment})"
}

resource "google_project_iam_member" "auth_lookup" {
  project    = var.project_id
  role       = "roles/firebaseauth.viewer"
  member     = "serviceAccount:${google_service_account.runtime.email}"
  depends_on = [google_project_service.api]
}

resource "google_secret_manager_secret" "backend" {
  for_each  = local.secrets
  project   = var.project_id
  secret_id = "${local.name}-${lower(replace(each.key, "_", "-"))}"
  labels    = local.labels
  replication {
    auto {}
  }
  depends_on = [google_project_service.api]
}

resource "google_secret_manager_secret_iam_member" "runtime" {
  for_each  = google_secret_manager_secret.backend
  project   = var.project_id
  secret_id = each.value.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_cloud_run_v2_service" "api" {
  count                = var.release == null ? 0 : 1
  project              = var.project_id
  location             = var.region
  name                 = local.name
  labels               = local.labels
  deletion_protection  = var.environment == "prod"
  ingress              = "INGRESS_TRAFFIC_ALL"
  invoker_iam_disabled = true

  template {
    service_account                  = google_service_account.runtime.email
    timeout                          = "60s"
    max_instance_request_concurrency = 20
    scaling {
      min_instance_count = 0
      max_instance_count = var.release.max_instances
    }
    vpc_access {
      egress = "ALL_TRAFFIC"
      network_interfaces {
        network    = var.release.network
        subnetwork = var.release.subnetwork
      }
    }
    containers {
      image = var.release.image
      ports {
        container_port = 8080
      }
      resources {
        limits = { cpu = "1", memory = "512Mi" }
      }
      dynamic "env" {
        for_each = {
          NODE_ENV            = "production"
          FIREBASE_PROJECT_ID = var.project_id
          CORS_ORIGIN         = var.release.cors_origin
          GEMINI_MODEL        = var.release.gemini_model
          AI_DAILY_ATTEMPTS   = tostring(var.release.daily_attempts)
        }
        content {
          name  = env.key
          value = env.value
        }
      }
      dynamic "env" {
        for_each = var.release.secret_versions
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.backend[env.key].secret_id
              version = env.value
            }
          }
        }
      }
      startup_probe {
        http_get {
          path = "/api/ready"
        }
        period_seconds    = 4
        timeout_seconds   = 3
        failure_threshold = 10
      }
      liveness_probe {
        http_get {
          path = "/api/health"
        }
        period_seconds    = 30
        timeout_seconds   = 3
        failure_threshold = 3
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }
  depends_on = [google_secret_manager_secret_iam_member.runtime, google_project_iam_member.auth_lookup]
}

resource "google_monitoring_uptime_check_config" "api" {
  count        = var.release != null && var.monitoring_enabled ? 1 : 0
  project      = var.project_id
  display_name = "${local.name}-readiness"
  timeout      = "10s"
  period       = "300s"
  http_check {
    path           = "/api/ready"
    port           = 443
    use_ssl        = true
    validate_ssl   = true
    request_method = "GET"
  }
  monitored_resource {
    type   = "uptime_url"
    labels = { project_id = var.project_id, host = trimprefix(google_cloud_run_v2_service.api[0].uri, "https://") }
  }
}

resource "google_monitoring_alert_policy" "api" {
  count                 = var.release != null && var.monitoring_enabled && length(var.notification_channels) > 0 ? 1 : 0
  project               = var.project_id
  display_name          = "${local.name} readiness failure"
  combiner              = "OR"
  notification_channels = var.notification_channels

  conditions {
    display_name = "Multiple probes reported an unhealthy API"
    condition_threshold {
      filter          = "metric.type = \"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type = \"uptime_url\" AND metric.labels.check_id = \"${google_monitoring_uptime_check_config.api[0].uptime_check_id}\""
      comparison      = "COMPARISON_GT"
      threshold_value = 1
      duration        = "300s"
      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
      }
    }
  }
}
