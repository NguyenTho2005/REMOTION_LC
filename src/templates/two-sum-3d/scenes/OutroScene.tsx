import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { TWO_SUM_SPECS, TWO_SUM_COLORS } from "../design-tokens";
import { CameraRig } from "../components/CameraRig";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation for 2D card
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Rotation angles for 3D elements
  const rotY = (frame * 0.02) % (Math.PI * 2);
  const rotX = Math.sin(frame * 0.03) * 0.2;
  const ribbonRot = (frame * 0.015) % (Math.PI * 2);

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
          fov: 42,
          position: [0, 0, 9.5],
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
        <directionalLight position={[4, 8, 6]} intensity={1.6} />
        <pointLight position={[-4, 2, 4]} intensity={1.5} color="#38BDF8" />
        <pointLight position={[4, -2, 4]} intensity={1.5} color="#F59E0B" />
        <pointLight position={[0, 4, 3]} intensity={1.2} color="#10B981" />

        <CameraRig preset="default" />

        {/* Floating Center 3D Hologram / Trophy Element */}
        <group position={[0, 0.9, 0]} rotation={[rotX, rotY, 0]}>
          {/* Outer glowing algorithmic ring */}
          <mesh rotation={[Math.PI / 3, ribbonRot, 0]}>
            <torusGeometry args={[2.0, 0.06, 16, 64]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Secondary crossing ring */}
          <mesh rotation={[-Math.PI / 4, -ribbonRot, 0]}>
            <torusGeometry args={[1.7, 0.04, 16, 64]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#38BDF8"
              emissiveIntensity={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* Central 3D Core / Polyhedron */}
          <mesh castShadow receiveShadow>
            <octahedronGeometry args={[1.0, 0]} />
            <meshStandardMaterial
              color="#0F172A"
              emissive="#10B981"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Golden satellites */}
          {[-1.5, 1.5].map((pos, idx) => (
            <mesh
              key={idx}
              position={[
                pos * Math.cos(ribbonRot + idx * Math.PI),
                0.4 * Math.sin(frame * 0.05 + idx),
                pos * Math.sin(ribbonRot + idx * Math.PI),
              ]}
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#F59E0B"
                emissiveIntensity={1.0}
              />
            </mesh>
          ))}
        </group>
      </ThreeCanvas>

      {/* 2D Header */}
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
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: `2px solid ${TWO_SUM_COLORS.matchSuccess}`,
            borderRadius: 30,
            padding: "8px 28px",
            color: TWO_SUM_COLORS.matchSuccess,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          TỔNG KẾT THUẬT TOÁN
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          Bí Quyết Two Sum
        </div>
      </div>

      {/* 2D Key Insight Summary Card */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: TWO_SUM_SPECS.safeArea.left,
          right: TWO_SUM_SPECS.safeArea.right,
          transform: `scale(${cardScale})`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: "2px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 24,
            padding: "28px 32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 36 }}>⚡</span>
            <span>
              <strong style={{ color: TWO_SUM_COLORS.pointerI }}>
                Ghi nhớ quá khứ:
              </strong>{" "}
              Dùng Hash Map lưu giá trị đã duyệt.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 36 }}>🎯</span>
            <span>
              <strong style={{ color: TWO_SUM_COLORS.target }}>
                Tìm kiếm phần bù:
              </strong>{" "}
              Tra cứu <code style={{ color: "#38BDF8" }}>target - num</code> với
              chi phí O(1).
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 36 }}>🚀</span>
            <span>
              <strong style={{ color: TWO_SUM_COLORS.matchSuccess }}>
                Tối ưu triệt để:
              </strong>{" "}
              Hạ độ phức tạp từ O(n²) xuống còn O(n)!
            </span>
          </div>
        </div>

        {/* DevPeek36 Call to Action Box */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)",
            border: "2px solid rgba(245, 158, 11, 0.6)",
            borderRadius: 24,
            padding: "24px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(245, 158, 11, 0.2)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                color: TWO_SUM_COLORS.target,
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "0.05em",
              }}
            >
              DevPeek36
            </div>
            <div
              style={{
                color: "#E2E8F0",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              Follow để làm chủ giải thuật LeetCode!
            </div>
          </div>

          <div
            style={{
              backgroundColor: TWO_SUM_COLORS.target,
              color: "#0F172A",
              padding: "14px 28px",
              borderRadius: 16,
              fontSize: 24,
              fontWeight: 900,
              boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
            }}
          >
            FOLLOW
          </div>
        </div>
      </div>
    </div>
  );
};
