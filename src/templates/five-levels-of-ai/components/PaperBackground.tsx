import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PALETTE } from "../constants";

interface PaperBackgroundProps {
  darkSlate?: boolean;
}

export const PaperBackground: React.FC<PaperBackgroundProps> = ({
  darkSlate = false,
}) => {
  const frame = useCurrentFrame();
  const bg = darkSlate ? PALETTE.bgSlate : PALETTE.bgPaper;
  const ink = darkSlate ? PALETTE.chalkWhite : PALETTE.charcoal;

  // Gentle subtle paper breathing
  const paperShift = Math.sin(frame * 0.05) * 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        overflow: "hidden",
      }}
    >
      {/* SVG sketchbook grid background */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        {/* Subtle dot grid */}
        <rect
          width="100%"
          height="100%"
          fill="url(#sketch-dot-grid)"
          opacity={darkSlate ? 0.05 : 0.4}
        />

        {/* Notebook top header margin line (hand drawn feel) */}
        <line
          x1="60"
          y1="130"
          x2="1020"
          y2={131 + paperShift}
          stroke={ink}
          strokeWidth="1.5"
          strokeDasharray="8 6"
          opacity="0.15"
        />

        {/* Left margin red pencil line like in student notebook */}
        <line
          x1="90"
          y1="80"
          x2={91 + paperShift}
          y2="1860"
          stroke={PALETTE.coralRed}
          strokeWidth="1.5"
          opacity="0.2"
        />

        {/* Bottom footer margin line */}
        <line
          x1="60"
          y1="1680"
          x2="1020"
          y2={1681 + paperShift}
          stroke={ink}
          strokeWidth="1.2"
          strokeDasharray="6 8"
          opacity="0.12"
        />
      </svg>

      {/* Sketchbook paper grain / noise filter layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "url(#paper-texture)",
          pointerEvents: "none",
          opacity: 0.8,
        }}
      />

      {/* Subtle vignette for sketchbook depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 65%, rgba(0,0,0,0.06) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
