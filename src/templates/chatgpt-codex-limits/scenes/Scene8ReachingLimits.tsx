import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN_TOKENS } from "../design-tokens";
import { HeaderBar } from "../components/HeaderBar";
import { KaraokeSubtitle, AlignedWord } from "../components/KaraokeSubtitle";

export interface SceneProps {
  words: AlignedWord[];
}

export const Scene8ReachingLimits: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root node spring
  const rootSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const rootScale = interpolate(rootSpring, [0, 1], [0.8, 1]);

  // 3 branch options staggered
  const branch1Spring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const branch2Spring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const branch3Spring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 12, stiffness: 120 },
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
        sceneNumber={8}
        totalScenes={9}
        category="KHI ĐẠT GIỚI HẠN — DECISION TREE"
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
        {/* Central Root Alert Node */}
        <div
          style={{
            transform: `scale(${rootScale})`,
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "2.5px solid rgba(239, 68, 68, 0.5)",
            borderRadius: 28,
            padding: "20px 40px",
            textAlign: "center",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#FCA5A5",
              letterSpacing: "0.08em",
            }}
          >
            TRẠNG THÁI
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#FFFFFF",
              marginTop: 4,
            }}
          >
            Đạt Giới Hạn Sử Dụng
          </div>
        </div>

        {/* 3 Decision Tree Branches */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: "100%",
            maxWidth: 860,
            marginTop: 10,
          }}
        >
          {/* Option 1: Wait for Reset */}
          <div
            style={{
              transform: `scale(${branch1Spring})`,
              backgroundColor: DESIGN_TOKENS.colors.cardDark,
              border: "2px solid rgba(56, 189, 248, 0.3)",
              borderRadius: 24,
              padding: "24px 30px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
              }}
            >
              ⏳
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
                1. Chờ Đặt Lại Chu Kỳ
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: DESIGN_TOKENS.colors.textDarkSecondary,
                  marginTop: 4,
                }}
              >
                Hạn mức tự động làm mới theo chu kỳ tài khoản
              </div>
            </div>
          </div>

          {/* Option 2: Upgrade Tier */}
          <div
            style={{
              transform: `scale(${branch2Spring})`,
              backgroundColor: DESIGN_TOKENS.colors.cardDark,
              border: "2px solid rgba(16, 163, 127, 0.4)",
              borderRadius: 24,
              padding: "24px 30px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: "rgba(16, 163, 127, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
              }}
            >
              🚀
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
                2. Nâng Cấp Gói Cao Hơn
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: DESIGN_TOKENS.colors.textDarkSecondary,
                  marginTop: 4,
                }}
              >
                Chuyển từ Plus lên Pro hoặc Business để nhận thêm dung lượng
              </div>
            </div>
          </div>

          {/* Option 3: Purchase Credits */}
          <div
            style={{
              transform: `scale(${branch3Spring})`,
              backgroundColor: DESIGN_TOKENS.colors.cardDark,
              border: "2px solid rgba(245, 158, 11, 0.4)",
              borderRadius: 24,
              padding: "24px 30px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
              }}
            >
              💳
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
                3. Mua Thêm Credit
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: DESIGN_TOKENS.colors.textDarkSecondary,
                  marginTop: 4,
                }}
              >
                Nạp thêm token credit cho các tính năng đủ điều kiện
              </div>
            </div>
          </div>
        </div>
      </div>

      <KaraokeSubtitle words={words} highlightColor="#F59E0B" />
    </div>
  );
};
