# Service documentation template

Copy this structure into `docs/services/<service>/` and maintain English (`.en.md`) and Persian (`.fa.md`) versions together. Remove instruction text only after completing and reviewing the section.

## Required sections

1. **Status and version:** proposed/planned/implemented/verified/released; service/API version; last review; owners; known limitations. Never call planned behavior available.
2. **Purpose and boundaries:** responsibilities, explicit exclusions, consumers, related requirement IDs, standalone mode and optional integrations/degraded behavior.
3. **Prerequisites:** data source/license/version/coverage, engine/runtime/storage/network, permissions, supported operating environments, resource requirements and ownership.
4. **User quick start:** supported deployment and configuration only; safe sample; expected outcome; cleanup. Until an executable implementation exists, label this section “not yet executable” and do not invent commands, URLs, keys or payloads.
5. **Reference/contract:** versioned OpenAPI or format/API reference, coordinate system/axis order/units, auth, limits, pagination, idempotency, error/status semantics and compatibility policy.
6. **Data and quality:** provenance, freshness, coverage, language and fallback behavior, quality method, known gaps and reproducibility metadata.
7. **Security and privacy:** authentication/authorization, tenant scope, secrets, cache, logs, retention/deletion, backup/restore, threat model and incident contact/process.
8. **Operations:** install/configure, health vs readiness, metrics/logs, update/rollback, backup/recovery, capacity, failure/degraded behavior and troubleshooting.
9. **Acceptance and release evidence:** tests linked to requirement IDs, reference dataset and version, measured values/approved thresholds, security/i18n tests, evidence and approver.
10. **Bilingual change control:** glossary terms, parity review, release-aligned examples and cross-links to the other language and global policies.
