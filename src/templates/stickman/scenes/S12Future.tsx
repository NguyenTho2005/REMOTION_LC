import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S12Future: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * Math.PI * 3) * 6;

  const apps = [
    { name: "Hệ Điều Hành", icon: "💻", x: 220, y: 480 },
    { name: "Mã Nguồn IDE", icon: "⚡", x: 620, y: 480 },
    { name: "Cơ Sở Dữ Liệu", icon: "🗄️", x: 180, y: 720 },
    { name: "Dịch Vụ Cloud", icon: "☁️", x: 660, y: 720 },
  ];

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
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 12 / TƯƠNG LAI
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          UBIQUITOUS AI LAYER
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
          Lớp Trợ Lý Tích Hợp Vào Mọi Phần Mềm
        </div>
      </div>

      {/* Central Mesh Network SVG lines */}
      <svg
        width={1080}
        height={600}
        style={{ position: "absolute", top: 380, left: 0, overflow: "visible" }}
      >
        {/* Central connecting lines */}
        <line x1={320} y1={160} x2={540} y2={280} stroke="#0284c7" strokeWidth={5} strokeDasharray="6 6" />
        <line x1={720} y1={160} x2={540} y2={280} stroke="#8b5cf6" strokeWidth={5} strokeDasharray="6 6" />
        <line x1={280} y1={400} x2={540} y2={280} stroke="#10b981" strokeWidth={5} strokeDasharray="6 6" />
        <line x1={760} y1={400} x2={540} y2={280} stroke="#ec4899" strokeWidth={5} strokeDasharray="6 6" />
        {/* Core circle */}
        <circle cx={540} cy={280} r={48 + pulse} fill="#0f172a" stroke="#38bdf8" strokeWidth={6} />
      </svg>

      {/* App Nodes */}
      {apps.map((app, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: app.y,
            left: app.x,
            backgroundColor: "#ffffff",
            border: "4px solid #0f172a",
            borderRadius: 20,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 32 }}>{app.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{app.name}</div>
        </div>
      ))}

      {/* Center Label inside core */}
      <div
        style={{
          position: "absolute",
          top: 642,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#38bdf8",
          fontSize: 18,
          fontWeight: 900,
          pointerEvents: "none",
        }}
      >
        AGENT
      </div>

      {/* Stickman and Robot looking forward together */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 160,
        }}
      >
        <Stickman pose="pointing" scale={1.35} facing="right" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 600,
          left: 360,
        }}
      >
        <CompanionRobot expression="happy" scale={1.3} />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="lớp trợ lý thông minh" />
    </div>
  );
};
