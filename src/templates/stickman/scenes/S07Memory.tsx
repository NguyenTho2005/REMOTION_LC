import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S07Memory: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1Spring = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const card2Spring = spring({ frame: frame - 55, fps, config: { damping: 12 } });
  const card3Spring = spring({ frame: frame - 85, fps, config: { damping: 12 } });

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
            backgroundColor: "#8b5cf6",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 07 / BỘ NHỚ
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          LONG-TERM MEMORY & CONTEXT
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
          Lưu Trữ Tiến Trình & Ngữ Cảnh
        </div>
      </div>

      {/* Memory Cards Container */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 100,
          right: 100,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Memory Card 1 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "5px solid #8b5cf6",
            borderRadius: 24,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 14px 35px rgba(139,92,246,0.15)",
            transform: `scale(${interpolate(card1Spring, [0, 1], [0.8, 1])})`,
            opacity: card1Spring,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 24 }}>🧠</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#8b5cf6" }}>HỒ SƠ NGƯỜI DÙNG</div>
            <div style={{ fontSize: 22, color: "#475569" }}>Sở thích, phong cách viết, ngôn ngữ lập trình</div>
          </div>
        </div>

        {/* Memory Card 2 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "5px solid #0284c7",
            borderRadius: 24,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 14px 35px rgba(2,132,199,0.15)",
            transform: `scale(${interpolate(card2Spring, [0, 1], [0.8, 1])})`,
            opacity: card2Spring,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 24 }}>📌</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0284c7" }}>LỊCH SỬ TÁC VỤ</div>
            <div style={{ fontSize: 22, color: "#475569" }}>Đã làm gì hôm qua? Đã hoàn thành bước nào?</div>
          </div>
        </div>

        {/* Memory Card 3 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "5px solid #10b981",
            borderRadius: 24,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 14px 35px rgba(16,185,129,0.15)",
            transform: `scale(${interpolate(card3Spring, [0, 1], [0.8, 1])})`,
            opacity: card3Spring,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 24 }}>🗂️</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#10b981" }}>NGỮ CẢNH DỰ ÁN</div>
            <div style={{ fontSize: 22, color: "#475569" }}>Cấu trúc file, tài liệu nội bộ, quy chuẩn công ty</div>
          </div>
        </div>
      </div>

      {/* Floating Robot inspecting memories */}
      <div
        style={{
          position: "absolute",
          top: 860,
          right: 120,
        }}
      >
        <CompanionRobot expression="thinking" scale={1.4} />
      </div>

      {/* Stickman in thinking pose */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 140,
        }}
      >
        <Stickman pose="thinking" scale={1.35} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="Memory" />
    </div>
  );
};
