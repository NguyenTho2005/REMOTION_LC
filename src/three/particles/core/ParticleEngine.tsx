import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useParticleTimeline } from "./useParticleTimeline";
import {
  PARTICLE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
  HOLOGRAM_FRAGMENT_SHADER,
} from "../shaders/particleShaders";
import {
  PARTICLE_QUALITY_BUDGETS,
  type ParticleQualityPreset,
} from "../types";

export interface ParticleEngineProps {
  positions: Float32Array;
  targetPositions?: Float32Array;
  velocities?: Float32Array;
  customData: Float32Array;
  colors?: Float32Array;
  count: number;
  color?: string;
  secondaryColor?: string;
  size?: number;
  opacity?: number;
  noiseStrength?: number;
  blending?: THREE.Blending;
  startFrame?: number;
  durationInFrames?: number;
  quality?: ParticleQualityPreset;
  isHologram?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const ParticleEngine: React.FC<ParticleEngineProps> = ({
  positions,
  targetPositions,
  velocities,
  customData,
  colors,
  count,
  color = "#38BDF8",
  secondaryColor = "#A855F7",
  size = 0.08,
  opacity = 0.9,
  noiseStrength = 0.15,
  blending = THREE.AdditiveBlending,
  startFrame = 0,
  durationInFrames,
  quality = "standard",
  isHologram = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const qualityConfig = PARTICLE_QUALITY_BUDGETS[quality] ?? PARTICLE_QUALITY_BUDGETS.standard;
  const actualSize = size * qualityConfig.pointSizeMultiplier;

  const { frame, fps, time, easedProgress, opacityMultiplier } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  const color1 = useMemo(() => new THREE.Color(color), [color]);
  const color2 = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);

  // Create uniforms once
  const uniforms = useMemo(() => {
    return {
      uFrame: { value: frame },
      uFps: { value: fps },
      uTime: { value: time },
      uProgress: { value: easedProgress },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
      uBaseSize: { value: actualSize },
      uOpacity: { value: opacity * opacityMultiplier },
      uNoiseStrength: { value: qualityConfig.enableNoise ? noiseStrength : 0.0 },
      uResolution: { value: new THREE.Vector2(1080, 1920) },
    };
  }, [actualSize, color1, color2, fps, frame, easedProgress, noiseStrength, opacity, opacityMultiplier, qualityConfig.enableNoise, time]);

  // Update uniforms synchronously on each frame
  if (materialRef.current) {
    materialRef.current.uniforms.uFrame.value = frame;
    materialRef.current.uniforms.uFps.value = fps;
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uProgress.value = easedProgress;
    materialRef.current.uniforms.uOpacity.value = opacity * opacityMultiplier;
    materialRef.current.uniforms.uBaseSize.value = actualSize;
  }

  // Ensure GPU buffers are created and properly released
  useEffect(() => {
    const geom = geometryRef.current;
    const mat = materialRef.current;
    return () => {
      geom?.dispose();
      mat?.dispose();
    };
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <points>
        <bufferGeometry ref={geometryRef} drawRange={{ start: 0, count }}>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          {targetPositions && (
            <bufferAttribute
              attach="attributes-targetPosition"
              args={[targetPositions, 3]}
            />
          )}
          {velocities && (
            <bufferAttribute
              attach="attributes-velocity"
              args={[velocities, 3]}
            />
          )}
          <bufferAttribute
            attach="attributes-customData"
            args={[customData, 4]}
          />
          {colors && (
            <bufferAttribute
              attach="attributes-aColor"
              args={[colors, 3]}
            />
          )}
        </bufferGeometry>

        <shaderMaterial
          ref={materialRef}
          vertexShader={PARTICLE_VERTEX_SHADER}
          fragmentShader={isHologram ? HOLOGRAM_FRAGMENT_SHADER : PARTICLE_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={blending}
        />
      </points>
    </group>
  );
};
