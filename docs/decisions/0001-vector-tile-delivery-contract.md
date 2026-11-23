# ADR-0001: Separate vector-tile payload, matrix, delivery API and storage decisions

- **Status:** Proposed for a bounded feasibility spike; not accepted
- **Date:** 2026-11-16
- **Decision owner:** Unassigned
- **Approvers:** Pending product, technical, data and security review
- **Requirement IDs:** `3.1`, `TILE-01`, `TILE-02`, `REQ-D1`–`REQ-D6`, `I18N-09`, `DATA-01`–`DATA-06`, `OPS-05`
- **Supersedes / superseded by:** None

## Context

The product owner has decided that the first map-tile release is vector-only, targets Iran, initially tests five named cities, and supports both public and organization-private datasets in hosted and self-hosted deployment models. The exact tile format, matrix/numbering, zoom levels, serving contract, storage and data pipeline remain open.

The phrase “tile format” currently combines decisions that are independent and should not be collapsed into one: (1) encoded tile payload, (2) tile matrix and coordinate/row numbering, (3) HTTP/API or URL semantics, (4) packaged tile storage/publication artifact, and (5) style/font/glyph resources. Choosing one does not automatically settle the others.

## Constraints and confirmed requirements

- First tile release is vector-only. Persian and English label selection is required for offered styles, subject to actual source data and the language/fallback rules.
- MapLibre compatibility must be demonstrated; naming a format does not prove style, layer, glyph or font compatibility.
- Published data versions are immutable, traceable, and rollback to the previous valid version is required.
- Public and organization-private datasets and both deployment models are first-release product directions. Authorization must not be bypassed by a URL, shared cache or artifact access.
- The test focus is Tehran, Karaj, Tabriz, Mashhad and Isfahan; five cities do not prove uniform Iran-wide coverage.
- OSM is the initial source, but the acquisition/processing pipeline, legal review and exact data set remain open. Use synthetic geometry or separately authorized test data in a spike.
- Numeric zoom levels, freshness, performance, capacity and availability targets are not approved.

## Options to compare (dimensions kept separate)

### Payload encoding

| Candidate | Benefits to test | Risks / unknowns |
|---|---|---|
| Mapbox Vector Tile (MVT) | Likely fit for vector styling and MapLibre-oriented clients; supports feature/layer payloads. | Verify schema, layer attributes, language tags, precision/generalization, compatibility and attribution path. |
| Another vector encoding supported by target clients | May offer other interoperability or data-model properties. | Must demonstrate actual target-client support, tooling maturity, licensing and layer/style behavior; no alternative is selected here. |

Raster is not a candidate for the first release because the owner selected vector-only. It may be revisited only for a later release decision.

### Tile matrix and numbering

| Candidate | Benefits to test | Risks / unknowns |
|---|---|---|
| Web Mercator XYZ / `WebMercatorQuad` | Common web-map convention and likely straightforward MapLibre integration. | Confirm latitude/extent limits, row direction, coordinate rounding, antimeridian behavior and conformance requirements. |
| TMS-style row numbering or another tile matrix | May be required by selected storage/tools or a selected standard. | Y-axis inversion/interoperability mistakes are likely unless explicitly specified and tested. |

Do not use “XYZ” and “TMS” interchangeably; the contract must define matrix, zoom indexing, origin and row direction.

### Delivery contract

- A simple versioned `z/x/y` resource pattern may be easy to integrate but is not automatically an OGC-conformant API.
- An OGC API Tiles approach may improve standardized discovery/metadata but has additional contract/conformance work; claim conformance only after selecting a part and passing its tests.
- Both require explicit coverage, zoom limits, version, language/style resources, cache policy, authorization, empty/out-of-coverage and error semantics.

### Storage/publication artifact

Compare versioned files, a tile database/container, and a packed archive independently of payload and URL scheme. Assess random access, range requests, private-data isolation, hosted/self-hosted operations, concurrent serving, atomic publication, rollback, artifact size and license obligations. No artifact or database is selected here.

