import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, SPRING_BOUNCE } from "../constants";

interface ThoughtBubbleProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  delayFrames?: number;
  bubbleColor?: string;
  borderColor?: string;
  tailDirection?: "bottom-left" | "bottom-right";
}

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  x,
  y,
  width = 320,
  height = 180,
  children,
  delayFrames = 0,
  bubbleColor = "#FFFFFF",
  borderColor = PALETTE.charcoal,
  tailDirection = "bottom-left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_BOUNCE,
  });

  const floatY = Math.sin(frame * 0.1) * 6;
  const boil = Math.sin(frame * 0.25) * 0.6;

  if (pop <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2 + floatY,
        width,
        height,
        transform: `scale(${pop}) rotate(${boil}deg)`,
        transformOrigin:
          tailDirection === "bottom-left" ? "20% 90%" : "80% 90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 320 200"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <g filter="url(#doodle-wobble)">
          {/* Cloud-like bumpy thought bubble path */}
          <path
            d="
              M 70 50
              A 45 40 0 0 1 150 35
              A 50 45 0 0 1 240 50
              A 45 42 0 0 1 285 105
              A 42 42 0 0 1 250 155
              A 55 45 0 0 1 160 165
              A 50 42 0 0 1 80 155
              A 45 42 0 0 1 45 105
              A 42 40 0 0 1 70 50
              Z
            "
            fill={bubbleColor}
            stroke={borderColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Overlapping sketch line */}
          <path
            d="
              M 72 52
              A 45 40 0 0 1 148 37
              A 50 45 0 0 1 238 52
              A 45 42 0 0 1 283 104
              A 42 42 0 0 1 248 153
              A 55 45 0 0 1 162 163
              A 50 42 0 0 1 82 153
              A 45 42 0 0 1 47 104
              A 42 40 0 0 1 72 52
            "
            fill="none"
            stroke={borderColor}
            strokeWidth="1.8"
            opacity={0.6}
          />

          {/* Tail thought circles */}
          {tailDirection === "bottom-left" ? (
            <>
              <circle
                cx="58"
                cy="180"
                r="10"
                fill={bubbleColor}
                stroke={borderColor}
                strokeWidth="2.5"
              />
              <circle
                cx="42"
                cy="198"
                r="6"
                fill={bubbleColor}
                stroke={borderColor}
                strokeWidth="2"
              />
            </>
          ) : (
            <>
              <circle
                cx="262"
                cy="180"
                r="10"
                fill={bubbleColor}
                stroke={borderColor}
                strokeWidth="2.5"
              />
              <circle
                cx="278"
                cy="198"
                r="6"
                fill={bubbleColor}
                stroke={borderColor}
                strokeWidth="2"
              />
            </>
          )}
        </g>
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px 32px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};
