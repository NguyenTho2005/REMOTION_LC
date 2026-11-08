import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RoughBox, RoughCircle, HighlighterStripe } from "../components/RoughDrawing.tsx";
import { EditorialCaptions } from "../components/EditorialCaptions.tsx";
import type { SceneManifest } from "../../../types/schema.ts";

export const Scene6OutroCTA: React.FC<{ scene: SceneManifest }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const buttonBounce = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

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
      {/* Top Editorial Category */}
      <div
        style={{
          position: "absolute",
          top: 180,
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
            color: "#D94E34",
            letterSpacing: "0.08em",
          }}
        >
          ● TỔNG KẾT & TRẢI NGHIỆM
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            color: "#1E1E1C",
            opacity: 0.7,
          }}
        >
          [OPEN SOURCE REPO]
        </span>
      </div>

      {/* Main GitHub Showcase Card */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 80,
          width: 920,
          height: 640,
        }}
      >
        <svg
          viewBox="0 0 920 640"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Main Repo Card Box */}
          <RoughBox
            x={40}
            y={20}
            width={840}
            height={560}
            stroke="#1E1E1C"
            strokeWidth={3}
            fill="#F4F1EA"
            fillStyle="solid"
            roughness={1.5}
            seed={171}
            delayFrames={5}
          />

          {/* Yellow Highlighter under Repo Name */}
          <HighlighterStripe
            x={100}
            y={80}
            width={720}
            height={48}
            color="#E5A93C"
            delayFrames={10}
            seed={172}
          />

          {/* Hand-Drawn Octocat / Git Branch Icon */}
          <RoughCircle
            cx={150}
            cy={105}
            diameter={60}
            stroke="#1E1E1C"
            strokeWidth={2.5}
            seed={173}
            delayFrames={12}
          />

          {/* Star Counter Badge */}
          <RoughBox
            x={600}
            y={80}
            width={200}
            height={50}
            stroke="#D94E34"
            strokeWidth={2.5}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.3}
            seed={174}
            delayFrames={15}
          />
        </svg>

        {/* Text inside Repo Card */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 70,
            right: 70,
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                fontWeight: 800,
                color: "#1E1E1C",
                marginLeft: 80,
              }}
            >
              linyqh / NarratoAI
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22,
                fontWeight: 700,
                color: "#D94E34",
                marginRight: 40,
              }}
            >
              ★ GitHub Star
            </div>
          </div>

          <p
            style={{
              marginTop: 40,
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 24,
              lineHeight: 1.6,
              color: "#2C2C28",
            }}
          >
            Hệ thống tự động hoá kịch bản, lồng tiếng và dựng phim AI hoàn toàn mã nguồn mở.
            Hỗ trợ chạy local với Python 3.10+ hoặc khởi chạy nhanh qua Docker Compose.
          </p>

          <div
            style={{
              marginTop: 35,
              padding: "16px 20px",
              backgroundColor: "#EFECE6",
              border: "2px dashed #1E1E1C",
              borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              fontWeight: 600,
              color: "#1E1E1C",
            }}
          >
            $ git clone https://github.com/linyqh/NarratoAI.git
            <br />
            $ docker-compose up -d
          </div>
        </div>
      </div>

      {/* Big Kinetic Follow & CTA Button */}
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 100,
          right: 100,
          textAlign: "center",
          opacity: Math.min(1, buttonBounce * 1.5),
          transform: `scale(${0.9 + 0.1 * buttonBounce})`,
        }}
      >
        <svg
          viewBox="0 0 880 180"
          style={{ width: "100%", height: 180, overflow: "visible" }}
        >
          {/* Rough Box Button */}
          <RoughBox
            x={140}
            y={20}
            width={600}
            height={130}
            stroke="#1E1E1C"
            strokeWidth={3.5}
            fill="#D94E34" // Đỏ son
            fillStyle="solid"
            roughness={1.6}
            seed={188}
            delayFrames={20}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            top: 45,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Space Grotesk', 'Be Vietnam Pro', sans-serif",
            fontSize: 38,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "0.02em",
          }}
        >
          🔔 THEO DÕI ĐỂ KHÔNG BỎ LỠ
        </div>

        <p
          style={{
            marginTop: 20,
            fontFamily: "'Caveat', cursive",
            fontSize: 42,
            fontWeight: 700,
            color: "#1E1E1C",
          }}
        >
          Cập nhật công cụ AI và mã nguồn mở đỉnh cao mỗi ngày!
        </p>
      </div>

      {/* Captions */}
      <EditorialCaptions captions={scene.captions} accentColor="#D94E34" />
    </div>
  );
};
