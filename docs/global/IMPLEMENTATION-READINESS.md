# Implementation readiness and first work packages

**Status:** Working gate derived from the current owner decisions. It defines what can start safely and what must be resolved before production implementation. It is not an architecture approval or a release plan.

## Current readiness assessment

- **Safe to start now:** non-production feasibility spikes, synthetic test-data fixtures, written API/format options, benchmark plans, threat-model review, license/legal assessment planning, and assigning owners.
- **Not ready for production data or release:** tile format/zoom/coverage and data pipeline are unresolved; both hosting models and public/private access need tested designs; Routing requires both OSRM and Valhalla but their capability parity is unverified; legal/privacy and operational owners remain unnamed; targets and support policy remain open.
- **Real people's location:** do not collect or process before scenario-specific legal/privacy review. Use authorized synthetic or otherwise approved test data.
- **Workspace capability check (2026-11-16):** Bun 1.4.5, Node.js 22.22.3, npm and Python 3.11 are available; pnpm, Docker/Podman, OSRM and Valhalla executables were not found. The matrix and synthetic MVT spikes now use strict TypeScript and Vitest under Bun; they are not production services. No Chromium/Chrome or Playwright executable was found, so no browser MapLibre rendering has been run. No authorized real tile/network dataset or production tile pipeline is present, and the dual-engine comparison cannot yet be executed here. This check is not an assessment of engine capability.

## Common start gate for any code work

Before a production-bound change, record:

1. The applicable product requirement IDs and latest owner decision IDs.
2. A named product/technical owner and reviewer; security/data/legal owners where relevant.
3. Input/output behavior, units, coordinate reference/axis order, unknown/error states and limits (or explicit spike-only scope).
4. Data source, license, test fixture provenance and permitted use.
5. Threats, authorization boundary, sensitive-data handling and logging/cache assumptions.
6. Test plan and evidence; no unsupported performance or coverage target.
7. Supported environment, reproducible toolchain, deployment/rollback path and bilingual doc owner before release.

A spike must be isolated from production, use approved test data, have a written question and exit criteria, and not be advertised as a supported capability.

## Work package A — tile-format and pipeline spike

**Question:** Which vector tile format, tile matrix/numbering, zoom range and style-resource model can satisfy MapLibre compatibility, Persian/English labels, caching, public/private separation and both deployment models? The proposed, unaccepted [ADR-0001](../decisions/0001-vector-tile-delivery-contract.md) separates these dimensions and provides the spike checklist.

**Compare:** at least two viable approaches plus defer/no selection. Record capabilities, interoperability, build/runtime compatibility, data size/build cost, versioning/rollback, licensing, style/font/glyph support, tenant-safe serving, operational complexity and failure behavior. Do not select by popularity alone.

**Input:** only a small, authorized, versioned test fixture. The five focus cities are the planned quality sample; exact extents and reference data still need approval. Synthetic geometry may be used for protocol tests before a licensed OSM extract is approved.

**Work already completed:** an isolated XYZ/TMS matrix-math spike and a synthetic MVT encode/decode candidate test now pass. These verify only coordinate arithmetic, a synthetic library round-trip, limited line/polygon clipping in neighboring test tiles, one synthetic interior-hole preservation case, and candidate style-spec schema/source-layer/property-reference checks (including a negative unknown-property case); they do not select MVT, render in MapLibre, test real OSM, deployment, authorization or production behavior. The style-spec package has an unresolved license-metadata discrepancy; qualified review is required before adoption. See the spike guides and proposed ADR-0001.

**Exit evidence:** decision table and prototype report; chosen matrix/format proposal; Persian/English rendering and cache-isolation test; reproducible data build; measured size and resource use; legal/data review; explicit remaining risks. Product owner/technical/security/data approvals are required before implementation is treated as production-bound.

## Work package B — deployment and authorization design

**Question:** Can the first tile release support public and organization-private datasets in both hosted and self-hosted models with separate organization-administrator and GeoCore-team roles?

