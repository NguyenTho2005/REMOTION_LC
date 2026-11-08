import React from "react";
import { FILM_COLORS } from "../design-tokens";

export interface PaperBackgroundProps {
  ambient?: "day" | "night" | "sunset" | "morning" | "neutral";
  showGrid?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const PaperBackground: React.FC<PaperBackgroundProps> = ({
  ambient = "neutral",
  showGrid = false,
  style,
  children,
}) => {
  let overlayGradient = "none";
  let baseColor = FILM_COLORS.paper;

  switch (ambient) {
    case "night":
      baseColor = "#20232A";
      overlayGradient =
        "radial-gradient(circle at 50% 45%, rgba(45, 52, 70, 0.4) 0%, rgba(18, 20, 26, 0.95) 100%)";
      break;
    case "sunset":
      baseColor = "#F9EDE0";
      overlayGradient =
        "linear-gradient(180deg, rgba(230, 126, 103, 0.15) 0%, rgba(242, 193, 78, 0.12) 60%, rgba(246, 240, 228, 0) 100%)";
      break;
    case "morning":
      baseColor = "#FAF6ED";
      overlayGradient =
        "radial-gradient(circle at 30% 25%, rgba(255, 248, 220, 0.7) 0%, rgba(246, 240, 228, 0) 70%)";
      break;
    default:
      baseColor = FILM_COLORS.paper;
      overlayGradient =
        "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(236, 228, 212, 0.6) 100%)";
      break;
  }

  const isNight = ambient === "night";
  const gridColor = isNight ? "rgba(255, 255, 255, 0.04)" : "rgba(36, 36, 36, 0.035)";
  const strokeColor = isNight ? "rgba(255, 255, 255, 0.08)" : "rgba(36, 36, 36, 0.07)";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: baseColor,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Background Lighting Shift Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: overlayGradient,
          pointerEvents: "none",
        }}
      />

      {/* SVG Subtle Paper Fibers and Texture */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: isNight ? 0.25 : 0.4,
        }}
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="paper-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            {showGrid && (
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke={gridColor}
                strokeWidth="1"
              />
            )}
            <circle cx="2" cy="2" r="0.75" fill={gridColor} />
            <circle cx="18" cy="18" r="0.6" fill={gridColor} />
          </pattern>
        </defs>

        <rect width="1920" height="1080" fill="url(#paper-dots)" />

        {/* Hand-drawn organic vignette border */}
        <rect
          x="12"
          y="12"
          width="1896"
          height="1056"
          rx="8"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray="14 8 20 6"
        />
      </svg>

      {/* Child Content / Scenes */}
      {children}
    </div>
  );
};
