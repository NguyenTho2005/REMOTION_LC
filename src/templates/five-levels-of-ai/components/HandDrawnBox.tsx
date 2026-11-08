import React from "react";
import { useCurrentFrame } from "remotion";
import { PALETTE } from "../constants";

interface HandDrawnBoxProps {
  width: number | string;
  height: number | string;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  fillOpacity?: number;
  rotation?: number;
  borderRadius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  seed?: number;
}

export const HandDrawnBox: React.FC<HandDrawnBoxProps> = ({
  width,
  height,
  strokeColor = PALETTE.charcoal,
  strokeWidth = 3,
  fillColor = "transparent",
  fillOpacity = 0.15,
  rotation = 0,
  children,
  style,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const boil = Math.sin((frame + seed * 17) * 0.25) * 0.8;

  // Numerical width/height for SVG generation if passed as numbers, else standard fallback viewBox
  const w = typeof width === "number" ? width : 400;
  const h = typeof height === "number" ? height : 200;

  // Generate 2 sketchy path outlines with subtle hand-drawn variations
  const s1 = ((seed * 13) % 7) - 3;
  const s2 = ((seed * 29) % 7) - 3;

  // First sketch loop
  const path1 = `
    M ${12 + s1} ${10 + boil}
    Q ${w / 2} ${4 - s2}, ${w - 12 - s2} ${10 - boil}
    Q ${w - 4 + s1} ${h / 2}, ${w - 10 + s2} ${h - 12 + boil}
    Q ${w / 2 + s1} ${h - 4 - s1}, ${12 - s2} ${h - 10 - boil}
    Q ${4 - s1} ${h / 2 + s2}, ${12 + s1} ${10 + boil}
    Z
  `;

  // Second overlapping sketch stroke to mimic drawing twice with a pen
  const path2 = `
    M ${14 - s2} ${12 - boil}
    Q ${w / 2 + 6} ${6 + s1}, ${w - 10 + s1} ${12 + boil}
    Q ${w - 6 - s2} ${h / 2 - 4}, ${w - 12 - s1} ${h - 10 - boil}
    Q ${w / 2 - 4} ${h - 6 + s2}, ${14 + s1} ${h - 12 + boil}
    Q ${6 + s2} ${h / 2 + 2}, ${14 - s2} ${12 - boil}
  `;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
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
          {/* Fill path */}
          {fillColor !== "transparent" && (
            <path
              d={path1}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke="none"
            />
          )}

          {/* First sketchy outline */}
          <path
            d={path1}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Second overlapping sketch pass */}
          <path
            d={path2}
            fill="none"
            stroke={strokeColor}
            strokeWidth={Math.max(1.5, strokeWidth * 0.75)}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        </g>
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px 24px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};
