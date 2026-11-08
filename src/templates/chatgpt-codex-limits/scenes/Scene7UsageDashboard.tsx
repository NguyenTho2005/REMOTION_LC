import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene7UsageDashboard: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dialog slide up
  const uiSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const uiY = interpolate(uiSpring, [0, 1], [80, 0]);

  // Gauge fill animation
  const gaugeFill = interpolate(frame, [20, 75], [0, 68], {
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
        sceneNumber={7}
        totalScenes={9}
        category="KIỂM TRA HẠN MỨC (SETTINGS)"
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
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              color: "#0284C7",
              borderRadius: 9999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            QUẢN LÝ TÀI KHOẢN
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: DESIGN_TOKENS.colors.textLightPrimary,
              marginTop: 14,
              lineHeight: 1.25,
            }}
          >
            Settings &gt; Usage
          </div>
          <div
            style={{
              fontSize: 26,
              color: DESIGN_TOKENS.colors.textLightSecondary,
              marginTop: 8,
              fontWeight: 500,
            }}
          >
            Nơi theo dõi hạn mức còn lại và chu kỳ đặt lại
          </div>
        </div>

        {/* Mock Settings Interface Card */}
        <div
          style={{
            transform: `translateY(${uiY}px)`,
            width: "100%",
            maxWidth: 880,
            backgroundColor: "#FFFFFF",
            borderRadius: 32,
            border: "2px solid #E2E8F0",
            boxShadow: DESIGN_TOKENS.shadows.softLight,
            padding: "36px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Breadcrumb Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1.5px solid #F1F5F9",
              paddingBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              Cài đặt (Settings)
            </div>
            <div style={{ color: "#CBD5E1", fontSize: 20 }}>/</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#0284C7",
                backgroundColor: "rgba(2, 132, 199, 0.1)",
                padding: "4px 14px",
                borderRadius: 8,
              }}
            >
              Usage (Mức sử dụng)
            </div>
          </div>

          {/* Remaining Allowance Card */}
          <div
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 24,
              padding: "24px 28px",
              border: "1.5px solid #E2E8F0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>
                Hạn mức còn lại (Remaining)
              </span>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#0284C7",
                }}
              >
                {Math.round(gaugeFill)}%
              </span>
            </div>

            <div
              style={{
                height: 20,
                backgroundColor: "#E2E8F0",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${gaugeFill}%`,
                  backgroundColor: "#0284C7",
                  borderRadius: 10,
                }}
              />
            </div>
          </div>

          {/* Reset Time Card */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(16, 163, 127, 0.08)",
              border: "1.5px solid rgba(16, 163, 127, 0.25)",
              borderRadius: 24,
              padding: "20px 28px",
            }}
          >
            <div>
              <div style={{ fontSize: 20, color: "#0F766E", fontWeight: 600 }}>
                Thời gian đặt lại chu kỳ:
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#0F766E",
                  marginTop: 4,
                }}
              >
                Resets in: 2 days 14 hours
              </div>
            </div>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#10A37F",
                boxShadow: "0 0 10px #10A37F",
              }}
            />
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#0284C7" />
    </div>
  );
};
