import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import GeoJSONVT, { type LegacyTile } from "geojson-vt";
import vtPbf from "vt-pbf";
import type { FeatureCollection } from "geojson";
import { z } from "zod";

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

const SyntheticTileOptionsSchema = z
  .object({
    z: z.number().int().min(0).max(8).default(2),
    x: z.number().int().nonnegative().default(2),
    y: z.number().int().nonnegative().default(2),
  })
  .strict()
  .superRefine(({ z, x, y }, context) => {
    const worldSize = 2 ** z;
    if (x >= worldSize) {
      context.addIssue({
        code: "custom",
        path: ["x"],
        message: `x must be in [0, ${worldSize - 1}]`,
      });
    }
    if (y >= worldSize) {
      context.addIssue({
        code: "custom",
        path: ["y"],
        message: `y must be in [0, ${worldSize - 1}]`,
      });
    }
  });

export type SyntheticTileOptions = z.input<typeof SyntheticTileOptionsSchema>;

/**
 * Encode the repository's synthetic fixture as one candidate MVT payload.
 * Non-production only: these settings and the z/x/y choice are not a GeoCore contract.
 */
export function encodeSyntheticTile(options: SyntheticTileOptions = {}): Uint8Array {
  const { z, x, y } = SyntheticTileOptionsSchema.parse(options);

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
