import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { DARK_TECH_THEME } from "../../engines/VisualEngine";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface Pillar {
  title: string;
  description: string;
  icon?: string;
}

export interface AIConceptSceneProps {
  conceptTitle: string;
  summary: string;
  pillars?: Pillar[];
  accentColor?: string;
  durationInFrames: number;
}

export const AIConceptScene: React.FC<AIConceptSceneProps> = ({
  conceptTitle,
  summary,
  pillars = [
    { title: "Nhận thức (Perception)", description: "Tiếp nhận prompt và quan sát môi trường" },
    { title: "Lập kế hoạch (Planning)", description: "Phân rã mục tiêu thành các bước khả thi" },
    { title: "Công cụ (Tools)", description: "Tìm kiếm web, chạy code, gọi API" },
    { title: "Hành động (Action)", description: "Thực thi tác vụ và tự kiểm tra kết quả" },
  ],
  accentColor = "#8b5cf6",
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
        <div
          style={{
            transform: `scale(${titleSpring})`,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: accentColor,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            KIẾN TRÚC CỐT LÕI
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: DARK_TECH_THEME.textPrimary,
              margin: 0,
            }}
          >
            {conceptTitle}
          </h2>
        </div>

        {/* 4 Pillars Grid (2x2) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {pillars.map((pillar, idx) => {
            const itemSpring = spring({
              frame: frame - (idx + 1) * 8,
              fps,
              config: { damping: 14 },
            });

            return (
              <div
                key={pillar.title}
                style={{
                  transform: `scale(${Math.max(0, itemSpring)})`,
                  opacity: Math.max(0, Math.min(1, itemSpring)),
                  padding: "24px 20px",
                  borderRadius: 20,
                  backgroundColor: DARK_TECH_THEME.surface,
                  border: `1px solid ${DARK_TECH_THEME.border}`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: DARK_TECH_THEME.accentCyan,
                    marginBottom: 10,
                  }}
                >
                  {pillar.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: DARK_TECH_THEME.textSecondary,
                    lineHeight: 1.35,
                  }}
                >
                  {pillar.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SubtitleSequence text={summary} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
