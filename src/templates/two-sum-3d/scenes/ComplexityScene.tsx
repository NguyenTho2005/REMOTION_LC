import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ComparisonMatrix } from "../components/ComparisonMatrix";

export const ComplexityScene: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: TWO_SUM_SPECS.width,
        height: TWO_SUM_SPECS.height,
        backgroundColor: TWO_SUM_COLORS.bgDark,
        overflow: "hidden",
      }}
    >
      <ThreeCanvas
        width={TWO_SUM_SPECS.width}
        height={TWO_SUM_SPECS.height}
        camera={{
          fov: 46,
          position: [0, 1.2, 9.5],
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 8, 6]} intensity={1.5} />
        <pointLight position={[0, 2, 4]} intensity={1.2} color="#EF4444" />

        <CameraRig preset="default" />

        <ComparisonMatrix progress={progress} position={[0, -0.4, 0]} scale={1.05} />
      </ThreeCanvas>

      {/* 2D Header & Warning Banner */}
      <div
        style={{
          position: "absolute",
          top: TWO_SUM_SPECS.safeArea.top,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: `2px solid ${TWO_SUM_COLORS.bruteForceSlow}`,
            borderRadius: 24,
            padding: "10px 30px",
            color: TWO_SUM_COLORS.bruteForceSlow,
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          ĐIỂM YẾU CỦA VÉT CẠN
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          Thời Gian: <span style={{ color: TWO_SUM_COLORS.bruteForceSlow }}>O(n²)</span>
        </div>

        {/* TLE Alert Badge */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: `2px solid ${TWO_SUM_COLORS.bruteForceSlow}`,
            borderRadius: 18,
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            maxWidth: 840,
            boxShadow: "0 10px 30px rgba(239, 68, 68, 0.25)",
          }}
        >
          <span style={{ fontSize: 28 }}>⚠️</span>
          <span style={{ fontSize: 20, color: "#F8FAFC", fontWeight: 700 }}>
            Với n = 10.000: gần <strong>50.000.000</strong> phép so sánh!
            <br />
            <span style={{ color: TWO_SUM_COLORS.bruteForceSlow }}>
              → Gặp lỗi Time Limit Exceeded (TLE) trên LeetCode!
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
