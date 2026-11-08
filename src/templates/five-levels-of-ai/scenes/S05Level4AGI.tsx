import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, SPRING_BOUNCE, SPRING_DOODLE } from "../constants";
import { StepBadge } from "../components/StepBadge";
import { DoodleText } from "../components/DoodleText";
import { HandDrawnBox } from "../components/HandDrawnBox";

interface SynapseBranch {
  title: string;
  icon: string;
  path: string;
  endX: number;
  endY: number;
  delay: number;
  color: string;
}

export const S05Level4AGI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: SPRING_BOUNCE,
  });

  const exitOpacity = interpolate(frame, [575, 600], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [575, 600], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boil = Math.sin(frame * 0.25) * 0.8;

  // Center coordinates of the brain
  const brainX = 540;
  const brainY = 700;

  // Synapse branches illuminating sequentially
  const branches: SynapseBranch[] = [
    {
      title: "Toán & Vật Lý",
      icon: "📐",
      path: `M ${brainX - 80} ${brainY - 40} Q 360 520 220 490`,
      endX: 220,
      endY: 490,
      delay: 50,
      color: PALETTE.mustardYellow,
    },
    {
      title: "Y Sinh & Thuốc Mới",
      icon: "🧬",
      path: `M ${brainX + 80} ${brainY - 40} Q 720 520 860 490`,
      endX: 860,
      endY: 490,
      delay: 80,
      color: PALETTE.softMint,
    },
    {
      title: "Tự Phát Minh Mã Lệnh",
      icon: "💻",
      path: `M ${brainX - 100} ${brainY + 30} Q 300 710 190 730`,
      endX: 190,
      endY: 730,
      delay: 110,
      color: PALETTE.pencilBlue,
    },
    {
      title: "Nghệ Thuật & Triết Học",
      icon: "🎨",
      path: `M ${brainX + 100} ${brainY + 30} Q 780 710 890 730`,
      endX: 890,
      endY: 730,
      delay: 140,
      color: PALETTE.coralRed,
    },
    {
      title: "Khám Phá Định Lý Mới",
      icon: "🔬",
      path: `M ${brainX} ${brainY + 90} Q 540 860 540 930`,
      endX: 540,
      endY: 930,
      delay: 170,
      color: PALETTE.mustardYellow,
    },
  ];

  // Springs
  const brainPop = spring({
    frame: frame - 15,
    fps,
    config: SPRING_BOUNCE,
  });
  const summaryCardPop = spring({
    frame: frame - 230,
    fps,
    config: SPRING_BOUNCE,
  });
  const timelineStickerPop = spring({
    frame: frame - 350,
    fps,
    config: SPRING_BOUNCE,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: entrance * exitOpacity,
        transform: `scale(${exitScale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Header & Step Badge */}
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
          levelNumber={4}
          label="AGI (Innovators)"
          themeColor={PALETTE.coralRed}
          delayFrames={5}
          rotation={-2}
        />

        <div style={{ marginTop: 6, maxWidth: 840 }}>
          <DoodleText
            fontSize={42}
            color={PALETTE.charcoal}
            delayFrames={15}
            staggerFrames={3}
            highlights={[
              { word: "Tổng", color: PALETTE.coralRed },
              { word: "quát", color: PALETTE.coralRed },
              { word: "chuyên", color: PALETTE.mustardYellow },
              { word: "gia", color: PALETTE.mustardYellow },
            ]}
          >
            Trí Tuệ Nhân Tạo Tổng Quát - Tầm Chuyên Gia
          </DoodleText>
        </div>
      </div>

      {/* SVG Brain Sketch & Sequential Branching Paths */}
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <g filter="url(#doodle-wobble)">
          {/* Branching Neural Synapse Paths */}
          {branches.map((b) => {
            const branchProgress = spring({
              frame: frame - b.delay,
              fps,
              config: SPRING_DOODLE,
            });

            return (
              <g key={b.title}>
                {/* Branch line */}
                <path
                  d={b.path}
                  fill="none"
                  stroke={b.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  strokeDashoffset={(1 - branchProgress) * 400}
                />

                {/* Glowing Spark at terminal node */}
                {branchProgress > 0.8 && (
                  <circle
                    cx={b.endX}
                    cy={b.endY}
                    r={8 + Math.sin(frame * 0.4) * 3}
                    fill={b.color}
                  />
                )}
              </g>
            );
          })}

          {/* Central Hand-drawn Brain Sketch */}
          {brainPop > 0.05 && (
            <g
              transform={`translate(${brainX}, ${brainY}) scale(${brainPop}) rotate(${boil})`}
            >
              {/* Left Brain Hemisphere Outline */}
              <path
                d="
                  M 0 -80
                  C -45 -85, -95 -50, -95 0
                  C -95 40, -60 70, -25 85
                  C -10 90, 0 90, 0 85
                "
                fill={PALETTE.coralLight}
                stroke={PALETTE.charcoal}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Brain Hemisphere Outline */}
              <path
                d="
                  M 0 -80
                  C 45 -85, 95 -50, 95 0
                  C 95 40, 60 70, 25 85
                  C 10 90, 0 90, 0 85
                "
                fill={PALETTE.mustardLight}
                stroke={PALETTE.charcoal}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Internal convoluted brain folds (sulci & gyri) */}
              <path
                d="
                  M -60 -40 Q -30 -50 -45 -15 Q -70 10 -40 30 Q -20 50 -15 70
                  M -20 -60 Q -45 -20 -15 0 Q 0 20 -20 40
                "
                fill="none"
                stroke={PALETTE.charcoal}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="
                  M 60 -40 Q 30 -50 45 -15 Q 70 10 40 30 Q 20 50 15 70
                  M 20 -60 Q 45 -20 15 0 Q 0 20 20 40
                "
                fill="none"
                stroke={PALETTE.charcoal}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Center dividing fissure */}
              <line
                x1="0"
                y1="-80"
                x2="0"
                y2="85"
                stroke={PALETTE.charcoal}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />

              {/* Glowing energy burst radiating from brain center */}
              <circle
                cx="0"
                cy="0"
                r={16 + Math.sin(frame * 0.3) * 4}
                fill={PALETTE.coralRed}
                opacity="0.8"
              />
            </g>
          )}
        </g>
      </svg>

      {/* Domain Cards at branch endpoints */}
      {branches.map((b) => {
        const cardPop = spring({
          frame: frame - b.delay - 20,
          fps,
          config: SPRING_BOUNCE,
        });

        if (cardPop <= 0.05) return null;

        return (
          <div
            key={b.title}
            style={{
              position: "absolute",
              left: b.endX - 110,
              top: b.endY - 45,
              width: 220,
              transform: `scale(${cardPop}) rotate(${boil}deg)`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#FFFFFF",
                border: `2.5px solid ${b.color}`,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "2px 2px 0px rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <span
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: PALETTE.charcoal,
                }}
              >
                {b.title}
              </span>
            </div>
          </div>
        );
      })}

      {/* Core Definition Card */}
      {summaryCardPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: 1040,
            width: 820,
            transform: `scale(${summaryCardPop}) rotate(${-1 + boil}deg)`,
            transformOrigin: "center center",
          }}
        >
          <HandDrawnBox
            width={820}
            height={250}
            fillColor={PALETTE.coralLight}
            fillOpacity={0.7}
            strokeColor={PALETTE.coralRed}
            strokeWidth={3.5}
            seed={18}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 30,
                  fontWeight: 900,
                  color: PALETTE.coralRed,
                }}
              >
                💡 Định Nghĩa Của AGI:
              </span>
              <p
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 26,
                  color: PALETTE.charcoal,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Một hệ thống duy nhất có khả năng tự nghiên cứu, tự sửa đổi thuật toán và làm tốt hơn 90% con người trong hầu hết mọi công việc trí óc kinh tế.
              </p>
            </div>
          </HandDrawnBox>
        </div>
      )}

      {/* Forecast Sticker: Bao giờ tới? */}
      {timelineStickerPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 350,
            transform: `scale(${timelineStickerPop}) rotate(${2 + boil}deg)`,
          }}
        >
          <div
            style={{
              padding: "10px 28px",
              backgroundColor: PALETTE.mustardYellow,
              border: `3px solid ${PALETTE.charcoal}`,
              borderRadius: "16px",
              fontFamily: "'Patrick Hand', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: PALETTE.charcoal,
              boxShadow: "3px 3px 0px rgba(0,0,0,0.2)",
            }}
          >
            ⏳ Dự báo của các phòng Lab: Dự kiến 2026 - 2030!
          </div>
        </div>
      )}
    </div>
  );
};
