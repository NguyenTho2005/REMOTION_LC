import type * as THREE from "three";

export type ParticlePresetType =
  | "explosion"
  | "formation"
  | "disintegration"
  | "wave"
  | "galaxy"
  | "data-flow"
  | "energy-sphere"
  | "tunnel"
  | "hologram"
  | "morphing";

export type ParticleQualityPreset = "preview" | "standard" | "high";

export interface ParticleQualityConfig {
  maxParticles: number;
  pointSizeMultiplier: number;
  useShaders: boolean;
  enableNoise: boolean;
  dpr: number;
}

export const PARTICLE_QUALITY_BUDGETS: Record<ParticleQualityPreset, ParticleQualityConfig> = {
  preview: {
    maxParticles: 1000,
    pointSizeMultiplier: 1.2,
    useShaders: true,
    enableNoise: false,
    dpr: 1.0,
  },
  standard: {
    maxParticles: 5000,
    pointSizeMultiplier: 1.0,
    useShaders: true,
    enableNoise: true,
    dpr: 1.5,
  },
  high: {
    maxParticles: 15000,
    pointSizeMultiplier: 0.85,
    useShaders: true,
    enableNoise: true,
    dpr: 2.0,
  },
};

export interface BaseParticleConfig {
  preset: ParticlePresetType;
  particleCount?: number;
  seed?: number;
  color?: string;
  secondaryColor?: string;
  size?: number;
  opacity?: number;
  speed?: number;
  spread?: number;
  startFrame?: number;
  durationInFrames?: number;
  quality?: ParticleQualityPreset;
  blending?: THREE.Blending;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export interface ExplosionConfig extends BaseParticleConfig {
  preset: "explosion";
  explosionForce?: number;
  gravity?: number;
  drag?: number;
}

export interface FormationConfig extends BaseParticleConfig {
  preset: "formation";
  targetShape?: "cube" | "sphere" | "torus" | "cylinder" | "logo-text";
  targetSize?: number;
}

export interface DisintegrationConfig extends BaseParticleConfig {
  preset: "disintegration";
  sourceShape?: "cube" | "sphere" | "torus";
  dissolveDirection?: [number, number, number];
}

export interface WaveConfig extends BaseParticleConfig {
  preset: "wave";
  frequency?: number;
  amplitude?: number;
  gridRows?: number;
  gridCols?: number;
}

export interface GalaxyConfig extends BaseParticleConfig {
  preset: "galaxy";
  arms?: number;
  armSpread?: number;
  coreRadius?: number;
  spiralTightness?: number;
}

export interface DataFlowConfig extends BaseParticleConfig {
  preset: "data-flow";
  nodeCount?: number;
  flowSpeed?: number;
  curveTightness?: number;
}

export interface EnergySphereConfig extends BaseParticleConfig {
  preset: "energy-sphere";
  radius?: number;
  pulseSpeed?: number;
  noiseStrength?: number;
}

export interface TunnelConfig extends BaseParticleConfig {
  preset: "tunnel";
  tunnelRadius?: number;
  tunnelLength?: number;
  travelSpeed?: number;
}

export interface HologramConfig extends BaseParticleConfig {
  preset: "hologram";
  scanSpeed?: number;
  glitchFrequency?: number;
  shape?: "cube" | "sphere" | "cylinder";
}

export interface MorphingConfig extends BaseParticleConfig {
  preset: "morphing";
  shapeA?: "sphere" | "cube" | "torus";
  shapeB?: "torus" | "sphere" | "cube";
}

export type AnyParticleConfig =
  | ExplosionConfig
  | FormationConfig
  | DisintegrationConfig
  | WaveConfig
  | GalaxyConfig
  | DataFlowConfig
  | EnergySphereConfig
  | TunnelConfig
  | HologramConfig
  | MorphingConfig;

export interface ParticleUniforms {
  uFrame: { value: number };
  uFps: { value: number };
  uTime: { value: number };
  uProgress: { value: number };
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uBaseSize: { value: number };
  uOpacity: { value: number };
  uNoiseStrength: { value: number };
  uResolution: { value: THREE.Vector2 };
  [uniform: string]: THREE.IUniform;
}
