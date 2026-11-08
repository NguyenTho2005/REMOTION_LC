import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE } from "../constants";

interface RedCrayonCircleProps {
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  rotation?: number;
  delayFrames?: number;
  strokeWidth?: number;
  color?: string;
  loops?: number;
}

export const RedCrayonCircle: React.FC<RedCrayonCircleProps> = ({
  x,
  y,
  rx = 180,
  ry = 90,
  rotation = -4,
  delayFrames = 0,
  strokeWidth = 5.5,
  color = PALETTE.coralRed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: {
      damping: 14,
      stiffness: 100,
      mass: 0.7,
    },
  });

  const boil = Math.sin(frame * 0.3) * 0.7;

  // Approximate perimeter of ellipse
  const perimeter = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  // Multiple loops (2.5 loops for rough sketching)
  const totalLength = perimeter * 2.6;
  const dashOffset = (1 - progress) * totalLength;

  // Energetic multi-loop rough oval path
  const pathD = `
    M ${-rx} 0
    C ${-rx} ${-ry * 1.1}, ${rx * 0.9} ${-ry * 0.9}, ${rx} ${-ry * 0.1}
    C ${rx * 1.05} ${ry * 0.95}, ${-rx * 0.95} ${ry * 1.05}, ${-rx * 1.05} ${ry * 0.15}
    C ${-rx * 1.1} ${-ry * 0.95}, ${rx * 0.85} ${-ry * 1.05}, ${rx * 1.02} 0
    C ${rx * 1.08} ${ry * 1.12}, ${-rx * 0.9} ${ry * 0.98}, ${-rx * 0.98} ${-ry * 0.2}
    C ${-rx * 0.9} ${-ry * 1.15}, ${rx * 0.75} ${-ry * 0.85}, ${rx * 0.9} ${ry * 0.3}
  `;

  if (progress <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotation + boil}deg)`,
        transformOrigin: "center center",
        width: rx * 2.8,
        height: ry * 2.8,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <svg
        viewBox={`${-rx * 1.4} ${-ry * 1.4} ${rx * 2.8} ${ry * 2.8}`}
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <g filter="url(#rough-crayon)">
          {/* Main crayon stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
            opacity={0.9}
          />
          {/* Secondary slightly offset crayon grain stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth * 0.65}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset + 12}
            opacity={0.65}
            transform="scale(1.02) translate(1, -1)"
          />
        </g>
      </svg>
    </div>
  );
};
