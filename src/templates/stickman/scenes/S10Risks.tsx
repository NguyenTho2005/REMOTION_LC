import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S10Risks: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = Math.sin((frame / fps) * Math.PI * 6) > 0;

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
            backgroundColor: "#ef4444",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 10 / RỦI RO
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          LIMITATIONS & SAFETY
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
          AI Agent Không Phải Phép Màu!
        </div>
      </div>

      {/* Alert Banner */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 80,
          right: 80,
          backgroundColor: "#ffffff",
          border: `6px solid ${flash ? "#ef4444" : "#f59e0b"}`,
          borderRadius: 32,
          padding: 36,
          boxShadow: "0 20px 50px rgba(239,68,68,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 60 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#ef4444" }}>CÁC NGUY CƠ TIỀM ẨN</div>
            <div style={{ fontSize: 20, color: "#64748b" }}>Cần kiểm soát quyền hạn cẩn trọng</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "16px 20px", backgroundColor: "#fef2f2", borderRadius: 16, border: "2px solid #fecaca", fontSize: 22, fontWeight: 700, color: "#991b1b" }}>
            ❌ Hiểu sai yêu cầu hoặc suy diễn ngoài ngữ cảnh
          </div>
          <div style={{ padding: "16px 20px", backgroundColor: "#fef2f2", borderRadius: 16, border: "2px solid #fecaca", fontSize: 22, fontWeight: 700, color: "#991b1b" }}>
            ❌ Lựa chọn sai công cụ hoặc tham số API lỗi
          </div>
          <div style={{ padding: "16px 20px", backgroundColor: "#fef2f2", borderRadius: 16, border: "2px solid #fecaca", fontSize: 22, fontWeight: 700, color: "#991b1b" }}>
            ❌ Gây hậu quả ngoài ý muốn nếu cấp quyền xóa/sửa quá rộng
          </div>
        </div>
      </div>

      {/* Robot in Alert Mode */}
      <div style={{ position: "absolute", top: 860, right: 140 }}>
        <CompanionRobot expression="alert" scale={1.4} />
      </div>

      {/* Stickman holding warning sign */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 140,
        }}
      >
        <Stickman pose="surprised" scale={1.35} facing="right" />
        {/* Sign "CHECK FIRST" */}
        <div
          style={{
            position: "absolute",
            top: -50,
            left: 120,
            backgroundColor: "#ef4444",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: 16,
            fontSize: 24,
            fontWeight: 900,
            border: "4px solid #0f172a",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        >
          🛑 CHECK FIRST!
        </div>
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="không phải phép màu" />
    </div>
  );
};
