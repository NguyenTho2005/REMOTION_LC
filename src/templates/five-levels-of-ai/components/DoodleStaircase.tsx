import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE, SPRING_DOODLE } from "../constants";

interface StepData {
  level: number;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}

export const STAIRCASE_STEPS: StepData[] = [
  {
    level: 1,
    title: "Chatbots",
    subtitle: "Hội thoại / Passive",
    color: PALETTE.softMint,
    icon: "💬",
  },
  {
    level: 2,
    title: "AI Agents",
    subtitle: "Tự chủ / Multi-tool",
    color: PALETTE.mustardYellow,
    icon: "⚡",
  },
  {
    level: 3,
    title: "Multimodal",
    subtitle: "Thị giác & Âm thanh",
    color: PALETTE.pencilBlue,
    icon: "👁️",
  },
  {
    level: 4,
    title: "AGI",
    subtitle: "Trí tuệ tổng quát",
    color: PALETTE.coralRed,
    icon: "🧠",
  },
  {
    level: 5,
    title: "ASI",
    subtitle: "Siêu trí tuệ đỉnh cao",
    color: PALETTE.charcoalLight,
    icon: "🚀",
  },
];

interface DoodleStaircaseProps {
  activeStep?: number;
  highlightLevel2?: boolean;
  stickmanPosition?: number; // 1 to 5
  delayFrames?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

export const DoodleStaircase: React.FC<DoodleStaircaseProps> = ({
  activeStep = 0,
  highlightLevel2 = false,
  stickmanPosition = 1,
  delayFrames = 0,
  scale = 1,
  translateX = 0,
  translateY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_DOODLE,
  });

  const boil = Math.sin(frame * 0.25) * 0.6;

