import React from "react";
import type { Scene3DConfig } from "../core/types";
import { Scene3DDispatcher } from "../scenes/Scene3DDispatcher";

export interface TechExplainerProps {
  title?: string;
  subtitle?: string;
  nodeLabels?: string[];
  activeFlow?: boolean;
  durationInFrames?: number;
  cameraPreset?: "orbit" | "dolly" | "isometric";
}

export const Template01TechExplainer: React.FC<TechExplainerProps> = ({
  title = "Transformer Architecture",
  subtitle = "Multi-Head Self-Attention Flow",
  nodeLabels = [
    "Input Embeddings",
    "Positional Encoding",
    "Q / K / V Projections",
    "Scaled Dot-Product",
    "Softmax Attention",
    "Feed Forward Layer",
  ],
  activeFlow = true,
  durationInFrames = 150,
  cameraPreset = "orbit",
}) => {
  const sceneConfig: Scene3DConfig = {
    id: "tech-explainer",
    type: "3d-tech-explainer",
    durationInFrames,
    camera: {
      preset: cameraPreset,
      distance: 7.5,
      speed: 1,
    },
    lighting: {
      preset: "cyberpunk",
      ambientIntensity: 0.6,
      mainLightIntensity: 1.8,
    },
    background: "#080B16",
    objects: [
      {
        id: "core-network",
        type: "networkGraph",
        nodeCount: nodeLabels.length,
        radius: 2.8,
        activeFlow,
        nodeLabels,
        animation: {
          type: "rotate",
          axis: "y",
          speed: 0.4,
        },
      },
      {
        id: "ambient-particles",
        type: "particles",
        count: 400,
        spread: 8,
        particleSize: 0.05,
        color: "#818CF8",
        opacity: 0.6,
        seed: 101,
      },
    ],
    captionOverlay: {
      badge: "AI Deep Dive",
      title,
      subtitle,
      safeArea: true,
    },
  };

  return <Scene3DDispatcher config={sceneConfig} />;
};
