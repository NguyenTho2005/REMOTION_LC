import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { PaperBackground } from "../components/PaperBackground";
import { HandDrawnWindow } from "../components/HandDrawnProps";
import { CoherentDeskScene } from "../components/CoherentDeskScene";
import { MinhExpression, MinhPose } from "../character/MinhCharacter";

export const Act2LifeBeforeGenAI: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 1500

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

  // Poses across Act 2
  let currentPose: MinhPose = "writing";
  let currentExpression: MinhExpression = "focused";

  if (frame < 350) {
    // Shot 1: Looking through paper dictionary / manual writing
    currentPose = "writing";
    currentExpression = "focused";
  } else if (frame < 750) {
    // Shot 2: Debugging manual code / syntax error / thinking
    currentPose = "thinking";
    currentExpression = "confused";
  } else if (frame < 1150) {
    // Shot 3: Steady patient typing rhythm
    currentPose = "typing";
    currentExpression = "focused";
  } else {
    // Shot 4: Breakthrough moment!
    currentPose = "relaxed";
    currentExpression = "happy";
  }

  // Progress Bar for manual patience (Shot 3)
  const manualProgress = interpolate(frame, [750, 1150], [10, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lightbulb pop on breakthrough (Shot 4: frames 1150+)
  const lightbulbScale = spring({
    frame: frame - 1160,
    fps: 30,
    config: { damping: 10, stiffness: 140 },
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
      <PaperBackground ambient="sunset" showGrid={true}>
        {/* Environment: Window with Sunset Glow */}
        <div style={{ position: "absolute", top: 80, right: 280, zIndex: 10 }}>
          <HandDrawnWindow timeOfDay="sunset" scale={1.1} />
        </div>

        {/* Coherent Depth-Aware Desk Scene */}
        <CoherentDeskScene
          pose={currentPose}
          expression={currentExpression}
          laptopContent={frame > 1150 ? "code" : "tabs"}
          isLaptopOpen={true}
          coffeeSteam={true}
        >
          {/* Search Bar Sticker (Shot 1: frames 40 - 350) */}
          {frame >= 30 && frame <= 360 && (
            <div
              style={{
                position: "absolute",
                top: 150,
                left: 450,
                opacity: interpolate(frame, [30, 50, 320, 350], [0, 1, 1, 0]),
                transform: "rotate(-1deg)",
                zIndex: 35,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.ink}`,
                  borderRadius: 40,
                  padding: "14px 32px",
                  boxShadow: `0 8px 24px ${FILM_COLORS.stickerShadow}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 24 }}>🔍</span>
                <span
                  style={{
                    fontSize: 22,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: FILM_COLORS.ink,
                  }}
                >
                  &quot;từ khóa chính xác&quot; + &quot;filetype:pdf&quot;
                </span>
                <span
                  style={{
                    backgroundColor: FILM_COLORS.paperDark,
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: FILM_COLORS.inkSubtle,
                  }}
                >
                  Google 2021
                </span>
              </div>
            </div>
          )}

          {/* Compiler Error Sticker (Shot 2: frames 360 - 750) */}
          {frame > 350 && frame < 750 && (
            <div
              style={{
                position: "absolute",
                top: 160,
                left: 420,
                opacity: interpolate(frame, [360, 390, 710, 740], [0, 1, 1, 0]),
                transform: "rotate(2deg)",
                zIndex: 35,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.coral}`,
                  borderRadius: 16,
                  padding: "16px 28px",
                  boxShadow: `0 10px 24px ${FILM_COLORS.stickerShadow}`,
                }}
              >
                <div style={{ color: FILM_COLORS.coral, fontWeight: 900, fontSize: 18 }}>
                  ✖ SyntaxError: unexpected token at line 142
                </div>
                <div style={{ color: FILM_COLORS.inkSubtle, fontSize: 15, marginTop: 4 }}>
                  Tự tìm từng dấu chấm phẩy... đọc từng dòng stack trace.
                </div>
              </div>
            </div>
          )}

          {/* Patient Rhythm Progress Card (Shot 3: frames 750 - 1150) */}
          {frame >= 750 && frame < 1160 && (
            <div
              style={{
                position: "absolute",
                top: 150,
                left: 480,
                opacity: interpolate(frame, [750, 780, 1120, 1150], [0, 1, 1, 0]),
                zIndex: 35,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.ink}`,
                  borderRadius: 20,
                  padding: "18px 32px",
                  boxShadow: `0 10px 26px ${FILM_COLORS.stickerShadow}`,
                  width: 480,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 16,
                    fontWeight: 800,
                    color: FILM_COLORS.ink,
                    marginBottom: 10,
                  }}
                >
                  <span>Nhịp điệu thủ công và kiên nhẫn</span>
                  <span>{Math.round(manualProgress)}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 16,
                    backgroundColor: FILM_COLORS.paperDark,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: `2px solid ${FILM_COLORS.ink}`,
                  }}
                >
                  <div
                    style={{
                      width: `${manualProgress}%`,
                      height: "100%",
                      backgroundColor: FILM_COLORS.sageGreen,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lightbulb Eureka Pop (Shot 4: frames 1160+) */}
          {frame >= 1160 && (
            <div
              style={{
                position: "absolute",
                top: 360,
                left: 710,
                transform: `scale(${Math.max(0, lightbulbScale)})`,
                zIndex: 45,
              }}
            >
              <svg width="90" height="110" viewBox="0 0 100 120">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="2"
                    stroke={FILM_COLORS.warmYellow}
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
                <circle cx="50" cy="50" r="28" fill={FILM_COLORS.warmYellow} stroke={FILM_COLORS.ink} strokeWidth="4" />
                <path
                  d="M 38 72 L 62 72 L 58 86 L 42 86 Z"
                  fill={FILM_COLORS.paperDark}
                  stroke={FILM_COLORS.ink}
                  strokeWidth="3.5"
                />
                <line x1="42" y1="92" x2="58" y2="92" stroke={FILM_COLORS.ink} strokeWidth="3" />
              </svg>
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
              HỒI 2 · CUỘC SỐNG TRƯỚC GENERATIVE AI
            </div>
          </div>
        )}
      </PaperBackground>
    </div>
  );
};
