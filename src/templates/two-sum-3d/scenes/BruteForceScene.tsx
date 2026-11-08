import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";
import { ThreeDPointer } from "../components/ThreeDPointer";

export const BruteForceScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Pointer J cycles through indices 1, 2, 3
  const pointerJIdx = Math.min(3, Math.max(1, Math.floor(interpolate(frame, [0, 80, 160, 260], [1, 2, 3, 3]))));

  const currentSum = 2 + (pointerJIdx === 1 ? 7 : pointerJIdx === 2 ? 11 : 15);
  const isTargetMatched = currentSum === 9;

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
        <pointLight position={[0, 4, 3]} intensity={1.0} color="#38BDF8" />

        <CameraRig preset="default" />

        <ThreeDArray
          items={[
            { value: 2, index: 0, status: "active" },
            { value: 7, index: 1, status: pointerJIdx === 1 ? (isTargetMatched ? "match" : "danger") : "idle" },
            { value: 11, index: 2, status: pointerJIdx === 2 ? "danger" : "idle" },
            { value: 15, index: 3, status: pointerJIdx === 3 ? "danger" : "idle" },
          ]}
          position={[0, -0.6, 0]}
          frame={frame}
        />

        {/* Pointers i and j */}
        <ThreeDPointer type="i" targetIndex={0} frame={frame} yOffset={1.4} />
        <ThreeDPointer type="j" targetIndex={pointerJIdx} frame={frame} yOffset={1.4} />
      </ThreeCanvas>

      {/* 2D Overlay: Nested Loop Code & Sum Evaluation */}
      <div
        style={{
          position: "absolute",
          top: TWO_SUM_SPECS.safeArea.top,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          pointerEvents: "none",
        }}
      >
        {/* Title */}
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.18)",
            border: `2px solid ${TWO_SUM_COLORS.bruteForceSlow}`,
            borderRadius: 20,
            padding: "8px 26px",
            color: TWO_SUM_COLORS.bruteForceSlow,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          CÁCH 1 · VÉT CẠN (BRUTE FORCE)
        </div>

        {/* Live Sum Tracker */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${isTargetMatched ? TWO_SUM_COLORS.matchSuccess : TWO_SUM_COLORS.bruteForceSlow}`,
            borderRadius: 20,
            padding: "14px 32px",
            fontSize: 28,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          nums[0] + nums[{pointerJIdx}] = 2 + {pointerJIdx === 1 ? 7 : pointerJIdx === 2 ? 11 : 15} ={" "}
          <strong style={{ color: isTargetMatched ? TWO_SUM_COLORS.matchSuccess : TWO_SUM_COLORS.bruteForceSlow }}>
            {currentSum} {isTargetMatched ? "== 9 (Khớp!)" : "≠ 9"}
          </strong>
        </div>

        {/* Pseudocode snippet */}
        <div
          style={{
            backgroundColor: "rgba(10, 15, 26, 0.9)",
            border: "2px solid #334155",
            borderRadius: 16,
            padding: "16px 24px",
            fontFamily: "monospace",
            fontSize: 20,
            color: "#E2E8F0",
            maxWidth: 760,
            width: "90%",
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: "#38BDF8" }}>for (let i = 0; i &lt; n; i++) &#123;</div>
          <div style={{ paddingLeft: 20, color: "#FB923C" }}>for (let j = i + 1; j &lt; n; j++) &#123;</div>
          <div style={{ paddingLeft: 40, color: "#94A3B8" }}>
            if (nums[i] + nums[j] === target) return [i, j];
          </div>
          <div style={{ paddingLeft: 20 }}>&#125;</div>
          <div>&#125;</div>
        </div>
      </div>
    </div>
  );
};
