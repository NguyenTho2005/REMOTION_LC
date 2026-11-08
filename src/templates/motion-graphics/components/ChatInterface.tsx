import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ChatInterface: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Chat session 1 appears
  const bubble1Spring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const bubble2Spring = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  // Reset session triggered at frame 140
  const isReset = frame > 140;
  const resetSpring = spring({ frame: frame - 140, fps, config: { damping: 14 } });
  const oldChatOpacity = interpolate(resetSpring, [0, 1], [1, 0.15]);
  const oldChatBlur = interpolate(resetSpring, [0, 1], [0, 8]);
  const newChatScale = interpolate(resetSpring, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        border: "2px solid rgba(56, 189, 248, 0.3)",
        borderRadius: 36,
        padding: "36px 32px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Window Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 24,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: 30,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#10b981" }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#94a3b8" }}>
          AI Chatbot Session #104
        </div>
        <div
          style={{
            backgroundColor: isReset ? "#ef4444" : "#0284c7",
            color: "#ffffff",
            padding: "6px 16px",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {isReset ? "🔄 ĐÃ XÓA NGỮ CẢNH" : "● ACTIVE"}
        </div>
      </div>

      {/* Old Session Bubbles (Fades & blurs out when reset) */}
      <div
        style={{
          opacity: oldChatOpacity,
          filter: `blur(${oldChatBlur}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          transform: `translateY(${interpolate(resetSpring, [0, 1], [0, -30])}px)`,
        }}
      >
        {/* User Prompt */}
        <div
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "20px 30px",
            borderRadius: "26px 26px 4px 26px",
            fontSize: 28,
            fontWeight: 600,
            maxWidth: "80%",
            transform: `scale(${bubble1Spring})`,
            opacity: bubble1Spring,
          }}
        >
          Tôi đang làm báo cáo tài chính Q4, hãy nhớ giúp tôi nhé?
        </div>

        {/* Bot Response */}
        <div
          style={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(30, 41, 59, 0.9)",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "20px 30px",
            borderRadius: "26px 26px 26px 4px",
            fontSize: 28,
            fontWeight: 500,
            maxWidth: "85%",
            transform: `scale(${bubble2Spring})`,
            opacity: bubble2Spring,
          }}
        >
          Được rồi, tôi đã nhận thông tin báo cáo tài chính Q4.
        </div>
      </div>

      {/* New Session Warning Pop-in */}
      {isReset && (
        <div
          style={{
            marginTop: 40,
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "2px solid #ef4444",
            borderRadius: 24,
            padding: "28px 32px",
            textAlign: "center",
            transform: `scale(${newChatScale})`,
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#f87171", marginBottom: 8 }}>
            MẤT TOÀN BỘ NGỮ CẢNH (CONTEXT LOSS)
          </div>
          <div style={{ fontSize: 24, color: "#fca5a5", lineHeight: 1.4 }}>
            Mở phiên chat mới = AI quên sạch thông tin cũ.<br />
            Người dùng phải nhập lại từ đầu, không tự động chạy chuỗi công việc.
          </div>
        </div>
      )}
    </div>
  );
};
