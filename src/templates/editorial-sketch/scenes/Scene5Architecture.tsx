import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RoughBox, RoughArrow, HighlighterStripe } from "../components/RoughDrawing.tsx";
import { EditorialCaptions } from "../components/EditorialCaptions.tsx";
import type { SceneManifest } from "../../../types/schema.ts";

export const Scene5Architecture: React.FC<{ scene: SceneManifest }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const panY = interpolate(frame, [0, 160, 330], [0, -30, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
            color: "#2B5B6C",
            letterSpacing: "0.08em",
          }}
        >
          ● KIẾN TRÚC KỸ THUẬT & HẬU KỲ
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            color: "#1E1E1C",
            opacity: 0.7,
          }}
        >
          [PYTHON + MOVIEPY + CAPCUT]
        </span>
      </div>

      {/* Main Architecture Diagram */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 70,
          width: 940,
          height: 1180,
          transform: `translateY(${panY}px)`,
        }}
      >
        <svg
          viewBox="0 0 940 1180"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Layer 1: Streamlit Web UI */}
          <RoughBox
            x={100}
            y={20}
            width={740}
            height={180}
            stroke="#1E1E1C"
            strokeWidth={2.8}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.5}
            seed={131}
            delayFrames={5}
          />
          <HighlighterStripe
            x={130}
            y={35}
            width={380}
            height={36}
            color="#2B5B6C"
            delayFrames={8}
            seed={132}
          />

          {/* Arrow 1 -> 2 */}
          <RoughArrow
            x1={470}
            y1={210}
            x2={470}
            y2={290}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={141}
            delayFrames={14}
          />

          {/* Layer 2: Core Processing Engine */}
          <RoughBox
            x={60}
            y={300}
            width={820}
            height={280}
            stroke="#2B5B6C"
            strokeWidth={3.2}
            fill="#F4F1EA"
            fillStyle="hachure"
            roughness={1.6}
            seed={133}
            delayFrames={18}
          />
          <HighlighterStripe
            x={100}
            y={320}
            width={480}
            height={40}
            color="#E5A93C"
            delayFrames={21}
            seed={134}
          />

          {/* Arrow 2 -> Dual Output */}
          <RoughArrow
            x1={340}
            y1={590}
            x2={260}
            y2={670}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={142}
            delayFrames={28}
          />
          <RoughArrow
            x1={600}
            y1={590}
            x2={680}
            y2={670}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={143}
            delayFrames={28}
          />

          {/* Output A: MP4 Render */}
          <RoughBox
            x={60}
            y={680}
            width={380}
            height={260}
            stroke="#1E1E1C"
            strokeWidth={2.8}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.5}
            seed={135}
            delayFrames={32}
          />

          {/* Output B: CapCut / Jianying Project */}
          <RoughBox
            x={500}
            y={680}
            width={380}
            height={260}
            stroke="#D94E34"
            strokeWidth={3.2}
            fill="#F4F1EA"
            fillStyle="solid"
            roughness={1.6}
            seed={136}
            delayFrames={35}
          />
          <HighlighterStripe
            x={520}
            y={700}
            width={340}
            height={36}
            color="#D94E34"
            delayFrames={38}
            seed={137}
          />
        </svg>

        {/* Content Inside Layer 1 */}
        <div
          style={{
            position: "absolute",
            top: 25,
            left: 120,
            width: 700,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            TẦNG GIAO DIỆN: STREAMLIT WEB UI
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              color: "#1E1E1C",
            }}
          >
            Chạy local hoặc Docker container. Thao tác kéo thả video, chọn voice và chỉnh prompt trực quan.
          </div>
        </div>

        {/* Content Inside Layer 2 */}
        <div
          style={{
            position: "absolute",
            top: 310,
            left: 90,
            width: 760,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#1E1E1C",
            }}
          >
            TẦNG XỬ LÝ LÕI: PYTHON & MOVIEPY
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 21,
              lineHeight: 1.6,
              color: "#2C2C28",
            }}
          >
            <div>
              ⚡ <b>Automated Video Slicing:</b> Ghép nối frame chuẩn timeline
            </div>
            <div style={{ marginTop: 8 }}>
              🎵 <b>BGM Mixing:</b> Tự động giảm âm lượng nhạc nền khi có giọng đọc
            </div>
            <div style={{ marginTop: 8 }}>
              📝 <b>Subtitle Hardcoding:</b> Vẽ phụ đề động sắc nét từng từ
            </div>
          </div>
        </div>

        {/* Content Inside Output A */}
        <div
          style={{
            position: "absolute",
            top: 690,
            left: 80,
            width: 340,
            padding: 12,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#1E1E1C",
            }}
          >
            XUẤT VIDEO MP4
          </div>
          <p
            style={{
              marginTop: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18,
              lineHeight: 1.5,
              color: "#2C2C28",
            }}
          >
            Video hoàn thiện sẵn sàng đăng tải ngay lên TikTok, Shorts hoặc Reels
          </p>
        </div>

        {/* Content Inside Output B */}
        <div
          style={{
            position: "absolute",
            top: 690,
            left: 520,
            width: 340,
            padding: 12,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            CAPCUT DRAFT
          </div>
          <p
            style={{
              marginTop: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18,
              lineHeight: 1.5,
              color: "#1E1E1C",
              fontWeight: 600,
            }}
          >
            Mở trực tiếp trên CapCut / Jianying để tinh chỉnh hiệu ứng, sticker và transition theo ý muốn!
          </p>
        </div>
      </div>

      {/* Captions */}
      <EditorialCaptions captions={scene.captions} accentColor="#2B5B6C" />
    </div>
  );
};
