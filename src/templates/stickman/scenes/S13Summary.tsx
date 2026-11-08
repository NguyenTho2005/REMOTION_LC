import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S13Summary: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = (frame / fps) * 8; // subtle slow rotation of the 5 pillars

  const pillars = [
    { name: "GOAL", label: "Mục Tiêu", icon: "🎯", color: "#0284c7" },
    { name: "PLAN", label: "Kế Hoạch", icon: "📋", color: "#8b5cf6" },
    { name: "TOOLS", label: "Công Cụ", icon: "🛠️", color: "#ec4899" },
    { name: "MEMORY", label: "Bộ Nhớ", icon: "🧠", color: "#f59e0b" },
    { name: "EVAL", label: "Đánh Giá", icon: "⚖️", color: "#10b981" },
  ];

  const radius = 220;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, #f8fafc 1.5px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
          opacity: 0.6,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 13 / TỔNG KẾT
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          THE 5 PILLARS
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 900, color: "#0f172a" }}>
          Hỏi Đáp vs. Giao Nhiệm Vụ
        </div>
      </div>

      {/* Circle of 5 Pillars */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: "50%",
          width: 0,
          height: 0,
        }}
      >
        {/* Central Core */}
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 0,
            transform: "translate(-50%, -50%)",
            width: 170,
            height: 170,
            borderRadius: "50%",
            backgroundColor: "#0f172a",
            border: "6px solid #38bdf8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: "#38bdf8" }}>AI AGENT</div>
          <div style={{ fontSize: 13, letterSpacing: 1, opacity: 0.8 }}>HỆ THỐNG</div>
        </div>

        {/* 5 Orbiting Pillar Nodes */}
        {pillars.map((p, i) => {
          const angle = ((i * 72 + rotation) * Math.PI) / 180;
          const x = Math.sin(angle) * radius;
          const y = 240 - Math.cos(angle) * radius;

          return (
            <div
              key={p.name}
              style={{
                position: "absolute",
                top: y,
                left: x,
                transform: "translate(-50%, -50%)",
                backgroundColor: "#ffffff",
                border: `5px solid ${p.color}`,
                borderRadius: 24,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 120,
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                zIndex: 20,
              }}
            >
              <div style={{ fontSize: 36 }}>{p.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{p.name}</div>
              <div style={{ fontSize: 14, color: "#475569", fontWeight: 700 }}>{p.label}</div>
            </div>
          );
        })}
      </div>

      {/* Stickman presenting */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 120,
        }}
      >
        <Stickman pose="presenting" scale={1.35} facing="right" />
      </div>

      {/* Companion Robot */}
      <div
        style={{
          position: "absolute",
          bottom: 600,
          right: 120,
        }}
      >
        <CompanionRobot expression="happy" scale={1.3} />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="giao một nhiệm vụ" />
    </div>
  );
};
