import { describe, expect, it } from "vitest";
import { VectorTile, type VectorTileFeature, type VectorTileLayer } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { encodeSyntheticTile, loadSyntheticFixture } from "../src/encode-synthetic";

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

describe("synthetic MVT candidate encode/decode", () => {
  it("runs Vitest with Bun as the JavaScript runtime", () => {
    expect(process.versions.bun).toBeDefined();
  });

  it("encodes and decodes synthetic point, line and polygon features", () => {
    const tile = decode(encodeSyntheticTile());
    const layer = requiredLayer(tile);
    expect(layer.version).toBe(2);
    expect(layer.extent).toBe(4096);
    expect(layer.length).toBe(5);

    const features = Array.from({ length: layer.length }, (_, index) => layer.feature(index));
    expect(features.map((feature) => feature.id ?? -1).sort((a, b) => a - b)).toEqual([
      101, 202, 303, 404, 505,
    ]);
    expect(
      features
        .map((feature) => feature.toGeoJSON(2, 2, 2).geometry?.type)
        .sort(),
    ).toEqual(["LineString", "LineString", "Point", "Polygon", "Polygon"]);

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

  it("encodes the same synthetic tile deterministically", () => {
    expect(encodeSyntheticTile()).toEqual(encodeSyntheticTile());
  });

  it("rejects a valid tile coordinate where the fixture has no features", () => {
    expect(() => encodeSyntheticTile({ z: 2, x: 1, y: 2 })).toThrow(/has no features/);
  });

  it("keeps the fixture explicit, valid GeoJSON and synthetic", () => {
    const fixture = loadSyntheticFixture();
    expect(fixture.type).toBe("FeatureCollection");
    expect(fixture.features).toHaveLength(5);
    expect(fixture.features.every((feature) => feature.properties?.is_synthetic === true)).toBe(true);
    expect([...new Set(fixture.features.map((feature) => feature.geometry?.type))].sort()).toEqual([
      "LineString",
      "Point",
      "Polygon",
    ]);
  });

  it("rejects invalid or out-of-range tile coordinates", () => {
    expect(() => encodeSyntheticTile({ z: -1, x: 0, y: 0 })).toThrow(RangeError);
    expect(() => encodeSyntheticTile({ z: 2, x: 4, y: 0 })).toThrow(RangeError);
    expect(() => encodeSyntheticTile({ z: 2, x: 0, y: 4 })).toThrow(RangeError);
    expect(() => encodeSyntheticTile({ z: 2.5, x: 0, y: 0 })).toThrow(RangeError);
  });
});
