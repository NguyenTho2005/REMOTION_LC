import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { AuroraGlassMaterialImpl } from "../materials/AuroraGlassMaterial";

export interface AuroraBackgroundProps {
  /** Frame number for deterministic rendering. Falls back to useCurrentFrame(). */
  frame?: number;
  /** Canvas/config width (defaults to 1080). */
  width?: number;
  /** Canvas/config height (defaults to 1920). */
  height?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  intensity?: number;
  roughness?: number;
  /** Show floating glassmorphism card layer. */
  showGlassCard?: boolean;
}

const GlassCard: React.FC<{ time: number }> = ({ time }) => {
  const floatY = Math.sin(time * 0.8) * 0.12;
  const floatX = Math.cos(time * 0.5) * 0.08;
  const tilt = Math.sin(time * 0.35) * 0.06;

  return (
    <mesh
      position={[floatX, 0.2 + floatY, 1.2]}
      rotation={[tilt * 0.4, tilt, 0]}
    >
      <planeGeometry args={[560, 760, 1, 1]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.18}
        thickness={0.6}
        ior={1.45}
        chromaticAberration={0.02}
        anisotropicBlur={0.08}
        distortion={0.04}
        distortionScale={0.15}
        temporalDistortion={0.0}
        color="#ffffff"
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

const AuroraScene: React.FC<
  Required<
    Pick<
      AuroraBackgroundProps,
      "frame" | "width" | "height" | "colorA" | "colorB" | "colorC" | "intensity" | "roughness" | "showGlassCard"
    >
  >
> = ({ frame, width, height, colorA, colorB, colorC, intensity, roughness, showGlassCard }) => {
  const { fps } = useVideoConfig();
  const uTime = frame / fps;

  const material = useMemo(() => {
    const m = new AuroraGlassMaterialImpl();
    m.uniforms.uResolution.value = new THREE.Vector2(width, height);
    m.uniforms.uColorA.value = new THREE.Color(colorA);
    m.uniforms.uColorB.value = new THREE.Color(colorB);
    m.uniforms.uColorC.value = new THREE.Color(colorC);
    return m;
  }, [width, height, colorA, colorB, colorC]);

  // Deterministic, frame-driven uniform updates (no RAF / performance.now)
  material.uniforms.uTime.value = uTime;
  material.uniforms.uIntensity.value = intensity;
  material.uniforms.uRoughness.value = roughness;

  return (
    <>
      {/* Fullscreen background shader quad */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Glassmorphism floating card layer */}
      {showGlassCard ? <GlassCard time={uTime} /> : null}

      {/* Subtle deterministic lighting for transmission material */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[200, 400, 600]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-300, -200, 400]} intensity={0.6} color={colorB} />
    </>
  );
};

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  frame: frameProp,
  width = 1080,
  height = 1920,
  colorA = "#22d3ee",
  colorB = "#7c3aed",
  colorC = "#34d399",
  intensity = 1.0,
  roughness = 0.25,
  showGlassCard = true,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = frameProp ?? currentFrame;

  const halfW = width / 2;
  const halfH = height / 2;

  return (
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
      style={{ width, height }}
    >
      <AuroraScene
        frame={frame}
        width={width}
        height={height}
        colorA={colorA}
        colorB={colorB}
        colorC={colorC}
        intensity={intensity}
        roughness={roughness}
        showGlassCard={showGlassCard}
      />
    </ThreeCanvas>
  );
};
