import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ThreeCanvasContainer } from "../core/ThreeCanvasContainer";
import type { Scene3DConfig } from "../core/types";
import { GeometryObject } from "../objects/Geometries";
import { ParticleCloud } from "../objects/ParticleCloud";

export interface HybridCallout {
  title: string;
  desc: string;
  side: "left" | "right";
  yPercent: number; // 0 to 100
}

export interface HybridExplainerProps {
  title?: string;
  subtitle?: string;
  callouts?: HybridCallout[];
  durationInFrames?: number;
}

export const Template06HybridExplainer: React.FC<HybridExplainerProps> = ({
  title = "AI Neural Engine Core",
  subtitle = "Sự kết hợp giữa 3D Motion Graphics và 2D UI Card",
  callouts = [
    {
      title: "Tensor Cores 3D",
      desc: "Xử lý song song ma trận 16-bit",
      side: "left",
      yPercent: 32,
    },
    {
      title: "Zero-Copy Memory",
      desc: "Tối ưu băng thông VRAM siêu tốc",
      side: "right",
      yPercent: 44,
    },
    {
      title: "ONNX Runtime",
      desc: "Khởi chạy inference không phụ thuộc PyTorch",
      side: "left",
      yPercent: 56,
    },
  ],
  durationInFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneConfig: Scene3DConfig = {
    id: "hybrid-explainer",
    type: "3d-hybrid-explainer",
    durationInFrames,
    camera: {
      preset: "orbit",
      distance: 6.2,
      speed: 0.6,
    },
    lighting: {
      preset: "cyberpunk",
      ambientIntensity: 0.5,
      mainLightIntensity: 2.2,
    },
    background: "#080B15",
    objects: [],
    captionOverlay: {
      badge: "Hybrid 2D + 3D Architecture",
      title,
      subtitle,
      safeArea: true,
    },
  };

  return (
    <AbsoluteFill style={{ position: "relative", overflow: "hidden" }}>
      {/* 3D Background & Central Object Layer */}
      <ThreeCanvasContainer config={sceneConfig}>
        {/* Central Complex 3D Node (Cube + Nested Orbiting Torus) */}
        <GeometryObject
          config={{
            id: "core-cube",
            type: "cube",
            args: [1.6, 1.6, 1.6],
            position: [0, 0, 0],
            color: "#38BDF8",
            wireframe: true,
            animation: {
              type: "rotate",
              axis: "all",
              speed: 0.8,
            },
          }}
        />

        <GeometryObject
          config={{
            id: "inner-sphere",
            type: "sphere",
            args: [0.75, 32, 32],
            position: [0, 0, 0],
            color: "#F59E0B",
            metalness: 0.6,
            roughness: 0.2,
            animation: {
              type: "pulse",
              speed: 1.2,
            },
          }}
        />

        <GeometryObject
          config={{
            id: "outer-torus",
            type: "torus",
            args: [2.2, 0.08, 24, 48],
            position: [0, 0, 0],
            color: "#EC4899",
            animation: {
              type: "rotate",
              axis: "all",
              speed: -1.2,
            },
          }}
        />

        {/* Ambient Particles */}
        <ParticleCloud
          config={{
            id: "ambient-particles",
            type: "particles",
            count: 300,
            spread: 7,
            particleSize: 0.05,
            color: "#38BDF8",
            seed: 555,
          }}
        />
      </ThreeCanvasContainer>

      {/* 2D Callout Cards Overlay (Positioned along left & right) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        {callouts.map((callout, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - 15 - idx * 18),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const isLeft = callout.side === "left";
          const slideX = interpolate(
            cardSpring,
            [0, 1],
            [isLeft ? -100 : 100, 0]
          );

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: `${callout.yPercent}%`,
                left: isLeft ? 60 : "auto",
                right: isLeft ? "auto" : 60,
                transform: `translateX(${slideX}px) scale(${cardSpring})`,
                opacity: cardSpring,
                maxWidth: 420,
                backgroundColor: "rgba(15, 23, 42, 0.92)",
                backdropFilter: "blur(14px)",
                border: `2px solid ${isLeft ? "#38BDF8" : "#F59E0B"}`,
                borderRadius: 20,
                padding: "16px 22px",
                boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: isLeft ? "#38BDF8" : "#F59E0B",
                    boxShadow: `0 0 10px ${isLeft ? "#38BDF8" : "#F59E0B"}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {callout.title}
                </span>
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "#94A3B8",
                  fontWeight: 500,
                  lineHeight: 1.35,
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {callout.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
