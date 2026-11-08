import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { PaperBackground } from "../components/PaperBackground";
import { TangledToOrderMetaphor } from "../components/HandDrawnProps";
import { CoherentDeskScene } from "../components/CoherentDeskScene";
import { MinhExpression, MinhPose } from "../character/MinhCharacter";

export const Act3TheArrivalOfAI: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 1200

  // Title Card animation
  const titleSpring = spring({
    frame: frame - 15,
    fps: 30,
    config: { damping: 14, stiffness: 100 },
  });
  const titleOpacity = interpolate(frame, [15, 35, 140, 170], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Minh's poses across Act 3
  let currentPose: MinhPose = "typing";
  let currentExpression: MinhExpression = "focused";

  if (frame < 300) {
    currentPose = "thinking";
    currentExpression = "thoughtful";
  } else if (frame < 650) {
    currentPose = "typing";
    currentExpression = "focused";
  } else if (frame < 950) {
    currentPose = "surprised";
    currentExpression = "surprised";
  } else {
    currentPose = "relaxed";
    currentExpression = "happy";
  }

  // Chat Box popup (frames 280 - 780)
  const showChatUI = frame >= 280 && frame <= 780;
  const chatSpring = spring({
    frame: frame - 280,
    fps: 30,
    config: { damping: 12, stiffness: 110 },
  });

  // Streaming text animation in chat (frames 420 - 720)
  const streamLength = interpolate(frame, [420, 680], [0, 85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fullText =
    "Chào bạn! Tôi có thể giúp bạn tóm tắt tài liệu, lên dàn ý chi tiết và viết code ngay bây giờ.";

  // Tangled to order metaphor progress (Shot 4: frames 800 - 1200)
  const metaphorProgress = interpolate(frame, [820, 1100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <PaperBackground ambient="morning" showGrid={true}>
        {/* Date Milestone Sticker (Shot 1: frames 20 - 280) */}
        {frame >= 20 && frame <= 280 && (
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 360,
              opacity: interpolate(frame, [20, 40, 250, 280], [0, 1, 1, 0]),
              zIndex: 30,
            }}
          >
            <div
              style={{
                backgroundColor: FILM_COLORS.warmYellow,
                border: `4px solid ${FILM_COLORS.ink}`,
                borderRadius: 24,
                padding: "16px 36px",
                boxShadow: `0 10px 24px ${FILM_COLORS.stickerShadow}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 32 }}>✨</span>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: FILM_COLORS.ink,
                  fontFamily: "sans-serif",
                }}
              >
                Cuối năm 2022 · Bước Ngoặt Lịch Sử
              </span>
            </div>
          </div>
        )}

        {/* Coherent Depth-Aware Desk Scene */}
        <CoherentDeskScene
          pose={currentPose}
          expression={currentExpression}
          laptopContent="chat"
          isLaptopOpen={true}
          coffeeSteam={true}
        >
          {/* Minimalist Generative Chat UI Sticker (Shot 2 & 3: frames 280 - 780) */}
          {showChatUI && (
            <div
              style={{
                position: "absolute",
                top: 130,
                right: 240,
                transform: `scale(${chatSpring})`,
                opacity: interpolate(frame, [280, 300, 750, 780], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  width: 520,
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.ink}`,
                  borderRadius: 24,
                  padding: "24px 28px",
                  boxShadow: `0 16px 36px ${FILM_COLORS.stickerShadow}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* User Prompt */}
                <div
                  style={{
                    alignSelf: "flex-end",
                    backgroundColor: FILM_COLORS.mutedBlue,
                    color: FILM_COLORS.stickerWhite,
                    borderRadius: "18px 18px 4px 18px",
                    padding: "12px 20px",
                    fontSize: 18,
                    fontWeight: 600,
                    maxWidth: "80%",
                    border: `2.5px solid ${FILM_COLORS.ink}`,
                  }}
                >
                  Tóm tắt giúp tôi tài liệu này bằng tiếng Việt tự nhiên nhé?
                </div>

                {/* AI Response */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: FILM_COLORS.warmYellow,
                      border: `2.5px solid ${FILM_COLORS.ink}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    AI
                  </div>
                  <div
                    style={{
                      backgroundColor: FILM_COLORS.paperDark,
                      border: `2.5px solid ${FILM_COLORS.ink}`,
                      borderRadius: "4px 18px 18px 18px",
                      padding: "14px 20px",
                      fontSize: 17,
                      lineHeight: 1.5,
                      color: FILM_COLORS.ink,
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    {fullText.slice(0, Math.round(streamLength))}
                    {streamLength < fullText.length && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 18,
                          backgroundColor: FILM_COLORS.warmYellow,
                          marginLeft: 4,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tangled to Order Visual Metaphor (Shot 4: frames 800 - 1200) */}
          {frame >= 800 && (
            <div
              style={{
                position: "absolute",
                top: 100,
                right: 220,
                zIndex: 35,
                opacity: interpolate(frame, [800, 830, 1170, 1200], [0, 1, 1, 0]),
              }}
            >
              <TangledToOrderMetaphor progress={metaphorProgress} scale={1.15} />
            </div>
          )}
        </CoherentDeskScene>

        {/* Act Title Card */}
        {frame < 200 && (
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 120,
              opacity: titleOpacity,
              transform: `translateY(${(1 - titleSpring) * -30}px)`,
              zIndex: 50,
            }}
          >
            <div
              style={{
                backgroundColor: FILM_COLORS.warmYellow,
                color: FILM_COLORS.ink,
                padding: "8px 24px",
                borderRadius: 12,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: "0.08em",
                border: `3px solid ${FILM_COLORS.ink}`,
                boxShadow: `0 6px 16px ${FILM_COLORS.stickerShadow}`,
                display: "inline-block",
              }}
            >
              HỒI 3 · SỰ XUẤT HIỆN CỦA AI PHỔ CẬP
            </div>
          </div>
        )}
      </PaperBackground>
    </div>
  );
};
