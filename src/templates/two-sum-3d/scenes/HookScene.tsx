import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";
import { ThreeDPointer } from "../components/ThreeDPointer";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Pointer J scanning back and forth
  const pointerJIdx = Math.min(3, Math.floor(interpolate(frame, [0, 80, 160, 234], [1, 2, 3, 1])));

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
      {/* 3D Scene */}
      <ThreeCanvas
        width={TWO_SUM_SPECS.width}
        height={TWO_SUM_SPECS.height}
        camera={{
          fov: TWO_SUM_SPECS.camera.fov,
          position: TWO_SUM_SPECS.camera.position,
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
        <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[5, -2, 3]} intensity={0.6} color="#F59E0B" />

        <CameraRig preset="dollyIn" />

        {/* 3D Array */}
        <ThreeDArray
          items={[
            { value: 2, index: 0, status: "active" },
            { value: 7, index: 1, status: pointerJIdx === 1 ? "complement" : "idle" },
            { value: 11, index: 2, status: pointerJIdx === 2 ? "complement" : "idle" },
            { value: 15, index: 3, status: pointerJIdx === 3 ? "complement" : "idle" },
          ]}
          position={[0, -0.4, 0]}
          frame={frame}
        />

        {/* Pointer I and J scanning */}
        <ThreeDPointer type="i" targetIndex={0} frame={frame} yOffset={1.4} />
        <ThreeDPointer type="j" targetIndex={pointerJIdx} frame={frame} yOffset={1.4} />
      </ThreeCanvas>

      {/* 2D Header Badge */}
      <div
        style={{
          position: "absolute",
          top: TWO_SUM_SPECS.safeArea.top,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.15)",
            border: `2px solid ${TWO_SUM_COLORS.target}`,
            borderRadius: 30,
            padding: "8px 28px",
            color: TWO_SUM_COLORS.target,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          LeetCode #1 · Bài Toán Kinh Điển
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          TWO SUM
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: TWO_SUM_COLORS.textSecondary,
          }}
        >
          <span style={{ color: TWO_SUM_COLORS.bruteForceSlow }}>Vét Cạn O(n²)</span> vs{" "}
          <span style={{ color: TWO_SUM_COLORS.matchSuccess }}>Hash Map O(n)</span>
        </div>
      </div>
    </div>
  );
};
