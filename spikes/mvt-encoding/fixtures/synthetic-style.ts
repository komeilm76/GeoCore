import type { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";

/** Candidate-only style used for schema and tile/property-reference checks; no live endpoints are contacted. */
export const syntheticCandidateStyle = {
  version: 8,
  name: "Synthetic GeoCore candidate",
  glyphs: "https://fonts.example.invalid/{fontstack}/{range}.pbf",
  sources: {
    synthetic: {
      type: "vector",
      tiles: ["https://tiles.example.invalid/{z}/{x}/{y}.pbf"],
      minzoom: 0,
      maxzoom: 2,
    },
  },
  layers: [
    {
      id: "synthetic-background",
      type: "background",
      paint: { "background-color": "#f8fafc" },
    },
    {
      id: "synthetic-area",
      type: "fill",
      source: "synthetic",
      "source-layer": "synthetic",
      paint: { "fill-color": "#2563eb" },
    },
    {
      id: "synthetic-line",
      type: "line",
      source: "synthetic",
      "source-layer": "synthetic",
      paint: { "line-color": "#dc2626", "line-width": 2 },
    },
    {
      id: "synthetic-point",
      type: "circle",
      source: "synthetic",
      "source-layer": "synthetic",
      paint: { "circle-color": "#16a34a", "circle-radius": 5 },
    },
    {
      id: "synthetic-label",
      type: "symbol",
      source: "synthetic",
      "source-layer": "synthetic",
      layout: {
        "text-field": ["coalesce", ["get", "name:fa"], ["get", "name:en"]],
        "text-font": ["Noto Sans Arabic Regular"],
      },
    },
  ],
} satisfies StyleSpecification;
