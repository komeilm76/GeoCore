# Roadmap, tasks and open decisions

**Status:** Initial work breakdown derived from Product Scope v1.12. This is a sequence of work, not a schedule or release commitment. No owners or dates have been assigned. Items marked `[ ]` are not implemented or verified.

## Delivery order

1. **Project foundation — initial documentation draft prepared:** governance, architecture constraints, security/data/quality gates, 13 bilingual service manuals, paired global policy drafts and requirement traceability are in the repository. They still need human/technical and product-owner review; this is not an approved architecture or an implementation.
2. **Vector Map Tile Service — first implementation priority:** first release target is vector only, focuses test evidence on Tehran, Karaj, Tabriz, Mashhad and Isfahan, supports public and organization-private data, and targets both hosted and self-hosted deployment. Resolve remaining format/data/role/operations details; build a licensed sample and verify it in both languages. Nationwide target is not established by the five-city test focus.
3. **Routing — next implementation priority:** first release product direction requires both OSRM and Valhalla selectable per organization. Verify both engines against ordered multi-stop routes and optional time optimization for car, pedestrian and bicycle; establish independent network source and report any feasibility gap for owner resolution before release.
4. **Remaining services — incremental:** assess feasibility and data/license needs per service; do not imply release order or date. Public transport/taxis, live traffic, complex logistics, offline navigation and other conditional capabilities require separate approval and validated data.

## Foundation tasks

- [x] Draft document authority, status vocabulary and requirement traceability; maintainer/product-owner approval and review owners are still pending.
- [x] Record the owner-directed default: Bun, strict TypeScript, Vitest, Fastify APIs and Zod validation/types; keep exact package versions pinned and reviewed in Bun lockfiles.
- [x] Migrate the existing geospatial spikes from JavaScript/Node's built-in test runner to strict TypeScript and Vitest under Bun.
- [x] Run a small Bun + Fastify + Zod compatibility spike with Vitest; it validates in process but does not create a GeoCore endpoint. The adapter remains unapproved for production.
- [x] Establish an ADR process/template and an open-decision register; decisions themselves remain unapproved until owners approve them.
- [x] Create initial threat-model, data-sheet, security/privacy review and release-evidence guidance; formal security/legal review remains pending.
- [x] Add CI quality gates for the current spikes: frozen Bun installs, strict TypeScript checks, Vitest suites and a production-dependency audit; extend them as the API compatibility sample is evaluated.
- [x] Add dependency-free documentation structure/link/requirement checks and unit tests; run them with `python3 scripts/check_docs.py` and `python3 -m unittest discover -s tests`.

## Map tile epic — traceability `3.1`, `TILE-01`, `TILE-02`, `REQ-D1`–`D6`, `REQ-P1`–`P4`, `REQ-O1`–`O5`, `I18N-06`–`09`, `DATA-01`–`06`, `MANAGE-01`

- [x] Record product direction: vector-only first tile release; nationwide target with five-city initial test focus; public and private organizational datasets; hosted and self-hosted first-release targets; immutable versions and rollback.
- [x] Build a non-production TypeScript matrix-indexing spike for candidate Web Mercator XYZ; its arithmetic module has no third-party runtime dependency, and seven Vitest boundary/range/conversion tests pass. This is not a format/API choice.
- [ ] Review proposed ADR-0001 and assign product/technical/data/security owners for the broader vector-tile format and delivery spike.
- [ ] Compare payload encoding, tile matrix/numbering, delivery contract and storage artifact as separate decisions; then propose zoom levels, high-zoom detail and coverage/empty semantics.
- [x] Create a synthetic GeoJSON fixture and isolated MVT encode/decode candidate spike; the current 12 tests include line/polygon edge clipping, a synthetic interior-hole preservation case, and candidate MapLibre style-schema/source-layer/property-reference checks, including an unknown-property negative case; these are not rendering tests. No real OSM or personal-location data is used.
- [ ] Obtain an authorized real-data/reference fixture before evaluating OSM extraction or making coverage claims; the current spike is not a tile-generation pipeline.
- [ ] Assess self-hosted OSM acquisition/preparation first; complete source/license review, data sheet, attribution, capacity/cost, weekly configurable update check and publication/rollback design.
- [ ] Decide serving runtime, artifact storage, cache/ETag/versioning and tenant policy; define separate organization-administrator and GeoCore-team permissions; specify hosted/self-hosted operating responsibilities (ADR required).
- [ ] Define authorized, versioned test extents and independent acceptance references for Tehran, Karaj, Tabriz, Mashhad and Isfahan; record that this does not prove uniform Iran-wide quality.
- [ ] Implement format/coordinate/coverage validation and immutable candidate data preparation with failure isolation.
- [ ] Implement tile serving, safe cache semantics, access controls and useful non-sensitive telemetry.
- [ ] Test representative tile rendering, empty/out-of-coverage/failure behavior, Persian/English labels and mixed-direction content.
- [ ] Complete threat model, cross-tenant/cache leakage tests, resource limits, deployment/recovery testing and approved numerical targets.
- [ ] Run English and Persian quick starts from clean environments; publish manual, OpenAPI if API-oriented, data sheet, release notes and evidence.

