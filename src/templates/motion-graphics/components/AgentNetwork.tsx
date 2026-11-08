import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AgentNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * Math.PI * 3) * 6;

  const agents = [
    { title: "RESEARCHER", desc: "Thu thập tài liệu & tìm kiếm", icon: "🔍", color: "#38bdf8" },
    { title: "WRITER", desc: "Soạn thảo cấu trúc & văn bản", icon: "✍️", color: "#818cf8" },
    { title: "REVIEWER", desc: "Kiểm định, đối chiếu & QA", icon: "🛡️", color: "#10b981" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        gap: 36,
      }}
    >
      {/* Central Orchestrator Agent Card */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "4px solid #0284c7",
          borderRadius: 32,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: "0 0 50px rgba(2, 132, 199, 0.4)",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            backgroundColor: "#0284c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            transform: `scale(${1 + pulse * 0.01})`,
            boxShadow: "0 0 30px #0284c7",
          }}
        >
          👑
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#38bdf8" }}>
            CENTRAL ORCHESTRATOR AGENT
          </div>
          <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 4 }}>
            Điều phối nhiệm vụ, tổng hợp kết quả và giám sát luồng thực thi
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "8px 18px",
            borderRadius: 14,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          MANAGER
        </div>
      </div>

      {/* SVG Connecting Flow Lines */}
      <svg
        width={920}
        height={60}
        style={{ overflow: "visible" }}
      >
        <line x1={460} y1={0} x2={160} y2={60} stroke="#38bdf8" strokeWidth={4} strokeDasharray="8 6" />
        <line x1={460} y1={0} x2={460} y2={60} stroke="#818cf8" strokeWidth={4} strokeDasharray="8 6" />
        <line x1={460} y1={0} x2={760} y2={60} stroke="#10b981" strokeWidth={4} strokeDasharray="8 6" />
      </svg>

      {/* 3 Specialist Agents */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {agents.map((ag, idx) => {
          const agSpring = spring({ frame: frame - idx * 20, fps, config: { damping: 14 } });
          return (
            <div
              key={ag.title}
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                border: `3px solid ${ag.color}`,
                borderRadius: 28,
                padding: "26px 20px",
                textAlign: "center",
                boxShadow: `0 8px 30px ${ag.color}25`,
                transform: `scale(${interpolate(agSpring, [0, 1], [0.85, 1])})`,
                opacity: agSpring,
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>{ag.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: ag.color }}>{ag.title}</div>
              <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 6, lineHeight: 1.4 }}>{ag.desc}</div>
              <div
                style={{
                  marginTop: 16,
                  backgroundColor: `${ag.color}20`,
                  color: ag.color,
                  padding: "6px 14px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 800,
                  display: "inline-block",
                }}
              >
                ● COOPERATING
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
