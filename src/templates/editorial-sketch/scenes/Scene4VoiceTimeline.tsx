import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RoughBox, RoughArrow, HighlighterStripe, RoughCircle } from "../components/RoughDrawing.tsx";
import { EditorialCaptions } from "../components/EditorialCaptions.tsx";
import type { SceneManifest } from "../../../types/schema.ts";

export const Scene4VoiceTimeline: React.FC<{ scene: SceneManifest }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
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
            color: "#E5A93C", // Vàng mù tạt
            letterSpacing: "0.08em",
          }}
        >
          ● CƠ CHẾ 02: GIỌNG NÓI & TIMESTAMPS
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            color: "#1E1E1C",
            opacity: 0.7,
          }}
        >
          [ZEROTTS ONNX RUNTIME]
        </span>
      </div>

      {/* Main Flowchart Canvas */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 80,
          width: 920,
          height: 1180,
        }}
      >
        <svg
          viewBox="0 0 920 1180"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Node 1: Script Input */}
          <RoughBox
            x={100}
            y={20}
            width={720}
            height={160}
            stroke="#1E1E1C"
            strokeWidth={2.8}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.5}
            seed={101}
            delayFrames={5}
          />
          <HighlighterStripe
            x={130}
            y={35}
            width={340}
            height={36}
            color="#E5A93C"
            delayFrames={8}
            seed={102}
          />

          {/* Arrow 1 -> 2 */}
          <RoughArrow
            x1={460}
            y1={190}
            x2={460}
            y2={270}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={111}
            delayFrames={14}
          />

          {/* Node 2: ZeroTTS Neural Synthesis */}
          <RoughBox
            x={80}
            y={280}
            width={760}
            height={280}
            stroke="#D94E34"
            strokeWidth={3.2}
            fill="#F4F1EA"
            fillStyle="hachure"
            roughness={1.6}
            seed={103}
            delayFrames={18}
          />
          <HighlighterStripe
            x={120}
            y={300}
            width={480}
            height={40}
            color="#D94E34"
            delayFrames={21}
            seed={104}
          />

          {/* Audio Waveform Doodle inside Node 2 */}
          <path
            d="M 120 490 L 160 440 L 200 520 L 240 430 L 280 540 L 320 420 L 360 550 L 400 450 L 440 530 L 480 430 L 520 540 L 560 440 L 600 530 L 640 460 L 680 520 L 720 480 L 760 490"
            fill="none"
            stroke="#D94E34"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 800,
              strokeDashoffset: Math.max(
                0,
                800 *
                  (1 -
                    spring({
                      frame: frame - 25,
                      fps,
                      config: { damping: 14, stiffness: 120 },
                    }))
              ),
            }}
          />

          {/* Arrow 2 -> 3 */}
          <RoughArrow
            x1={460}
            y1={570}
            x2={460}
            y2={650}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={112}
            delayFrames={28}
          />

          {/* Node 3: Precise Timestamp Alignment & Timeline */}
          <RoughBox
            x={100}
            y={660}
            width={720}
            height={240}
            stroke="#2B5B6C"
            strokeWidth={3}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.5}
            seed={105}
            delayFrames={32}
          />
          <HighlighterStripe
            x={130}
            y={680}
            width={440}
            height={36}
            color="#2B5B6C"
            delayFrames={35}
            seed={106}
          />

          {/* Rough Circle highlighting the 0ms precision */}
          <RoughCircle
            cx={720}
            cy={780}
            diameter={130}
            stroke="#D94E34"
            strokeWidth={3}
            roughness={1.5}
            seed={115}
            delayFrames={40}
          />
        </svg>

        {/* Text Content: Node 1 */}
        <div
          style={{
            position: "absolute",
            top: 25,
            left: 120,
            width: 680,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#1E1E1C",
            }}
          >
            1. KỊCH BẢN PHÂN HỒI (SCRIPT CHUNKS)
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              color: "#1E1E1C",
            }}
          >
            Văn bản được chuẩn hoá dấu tiếng Việt, phân đoạn theo câu ngắn gọn.
          </div>
        </div>

        {/* Text Content: Node 2 */}
        <div
          style={{
            position: "absolute",
            top: 290,
            left: 110,
            width: 700,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            2. ZEROTTS VOICE ENGINE (48,000 Hz)
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: "#D94E34",
            }}
          >
            Giọng đọc Tiếng Việt tự nhiên, ngắt nghỉ chân thực
          </div>
        </div>

        {/* Text Content: Node 3 */}
        <div
          style={{
            position: "absolute",
            top: 670,
            left: 120,
            width: 680,
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
            3. TRÍCH XUẤT TIMESTAMPS CHÍNH XÁC
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              lineHeight: 1.6,
              color: "#1E1E1C",
            }}
          >
            Khớp từng từ vào frame rate 30 FPS. Video tự động cắt chuyển cảnh ngay
            khi giọng đọc kết thúc câu!
          </div>
          <div
            style={{
              position: "absolute",
              top: 50,
              right: 10,
              fontFamily: "'Caveat', cursive",
              fontSize: 34,
              fontWeight: 700,
              color: "#D94E34",
              transform: "rotate(-6deg)",
            }}
          >
            Sai số &lt; 50ms!
          </div>
        </div>
      </div>

      {/* Captions */}
      <EditorialCaptions captions={scene.captions} accentColor="#E5A93C" />
    </div>
  );
};
