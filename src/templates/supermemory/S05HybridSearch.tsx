import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S05HybridSearchProps {
  durationInFrames: number;
  narration: string;
}

export const S05HybridSearch: React.FC<S05HybridSearchProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#090a0f" }}>
      <BackgroundEffects glowColor="#0066FF" />

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
              backgroundColor: "rgba(0, 102, 255, 0.15)",
              border: "1px solid #0066FF",
              color: "#38bdf8",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            SEARCH MODE: HYBRID
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
            Sức Mạnh Tìm Kiếm Kép
          </h2>
        </div>

        {/* Dual Engine Display */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
          {/* Dense Vector Card */}
          <div
            style={{
              padding: "24px 20px",
              borderRadius: 20,
              backgroundColor: "#11141e",
              border: "1px solid rgba(0, 102, 255, 0.4)",
              boxShadow: "0 8px 24px rgba(0, 102, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌐</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8", marginBottom: 6 }}>
              Vector Search (Dense)
            </div>
            <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.4 }}>
              Hiểu nghĩa ẩn dụ, đồng nghĩa & ngữ cảnh tổng quan.
            </div>
          </div>

          {/* Sparse BM25 Card */}
          <div
            style={{
              padding: "24px 20px",
              borderRadius: 20,
              backgroundColor: "#11141e",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎯</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa", marginBottom: 6 }}>
              BM25 Keyword (Sparse)
            </div>
            <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.4 }}>
              Khớp chính xác tên biến, lỗi kỹ thuật, ID, lệnh code.
            </div>
          </div>
        </div>

        {/* Fusion Badge */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: 16,
            background: "linear-gradient(90deg, rgba(0, 102, 255, 0.15), rgba(139, 92, 246, 0.15))",
            border: "1px solid #38bdf8",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 30 }}>✨</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
              Kết Quả Hợp Nhất & Tái Xếp Hạng (Reranked)
            </div>
            <div style={{ fontSize: 18, color: "#cbd5e1" }}>
              AI truy hồi thông tin quá khứ với độ chính xác cao nhất mà không bị ảo giác.
            </div>
          </div>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
