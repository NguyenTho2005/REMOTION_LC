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

export const S04Level3Multimodal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: SPRING_BOUNCE,
  });

  const exitOpacity = interpolate(frame, [460, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [460, 480], [1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boil = Math.sin(frame * 0.25) * 0.8;

  // Eye pupil tracking motion
  const pupilX = Math.sin(frame * 0.12) * 16;
  const pupilY = Math.cos(frame * 0.1) * 8;
  // Natural blink every 90 frames
  const blinkCycle = frame % 90;
  const eyeScaleY = blinkCycle > 84 ? interpolate(blinkCycle, [84, 87, 90], [1, 0.1, 1]) : 1;

  // Springs for sensory modules
  const eyePop = spring({
    frame: frame - 20,
    fps,
    config: SPRING_BOUNCE,
  });
  const earPop = spring({
    frame: frame - 60,
    fps,
    config: SPRING_BOUNCE,
  });
  const soundwavePop = spring({
    frame: frame - 100,
    fps,
    config: SPRING_DOODLE,
  });
  const fusionCardPop = spring({
    frame: frame - 190,
    fps,
    config: SPRING_BOUNCE,
  });
  const badgeListPop = spring({
    frame: frame - 290,
    fps,
    config: SPRING_BOUNCE,
  });

  // Number of soundwave bars
  const barsCount = 28;

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
          levelNumber={3}
          label="MULTIMODAL AI"
          themeColor={PALETTE.pencilBlue}
          delayFrames={5}
          rotation={-1.8}
        />

        <div style={{ marginTop: 6, maxWidth: 840 }}>
          <DoodleText
            fontSize={42}
            color={PALETTE.charcoal}
            delayFrames={15}
            staggerFrames={3}
            highlights={[
              { word: "Đa", color: PALETTE.mustardYellow },
              { word: "giác", color: PALETTE.mustardYellow },
              { word: "quan", color: PALETTE.mustardYellow },
            ]}
          >
            Đa Giác Quan: Nhìn, Nghe & Tương Tác Trực Tiếp
          </DoodleText>
        </div>
      </div>

      {/* Main Sensory Visuals Stage (Eye on left, Ear on right, Soundwaves in center) */}
      <div
        style={{
          position: "absolute",
          top: 360,
          width: 860,
          height: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HandDrawnBox
          width={860}
          height={640}
          fillColor="#FFFFFF"
          fillOpacity={0.9}
          strokeColor={PALETTE.charcoal}
          strokeWidth={4}
          rotation={-0.5}
          seed={11}
        >
          {/* Top Label */}
          <div
            style={{
              position: "absolute",
              top: 20,
              fontFamily: "'Patrick Hand', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: PALETTE.charcoalLight,
            }}
          >
            SENSORY PERCEPTION HUB (THỊ GIÁC & THÍNH GIÁC)
          </div>

          {/* Left: Giant Hand-drawn Eye SVG */}
          {eyePop > 0.05 && (
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 90,
                width: 280,
                height: 220,
                transform: `scale(${eyePop}) rotate(${boil}deg)`,
                transformOrigin: "center center",
              }}
            >
              <svg
                viewBox="0 0 280 220"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <g filter="url(#doodle-wobble)">
                  {/* Eye Contour */}
                  <g style={{ transform: `scaleY(${eyeScaleY})`, transformOrigin: "140px 110px" }}>
                    <path
                      d="M 20 110 Q 140 20 260 110 Q 140 200 20 110 Z"
                      fill="#FFFFFF"
                      stroke={PALETTE.charcoal}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 24 110 Q 140 24 256 110 Q 140 196 24 110"
                      fill="none"
                      stroke={PALETTE.charcoal}
                      strokeWidth="2"
                      opacity="0.5"
                    />

                    {/* Iris */}
                    <circle
                      cx={140 + pupilX}
                      cy={110 + pupilY}
                      r="44"
                      fill={PALETTE.pencilBlue}
                      stroke={PALETTE.charcoal}
                      strokeWidth="3.5"
                    />
                    {/* Pupil */}
                    <circle
                      cx={140 + pupilX}
                      cy={110 + pupilY}
                      r="22"
                      fill={PALETTE.charcoal}
                    />
                    {/* Catchlight */}
                    <circle
                      cx={130 + pupilX}
                      cy={100 + pupilY}
                      r="7"
                      fill="#FFFFFF"
                    />

                    {/* Eyelashes doodle */}
                    <path d="M 90 42 L 80 20" stroke={PALETTE.charcoal} strokeWidth="3" strokeLinecap="round" />
                    <path d="M 140 32 L 140 10" stroke={PALETTE.charcoal} strokeWidth="3" strokeLinecap="round" />
                    <path d="M 190 42 L 200 20" stroke={PALETTE.charcoal} strokeWidth="3" strokeLinecap="round" />
                  </g>
                </g>
              </svg>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: PALETTE.charcoal,
                  marginTop: -10,
                }}
              >
                👁️ Vision (Thị Giác)
              </div>
            </div>
          )}

          {/* Right: Giant Hand-drawn Ear & Mic SVG */}
          {earPop > 0.05 && (
            <div
              style={{
                position: "absolute",
                right: 80,
                top: 90,
                width: 280,
                height: 220,
                transform: `scale(${earPop}) rotate(${-boil}deg)`,
                transformOrigin: "center center",
              }}
            >
              <svg
                viewBox="0 0 280 220"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <g filter="url(#doodle-wobble)">
                  {/* Hand-drawn Ear outer shell */}
                  <path
                    d="M 100 170 Q 60 140 70 80 Q 80 20 150 25 Q 210 30 200 90 Q 190 140 150 160 Q 130 170 120 195 Q 110 205 95 190 Z"
                    fill={PALETTE.mustardLight}
                    stroke={PALETTE.charcoal}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Ear inner canal folds */}
                  <path
                    d="M 120 65 Q 160 70 150 110 Q 140 140 115 130"
                    fill="none"
                    stroke={PALETTE.charcoal}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 100 100 Q 125 105 120 120"
                    fill="none"
                    stroke={PALETTE.charcoal}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Soundwaves radiating towards ear */}
                  <path
                    d="M 220 50 Q 240 85 220 120"
                    fill="none"
                    stroke={PALETTE.coralRed}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                  />
                  <path
                    d="M 235 40 Q 260 85 235 130"
                    fill="none"
                    stroke={PALETTE.coralRed}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                  />
                </g>
              </svg>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: PALETTE.charcoal,
                  marginTop: -10,
                }}
              >
                👂 Audio (Thính Giác)
              </div>
            </div>
          )}

          {/* Center: Live Vibrating Soundwave SVGs */}
          {soundwavePop > 0.05 && (
            <div
              style={{
                position: "absolute",
                bottom: 50,
                left: 60,
                right: 60,
                height: 190,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${soundwavePop})`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: PALETTE.charcoalFaint,
                  marginBottom: 12,
                }}
              >
                LIVE AUDIO SINE SPECTRUM (TẦN SỐ ÂM THANH)
              </div>

              {/* Sine Wave Spectrum Bars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: 110,
                }}
              >
                {Array.from({ length: barsCount }).map((_, i) => {
                  // Audio-like sine frequency oscillation
                  const freq = Math.sin(frame * 0.22 + i * 0.38);
                  const freq2 = Math.cos(frame * 0.15 - i * 0.25);
                  const barHeight = Math.max(12, Math.abs(freq * 0.7 + freq2 * 0.3) * 95);
                  const isAccent = i % 4 === 0;

                  return (
                    <div
                      key={i}
                      style={{
                        width: 14,
                        height: barHeight,
                        backgroundColor: isAccent
                          ? PALETTE.coralRed
                          : i % 2 === 0
                            ? PALETTE.charcoal
                            : PALETTE.mustardYellow,
                        borderRadius: "8px",
                        filter: "url(#doodle-wobble)",
                        opacity: 0.85,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </HandDrawnBox>
      </div>

      {/* Cross-modal Fusion Explainer Card */}
      {fusionCardPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: 1040,
            width: 820,
            transform: `scale(${fusionCardPop}) rotate(${1.2 + boil}deg)`,
            transformOrigin: "center center",
          }}
        >
          <HandDrawnBox
            width={820}
            height={260}
            fillColor={PALETTE.mintLight}
            fillOpacity={0.8}
            strokeColor={PALETTE.charcoal}
            strokeWidth={3.5}
            seed={14}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 36 }}>⚡</span>
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 30,
                    fontWeight: 900,
                    color: PALETTE.charcoal,
                  }}
                >
                  Xử Lý Thời Gian Thực (Real-time Fusion)
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 26,
                  color: PALETTE.charcoal,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Không cần đợi gõ phím. AI có thể nhìn màn hình trực tiếp của bạn, nghe giọng nói và đàm thoại tự nhiên với độ trễ siêu thấp dưới 300ms!
              </p>
            </div>
          </HandDrawnBox>
        </div>
      )}

      {/* Model Badges */}
      {badgeListPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 300,
            display: "flex",
            gap: 20,
            transform: `scale(${badgeListPop})`,
          }}
        >
          {["GPT-4o Voice", "Gemini Live", "Claude 3.7 Vision"].map((item, idx) => (
            <div
              key={item}
              style={{
                padding: "8px 22px",
                backgroundColor: "#FFFFFF",
                border: `2px solid ${PALETTE.charcoal}`,
                borderRadius: "20px",
                fontFamily: "'Patrick Hand', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: PALETTE.charcoal,
                transform: `rotate(${((idx % 2 === 0 ? -1 : 1) * 2) + boil}deg)`,
                boxShadow: "2px 2px 0px rgba(0,0,0,0.15)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
