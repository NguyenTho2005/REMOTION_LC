import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S08OutroProps {
  durationInFrames: number;
  narration: string;
}

export const S08Outro: React.FC<S08OutroProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 14 } });

  const tags = ["#Supermemory", "#AIAgent", "#OpenSource", "#LapTrinh"];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#090a0f" }}>
      <BackgroundEffects glowColor="#8B5CF6" />

      <div
        style={{
          position: "absolute",
          top: 220,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: `scale(${cardScale})`,
            padding: "44px 36px",
            borderRadius: 28,
            backgroundColor: "#11141e",
            border: "2px solid #8B5CF6",
            boxShadow: "0 12px 40px rgba(139, 92, 246, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 900,
          }}
        >
          {/* Avatar Icon */}
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0066FF, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              boxShadow: "0 0 30px rgba(0, 102, 255, 0.6)",
              marginBottom: 20,
            }}
          >
            ⚡
          </div>

          <h2
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 10px 0",
            }}
          >
            Tech Pulse Vietnam
          </h2>

          <p
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#94a3b8",
              margin: "0 0 28px 0",
              lineHeight: 1.4,
            }}
          >
            Supermemory: Mảnh ghép còn thiếu để AI thực sự hiểu bạn.
          </p>

          {/* Repo Link Pill */}
          <div
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              backgroundColor: "rgba(0, 102, 255, 0.15)",
              border: "1px solid #0066FF",
              color: "#38bdf8",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 28,
              fontFamily: "monospace",
            }}
          >
            🔗 github.com/supermemoryai/supermemory
          </div>

          {/* Follow CTA Button */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 44px",
              borderRadius: 999,
              background: "linear-gradient(90deg, #0066FF, #8B5CF6)",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: 1,
              boxShadow: "0 8px 30px rgba(0, 102, 255, 0.5)",
              textTransform: "uppercase",
            }}
          >
            <span>+ Follow Kênh Ngay</span>
          </div>

          {/* Hashtags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginTop: 28,
            }}
          >
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  backgroundColor: "#1a1f2e",
                  color: "#38bdf8",
                  fontSize: 18,
                  fontWeight: 600,
                  border: "1px solid #232b3e",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
