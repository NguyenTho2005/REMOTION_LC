import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { PaperBackground } from "../components/PaperBackground";
import { HandDrawnWindow } from "../components/HandDrawnProps";
import { CoherentDeskScene } from "../components/CoherentDeskScene";
import { MinhExpression, MinhPose } from "../character/MinhCharacter";

export const Act6TheHumanChoice: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 1350

  // Title Card animation
  const titleSpring = spring({
    frame: frame - 15,
    fps: 30,
    config: { damping: 14, stiffness: 100 },
  });
  const titleOpacity = interpolate(frame, [15, 35, 120, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Minh's poses across Act 6
  let currentPose: MinhPose = "thinking";
  let currentExpression: MinhExpression = "thoughtful";

  if (frame < 350) {
    // Mindful reflection
    currentPose = "thinking";
    currentExpression = "thoughtful";
  } else if (frame < 750) {
    // Peaceful coffee sip & confident smile
    currentPose = "relaxed";
    currentExpression = "happy";
  } else if (frame < 1050) {
    // Balanced focus writing in notebook
    currentPose = "writing";
    currentExpression = "focused";
  } else {
    // Standing or sitting with warm peace
    currentPose = "relaxed";
    currentExpression = "happy";
  }

  // Camera slow pull-back for grand finale (frames 1000 - 1350)
  const cameraScale = interpolate(frame, [900, 1350], [1.0, 0.90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final Calligraphy Quote (frames 950 - 1350)
  const quoteSpring = spring({
    frame: frame - 960,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      <PaperBackground ambient="morning" showGrid={true}>
        {/* Environment: Morning Sunrise Window */}
        <div style={{ position: "absolute", top: 80, right: 280, zIndex: 10 }}>
          <HandDrawnWindow timeOfDay="morning" scale={1.15} />
        </div>

        {/* Coherent Depth-Aware Desk Scene */}
        <CoherentDeskScene
          pose={currentPose}
          expression={currentExpression}
          laptopContent="code"
          isLaptopOpen={true}
          coffeeSteam={true}
        >
          {/* Philosophy Card 1: Empathy & Heart (frames 350 - 680) */}
          {frame >= 350 && frame <= 680 && (
            <div
              style={{
                position: "absolute",
                top: 150,
                left: 420,
                opacity: interpolate(frame, [350, 380, 650, 680], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.ink}`,
                  borderRadius: 24,
                  padding: "20px 40px",
                  boxShadow: `0 14px 32px ${FILM_COLORS.stickerShadow}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 800, color: FILM_COLORS.coral }}>
                  ❤️ Trái Tim &amp; Cảm Xúc Con Người
                </div>
                <div style={{ fontSize: 18, color: FILM_COLORS.inkSubtle, maxWidth: 600 }}>
                  AI có thể viết 10.000 dòng code, nhưng chỉ có bạn mới hiểu đâu là điều làm rung động trái tim người dùng.
                </div>
              </div>
            </div>
          )}

          {/* Philosophy Card 2: Before & After AI (frames 690 - 940) */}
          {frame >= 690 && frame <= 940 && (
            <div
              style={{
                position: "absolute",
                top: 140,
                left: 400,
                opacity: interpolate(frame, [690, 720, 910, 940], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    backgroundColor: FILM_COLORS.stickerWhite,
                    border: `4px solid ${FILM_COLORS.ink}`,
                    borderRadius: 20,
                    padding: "16px 28px",
                    boxShadow: `0 10px 24px ${FILM_COLORS.stickerShadow}`,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: FILM_COLORS.inkSubtle }}>
                    TRƯỚC AI
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: FILM_COLORS.coral, marginTop: 4 }}>
                    Kiên Nhẫn Thủ Công
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: FILM_COLORS.warmYellow,
                    border: `4px solid ${FILM_COLORS.ink}`,
                    borderRadius: 20,
                    padding: "16px 28px",
                    boxShadow: `0 10px 24px ${FILM_COLORS.stickerShadow}`,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: FILM_COLORS.inkSubtle }}>
                    SAU AI
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: FILM_COLORS.ink, marginTop: 4 }}>
                    Thông Tuệ Sáng Tạo
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final Grand Closing Quote (frames 950 - 1350) */}
          {frame >= 950 && (
            <div
              style={{
                position: "absolute",
                top: 120,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                transform: `scale(${quoteSpring})`,
                opacity: interpolate(frame, [950, 980], [0, 1]),
                zIndex: 45,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `5px solid ${FILM_COLORS.ink}`,
                  borderRadius: 32,
                  padding: "36px 64px",
                  boxShadow: `0 24px 60px ${FILM_COLORS.stickerShadow}`,
                  textAlign: "center",
                  maxWidth: 1100,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: FILM_COLORS.coral,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Thông Điệp Cuối Cùng
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: FILM_COLORS.ink,
                    lineHeight: 1.45,
                    fontFamily: "sans-serif",
                  }}
                >
                  &ldquo;Công nghệ thay đổi thế giới,
                  <br />
                  <span style={{ color: "#D97706" }}>
                    nhưng chính BẠN mới là người quyết định thế giới đó sẽ đi về đâu.&rdquo;
                  </span>
                </div>
              </div>
            </div>
          )}
        </CoherentDeskScene>

        {/* Act Title Card */}
        {frame < 180 && (
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
              HỒI 6 · LỰA CHỌN CỦA CON NGƯỜI
            </div>
          </div>
        )}
      </PaperBackground>
    </div>
  );
};
