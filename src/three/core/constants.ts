import type { QualityPreset, LightingPreset } from "./types";
import { staticFile } from "remotion";

export const DEFAULT_3D_FONT = staticFile("fonts/default.ttf");

export interface QualityConfig {
  dpr: number; // Device pixel ratio
  antialias: boolean;
  shadows: boolean;
  maxParticles: number;
  powerPreference: "high-performance" | "default";
}

export const QUALITY_CONFIGS: Record<QualityPreset, QualityConfig> = {
  preview: {
    dpr: 1,
    antialias: false,
    shadows: false,
    maxParticles: 300,
    powerPreference: "default",
  },
  standard: {
    dpr: 1.5,
    antialias: true,
    shadows: true,
    maxParticles: 800,
    powerPreference: "high-performance",
  },
  high: {
    dpr: 2,
    antialias: true,
    shadows: true,
    maxParticles: 2000,
    powerPreference: "high-performance",
  },
};

export interface LightingRig {
  ambient: { color: string; intensity: number };
  main: { color: string; intensity: number; position: [number, number, number] };
  fill?: { color: string; intensity: number; position: [number, number, number] };
  rim?: { color: string; intensity: number; position: [number, number, number] };
}

export const LIGHTING_RIGS: Record<LightingPreset, LightingRig> = {
  studio: {
    ambient: { color: "#ffffff", intensity: 0.6 },
    main: { color: "#ffffff", intensity: 1.8, position: [5, 8, 5] },
    fill: { color: "#93c5fd", intensity: 0.8, position: [-5, -2, -3] },
    rim: { color: "#38bdf8", intensity: 1.2, position: [0, 6, -6] },
  },
  cyberpunk: {
    ambient: { color: "#1e1b4b", intensity: 0.5 },
    main: { color: "#ec4899", intensity: 2.2, position: [-6, 5, 4] },
    fill: { color: "#06b6d4", intensity: 2.0, position: [6, -2, 3] },
    rim: { color: "#a855f7", intensity: 1.5, position: [0, 8, -5] },
  },
  dramatic: {
    ambient: { color: "#090d16", intensity: 0.2 },
    main: { color: "#ffffff", intensity: 3.0, position: [7, 10, 4] },
    rim: { color: "#38bdf8", intensity: 1.8, position: [-5, -2, -5] },
  },
  warm: {
    ambient: { color: "#fef3c7", intensity: 0.7 },
    main: { color: "#f59e0b", intensity: 2.0, position: [4, 6, 4] },
    fill: { color: "#fbbf24", intensity: 0.6, position: [-4, 2, -2] },
  },
  cool: {
    ambient: { color: "#e0f2fe", intensity: 0.6 },
    main: { color: "#38bdf8", intensity: 1.8, position: [5, 6, 5] },
    fill: { color: "#818cf8", intensity: 0.9, position: [-5, 0, -3] },
  },
  flat: {
    ambient: { color: "#ffffff", intensity: 1.5 },
    main: { color: "#ffffff", intensity: 1.0, position: [0, 10, 10] },
  },
};

/**
 * Seeded deterministic PRNG (Linear Congruential Generator / Mulberry32)
 * Ensures 100% frame-by-frame and render-by-render reproducibility.
 */
export function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
