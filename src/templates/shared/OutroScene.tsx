import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "./BackgroundEffects";
import { SubtitleSequence } from "./SubtitleSequence";

export interface OutroSceneProps {
  callToAction: string;
  channelName?: string;
  tags?: string[];
  accentColor?: string;
  durationInFrames: number;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  callToAction,
  channelName = "Tech Pulse Vietnam",
  tags = ["#CongNghe", "#AI", "#LapTrinh"],
  accentColor = "#ec4899",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <BackgroundEffects glowColor={accentColor} />

      <div
        style={{
          position: "absolute",
          top: 240,
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
            padding: "48px 40px",
            borderRadius: 28,
            backgroundColor: DARK_TECH_THEME.surface,
            border: `2px solid ${accentColor}`,
            boxShadow: `0 12px 40px ${accentColor}25`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 900,
          }}
        >
          {/* Avatar / Logo Circle */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}, #818cf8)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              boxShadow: `0 0 25px ${accentColor}66`,
              marginBottom: 24,
            }}
          >
            ⚡
          </div>

          <h2
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: DARK_TECH_THEME.textPrimary,
              margin: "0 0 12px 0",
            }}
          >
            {channelName}
          </h2>

          <p
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: DARK_TECH_THEME.textSecondary,
              margin: "0 0 32px 0",
              lineHeight: 1.4,
            }}
          >
            {callToAction}
          </p>

          {/* Follow Button Simulator */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 40px",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${accentColor}, #f43f5e)`,
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 1,
              boxShadow: "0 8px 25px rgba(236, 72, 153, 0.5)",
              textTransform: "uppercase",
            }}
          >
            <span>+ Follow Ngay</span>
          </div>

          {/* Hashtags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 36,
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "6px 16px",
                  borderRadius: 12,
                  backgroundColor: DARK_TECH_THEME.surfaceLight,
                  color: DARK_TECH_THEME.accentCyan,
                  fontSize: 20,
                  fontWeight: 600,
                  border: `1px solid ${DARK_TECH_THEME.border}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SubtitleSequence text={callToAction} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
