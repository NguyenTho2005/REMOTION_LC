import React from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

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
          fov: TWO_SUM_SPECS.camera.fov,
          position: [0, 0.8, 10.5],
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
        <pointLight position={[0, 4, 3]} intensity={1.2} color="#F59E0B" />

        <CameraRig preset="default" />

        {/* 3D Array with Highlight on 2 and 7 */}
        <ThreeDArray
          items={[
            { value: 2, index: 0, status: "match", customOffsetY: 0.4 },
            { value: 7, index: 1, status: "match", customOffsetY: 0.4 },
            { value: 11, index: 2, status: "dim" },
            { value: 15, index: 3, status: "dim" },
          ]}
          position={[0, -0.6, 0]}
          frame={frame}
        />
      </ThreeCanvas>

      {/* 2D Overlay: Target & Problem Specs */}
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
        {/* Target Badge */}
        <div
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            border: `3px solid ${TWO_SUM_COLORS.target}`,
            borderRadius: 24,
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 0 30px rgba(245, 158, 11, 0.3)",
          }}
        >
          <span style={{ fontSize: 24, color: TWO_SUM_COLORS.target, fontWeight: 800 }}>MỤC TIÊU:</span>
          <span style={{ fontSize: 48, color: "#FFFFFF", fontWeight: 900 }}>Target = 9</span>
        </div>

        {/* Essential Rule: Return Indices! */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "2px solid #38BDF8",
            borderRadius: 18,
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            maxWidth: 820,
          }}
        >
          <span style={{ fontSize: 26 }}>💡</span>
          <span style={{ fontSize: 22, color: "#F8FAFC", fontWeight: 700 }}>
            Kết quả là <strong style={{ color: "#38BDF8" }}>chỉ số [0, 1]</strong> (không phải giá trị [2, 7]!)
          </span>
        </div>
      </div>
    </div>
  );
};
