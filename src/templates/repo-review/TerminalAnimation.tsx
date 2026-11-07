import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface TerminalAnimationProps {
  title?: string;
  command: string;
  output?: string;
  accentColor?: string;
  durationInFrames: number;
}

export const TerminalAnimation: React.FC<TerminalAnimationProps> = ({
  title = "Khởi Chạy & Cài Đặt",
  command,
  output = "Done in 1.42s.",
  accentColor = "#06b6d4",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const terminalSpring = spring({ frame, fps, config: { damping: 12 } });

  // Typewriter effect on command
  const charsShown = Math.min(command.length, Math.floor(frame * 1.5));
  const currentCmd = command.slice(0, charsShown);
  const showOutput = frame > command.length / 1.5 + 10;
  const cursorBlink = Math.floor(frame / 10) % 2 === 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <BackgroundEffects glowColor={accentColor} />

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
        <h2
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: DARK_TECH_THEME.textPrimary,
            textAlign: "center",
            margin: "0 0 32px 0",
          }}
        >
          {title}
        </h2>

        {/* Terminal Window */}
        <div
          style={{
            transform: `scale(${terminalSpring})`,
            borderRadius: 20,
            backgroundColor: "#090c10",
            border: `1px solid ${DARK_TECH_THEME.border}`,
            boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
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
            <div style={{ fontSize: 18, color: DARK_TECH_THEME.textMuted, fontFamily: "monospace" }}>
              bash — 80x24
            </div>
          </div>

          {/* Terminal Content */}
          <div
            style={{
              padding: "28px 30px",
              fontFamily: "monospace",
              fontSize: 26,
              lineHeight: 1.6,
              color: "#58a6ff",
            }}
          >
            <div>
              <span style={{ color: "#7ee787", fontWeight: 700 }}>$ </span>
              <span style={{ color: "#f0f6fc" }}>{currentCmd}</span>
              {cursorBlink && <span style={{ color: accentColor }}>█</span>}
            </div>

            {showOutput && (
              <div
                style={{
                  marginTop: 16,
                  color: "#7ee787",
                  fontSize: 22,
                  whiteSpace: "pre-wrap",
                }}
              >
                {output}
              </div>
            )}
          </div>
        </div>
      </div>

      <SubtitleSequence
        text={`Cài đặt nhanh với lệnh: ${command}`}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};
