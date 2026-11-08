import React from "react";
import { useCurrentFrame } from "remotion";
import { Stickman } from "../Stickman";
import { ChatBubbleStack } from "../StickmanProps";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S02Problem: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  const pose = frame < 120 ? "talking" : "confused";

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
      {/* Background Accent */}
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

      {/* Top Header Badge */}
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
            backgroundColor: "#ef4444",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 02 / HẠN CHẾ
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          TRADITIONAL CHATBOTS
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 900, color: "#0f172a" }}>
          Hỏi Đâu Trả Lời Đó, <span style={{ color: "#ef4444" }}>Không Tự Hành Động</span>
        </div>
      </div>

      {/* Center: Chat Bubble Stack */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 180,
          right: 60,
        }}
      >
        <ChatBubbleStack />
      </div>

      {/* Left Bottom: Stickman reacting */}
      <div
        style={{
          position: "absolute",
          bottom: 560,
          left: 140,
        }}
      >
        <Stickman pose={pose} scale={1.4} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="toàn bộ quy trình" />
    </div>
  );
};
