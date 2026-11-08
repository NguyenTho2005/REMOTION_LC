import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { PaperBackground } from "../components/PaperBackground";
import { AlertBadge } from "../components/HandDrawnProps";
import { CoherentDeskScene } from "../components/CoherentDeskScene";
import { MinhExpression, MinhPose } from "../character/MinhCharacter";

export const Act5TheUnexpectedProblem: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 1650

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

  // Minh's poses across Act 5
  let currentPose: MinhPose = "typing";
  let currentExpression: MinhExpression = "confused";
  const isLaptopOpen = frame < 1380;

  if (frame < 450) {
    // Shot 1: Passive copying / lười suy nghĩ
    currentPose = "typing";
    currentExpression = "confused";
  } else if (frame < 900) {
    // Shot 2: Hallucination shock in meeting
    currentPose = "surprised";
    currentExpression = "frustrated";
  } else if (frame < 1380) {
    // Shot 3: Overload & existential question
    currentPose = "frustrated";
    currentExpression = "exhausted";
  } else {
    // Shot 4: The 7-second deliberate pause - Minh closed laptop and sits pensively
    currentPose = "relaxed";
    currentExpression = "thoughtful";
  }

  // Hallucination Alert Spring (Shot 2: frames 450 - 900)
  const alertSpring = spring({
    frame: frame - 460,
    fps: 30,
    config: { damping: 10, stiffness: 120 },
  });

  // Camera pull-back on the 7-second pause (frames 1380 - 1650)
  const cameraScale = interpolate(frame, [1380, 1650], [1.0, 0.94], {
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
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      <PaperBackground ambient={frame > 1380 ? "night" : "neutral"} showGrid={true}>
        {/* Coherent Depth-Aware Desk Scene */}
        <CoherentDeskScene
          pose={currentPose}
          expression={currentExpression}
          laptopContent="blank"
          isLaptopOpen={isLaptopOpen}
          coffeeSteam={false}
        >
          {/* Shortcut Copy-Paste stamps (Shot 1: frames 80 - 450) */}
          {frame >= 80 && frame <= 450 && (
            <div
              style={{
                position: "absolute",
                top: 140,
                left: 420,
                opacity: interpolate(frame, [80, 110, 420, 450], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.coral}`,
                  borderRadius: 20,
                  padding: "16px 32px",
                  boxShadow: `0 10px 24px ${FILM_COLORS.stickerShadow}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    backgroundColor: FILM_COLORS.coral,
                    color: FILM_COLORS.stickerWhite,
                    fontWeight: 900,
                    fontSize: 20,
                    padding: "6px 14px",
                    borderRadius: 8,
                  }}
                >
                  Ctrl + C &gt; Ctrl + V
                </span>
                <span style={{ fontSize: 22, fontWeight: 700, color: FILM_COLORS.ink }}>
                  Sao chép không kiểm chứng · Mất thói quen tư duy sâu
                </span>
              </div>
            </div>
          )}

          {/* Hallucination Alert Card (Shot 2: frames 460 - 900) */}
          {frame >= 460 && frame <= 900 && (
            <div
              style={{
                position: "absolute",
                top: 130,
                right: 240,
                transform: `scale(${alertSpring})`,
                opacity: interpolate(frame, [460, 490, 870, 900], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <AlertBadge
                title="ẢO GIÁC THÔNG TIN (HALLUCINATION)"
                subtitle="&ldquo;Số liệu này từ nguồn nào? Báo cáo này hoàn toàn không có thật!&rdquo;"
                type="error"
                scale={1.05}
              />
            </div>
          )}

          {/* Existential Question Sticker (Shot 3: frames 920 - 1350) */}
          {frame >= 920 && frame <= 1350 && (
            <div
              style={{
                position: "absolute",
                top: 150,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: interpolate(frame, [920, 950, 1320, 1350], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.ink,
                  color: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.warmYellow}`,
                  borderRadius: 24,
                  padding: "20px 44px",
                  boxShadow: `0 16px 40px ${FILM_COLORS.stickerShadow}`,
                  fontSize: 28,
                  fontWeight: 800,
                  textAlign: "center",
                  maxWidth: 1000,
                }}
              >
                &ldquo;Nếu AI có thể làm mọi thứ nhanh hơn...
                <br />
                <span style={{ color: FILM_COLORS.warmYellow }}>
                  vậy giá trị thật sự của con người nằm ở đâu?&rdquo;
                </span>
              </div>
            </div>
          )}

          {/* 7-Second Silence Label (Shot 4: frames 1390 - 1650) */}
          {frame >= 1390 && (
            <div
              style={{
                position: "absolute",
                top: 140,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: interpolate(frame, [1390, 1430, 1620, 1650], [0, 0.85, 0.85, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontStyle: "italic",
                  color: FILM_COLORS.paperDark,
                  letterSpacing: "0.08em",
                }}
              >
                [Khoảnh khắc dừng lại · Lắng nghe sự yên tĩnh]
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
                backgroundColor: FILM_COLORS.coral,
                color: FILM_COLORS.stickerWhite,
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
              HỒI 5 · CÚ VẤP BẤT NGỜ &amp; ĐIỂM NGHẼN
            </div>
          </div>
        )}
      </PaperBackground>
    </div>
  );
};
