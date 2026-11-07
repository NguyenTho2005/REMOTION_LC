import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface FeatureHighlightProps {
  headline?: string;
  points?: string[];
  highlightText?: string;
  accentColor?: string;
  durationInFrames: number;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  headline = "Tính Năng Nổi Bật",
  points = [
    "Khả năng mở rộng linh hoạt",
    "Tương thích cao với hạ tầng đám mây",
    "Bảo mật cấp doanh nghiệp theo chuẩn quốc tế",
  ],
  highlightText = "",
  accentColor = "#34d399",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

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
            transform: `scale(${titleSpring})`,
            fontSize: 46,
            fontWeight: 900,
            color: DARK_TECH_THEME.textPrimary,
            textAlign: "center",
            margin: "0 0 36px 0",
          }}
        >
          {headline}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {points.map((point, idx) => {
            const itemSpring = spring({
              frame: frame - (idx + 1) * 8,
              fps,
              config: { damping: 14 },
            });

            return (
              <div
                key={point}
                style={{
                  transform: `scale(${Math.max(0, itemSpring)})`,
                  opacity: Math.max(0, Math.min(1, itemSpring)),
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "24px 28px",
                  borderRadius: 20,
                  backgroundColor: DARK_TECH_THEME.surface,
                  border: `1px solid ${DARK_TECH_THEME.border}`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: `${accentColor}25`,
                    border: `1px solid ${accentColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accentColor,
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  ★
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: DARK_TECH_THEME.textPrimary,
                    lineHeight: 1.35,
                  }}
                >
                  {point}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SubtitleSequence
        text={highlightText || points.join(" ")}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};
