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
import { DoodleGear } from "../components/DoodleGear";

interface ToolNode {
  title: string;
  icon: string;
  subtitle: string;
  x: number;
  y: number;
  color: string;
}

export const S03Level2Agent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: SPRING_BOUNCE,
  });

  const exitOpacity = interpolate(frame, [490, 510], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [490, 510], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boil = Math.sin(frame * 0.25) * 0.8;

  // Center figure position
  const centerX = 540;
  const centerY = 780;

  // The 4 juggled tools
  const tools: ToolNode[] = [
    {
      title: "Terminal & Code",
      icon: "💻",
      subtitle: "Tự viết & chạy code",
      x: 230,
      y: 560,
      color: PALETTE.mustardYellow,
    },
    {
      title: "Web Browser",
      icon: "🌐",
      subtitle: "Tìm kiếm & đọc web",
      x: 850,
      y: 560,
      color: PALETTE.softMint,
    },
    {
      title: "File & Database",
      icon: "📁",
      subtitle: "Đọc, lưu & phân tích",
      x: 230,
      y: 980,
      color: PALETTE.pencilBlue,
    },
    {
      title: "APIs & Services",
      icon: "🔌",
      subtitle: "Gọi dịch vụ ngoài",
      x: 850,
      y: 980,
      color: PALETTE.coralRed,
    },
  ];

  // Springs for tool popups
  const figurePop = spring({
    frame: frame - 15,
    fps,
    config: SPRING_BOUNCE,
  });
  const armProgress = spring({
    frame: frame - 35,
    fps,
    config: SPRING_DOODLE,
  });
  const loopBadgePop = spring({
    frame: frame - 180,
    fps,
    config: SPRING_BOUNCE,
  });
  const bannerPop = spring({
    frame: frame - 280,
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
          levelNumber={2}
          label="AI AGENTS (Reasoners)"
          themeColor={PALETTE.mustardYellow}
          delayFrames={5}
          rotation={1.5}
        />

        <div style={{ marginTop: 6, maxWidth: 840 }}>
          <DoodleText
            fontSize={42}
            color={PALETTE.charcoal}
            delayFrames={15}
            staggerFrames={3}
            highlights={[
              { word: "Tự", color: PALETTE.mustardYellow },
              { word: "chủ", color: PALETTE.mustardYellow },
              { word: "công", color: PALETTE.softMint },
              { word: "cụ", color: PALETTE.softMint },
            ]}
          >
            Tự chủ hành động & Sử dụng công cụ
          </DoodleText>
        </div>
      </div>

      {/* Spinning Gears of Reasoning above Agent's Head */}
      <DoodleGear x={480} y={640} radius={42} teethCount={8} speed={1.5} strokeColor={PALETTE.charcoal} />
      <DoodleGear x={580} y={625} radius={32} teethCount={6} speed={-1.8} strokeColor={PALETTE.mustardYellow} strokeWidth={3} />

      {/* SVG Multi-Arm Doodle Figure & Dashed Connection Paths */}
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
          {/* Animated Multi-Arms reaching out from center */}
          {tools.map((t, i) => {
            // Wavy arm curve control points
            const armWave = Math.sin(frame * 0.2 + i * 1.5) * 15;
            const ctrlX = (centerX + t.x) / 2 + (i % 2 === 0 ? -30 : 30);
            const ctrlY = (centerY + t.y) / 2 + armWave;

            return (
              <g key={t.title}>
                {/* Wavy Arm Stroke */}
                <path
                  d={`M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${t.x} ${t.y}`}
                  fill="none"
                  stroke={PALETTE.charcoal}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="16 10"
                  strokeDashoffset={-frame * 3}
                  style={{
                    opacity: armProgress,
                  }}
                />

                {/* Animated traveling signal particle along arm */}
                {armProgress > 0.5 && (
                  <circle
                    cx={interpolate(
                      (frame * 2 + i * 40) % 100,
                      [0, 100],
                      [centerX, t.x]
                    )}
                    cy={interpolate(
                      (frame * 2 + i * 40) % 100,
                      [0, 100],
                      [centerY, t.y]
                    )}
                    r="6"
                    fill={t.color}
                  />
                )}
              </g>
            );
          })}

          {/* Central AI Agent Body & Head */}
          {figurePop > 0.05 && (
            <g
              transform={`translate(${centerX}, ${centerY}) scale(${figurePop}) rotate(${boil})`}
            >
              {/* Agent Head */}
              <circle
                cx="0"
                cy="-70"
                r="38"
                fill="#FFFFFF"
                stroke={PALETTE.charcoal}
                strokeWidth="4.5"
              />
              {/* Smart Glasses / Goggles Doodle */}
              <rect
                x="-32"
                y="-82"
                width="28"
                height="22"
                rx="6"
                fill={PALETTE.mustardYellow}
                stroke={PALETTE.charcoal}
                strokeWidth="3"
              />
              <rect
                x="4"
                y="-82"
                width="28"
                height="22"
                rx="6"
                fill={PALETTE.mustardYellow}
                stroke={PALETTE.charcoal}
                strokeWidth="3"
              />
              <line
                x1="-4"
                y1="-71"
                x2="4"
                y2="-71"
                stroke={PALETTE.charcoal}
                strokeWidth="3"
              />

              {/* Confident smile */}
              <path
                d="M -14 -56 Q 0 -48 14 -56"
                stroke={PALETTE.charcoal}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Body */}
              <path
                d="M 0 -32 L 0 50"
                stroke={PALETTE.charcoal}
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Legs standing firm */}
              <path
                d="M 0 50 L -30 110"
                stroke={PALETTE.charcoal}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 50 L 30 110"
                stroke={PALETTE.charcoal}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      </svg>

      {/* The 4 Tool Cards orbiting around */}
      {tools.map((t, idx) => {
        const cardPop = spring({
          frame: frame - 45 - idx * 12,
          fps,
          config: SPRING_BOUNCE,
        });

        if (cardPop <= 0.05) return null;

        return (
          <div
            key={t.title}
            style={{
              position: "absolute",
              left: t.x - 140,
              top: t.y - 70,
              width: 280,
              height: 140,
              transform: `scale(${cardPop}) rotate(${((idx % 2 === 0 ? -1 : 1) * 2) + boil}deg)`,
              transformOrigin: "center center",
            }}
          >
            <HandDrawnBox
              width={280}
              height={140}
              fillColor="#FFFFFF"
              fillOpacity={0.95}
              strokeColor={t.color}
              strokeWidth={3.5}
              seed={idx + 4}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: 34 }}>{t.icon}</span>
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: PALETTE.charcoal,
                  }}
                >
                  {t.title}
                </span>
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: PALETTE.charcoalLight,
                  }}
                >
                  {t.subtitle}
                </span>
              </div>
            </HandDrawnBox>
          </div>
        );
      })}

      {/* Autonomous Loop Badge (Mục tiêu -> Lập kế hoạch -> Thực thi) */}
      {loopBadgePop > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: 1140,
            width: 820,
            transform: `scale(${loopBadgePop}) rotate(${1 + boil}deg)`,
            transformOrigin: "center center",
          }}
        >
          <HandDrawnBox
            width={820}
            height={160}
            fillColor={PALETTE.mustardLight}
            fillOpacity={0.85}
            strokeColor={PALETTE.charcoal}
            strokeWidth={3.5}
            seed={7}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: PALETTE.charcoal,
                  letterSpacing: 1,
                }}
              >
                🔄 VÒNG LẶP TỰ HÀNH (AUTONOMOUS LOOP):
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: PALETTE.charcoal,
                }}
              >
                <span>Nhận Mục Tiêu</span>
                <span>➡️</span>
                <span>Lập Kế Hoạch</span>
                <span>➡️</span>
                <span>Gọi Công Cụ</span>
                <span>➡️</span>
                <span>Đánh Giá</span>
              </div>
            </div>
          </HandDrawnBox>
        </div>
      )}

      {/* Highlight Banner: WE ARE HERE! */}
      {bannerPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 350,
            left: 100,
            right: 140,
            transform: `scale(${bannerPop}) rotate(${-2 + boil}deg)`,
          }}
        >
          <HandDrawnBox
            width={780}
            height={110}
            fillColor={PALETTE.coralRed}
            fillOpacity={0.95}
            strokeColor={PALETTE.charcoal}
            strokeWidth={3.5}
            seed={9}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 38 }}>📍</span>
              <span
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Năm 2025 - 2026: Nhân loại đang bùng nổ ở Level 2!
              </span>
            </div>
          </HandDrawnBox>
        </div>
      )}
    </div>
  );
};
