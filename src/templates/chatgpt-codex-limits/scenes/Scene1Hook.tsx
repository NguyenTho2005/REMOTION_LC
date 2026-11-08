import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { ChatGPTIcon, CodexIcon } from "../components/BrandIcons";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene1Hook: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for ChatGPT card (from left)
  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const leftX = interpolate(leftSlide, [0, 1], [-500, 0]);

  // Entrance spring for Codex card (from right)
  const rightSlide = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const rightX = interpolate(rightSlide, [0, 1], [500, 0]);

  // Question mark pop
  const qSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const qScale = interpolate(qSpring, [0, 1], [0, 1]);

  // Alert pill pop (at frame 50)
  const alertSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const alertScale = interpolate(alertSpring, [0, 1], [0, 1]);

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
      <HeaderBar sceneNumber={1} totalScenes={9} theme="dark" />

      {/* Center Action Container */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Urgent Alert Badge */}
        <div
          style={{
            transform: `scale(${alertScale})`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "2px solid rgba(239, 68, 68, 0.4)",
            borderRadius: DESIGN_TOKENS.layout.borderRadius.pill,
            padding: "12px 28px",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#EF4444",
              boxShadow: "0 0 12px #EF4444",
            }}
          />
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "#FCA5A5",
              textTransform: "uppercase",
            }}
          >
            OpenAI Important Update
          </span>
        </div>

        {/* Duo Cards Showcase */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 36,
            marginTop: 20,
            width: "100%",
          }}
        >
          {/* ChatGPT Card */}
          <div
            style={{
              transform: `translateX(${leftX}px)`,
              flex: 1,
              maxWidth: 420,
              backgroundColor: DESIGN_TOKENS.colors.cardDark,
              border: `2px solid rgba(16, 163, 127, 0.4)`,
              borderRadius: 32,
              padding: "44px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              boxShadow: DESIGN_TOKENS.shadows.glowGreen,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 28,
                backgroundColor: "rgba(16, 163, 127, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChatGPTIcon size={64} color="#10A37F" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                ChatGPT
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: DESIGN_TOKENS.colors.textDarkSecondary,
                  marginTop: 6,
                }}
              >
                Chat & Reasoning
              </div>
            </div>
          </div>

          {/* Plus / Question Center connector */}
          <div
            style={{
              transform: `scale(${qScale})`,
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#38BDF8",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            +
          </div>

          {/* Codex Card */}
          <div
            style={{
              transform: `translateX(${rightX}px)`,
              flex: 1,
              maxWidth: 420,
              backgroundColor: DESIGN_TOKENS.colors.cardDark,
              border: `2px solid rgba(56, 189, 248, 0.4)`,
              borderRadius: 32,
              padding: "44px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              boxShadow: DESIGN_TOKENS.shadows.glowCyan,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 28,
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CodexIcon size={64} color="#38BDF8" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                Codex
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: DESIGN_TOKENS.colors.textDarkSecondary,
                  marginTop: 6,
                }}
              >
                Coding & Agents
              </div>
            </div>
          </div>
        </div>

        {/* Big Kinetic Headline */}
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: DESIGN_TOKENS.typography.sizes.h1,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.25,
            }}
          >
            Bạn dùng cả hai{" "}
            <span
              style={{
                color: "#38BDF8",
                textDecoration: "underline",
                textUnderlineOffset: 12,
              }}
            >
              mỗi ngày?
            </span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: DESIGN_TOKENS.colors.textDarkSecondary,
              marginTop: 18,
              fontWeight: 500,
            }}
          >
            Thay đổi lớn về cơ chế tính hạn mức đang đến
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#38BDF8" />
    </div>
  );
};