## Proposed spike direction (not an implementation decision)

For the first comparison, evaluate **MVT + WebMercatorQuad/XYZ** as one candidate because the product is vector-only and targets MapLibre-compatible web clients. Compare a versioned immutable tile artifact served through (a) a minimal versioned tile resource API and (b) an OGC API Tiles option. Evaluate the artifact/container separately. This is a testable candidate, not a final recommendation or approval; alternatives must remain in the comparison until evidence and owner review.

## Spike plan and acceptance

Use a small synthetic dataset with known points, lines and polygons; add real OSM-derived data only after the source, license and processing path are approved. Record exact generator/tool versions and configuration.

1. **Partial evidence produced:** the [tile-matrix indexing spike](../../spikes/tile-matrix/README.md), whose projection module has no third-party runtime dependency and whose tests use the repository's Bun/Vitest baseline, checks candidate XYZ projection, edges, range checks and XYZ/TMS row conversion. The isolated [MVT encode/decode spike](../../spikes/mvt-encoding/README.md) creates synthetic point/line/polygon/multipolygon features and verifies decoding, feature IDs, selected UTF-8 properties, and synthetic line/polygonal clipping across neighboring test tiles with closed output polygon rings, plus line and polygon clipping across an XYZ row boundary, one interior-hole case, and one multipolygon component-clipping case, all synthetic features in one candidate z-zero tile, one point within its candidate tile at two additional test zooms, and Zod validation for synthetic options and fixture polygon rings. Neither result selects a product matrix or format. The MapLibre style-spec validator was removed after an unresolved license-metadata discrepancy was found; no style-schema or rendering evidence is claimed. Data bounds and full style/render tests remain outstanding.
2. Render in the intended MapLibre client with Persian/English styles and actual language/fallback metadata where the fixture supports it; test fonts/glyph resources and mixed-direction labels. This has not been run.
3. Verify version identifiers, immutable publish/rollback, empty and out-of-coverage behavior, invalid coordinates/zoom, and recognizable source/dependency errors.
4. Test public and private fixture data; verify unauthorized, cross-organization and revoked access remains denied on origin, cache and artifact paths.
5. Run the same contract tests in a hosted-like and self-hosted-like isolated setup; measure size/build time/resource use without inventing release targets.
6. Document license/attribution implications, support gaps, exact known limitations, and options not tested.

**Exit criteria:** reproducible test report, option comparison, selected dimensions proposed separately, security/data/license review, and explicit unresolved items. Passing this spike does not establish nationwide coverage, SLA, production readiness or legal approval.

## Decision and rationale

No final payload, matrix, API, storage, tile zoom, runtime or technology is selected by this ADR. The decision requested is approval to run the bounded comparison above and assign accountable product/technical/data/security owners. A later accepted ADR must record the evidence and explicit selections.

## Consequences

- Prevents accidental coupling of encoding, URL scheme and storage.
- Allows early client/format testing using synthetic data without claiming production capability.
- Adds comparison and test work before a stable API and data pipeline can be implemented.
- Keeps private-tile access, license review, rollback and language behavior as release gates.
- Persian and English manuals and scope must be updated together after an accepted decision.

## Validation and review

- **Evidence:** Partial candidate-only evidence: seven tile-matrix tests and fifteen synthetic MVT candidate tests pass under the strict TypeScript/Vitest baseline. The MVT spike pins packages; direct-package license identifiers are documented for review. The MapLibre style-spec validator was removed after its license metadata conflict was found; reintroduction is blocked pending qualified review. A full `bun audit` reported no known vulnerabilities for its locked dependency tree at run time. See both spike READMEs. No MapLibre rendering, OSM fixture, production storage/service, hosted/self-hosted behavior, authorization/cache test or access-control prototype exists. Broader spike owner remains unassigned.
- **Approvals:** Pending product, technical, data and security review; legal/data review before using OSM-derived fixtures.
- **Revisit:** After the spike results, before any tile-serving API or production pipeline is committed.
