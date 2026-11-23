import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import GeoJSONVT, { type LegacyTile } from "geojson-vt";
import vtPbf from "vt-pbf";
import type { FeatureCollection } from "geojson";
import { z } from "zod";

const PositionSchema = z.array(z.number()).min(2);
const LinearRingSchema = z
  .array(PositionSchema)
  .min(4)
  .refine((ring) => {
    const first = ring[0];
    const last = ring.at(-1);
    return (
      first !== undefined &&
      last !== undefined &&
      first.length === last.length &&
      first.every((ordinate, index) => ordinate === last[index])
    );
  }, "polygon rings must be closed");

const GeometrySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("Point"), coordinates: PositionSchema }).strict(),
  z.object({ type: z.literal("LineString"), coordinates: z.array(PositionSchema).min(2) }).strict(),
  z.object({ type: z.literal("Polygon"), coordinates: z.array(LinearRingSchema).min(1) }).strict(),
  z
    .object({
      type: z.literal("MultiPolygon"),
      coordinates: z.array(z.array(LinearRingSchema).min(1)).min(1),
    })
    .strict(),
]);

const SyntheticFeatureCollectionSchema = z
  .object({
    type: z.literal("FeatureCollection"),
    features: z.array(
      z
        .object({
          type: z.literal("Feature"),
          id: z.union([z.string(), z.number()]).optional(),
          properties: z.record(z.string(), z.json()).nullable(),
          geometry: GeometrySchema,
        })
        .strict(),
    ),
  })
  .strict();

export function parseSyntheticFixture(value: unknown): FeatureCollection {
  return SyntheticFeatureCollectionSchema.parse(value);
}

const fixturePath = new URL("../fixtures/synthetic.geojson", import.meta.url);
const parsedFixture: FeatureCollection = parseSyntheticFixture(
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
