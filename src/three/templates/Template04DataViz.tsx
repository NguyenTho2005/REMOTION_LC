import React from "react";
import type { Scene3DConfig } from "../core/types";
import { Scene3DDispatcher } from "../scenes/Scene3DDispatcher";

export interface DataVizProps {
  title?: string;
  subtitle?: string;
  data?: Array<{ label: string; value: number; color?: string }>;
  durationInFrames?: number;
}

export const Template04DataViz: React.FC<DataVizProps> = ({
  title = "AI Benchmark Score Comparison",
  subtitle = "MMLU / Code Reasoning Evaluation (2025)",
  data = [
    { label: "GPT-4o", value: 88, color: "#10A37F" },
    { label: "Claude 3.5", value: 92, color: "#F59E0B" },
    { label: "DeepSeek R1", value: 95, color: "#38BDF8" },
    { label: "o3-mini", value: 94, color: "#A855F7" },
  ],
  durationInFrames = 150,
}) => {
  const sceneConfig: Scene3DConfig = {
    id: "data-viz",
    type: "3d-data-viz",
    durationInFrames,
    camera: {
      preset: "orbit",
      distance: 7.5,
      speed: 0.7,
    },
    lighting: {
      preset: "studio",
      ambientIntensity: 0.7,
      mainLightIntensity: 2.0,
    },
    background: "#080C16",
    objects: [
      {
        id: "main-chart",
        type: "barChart",
        data,
        maxHeight: 3.8,
        barWidth: 0.8,
        position: [0, -1.2, 0],
      },
      {
        id: "particles-bg",
        type: "particles",
        count: 300,
        spread: 8,
        particleSize: 0.05,
        color: "#38BDF8",
        opacity: 0.5,
        seed: 999,
      },
    ],
    captionOverlay: {
      badge: "Benchmark Analytics",
      title,
      subtitle,
      safeArea: true,
    },
  };

  return <Scene3DDispatcher config={sceneConfig} />;
};
