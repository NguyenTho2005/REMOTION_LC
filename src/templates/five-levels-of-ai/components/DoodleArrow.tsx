import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, SPRING_DOODLE } from "../constants";

interface DoodleArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  curveOffset?: number;
  strokeColor?: string;
  strokeWidth?: number;
  delayFrames?: number;
  dashed?: boolean;
  arrowHeadSize?: number;
}

export const DoodleArrow: React.FC<DoodleArrowProps> = ({
  startX,
  startY,
  endX,
  endY,
  curveOffset = 0,
  strokeColor = PALETTE.charcoal,
  strokeWidth = 3.5,
  delayFrames = 0,
  dashed = false,
  arrowHeadSize = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_DOODLE,
  });

  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Midpoint with perpendicular curvature
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const perpX = dist > 0 ? -dy / dist : 0;
  const perpY = dist > 0 ? dx / dist : 0;
  const ctrlX = midX + perpX * curveOffset;
  const ctrlY = midY + perpY * curveOffset;

  // Approximate quadratic bezier arc length
  const arcLength = dist * 1.15;
  const dashOffset = (1 - progress) * arcLength;

  // Compute angle of arrowhead at tip (t=1 on quadratic bezier)
  const tangentX = 2 * (1 - 0.98) * (ctrlX - startX) + 2 * 0.98 * (endX - ctrlX);
  const tangentY = 2 * (1 - 0.98) * (ctrlY - startY) + 2 * 0.98 * (endY - ctrlY);
  const angleRad = Math.atan2(tangentY, tangentX);

  const headProgress = spring({
    frame: frame - delayFrames - 10,
    fps,
    config: SPRING_DOODLE,
  });

  // Rough arrow tip points
  const leftAngle = angleRad + Math.PI * 0.82;
  const rightAngle = angleRad - Math.PI * 0.82;

  const tipLeftX = endX + Math.cos(leftAngle) * arrowHeadSize;
  const tipLeftY = endY + Math.sin(leftAngle) * arrowHeadSize;
  const tipRightX = endX + Math.cos(rightAngle) * arrowHeadSize;
  const tipRightY = endY + Math.sin(rightAngle) * arrowHeadSize;

  const pathD = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

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
      }}
    >
      <g filter="url(#doodle-wobble)">
        {/* Main arrow shaft */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashed ? "12 8" : arcLength}
          strokeDashoffset={dashed ? -frame * 2 : dashOffset}
          style={{
            opacity: progress > 0.02 ? 1 : 0,
          }}
        />

        {/* Arrowhead drawn with doodle sketchy finish */}
        {headProgress > 0.05 && (
          <g
            style={{
              transform: `scale(${headProgress})`,
              transformOrigin: `${endX}px ${endY}px`,
            }}
          >
            {/* Primary barb */}
            <path
              d={`M ${tipLeftX} ${tipLeftY} L ${endX} ${endY} L ${tipRightX} ${tipRightY}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Second sketchy pass for authentic pen stroke */}
            <path
              d={`M ${tipLeftX + 1} ${tipLeftY - 1} L ${endX} ${endY} L ${tipRightX - 1} ${tipRightY + 1}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          </g>
        )}
      </g>
    </svg>
  );
};
