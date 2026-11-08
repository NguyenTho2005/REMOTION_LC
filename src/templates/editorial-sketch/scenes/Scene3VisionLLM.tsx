import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RoughBox, RoughArrow, HighlighterStripe } from "../components/RoughDrawing.tsx";
import { EditorialCaptions } from "../components/EditorialCaptions.tsx";
import type { SceneManifest } from "../../../types/schema.ts";

export const Scene3VisionLLM: React.FC<{ scene: SceneManifest }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Diagram zoom & pan motion: subtle camera tracking downward as the pipeline progresses
  const panY = interpolate(frame, [0, 180, 360], [0, -40, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoomScale = interpolate(frame, [0, 200, 360], [1.0, 1.03, 1.05], {
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
            color: "#2B5B6C", // Xanh cổ vịt trầm
            letterSpacing: "0.08em",
          }}
        >
          ● CƠ CHẾ 01: THỊ GIÁC ĐA PHƯƠNG THỨC
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            color: "#1E1E1C",
            opacity: 0.7,
          }}
        >
          [QWEN2-VL & GPT-4o]
        </span>
      </div>

      {/* Main Zoom-Pan Canvas */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 60,
          width: 960,
          height: 1200,
          transform: `translateY(${panY}px) scale(${zoomScale})`,
          transformOrigin: "50% 30%",
        }}
      >
        <svg
          viewBox="0 0 960 1200"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Step 1: Video Ingestion Box */}
          <RoughBox
            x={100}
            y={20}
            width={760}
            height={200}
            stroke="#1E1E1C"
            strokeWidth={2.8}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.5}
            seed={71}
            delayFrames={5}
          />
          <HighlighterStripe
            x={130}
            y={40}
            width={340}
            height={36}
            color="#2B5B6C"
            delayFrames={8}
            seed={72}
          />

          {/* Arrow 1 -> 2 */}
          <RoughArrow
            x1={480}
            y1={230}
            x2={480}
            y2={330}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={81}
            delayFrames={18}
          />

          {/* Step 2: Multi-Modal Vision Brain */}
          <RoughBox
            x={60}
            y={340}
            width={840}
            height={340}
            stroke="#2B5B6C"
            strokeWidth={3.2}
            fill="#F4F1EA"
            fillStyle="hachure"
            roughness={1.6}
            seed={73}
            delayFrames={22}
          />
          <HighlighterStripe
            x={100}
            y={360}
            width={480}
            height={40}
            color="#E5A93C"
            delayFrames={25}
            seed={74}
          />

          {/* Arrow 2 -> 3 */}
          <RoughArrow
            x1={480}
            y1={690}
            x2={480}
            y2={790}
            stroke="#1E1E1C"
            strokeWidth={3}
            seed={82}
            delayFrames={35}
          />

          {/* Step 3: Script & Narrative Synthesis Box */}
          <RoughBox
            x={100}
            y={800}
            width={760}
            height={260}
            stroke="#D94E34"
            strokeWidth={3}
            fill="#EFECE6"
            fillStyle="solid"
            roughness={1.5}
            seed={75}
            delayFrames={40}
          />
          <HighlighterStripe
            x={130}
            y={820}
            width={460}
            height={36}
            color="#D94E34"
            delayFrames={43}
            seed={76}
          />
        </svg>

        {/* Content Inside Step 1 */}
        <div
          style={{
            position: "absolute",
            top: 25,
            left: 120,
            width: 720,
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
            BƯỚC 1: TRÍCH XUẤT KHUNG HÌNH (SAMPLING)
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              gap: 16,
            }}
          >
            {["Frame 001: Mở màn", "Frame 180: Cao trào", "Frame 420: Kết màn"].map(
              (label, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "2px dashed #1E1E1C",
                    borderRadius: 4,
                    backgroundColor: "#F4F1EA",
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1E1E1C",
                  }}
                >
                  🎞️ {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Content Inside Step 2: Vision Model Core */}
        <div
          style={{
            position: "absolute",
            top: 350,
            left: 90,
            width: 780,
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
            BƯỚC 2: PHÂN TÍCH THỊ GIÁC ĐA PHƯƠNG THỨC
          </div>

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #2B5B6C",
                borderRadius: 8,
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#2B5B6C",
                  marginBottom: 8,
                }}
              >
                🧠 Qwen2-VL / Pegasus
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: "#2C2C28",
                }}
              >
                Nhận diện từng hành động nhân vật, bối cảnh ánh sáng và diễn biến tâm lý
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #E5A93C",
                borderRadius: 8,
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#9A6A14",
                  marginBottom: 8,
                }}
              >
                🎯 Trích Xuất Key Moment
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: "#2C2C28",
                }}
              >
                Tự động đánh dấu giây xuất hiện của nút thắt câu chuyện để dựng recap
              </p>
            </div>
          </div>
        </div>

        {/* Content Inside Step 3: Script Drafting */}
        <div
          style={{
            position: "absolute",
            top: 810,
            left: 120,
            width: 720,
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
            BƯỚC 3: LLM TỔNG HỢP KỊCH BẢN DẪN CHUYỆN
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
            <div style={{ color: "#D94E34", fontWeight: 700 }}>
              &gt; Script Prompting: Nhịp điệu kịch tính, lôi cuốn, văn phong chuẩn TikTok
            </div>
            <div style={{ color: "#2B5B6C", marginTop: 6 }}>
              &gt; Phân hồi 6 phân cảnh: Hook → Bối cảnh → Nút thắt → Giải quyết → CTA
            </div>
          </div>
        </div>
      </div>

      {/* Captions */}
      <EditorialCaptions captions={scene.captions} accentColor="#2B5B6C" />
    </div>
  );
};
