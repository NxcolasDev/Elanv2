# System architecture

```mermaid
flowchart LR
    subgraph Client["User browser"]
        SPA["React SPA"]
        Local["Browser storage by Firebase UID"]
        Speech["Web Speech APIs"]
    end
    subgraph API["Express API"]
        Public["Public health and published content"]
        Private["Authenticated student routes"]
        Admin["Revocation-checked admin routes"]
        Harness["AI harness"]
    end
    Firebase["External Firebase Authentication"]
    Gemini["External Gemini API"]
    Mongo[("Private MongoDB data")]
    Media["External YouTube embeds and news links"]
    SPA --> Local
    SPA --> Speech
    SPA --> Media
    SPA -->|Sign-in and ID token| Firebase
    SPA -->|HTTPS| Public
    SPA -->|HTTPS with Firebase token| Private
    SPA -->|HTTPS with Firebase token| Admin
    Private --> Firebase
    Admin --> Firebase
    Public --> Mongo
    Private --> Mongo
    Admin --> Mongo
    Private --> Harness
    Admin --> Harness
    Harness --> Gemini
```

Reading, Listening, and Models consume published content with bundled material available as a fallback. The simulation and its scoring run in the browser. [Data ownership and flow](../TECHNICAL_DOCUMENTATION.md)
