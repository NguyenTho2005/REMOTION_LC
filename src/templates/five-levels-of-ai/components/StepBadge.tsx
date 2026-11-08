import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, SPRING_BOUNCE } from "../constants";

interface StepBadgeProps {
  levelNumber: number | string;
  label?: string;
  themeColor?: string;
  delayFrames?: number;
  rotation?: number;
  scaleMultiplier?: number;
}

export const StepBadge: React.FC<StepBadgeProps> = ({
  levelNumber,
  label,
  themeColor = PALETTE.mustardYellow,
  delayFrames = 0,
  rotation = -2.5,
  scaleMultiplier = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_BOUNCE,
  });

  const boil = Math.sin(frame * 0.3) * 0.6;

  if (pop <= 0.01) return null;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        transform: `scale(${pop * scaleMultiplier}) rotate(${rotation + boil}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Hand-drawn badge container */}
      <div
        style={{
          position: "relative",
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
        >
          <g filter="url(#doodle-wobble)">
            {/* Marker colored fill */}
            <path
              d="M 6 8 Q 100 2, 194 6 Q 198 30, 194 54 Q 100 58, 6 52 Q 2 30, 6 8 Z"
              fill={themeColor}
              fillOpacity={0.85}
            />
            {/* Ink border */}
            <path
              d="M 5 7 Q 100 3, 195 5 Q 199 30, 195 53 Q 100 57, 5 51 Q 1 30, 5 7 Z"
              fill="none"
              stroke={PALETTE.charcoal}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Double sketch line */}
            <path
              d="M 7 9 Q 100 5, 193 8 Q 197 30, 193 51 Q 100 55, 7 49 Q 3 30, 7 9 Z"
              fill="none"
              stroke={PALETTE.charcoal}
              strokeWidth="1.5"
              opacity={0.6}
            />
          </g>
        </svg>

        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "'Patrick Hand', 'Caveat', 'Comic Sans MS', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 2,
            color: PALETTE.charcoal,
            textTransform: "uppercase",
          }}
        >
          LEVEL {levelNumber}
        </span>
      </div>

      {label && (
        <span
          style={{
            fontFamily: "'Patrick Hand', 'Caveat', 'Comic Sans MS', sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: PALETTE.charcoalLight,
            letterSpacing: 1,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
