import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S07TerminalDeploymentProps {
  durationInFrames: number;
  narration: string;
}

export const S07TerminalDeployment: React.FC<S07TerminalDeploymentProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowSpring = spring({ frame, fps, config: { damping: 12 } });

  const command = "docker compose up -d";
  const charsShown = Math.min(command.length, Math.floor(frame * 1.5));
  const currentCmd = command.slice(0, charsShown);
  const showOutput = frame > command.length / 1.5 + 8;
  const cursorBlink = Math.floor(frame / 10) % 2 === 0;

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
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10b981",
              color: "#34d399",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            SELF-HOSTING & PRIVACY
          </span>
          <h2
            style={{
              fontSize: 46,
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "18px 0 0 0",
            }}
          >
            Tự Triển Khai Cục Bộ
          </h2>
        </div>

        {/* Terminal Window */}
        <div
          style={{
            transform: `scale(${windowSpring})`,
            borderRadius: 20,
            backgroundColor: "#090c10",
            border: "1px solid #232b3e",
            boxShadow: "0 16px 40px rgba(0,0,0,0.8)",
            overflow: "hidden",
          }}
        >
          {/* Window Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              backgroundColor: "#161b22",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#27c93f" }} />
            </div>
            <div style={{ fontSize: 18, color: "#64748b", fontFamily: "monospace" }}>
              bash — supermemory-local
            </div>
          </div>

          {/* Terminal Body */}
          <div
            style={{
              padding: "26px 28px",
              fontFamily: "monospace",
              fontSize: 24,
              lineHeight: 1.6,
              color: "#58a6ff",
            }}
          >
            <div>
              <span style={{ color: "#7ee787", fontWeight: 700 }}>$ </span>
              <span style={{ color: "#f0f6fc" }}>{currentCmd}</span>
              {cursorBlink && <span style={{ color: "#38bdf8" }}>█</span>}
            </div>

            {showOutput && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ color: "#7ee787" }}>✔ [supermemory] Container started</div>
                <div style={{ color: "#7ee787" }}>✔ Core Memory Graph initialized</div>
                <div style={{ color: "#38bdf8" }}>✔ Local API listening at: http://localhost:8080</div>
                <div style={{ color: "#a78bfa" }}>✔ Connected to local Ollama embeddings</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
