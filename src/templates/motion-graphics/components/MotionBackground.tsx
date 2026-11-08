import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface MotionBackgroundProps {
  sceneNumber: string;
  category: string;
  theme?: "dark" | "light";
  children?: React.ReactNode;
}

export const MotionBackground: React.FC<MotionBackgroundProps> = ({
  sceneNumber,
  category,
  theme = "dark",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === "dark";
  const bgBase = isDark ? "#080c18" : "#f8fafc";
  const gridColor = isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(15, 23, 42, 0.06)";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const subtextColor = isDark ? "#94a3b8" : "#64748b";

  // Gentle subtle breathing particle effect
  const glowPulse = Math.sin((frame / fps) * Math.PI * 1.5) * 0.06;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: bgBase,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: textColor,
      }}
    >
      {/* Background Radial Gradient Mesh */}
      <div
        style={{
          position: "absolute",
          top: -300,
          left: -300,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: `scale(${1 + glowPulse})`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: `scale(${1 - glowPulse})`,
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: "-1px -1px",
          pointerEvents: "none",
        }}
      />

      {/* Header bar (safe zone: top 180px) */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "#ffffff",
            border: `2px solid ${isDark ? "#0284c7" : "#cbd5e1"}`,
            color: isDark ? "#38bdf8" : "#0284c7",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: isDark ? "0 0 20px rgba(56, 189, 248, 0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {sceneNumber}
        </div>

        <div
          style={{
            color: subtextColor,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {category}
        </div>
      </div>

      {/* Main Content Slot */}
      {children}
    </div>
  );
};
