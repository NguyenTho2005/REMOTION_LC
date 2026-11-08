import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { ChatGPTIcon } from "../components/BrandIcons";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene6InstantException: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp slam down animation (elastic bounce)
  const stampSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 10, stiffness: 140 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [2.2, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 0.4, 1], [0, 0.8, 1]);

  // Chat bubble slide in
  const chatSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const chatY = interpolate(chatSpring, [0, 1], [60, 0]);

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
        sceneNumber={6}
        totalScenes={9}
        category="NGOẠI LỆ — EXCEPTION"
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
              fontSize: 54,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.25,
            }}
          >
            Chat Bình Thường Có Bị Tính?
          </div>
          <div
            style={{
              fontSize: 26,
              color: DESIGN_TOKENS.colors.textDarkSecondary,
              marginTop: 10,
              fontWeight: 500,
            }}
          >
            Tin vui cho người dùng nhắn tin hỏi đáp hàng ngày
          </div>
        </div>

        {/* Minimal Chat Dialogue Simulation Card */}
        <div
          style={{
            transform: `translateY(${chatY}px)`,
            width: "100%",
            maxWidth: 860,
            backgroundColor: DESIGN_TOKENS.colors.cardDark,
            borderRadius: 32,
            border: "2px solid rgba(255, 255, 255, 0.1)",
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            boxShadow: DESIGN_TOKENS.shadows.cardDark,
            position: "relative",
          }}
        >
          {/* User Chat Bubble */}
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              borderRadius: "20px 20px 4px 20px",
              padding: "16px 24px",
              fontSize: 24,
              fontWeight: 600,
              maxWidth: "75%",
            }}
          >
            Tóm tắt tin tức công nghệ hôm nay giúp tôi?
          </div>

          {/* AI Response Bubble */}
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              gap: 16,
              maxWidth: "85%",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "rgba(16, 163, 127, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <ChatGPTIcon size={30} color="#10A37F" />
            </div>
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#E2E8F0",
                borderRadius: "4px 20px 20px 20px",
                padding: "18px 24px",
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              ChatGPT Instant phản hồi siêu tốc...
            </div>
          </div>

          {/* Large Excused Stamp Slammed on top */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${stampScale}) rotate(-6deg)`,
              opacity: stampOpacity,
              backgroundColor: "rgba(16, 163, 127, 0.95)",
              color: "#FFFFFF",
              border: "4px solid #34D399",
              borderRadius: 24,
              padding: "20px 36px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(16, 163, 127, 0.6)",
              zIndex: 30,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: "#A7F3D0",
              }}
            >
              CHATGPT INSTANT
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                letterSpacing: "0.04em",
                marginTop: 4,
                whiteSpace: "nowrap",
              }}
            >
              KHÔNG TRỪ HẠN MỨC!
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#ECFDF5",
                marginTop: 6,
              }}
            >
              0 Token Deducted • Hoàn toàn độc lập
            </div>
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#34D399" />
    </div>
  );
};
