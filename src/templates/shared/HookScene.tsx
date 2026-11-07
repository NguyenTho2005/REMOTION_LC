import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "./BackgroundEffects";
import { SubtitleSequence } from "./SubtitleSequence";

export interface HookSceneProps {
  badgeText?: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  durationInFrames: number;
}

export const HookScene: React.FC<HookSceneProps> = ({
  badgeText = "AI & TECH RADAR",
  title,
  subtitle,
  accentColor = "#38bdf8",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const badgeOpacity = spring({
    frame: frame - 5,
    fps,
  });

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
        {/* Animated Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 20px",
            borderRadius: 999,
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            border: `1px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}33`,
            marginBottom: 36,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
          <span
            style={{
              color: accentColor,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Big Bold Headline */}
        <h1
          style={{
            transform: `scale(${titleScale})`,
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.25,
            color: DARK_TECH_THEME.textPrimary,
            margin: 0,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {title}
        </h1>

        {/* Teaser Card */}
        <div
          style={{
            marginTop: 40,
            padding: "24px 32px",
            borderRadius: 20,
            backgroundColor: DARK_TECH_THEME.surface,
            border: `1px solid ${DARK_TECH_THEME.border}`,
            maxWidth: 880,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
            {subtitle}
          </p>
        </div>
      </div>

      <SubtitleSequence text={subtitle} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
