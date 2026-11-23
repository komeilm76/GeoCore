import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import GeoJSONVT, { type LegacyTile } from "geojson-vt";
import vtPbf from "vt-pbf";
import type { FeatureCollection } from "geojson";

function parseFeatureCollection(value: unknown): FeatureCollection {
  if (
    typeof value !== "object" ||
    value === null ||
    !("type" in value) ||
    !("features" in value) ||
    value.type !== "FeatureCollection" ||
    !Array.isArray(value.features)
  ) {
    throw new TypeError("the checked-in synthetic fixture must be a GeoJSON FeatureCollection");
  }
  // The fixture is checked in and its member geometry/IDs are exercised by tests;
  // this assertion only bridges the top-level JSON.parse value to GeoJSON's type.
  return value as FeatureCollection;
}

const fixturePath = new URL("../fixtures/synthetic.geojson", import.meta.url);
const parsedFixture: FeatureCollection = parseFeatureCollection(
  JSON.parse(readFileSync(fileURLToPath(fixturePath), "utf8")) as unknown,
);

export interface SyntheticTileOptions {
  z?: number;
  x?: number;
  y?: number;
}

/**
 * Encode the repository's synthetic fixture as one candidate MVT payload.
 * Non-production only: these settings and the z/x/y choice are not a GeoCore contract.
 */
export function encodeSyntheticTile({ z = 2, x = 2, y = 2 }: SyntheticTileOptions = {}): Uint8Array {
  if (!Number.isInteger(z) || z < 0 || z > 8) {
    throw new RangeError("spike zoom must be an integer from 0 through 8");
  }
  const worldSize = 2 ** z;
  if (!Number.isInteger(x) || x < 0 || x >= worldSize) {
    throw new RangeError(`x must be an integer in [0, ${worldSize - 1}]`);
  }
  if (!Number.isInteger(y) || y < 0 || y >= worldSize) {
    throw new RangeError(`y must be an integer in [0, ${worldSize - 1}]`);
  }

  const index = new GeoJSONVT(parsedFixture, {
    maxZoom: 8,
    indexMaxZoom: 8,
    indexMaxPoints: 100000,
    extent: 4096,
    buffer: 0,
    tolerance: 0,
    lineMetrics: false,
  });
  const tile: LegacyTile | null = index.getTile(z, x, y);
  if (!tile) throw new RangeError(`synthetic fixture has no features in tile ${z}/${x}/${y}`);
  return vtPbf.fromGeojsonVt(
    { synthetic: tile },
    { version: 2, extent: 4096 },
  );
}

export function loadSyntheticFixture(): FeatureCollection {
  return structuredClone(parsedFixture);
}
