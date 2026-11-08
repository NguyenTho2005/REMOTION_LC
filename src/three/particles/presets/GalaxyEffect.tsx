import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { GalaxyConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const GalaxyEffect: React.FC<GalaxyConfig> = ({
  particleCount,
  seed = 42,
  color = "#A855F7",
  secondaryColor = "#38BDF8",
  size = 0.08,
  opacity = 0.9,
  arms = 3,
  armSpread = 0.6,
  coreRadius = 0.8,
  spiralTightness = 1.3,
  speed = 1.0,
  startFrame = 0,
  durationInFrames = 150,
  quality = "standard",
  position = [0, 0, 0],
  rotation = [0.6, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 4500, maxBudget);

  const { time } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  const { basePositions, customData, radii, initialAngles } = useMemo(() => {
    const basePos = ParticleGeometryFactory.sampleSpiralGalaxy(
      count,
      arms,
      armSpread,
      coreRadius,
      5.5,
      spiralTightness,
      seed
    );

    const rad = new Float32Array(count);
    const ang = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = basePos[idx];
      const z = basePos[idx + 2];
      rad[i] = Math.sqrt(x * x + z * z);
      ang[i] = Math.atan2(z, x);
    }

    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 1);
    return { basePositions: basePos, customData: cData, radii: rad, initialAngles: ang };
  }, [arms, armSpread, coreRadius, count, seed, spiralTightness]);

  // Differential rotation: inner particles rotate faster
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(basePositions);
    const t = time * speed;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const r = radii[i];
      // Differential angular velocity (Keplerian-like curve)
      const omega = 1.8 / Math.max(0.6, Math.pow(r, 0.45));
      const currentAngle = initialAngles[i] + t * omega;

      pos[idx] = Math.cos(currentAngle) * r;
      pos[idx + 2] = Math.sin(currentAngle) * r;
      // y stays as sampled vertical spread with subtle harmonic breathing
      pos[idx + 1] = basePositions[idx + 1] + Math.sin(t * 1.5 + r * 2.0) * 0.08;
    }
    return pos;
  }, [basePositions, count, initialAngles, radii, speed, time]);

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
      position={position}
      rotation={rotation}
    />
  );
};
