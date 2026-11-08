import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { DisintegrationConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const DisintegrationEffect: React.FC<DisintegrationConfig> = ({
  particleCount,
  seed = 42,
  color = "#F43F5E",
  secondaryColor = "#FB923C",
  size = 0.08,
  opacity = 0.9,
  sourceShape = "cube",
  dissolveDirection = [1.5, 1.0, 0.5],
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 3500, maxBudget);

  const { easedProgress } = useParticleTimeline({
    startFrame,
    durationInFrames,
    easing: "easeIn",
  });

  const { basePositions, velocities, customData } = useMemo(() => {
    let sourcePos: Float32Array;
    switch (sourceShape) {
      case "sphere":
        sourcePos = ParticleGeometryFactory.sampleSphere(count, 2.0, seed, false);
        break;
      case "torus":
        sourcePos = ParticleGeometryFactory.sampleTorus(count, 1.8, 0.6, seed);
        break;
      case "cube":
      default:
        sourcePos = ParticleGeometryFactory.sampleCube(count, 2.5, seed, true);
        break;
    }

    const vels = ParticleGeometryFactory.sampleExplosionVectors(count, 1.5, seed + 1);
    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 2);

    return { basePositions: sourcePos, velocities: vels, customData: cData };
  }, [count, seed, sourceShape]);

  // Compute disintegration frame positions
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const dirX = dissolveDirection[0];
    const dirY = dissolveDirection[1];
    const dirZ = dissolveDirection[2];

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const phase = customData[i * 4 + 1];

      // Delay dissolve per particle so it peels away progressively
      const particleProgress = Math.max(0, Math.min(1, (easedProgress - phase * 0.4) / 0.6));
      const dist = particleProgress * 4.5;

      pos[idx] = basePositions[idx] + (dirX * dist) + velocities[idx] * particleProgress;
      pos[idx + 1] = basePositions[idx + 1] + (dirY * dist) + velocities[idx + 1] * particleProgress;
      pos[idx + 2] = basePositions[idx + 2] + (dirZ * dist) + velocities[idx + 2] * particleProgress;
    }
    return pos;
  }, [basePositions, count, customData, dissolveDirection, easedProgress, velocities]);

  return (
    <ParticleEngine
      positions={currentPositions}
      customData={customData}
      count={count}
      color={color}
      secondaryColor={secondaryColor}
      size={size}
      opacity={opacity}
      noiseStrength={0.25}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      quality={quality}
      position={position}
    />
  );
};
