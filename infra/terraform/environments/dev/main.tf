terraform {
  required_version = ">= 1.13, < 2.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.19.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "elan" {
  source                = "../../modules/elan"
  environment           = "dev"
  project_id            = var.project_id
  region                = var.region
  release               = var.release
  monitoring_enabled    = var.monitoring_enabled
  notification_channels = var.notification_channels
}

output "infrastructure" {
  value = module.elan
}
