import type { AnyParticleConfig } from "../particles/types";

export type QualityPreset = "preview" | "standard" | "high";

export type CameraPreset =
  | "static"
  | "orbit"
  | "dolly"
  | "zoom"
  | "flyThrough"
  | "topDown"
  | "isometric";

export type LightingPreset =
  | "studio"
  | "cyberpunk"
  | "dramatic"
  | "warm"
  | "cool"
  | "flat";

export type ObjectType =
  | "cube"
  | "sphere"
  | "cylinder"
  | "torus"
  | "text3d"
  | "particles"
  | "networkGraph"
  | "barChart"
  | "gltfModel";

export type AnimationType =
  | "rotate"
  | "pulse"
  | "float"
  | "scaleUp"
  | "explode"
  | "orbit"
  | "dataFlow"
  | "none";

export interface AnimationConfig {
  type: AnimationType;
  startFrame?: number;
  endFrame?: number;
  speed?: number;
  axis?: "x" | "y" | "z" | "all";
  range?: number;
  reverse?: boolean;
}

export interface Base3DObjectConfig {
  id: string;
  type: ObjectType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  color?: string;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  opacity?: number;
  animation?: AnimationConfig;
}

export interface Geometry3DObjectConfig extends Base3DObjectConfig {
  type: "cube" | "sphere" | "cylinder" | "torus";
  args?: number[];
}

export interface Text3DObjectConfig extends Base3DObjectConfig {
  type: "text3d";
  text: string;
  fontSize?: number;
  letterSpacing?: number;
}

export interface Particles3DObjectConfig extends Base3DObjectConfig {
  type: "particles";
  count?: number;
  spread?: number;
  particleSize?: number;
  seed?: number;
}

export interface NetworkGraph3DObjectConfig extends Base3DObjectConfig {
  type: "networkGraph";
  nodeCount?: number;
  radius?: number;
  activeFlow?: boolean;
  nodeLabels?: string[];
}

export interface BarChart3DObjectConfig extends Base3DObjectConfig {
  type: "barChart";
  data: Array<{ label: string; value: number; color?: string }>;
  maxHeight?: number;
  barWidth?: number;
}

export interface GLTFModel3DObjectConfig extends Base3DObjectConfig {
  type: "gltfModel";
  modelUrl: string;
  fallbackType?: "cube" | "sphere";
}

export type Any3DObjectConfig =
  | Geometry3DObjectConfig
  | Text3DObjectConfig
  | Particles3DObjectConfig
  | NetworkGraph3DObjectConfig
  | BarChart3DObjectConfig
  | GLTFModel3DObjectConfig;

export interface CameraConfig {
  preset: CameraPreset;
  position?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  distance?: number;
  speed?: number;
}

export interface LightingConfig {
  preset: LightingPreset;
  ambientIntensity?: number;
  mainLightIntensity?: number;
  accentColor?: string;
}

export interface Scene3DConfig {
  id?: string;
  type:
    | "3d-tech-explainer"
    | "3d-product-showcase"
    | "3d-algorithm-viz"
    | "3d-data-viz"
    | "3d-cinematic-intro"
    | "3d-hybrid-explainer"
    | "3d-particle";
  durationInFrames: number;
  camera?: CameraConfig;
  lighting?: LightingConfig;
  background?: string;
  quality?: QualityPreset;
  objects: Any3DObjectConfig[];
  particleConfig?: AnyParticleConfig;
  captionOverlay?: {
    title?: string;
    subtitle?: string;
    badge?: string;
    safeArea?: boolean;
  };
}
