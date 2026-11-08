import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { MorphingConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";

export const MorphingEffect: React.FC<MorphingConfig> = ({
  particleCount,
  seed = 42,
  color = "#8B5CF6",
  secondaryColor = "#06B6D4",
  size = 0.08,
  opacity = 0.9,
  shapeA = "sphere",
  shapeB = "torus",
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 3500, maxBudget);

  const { positionsA, positionsB, customData } = useMemo(() => {
    function sampleShape(shape: "sphere" | "cube" | "torus", s: number) {
      switch (shape) {
        case "cube":
          return ParticleGeometryFactory.sampleCube(count, 2.6, s, true);
        case "torus":
          return ParticleGeometryFactory.sampleTorus(count, 1.8, 0.6, s);
        case "sphere":
        default:
          return ParticleGeometryFactory.sampleSphere(count, 2.2, s, false);
      }
    }

    const posA = sampleShape(shapeA, seed);
    const posB = sampleShape(shapeB, seed + 1);
    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 2);

    return { positionsA: posA, positionsB: posB, customData: cData };
  }, [count, seed, shapeA, shapeB]);

  return (
    <ParticleEngine
      positions={positionsA}
      targetPositions={positionsB}
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
