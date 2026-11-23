import { describe, expect, it } from "vitest";
import { VectorTile, type VectorTileFeature, type VectorTileLayer } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { ZodError } from "zod";
import { encodeSyntheticTile, loadSyntheticFixture, parseSyntheticFixture } from "../src/encode-synthetic";

function decode(bytes: Uint8Array): VectorTile {
  expect(bytes.byteLength).toBeGreaterThan(0);
  return new VectorTile(new PbfReader(bytes));
}

function requiredLayer(tile: VectorTile): VectorTileLayer {
  const layer = tile.layers.synthetic;
  if (!layer) throw new Error("expected synthetic layer");
  return layer;
}

function featureById(layer: VectorTileLayer, id: number): VectorTileFeature {
  for (let index = 0; index < layer.length; index += 1) {
    const feature = layer.feature(index);
    if (feature.id === id) return feature;
  }
  throw new Error(`expected feature ${id}`);
}

function candidateTileBounds(z: number, x: number, y: number) {
  const tileCount = 2 ** z;
  const latitudeAtRow = (row: number) =>
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * row) / tileCount))) * 180) / Math.PI;
  return {
    west: (x / tileCount) * 360 - 180,
    east: ((x + 1) / tileCount) * 360 - 180,
    south: latitudeAtRow(y + 1),
    north: latitudeAtRow(y),
  };
}

