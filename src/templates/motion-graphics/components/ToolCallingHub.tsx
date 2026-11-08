import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ToolCallingHub: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * Math.PI * 4) * 8;

  const tools = [
    { id: "browser", name: "BROWSER", desc: "Thu thập & điều khiển web", icon: "🌐", color: "#38bdf8", x: 180, y: 520 },
    { id: "database", name: "DATABASE", desc: "Truy vấn SQL & Vector Store", icon: "🗄️", color: "#818cf8", x: 680, y: 520 },
    { id: "api", name: "REST / API", desc: "Kết nối dịch vụ bên ngoài", icon: "🔌", color: "#ec4899", x: 180, y: 840 },
    { id: "filesystem", name: "FILESYSTEM", desc: "Đọc, ghi file & mã nguồn", icon: "📁", color: "#10b981", x: 680, y: 840 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 0,
        right: 0,
        height: 800,
      }}
    >
      {/* Central SVG Connection Cables */}
      <svg
        width={1080}
        height={800}
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
      >
        {/* Cables from center (540, 680) to tool positions */}
        <line x1={540} y1={680} x2={290} y2={560} stroke="#38bdf8" strokeWidth={5} strokeDasharray="8 8" opacity={0.8} />
        <line x1={540} y1={680} x2={790} y2={560} stroke="#818cf8" strokeWidth={5} strokeDasharray="8 8" opacity={0.8} />
        <line x1={540} y1={680} x2={290} y2={880} stroke="#ec4899" strokeWidth={5} strokeDasharray="8 8" opacity={0.8} />
        <line x1={540} y1={680} x2={790} y2={880} stroke="#10b981" strokeWidth={5} strokeDasharray="8 8" opacity={0.8} />
      </svg>

      {/* Central AI Agent Hub */}
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 540,
          transform: "translate(-50%, -50%)",
          width: 220,
          height: 220,
          borderRadius: "50%",
          backgroundColor: "#080c18",
          border: "6px solid #38bdf8",
          boxShadow: "0 0 60px rgba(56, 189, 248, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div style={{ fontSize: 44, transform: `scale(${1 + pulse * 0.01})` }}>🧠</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>AI AGENT</div>
        <div style={{ fontSize: 14, color: "#94a3b8", letterSpacing: 1 }}>CORE ENGINE</div>
      </div>

      {/* 4 Tool Cards */}
      {tools.map((t, idx) => {
        const toolSpring = spring({ frame: frame - idx * 15, fps, config: { damping: 14 } });
        return (
          <div
            key={t.id}
            style={{
              position: "absolute",
              top: t.y,
              left: t.x,
              transform: `translate(-50%, -50%) scale(${interpolate(toolSpring, [0, 1], [0.8, 1])})`,
              opacity: toolSpring,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: `3px solid ${t.color}`,
              borderRadius: 28,
              padding: "24px 28px",
              width: 320,
              boxShadow: `0 0 35px ${t.color}35`,
              zIndex: 10,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: t.color }}>{t.name}</div>
            <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 4 }}>{t.desc}</div>
            <div
              style={{
                marginTop: 12,
                backgroundColor: `${t.color}20`,
                color: t.color,
                borderRadius: 12,
                padding: "6px 12px",
                fontSize: 16,
                fontWeight: 800,
                display: "inline-block",
              }}
            >
              ● TOOL CALLING
            </div>
          </div>
        );
      })}

      {/* Banner Formula */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: 120,
          right: 120,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          border: "2px solid rgba(56, 189, 248, 0.4)",
          borderRadius: 24,
          padding: "18px 32px",
          textAlign: "center",
          fontSize: 32,
          fontWeight: 900,
          color: "#f8fafc",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ color: "#38bdf8" }}>AI</span> + <span style={{ color: "#ec4899" }}>TOOLS</span> = <span style={{ color: "#10b981" }}>AUTONOMOUS ACTION</span>
      </div>
    </div>
  );
};
