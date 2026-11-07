import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S03RepoProps {
  durationInFrames: number;
  narration: string;
}

export const S03Repo: React.FC<S03RepoProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 12 } });

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
        <div
          style={{
            transform: `scale(${cardSpring})`,
            padding: "36px 36px",
            borderRadius: 24,
            backgroundColor: "#11141e",
            border: "2px solid #0066FF",
            boxShadow: "0 16px 40px rgba(0,0,0,0.7), 0 0 35px rgba(0, 102, 255, 0.3)",
          }}
        >
          {/* GitHub Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#1a1f2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                border: "1px solid #232b3e",
              }}
            >
              🐙
            </div>
            <div>
              <div style={{ fontSize: 20, color: "#94a3b8" }}>github.com/</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#38bdf8" }}>
                supermemoryai/supermemory
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: 12,
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: "1px solid #f59e0b",
                color: "#f59e0b",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              ★ 32,000+ Stars
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: 12,
                backgroundColor: "rgba(0, 102, 255, 0.15)",
                border: "1px solid #0066FF",
                color: "#38bdf8",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              TypeScript
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: 12,
                backgroundColor: "#1a1f2e",
                border: "1px solid #232b3e",
                color: "#34d399",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              MIT License
            </div>
          </div>

          {/* Value Proposition Description */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 16,
              backgroundColor: "#0d1117",
              border: "1px solid #232b3e",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 26,
                lineHeight: 1.5,
                color: "#cbd5e1",
                fontWeight: 500,
              }}
            >
              ⚡ <strong style={{ color: "#ffffff" }}>The Memory Engine for the AI Era:</strong>{" "}
              Đóng vai trò như bộ não ngoài (Second Brain), lưu trữ và trích xuất ngữ cảnh liên tục cho AI Agents.
            </p>
          </div>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
