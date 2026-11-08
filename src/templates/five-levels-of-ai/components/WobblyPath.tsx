import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, SPRING_DOODLE } from "../constants";

interface WobblyPathProps {
  d: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  delayFrames?: number;
  totalLength?: number;
  dashed?: boolean;
  style?: React.CSSProperties;
  seed?: number;
}

export const WobblyPath: React.FC<WobblyPathProps> = ({
  d,
  strokeColor = PALETTE.charcoal,
  strokeWidth = 3,
  fillColor = "none",
  delayFrames = 0,
  totalLength = 600,
  dashed = false,
  style,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_DOODLE,
  });

  const dashOffset = (1 - progress) * totalLength;
  const frameWobble = Math.sin((frame + seed * 13) * 0.2) * 0.5;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
        ...style,
      }}
    >
      <g
        filter="url(#doodle-wobble)"
        transform={`translate(${frameWobble}, ${-frameWobble})`}
      >
        {/* Main path stroke */}
        <path
          d={d}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dashed ? "10 6" : totalLength}
          strokeDashoffset={dashed ? -frame * 1.5 : dashOffset}
          style={{
            opacity: progress > 0.01 ? 1 : 0,
          }}
        />

        {/* Secondary sketchy shadow pass for hand-drawn look */}
        {fillColor === "none" && (
          <path
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={Math.max(1, strokeWidth * 0.65)}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset + 4}
            opacity={0.6}
            transform="translate(1.2, 0.8)"
            style={{
              opacity: progress > 0.05 ? 0.6 : 0,
            }}
          />
        )}
      </g>
    </svg>
  );
};
