# Map Tile Service — user and operator guide (planned)

**State:** First implementation priority; not implemented, not verified, and not released. This guide is a requirements/manual draft, not a working endpoint or an installation recipe. **Do not send production traffic or rely on this repository to serve tiles.**

## 1. What the service is for

The first release is planned to deliver **vector tiles only** to web maps and compatible clients. OpenStreetMap is the initial source and the product target is Iran, with initial test focus on Tehran, Karaj, Tabriz, Mashhad and Isfahan. Exact zoom levels, high-zoom detail, nationwide coverage, quality and freshness are not yet measured. High zoom must use actual source detail where available, not merely enlarge a lower-zoom image. Persian and English label selection is required for offered styles; a missing source translation must not be represented as verified translation.

This service is a tile-delivery boundary. It must be usable without installing GeoCore Routing, Geocoding, Data Management, SDK or Manager. It still needs a licensed, prepared data set and runtime/storage prerequisites selected during design. Data preparation may use an independent tool or prepared data; the GeoCore Data Management service is not a mandatory dependency.

## 2. Current use and intended user flow

There are no supported URLs, commands, credentials, tile format, style files, zoom levels or deployable packages yet. Do not invent or assume them. Once an implementation is approved, the operator workflow will be:

1. Select an authorized source and record license, attribution, geographic extent and source/observation time.
2. Prepare a candidate data version using the approved, reproducible process; keep it separate from active data.
3. Validate integrity, coverage, zoom/layer compatibility, Persian/English labels, style/font resources, and data rights.
4. Publish only a validated version; record its version and publication time. On failure, retain the last valid version and use the documented rollback procedure.
5. Configure a client using the exact version-matched endpoint/style instructions and supported language mechanism. Confirm the client is within declared coverage and zoom range.
6. Observe service readiness and data freshness; distinguish a valid empty tile, out-of-coverage response, denied access and dependency failure according to the eventual contract.

Until a versioned implementation and executable quick start exist, these are design/acceptance steps only.

## 3. Operator prerequisites to decide before deployment

The first release is intended to include both hosted and self-hosted deployment models, and both public and organization-private datasets. The exact model and access controls are not yet implemented or approved at the technical level. The service-specific release document must name: serving runtime and supported OS/CPU; vector tile format and numbering/matrix scheme; minimum/maximum zoom and coverage; active data artifact and version; source/license/attribution; storage and capacity; cache and freshness policy; auth/tenant policy and the distinct organization-administrator and GeoCore-team roles; networking/TLS; health versus readiness checks; update/rollback; resource limits; backup and recovery behavior; operational owner and support route. No numerical values or exact role permissions are currently approved.

A product “weekly default update check” is not a claim that data changes weekly or that every candidate is safe to publish. Do not update active data without validation and an approved publication path.

## 4. Client integration (not yet executable)

A future API/style guide must specify exact tile URL template or standard endpoint, format, layer schema, tile matrix, language selection, attribution display, required fonts/sprites/glyph resources, CORS/auth policy, cache headers and version pinning. It must include a tested MapLibre example only after compatibility is demonstrated. The service must state whether the user selects Persian or English by a query, header, style, or separate artifact; no mechanism is selected.

Avoid bundling server credentials in browser code. Because the first release targets public and organization-private datasets, the implementation must deliberately classify each dataset and enforce access before returning or caching private tiles. An unguessable URL is not authorization. Organization administrators and GeoCore operators have separate roles; their exact permissions must be approved and tested. Hosted and self-hosted deployments are both first-release targets, but their operational responsibility split is still open.

## 5. Data, cache and security behavior

- Every published data version needs a data sheet, source and license provenance, extent, known limitations, data/publication times and attribution path.
- Cache policy must respect freshness, version, language/style and authorization. Private data must not be served to an unauthorized consumer through a shared cache; private responses must not become public because they are cached.
- Validate request parameters and bound request/resource use. Errors must not expose filesystem paths, internal origins, credentials or private dataset existence where that disclosure is unsafe.
- Do not place secrets, precise user location or unnecessary request detail in logs. A tile request usually does not need the visitor’s precise location as an additional field.
- Serving tiles does not grant rights to the underlying dataset or to build offline packages. Assess data licenses and upstream service policies separately.

See [security baseline](../../global/SECURITY.md) and [data governance](../../global/DATA-GOVERNANCE.md).

## 6. Known limitations and expected statuses

Coverage, zoom limits, tile format, empty-tile semantics, data freshness threshold, performance, availability and deployment are undecided. OSM coverage is not guaranteed to be complete or accurate. Missing tiles must not be interpreted as proof that no geographic feature exists. The eventual contract must distinguish or document valid empty content, out-of-coverage, unauthorized access and processing/source errors within the chosen format’s limits (`TILE-02`, `DATA-01`).

## 7. Acceptance checklist before any release

- [ ] Dataset source, license, attribution, scope, version and limitations reviewed; data sheet approved.
- [ ] Tile format, matrix/numbering, zoom and coverage contract published and tested.
- [ ] A sample client displays valid in-coverage vector tiles and Persian/English style/labels with compatible fonts/resources; the five focus-city sample is not described as proof of uniform Iran-wide coverage.
- [ ] Empty, out-of-coverage, denied and failure behavior is documented and tested.
- [ ] Public and organization-private dataset paths are tested, including distinct organization-administrator and GeoCore-team permissions.
- [ ] The release evidence covers both hosted and self-hosted deployment models.
- [ ] Two organizations’ proprietary data cannot cross through origin, storage or cache; revocation/version changes invalidate or partition cached content as designed.
- [ ] Invalid/oversized requests, dependency failure, readiness, rollback and recovery have evidence.
- [ ] Performance/freshness/availability objectives are measured and approved; no unsupported SLA claims.
- [ ] English and Persian user/operator manuals and executable version-matched examples reviewed.

Requirements: `3.1`, `TILE-01`, `TILE-02`, `REQ-D1`–`REQ-D6`, `REQ-P1`–`REQ-P4`, `REQ-A1`–`REQ-A4`, `REQ-O1`–`REQ-O5`, `I18N-06`–`I18N-09`, `DATA-01`–`DATA-06`, `MANAGE-01`.

## 8. Revision / support

No released version or support channel exists yet. Track design decisions in [the roadmap](../../global/ROADMAP.md); record material choices through [ADRs](../../global/ADRS.md). Update this guide in both languages with every contract or behavior change.
