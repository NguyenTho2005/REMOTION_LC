import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S14Outro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaSpring = spring({ frame: frame - 20, fps, config: { damping: 12 } });

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
          ● 14 / THẢO LUẬN & FOLLOW
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          CALL TO ACTION
        </div>
      </div>

      {/* Main Question Banner */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 80,
          right: 80,
          backgroundColor: "#ffffff",
          border: "6px solid #0f172a",
          borderRadius: 36,
          padding: "36px 40px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 900, color: "#0f172a", lineHeight: 1.3, marginBottom: 16 }}>
          Bạn Nghĩ AI Agent Sẽ Thay Đổi Công Việc Nào Đầu Tiên? 💭
        </div>
        <div style={{ fontSize: 24, color: "#0284c7", fontWeight: 700 }}>
          HÃY ĐỂ LẠI Ý KIẾN Ở PHẦN BÌNH LUẬN 👇
        </div>
      </div>

      {/* Follow CTA Button */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 100,
          right: 100,
          backgroundColor: "#0284c7",
          color: "#ffffff",
          borderRadius: 28,
          padding: "24px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          fontSize: 32,
          fontWeight: 800,
          boxShadow: "0 16px 40px rgba(2,132,199,0.35)",
          transform: `scale(${interpolate(ctaSpring, [0, 1], [0.8, 1])})`,
          opacity: ctaSpring,
        }}
      >
        <span>🔔</span>
        <span>FOLLOW KÊNH ĐỂ ĐÓN XEM VIDEO MỚI!</span>
      </div>

      {/* Both Stickman and Robot Waving together */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 280,
        }}
      >
        <Stickman pose="waving" scale={1.4} facing="right" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 640,
          right: 260,
        }}
      >
        <CompanionRobot expression="waving" scale={1.5} />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="theo dõi kênh" />
    </div>
  );
};
