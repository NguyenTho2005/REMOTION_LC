import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../constants";

interface ScribbleWipeProps {
  startFrame: number;
  durationInFrames?: number;
  color?: string;
  direction?: "in" | "out" | "cross";
}

export const ScribbleWipe: React.FC<ScribbleWipeProps> = ({
  startFrame,
  durationInFrames = 20,
  color = PALETTE.charcoal,
  direction = "cross",
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > durationInFrames) {
    return null;
  }

  // Cross wipe: scribbles cover from 0 to half, then clear
  const progress = interpolate(relFrame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate opacity and scale of scribble lines
  const opacity =
    direction === "cross"
      ? interpolate(progress, [0, 0.45, 0.55, 1], [0, 0.95, 0.95, 0])
      : direction === "in"
        ? interpolate(progress, [0, 1], [0, 0.95])
        : interpolate(progress, [0, 1], [0.95, 0]);

  // Generate dense zigzag scribbles across 1080x1920
  const linesCount = 28;
  const strokeWidth = 32;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        opacity,
      }}
    >
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <g filter="url(#rough-crayon)">
          {Array.from({ length: linesCount }).map((_, i) => {
            const y = (i / linesCount) * 1920 + 35;
            const seed = (i * 37) % 19;
            const x1 = -40;
            const x2 = 1120;
            const offset = (Math.sin(relFrame + seed) * 15);

            return (
              <path
                key={i}
                d={`M ${x1} ${y + offset} Q 540 ${y - offset * 1.5} ${x2} ${y + offset}`}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
