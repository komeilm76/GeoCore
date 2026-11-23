# MVT encode/decode spike

**State:** Isolated, non-production candidate evaluation for ADR-0001. Mapbox Vector Tile is being tested as a payload candidate only; this does not select it for GeoCore or define a serving API.

## What it tests

A small checked-in synthetic GeoJSON FeatureCollection with point, line and polygon features is sliced with `geojson-vt`, encoded with `vt-pbf`, and decoded back with `@mapbox/vector-tile` and `pbf`. Tests verify layer metadata, geometry types, numeric feature IDs, English/Persian UTF-8 properties, a synthetic-data marker, and clipping of a line and polygon across neighboring XYZ tiles. Invalid tile coordinate ranges are rejected.

## Run

Uses Bun 1.4.5, strict TypeScript 7.0.2 and Vitest 5.1.1. Dependencies are pinned in `package.json` and `bun.lock` for this isolated spike:

```sh
bun install --frozen-lockfile
bun run check
bun run audit
```

Do not use this package manifest as a production GeoCore service manifest.

## Current result

The strict TypeScript check and all fourteen Vitest tests pass in the current workspace (Bun 1.4.5). The encoded bytes decode into an MVT v2 layer with extent 4096 and preserve the tested point/line/polygon/multipolygon identities and selected properties; synthetic lines and polygonal geometries appear clipped across neighboring test tiles, including a line and polygon crossing the XYZ row boundary; clipped exterior rings remain closed, one interior hole remains within its exterior and has opposite ring winding, and a separate multipolygon component remains distinct; repeated builds are byte-deterministic, a candidate z-zero world tile contains all synthetic fixture features, one point remains within its candidate tile at two additional test zooms, and an empty fixture tile is reported distinctly. The fixture is synthetic; it contains no actual OSM or personal-location data. These sample zoom/extent/version settings are test parameters, not product choices.

The direct packages are `geojson-vt` 5.0.4 (ISC), `vt-pbf` 3.1.3 (MIT), `@mapbox/vector-tile` 3.0.0 (BSD-3-Clause) and `pbf` 5.2.0 (BSD-3-Clause). The candidate `@maplibre/maplibre-gl-style-spec` 26.9.0 was removed from the manifest and lockfile after review found inconsistent license signals: npm/package metadata declares ISC, while its README badge indicates BSD-3-Clause and its distributed license file includes BSD-3-Clause terms and a legacy Mapbox section. The discrepancy is unresolved; this is not a legal conclusion. The package is not retained in CI or as an ongoing validator, and reintroduction is blocked pending qualified license review.

`bun.lock` pins resolved dependencies and integrity data; it is not a transitive license inventory. A Bun audit of the entire locked dependency tree, including development tooling, reported no known vulnerabilities at the time of the run. This is not a legal approval, complete license opinion, supply-chain certification or guarantee against future advisories. Re-review licenses and advisories before any production use.

## Not tested / not selected

No MapLibre rendering, style-schema validation, actual style application, label fallback rendering, glyph/font delivery, general polygon-hole or multipolygon clipping (one synthetic hole case and one multipolygon component-clipping case are tested), tile matrix/API, HTTP behavior, data artifact, storage, cache, authorization, tenant separation, both hosting models, actual OSM extraction, attribution, performance or production resource limits are tested. No tile is loaded by MapLibre. In particular, UTF-8 property round-trip does **not** prove correct display or language support. ADR-0001 and all release gates remain open.
