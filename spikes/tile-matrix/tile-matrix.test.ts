import { describe, expect, it } from "vitest";
import {
  lonLatToXyz,
  MAX_MERCATOR_LATITUDE,
  tmsToXyz,
  xyzToTms,
} from "./tile-matrix";

describe("candidate XYZ/TMS tile-matrix arithmetic", () => {
  it("runs Vitest with Bun as the JavaScript runtime", () => {
    expect(process.versions.bun).toBeDefined();
  });

  it("maps the origin to the only z0 tile", () => {
    expect(lonLatToXyz(0, 0, 0)).toEqual({ x: 0, y: 0, z: 0 });
  });

  it("maps the equator and prime meridian to the expected z1 east/south tile", () => {
    expect(lonLatToXyz(0, 0, 1)).toEqual({ x: 1, y: 1, z: 1 });
  });

  it("maps world edges into the half-open XYZ tile range", () => {
    expect(lonLatToXyz(-180, 0, 2)).toEqual({ x: 0, y: 2, z: 2 });
    expect(lonLatToXyz(180, 0, 2)).toEqual({ x: 3, y: 2, z: 2 });
    expect(lonLatToXyz(0, MAX_MERCATOR_LATITUDE, 2)).toEqual({ x: 2, y: 0, z: 2 });
    expect(lonLatToXyz(0, -MAX_MERCATOR_LATITUDE, 2)).toEqual({ x: 2, y: 3, z: 2 });
  });

  it("clamps latitude beyond the Web Mercator limit", () => {
    expect(lonLatToXyz(0, 90, 3)).toEqual(lonLatToXyz(0, MAX_MERCATOR_LATITUDE, 3));
    expect(lonLatToXyz(0, -90, 3)).toEqual(lonLatToXyz(0, -MAX_MERCATOR_LATITUDE, 3));
  });

  it("converts XYZ and TMS by flipping only the row and is invertible", () => {
    for (let z = 0; z <= 8; z += 1) {
      const worldSize = 2 ** z;
      const samples = [0, Math.floor(worldSize / 2), worldSize - 1];
      for (const x of samples) {
        for (const y of samples) {
          const xyz = { x, y, z };
          const tms = xyzToTms(xyz);
          expect(tms).toEqual({ x, y: worldSize - 1 - y, z });
          expect(tmsToXyz(tms)).toEqual(xyz);
        }
      }
    }
  });

  it("rejects invalid zooms and tile coordinates instead of silently wrapping", () => {
    for (const zoom of [-1, 1.5, 31, Number.NaN]) {
      expect(() => lonLatToXyz(0, 0, zoom)).toThrow(RangeError);
    }
    expect(() => lonLatToXyz(181, 0, 2)).toThrow(RangeError);
    expect(() => lonLatToXyz(0, 91, 2)).toThrow(RangeError);
    expect(() => xyzToTms({ x: 4, y: 0, z: 2 })).toThrow(RangeError);
    expect(() => xyzToTms({ x: 0, y: 4, z: 2 })).toThrow(RangeError);
  });
});
