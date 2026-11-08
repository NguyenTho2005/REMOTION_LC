import React from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";

export const MatchScene: React.FC = () => {
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
          fov: 42,
          position: [0, 0.8, 10.0],
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 8, 6]} intensity={1.8} />
        <pointLight position={[0, 0, 4]} intensity={1.8} color="#10B981" />

        <CameraRig preset="focusCenter" />

        {/* 3D Array with Tiles 2 and 7 glowing and coming close */}
        <ThreeDArray
          items={[
            { value: 2, index: 0, status: "match" },
            { value: 7, index: 1, status: "match" },
            { value: 11, index: 2, status: "dim" },
            { value: 15, index: 3, status: "dim" },
          ]}
          position={[0, -0.4, 0]}
          frame={frame}
        />
      </ThreeCanvas>

      {/* 2D Header & Victory Output Banner */}
      <div
        style={{
          position: "absolute",
          top: TWO_SUM_SPECS.safeArea.top,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.25)",
            border: `2px solid ${TWO_SUM_COLORS.matchSuccess}`,
            borderRadius: 24,
            padding: "8px 32px",
            color: TWO_SUM_COLORS.matchSuccess,
            fontSize: 24,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          KẾT QUẢ KHỚP HOÀN HẢO!
        </div>

        {/* Math Equation Payoff */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
          }}
        >
          2 + 7 = <span style={{ color: TWO_SUM_COLORS.target }}>9</span>
        </div>

        {/* Giant Output Result */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: `4px solid ${TWO_SUM_COLORS.matchSuccess}`,
            borderRadius: 28,
            padding: "20px 48px",
            boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 20, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
            OUTPUT CHỈ SỐ:
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: TWO_SUM_COLORS.matchSuccess,
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            [0, 1]
          </div>
        </div>

        <div
          style={{
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            border: "1.5px solid #38BDF8",
            borderRadius: 16,
            padding: "10px 24px",
            fontSize: 20,
            fontWeight: 700,
            color: "#E0F2FE",
          }}
        >
          ⚡ Chỉ tốn đúng 1 lần duyệt: Thời gian O(n)!
        </div>
      </div>
    </div>
  );
};
