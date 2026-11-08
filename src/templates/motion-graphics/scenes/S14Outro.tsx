import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MotionBackground } from "../components/MotionBackground";
import { MotionSubtitle } from "../components/Typography";

export const S14Outro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaSpring = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  return (
    <MotionBackground sceneNumber="14 / THẢO LUẬN" category="CALL TO ACTION">
      {/* Main Question Card */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 80,
          right: 80,
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "4px solid #38bdf8",
          borderRadius: 36,
          padding: "44px 40px",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(56, 189, 248, 0.35)",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 900, color: "#f8fafc", lineHeight: 1.35, marginBottom: 18 }}>
          Bạn Nghĩ AI Agent Sẽ Thay Đổi Công Việc Nào Đầu Tiên? 💭
        </div>
        <div style={{ fontSize: 26, color: "#38bdf8", fontWeight: 800, letterSpacing: 1 }}>
          HÃY ĐỂ LẠI BÌNH LUẬN CHIA SẺ BÊN DƯỚI! 👇
        </div>
      </div>

      {/* Big Center Headline: WHAT WILL YOU AUTOMATE? */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#818cf8",
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          WHAT WILL YOU AUTOMATE?
        </div>
      </div>

      {/* Follow CTA Button */}
      <div
        style={{
          position: "absolute",
          top: 720,
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
          boxShadow: "0 0 50px rgba(2, 132, 199, 0.5)",
          transform: `scale(${interpolate(ctaSpring, [0, 1], [0.85, 1])})`,
          opacity: ctaSpring,
        }}
      >
        <span>🔔</span>
        <span>FOLLOW KÊNH ĐỂ ĐÓN XEM VIDEO MỚI!</span>
      </div>

      {/* Floating Tech Icons */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 36,
          fontSize: 44,
          opacity: 0.8,
        }}
      >
        <span>⚡</span>
        <span>🤖</span>
        <span>🧠</span>
        <span>🛠️</span>
        <span>🚀</span>
      </div>

      <MotionSubtitle text={text} keyword="theo dõi kênh" />
    </MotionBackground>
  );
};
