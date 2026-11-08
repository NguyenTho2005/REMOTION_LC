import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S03Introduction: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for 3 core pill blocks
  const pill1Spring = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const pill2Spring = spring({ frame: frame - 45, fps, config: { damping: 12 } });
  const pill3Spring = spring({ frame: frame - 70, fps, config: { damping: 12 } });

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

      {/* Top Header */}
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
          ● 03 / GIỚI THIỆU
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          PARADIGM SHIFT
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
          Từ Trả Lời Đến <span style={{ color: "#0284c7" }}>Tự Động Hoàn Thành</span>
        </div>
      </div>

      {/* Floating Robot at Center */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <CompanionRobot expression="happy" scale={1.8} />
      </div>

      {/* 3 Core Pills: GOAL -> PLAN -> ACTION */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Pill 1: GOAL */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "5px solid #0284c7",
            borderRadius: 28,
            padding: "24px 36px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 12px 30px rgba(2,132,199,0.15)",
            transform: `scale(${interpolate(pill1Spring, [0, 1], [0.8, 1])})`,
            opacity: pill1Spring,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 24 }}>🎯</div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0284c7" }}>1. TIẾP NHẬN MỤC TIÊU (GOAL)</div>
            <div style={{ fontSize: 22, color: "#475569" }}>Không cần chỉ từng bước, chỉ cần biết đích đến</div>
          </div>
        </div>

        {/* Pill 2: PLAN */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "5px solid #8b5cf6",
            borderRadius: 28,
            padding: "24px 36px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 12px 30px rgba(139,92,246,0.15)",
            transform: `scale(${interpolate(pill2Spring, [0, 1], [0.8, 1])})`,
            opacity: pill2Spring,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 24 }}>🧠</div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#8b5cf6" }}>2. TỰ ĐỘNG LẬP KẾ HOẠCH (PLAN)</div>
            <div style={{ fontSize: 22, color: "#475569" }}>Phân tích và chia nhỏ thành các nhiệm vụ con</div>
          </div>
        </div>

        {/* Pill 3: ACTION */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "5px solid #10b981",
            borderRadius: 28,
            padding: "24px 36px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 12px 30px rgba(16,185,129,0.15)",
            transform: `scale(${interpolate(pill3Spring, [0, 1], [0.8, 1])})`,
            opacity: pill3Spring,
          }}
        >
          <div style={{ fontSize: 48, marginRight: 24 }}>⚡</div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981" }}>3. THỰC THI & DÙNG CÔNG CỤ (ACTION)</div>
            <div style={{ fontSize: 22, color: "#475569" }}>Gọi trình duyệt, API, file để ra kết quả cuối cùng</div>
          </div>
        </div>
      </div>

      {/* Stickman presenting at bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 540,
          left: 120,
        }}
      >
        <Stickman pose="presenting" scale={1.3} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="mục tiêu" />
    </div>
  );
};
