import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { ExplosionConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const ExplosionEffect: React.FC<ExplosionConfig> = ({
  particleCount,
  seed = 42,
  color = "#F59E0B",
  secondaryColor = "#EF4444",
  size = 0.09,
  opacity = 0.95,
  spread = 5.0,
  explosionForce = 1.2,
  gravity = 0.8,
  startFrame = 0,
  durationInFrames = 90,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 3000, maxBudget);

  const { easedProgress, progress } = useParticleTimeline({
    startFrame,
    durationInFrames,
    easing: "easeOut",
  });

  // Base positions and burst velocities
  const { initialPositions, velocities, customData } = useMemo(() => {
    // Start packed in center sphere
    const initPos = ParticleGeometryFactory.sampleSphere(count, 0.4, seed, true);
    const vels = ParticleGeometryFactory.sampleExplosionVectors(count, explosionForce, seed + 1);
    const data = ParticleGeometryFactory.generateCustomData(count, seed + 2);

    return { initialPositions: initPos, velocities: vels, customData: data };
  }, [count, explosionForce, seed]);

  // Compute analytical frame-exact positions
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const t = easedProgress * spread;
    const g = gravity * progress * progress * 2.0; // quadratic gravity

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const drag = 1.0 / (1.0 + progress * 0.5); // slight atmospheric drag

      pos[idx] = initialPositions[idx] + velocities[idx] * t * drag;
      pos[idx + 1] = initialPositions[idx + 1] + velocities[idx + 1] * t * drag - g;
      pos[idx + 2] = initialPositions[idx + 2] + velocities[idx + 2] * t * drag;
    }
    return pos;
  }, [count, easedProgress, gravity, initialPositions, progress, spread, velocities]);

  return (
    <ParticleEngine
      positions={currentPositions}
      velocities={velocities}
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
