import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, SPRING_BOUNCE } from "../constants";
import { DoodleText } from "../components/DoodleText";
import { DoodleStaircase } from "../components/DoodleStaircase";
import { DoodleArrow } from "../components/DoodleArrow";
import { HandDrawnBox } from "../components/HandDrawnBox";

export const S01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for top header
  const titleSpring = spring({
    frame,
    fps,
    config: SPRING_BOUNCE,
  });

  // Dynamic camera zoom towards Level 1 as frame approaches 300
  // Frames 0-220: full overview (scale 1, translateY 0)
  // Frames 220-300: camera zooms into step 1 at bottom-left
  const cameraZoom = interpolate(frame, [0, 220, 300], [1, 1, 1.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraPanX = interpolate(frame, [0, 220, 300], [0, 0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraPanY = interpolate(frame, [0, 220, 300], [0, 0, -320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Whip pan blur/fade towards the end of scene
  const exitOpacity = interpolate(frame, [285, 300], [1, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const questionPop = spring({
    frame: frame - 90,
    fps,
    config: SPRING_BOUNCE,
  });

  const boil = Math.sin(frame * 0.3) * 0.7;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: exitOpacity,
        transform: `translate(${cameraPanX}px, ${cameraPanY}px) scale(${cameraZoom})`,
        transformOrigin: "540px 960px",
      }}
    >
      {/* Top Header Section (within TikTok Safe Zone y: 150-340) */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          right: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          zIndex: 10,
          transform: `scale(${titleSpring}) rotate(${boil * 0.5}deg)`,
        }}
      >
        {/* Main Title Badge */}
        <HandDrawnBox
          width={720}
          height={110}
          fillColor={PALETTE.mustardYellow}
          fillOpacity={0.85}
          strokeColor={PALETTE.charcoal}
          strokeWidth={3.5}
          rotation={-1.5}
        >
          <span
            style={{
              fontFamily: "'Patrick Hand', 'Caveat', sans-serif",
              fontSize: 54,
              fontWeight: 900,
              color: PALETTE.charcoal,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            ⚡ 5 CẤP ĐỘ CỦA AI ⚡
          </span>
        </HandDrawnBox>

        {/* Subtitle / Hook */}
        <div style={{ maxWidth: 840, marginTop: 8 }}>
          <DoodleText
            fontSize={36}
            color={PALETTE.charcoalLight}
            delayFrames={30}
            staggerFrames={3}
            highlights={[
              { word: "thang", color: PALETTE.mustardYellow },
              { word: "nào", color: PALETTE.coralRed },
            ]}
          >
            Bạn đang đứng ở bậc thang nào trong cuộc cách mạng này?
          </DoodleText>
        </div>
      </div>

      {/* The 5-Step Staircase Visual */}
      <DoodleStaircase
        activeStep={1}
        stickmanPosition={1}
        delayFrames={25}
        scale={0.92}
        translateY={60}
      />

      {/* Animated Arrow pointing to Level 1 */}
      {frame > 120 && (
        <DoodleArrow
          startX={80}
          startY={1260}
          endX={200}
          endY={1340}
          curveOffset={-25}
          strokeColor={PALETTE.coralRed}
          strokeWidth={4.5}
          delayFrames={120}
        />
      )}

      {/* Question callout card */}
      {questionPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 360,
            left: 100,
            right: 140,
            zIndex: 15,
            transform: `scale(${questionPop}) rotate(${1.5 + boil}deg)`,
            transformOrigin: "center center",
          }}
        >
          <HandDrawnBox
            width={780}
            height={130}
            fillColor="#FFFFFF"
            fillOpacity={0.95}
            strokeColor={PALETTE.coralRed}
            strokeWidth={3.5}
            seed={3}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span style={{ fontSize: 48 }}>💡</span>
              <span
                style={{
                  fontFamily: "'Patrick Hand', 'Caveat', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: PALETTE.charcoal,
                }}
              >
                Hầu hết chúng ta nghĩ mình đang ở rất xa... Nhưng sự thật là gì?
              </span>
            </div>
          </HandDrawnBox>
        </div>
      )}
    </div>
  );
};
