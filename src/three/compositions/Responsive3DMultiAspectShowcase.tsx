import React from "react";
import { Composition, useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Text } from "@react-three/drei";
import { ResponsiveCameraRig } from "../../3d/ResponsiveCameraRig";
import { Safe3DLayout, Safe3DGroup, Safe2DOverlay } from "../../3d/Safe3DLayout";
import { DEFAULT_3D_FONT } from "../core/constants";

export const Responsive3DScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isPortrait = width < height;

  // Primary 3D Array items (LeetCode / Binary Search structure)
  const numbers = [3, 8, 14, 23, 31, 42];
  const activeIdx = Math.floor((frame / 30) % numbers.length);

  return (
    <Safe3DLayout baselineWidth={6.0} baselineHeight={4.0}>
      <AbsoluteFill style={{ backgroundColor: "#060913" }}>
        {/* 3D Canvas */}
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ fov: 45, near: 0.1, far: 1000 }}
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 7]} intensity={1.8} castShadow />
          <pointLight position={[-4, 2, 4]} intensity={1.2} color="#38BDF8" />
          <pointLight position={[4, -2, 4]} intensity={1.2} color="#10B981" />

          {/* Autonomous Camera Rig adapting distance to aspect ratio */}
          <ResponsiveCameraRig
            preset="orbit"
            speed={0.8}
            baseDistance={8.5}
            fov={45}
            contentBounds={{ width: isPortrait ? 4.2 : 6.8, height: 3.2, depth: 1.5 }}
          />

          {/* Primary 3D Algorithm Board Slot */}
          <Safe3DGroup slot={isPortrait ? "primary" : "primary"}>
            <group>
              {numbers.map((num, idx) => {
                const isActive = idx === activeIdx;
                const spacing = 1.05;
                const startX = -((numbers.length - 1) * spacing) / 2;
                const xPos = startX + idx * spacing;

                const blockSpring = spring({
                  frame: Math.max(0, frame - idx * 3),
                  fps,
                  config: { damping: 14, stiffness: 120 },
                });

                const highlightColor = isActive ? "#10B981" : "#1E293B";
                const emissiveColor = isActive ? "#10B981" : "#0F172A";
                const emissiveIntensity = isActive ? 0.8 : 0.1;

                return (
                  <group key={num} position={[xPos, 0, 0]} scale={blockSpring}>
                    <mesh position={[0, isActive ? 0.3 : 0, 0]}>
                      <boxGeometry args={[0.85, 1.0, 0.85]} />
                      <meshStandardMaterial
                        color={highlightColor}
                        metalness={0.4}
                        roughness={0.2}
                        emissive={emissiveColor}
                        emissiveIntensity={emissiveIntensity}
                      />
                    </mesh>

                    {/* Number Text */}
                    <Text
                      font={DEFAULT_3D_FONT}
                      position={[0, isActive ? 0.3 : 0, 0.46]}
                      fontSize={0.42}
                      color="#FFFFFF"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {String(num)}
                    </Text>

                    {/* Index Badge */}
                    <Text
                      font={DEFAULT_3D_FONT}
                      position={[0, -0.75, 0]}
                      fontSize={0.22}
                      color="#94A3B8"
                      anchorX="center"
                      anchorY="top"
                    >
                      [{idx}]
                    </Text>
                  </group>
                );
              })}
            </group>
          </Safe3DGroup>

          {/* Secondary 3D Memory / Pedestal Slot (Side-by-side in landscape, stacked in portrait) */}
          <Safe3DGroup slot={isPortrait ? "secondary" : "secondary"}>
            <group>
              {/* Rotating Holographic Node */}
              <mesh rotation={[frame * 0.02, frame * 0.03, 0]}>
                <octahedronGeometry args={[0.9, 0]} />
                <meshStandardMaterial
                  color="#0F172A"
                  emissive="#38BDF8"
                  emissiveIntensity={0.6}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              <Text
                font={DEFAULT_3D_FONT}
                position={[0, -1.3, 0]}
                fontSize={0.3}
                color="#38BDF8"
                anchorX="center"
                anchorY="top"
              >
                O(1) HASH MAP
              </Text>
            </group>
          </Safe3DGroup>
        </ThreeCanvas>

        {/* 2D Safe-Zone Overlay (Headlines, Subtitles, Badges) */}
        <Safe2DOverlay
          topHeader={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(56, 189, 248, 0.15)",
                  border: "2px solid #38BDF8",
                  borderRadius: 24,
                  padding: "6px 20px",
                  color: "#38BDF8",
                  fontSize: isPortrait ? 20 : 16,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Responsive 3D Framing
              </div>
              <div
                style={{
                  fontSize: isPortrait ? 40 : 32,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Universal Aspect-Ratio Engine
              </div>
            </div>
          }
          bottomFooter={
            <div
              style={{
                backgroundColor: "rgba(11, 15, 25, 0.9)",
                border: "2px solid rgba(16, 185, 129, 0.5)",
                borderRadius: 20,
                padding: isPortrait ? "16px 28px" : "12px 24px",
                maxWidth: isPortrait ? "90%" : 700,
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  fontSize: isPortrait ? 26 : 22,
                  fontWeight: 700,
                  color: "#10B981",
                }}
              >
                Tự động căn chỉnh & chống tràn khung hình 3D
              </div>
              <div
                style={{
                  fontSize: isPortrait ? 18 : 16,
                  fontWeight: 500,
                  color: "#94A3B8",
                  marginTop: 4,
                }}
              >
                Hỗ trợ 9:16 (TikTok), 16:9 (YouTube), 1:1 (Square) & 4:5
              </div>
            </div>
          }
        />
      </AbsoluteFill>
    </Safe3DLayout>
  );
};

export const Responsive3DComposition9x16: React.FC = () => {
  return (
    <Composition
      id="Responsive3D-9x16"
      component={Responsive3DScene}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};

export const Responsive3DComposition16x9: React.FC = () => {
  return (
    <Composition
      id="Responsive3D-16x9"
      component={Responsive3DScene}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};

export const Responsive3DComposition1x1: React.FC = () => {
  return (
    <Composition
      id="Responsive3D-1x1"
      component={Responsive3DScene}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{}}
    />
  );
};
