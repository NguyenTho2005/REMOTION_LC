import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S11HumanInLoop: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button pulse when approved
  const isApproved = frame > 120;
  const buttonSpring = spring({ frame: frame - 120, fps, config: { damping: 12 } });

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
            backgroundColor: "#10b981",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 11 / KIỂM SOÁT
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          HUMAN IN THE LOOP
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
          Con Người Giữ Quyền Phê Duyệt
        </div>
      </div>

      {/* Approve Button Card */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 80,
          right: 80,
          backgroundColor: "#ffffff",
          border: "5px solid #0f172a",
          borderRadius: 32,
          padding: 36,
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: "#64748b", marginBottom: 20 }}>
          YÊU CẦU PHÊ DUYỆT TỪ AGENT: "Gửi báo cáo cho đối tác?"
        </div>

        {/* Big Button */}
        <div
          style={{
            backgroundColor: isApproved ? "#10b981" : "#f1f5f9",
            color: isApproved ? "#ffffff" : "#0f172a",
            border: `5px solid ${isApproved ? "#059669" : "#cbd5e1"}`,
            borderRadius: 24,
            padding: "24px 60px",
            fontSize: 36,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: isApproved ? "0 16px 40px rgba(16,185,129,0.4)" : "none",
            transform: isApproved ? `scale(${interpolate(buttonSpring, [0, 1], [0.95, 1.05])})` : "scale(1)",
          }}
        >
          {isApproved ? "✔ ĐÃ PHÊ DUYỆT (APPROVED)" : "⏳ CHỜ PHÊ DUYỆT (PENDING)"}
        </div>

        <div style={{ marginTop: 28, width: "100%", display: "flex", justifyContent: "space-around" }}>
          <div style={{ fontSize: 20, color: "#334155", fontWeight: 700 }}>🛡️ Giám sát quyền nhạy cảm</div>
          <div style={{ fontSize: 20, color: "#334155", fontWeight: 700 }}>🔍 Xem trước kết quả</div>
          <div style={{ fontSize: 20, color: "#334155", fontWeight: 700 }}>🤝 Cộng tác an toàn</div>
        </div>
      </div>

      {/* Companion Robot with Tray */}
      <div style={{ position: "absolute", top: 820, right: 140 }}>
        <CompanionRobot expression="happy" scale={1.4} holdingTray />
      </div>

      {/* Stickman celebrating after approval */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 140,
        }}
      >
        <Stickman pose={isApproved ? "celebrating" : "pointing"} scale={1.35} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="Human in the Loop" />
    </div>
  );
};
