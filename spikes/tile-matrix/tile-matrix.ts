// Non-production spike only. This code evaluates common Web Mercator tile indexing;
// it does not select GeoCore's tile matrix, URL, payload, zoom limits or API.
export const MAX_MERCATOR_LATITUDE = 85.0511287798066;

export interface TileCoordinate {
  x: number;
  y: number;
  z: number;
}

function validateZoom(zoom: number): void {
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > 30) {
    throw new RangeError("zoom must be an integer from 0 through 30 for this spike");
  }
}

function validateTileCoordinate(value: number, name: string, worldSize: number): void {
  if (!Number.isInteger(value) || value < 0 || value >= worldSize) {
    throw new RangeError(`${name} must be an integer in [0, ${worldSize - 1}]`);
  }
}

/**
 * Convert WGS84 longitude/latitude degrees to Web Mercator XYZ tile indices.
 * Latitude is clamped to the Web Mercator square's mathematical limit.
 * Longitude +180 is assigned to the last tile rather than a nonexistent x=n.
 * These are spike semantics, not an approved GeoCore API contract.
 */
export function lonLatToXyz(longitude: number, latitude: number, zoom: number): TileCoordinate {
  validateZoom(zoom);
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new RangeError("longitude must be finite and within [-180, 180] degrees");
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new RangeError("latitude must be finite and within [-90, 90] degrees");
  }

  const worldSize = 2 ** zoom;
  const clampedLatitude = Math.max(
    -MAX_MERCATOR_LATITUDE,
    Math.min(MAX_MERCATOR_LATITUDE, latitude),
  );
  const xRaw = Math.floor(((longitude + 180) / 360) * worldSize);
  const latitudeRadians = (clampedLatitude * Math.PI) / 180;
  const yRaw = Math.floor(
    ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * worldSize,
  );

  // The eastern world edge is half-open in tile space. Clamp numerical boundary
  // results so that +/-180 and the projected north/south edges stay in range.
  return {
    x: Math.max(0, Math.min(worldSize - 1, xRaw)),
    y: Math.max(0, Math.min(worldSize - 1, yRaw)),
    z: zoom,
  };
}

/** Convert an XYZ tile coordinate to the equivalent TMS row coordinate. */
export function xyzToTms({ x, y, z }: TileCoordinate): TileCoordinate {
  validateZoom(z);
  const worldSize = 2 ** z;
  validateTileCoordinate(x, "x", worldSize);
  validateTileCoordinate(y, "y", worldSize);
  return { x, y: worldSize - 1 - y, z };
}

/** Convert a TMS tile coordinate to the equivalent XYZ row coordinate. */
export function tmsToXyz({ x, y, z }: TileCoordinate): TileCoordinate {
  // A vertical flip is its own inverse; validating through xyzToTms also checks
  // the input coordinates and exact range semantics.
  return xyzToTms({ x, y, z });
}
