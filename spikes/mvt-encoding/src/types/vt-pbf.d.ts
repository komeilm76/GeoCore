declare module "vt-pbf" {
  import type { LegacyTile } from "geojson-vt";

  export interface GeoJSONTileOptions {
    version?: number;
    extent?: number;
  }

  export interface VtPbf {
    fromGeojsonVt(layers: Record<string, LegacyTile>, options?: GeoJSONTileOptions): Uint8Array;
  }

  const vtPbf: VtPbf;
  export default vtPbf;
}
