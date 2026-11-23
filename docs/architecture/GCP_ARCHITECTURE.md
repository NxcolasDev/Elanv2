# Proposed GCP architecture

```mermaid
flowchart LR
    User["Browser"]
    Hosting["Public Firebase Hosting CDN"]
    Firebase["External Firebase Auth"]
    CI["GitHub Actions with OIDC"]
    subgraph GCP["Dedicated GCP project per environment"]
        WIF["Configured workload identity provider"]
        Registry["Private Artifact Registry"]
        Run["Public HTTPS Cloud Run ingress"]
        Express["Express with Firebase authorization"]
        Secrets["Private Secret Manager"]
        Logging["Cloud Logging and Monitoring"]
    end
    Gemini["External Gemini API"]
    Atlas[("External Atlas database")]
    User --> Hosting
    User --> Firebase
    User --> Run
    Run --> Express
    Express --> Firebase
    Express --> Gemini
    Express --> Atlas
    Run -->|Runtime identity| Secrets
    Registry -->|Image digest| Run
    Run --> Logging
    Logging -->|Readiness probe| Run
    CI --> WIF
    WIF -->|Short-lived access| Registry
    WIF -->|Update existing service| Run
```

Firebase Hosting provides the CDN, HTTPS and SPA rewrite with less configuration than a Storage bucket, external load balancer, and Cloud CDN. Cloud Run scales from zero and keeps the API stateless. A small instance cap, MongoDB pool cap, and provider quotas constrain usage. Choose a region close to Atlas and learners. One region is sufficient for the portfolio rollout. Production availability still depends on the selected Atlas topology and configured alerting. [Deployment guide](../GCP_DEPLOYMENT_GUIDE.md)
