import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { HologramConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const HologramEffect: React.FC<HologramConfig> = ({
  particleCount,
  seed = 42,
  color = "#00FFFF",
  secondaryColor = "#3B82F6",
  size = 0.08,
  opacity = 0.92,
  scanSpeed = 2.0,
  shape = "cylinder",
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 3500, maxBudget);

  const { time } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  const { basePositions, customData } = useMemo(() => {
    let pts: Float32Array;
    switch (shape) {
      case "sphere":
        pts = ParticleGeometryFactory.sampleSphere(count, 2.2, seed, false);
        break;
      case "cube":
        pts = ParticleGeometryFactory.sampleCube(count, 2.8, seed, true);
        break;
      case "cylinder":
      default:
        pts = ParticleGeometryFactory.sampleCylinder(count, 1.8, 3.5, seed);
        break;
    }

    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 1);
    return { basePositions: pts, customData: cData };
  }, [count, seed, shape]);

  // Compute holographic jitter & scanning glitch
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(basePositions);
    const scanY = (Math.sin(time * scanSpeed) * 1.8);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const y = basePositions[idx + 1];

      // Jitter when scanline passes this Y
      const distToScan = Math.abs(y - scanY);
      if (distToScan < 0.35) {
        const jitter = Math.sin(time * 30.0 + i) * 0.06;
        pos[idx] += jitter;
        pos[idx + 2] += jitter;
      }
    }
    return pos;
  }, [basePositions, count, scanSpeed, time]);

  return (
    <ParticleEngine
      positions={currentPositions}
      customData={customData}
      count={count}
      color={color}
      secondaryColor={secondaryColor}
      size={size}
      opacity={opacity}
      noiseStrength={0.08}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      quality={quality}
      isHologram={true}
      position={position}
    />
  );
};
