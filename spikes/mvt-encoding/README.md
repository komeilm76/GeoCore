# MVT encode/decode spike

**State:** Isolated, non-production candidate evaluation for ADR-0001. Mapbox Vector Tile is being tested as a payload candidate only; this does not select it for GeoCore or define a serving API.

## What it tests

A small checked-in synthetic GeoJSON FeatureCollection with point, line, polygon and multipolygon features is sliced with `geojson-vt`, encoded with `vt-pbf`, and decoded back with `@mapbox/vector-tile` and `pbf`. Tests verify layer metadata, geometry types, numeric feature IDs, English/Persian UTF-8 properties, a synthetic-data marker, line and polygon clipping across neighboring XYZ columns and rows, one bounded hole/multipolygon case, candidate zoom placement, Zod-based fixture/option validation for this checked-in subset (including nested JSON properties), rejection of open polygon rings, rejection of invalid/out-of-range coordinates and unknown option keys, MapLibre style-spec validation, and source-layer/property-reference checks against the encoded tile.

## Run

Uses Bun 1.4.5, strict TypeScript 7.0.2 and Vitest 5.1.1. Dependencies are pinned in `package.json` and `bun.lock` for this isolated spike:

```sh
bun install --frozen-lockfile
bun run check
bun run audit
```

Do not use this package manifest as a production GeoCore service manifest.

## Current result

The strict TypeScript check and all nineteen Vitest tests pass in the current workspace (Bun 1.4.5). The encoded bytes decode into an MVT v2 layer with extent 4096 and preserve the tested point/line/polygon/multipolygon identities and selected properties; synthetic lines and polygonal geometries appear clipped across neighboring test tiles, including a line and polygon crossing the XYZ row boundary; clipped exterior rings remain closed, one interior hole remains within its exterior and has opposite ring winding, and a separate multipolygon component remains distinct; repeated builds are byte-deterministic, a candidate z-zero world tile contains all synthetic fixture features, one point remains within its candidate tile at two additional test zooms, and an empty fixture tile is reported distinctly. Zod validates candidate tile options and the checked-in fixture subset, including polygon ring closure and nested JSON-valued properties; this is not a general GeoJSON schema or product API contract. The MapLibre style-spec validates a synthetic candidate style, while a separate check compares `source-layer` and style `get` references with the encoded layer; no tile is loaded or rendered by MapLibre. The fixture is synthetic; it contains no actual OSM or personal-location data. These sample zoom/extent/version settings are test parameters, not product choices.

The direct packages are `geojson-vt` 5.0.4 (ISC), `vt-pbf` 3.1.3 (MIT), `@mapbox/vector-tile` 3.0.0 (BSD-3-Clause), `pbf` 5.2.0 (BSD-3-Clause), and `zod` 4.6.7 (MIT). The development dependency `@maplibre/maplibre-gl-style-spec` 26.9.0 has inconsistent license signals: npm/package metadata declares ISC, while its README badge indicates BSD-3-Clause and its distributed license file includes BSD-3-Clause terms and a legacy Mapbox section. This remains an open compliance item; no legal conclusion or clearance is claimed. Per the owner’s decision, development continues with the package while authoritative clarification from MapLibre is pending. This does not resolve the issue or waive applicable release review.

`bun.lock` pins resolved dependencies and integrity data; it is not a transitive license inventory. A Bun audit of the entire locked dependency tree, including development tooling, reported no known vulnerabilities at the time of the run. This is not a legal approval, complete license opinion, supply-chain certification or guarantee against future advisories. Re-review licenses and advisories before any production use.

## Not tested / not selected

No MapLibre rendering or actual style application, label fallback rendering, glyph/font delivery, general polygon-hole or multipolygon clipping (one synthetic hole case and one multipolygon component-clipping case are tested), tile matrix/API, HTTP behavior, data artifact, storage, cache, authorization, tenant separation, both hosting models, actual OSM extraction, attribution, performance or production resource limits are tested. Style validation and property-reference checks cover only the candidate fixture; no tile is loaded or rendered by MapLibre. In particular, UTF-8 property round-trip does **not** prove correct display or language support. ADR-0001 and all release gates remain open.
