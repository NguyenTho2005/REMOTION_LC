import React from "react";
import type { Scene3DConfig } from "../core/types";
import { Scene3DDispatcher } from "../scenes/Scene3DDispatcher";

export interface CinematicIntroProps {
  hookTitle?: string;
  hookSubtitle?: string;
  durationInFrames?: number;
  accentColor?: string;
}

export const Template05CinematicIntro: React.FC<CinematicIntroProps> = ({
  hookTitle = "AI REVOLUTION",
  hookSubtitle = "Khám phá tương lai công nghệ trong 60 giây",
  durationInFrames = 90, // 3 seconds @ 30fps
  accentColor = "#38BDF8",
}) => {
  const sceneConfig: Scene3DConfig = {
    id: "cinematic-intro",
    type: "3d-cinematic-intro",
    durationInFrames,
    camera: {
      preset: "dolly",
      distance: 6.0,
      speed: 1.5,
    },
    lighting: {
      preset: "dramatic",
      ambientIntensity: 0.3,
      mainLightIntensity: 3.5,
    },
    background: "#05070E",
    objects: [
      // Central 3D Hook Typography
      {
        id: "hero-title",
        type: "text3d",
        text: hookTitle,
        position: [0, 0.4, 0],
        fontSize: 0.95,
        color: "#FFFFFF",
        letterSpacing: 0.08,
        animation: {
          type: "scaleUp",
          speed: 1.4,
        },
      },
      // Orbiting Neon Ring 1
      {
        id: "neon-ring-1",
        type: "torus",
        args: [2.4, 0.06, 24, 64],
        position: [0, 0.4, 0],
        color: accentColor,
        metalness: 0.8,
        roughness: 0.1,
        animation: {
          type: "rotate",
          axis: "all",
          speed: 2.0,
        },
      },
      // Orbiting Neon Ring 2
      {
        id: "neon-ring-2",
        type: "torus",
        args: [2.8, 0.04, 24, 64],
        position: [0, 0.4, 0],
        color: "#EC4899",
        metalness: 0.8,
        roughness: 0.1,
        animation: {
          type: "rotate",
          axis: "all",
          speed: -1.6,
        },
      },
      // Exploding Particle Field
      {
        id: "intro-particles",
        type: "particles",
        count: 800,
        spread: 9,
        particleSize: 0.08,
        color: accentColor,
        opacity: 0.9,
        seed: 42,
      },
    ],
    captionOverlay: {
      badge: "Tech Spotlight",
      title: hookTitle,
      subtitle: hookSubtitle,
      safeArea: true,
    },
  };

  return <Scene3DDispatcher config={sceneConfig} />;
};
