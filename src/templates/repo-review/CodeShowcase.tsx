import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME, VisualEngine } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface CodeShowcaseProps {
  title?: string;
  code: string;
  language?: string;
  explanation?: string;
  accentColor?: string;
  durationInFrames: number;
}

export const CodeShowcase: React.FC<CodeShowcaseProps> = ({
  title = "Triển Khai Mã Nguồn",
  code,
  language = "typescript",
  explanation = "",
  accentColor = "#6366f1",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowSpring = spring({ frame, fps, config: { damping: 12 } });
  const tokenizedLines = VisualEngine.formatCodeTokens(code);

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

        {/* Code Editor Window */}
        <div
          style={{
            transform: `scale(${windowSpring})`,
            borderRadius: 20,
            backgroundColor: "#0d1117",
            border: `1px solid ${DARK_TECH_THEME.border}`,
            boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
            overflow: "hidden",
          }}
        >
          {/* Window Title Bar */}
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
              example.{language === "typescript" ? "ts" : "py"}
            </div>
          </div>

          {/* Code Body */}
          <div
            style={{
              padding: "24px 28px",
              fontFamily: "monospace",
              fontSize: 24,
              lineHeight: 1.6,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {tokenizedLines.map((line, idx) => (
              <div key={idx} style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "#484f58", userSelect: "none", minWidth: 28 }}>
                  {idx + 1}
                </span>
                <span style={{ color: line.color, whiteSpace: "pre-wrap" }}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SubtitleSequence
        text={explanation || "Hướng dẫn cú pháp thực chiến"}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};