## Routing epic — traceability `3.4`, `MODE-01`, `TRIP-01`–`TRIP-05`, `ROUTE-01`, `OPT-01`, `OPS-04`–`05`

- [x] Record owner direction: first Routing release must offer both OSRM and Valhalla selectable by organization; car, pedestrian, bicycle, multi-stop and optional time optimization remain required. A dedicated return-to-origin capability is excluded from the first release.
- [ ] Assign a spike owner and provide an approved network/reference dataset plus isolated engine runtime; the current workspace has neither Docker/Podman nor OSRM/Valhalla executables or network data.
- [ ] Run and publish a capability/feasibility matrix for both engines and the selected versions/configurations. Verify every mandatory profile and trip/optimization behavior; do not claim parity or silently drop a requirement.
- [ ] Decide independently provisioned network data, profile behavior, limitations and licensing for both engines.
- [ ] Approve reference network and test routes for car, pedestrian and bicycle separately.
- [ ] Specify stable multi-destination request/result model, duplicate-stop identity mapping, limits, disclosed snapping behavior, unsupported return-to-origin handling and failure semantics.
- [ ] Verify input order with optimization off; optimization on requires explicit fixed/free final-destination mode and time objective.
- [ ] Test unreachable points, unsupported constraints, timeouts, solver errors, snapping, costs, route geometry and version consistency.
- [ ] Approve quality criteria and only then document supported capabilities as releasable.

## Cross-cutting work

- [x] Incorporate the owner's latest decisions into a decision record and split decided direction from open implementation details. The v1.12 scope is not silently overwritten; a reviewed bilingual successor remains required.
- [ ] Assign legal/privacy, service, product, technical and operations owners; until scenario-specific legal/privacy review, do not process real people's location data.
- [ ] Plan Web location acquisition first and define native SDK responsibilities/platform evidence for Android/iOS; a full UI application is not implied.
- [ ] Specify first-history-release buffering as enabled by default but configurable off; test queue limits, retention, end/expiry detection and first-opportunity deletion.
- [ ] Define bilingual glossary and name human/technical reviewers for Persian and English.
- [ ] Approve objectives after real measurements; distinguish SLI/SLO/SLA. Product and technical owners approve; operations participates in operational/recovery metrics.
- [x] Create an initial requirements-to-service/documentation index; code, test and release-evidence links remain to be added when those artifacts exist.

## Immediate blockers / decisions (not assumed)

Remaining blockers include exact tile format/zoom and measured coverage; OSM processing/licensing; runtime/storage/cache and role permissions; operations for both first-release hosting models; city test extents and independent references; OSRM/Valhalla feasibility and network licenses; named legal/privacy and service owners; platform, history-buffer and sharing controls; and measured objectives. The owner has made product direction decisions for many of these, but implementation evidence and a successor bilingual scope remain outstanding. See [the current decision register](OPEN-DECISIONS.md) and [architecture](ARCHITECTURE.md).