  // Geometry for 5 vertical steps in a vertical 1080x1920 layout
  // Step 1 at bottom-left: x = 120, y = 1420
  // Step 5 at top-right: x = 680, y = 460
  const stepWidth = 240;
  const stepHeight = 50;
  const startX = 140;
  const startY = 1380;
  const stepDx = 140;
  const stepDy = -210;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale * entrance})`,
        transformOrigin: "540px 960px",
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <g filter="url(#doodle-wobble)">
          {/* Main staircase connected path */}
          {STAIRCASE_STEPS.map((step, idx) => {
            const x = startX + idx * stepDx;
            const y = startY + idx * stepDy;
            const isCurrent = activeStep === step.level;
            const isL2 = step.level === 2 && highlightLevel2;

            const stepEntrance = spring({
              frame: frame - delayFrames - idx * 8,
              fps,
              config: SPRING_DOODLE,
            });

            return (
              <g
                key={step.level}
                style={{
                  opacity: stepEntrance,
                  transform: `translateY(${(1 - stepEntrance) * 40}px)`,
                }}
              >
                {/* Step riser (vertical line) */}
                <path
                  d={`M ${x} ${y + stepHeight} L ${x} ${y}`}
                  stroke={PALETTE.charcoal}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${x + 1.5} ${y + stepHeight} L ${x + 1.5} ${y}`}
                  stroke={PALETTE.charcoal}
                  strokeWidth="2"
                  opacity="0.5"
                />

                {/* Step tread (horizontal line) */}
                <path
                  d={`M ${x} ${y} L ${x + stepWidth} ${y}`}
                  stroke={PALETTE.charcoal}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${x} ${y + 1.5} L ${x + stepWidth} ${y + 1.5}`}
                  stroke={PALETTE.charcoal}
                  strokeWidth="2.5"
                  opacity="0.5"
                />

                {/* Step marker fill block */}
                <rect
                  x={x + 4}
                  y={y - 8}
                  width={stepWidth - 8}
                  height={16}
                  fill={isL2 ? PALETTE.mustardYellow : step.color}
                  opacity={isCurrent || isL2 ? 0.75 : 0.25}
                  rx="4"
                />

                {/* Step Level Badge */}
                <g transform={`translate(${x + 14}, ${y - 42})`}>
                  <rect
                    x="0"
                    y="0"
                    width="110"
                    height="32"
                    fill={isL2 ? PALETTE.coralRed : isCurrent ? step.color : PALETTE.charcoalLight}
                    rx="6"
                  />
                  <text
                    x="55"
                    y="22"
                    textAnchor="middle"
                    fontFamily="'Patrick Hand', 'Caveat', sans-serif"
                    fontSize="18"
                    fontWeight="800"
                    fill={isL2 || !isCurrent ? "#FFFFFF" : PALETTE.charcoal}
                  >
                    LEVEL {step.level}
                  </text>
                </g>

                {/* Step Title & Subtitle */}
                <text
                  x={x + 14}
                  y={y + 36}
                  fontFamily="'Patrick Hand', 'Caveat', sans-serif"
                  fontSize="24"
                  fontWeight="800"
                  fill={PALETTE.charcoal}
                >
                  {step.icon} {step.title}
                </text>
                <text
                  x={x + 14}
                  y={y + 60}
                  fontFamily="'Patrick Hand', 'Caveat', sans-serif"
                  fontSize="17"
                  fontWeight="600"
                  fill={PALETTE.charcoalLight}
                >
                  {step.subtitle}
                </text>

                {/* Active step glow marker */}
                {isCurrent && (
                  <circle
                    cx={x + stepWidth / 2}
                    cy={y - 14}
                    r="8"
                    fill={PALETTE.coralRed}
                  />
                )}
              </g>
            );
          })}

          {/* Hand-drawn climbing Stickman */}
          {(() => {
            const stepIdx = Math.max(0, Math.min(4, stickmanPosition - 1));
            const smX = startX + stepIdx * stepDx + 60;
            const smY = startY + stepIdx * stepDy - 15;
            const bounce = Math.sin(frame * 0.3) * 4;

            return (
              <g
                transform={`translate(${smX}, ${smY + bounce})`}
                filter="url(#doodle-wobble)"
              >
                {/* Stickman head */}
                <circle
                  cx="0"
                  cy="-70"
                  r="14"
                  fill="#FFFFFF"
                  stroke={PALETTE.charcoal}
                  strokeWidth="3.5"
                />
                {/* Smiley face */}
                <circle cx="-4" cy="-73" r="1.5" fill={PALETTE.charcoal} />
                <circle cx="4" cy="-73" r="1.5" fill={PALETTE.charcoal} />
                <path
                  d="M -5 -66 Q 0 -62 5 -66"
                  stroke={PALETTE.charcoal}
                  strokeWidth="2"
                  fill="none"
                />

                {/* Torso */}
                <path
                  d="M 0 -56 L 0 -22"
                  stroke={PALETTE.charcoal}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Arms waving excitedly */}
                <path
                  d={`M 0 -45 Q 16 ${-55 + boil * 3} 24 -68`}
                  stroke={PALETTE.charcoal}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M 0 -45 Q -14 ${-40 - boil * 2} -20 -30`}
                  stroke={PALETTE.charcoal}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Legs walking */}
                <path
                  d="M 0 -22 L 14 0"
                  stroke={PALETTE.charcoal}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 -22 L -12 -2 L -18 0"
                  stroke={PALETTE.charcoal}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* "You Are Here" or pointer tag */}
                {highlightLevel2 && stickmanPosition === 2 && (
                  <g transform="translate(30, -95)">
                    <rect
                      x="0"
                      y="0"
                      width="120"
                      height="32"
                      rx="6"
                      fill={PALETTE.coralRed}
                    />
                    <text
                      x="60"
                      y="21"
                      textAnchor="middle"
                      fontFamily="'Patrick Hand', 'Caveat', sans-serif"
                      fontSize="17"
                      fontWeight="800"
                      fill="#FFFFFF"
                    >
                      BẠN Ở ĐÂY!
                    </text>
                  </g>
                )}
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};
