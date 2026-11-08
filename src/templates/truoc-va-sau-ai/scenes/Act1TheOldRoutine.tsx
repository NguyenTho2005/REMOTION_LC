import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { PaperBackground } from "../components/PaperBackground";
import { WallClock } from "../components/HandDrawnProps";
import { CoherentDeskScene } from "../components/CoherentDeskScene";
import { MinhExpression, MinhPose } from "../character/MinhCharacter";

export const Act1TheOldRoutine: React.FC = () => {
  const frame = useCurrentFrame(); // Frame within Act 1 (0 to 1350)

  // Title Card animation (frames 20 - 180)
  const titleSpring = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 14, stiffness: 100 },
  });
  const titleOpacity = interpolate(frame, [20, 40, 150, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Minh's semantic pose & expression progression across Act 1 shots
  let currentPose: MinhPose = "frustrated";
  let currentExpression: MinhExpression = "exhausted";
  const laptopContent: "tabs" | "code" | "blank" = frame > 600 ? "blank" : "tabs";

  if (frame < 240) {
    // Shot 1: Establishing exhaustion / slumped forward
    currentPose = "frustrated";
    currentExpression = "exhausted";
  } else if (frame < 600) {
    // Shot 2: 30 tabs overload & frantic typing
    currentPose = "typing";
    currentExpression = "confused";
  } else if (frame < 950) {
    // Shot 3: Frustration with draft / thinking propped chin
    currentPose = "thinking";
    currentExpression = "frustrated";
  } else {
    // Shot 4: Midnight sigh & relaxing back against chair backrest
    currentPose = "relaxed";
    currentExpression = "thoughtful";
  }

  // Camera subtle dolly/pan effect (deterministic)
  const cameraScale = interpolate(frame, [0, 300, 950, 1350], [1.0, 1.04, 1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, [0, 400, 1350], [0, -12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tab overload popups (Shot 2: frames 240 - 600)
  const showTabOverload = frame >= 240 && frame <= 620;
  const tabStickerSpring = spring({
    frame: frame - 250,
    fps: 30,
    config: { damping: 12 },
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
        transformOrigin: "center center",
      }}
    >
      <PaperBackground ambient="night" showGrid={true}>
        {/* Environment: Clock on Wall */}
        <div style={{ position: "absolute", top: 120, right: 320, zIndex: 10 }}>
          <WallClock hour={11} minute={interpolate(frame, [0, 1350], [15, 55])} scale={1.2} />
        </div>

        {/* Coherent Depth-Aware Desk Scene */}
        <CoherentDeskScene
          pose={currentPose}
          expression={currentExpression}
          laptopContent={laptopContent}
          isLaptopOpen={true}
          coffeeSteam={frame < 800}
        >
          {/* Wastebasket with crumpled papers on floor */}
          <div style={{ position: "absolute", right: 260, top: 770, zIndex: 15 }}>
            <svg width="100" height="90" viewBox="0 0 100 90">
              <path
                d="M 20 20 L 30 85 L 70 85 L 80 20 Z"
                fill="#FAF6ED"
                stroke={FILM_COLORS.ink}
                strokeWidth="3.5"
              />
              <line x1="32" y1="20" x2="38" y2="85" stroke={FILM_COLORS.inkSubtle} strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="85" stroke={FILM_COLORS.inkSubtle} strokeWidth="2" />
              <line x1="68" y1="20" x2="62" y2="85" stroke={FILM_COLORS.inkSubtle} strokeWidth="2" />
              {/* Paper balls */}
              <circle cx="50" cy="30" r="14" fill="#FAF6ED" stroke={FILM_COLORS.ink} strokeWidth="2" />
              <circle cx="62" cy="24" r="10" fill="#E67E67" stroke={FILM_COLORS.ink} strokeWidth="2" />
            </svg>
          </div>

          {/* Browser Tabs Graphic Overlay (Shot 2) */}
          {showTabOverload && (
            <div
              style={{
                position: "absolute",
                top: 220,
                left: 1040,
                transform: `scale(${tabStickerSpring}) rotate(-4deg)`,
                opacity: interpolate(frame, [240, 260, 580, 610], [0, 1, 1, 0]),
                zIndex: 40,
              }}
            >
              <div
                style={{
                  backgroundColor: FILM_COLORS.stickerWhite,
                  border: `4px solid ${FILM_COLORS.ink}`,
                  borderRadius: 16,
                  padding: "16px 24px",
                  boxShadow: `0 12px 28px ${FILM_COLORS.stickerShadow}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      backgroundColor: FILM_COLORS.coral,
                      color: FILM_COLORS.stickerWhite,
                      fontWeight: 900,
                      fontSize: 16,
                      padding: "3px 10px",
                      borderRadius: 12,
                    }}
                  >
                    30+ TABS
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: FILM_COLORS.ink }}>
                    Stack Overflow · Reddit · Docs
                  </span>
                </div>
                <div style={{ fontSize: 14, color: FILM_COLORS.inkSubtle }}>
                  Đọc lướt hàng chục trang tài liệu tiếng Anh...
                </div>
              </div>
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
              HỒI 1 · THÓI QUEN CŨ
            </div>
          </div>
        )}
      </PaperBackground>
    </div>
  );
};
