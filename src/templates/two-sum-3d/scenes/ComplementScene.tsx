import React from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";
import { HashMapBoard } from "../components/HashMapBoard";

export const ComplementScene: React.FC = () => {
  const frame = useCurrentFrame();

  const isStep2 = frame >= 200;

  // Step 1: current = 2, complement = 7, map has [] -> insert 2 -> 0
  // Step 2: current = 7, complement = 2, map has [2 -> 0] -> MATCH!
  const currentNum = isStep2 ? 7 : 2;
  const currentIdx = isStep2 ? 1 : 0;
  const complement = 9 - currentNum;

  const mapEntries = isStep2
    ? [{ key: 2, value: 0, highlight: true }]
    : frame > 120
    ? [{ key: 2, value: 0, highlight: false }]
    : [];

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
          position: [0, 0.9, 10.2],
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
        <pointLight position={[0, -1, 4]} intensity={isStep2 ? 1.5 : 1.0} color={isStep2 ? "#10B981" : "#38BDF8"} />

        <CameraRig preset="default" />

        {/* 3D Array */}
        <ThreeDArray
          items={[
            {
              value: 2,
              index: 0,
              status: isStep2 ? "match" : currentIdx === 0 ? "active" : "idle",
              customOffsetY: isStep2 ? 0.3 : currentIdx === 0 ? 0.4 : 0,
            },
            {
              value: 7,
              index: 1,
              status: isStep2 ? "match" : "idle",
              customOffsetY: isStep2 ? 0.3 : 0,
            },
            { value: 11, index: 2, status: "dim" },
            { value: 15, index: 3, status: "dim" },
          ]}
          position={[0, 1.9, 0]}
          scale={0.9}
          frame={frame}
        />

        {/* 3D Hash Map Board */}
        <HashMapBoard
          entries={mapEntries}
          position={[0, -1.1, 0]}
          scale={1.0}
          activeComplementKey={isStep2 ? 2 : null}
          frame={frame}
        />
      </ThreeCanvas>

      {/* 2D Header & Complement Formula Tracker */}
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
            backgroundColor: "rgba(96, 165, 250, 0.2)",
            border: `2px solid ${TWO_SUM_COLORS.hashMapKey}`,
            borderRadius: 24,
            padding: "8px 28px",
            color: TWO_SUM_COLORS.hashMapKey,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {isStep2 ? "BƯỚC 2 · PHÁT HIỆN PHẦN BÙ!" : "BƯỚC 1 · TÍNH PHẦN BÙ"}
        </div>

        {/* Dynamic Complement Equation */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: `3px solid ${isStep2 ? TWO_SUM_COLORS.matchSuccess : TWO_SUM_COLORS.target}`,
            borderRadius: 24,
            padding: "16px 36px",
            fontSize: 34,
            fontWeight: 900,
            color: "#FFFFFF",
            boxShadow: isStep2
              ? "0 0 30px rgba(16, 185, 129, 0.4)"
              : "0 0 20px rgba(245, 158, 11, 0.2)",
          }}
        >
          Target (9) - Số ({currentNum}) ={" "}
          <strong style={{ color: isStep2 ? TWO_SUM_COLORS.matchSuccess : TWO_SUM_COLORS.target }}>
            Phần bù ({complement})
          </strong>
        </div>

        {/* Status Callout */}
        <div
          style={{
            backgroundColor: isStep2 ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.8)",
            border: `2px solid ${isStep2 ? TWO_SUM_COLORS.matchSuccess : "#475569"}`,
            borderRadius: 16,
            padding: "10px 24px",
            fontSize: 20,
            fontWeight: 700,
            color: isStep2 ? "#A7F3D0" : "#CBD5E1",
          }}
        >
          {isStep2
            ? "✓ Số 2 ĐÃ CÓ trong Hash Map tại index 0! Khớp ngay lập tức!"
            : "Chưa có số 7 trong bảng → Lưu { 2: index 0 } vào Hash Map."}
        </div>
      </div>
    </div>
  );
};
