import React from "react";
import type { Scene3DConfig } from "../core/types";
import { Scene3DDispatcher } from "../scenes/Scene3DDispatcher";

export interface ProductShowcaseProps {
  productName?: string;
  tagline?: string;
  features?: string[];
  heroColor?: string;
  durationInFrames?: number;
}

export const Template02ProductShowcase: React.FC<ProductShowcaseProps> = ({
  productName = "ZeroTTS Studio",
  tagline = "Realtime Vietnamese Speech Synthesis",
  features = ["48kHz Studio Quality", "8 Natural Voices", "Zero-Latency ONNX"],
  heroColor = "#38BDF8",
  durationInFrames = 150,
}) => {
  const sceneConfig: Scene3DConfig = {
    id: "product-showcase",
    type: "3d-product-showcase",
    durationInFrames,
    camera: {
      preset: "orbit",
      distance: 6.5,
      speed: 0.8,
    },
    lighting: {
      preset: "studio",
      ambientIntensity: 0.8,
      mainLightIntensity: 2.2,
    },
    background: "#090D18",
    objects: [
      // Central Hero 3D Device / Cylinder Base
      {
        id: "hero-platform",
        type: "cylinder",
        args: [1.8, 2.0, 0.4, 48],
        position: [0, -1.2, 0],
        color: "#1E293B",
        metalness: 0.6,
        roughness: 0.2,
      },
      // Central Floating 3D Geometric Gem / Product Core
      {
        id: "hero-core",
        type: "torus",
        args: [1.1, 0.35, 32, 64],
        position: [0, 0.3, 0],
        color: heroColor,
        metalness: 0.7,
        roughness: 0.15,
        animation: {
          type: "rotate",
          axis: "all",
          speed: 1.2,
        },
      },
      // Inner pulsating sphere
      {
        id: "hero-sphere",
        type: "sphere",
        args: [0.6, 32, 32],
        position: [0, 0.3, 0],
        color: "#F59E0B",
        metalness: 0.4,
        roughness: 0.3,
        animation: {
          type: "pulse",
          speed: 1.5,
          range: 1.2,
        },
      },
      // Feature 1 3D Floating Panel
      {
        id: "panel-1",
        type: "text3d",
        text: features[0] ?? "Feature 1",
        position: [0, 1.8, 0],
        fontSize: 0.35,
        color: "#FFFFFF",
      },
      // Particle Dust
      {
        id: "ambient-sparkles",
        type: "particles",
        count: 350,
        spread: 6,
        particleSize: 0.06,
        color: heroColor,
        opacity: 0.7,
        seed: 777,
      },
    ],
    captionOverlay: {
      badge: "GitHub Spotlight",
      title: productName,
      subtitle: tagline,
      safeArea: true,
    },
  };

  return <Scene3DDispatcher config={sceneConfig} />;
};
