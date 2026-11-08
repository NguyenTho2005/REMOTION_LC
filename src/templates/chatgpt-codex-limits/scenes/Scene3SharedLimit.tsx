import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { ChatGPTIcon, CodexIcon } from "../components/BrandIcons";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene3SharedLimit: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic "NGHĨA LÀ SAO?" slam-zoom
  const textSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const textScale = interpolate(textSpring, [0, 1], [0.6, 1]);

  // Dual columns grow from bottom
  const colSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const colHeight = interpolate(colSpring, [0, 1], [0, 260]);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: DESIGN_TOKENS.colors.bgDark,
        position: "relative",
        overflow: "hidden",
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      <HeaderBar
        sceneNumber={3}
        totalScenes={9}
        category="CƠ CHẾ CŨ (BEFORE)"
        theme="dark"
      />

      <div
        style={{
          position: "absolute",
          top: 310,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Kinetic Header */}
        <div
          style={{
            transform: `scale(${textScale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: "#F59E0B",
              letterSpacing: "-0.02em",
            }}
          >
            Nghĩa là sao?
          </div>
          <div
            style={{
              fontSize: 28,
              color: DESIGN_TOKENS.colors.textDarkSecondary,
              marginTop: 10,
              fontWeight: 500,
            }}
          >
            Trước đây: Hai hệ thống giới hạn hoàn toàn tách biệt
          </div>
        </div>

        {/* Dual Separated Columns Container */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 40,
            marginTop: 20,
            padding: "40px 30px",
            backgroundColor: DESIGN_TOKENS.colors.cardDark,
            borderRadius: 36,
            border: "2px solid rgba(255, 255, 255, 0.08)",
            boxShadow: DESIGN_TOKENS.shadows.cardDark,
            position: "relative",
          }}
        >
          {/* Dashed Separator Line with Lock Icon */}
          <div
            style={{
              position: "absolute",
              top: 40,
              bottom: 40,
              left: "50%",
              width: 2,
              borderLeft: "2px dashed rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#1E293B",
                border: "1.5px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: 16,
                fontWeight: 700,
                color: "#94A3B8",
                whiteSpace: "nowrap",
                transform: "translateX(-50%)",
              }}
            >
              RIÊNG BIỆT
            </div>
          </div>

          {/* Left Column: ChatGPT Usage */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ChatGPTIcon size={40} color="#10A37F" />
              <span style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
                ChatGPT
              </span>
            </div>

            {/* Vertical Usage Meter */}
            <div
              style={{
                width: 140,
                height: 280,
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderRadius: 24,
                border: "2px solid rgba(16, 163, 127, 0.3)",
                padding: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: colHeight,
                  width: "100%",
                  backgroundColor: "rgba(16, 163, 127, 0.85)",
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                100%
              </div>
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#94A3B8",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Hạn mức độc lập
            </div>
          </div>

          {/* Right Column: Codex Usage */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CodexIcon size={40} color="#38BDF8" />
              <span style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
                Codex
              </span>
            </div>

            {/* Vertical Usage Meter */}
            <div
              style={{
                width: 140,
                height: 280,
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderRadius: 24,
                border: "2px solid rgba(56, 189, 248, 0.3)",
                padding: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: colHeight * 0.85,
                  width: "100%",
                  backgroundColor: "rgba(56, 189, 248, 0.85)",
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                100%
              </div>
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#94A3B8",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Hạn mức độc lập
            </div>
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#F59E0B" />
    </div>
  );
};
