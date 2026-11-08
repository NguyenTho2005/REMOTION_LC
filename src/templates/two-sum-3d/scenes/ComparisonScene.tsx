import React from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";

export const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const floatY = Math.sin(frame * 0.05) * 0.05;

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
          position: [0, 0, 10.5],
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
        <pointLight position={[-3, 0, 4]} intensity={1.0} color="#EF4444" />
        <pointLight position={[3, 0, 4]} intensity={1.2} color="#10B981" />

        <CameraRig preset="default" />

        {/* 3D Left Pedestal: Brute Force */}
        <group position={[-2.2, -0.6 + floatY, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
            <meshStandardMaterial
              color="#1E2538"
              emissive={TWO_SUM_COLORS.bruteForceSlow}
              emissiveIntensity={0.3}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.6, 1.2, 0.3]} />
            <meshStandardMaterial color={TWO_SUM_COLORS.bruteForceSlow} roughness={0.3} />
          </mesh>
        </group>

        {/* 3D Right Pedestal: Hash Map */}
        <group position={[2.2, -0.6 - floatY, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
            <meshStandardMaterial
              color="#1E2538"
              emissive={TWO_SUM_COLORS.matchSuccess}
              emissiveIntensity={0.4}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.6, 1.2, 0.3]} />
            <meshStandardMaterial color={TWO_SUM_COLORS.matchSuccess} roughness={0.3} />
          </mesh>
        </group>
      </ThreeCanvas>

      {/* 2D Header & Dual Cards */}
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
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            border: `2px solid ${TWO_SUM_COLORS.target}`,
            borderRadius: 24,
            padding: "8px 28px",
            color: TWO_SUM_COLORS.target,
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          SO SÁNH ĐỘ PHỨC TẠP
        </div>

        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          Sự Đánh Đổi <span style={{ color: TWO_SUM_COLORS.target }}>Thời Gian &amp; Bộ Nhớ</span>
        </div>

        {/* Comparison Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            width: "100%",
            maxWidth: 880,
            marginTop: 10,
          }}
        >
          {/* Card 1: Brute Force */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.92)",
              border: `2px solid ${TWO_SUM_COLORS.bruteForceSlow}`,
              borderRadius: 22,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, color: TWO_SUM_COLORS.bruteForceSlow }}>
              VÉT CẠN
            </div>
            <div style={{ fontSize: 20, color: "#E2E8F0" }}>
              ⏱️ Thời gian: <strong style={{ color: "#EF4444" }}>O(n²)</strong>
            </div>
            <div style={{ fontSize: 20, color: "#E2E8F0" }}>
              💾 Bộ nhớ: <strong style={{ color: "#10B981" }}>O(1)</strong>
            </div>
            <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 4 }}>
              Không tốn thêm RAM, nhưng siêu chậm khi dữ liệu lớn.
            </div>
          </div>

          {/* Card 2: Hash Map */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.92)",
              border: `2px solid ${TWO_SUM_COLORS.matchSuccess}`,
              borderRadius: 22,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, color: TWO_SUM_COLORS.matchSuccess }}>
              HASH MAP
            </div>
            <div style={{ fontSize: 20, color: "#E2E8F0" }}>
              ⏱️ Thời gian: <strong style={{ color: "#10B981" }}>O(n)</strong>
            </div>
            <div style={{ fontSize: 20, color: "#E2E8F0" }}>
              💾 Bộ nhớ: <strong style={{ color: "#F59E0B" }}>O(n)</strong>
            </div>
            <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 4 }}>
              Đổi thêm O(n) RAM để đạt tốc độ xử lý tức thì!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
