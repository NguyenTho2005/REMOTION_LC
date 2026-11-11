import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { AuroraGlassMaterialImpl } from "../materials/AuroraGlassMaterial";

export interface AuroraGlassmorphismProps {
  frame: number;
  title: string;
  subtext?: string;
  width?: number;
  height?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

const GlassCardMesh: React.FC<{ time: number; width: number; height: number }> = ({
  time,
  width,
  height,
}) => {
  const floatY = Math.sin(time * 0.7) * 14;
  const floatX = Math.cos(time * 0.45) * 10;
  const tilt = Math.sin(time * 0.3) * 0.05;
  const cardW = Math.min(width * 0.62, 720);
  const cardH = Math.min(height * 0.32, 620);

  return (
    <mesh position={[floatX, 80 + floatY, 1.4]} rotation={[tilt * 0.5, tilt, 0]}>
      <planeGeometry args={[cardW, cardH, 1, 1]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.16}
        thickness={0.7}
        ior={1.45}
        chromaticAberration={0.015}
        anisotropicBlur={0.1}
        distortion={0.03}
        distortionScale={0.12}
        temporalDistortion={0}
        color="#ffffff"
        transparent
      />
    </mesh>
  );
};

const AuroraScene: React.FC<{
  frame: number;
  width: number;
  height: number;
  colorA: string;
  colorB: string;
  colorC: string;
}> = ({ frame, width, height, colorA, colorB, colorC }) => {
  const { fps } = useVideoConfig();
  const uTime = frame / fps;

  const material = useMemo(() => {
    const m = new AuroraGlassMaterialImpl();
    m.uniforms.uResolution.value = new THREE.Vector2(width, height);
    m.uniforms.uColorA.value = new THREE.Color(colorA);
    m.uniforms.uColorB.value = new THREE.Color(colorB);
    m.uniforms.uColorC.value = new THREE.Color(colorC);
    m.uniforms.uIntensity.value = 1.05;
    m.uniforms.uRoughness.value = 0.22;
    return m;
  }, [width, height, colorA, colorB, colorC]);

  material.uniforms.uTime.value = uTime;

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>

      <GlassCardMesh time={uTime} width={width} height={height} />

      <ambientLight intensity={0.95} />
      <directionalLight position={[220, 420, 600]} intensity={1.15} color="#ffffff" />
      <pointLight position={[-320, -180, 420]} intensity={0.55} color={colorB} />
    </>
  );
};

export const AuroraGlassmorphism: React.FC<AuroraGlassmorphismProps> = ({
  frame,
  title,
  subtext,
  width = 1080,
  height = 1920,
  colorA = "#6ee7ff",
  colorB = "#7c3aed",
  colorC = "#2dd4bf",
}) => {
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <AbsoluteFill style={{ width, height, overflow: "hidden", backgroundColor: "#050816" }}>
      <ThreeCanvas
        width={width}
        height={height}
        orthographic
        camera={{
          left: -halfW,
          right: halfW,
          top: halfH,
          bottom: -halfH,
          near: 0.1,
          far: 100,
          position: [0, 0, 10],
          zoom: 1,
        }}
        style={{ width, height, position: "absolute", inset: 0 }}
      >
        <AuroraScene
          frame={frame}
          width={width}
          height={height}
          colorA={colorA}
          colorB={colorB}
          colorC={colorC}
        />
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          padding: "0 120px",
        }}
      >
        <div
          style={{
            width: Math.min(width * 0.62, 720),
            minHeight: Math.min(height * 0.32, 620),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            transform: "translateY(80px)",
            padding: "48px 44px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 800,
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "-0.03em",
              textShadow: "0 8px 30px rgba(10, 12, 28, 0.35)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            {title}
          </div>
          {subtext ? (
            <div
              style={{
                marginTop: 18,
                fontSize: 30,
                lineHeight: 1.35,
                fontWeight: 500,
                color: "rgba(240, 248, 255, 0.86)",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {subtext}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
