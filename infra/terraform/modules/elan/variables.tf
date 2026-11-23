variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Use dev, staging or prod."
  }
}

variable "release" {
  description = "Existing image, Direct VPC egress resources and numeric Secret Manager version IDs. Null bootstraps only supporting resources."
  type = object({
    image           = string
    cors_origin     = string
    network         = string
    subnetwork      = string
    secret_versions = map(string)
    gemini_model    = optional(string, "gemini-3.8-flash")
    max_instances   = optional(number, 2)
    daily_attempts  = optional(number, 100)
  })
  default = null

  validation {
    condition = var.release == null ? true : (
      can(regex("@sha256:[0-9a-f]{64}$", var.release.image)) &&
      alltrue([for origin in split(",", var.release.cors_origin) : can(regex("^https://[A-Za-z0-9.-]+(:[0-9]+)?$", trimspace(origin)))]) &&
      length(var.release.secret_versions) == 2 &&
      alltrue([for key, version in var.release.secret_versions : contains(["GEMINI_API_KEY", "MONGO_URI"], key) && can(regex("^[1-9][0-9]*$", version))]) &&
      trimspace(var.release.network) != "" && trimspace(var.release.subnetwork) != "" &&
      var.release.max_instances >= 1 && floor(var.release.max_instances) == var.release.max_instances &&
      var.release.daily_attempts >= 1 && floor(var.release.daily_attempts) == var.release.daily_attempts
    )
    error_message = "Use an immutable image, HTTPS origins, reserved egress network/subnet, numeric secret version IDs and positive quotas."
  }
}

variable "monitoring_enabled" {
  description = "Whether to run public HTTPS readiness probes after a release."
  type        = bool
  default     = false
}

variable "notification_channels" {
  description = "Existing Monitoring channel resource names for this project."
  type        = list(string)
  default     = []
}
