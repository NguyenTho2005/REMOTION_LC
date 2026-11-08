import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MemoryVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cards = [
    { title: "USER PROFILE", desc: "Sở thích, vai trò, phong cách viết", icon: "👤", color: "#818cf8" },
    { title: "TASK HISTORY", desc: "Lịch sử phiên trước, tiến độ đã đạt", icon: "📌", color: "#38bdf8" },
    { title: "PROJECT CONTEXT", desc: "Quy chuẩn mã nguồn, tài liệu nội bộ", icon: "🗂️", color: "#10b981" },
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
        gap: 26,
      }}
    >
      {/* Central Database Banner */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "3px solid #8b5cf6",
          borderRadius: 32,
          padding: "26px 36px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: "0 0 45px rgba(139, 92, 246, 0.35)",
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 20,
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            border: "2px solid #8b5cf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          🧠
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#c084fc" }}>
            VECTOR MEMORY & CONTEXT STORE
          </div>
          <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 4 }}>
            Lưu giữ và truy xuất ngữ cảnh chính xác trong ~50ms
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            color: "#c084fc",
            padding: "8px 18px",
            borderRadius: 14,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          ● RETRIEVING
        </div>
      </div>

      {/* 3 Memory Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {cards.map((c, idx) => {
          const cardSpring = spring({ frame: frame - idx * 25, fps, config: { damping: 14 } });
          return (
            <div
              key={c.title}
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                border: `2px solid ${c.color}`,
                borderRadius: 24,
                padding: "22px 28px",
                display: "flex",
                alignItems: "center",
                boxShadow: `0 8px 25px ${c.color}25`,
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
                opacity: cardSpring,
              }}
            >
              <div style={{ fontSize: 38, marginRight: 22 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.title}</div>
                <div style={{ fontSize: 20, color: "#f8fafc", marginTop: 4 }}>{c.desc}</div>
              </div>
              <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: 18 }}>SYNCED ⚡</div>
            </div>
          );
        })}
      </div>

      {/* Formula Card */}
      <div
        style={{
          marginTop: 10,
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          border: "1px dashed rgba(56, 189, 248, 0.4)",
          borderRadius: 24,
          padding: "20px 32px",
          textAlign: "center",
          fontSize: 26,
          fontWeight: 800,
          color: "#f8fafc",
        }}
      >
        💡 <span style={{ color: "#38bdf8" }}>MEMORY</span> + <span style={{ color: "#818cf8" }}>CONTEXT</span> = <span style={{ color: "#10b981" }}>NHẤT QUÁN &amp; THÔNG MINH HƠN</span>
      </div>
    </div>
  );
};
