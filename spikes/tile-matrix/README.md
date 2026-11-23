# Tile matrix indexing spike

**State:** Non-production mathematical spike for ADR-0001. It does not select GeoCore's tile matrix, payload, URL/API or zoom limit.

## Question tested

For the candidate Web Mercator XYZ matrix, do longitude/latitude indexing and the XYZ↔TMS row flip behave consistently at world edges, projection limits, zoom zero and invalid inputs?

## Run

Uses Bun 1.4.5, strict TypeScript 7.0.2 and Vitest 5.1.1. Install from the committed lockfile and run the type check and tests:

```sh
bun install --frozen-lockfile
bun run check
```

## Observed result

The strict TypeScript check and all seven Vitest tests pass in the current workspace (Bun 1.4.5). They verify the z0 origin, z1 equator/prime-meridian cell, ±180° edge behavior, Web Mercator latitude clamping, the XYZ/TMS inverse property on boundary/midpoint sample indices, and rejection of invalid zoom/tile coordinates.

## Explicit spike semantics

- Inputs are longitude then latitude in degrees; this module is not a GeoJSON parser or service contract.
- This candidate clamps latitude to ±85.0511287798066 degrees, the square Web Mercator limit.
- Longitude +180° maps to the final tile column rather than an out-of-range x index; values outside [-180°, 180°] are rejected, not wrapped.
- The harness permits integer zooms 0–30 only as a bounded numeric test. This is **not** the product's approved minimum/maximum zoom.
- XYZ has origin at the north/top row; TMS conversion flips y to `2^z - 1 - y`.

These choices are test assumptions, not finalized product behavior. In particular, the handling of geographic poles, antimeridian, arbitrary projections, input validation in a future API, and tile matrix standard remain subject to owner/technical review.

## What it does not test

It does not generate MVT or any tile payload, render MapLibre, test fonts/labels, handle actual OSM data, validate a license, select a storage artifact, serve HTTP, implement authorization/cache, or measure performance. The broader format/API/storage comparison in ADR-0001 remains open. No result here supports a coverage or production-readiness claim.
