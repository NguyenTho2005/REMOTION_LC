import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene5TaskComplexity: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const leftCardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const rightCardSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Fast drain animation on right side
  const fastDrain = interpolate(frame, [25, 120], [10, 85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slow drain animation on left side
  const slowDrain = interpolate(frame, [25, 120], [5, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: DESIGN_TOKENS.colors.bgLight,
        position: "relative",
        overflow: "hidden",
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      <HeaderBar
        sceneNumber={5}
        totalScenes={9}
        category="MỨC ĐỘ TIÊU HAO TOKEN"
        theme="light"
      />

      <div
        style={{
          position: "absolute",
          top: 300,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Editorial Heading */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#DC2626",
              borderRadius: 9999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ĐIỂM ĐÁNG CHÚ Ý
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: DESIGN_TOKENS.colors.textLightPrimary,
              marginTop: 14,
              lineHeight: 1.25,
            }}
          >
            Độ Phức Tạp Của Tác Vụ
          </div>
          <div
            style={{
              fontSize: 26,
              color: DESIGN_TOKENS.colors.textLightSecondary,
              marginTop: 8,
              fontWeight: 500,
            }}
          >
            Model càng mạnh & tác vụ càng nặng → Tiêu hao càng nhanh
          </div>
        </div>

        {/* Split Comparison Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            width: "100%",
            maxWidth: 900,
          }}
        >
          {/* Left Card: Simple Task */}
          <div
            style={{
              transform: `scale(${leftCardSpring})`,
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 28,
              border: "2px solid #E2E8F0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                padding: "6px 14px",
                backgroundColor: "rgba(16, 163, 127, 0.12)",
                color: "#0F766E",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              TIÊU HAO THẤP (1x)
            </div>

            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>
                Tác vụ đơn giản
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "#64748B",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                Hỏi đáp ngắn, tra cứu cơ bản, model nhẹ
              </div>
            </div>

            {/* Consumption Bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#64748B",
                  marginBottom: 8,
                }}
              >
                <span>Mức trừ token</span>
                <span style={{ color: "#10A37F" }}>{Math.round(slowDrain)}%</span>
              </div>
              <div
                style={{
                  height: 16,
                  backgroundColor: "#F1F5F9",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${slowDrain}%`,
                    backgroundColor: "#10A37F",
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Card: Complex Task */}
          <div
            style={{
              transform: `scale(${rightCardSpring})`,
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 28,
              border: "2.5px solid rgba(239, 68, 68, 0.4)",
              boxShadow: "0 16px 36px rgba(239, 68, 68, 0.12)",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                padding: "6px 14px",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "#DC2626",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              TIÊU HAO CAO (5x - 10x)
            </div>

            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>
                Tác vụ phức tạp
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "#64748B",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                Codex refactor cả repo, reasoning o1/o3, multi-agent
              </div>
            </div>

            {/* Consumption Bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#64748B",
                  marginBottom: 8,
                }}
              >
                <span>Mức trừ token</span>
                <span style={{ color: "#EF4444", fontWeight: 800 }}>
                  {Math.round(fastDrain)}% (Nhanh)
                </span>
              </div>
              <div
                style={{
                  height: 16,
                  backgroundColor: "#F1F5F9",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${fastDrain}%`,
                    backgroundColor: "#EF4444",
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#DC2626" />
    </div>
  );
};
