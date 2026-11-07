import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface RepositoryCardProps {
  repoName: string;
  stars?: string;
  forks?: string;
  language?: string;
  license?: string;
  description?: string;
  accentColor?: string;
  durationInFrames: number;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repoName,
  stars = "24.5k ★",
  forks = "3.2k",
  language = "TypeScript",
  license = "MIT",
  description = "A powerful framework for modern developers.",
  accentColor = "#10b981",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 12 } });

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
        <div
          style={{
            transform: `scale(${cardSpring})`,
            padding: "36px 36px",
            borderRadius: 24,
            backgroundColor: DARK_TECH_THEME.surface,
            border: `1px solid ${DARK_TECH_THEME.border}`,
            boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${accentColor}20`,
          }}
        >
          {/* GitHub Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: DARK_TECH_THEME.surfaceLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🐙
            </div>
            <div>
              <div style={{ fontSize: 18, color: DARK_TECH_THEME.textMuted }}>
                github.com/
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: DARK_TECH_THEME.accentCyan,
                }}
              >
                {repoName}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: "1px solid #f59e0b",
                color: "#f59e0b",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              ★ {stars}
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                backgroundColor: DARK_TECH_THEME.surfaceLight,
                color: DARK_TECH_THEME.textSecondary,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              ⑂ {forks} forks
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                backgroundColor: DARK_TECH_THEME.surfaceLight,
                color: accentColor,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {language}
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                backgroundColor: DARK_TECH_THEME.surfaceLight,
                color: DARK_TECH_THEME.textMuted,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {license}
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              color: DARK_TECH_THEME.textSecondary,
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <SubtitleSequence text={description} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
