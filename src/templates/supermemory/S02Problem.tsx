import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S02ProblemProps {
  durationInFrames: number;
  narration: string;
}

export const S02Problem: React.FC<S02ProblemProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1Spring = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const card2Spring = spring({ frame: frame - 18, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#090a0f" }}>
      <BackgroundEffects glowColor="#ef4444" />

      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {/* Category Badge */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#f87171",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            VẤN ĐỀ CỦA MỌI LẬP TRÌNH VIÊN
          </span>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "20px 0 0 0",
            }}
          >
            Nút Thắt Của AI Hiện Tại
          </h2>
        </div>

        {/* Two Comparison Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Card 1: Session 1 */}
          <div
            style={{
              transform: `scale(${Math.max(0, card1Spring)})`,
              opacity: Math.max(0, Math.min(1, card1Spring)),
              padding: "26px 30px",
              borderRadius: 20,
              backgroundColor: "#11141e",
              border: "1px solid #232b3e",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                border: "1px solid #38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              💬
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>
                Phiên Làm Việc 1
              </div>
              <div style={{ fontSize: 22, color: "#cbd5e1", lineHeight: 1.4 }}>
                Bạn dành hàng giờ giải thích logic dự án, quy tắc code và sở thích cá nhân.
              </div>
            </div>
          </div>

          {/* Card 2: Session 2 (Lost Memory) */}
          <div
            style={{
              transform: `scale(${Math.max(0, card2Spring)})`,
              opacity: Math.max(0, Math.min(1, card2Spring)),
              padding: "26px 30px",
              borderRadius: 20,
              backgroundColor: "rgba(40, 16, 20, 0.8)",
              border: "1px solid #ef4444",
              boxShadow: "0 8px 30px rgba(239, 68, 68, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                border: "1px solid #ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444", marginBottom: 4 }}>
                Mở Đoạn Chat Mới
              </div>
              <div style={{ fontSize: 22, color: "#fca5a5", lineHeight: 1.4 }}>
                AI quên sạch 100% ngữ cảnh (Catastrophic Forgetting), bạn phải nhập lại từ đầu!
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
