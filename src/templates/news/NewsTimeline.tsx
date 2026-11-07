import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface TimelineEvent {
  step: string;
  detail: string;
}

export interface NewsTimelineProps {
  title?: string;
  events?: TimelineEvent[];
  accentColor?: string;
  durationInFrames: number;
}

export const NewsTimeline: React.FC<NewsTimelineProps> = ({
  title = "Diễn Biến Chính",
  events = [
    { step: "Điểm 1", detail: "Phát hành bản thử nghiệm đầu tiên cho cộng đồng lập trình viên." },
    { step: "Điểm 2", detail: "Tăng hiệu năng xử lý gấp đôi so với phiên bản tiền nhiệm." },
    { step: "Điểm 3", detail: "Chính thức triển khai trên diện rộng cho tất cả người dùng." },
  ],
  accentColor = "#f59e0b",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summaryText = events.map((e) => e.detail).join(" ");

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
            fontSize: 44,
            fontWeight: 900,
            color: DARK_TECH_THEME.textPrimary,
            textAlign: "center",
            margin: "0 0 36px 0",
          }}
        >
          {title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {events.map((event, idx) => {
            const itemSpring = spring({
              frame: frame - idx * 10,
              fps,
              config: { damping: 12 },
            });

            return (
              <div
                key={event.step}
                style={{
                  transform: `scale(${Math.max(0, itemSpring)})`,
                  opacity: Math.max(0, Math.min(1, itemSpring)),
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  padding: "24px 28px",
                  borderRadius: 18,
                  backgroundColor: DARK_TECH_THEME.surface,
                  border: `1px solid ${DARK_TECH_THEME.border}`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    minWidth: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: `${accentColor}25`,
                    border: `1px solid ${accentColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accentColor,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: accentColor,
                      marginBottom: 6,
                    }}
                  >
                    {event.step}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      color: DARK_TECH_THEME.textSecondary,
                      lineHeight: 1.4,
                    }}
                  >
                    {event.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SubtitleSequence text={summaryText} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
