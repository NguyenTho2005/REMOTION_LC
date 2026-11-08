import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { FormationConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";

export const FormationEffect: React.FC<FormationConfig> = ({
  particleCount,
  seed = 42,
  color = "#38BDF8",
  secondaryColor = "#818CF8",
  size = 0.08,
  opacity = 0.9,
  targetShape = "sphere",
  targetSize = 2.5,
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 3500, maxBudget);

  const { initialPositions, targetPositions, customData } = useMemo(() => {
    // Start scattered widely in outer sphere
    const startPos = ParticleGeometryFactory.sampleSphere(count, 8.0, seed, true);

    // Target shape
    let targetPos: Float32Array;
    switch (targetShape) {
      case "cube":
        targetPos = ParticleGeometryFactory.sampleCube(count, targetSize, seed + 1, true);
        break;
      case "torus":
        targetPos = ParticleGeometryFactory.sampleTorus(count, targetSize * 0.7, targetSize * 0.25, seed + 1);
        break;
      case "cylinder":
        targetPos = ParticleGeometryFactory.sampleCylinder(count, targetSize * 0.6, targetSize * 1.2, seed + 1);
        break;
      case "sphere":
      default:
        targetPos = ParticleGeometryFactory.sampleSphere(count, targetSize, seed + 1, false);
        break;
    }

    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 2);

    return {
      initialPositions: startPos,
      targetPositions: targetPos,
      customData: cData,
    };
  }, [count, seed, targetShape, targetSize]);

  return (
    <ParticleEngine
      positions={initialPositions}
      targetPositions={targetPositions}
      customData={customData}
      count={count}
      color={color}
      secondaryColor={secondaryColor}
      size={size}
      opacity={opacity}
      noiseStrength={0.2}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      quality={quality}
      position={position}
    />
  );
};