Define identity source and trust boundaries; role/action matrix; organization provisioning and revocation; public/private classification; storage/cache key and invalidation; deployment responsibilities; health/readiness; backup/restore; logs; and abuse limits. Test authorized, denied, cross-organization, revoked, stale-cache and unavailable-authorization cases. A hidden URL or cache hit is never authorization.

**Exit evidence:** reviewed role matrix, threat model, architecture diagram, failure matrix, prototype security tests and operational responsibility table for each hosting model. Do not publish private datasets before this gate passes.

## Work package C — dual-engine Routing feasibility

**Question:** Can the selected OSRM and Valhalla versions/configurations both meet the first-release requirements and be selected by organization?

Use the same approved licensed network/reference set where technically possible. For each engine separately test car, pedestrian and bicycle profiles; ordered multi-stop routing; optimization off; time optimization with fixed and reorderable final destination; duplicate stops; snapping disclosure; unreachable points; unsupported constraints; timeout/error behavior; result status and cost consistency; version metadata; and operational resource use. Record differences; do not call the engines equivalent without evidence and do not silently fall back.

**Exit evidence:** capability matrix by engine/version/profile, data/license assessment, test results, costs/limits and recommendation. If any mandatory behavior cannot be met, stop for an explicit product-owner scope decision before release.

## Work package D — location-data safety and client feasibility

Before code processing real location, obtain scenario-specific legal/privacy approval and identify accountable roles. Use synthetic/authorized data to test Web-first collection and investigate native SDK components for Android/iOS. Prove background behavior only in declared OS/browser versions and permissions. For history, test the enabled-by-default but disableable local buffer, queue limits, secure local storage, unknown acknowledgments, 24-hour inactivity policy (automatic ending disabled in a prototype until validation), no-location waiting rules, first-opportunity deletion after end, and immutable closed history. For sharing, test account/guest-link paths, organization defaults, revocation, expiry and stale status.

## Work package E — API stack compatibility

**Question:** Can the owner-directed Bun + strict TypeScript + Vitest baseline run a minimal Fastify API with Zod runtime schemas and inferred request/response types without relying on compile-time checks alone?

Use a tiny isolated sample with no personal or production data. Exercise Fastify injection with a valid request and at least one invalid request, verify that runtime validation rejects invalid input, type-check schema-derived types, and run it through the locked Bun/Vitest workflow. Any Fastify/Zod adapter is a candidate until compatibility, maintenance, security advisories and licenses have been reviewed. This does not create a GeoCore endpoint or settle authentication, authorization, API design, deployment, or service boundaries.

**Observed result (2026-11-16):** the isolated [Fastify + Zod spike](../../spikes/api-stack-compat/README.md) passes strict TypeScript checking and five Vitest tests under Bun 1.4.5. It verifies runtime rejection of invalid input and response-schema serialization errors using Fastify 5.12.8, Zod 4.6.7 and `fastify-type-provider-zod` 7.0.0. Bun audit reported no known vulnerabilities for its locked production dependency tree at run time. This is candidate-only evidence: no adapter is approved for production, and the test does not cover a listener, auth, tenant isolation, OpenAPI or deployment.

**Exit evidence:** the compatibility question has a small reproducible result; production adoption still requires package/license/security review, environment support, operations/security design and an explicit adapter decision.

## Decisions that are not prerequisites for a bounded spike

A spike may compare options without fixing final zoom limits, nationwide coverage claims, service SLA, support duration or all customer roles, if its data and deployment are isolated and its question is narrow. These choices remain required before their affected production behavior is committed or released.

## Go/no-go

- **Go for discovery:** named spike owner, approved test data, bounded question, test plan, isolated environment and exit criteria.
- **Go for production implementation:** relevant product decisions reconciled in the successor bilingual scope; architecture and authorization ADRs approved; licensing/legal review complete; test and operations owners assigned; acceptance/data evidence approved.
- **No-go:** real personal location without legal/privacy review; private tiles without tested authorization/cache isolation; claiming nationwide quality from five-city testing; claiming OSRM/Valhalla parity without evidence; unsupported performance/SLA claims; silently dropping mandatory scope.
