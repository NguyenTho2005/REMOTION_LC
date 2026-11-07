import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S04MemoryEngineProps {
  durationInFrames: number;
  narration: string;
}

export const S04MemoryEngine: React.FC<S04MemoryEngineProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });
  const latencyPulse = Math.sin(frame * 0.1) > 0 ? 1.05 : 1.0;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#090a0f" }}>
      <BackgroundEffects glowColor="#8B5CF6" />

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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: "rgba(139, 92, 246, 0.15)",
              border: "1px solid #8B5CF6",
              color: "#a78bfa",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            KIẾN TRÚC BỘ NHỚ VƯỢT TRỘI
          </span>
          <h2
            style={{
              transform: `scale(${titleSpring})`,
              fontSize: 46,
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "18px 0 0 0",
            }}
          >
            Khác Gì So Với RAG Cũ?
          </h2>
        </div>

        {/* 3 Pillars of Memory Engine */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Pillar 1 */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 18,
              backgroundColor: "#11141e",
              border: "1px solid #232b3e",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                border: "1px solid #38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              🔍
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>
                Trích Xuất Sự Thật Tự Động
              </div>
              <div style={{ fontSize: 20, color: "#94a3b8" }}>
                Tự động bóc tách sự kiện cốt lõi, thói quen và sở thích từ cuộc trò chuyện.
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 18,
              backgroundColor: "#11141e",
              border: "1px solid #232b3e",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "rgba(139, 92, 246, 0.15)",
                border: "1px solid #8B5CF6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              🕸️
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa" }}>
                Đồ Thị Quan Hệ (Memory Graph)
              </div>
              <div style={{ fontSize: 20, color: "#94a3b8" }}>
                Liên kết các thực thể theo thời gian thực thay vì chỉ chia nhỏ tài liệu rời rạc.
              </div>
            </div>
          </div>

          {/* Pillar 3: Fast 50ms Profile */}
          <div
            style={{
              transform: `scale(${latencyPulse})`,
              padding: "20px 24px",
              borderRadius: 18,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              border: "1px solid #10b981",
              display: "flex",
              alignItems: "center",
              gap: 18,
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                border: "1px solid #10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>
                User Profile ~50ms Latency
              </div>
              <div style={{ fontSize: 20, color: "#cbd5e1" }}>
                Cung cấp hồ sơ cá nhân hóa ngay lập tức cho AI mà không làm tràn prompt.
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
