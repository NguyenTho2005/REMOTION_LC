import React from "react";
import { useCurrentFrame } from "remotion";
import { PALETTE } from "../constants";

interface DoodleGearProps {
  x: number;
  y: number;
  radius?: number;
  teethCount?: number;
  speed?: number; // degrees per frame
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
}

export const DoodleGear: React.FC<DoodleGearProps> = ({
  x,
  y,
  radius = 60,
  teethCount = 8,
  speed = 1.2,
  strokeColor = PALETTE.charcoal,
  fillColor = "transparent",
  strokeWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const currentRotation = frame * speed;

  // Build gear path with cogs
  const innerRadius = radius * 0.72;
  const toothDepth = radius * 0.28;
  const angleStep = (Math.PI * 2) / teethCount;

  let pathD = "";
  for (let i = 0; i < teethCount; i++) {
    const a1 = i * angleStep;
    const a2 = a1 + angleStep * 0.28;
    const a3 = a1 + angleStep * 0.55;
    const a4 = a1 + angleStep * 0.85;

    // Inner root start
    const p1x = Math.cos(a1) * innerRadius;
    const p1y = Math.sin(a1) * innerRadius;
    // Tooth top start
    const p2x = Math.cos(a2) * (innerRadius + toothDepth);
    const p2y = Math.sin(a2) * (innerRadius + toothDepth);
    // Tooth top end
    const p3x = Math.cos(a3) * (innerRadius + toothDepth);
    const p3y = Math.sin(a3) * (innerRadius + toothDepth);
    // Tooth root end
    const p4x = Math.cos(a4) * innerRadius;
    const p4y = Math.sin(a4) * innerRadius;

    if (i === 0) {
      pathD += `M ${p1x} ${p1y} `;
    } else {
      pathD += `L ${p1x} ${p1y} `;
    }
    pathD += `L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} `;
  }
  pathD += "Z";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${currentRotation}deg)`,
        transformOrigin: "center center",
        width: (radius + toothDepth) * 2 + 20,
        height: (radius + toothDepth) * 2 + 20,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox={`${-(radius + toothDepth + 10)} ${-(radius + toothDepth + 10)} ${(radius + toothDepth + 10) * 2} ${(radius + toothDepth + 10) * 2}`}
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <g filter="url(#doodle-wobble)">
          {/* Main Gear outline */}
          <path
            d={pathD}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary loose sketch line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.65}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.65}
            transform="scale(0.97)"
          />

          {/* Center axle hole */}
          <circle
            cx="0"
            cy="0"
            r={radius * 0.28}
            fill="#FFFFFF"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="0"
            cy="0"
            r={radius * 0.28}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.6}
            opacity={0.6}
            transform="translate(1, -0.5)"
          />
        </g>
      </svg>
    </div>
  );
};
