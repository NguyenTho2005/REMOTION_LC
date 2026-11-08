import React from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";
import { ThreeDArray } from "../components/ThreeDArray";

export const MistakesScene: React.FC = () => {
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
          position: [0, 0.4, 10.0],
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
        <pointLight position={[0, 1, 4]} intensity={1.2} color="#EF4444" />

        <CameraRig preset="default" />

        {/* 3D Array showing duplicate [3, 3] */}
        <ThreeDArray
          items={[
            { value: 3, index: 0, status: "danger" },
            { value: 3, index: 1, status: "active" },
          ]}
          position={[0, -0.6, 0]}
          scale={1.2}
          frame={frame}
        />
      </ThreeCanvas>

      {/* 2D Header & 3 Trap Cards */}
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
          padding: "0 40px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: `2px solid ${TWO_SUM_COLORS.bruteForceSlow}`,
            borderRadius: 24,
            padding: "8px 28px",
            color: TWO_SUM_COLORS.bruteForceSlow,
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          3 CÁI BẪY NGƯỜI MỚI DỄ MẮC
        </div>

        {/* Trap 1 */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: "2px solid #EF4444",
            borderRadius: 18,
            padding: "12px 24px",
            width: "100%",
            maxWidth: 820,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 26, color: "#EF4444" }}>❌</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>
              Bẫy 1: Trả về giá trị thay vì chỉ số
            </div>
            <div style={{ fontSize: 16, color: "#94A3B8" }}>
              Đừng trả về [2, 7]! Đề bài yêu cầu indices: [0, 1].
            </div>
          </div>
        </div>

        {/* Trap 2 */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: "2px solid #EF4444",
            borderRadius: 18,
            padding: "12px 24px",
            width: "100%",
            maxWidth: 820,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 26, color: "#EF4444" }}>❌</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>
              Bẫy 2: Dùng lại chính 1 phần tử
            </div>
            <div style={{ fontSize: 16, color: "#94A3B8" }}>
              Với target = 6, số 3 không thể tự cộng với chính nó (i ≠ j).
            </div>
          </div>
        </div>

        {/* Trap 3 */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: "2px solid #F59E0B",
            borderRadius: 18,
            padding: "12px 24px",
            width: "100%",
            maxWidth: 820,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 26, color: "#F59E0B" }}>⚠️</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: TWO_SUM_COLORS.target }}>
              Bẫy 3: Thứ tự thêm vào Hash Map
            </div>
            <div style={{ fontSize: 16, color: "#94A3B8" }}>
              Luôn <strong>kiểm tra phần bù TRƯỚC</strong> rồi mới thêm phần tử hiện tại vào bảng!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
