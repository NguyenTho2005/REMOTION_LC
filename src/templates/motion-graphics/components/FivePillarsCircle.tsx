import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const FivePillarsCircle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = (frame / fps) * 12; // 12 deg/sec rotation
  const radius = 230;

  const pillars = [
    { name: "GOAL", label: "Mục Tiêu", icon: "🎯", color: "#38bdf8" },
    { name: "PLAN", label: "Kế Hoạch", icon: "🧠", color: "#818cf8" },
    { name: "TOOLS", label: "Công Cụ", icon: "🛠️", color: "#ec4899" },
    { name: "MEMORY", label: "Bộ Nhớ", icon: "💾", color: "#f59e0b" },
    { name: "EVALUATION", label: "Đánh Giá", icon: "⚖️", color: "#10b981" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: "50%",
        width: 0,
        height: 0,
      }}
    >
      {/* Outer Rotating Ring SVG */}
      <svg
        width={600}
        height={600}
        style={{
          position: "absolute",
          top: 260,
          left: 0,
          transform: "translate(-50%, -50%)",
          overflow: "visible",
        }}
      >
        <circle cx={300} cy={300} r={radius} fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth={3} strokeDasharray="12 8" />
        <circle cx={300} cy={300} r={radius + 40} fill="none" stroke="rgba(129, 140, 248, 0.15)" strokeWidth={2} />
      </svg>

      {/* Center Core */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 0,
          transform: "translate(-50%, -50%)",
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "#080c18",
          border: "5px solid #38bdf8",
          boxShadow: "0 0 60px rgba(56, 189, 248, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 30,
        }}
      >
        <div style={{ fontSize: 32 }}>🤖</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>AI AGENT</div>
        <div style={{ fontSize: 13, color: "#94a3b8", letterSpacing: 1.5 }}>5 PILLARS</div>
      </div>

      {/* 5 Orbiting Pillar Nodes */}
      {pillars.map((p, i) => {
        const angle = ((i * 72 + rotation) * Math.PI) / 180;
        const x = Math.sin(angle) * radius;
        const y = 260 - Math.cos(angle) * radius;

        return (
          <div
            key={p.name}
            style={{
              position: "absolute",
              top: y,
              left: x,
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: `3px solid ${p.color}`,
              borderRadius: 24,
              padding: "18px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 135,
              boxShadow: `0 0 30px ${p.color}35`,
              zIndex: 20,
            }}
          >
            <div style={{ fontSize: 36 }}>{p.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: p.color, marginTop: 4 }}>{p.name}</div>
            <div style={{ fontSize: 14, color: "#cbd5e1", fontWeight: 600 }}>{p.label}</div>
          </div>
        );
      })}
    </div>
  );
};
