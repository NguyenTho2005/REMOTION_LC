import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface BreakingNewsProps {
  alertBadge?: string;
  headline: string;
  summary: string;
  accentColor?: string;
  durationInFrames: number;
}

export const BreakingNews: React.FC<BreakingNewsProps> = ({
  alertBadge = "TIN NÓNG CÔNG NGHỆ",
  headline,
  summary,
  accentColor = "#ef4444",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const alertScale = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  const isBlinking = Math.floor(frame / 12) % 2 === 0;

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
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Pulsing Alert Bar */}
        <div
          style={{
            transform: `scale(${alertScale})`,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 999,
            backgroundColor: "rgba(239, 68, 68, 0.18)",
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 25px ${accentColor}44`,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: isBlinking ? accentColor : "transparent",
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {alertBadge}
          </span>
        </div>

        {/* Big Impact Headline */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1.25,
            color: DARK_TECH_THEME.textPrimary,
            margin: "0 0 32px 0",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          }}
        >
          {headline}
        </h1>

        {/* News Card */}
        <div
          style={{
            padding: "28px 32px",
            borderRadius: 20,
            backgroundColor: DARK_TECH_THEME.surface,
            border: `1px solid ${DARK_TECH_THEME.border}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            maxWidth: 900,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.5,
              color: DARK_TECH_THEME.textSecondary,
              fontWeight: 500,
            }}
          >
            {summary}
          </p>
        </div>
      </div>

      <SubtitleSequence text={summary} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
