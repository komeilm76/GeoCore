# Security and privacy baseline

**State:** Requirements baseline for design and review; no implementation or security certification is claimed. This is not legal advice. Apply applicable law and approved organizational policy.

## Security principles

- Deny by default. Authenticate where the deployment requires identity; authorize every operation against the caller, tenant, resource and action. Random/unguessable IDs are not authorization.
- Separate tenants and proprietary datasets throughout origin, storage, derived artifacts, API, cache, logs, backups and administration.
- Minimize collected data and precision. Location history, live sharing and nearby discovery have independent permissions and lifecycles; enabling one does not authorize another.
- Protect transport and stored sensitive data proportionately to risk. Keep credentials outside source, client bundles, images and logs; use managed secret delivery and rotation appropriate to the deployment.
- Fail closed when authorization cannot be verified. Do not disclose sensitive object existence through responses, counts, pagination, cache behavior or logs.
- Treat source data, uploaded files, geometry, URLs and downstream providers as untrusted inputs.

## Initial tile-service threat model

Assets: licensed base data, proprietary layers/tiles, credentials, configuration, availability and attribution metadata. Trust boundaries: public/consumer network to tile API; one organization/tenant to another; organization administrator to GeoCore operations team (separate roles required); operator to service; ingestion source/tool to published artifacts; service to cache/storage. Both hosted and self-hosted deployments and both public and organization-private datasets are first-release product targets, so security controls must be verified for each deployment model.

Proposed access/cache ordering for private tiles (exact design depends on the future serving architecture):

```mermaid
sequenceDiagram
  participant C as Client
  participant A as AuthN/AuthZ policy
  participant S as Tile service
  participant K as Tenant/version-aware cache
  participant D as Published dataset
  C->>A: Request identity, tenant and tile scope
  A-->>S: Authorized scope or deny
  alt Authorized
    S->>K: Lookup using all relevant authorized dimensions
    alt Cache hit and policy fresh
      K-->>S: Tile allowed for this scope
      S-->>C: Tile or documented status
    else Cache miss/stale
      S->>D: Read immutable authorized version
      D-->>S: Tile or documented no-data state
      S->>K: Store only under matching access/version policy
      S-->>C: Tile or documented status
    end
  else Denied or authorization unavailable
    A-->>C: Safe denial; no data disclosure
  end
```

This diagram is a security constraint/proposal, not an approved implementation. A public tile set may use a different path only after an explicit public-data decision. Never let a cache hit bypass authorization for private data.

Threats to test: unauthorized private-tile retrieval; cross-tenant cache-key collision; stale tile after revocation/version switch; path/key manipulation; resource exhaustion via high-cardinality/oversized requests; origin/source compromise; admin exposure; secrets in logs; untrusted archive/path traversal during future ingestion; data-license or attribution omission.

Mitigations to design and verify: explicit access policy before cache lookup or a cache architecture that cannot bypass it; tenant/version/language/format in relevant cache keys; bounded request and resource limits; strict path/parameter validation; least-privilege service and operator roles; integrity validation and immutable versioned artifacts; controlled origin; security headers and safe errors; access auditing with minimized fields; tested rollback and revocation propagation. Exact controls depend on the selected serving architecture.

## Sensitive observability

By default do not log precise coordinates, full address/search text, credentials, bearer tokens, guest-share secrets or unnecessary personal identifiers. Avoid sensitive metric labels and traces. Define retention and access policy for audit records; log security events in a way that does not recreate deleted location data. Review third-party telemetry, error reporting and referrer behavior before enabling them.

## Data lifecycle and incident readiness

Before processing personal data, identify purpose, controller/processor roles, legal basis, access scope, retention start/end, deletion path for primary/derived/cache/log/backup data, rights handling, incident owner and restoration behavior. Backups must be access-restricted; restoration must reapply deletion and expiration controls. Document vulnerabilities, dependency updates, security review, incident triage and notification obligations for the applicable jurisdiction.

## Release security gate

Require threat-model review; positive and negative authorization tests (including cross-tenant); input/resource-abuse checks; secret/log scan; dependency and container review for shipped components; TLS and deployment configuration review; cache/revocation tests; backup/restore and deletion tests where relevant; open finding disposition and accountable approval. Applicable legal/security blockers cannot be waived by labeling a capability experimental.

Trace to `REQ-P1`–`REQ-P5`, `SEC-01`–`SEC-05`, `OPS-06`, `DATA-06` and relevant service requirements in the product-scope document.
