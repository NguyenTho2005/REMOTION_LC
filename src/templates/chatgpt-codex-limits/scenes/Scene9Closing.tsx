import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { OpenAILogo } from "../components/BrandIcons";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene9Closing: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Disclaimer slide in
  const disclaimerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const disclaimerY = interpolate(disclaimerSpring, [0, 1], [-40, 0]);

  // Checklist items staggered
  const item1Spring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const item2Spring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const item3Spring = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Outro logo pop
  const logoSpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);

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
        sceneNumber={9}
        totalScenes={9}
        category="TỔNG KẾT & LỜI KHUYÊN"
        theme="dark"
      />

      <div
        style={{
          position: "absolute",
          top: 290,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Important Disclaimer Banner */}
        <div
          style={{
            transform: `translateY(${disclaimerY}px)`,
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            border: "2px solid rgba(245, 158, 11, 0.4)",
            borderRadius: 24,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            maxWidth: 880,
          }}
        >
          <span style={{ fontSize: 32 }}>⚠️</span>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#FBBF24",
                letterSpacing: "0.04em",
              }}
            >
              LƯU Ý BIÊN TẬP
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#FDE68A",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Kế hoạch công bố cho tháng 12, chưa áp dụng đồng loạt ngay lúc này.
            </div>
          </div>
        </div>

        {/* Developer Action Checklist */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            backgroundColor: DESIGN_TOKENS.colors.cardDark,
            borderRadius: 32,
            border: "2px solid rgba(56, 189, 248, 0.25)",
            padding: "32px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#38BDF8",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Checklist Cho Lập Trình Viên (Dev)
          </div>

          {/* Item 1 */}
          <div
            style={{
              transform: `scale(${item1Spring})`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 18,
              padding: "14px 20px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#10A37F",
                color: "#FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
              Kiểm tra mức dùng hiện tại trong Settings &gt; Usage
            </div>
          </div>

          {/* Item 2 */}
          <div
            style={{
              transform: `scale(${item2Spring})`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 18,
              padding: "14px 20px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#10A37F",
                color: "#FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
              Đánh giá tỷ trọng giữa Codex coding và ChatGPT
            </div>
          </div>

          {/* Item 3 */}
          <div
            style={{
              transform: `scale(${item3Spring})`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 18,
              padding: "14px 20px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#10A37F",
                color: "#FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
              Chuẩn bị kế hoạch gói cước trước khi thay đổi có hiệu lực
            </div>
          </div>
        </div>

        {/* Outro OpenAI Seal */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginTop: 10,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OpenAILogo size={48} color="#FFFFFF" />
          </div>
          <div
            style={{
              fontSize: 22,
              color: DESIGN_TOKENS.colors.textDarkSecondary,
              fontWeight: 600,
            }}
          >
            Theo dõi kênh để nhận tin tức công nghệ mới nhất!
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#38BDF8" />
    </div>
  );
};
