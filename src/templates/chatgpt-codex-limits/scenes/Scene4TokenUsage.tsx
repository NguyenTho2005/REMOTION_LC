import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { ChatGPTIcon, CodexIcon, TokenCubeIcon } from "../components/BrandIcons";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene4TokenUsage: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Central pool expand
  const poolSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const poolScale = interpolate(poolSpring, [0, 1], [0.7, 1]);

  // Token filling progress
  const fillProgress = interpolate(frame, [15, 80], [0, 68], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Falling token cubes animations
  const token1Y = interpolate(frame, [10, 45], [-60, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const token2Y = interpolate(frame, [20, 55], [-60, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const token3Y = interpolate(frame, [30, 65], [-60, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        sceneNumber={4}
        totalScenes={9}
        category="KẾ HOẠCH MỚI — SHARED POOL"
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
          gap: 32,
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              color: "#38BDF8",
              borderRadius: 9999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            QUY ĐỔI BẰNG TOKEN
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: "#FFFFFF",
              marginTop: 14,
            }}
          >
            Một Hạn Mức Chung
          </div>
          <div
            style={{
              fontSize: 26,
              color: DESIGN_TOKENS.colors.textDarkSecondary,
              marginTop: 8,
              fontWeight: 500,
            }}
          >
            ChatGPT & Codex cùng trừ vào một bể token duy nhất
          </div>
        </div>

        {/* Source Inputs (Top Left: ChatGPT, Top Right: Codex) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 820,
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(16, 163, 127, 0.15)",
              border: "1.5px solid rgba(16, 163, 127, 0.4)",
              borderRadius: 20,
              padding: "10px 20px",
            }}
          >
            <ChatGPTIcon size={32} color="#10A37F" />
            <span style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>
              ChatGPT
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              border: "1.5px solid rgba(56, 189, 248, 0.4)",
              borderRadius: 20,
              padding: "10px 20px",
            }}
          >
            <CodexIcon size={32} color="#38BDF8" />
            <span style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>
              Codex
            </span>
          </div>
        </div>

        {/* Central Shared Token Pool Card */}
        <div
          style={{
            transform: `scale(${poolScale})`,
            width: "100%",
            maxWidth: 860,
            backgroundColor: DESIGN_TOKENS.colors.cardDark,
            border: "2.5px solid rgba(56, 189, 248, 0.35)",
            borderRadius: 36,
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            boxShadow: DESIGN_TOKENS.shadows.glowCyan,
            position: "relative",
          }}
        >
          {/* Falling token indicators */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "25%",
              transform: `translateY(${token1Y}px)`,
              opacity: token1Y > 200 ? 0 : 1,
            }}
          >
            <TokenCubeIcon size={32} color="#10A37F" />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "75%",
              transform: `translateY(${token2Y}px)`,
              opacity: token2Y > 200 ? 0 : 1,
            }}
          >
            <TokenCubeIcon size={32} color="#38BDF8" />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: `translateY(${token3Y}px)`,
              opacity: token3Y > 200 ? 0 : 1,
            }}
          >
            <TokenCubeIcon size={36} color="#F59E0B" />
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
            }}
          >
            SHARED TOKEN POOL
          </div>

          {/* Large Horizontal Usage Meter Bar */}
          <div
            style={{
              width: "100%",
              height: 56,
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderRadius: 28,
              border: "2px solid rgba(255, 255, 255, 0.15)",
              padding: 6,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fillProgress}%`,
                height: "100%",
                borderRadius: 22,
                background:
                  "linear-gradient(90deg, #10A37F 0%, #38BDF8 60%, #F59E0B 100%)",
                boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingRight: 16,
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {Math.round(fillProgress)}%
            </div>
          </div>

          {/* Metric details */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              color: DESIGN_TOKENS.colors.textDarkSecondary,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <span>Đo lường: Token động</span>
            <span style={{ color: "#38BDF8", fontWeight: 700 }}>
              Hợp nhất tài nguyên
            </span>
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#38BDF8" />
    </div>
  );
};
