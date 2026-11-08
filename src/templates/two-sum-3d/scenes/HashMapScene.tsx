import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";
import { HashMapBoard } from "../components/HashMapBoard";

export const HashMapScene: React.FC = () => {
  const frame = useCurrentFrame();

  const boardY = interpolate(frame, [0, 60], [-4.0, -1.2], {
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
          fov: 44,
          position: [0, 1.2, 10.5],
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
        <pointLight position={[0, -1, 4]} intensity={1.2} color="#10B981" />

        <CameraRig preset="default" />

        {/* 3D Array */}
        <ThreeDArray
          items={[
            { value: 2, index: 0, status: "idle" },
            { value: 7, index: 1, status: "idle" },
            { value: 11, index: 2, status: "idle" },
            { value: 15, index: 3, status: "idle" },
          ]}
          position={[0, 1.8, 0]}
          scale={0.9}
          frame={frame}
        />

        {/* Floating 3D Hash Map Board */}
        <HashMapBoard
          entries={[]}
          position={[0, boardY, 0]}
          scale={1.05}
          frame={frame}
        />
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
          gap: 14,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            border: `2px solid ${TWO_SUM_COLORS.matchSuccess}`,
            borderRadius: 24,
            padding: "8px 28px",
            color: TWO_SUM_COLORS.matchSuccess,
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Ý TƯỞNG ĐỘT PHÁ
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
          Sử Dụng <span style={{ color: TWO_SUM_COLORS.matchSuccess }}>Hash Map</span>
        </div>

        {/* Strategy Card */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "2px solid #334155",
            borderRadius: 20,
            padding: "16px 28px",
            maxWidth: 820,
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: TWO_SUM_COLORS.target }}>
            &ldquo;Đừng tìm ở tương lai — hãy nhớ lại quá khứ!&rdquo;
          </div>
          <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6, fontWeight: 600 }}>
            Lưu mỗi số đã qua vào bảng băm để tra cứu tức thì trong O(1).
          </div>
        </div>
      </div>
    </div>
  );
};
