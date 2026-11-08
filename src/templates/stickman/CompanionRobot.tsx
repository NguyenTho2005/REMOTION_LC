import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface CompanionRobotProps {
  expression?: "happy" | "thinking" | "alert" | "neutral" | "waving";
  scale?: number;
  holdingTray?: boolean;
  style?: React.CSSProperties;
}

export const CompanionRobot: React.FC<CompanionRobotProps> = ({
  expression = "happy",
  scale = 1,
  holdingTray = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating hover animation
  const hoverY = Math.sin((frame / fps) * Math.PI * 2.2) * 10;
  const hoverTilt = Math.sin((frame / fps) * Math.PI * 1.5) * 3;
  const pulseScale = 1 + Math.sin((frame / fps) * Math.PI * 4) * 0.05;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `translateY(${hoverY}px) rotate(${hoverTilt}deg) scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      <svg
        width={160}
        height={200}
        viewBox="-80 -100 160 200"
        style={{ overflow: "visible" }}
      >
        {/* Drop Shadow */}
        <ellipse
          cx={0}
          cy={80 - hoverY * 0.5}
          rx={34 - hoverY * 0.4}
          ry={8 - hoverY * 0.1}
          fill="#000000"
          opacity={0.15}
        />

        {/* Thruster Glow underneath */}
        <ellipse
          cx={0}
          cy={42}
          rx={16 * pulseScale}
          ry={6 * pulseScale}
          fill="#38bdf8"
          opacity={0.65}
        />
        <path
          d="M -10 42 Q 0 60 10 42 Z"
          fill="#0284c7"
          opacity={0.8}
        />

        {/* Antenna */}
        <line
          x1={0}
          y1={-50}
          x2={0}
          y2={-75}
          stroke="#0f172a"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle
          cx={0}
          cy={-80}
          r={9}
          fill="#38bdf8"
          stroke="#0f172a"
          strokeWidth={4}
        />
        {/* Antenna pulse wave */}
        <circle
          cx={0}
          cy={-80}
          r={14 * pulseScale}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2}
          opacity={0.6}
        />

        {/* Robot Main Body */}
        <rect
          x={-44}
          y={-50}
          width={88}
          height={92}
          rx={30}
          fill="#f8fafc"
          stroke="#0f172a"
          strokeWidth={8}
        />

        {/* Ear caps */}
        <rect x={-52} y={-22} width={8} height={24} rx={4} fill="#0284c7" stroke="#0f172a" strokeWidth={4} />
        <rect x={44} y={-22} width={8} height={24} rx={4} fill="#0284c7" stroke="#0f172a" strokeWidth={4} />

        {/* Face Screen (Dark Glossy) */}
        <rect
          x={-34}
          y={-36}
          width={68}
          height={48}
          rx={16}
          fill="#090d16"
          stroke="#0f172a"
          strokeWidth={3}
        />

        {/* Screen Expressions (Cyan LED) */}
        {expression === "happy" && (
          <g stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" fill="none">
            {/* Happy curved eyes ^ ^ */}
            <path d="M -22 -14 Q -15 -24 -8 -14" />
            <path d="M 8 -14 Q 15 -24 22 -14" />
            {/* Cute mouth */}
            <path d="M -7 -2 Q 0 4 7 -2" />
          </g>
        )}

        {expression === "thinking" && (
          <g stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" fill="#38bdf8">
            {/* Dots ... */}
            <circle cx={-16} cy={-12} r={3} />
            <circle cx={0} cy={-12} r={3} />
            <circle cx={16} cy={-12} r={3} />
            <path d="M -8 0 L 8 0" strokeWidth={3} fill="none" />
          </g>
        )}

        {expression === "alert" && (
          <g stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" fill="none">
            {/* Wide circle eyes */}
            <circle cx={-15} cy={-14} r={6} fill="#f59e0b" />
            <circle cx={15} cy={-14} r={6} fill="#f59e0b" />
            <line x1={-8} y1={2} x2={8} y2={2} stroke="#f59e0b" strokeWidth={4} />
          </g>
        )}

        {expression === "neutral" && (
          <g stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" fill="none">
            <line x1={-22} y1={-14} x2={-8} y2={-14} />
            <line x1={8} y1={-14} x2={22} y2={-14} />
            <line x1={-5} y1={-2} x2={5} y2={-2} />
          </g>
        )}

        {expression === "waving" && (
          <g stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" fill="none">
            {/* Winking eye */}
            <path d="M -22 -14 Q -15 -22 -8 -14" />
            <circle cx={15} cy={-14} r={5} fill="#38bdf8" />
            <path d="M -6 0 Q 0 6 6 0" />
          </g>
        )}

        {/* Arms */}
        {expression === "waving" ? (
          // Right arm waving
          <g stroke="#0f172a" strokeWidth={7} strokeLinecap="round" fill="none">
            <path d="M -40 2 L -56 18" />
            <path d={`M 40 2 L 60 -18 L ${70 + Math.sin((frame / fps) * Math.PI * 8) * 8} -32`} />
          </g>
        ) : holdingTray ? (
          // Arms holding tray forward
          <g stroke="#0f172a" strokeWidth={7} strokeLinecap="round" fill="none">
            <path d="M -40 10 L -25 28 L 0 28" />
            <path d="M 40 10 L 25 28 L 0 28" />
            {/* Document tray */}
            <rect x={-36} y={22} width={72} height={12} rx={3} fill="#cbd5e1" stroke="#0f172a" strokeWidth={3} />
            <rect x={-26} y={12} width={34} height={10} rx={2} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
          </g>
        ) : (
          // Floating resting arms
          <g stroke="#0f172a" strokeWidth={7} strokeLinecap="round" fill="none">
            <path d="M -40 6 Q -52 20 -44 32" />
            <path d="M 40 6 Q 52 20 44 32" />
          </g>
        )}
      </svg>
    </div>
  );
};
