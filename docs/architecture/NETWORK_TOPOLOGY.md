# Network topology

```mermaid
flowchart LR
    Browser["Internet browser"]
    Firebase["Firebase Hosting and Auth"]
    Run["Public Cloud Run HTTPS endpoint"]
    Express["Authenticated Express routes"]
    Subnet["Existing regional subnet for Direct VPC egress"]
    NAT["Existing Cloud NAT with reserved public IP"]
    Atlas[("Atlas TLS with NAT IP allowlist")]
    Gemini["Gemini HTTPS"]
    Google["Google APIs and Secret Manager"]
    Browser --> Firebase
    Browser --> Run
    Run --> Express
    Express --> Subnet
    Subnet --> NAT
    NAT --> Atlas
    NAT --> Gemini
    NAT --> Google
```

The VPC egress requirement gives Atlas a stable source IP. Terraform consumes an existing subnet and network. Cloud Run receives browser traffic on its managed HTTPS ingress. Firebase roles gate private application routes. The runtime identity grants Google API access. An Atlas private endpoint is an alternative if the Atlas tier, DNS and VPC networking justify it. Local Compose uses its own bridge network and binds MongoDB and Mongo Express to loopback. [Cloud Run static outbound IP](https://cloud.google.com/run/docs/configuring/static-outbound-ip) · [Atlas access list](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
