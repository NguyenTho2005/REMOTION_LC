import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RoughBox, RoughCircle, HighlighterStripe } from "../components/RoughDrawing.tsx";
import { EditorialCaptions } from "../components/EditorialCaptions.tsx";
import type { SceneManifest } from "../../../types/schema.ts";

export const Scene1Hook: React.FC<{ scene: SceneManifest }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Clapperboard arm angle
  const clapSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const clapAngle = Math.max(-25, -25 + clapSpring * 25);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        pointerEvents: "none",
      }}
    >
      {/* Top Editorial Category Pill */}
      <div
        style={{
          position: "absolute",
          top: 180, // In TikTok safe zone
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: Math.min(1, enterSpring * 1.5),
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            fontWeight: 700,
            color: "#D94E34", // Đỏ son
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ● MÃ NGUỒN MỞ ĐỘT PHÁ
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            fontWeight: 600,
            color: "#1E1E1C",
            opacity: 0.7,
          }}
        >
          [PYTHON + AI VISION]
        </span>
      </div>

      {/* Main Illustration Area: Hand-Drawn Film Reel & Clapperboard */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 100,
          width: 880,
          height: 640,
        }}
      >
        <svg
          viewBox="0 0 880 640"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Film Reel Outline */}
          <RoughCircle
            cx={440}
            cy={240}
            diameter={280}
            stroke="#1E1E1C"
            strokeWidth={3}
            roughness={1.5}
            seed={12}
            delayFrames={5}
          />
          <RoughCircle
            cx={440}
            cy={240}
            diameter={90}
            stroke="#1E1E1C"
            strokeWidth={2.5}
            fill="#EFECE6"
            roughness={1.3}
            seed={13}
            delayFrames={10}
          />

          {/* Film Reel Holes */}
          <RoughCircle cx={370} cy={240} diameter={40} stroke="#1E1E1C" strokeWidth={2} roughness={1.2} seed={14} delayFrames={12} />
          <RoughCircle cx={510} cy={240} diameter={40} stroke="#1E1E1C" strokeWidth={2} roughness={1.2} seed={15} delayFrames={12} />
          <RoughCircle cx={440} cy={170} diameter={40} stroke="#1E1E1C" strokeWidth={2} roughness={1.2} seed={16} delayFrames={14} />
          <RoughCircle cx={440} cy={310} diameter={40} stroke="#1E1E1C" strokeWidth={2} roughness={1.2} seed={17} delayFrames={14} />

          {/* Clapperboard Body */}
          <RoughBox
            x={220}
            y={360}
            width={440}
            height={220}
            stroke="#1E1E1C"
            strokeWidth={3}
            fill="#F4F1EA"
            fillStyle="solid"
            seed={22}
            delayFrames={12}
          />

          {/* Clapperboard Slanted Stripes */}
          <g transform={`rotate(${clapAngle} 220 360)`}>
            <RoughBox
              x={220}
              y={320}
              width={440}
              height={45}
              stroke="#1E1E1C"
              strokeWidth={2.5}
              fill="#1E1E1C"
              fillStyle="hachure"
              seed={23}
              delayFrames={15}
            />
          </g>

          {/* AI Lightning Spark */}
          <path
            d="M 680 150 L 640 220 L 675 220 L 630 310 L 710 200 L 670 200 Z"
            fill="#E5A93C"
            stroke="#1E1E1C"
            strokeWidth={2.5}
            strokeLinejoin="round"
            style={{
              transformOrigin: "670px 230px",
              transform: `scale(${spring({ frame: frame - 18, fps, config: { damping: 10, stiffness: 180 } })})`,
            }}
          />

          {/* Text written on clapperboard */}
          <text
            x={440}
            y={440}
            textAnchor="middle"
            fill="#1E1E1C"
            fontFamily="'JetBrains Mono', monospace"
            fontSize={26}
            fontWeight="bold"
          >
            SCENE: AUTO_VIDEO_01
          </text>
          <text
            x={440}
            y={490}
            textAnchor="middle"
            fill="#D94E34"
            fontFamily="'JetBrains Mono', monospace"
            fontSize={28}
            fontWeight="800"
          >
            AI COMMENTARY ENGINE
          </text>
          <text
            x={440}
            y={540}
            textAnchor="middle"
            fill="#2B5B6C"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontSize={20}
            fontWeight="600"
          >
            TAKE: 01 | ROLL: 2025
          </text>
        </svg>
      </div>

      {/* Hero Headline & Kinetic Hand-Drawn Title */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: Math.min(1, enterSpring * 1.5),
          transform: `translateY(${(1 - enterSpring) * 20}px)`,
        }}
      >
        <svg
          viewBox="0 0 920 180"
          style={{ width: "100%", height: 180, overflow: "visible" }}
        >
          {/* Highlighter under Title */}
          <HighlighterStripe
            x={180}
            y={80}
            width={560}
            height={44}
            color="#E5A93C" // Mustard yellow
            delayFrames={10}
            seed={31}
          />

          {/* Main Title text */}
          <text
            x={460}
            y={95}
            textAnchor="middle"
            fill="#1E1E1C"
            fontFamily="'Instrument Serif', 'Caveat', serif"
            fontSize={92}
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            NarratoAI
          </text>

          {/* Red son accent underline */}
          <path
            d="M 220 125 C 340 135, 580 130, 700 122"
            fill="none"
            stroke="#D94E34"
            strokeWidth={4.5}
            strokeLinecap="round"
            style={{
              strokeDasharray: 500,
              strokeDashoffset: Math.max(
                0,
                500 *
                  (1 -
                    spring({
                      frame: frame - 15,
                      fps,
                      config: { damping: 14, stiffness: 100 },
                    }))
              ),
            }}
          />
        </svg>

        <p
          style={{
            margin: "0 0 10px 0",
            fontFamily: "'Space Grotesk', 'Be Vietnam Pro', sans-serif",
            fontSize: 34,
            fontWeight: 800,
            color: "#1E1E1C",
            letterSpacing: "-0.01em",
          }}
        >
          Tự Động Hoá Bình Luận & Dựng Phim
        </p>

        <p
          style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            fontWeight: 500,
            color: "#2B5B6C", // Xanh cổ vịt trầm
          }}
        >
          Raw Video → Vision LLM → ZeroTTS → CapCut Draft
        </p>
      </div>

      {/* Feature Bullet Badges */}
      <div
        style={{
          position: "absolute",
          top: 1220,
          left: 100,
          right: 100,
          display: "flex",
          justifyContent: "space-between",
          opacity: Math.min(
            1,
            spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 120 } })
          ),
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            border: "2px solid #1E1E1C",
            borderRadius: 6,
            backgroundColor: "#EFECE6",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            fontWeight: 700,
            color: "#1E1E1C",
          }}
        >
          ⚡ 1-Click Video
        </div>
        <div
          style={{
            padding: "12px 20px",
            border: "2px solid #1E1E1C",
            borderRadius: 6,
            backgroundColor: "#EFECE6",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            fontWeight: 700,
            color: "#2B5B6C",
          }}
        >
          👁️ Multi-modal Vision
        </div>
        <div
          style={{
            padding: "12px 20px",
            border: "2px solid #1E1E1C",
            borderRadius: 6,
            backgroundColor: "#EFECE6",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            fontWeight: 700,
            color: "#D94E34",
          }}
        >
          🎙️ ZeroTTS Sync
        </div>
      </div>

      {/* Captions */}
      <EditorialCaptions captions={scene.captions} accentColor="#D94E34" />
    </div>
  );
};
