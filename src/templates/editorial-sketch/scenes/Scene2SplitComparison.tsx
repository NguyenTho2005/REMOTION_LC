import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RoughBox, RoughCircle, HighlighterStripe } from "../components/RoughDrawing.tsx";
import { EditorialCaptions } from "../components/EditorialCaptions.tsx";
import type { SceneManifest } from "../../../types/schema.ts";

export const Scene2SplitComparison: React.FC<{ scene: SceneManifest }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const dividerSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  const rightCardSpring = spring({
    frame: frame - 20,
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
            color: "#D94E34",
            letterSpacing: "0.08em",
          }}
        >
          ● SO SÁNH QUY TRÌNH (BEFORE vs AFTER)
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            color: "#1E1E1C",
            opacity: 0.7,
          }}
        >
          TIẾT KIỆM 95% THỜI GIAN
        </span>
      </div>

      {/* Main Comparison Container */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 70,
          width: 940,
          height: 1160,
        }}
      >
        <svg
          viewBox="0 0 940 1160"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Vertical Hand-Drawn Dividing Line */}
          <line
            x1={470}
            y1={40}
            x2={470}
            y2={40 + 960 * dividerSpring}
            stroke="#1E1E1C"
            strokeWidth={2.8}
            strokeDasharray="14 10"
            strokeOpacity={0.4}
          />

          {/* Left Column Box (Manual Workflow) */}
          <RoughBox
            x={20}
            y={30}
            width={420}
            height={980}
            stroke="#1E1E1C"
            strokeWidth={2.5}
            fill="#EFECE6"
            fillStyle="hachure"
            roughness={1.5}
            seed={44}
            delayFrames={5}
          />

          {/* Left Column Red Header Highlighter */}
          <HighlighterStripe
            x={40}
            y={50}
            width={380}
            height={46}
            color="#D94E34"
            delayFrames={8}
            seed={45}
          />

          {/* Right Column Box (NarratoAI Workflow) */}
          <RoughBox
            x={500}
            y={30}
            width={420}
            height={980}
            stroke="#2B5B6C"
            strokeWidth={3}
            fill="#F4F1EA"
            fillStyle="solid"
            roughness={1.5}
            seed={55}
            delayFrames={15}
          />

          {/* Right Column Teal Header Highlighter */}
          <HighlighterStripe
            x={520}
            y={50}
            width={380}
            height={46}
            color="#2B5B6C"
            delayFrames={18}
            seed={56}
          />

          {/* Big Red Strikethrough Cross on Left Column */}
          <g
            style={{
              opacity: Math.min(
                0.85,
                spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 100 } })
              ),
            }}
          >
            <line
              x1={60}
              y1={240}
              x2={400}
              y2={540}
              stroke="#D94E34"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <line
              x1={400}
              y1={240}
              x2={60}
              y2={540}
              stroke="#D94E34"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </g>

          {/* Green/Teal Hand-Drawn Checkmark on Right Column */}
          <path
            d="M 640 400 L 700 460 L 820 330"
            fill="none"
            stroke="#2B5B6C"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: Math.max(
                0,
                300 * (1 - rightCardSpring)
              ),
            }}
          />

          {/* Rough Circle around Time Saved */}
          <RoughCircle
            cx={710}
            cy={860}
            diameter={170}
            stroke="#E5A93C"
            strokeWidth={3.5}
            roughness={1.7}
            seed={88}
            delayFrames={35}
          />
        </svg>

        {/* Text Content Overlay: Left Column */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 30,
            width: 400,
            padding: "16px 12px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
            }}
          >
            THỦ CÔNG (TRƯỚC ĐÂY)
          </h2>
          <p
            style={{
              margin: "8px 0 30px 0",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: "#D94E34",
            }}
          >
            ⏳ 4 ĐẾN 6 TIẾNG / VIDEO
          </p>

          <div
            style={{
              textAlign: "left",
              padding: "0 14px",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 22,
              lineHeight: 1.8,
              color: "#1E1E1C",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              ❌ <b>Xem lại phim thô:</b> Tốn 2 tiếng lọc keyframes từng phút
            </div>
            <div style={{ marginBottom: 20 }}>
              ❌ <b>Tự viết kịch bản:</b> Cốt truyện lủng củng, bí ý tưởng
            </div>
            <div style={{ marginBottom: 20 }}>
              ❌ <b>Tự thu âm lồng tiếng:</b> Giọng mệt mỏi, dính tạp âm
            </div>
            <div style={{ marginBottom: 20 }}>
              ❌ <b>Cắt ghép & phụ đề:</b> Lệch mili-giây, kéo timeline mỏi tay
            </div>
          </div>
        </div>

        {/* Text Content Overlay: Right Column */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 510,
            width: 400,
            padding: "16px 12px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
            }}
          >
            NARRATOAI (HIỆN TẠI)
          </h2>
          <p
            style={{
              margin: "8px 0 30px 0",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: "#2B5B6C",
            }}
          >
            ⚡ CHỈ 3 PHÚT TỰ ĐỘNG
          </p>

          <div
            style={{
              textAlign: "left",
              padding: "0 14px",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 22,
              lineHeight: 1.8,
              color: "#1E1E1C",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              ✨ <b>Vision LLM Ingestion:</b> Qwen2-VL tự hiểu bối cảnh phim
            </div>
            <div style={{ marginBottom: 20 }}>
              ✨ <b>Tự viết thoại lôi cuốn:</b> Cấu trúc kịch bản 6 hồi chuẩn xác
            </div>
            <div style={{ marginBottom: 20 }}>
              ✨ <b>ZeroTTS Speech:</b> Giọng đọc 48kHz chuẩn phát thanh viên
            </div>
            <div style={{ marginBottom: 20 }}>
              ✨ <b>CapCut Draft Ready:</b> Tự động khớp timestamp 100%
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              fontFamily: "'Caveat', cursive",
              fontSize: 34,
              fontWeight: 700,
              color: "#D94E34",
            }}
          >
            Nhanh gấp 120 lần!
          </div>
        </div>
      </div>

      {/* Captions */}
      <EditorialCaptions captions={scene.captions} accentColor="#D94E34" />
    </div>
  );
};
