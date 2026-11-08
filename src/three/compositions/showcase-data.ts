import type { Scene3DConfig } from "../core/types";

export const TOTAL_3D_SHOWCASE_FRAMES = 900; // 30 seconds @ 30fps

export interface ShowcaseSceneMetadata {
  id: string;
  name: string;
  from: number;
  durationInFrames: number;
  config: Scene3DConfig;
}

export const SHOWCASE_SCENES: ShowcaseSceneMetadata[] = [
  {
    id: "scene-intro",
    name: "3D Cinematic Intro",
    from: 0,
    durationInFrames: 90,
    config: {
      type: "3d-cinematic-intro",
      durationInFrames: 90,
      camera: { preset: "flyThrough", distance: 10, fov: 45, speed: 1.2, target: [0, 0, 0] },
      lighting: { preset: "cyberpunk" },
      quality: "standard",
      objects: [],
    },
  },
  {
    id: "scene-tech",
    name: "3D Tech Explainer",
    from: 90,
    durationInFrames: 150,
    config: {
      type: "3d-tech-explainer",
      durationInFrames: 150,
      camera: { preset: "orbit", distance: 8, fov: 45, speed: 1, target: [0, 0, 0] },
      lighting: { preset: "cyberpunk" },
      quality: "standard",
      objects: [],
    },
  },
  {
    id: "scene-product",
    name: "3D Product Showcase",
    from: 240,
    durationInFrames: 150,
    config: {
      type: "3d-product-showcase",
      durationInFrames: 150,
      camera: { preset: "orbit", distance: 7, fov: 45, speed: 0.8, target: [0, 0, 0] },
      lighting: { preset: "studio" },
      quality: "standard",
      objects: [],
    },
  },
  {
    id: "scene-algo",
    name: "3D Algorithm Viz",
    from: 390,
    durationInFrames: 180,
    config: {
      type: "3d-algorithm-viz",
      durationInFrames: 180,
      camera: { preset: "topDown", distance: 12, fov: 45, speed: 0.5, target: [0, 0, 0] },
      lighting: { preset: "dramatic" },
      quality: "standard",
      objects: [],
    },
  },
  {
    id: "scene-data",
    name: "3D Data Viz",
    from: 570,
    durationInFrames: 150,
    config: {
      type: "3d-data-viz",
      durationInFrames: 150,
      camera: { preset: "isometric", distance: 10, fov: 45, speed: 0.7, target: [0, 0, 0] },
      lighting: { preset: "studio" },
      quality: "standard",
      objects: [],
    },
  },
  {
    id: "scene-hybrid",
    name: "Hybrid 2D + 3D Explainer",
    from: 720,
    durationInFrames: 180,
    config: {
      type: "3d-hybrid-explainer",
      durationInFrames: 180,
      camera: { preset: "orbit", distance: 8, fov: 45, speed: 0.8, target: [0, 0, 0] },
      lighting: { preset: "cyberpunk" },
      quality: "standard",
      objects: [],
    },
  },
];
