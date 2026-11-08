import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";

export const S12Future: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * Math.PI * 3) * 6;

  const apps = [
    { name: "HỆ ĐIỀU HÀNH", icon: "💻", desc: "Tự động hóa desktop", x: 200, y: 500, color: "#38bdf8" },
    { name: "MÃ NGUỒN & IDE", icon: "⚡", desc: "Trợ lý lập trình sâu", x: 660, y: 500, color: "#818cf8" },
    { name: "DỊCH VỤ CLOUD", icon: "☁️", desc: "Tự động mở rộng & deploy", x: 200, y: 840, color: "#ec4899" },
    { name: "DATABASE & DATA", icon: "🗄️", desc: "Phân tích số liệu tức thì", x: 660, y: 840, color: "#10b981" },
  ];

  return (
    <MotionBackground sceneNumber="12 / TƯƠNG LAI" category="UBIQUITOUS AI LAYER">
      <Headline
        title="Lớp Trợ Lý Tích Hợp Vào Mọi Phần Mềm"
        highlight="Mọi Phần Mềm"
        subtitle="Mạng lưới kết nối xuyên suốt các công cụ hàng ngày"
      />

      {/* SVG Connecting Flow Lines to Center */}
      <svg
        width={1080}
        height={800}
        style={{ position: "absolute", top: 380, left: 0, overflow: "visible" }}
      >
        <line x1={540} y1={670} x2={310} y2={540} stroke="#38bdf8" strokeWidth={4} strokeDasharray="6 6" />
        <line x1={540} y1={670} x2={770} y2={540} stroke="#818cf8" strokeWidth={4} strokeDasharray="6 6" />
        <line x1={540} y1={670} x2={310} y2={880} stroke="#ec4899" strokeWidth={4} strokeDasharray="6 6" />
        <line x1={540} y1={670} x2={770} y2={880} stroke="#10b981" strokeWidth={4} strokeDasharray="6 6" />
      </svg>

      {/* Central Autonomous Layer Node */}
      <div
        style={{
          position: "absolute",
          top: 670 + 380,
          left: 540,
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
          zIndex: 20,
        }}
      >
        <div style={{ fontSize: 36, transform: `scale(${1 + pulse * 0.01})` }}>🌐</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>AI LAYER</div>
        <div style={{ fontSize: 13, color: "#94a3b8", letterSpacing: 1 }}>ECOSYSTEM</div>
      </div>

      {/* 4 Connected System Nodes */}
      {apps.map((app, idx) => {
        const appSpring = spring({ frame: frame - idx * 15, fps, config: { damping: 14 } });
        return (
          <div
            key={app.name}
            style={{
              position: "absolute",
              top: app.y + 160,
              left: app.x,
              transform: `translate(-50%, -50%) scale(${interpolate(appSpring, [0, 1], [0.85, 1])})`,
              opacity: appSpring,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: `3px solid ${app.color}`,
              borderRadius: 24,
              padding: "24px 28px",
              width: 300,
              boxShadow: `0 0 35px ${app.color}25`,
              zIndex: 10,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>{app.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: app.color }}>{app.name}</div>
            <div style={{ fontSize: 17, color: "#94a3b8", marginTop: 4 }}>{app.desc}</div>
          </div>
        );
      })}

      <MotionSubtitle text={text} keyword="lớp trợ lý thông minh" />
    </MotionBackground>
  );
};