describe("synthetic MVT candidate encode/decode", () => {
  it("runs Vitest with Bun as the JavaScript runtime", () => {
    expect(process.versions.bun).toBeDefined();
  });

  it("encodes and decodes synthetic point, line and polygon features", () => {
    const tile = decode(encodeSyntheticTile());
    const layer = requiredLayer(tile);
    expect(layer.version).toBe(2);
    expect(layer.extent).toBe(4096);
    expect(layer.length).toBe(9);

    const features = Array.from({ length: layer.length }, (_, index) => layer.feature(index));
    expect(features.map((feature) => feature.id ?? -1).sort((a, b) => a - b)).toEqual([
      101, 202, 303, 404, 505, 606, 707, 808, 909,
    ]);
    expect(
      features
        .map((feature) => feature.toGeoJSON(2, 2, 2).geometry?.type)
        .sort(),
    ).toEqual([
      "LineString",
      "LineString",
      "LineString",
      "MultiPolygon",
      "Point",
      "Polygon",
      "Polygon",
      "Polygon",
      "Polygon",
    ]);

    expect(featureById(layer, 101).properties["name:fa"]).toBe("نقطه آزمایشی");
    expect(featureById(layer, 303).properties.actual_language).toBe("fa");
    expect(featureById(layer, 202).properties.is_synthetic).toBe(true);
  });

  it("clips a synthetic line crossing the XYZ tile boundary into both neighboring tiles", () => {
    const westLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 2 })));
    const eastLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 3, y: 2 })));
    const westCoordinates = featureById(westLayer, 404).toGeoJSON(2, 2, 2).geometry;
    const eastCoordinates = featureById(eastLayer, 404).toGeoJSON(3, 2, 2).geometry;

    if (westCoordinates?.type !== "LineString" || eastCoordinates?.type !== "LineString") {
      throw new Error("expected the boundary-crossing fixture to decode as lines");
    }
    expect(westCoordinates.coordinates.every(([longitude]) => longitude >= 0 && longitude <= 90.0001)).toBe(true);
    expect(eastCoordinates.coordinates.every(([longitude]) => longitude >= 89.9999 && longitude <= 180)).toBe(true);
  });

  it("clips a north-south line across the boundary between neighboring XYZ rows", () => {
    const northLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 1 })));
    const southLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 2 })));
    const northGeometry = featureById(northLayer, 808).toGeoJSON(2, 1, 2).geometry;
    const southGeometry = featureById(southLayer, 808).toGeoJSON(2, 2, 2).geometry;

    if (northGeometry?.type !== "LineString" || southGeometry?.type !== "LineString") {
      throw new Error("expected the row-boundary fixture to decode as lines");
    }
    expect(northGeometry.coordinates.every(([, latitude]) => latitude >= -0.01 && latitude <= 5.01)).toBe(
      true,
    );
    expect(southGeometry.coordinates.every(([, latitude]) => latitude >= -5.01 && latitude <= 0.01)).toBe(
      true,
    );
    expect(northGeometry.coordinates.some(([, latitude]) => Math.abs(latitude) <= 0.01)).toBe(true);
    expect(southGeometry.coordinates.some(([, latitude]) => Math.abs(latitude) <= 0.01)).toBe(true);
  });

  it("clips and closes a polygon crossing the boundary between neighboring XYZ rows", () => {
    const northLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 1 })));
    const southLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 2 })));
    const northGeometry = featureById(northLayer, 909).toGeoJSON(2, 1, 2).geometry;
    const southGeometry = featureById(southLayer, 909).toGeoJSON(2, 2, 2).geometry;

    if (northGeometry?.type !== "Polygon" || southGeometry?.type !== "Polygon") {
      throw new Error("expected the row-boundary fixture to decode as polygons");
    }
    const northRing = northGeometry.coordinates[0];
    const southRing = southGeometry.coordinates[0];
    expect(northRing).toBeDefined();
    expect(southRing).toBeDefined();
    for (const ring of [northRing, southRing]) {
      expect(ring.length).toBeGreaterThanOrEqual(4);
      expect(ring[0]).toEqual(ring.at(-1));
      expect(ring.every(([longitude]) => longitude >= 29.99 && longitude <= 40.01)).toBe(true);
    }
    expect(northRing.every(([, latitude]) => latitude >= -0.01 && latitude <= 5.01)).toBe(true);
    expect(southRing.every(([, latitude]) => latitude >= -5.01 && latitude <= 0.01)).toBe(true);
    expect(northRing.some(([, latitude]) => Math.abs(latitude) <= 0.01)).toBe(true);
    expect(southRing.some(([, latitude]) => Math.abs(latitude) <= 0.01)).toBe(true);
  });

  it("clips and closes a synthetic polygon crossing the boundary in both tiles", () => {
    const westLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 2 })));
    const eastLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 3, y: 2 })));
    const westGeometry = featureById(westLayer, 505).toGeoJSON(2, 2, 2).geometry;
    const eastGeometry = featureById(eastLayer, 505).toGeoJSON(3, 2, 2).geometry;

    if (westGeometry?.type !== "Polygon" || eastGeometry?.type !== "Polygon") {
      throw new Error("expected the boundary-crossing fixture to decode as polygons");
    }
    const westRing = westGeometry.coordinates[0];
    const eastRing = eastGeometry.coordinates[0];
    expect(westRing).toBeDefined();
    expect(eastRing).toBeDefined();
    expect(westRing.length).toBeGreaterThanOrEqual(4);
    expect(eastRing.length).toBeGreaterThanOrEqual(4);
    expect(westRing[0]).toEqual(westRing.at(-1));
    expect(eastRing[0]).toEqual(eastRing.at(-1));
    expect(westRing.every(([longitude]) => longitude >= 0 && longitude <= 90.0001)).toBe(true);
    expect(eastRing.every(([longitude]) => longitude >= 89.9999 && longitude <= 180)).toBe(true);
  });

  it("preserves a polygon hole while clipping its exterior across neighboring tiles", () => {
    const westLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 2 })));
    const eastLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 3, y: 2 })));
    const westGeometry = featureById(westLayer, 606).toGeoJSON(2, 2, 2).geometry;
    const eastGeometry = featureById(eastLayer, 606).toGeoJSON(3, 2, 2).geometry;

    if (westGeometry?.type !== "Polygon" || eastGeometry?.type !== "Polygon") {
      throw new Error("expected the boundary-crossing fixture to decode as polygons");
    }
    expect(westGeometry.coordinates).toHaveLength(2);
    expect(eastGeometry.coordinates).toHaveLength(1);
    const eastRing = eastGeometry.coordinates[0];
    expect(eastRing).toBeDefined();
    expect(eastRing.length).toBeGreaterThanOrEqual(4);
    expect(eastRing[0]).toEqual(eastRing.at(-1));
    expect(eastRing.every(([longitude]) => longitude >= 89.9999 && longitude <= 100.01)).toBe(true);
    for (const ring of westGeometry.coordinates) {
      expect(ring.length).toBeGreaterThanOrEqual(4);
      expect(ring[0]).toEqual(ring.at(-1));
      expect(ring.every(([longitude]) => longitude >= 0 && longitude <= 90.0001)).toBe(true);
    }
    const [outerRing, holeRing] = westGeometry.coordinates;
    expect(outerRing).toBeDefined();
    expect(holeRing).toBeDefined();
    expect(holeRing.every(([longitude]) => longitude >= 83.99 && longitude <= 88.01)).toBe(true);
    expect(holeRing.every(([, latitude]) => latitude >= -32.01 && latitude <= -27.99)).toBe(true);

    const signedArea = (ring: typeof outerRing) =>
      ring.slice(0, -1).reduce((area, [longitude, latitude], index) => {
        const next = ring[index + 1];
        if (!next) throw new Error("expected a closed polygon ring");
        return area + longitude * next[1]! - next[0]! * latitude;
      }, 0);
    expect(Math.sign(signedArea(outerRing))).toBe(-Math.sign(signedArea(holeRing)));
  });

  it("clips a multipolygon feature across neighboring tiles and preserves its separate component", () => {
    const westLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 2, y: 2 })));
    const eastLayer = requiredLayer(decode(encodeSyntheticTile({ z: 2, x: 3, y: 2 })));
    const westGeometry = featureById(westLayer, 707).toGeoJSON(2, 2, 2).geometry;
    const eastGeometry = featureById(eastLayer, 707).toGeoJSON(3, 2, 2).geometry;

    if (
      (westGeometry?.type !== "Polygon" && westGeometry?.type !== "MultiPolygon") ||
      (eastGeometry?.type !== "Polygon" && eastGeometry?.type !== "MultiPolygon")
    ) {
      throw new Error("expected the boundary-crossing fixture to decode as polygonal geometries");
    }
    const westParts = westGeometry.type === "Polygon" ? [westGeometry.coordinates] : westGeometry.coordinates;
    const eastParts = eastGeometry.type === "Polygon" ? [eastGeometry.coordinates] : eastGeometry.coordinates;
    expect(westParts).toHaveLength(2);
    expect(eastParts).toHaveLength(1);
    const separateWestComponent = westParts.find((part) =>
      part.flat().every((position) => position[0] >= 69.99 && position[0] <= 75.01),
    );
    expect(separateWestComponent).toBeDefined();

    for (const part of [...westParts, ...eastParts]) {
      expect(part).toHaveLength(1);
      const ring = part[0];
      expect(ring).toBeDefined();
      expect(ring.length).toBeGreaterThanOrEqual(4);
      expect(ring[0]).toEqual(ring.at(-1));
    }
    const westLongitudes = westParts.flat(2).map(([longitude]) => longitude);
    const eastLongitudes = eastParts.flat(2).map(([longitude]) => longitude);
    expect(westLongitudes.every((longitude) => longitude >= 0 && longitude <= 90.0001)).toBe(true);
    expect(eastLongitudes.every((longitude) => longitude >= 89.9999 && longitude <= 100.01)).toBe(true);
  });

  it("keeps the complete synthetic fixture in a candidate z-zero world tile", () => {
    const layer = requiredLayer(decode(encodeSyntheticTile({ z: 0, x: 0, y: 0 })));
    expect(Array.from({ length: layer.length }, (_, index) => layer.feature(index).id).sort((a, b) => {
      return (a ?? -1) - (b ?? -1);
    })).toEqual([101, 202, 303, 404, 505, 606, 707, 808, 909]);
  });

  it("keeps a synthetic point within its candidate tile at two zoom levels", () => {
    for (const { z, x, y } of [
      { z: 1, x: 1, y: 1 },
      { z: 3, x: 4, y: 4 },
    ]) {
      const layer = requiredLayer(decode(encodeSyntheticTile({ z, x, y })));
      const point = featureById(layer, 101);
      const geometry = point.toGeoJSON(x, y, z).geometry;
      const bounds = candidateTileBounds(z, x, y);

      if (geometry?.type !== "Point") throw new Error("expected the synthetic point to decode as a point");
      const [longitude, latitude] = geometry.coordinates;
      expect(longitude).toBeGreaterThanOrEqual(bounds.west);
      expect(longitude).toBeLessThanOrEqual(bounds.east);
      expect(latitude).toBeGreaterThanOrEqual(bounds.south);
      expect(latitude).toBeLessThanOrEqual(bounds.north);
      expect(point.properties["name:en"]).toBe("Synthetic point");
    }
  });

  it("encodes the same synthetic tile deterministically", () => {
    expect(encodeSyntheticTile()).toEqual(encodeSyntheticTile());
  });

  it("rejects a valid tile coordinate where the fixture has no features", () => {
    expect(() => encodeSyntheticTile({ z: 2, x: 1, y: 2 })).toThrow(/has no features/);
  });

  it("keeps the fixture explicit, valid GeoJSON and synthetic", () => {
    const fixture = loadSyntheticFixture();
    expect(fixture.type).toBe("FeatureCollection");
    expect(fixture.features).toHaveLength(9);
    expect(fixture.features.every((feature) => feature.properties?.is_synthetic === true)).toBe(true);
    expect([...new Set(fixture.features.map((feature) => feature.geometry?.type))].sort()).toEqual([
      "LineString",
      "MultiPolygon",
      "Point",
      "Polygon",
    ]);
  });

  it("rejects an open polygon ring in a synthetic fixture with Zod", () => {
    const malformedFixture = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: 1,
          properties: { is_synthetic: true },
          geometry: {
            type: "Polygon",
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1]]],
          },
        },
      ],
    };
    expect(() => parseSyntheticFixture(malformedFixture)).toThrow(ZodError);
  });

  it("rejects invalid or out-of-range tile coordinates with Zod", () => {
    expect(() => encodeSyntheticTile({ z: -1, x: 0, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 9, x: 0, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2, x: 4, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2, x: 1.5, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2, x: 0, y: 4 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2, x: 0, y: 1.5 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2.5, x: 0, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: Number.NaN, x: 0, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2, x: -1, y: 0 })).toThrow(ZodError);
    expect(() => encodeSyntheticTile({ z: 2, x: 0, y: -1 })).toThrow(ZodError);
    const optionsWithUnknownKey = { z: 2, x: 2, y: 2, ignored: true };
    expect(() => encodeSyntheticTile(optionsWithUnknownKey)).toThrow(ZodError);
  });
});
