import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ApprovalCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isApproved = frame > 110;
  const approveSpring = spring({ frame: frame - 110, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        border: "3px solid rgba(56, 189, 248, 0.35)",
        borderRadius: 36,
        padding: "40px 36px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#38bdf8", fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>
          🛡️ HUMAN-IN-THE-LOOP VERIFICATION
        </div>
        <div
          style={{
            backgroundColor: isApproved ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
            color: isApproved ? "#10b981" : "#f59e0b",
            padding: "8px 18px",
            borderRadius: 14,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {isApproved ? "● ĐÃ PHÊ DUYỆT" : "⏳ CHỜ PHÊ DUYỆT"}
        </div>
      </div>

      <div style={{ fontSize: 32, fontWeight: 900, color: "#f8fafc", lineHeight: 1.35, marginBottom: 12 }}>
        Yêu cầu hành động nhạy cảm:
      </div>
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: 22,
          color: "#cbd5e1",
          lineHeight: 1.5,
          marginBottom: 32,
        }}
      >
        <span style={{ color: "#38bdf8", fontWeight: 700 }}>Tác vụ:</span> "Triển khai cập nhật hệ thống và gửi email thông báo đối tác"<br />
        <span style={{ color: "#818cf8", fontWeight: 700 }}>Quyền yêu cầu:</span> Production Write &amp; External SMTP Access
      </div>

      {/* Buttons Row */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* Reject Button */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            borderRadius: 22,
            padding: "20px 24px",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 800,
            opacity: isApproved ? 0.35 : 1,
          }}
        >
          ✖ TỪ CHỐI (REJECT)
        </div>

        {/* Approve Button */}
        <div
          style={{
            flex: 1.5,
            backgroundColor: isApproved ? "#10b981" : "#0284c7",
            border: `3px solid ${isApproved ? "#34d399" : "#38bdf8"}`,
            color: "#ffffff",
            borderRadius: 22,
            padding: "20px 24px",
            textAlign: "center",
            fontSize: 28,
            fontWeight: 900,
            boxShadow: isApproved ? "0 0 40px rgba(16, 185, 129, 0.5)" : "0 0 25px rgba(2, 132, 199, 0.3)",
            transform: isApproved ? `scale(${interpolate(approveSpring, [0, 1], [0.95, 1.05])})` : "scale(1)",
          }}
        >
          {isApproved ? "✔ ĐÃ PHÊ DUYỆT (APPROVED)" : "✔ PHÊ DUYỆT (APPROVE)"}
        </div>
      </div>

      <div style={{ marginTop: 28, textAlign: "center", fontSize: 20, color: "#94a3b8", fontWeight: 600 }}>
        Con người kiểm soát quyền cao nhất — Ngăn chặn mọi rủi ro ngoài ý muốn!
      </div>
    </div>
  );
};
