import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";

export interface BackgroundEffectsProps {
  glowColor?: string;
  gridOpacity?: number;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  glowColor = "#38bdf8",
  gridOpacity = 0.12,
}) => {
  const frame = useCurrentFrame();

  const glowMoveY = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [-40, 40]
  );
  const glowMoveX = interpolate(
    Math.cos(frame * 0.02),
    [-1, 1],
    [-30, 30]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_TECH_THEME.background,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Subtle Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, ${gridOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, ${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />

      {/* Primary Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          backgroundColor: glowColor,
          filter: "blur(140px)",
          opacity: 0.18,
          transform: `translate(-50%, -50%) translate(${glowMoveX}px, ${glowMoveY}px)`,
        }}
      />

      {/* Secondary Ambient Accent Glow */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          backgroundColor: DARK_TECH_THEME.accentIndigo,
          filter: "blur(130px)",
          opacity: 0.14,
          transform: `translate(${glowMoveX * -0.5}px, ${glowMoveY * -0.5}px)`,
        }}
      />

      {/* Top and Bottom Vignette for safe zones readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(9,10,15,0.85) 0%, transparent 15%, transparent 80%, rgba(9,10,15,0.95) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
