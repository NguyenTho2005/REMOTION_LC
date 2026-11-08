import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, SPRING_BOUNCE } from "../constants";
import { StepBadge } from "../components/StepBadge";
import { DoodleText } from "../components/DoodleText";
import { HandDrawnBox } from "../components/HandDrawnBox";
import { RedCrayonCircle } from "../components/RedCrayonCircle";
import { DoodleArrow } from "../components/DoodleArrow";
import { DoodleStaircase } from "../components/DoodleStaircase";

export const S06Level5ASISummary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: SPRING_BOUNCE,
  });

  const boil = Math.sin(frame * 0.25) * 0.8;

  // Phase division within this 660-frame scene:
  // Phase 1: Level 5 ASI (frames 0 - 240)
  // Phase 2: Staircase Zoom & Red Crayon Circling Level 2 (frames 240 - 450)
  // Phase 3: Outro & Call to Action (frames 450 - 660)
  const isPhase1 = frame < 240;
  const isPhase2 = frame >= 240 && frame < 450;
  const isPhase3 = frame >= 450;

  // Spiral expansion particles for Phase 1
  const spiralCount = 36;
  const spiralRotation = frame * 1.5;

  // Springs for Phase 2 (Staircase return & Red Crayon)
  const staircaseReturnPop = spring({
    frame: frame - 240,
    fps,
    config: SPRING_BOUNCE,
  });
  const redCircleDelay = 280;

  // Springs for Phase 3 (CTA & Wiggle Elements)
  const ctaPop = spring({
    frame: frame - 450,
    fps,
    config: SPRING_BOUNCE,
  });
  const ctaWiggle = Math.sin((frame - 450) * 0.35) * 4;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: entrance,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ========================================================
          PHASE 1: LEVEL 5 - ASI (Frames 0 - 240)
         ======================================================== */}
      {isPhase1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: interpolate(frame, [220, 240], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Top Header */}
          <div
            style={{
              position: "absolute",
              top: 160,
              left: 80,
              right: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <StepBadge
              levelNumber={5}
              label="ASI (SUPERINTELLIGENCE)"
              themeColor={PALETTE.coralRed}
              delayFrames={5}
              rotation={2}
            />

            <div style={{ marginTop: 6, maxWidth: 840 }}>
              <DoodleText
                fontSize={42}
                color={PALETTE.charcoal}
                delayFrames={15}
                staggerFrames={3}
                highlights={[
                  { word: "Siêu", color: PALETTE.coralRed },
                  { word: "trí", color: PALETTE.coralRed },
                  { word: "tuệ", color: PALETTE.coralRed },
                ]}
              >
                Siêu Trí Tuệ: Vượt Xa Toàn Bộ Nhân Loại
              </DoodleText>
            </div>
          </div>

          {/* Center Cosmic Spiral Expansion Particles */}
          <div
            style={{
              position: "absolute",
              top: 520,
              width: 800,
              height: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="-400 -300 800 600"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              <g
                filter="url(#doodle-wobble)"
                transform={`rotate(${spiralRotation})`}
              >
                {/* Spiral particles radiating out */}
                {Array.from({ length: spiralCount }).map((_, i) => {
                  const angle = (i / spiralCount) * Math.PI * 6;
                  const radiusBase = (i / spiralCount) * 260;
                  const pulse = Math.sin(frame * 0.2 + i) * 15;
                  const currentR = radiusBase + pulse;
                  const px = Math.cos(angle) * currentR;
                  const py = Math.sin(angle) * currentR;
                  const dotSize = interpolate(i, [0, spiralCount], [4, 16]);

                  return (
                    <circle
                      key={i}
                      cx={px}
                      cy={py}
                      r={dotSize}
                      fill={
                        i % 3 === 0
                          ? PALETTE.coralRed
                          : i % 2 === 0
                            ? PALETTE.mustardYellow
                            : PALETTE.charcoal
                      }
                      stroke={PALETTE.charcoal}
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Central Singularity Doodle Core */}
                <circle
                  cx="0"
                  cy="0"
                  r={40 + Math.sin(frame * 0.3) * 8}
                  fill={PALETTE.coralRed}
                  stroke={PALETTE.charcoal}
                  strokeWidth="4"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={22}
                  fill="#FFFFFF"
                  stroke={PALETTE.charcoal}
                  strokeWidth="3"
                />
              </g>
            </svg>
          </div>

          {/* Phase 1 Explainer Card */}
          <div
            style={{
              position: "absolute",
              top: 1140,
              width: 820,
            }}
          >
            <HandDrawnBox
              width={820}
              height={220}
              fillColor={PALETTE.mustardLight}
              fillOpacity={0.8}
              strokeColor={PALETTE.charcoal}
              strokeWidth={3.5}
              seed={22}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 28,
                    fontWeight: 900,
                    color: PALETTE.charcoal,
                  }}
                >
                  🚀 ĐIỂM KỶ NGUYÊN KỲ DỊ (SINGULARITY):
                </span>
                <p
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 25,
                    color: PALETTE.charcoal,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  Khả năng tự nhân bản và tiến hóa cấp số nhân trong vài giây. Vượt qua mọi giới hạn sinh học của loài người!
                </p>
              </div>
            </HandDrawnBox>
          </div>
        </div>
      )}

      {/* ========================================================
          PHASE 2: REALITY CHECK & RED CRAYON CIRCLING LEVEL 2
          (Frames 240 - 450)
         ======================================================== */}
      {isPhase2 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: staircaseReturnPop,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Header */}
          <div
            style={{
              position: "absolute",
              top: 160,
              left: 80,
              right: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <HandDrawnBox
              width={760}
              height={100}
              fillColor={PALETTE.coralRed}
              fillOpacity={0.9}
              strokeColor={PALETTE.charcoal}
              strokeWidth={3.5}
              rotation={-1}
            >
              <span
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 38,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: 1.5,
                }}
              >
                🎯 NHƯNG THỰC TẾ LÀ GÌ?
              </span>
            </HandDrawnBox>

            <div style={{ marginTop: 10, maxWidth: 840 }}>
              <DoodleText
                fontSize={36}
                color={PALETTE.charcoal}
                delayFrames={250}
                staggerFrames={2}
                highlights={[{ word: "Level", color: PALETTE.mustardYellow }]}
              >
                Bạn chỉ cần tập trung làm chủ Level 2!
              </DoodleText>
            </div>
          </div>

          {/* Full Staircase with Level 2 highlighted */}
          <DoodleStaircase
            activeStep={2}
            highlightLevel2={true}
            stickmanPosition={2}
            delayFrames={240}
            scale={0.9}
            translateY={70}
          />

          {/* Bold Red Crayon Circle circling Level 2 on the staircase */}
          {frame >= redCircleDelay && (
            <RedCrayonCircle
              x={390}
              y={1220}
              rx={170}
              ry={85}
              rotation={-6}
              delayFrames={redCircleDelay}
              color={PALETTE.coralRed}
              strokeWidth={6}
            />
          )}

          {/* Animated Arrow pointing into the red circle */}
          {frame >= redCircleDelay + 15 && (
            <DoodleArrow
              startX={660}
              startY={1360}
              endX={510}
              endY={1270}
              curveOffset={-20}
              strokeColor={PALETTE.coralRed}
              strokeWidth={5}
              delayFrames={redCircleDelay + 15}
            />
          )}

          {/* Explainer Tag at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 350,
              left: 100,
              right: 140,
            }}
          >
            <HandDrawnBox
              width={780}
              height={120}
              fillColor={PALETTE.mustardLight}
              fillOpacity={0.9}
              strokeColor={PALETTE.charcoal}
              strokeWidth={3.5}
              seed={25}
            >
              <span
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 27,
                  fontWeight: 800,
                  color: PALETTE.charcoal,
                  textAlign: "center",
                }}
              >
                Ai làm chủ AI Agent hôm nay, người đó sẽ dẫn đầu thị trường ngày mai!
              </span>
            </HandDrawnBox>
          </div>
        </div>
      )}

      {/* ========================================================
          PHASE 3: OUTRO & TIKTOK CTA WIGGLE (Frames 450 - 660)
         ======================================================== */}
      {isPhase3 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: ctaPop,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Main Call to Action Card */}
          <div
            style={{
              position: "absolute",
              top: 360,
              width: 820,
              transform: `scale(${ctaPop}) rotate(${ctaWiggle * 0.3}deg)`,
            }}
          >
            <HandDrawnBox
              width={820}
              height={520}
              fillColor="#FFFFFF"
              fillOpacity={0.96}
              strokeColor={PALETTE.charcoal}
              strokeWidth={4.5}
              seed={30}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 72, transform: `rotate(${ctaWiggle}deg)` }}>
                  🚀
                </div>

                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 44,
                    fontWeight: 900,
                    color: PALETTE.charcoal,
                    letterSpacing: 1.5,
                  }}
                >
                  BẠN ĐÃ SẴN SÀNG CHO AI AGENT?
                </span>

                <p
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 30,
                    color: PALETTE.charcoalLight,
                    margin: 0,
                    maxWidth: 700,
                    lineHeight: 1.4,
                  }}
                >
                  Bấm Follow ngay để đón xem chuỗi video hướng dẫn tự tay xây dựng AI Agent từ A đến Z!
                </p>

                {/* Animated Follow Button with Wiggle */}
                <div
                  style={{
                    marginTop: 10,
                    transform: `scale(1.05) rotate(${-ctaWiggle * 0.6}deg)`,
                  }}
                >
                  <HandDrawnBox
                    width={380}
                    height={80}
                    fillColor={PALETTE.coralRed}
                    fillOpacity={0.95}
                    strokeColor={PALETTE.charcoal}
                    strokeWidth={3.5}
                    seed={33}
                  >
                    <span
                      style={{
                        fontFamily: "'Patrick Hand', sans-serif",
                        fontSize: 34,
                        fontWeight: 900,
                        color: "#FFFFFF",
                        letterSpacing: 2,
                      }}
                    >
                      + FOLLOW NGAY 🔥
                    </span>
                  </HandDrawnBox>
                </div>
              </div>
            </HandDrawnBox>
          </div>

          {/* TikTok Reaction Buttons Doodle Row */}
          <div
            style={{
              position: "absolute",
              bottom: 340,
              display: "flex",
              gap: 40,
            }}
          >
            {[
              { icon: "❤️", label: "Thả Tim", rotate: -3 },
              { icon: "💬", label: "Bình Luận", rotate: 2 },
              { icon: "🔗", label: "Chia Sẻ", rotate: -2 },
            ].map((btn, i) => (
              <div
                key={btn.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transform: `scale(${spring({
                    frame: frame - 490 - i * 8,
                    fps,
                    config: SPRING_BOUNCE,
                  })}) rotate(${btn.rotate + boil}deg)`,
                }}
              >
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    border: `3px solid ${PALETTE.charcoal}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
                  }}
                >
                  {btn.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: PALETTE.charcoal,
                  }}
                >
                  {btn.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
