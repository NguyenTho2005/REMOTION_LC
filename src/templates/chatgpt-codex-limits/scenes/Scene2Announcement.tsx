import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene2Announcement: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline slider pointer animation
  const sliderSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const pointerX = interpolate(sliderSpring, [0, 1], [-220, 220]);

  // Plan cards staggered pop
  const card1Spring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const card2Spring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const card3Spring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 12, stiffness: 120 },
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
        sceneNumber={2}
        totalScenes={9}
        category="TIMELINE & GÓI ÁP DỤNG"
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
          gap: 36,
        }}
      >
        {/* Editorial Subheader */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              backgroundColor: "rgba(16, 163, 127, 0.12)",
              color: "#0F766E",
              borderRadius: 9999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Kế Hoạch Công Bố
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: DESIGN_TOKENS.colors.textLightPrimary,
              marginTop: 16,
              lineHeight: 1.25,
            }}
          >
            Tháng 12 / 2026
          </div>
          <div
            style={{
              fontSize: 28,
              color: DESIGN_TOKENS.colors.textLightSecondary,
              marginTop: 8,
              fontWeight: 500,
            }}
          >
            OpenAI dự kiến hợp nhất hạn mức sử dụng
          </div>
        </div>

        {/* Interactive Timeline Calendar Slider */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            backgroundColor: "#FFFFFF",
            borderRadius: 32,
            border: "2px solid rgba(15, 23, 42, 0.08)",
            boxShadow: DESIGN_TOKENS.shadows.softLight,
            padding: "36px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* Months Track */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              position: "relative",
            }}
          >
            {/* Nov Node */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#94A3B8",
                }}
              >
                Tháng 11
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "#CBD5E1",
                  fontWeight: 500,
                }}
              >
                Hạn mức riêng
              </div>
            </div>

            {/* Middle Connecting Arrow */}
            <div
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "#E2E8F0",
                margin: "0 24px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: `translateX(${pointerX}px)`,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#10A37F",
                  boxShadow: "0 0 14px rgba(16, 163, 127, 0.6)",
                }}
              />
            </div>

            {/* Dec Target Node */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(16, 163, 127, 0.1)",
                border: "2px solid rgba(16, 163, 127, 0.4)",
                borderRadius: 20,
                padding: "12px 24px",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#0F766E",
                }}
              >
                Tháng 12
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#10A37F",
                }}
              >
                DÙNG CHUNG
              </div>
            </div>
          </div>
        </div>

        {/* 3 Applicable Plans */}
        <div style={{ width: "100%", maxWidth: 880 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: DESIGN_TOKENS.colors.textLightSecondary,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Áp dụng đối với các gói:
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            {/* Plus Card */}
            <div
              style={{
                transform: `scale(${card1Spring})`,
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: "24px 16px",
                textAlign: "center",
                border: "2px solid #E2E8F0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>
                Plus
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#10A37F",
                  marginTop: 6,
                }}
              >
                $20 / tháng
              </div>
            </div>

            {/* Pro Card (Hero) */}
            <div
              style={{
                transform: `scale(${card2Spring})`,
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: "24px 16px",
                textAlign: "center",
                border: "2.5px solid #38BDF8",
                boxShadow: "0 12px 28px rgba(56, 189, 248, 0.15)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#0284C7",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: 999,
                  letterSpacing: "0.06em",
                }}
              >
                POPULAR
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>
                Pro
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#0284C7",
                  marginTop: 6,
                }}
              >
                $200 / tháng
              </div>
            </div>

            {/* Business Card */}
            <div
              style={{
                transform: `scale(${card3Spring})`,
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: "24px 16px",
                textAlign: "center",
                border: "2px solid #E2E8F0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>
                Business
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#64748B",
                  marginTop: 6,
                }}
              >
                Team Workspace
              </div>
            </div>
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#0F766E" />
    </div>
  );
};
