import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S01HookProps {
  durationInFrames: number;
  narration: string;
}

export const S01Hook: React.FC<S01HookProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const brainScale = spring({
    frame: frame - 6,
    fps,
    config: { damping: 10 },
  });

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
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Glow Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 999,
            backgroundColor: "rgba(0, 102, 255, 0.15)",
            border: "1px solid #0066FF",
            boxShadow: "0 0 25px rgba(0, 102, 255, 0.4)",
            marginBottom: 36,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#0066FF",
              boxShadow: "0 0 12px #0066FF",
            }}
          />
          <span
            style={{
              color: "#38bdf8",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            AI MEMORY BREAKTHROUGH
          </span>
        </div>

        {/* Animated Brain Icon / Symbol */}
        <div
          style={{
            transform: `scale(${brainScale})`,
            width: 140,
            height: 140,
            borderRadius: 36,
            background: "linear-gradient(135deg, rgba(0, 102, 255, 0.3), rgba(139, 92, 246, 0.3))",
            border: "2px solid rgba(0, 102, 255, 0.6)",
            boxShadow: "0 0 40px rgba(0, 102, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 70,
            marginBottom: 36,
          }}
        >
          🧠
        </div>

        {/* Main Impact Headline */}
        <h1
          style={{
            transform: `scale(${titleSpring})`,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.25,
            color: "#FFFFFF",
            margin: "0 0 24px 0",
            textShadow: "0 4px 25px rgba(0,0,0,0.9)",
          }}
        >
          AI Có Thể Nhớ Mọi Thứ?
        </h1>

        {/* Subtitle Teaser Card */}
        <div
          style={{
            padding: "24px 32px",
            borderRadius: 20,
            backgroundColor: "#11141e",
            border: "1px solid #232b3e",
            maxWidth: 900,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.5,
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            Supermemory: Bộ nhớ dài hạn vĩnh cửu cho AI Agents
          </p>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
