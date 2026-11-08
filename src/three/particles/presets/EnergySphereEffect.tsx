import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { EnergySphereConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const EnergySphereEffect: React.FC<EnergySphereConfig> = ({
  particleCount,
  seed = 42,
  color = "#06B6D4",
  secondaryColor = "#EC4899",
  size = 0.08,
  opacity = 0.9,
  radius = 2.2,
  pulseSpeed = 2.5,
  noiseStrength = 0.35,
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
    // 70% on outer shell, 30% in inner core
    const shellCount = Math.floor(count * 0.7);
    const coreCount = count - shellCount;

    const shell = ParticleGeometryFactory.sampleSphere(shellCount, radius, seed, false);
    const core = ParticleGeometryFactory.sampleSphere(coreCount, radius * 0.5, seed + 1, true);

    const merged = new Float32Array(count * 3);
    merged.set(shell, 0);
    merged.set(core, shellCount * 3);

    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 2);
    return { basePositions: merged, customData: cData };
  }, [count, radius, seed]);

  // Compute energy sphere displacement per frame
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const t = time * pulseSpeed;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const bx = basePositions[idx];
      const by = basePositions[idx + 1];
      const bz = basePositions[idx + 2];
      const baseR = Math.sqrt(bx * bx + by * by + bz * bz);

      if (baseR > 0.001) {
        const nx = bx / baseR;
        const ny = by / baseR;
        const nz = bz / baseR;

        // Radial pulsation wave
        const pulse = Math.sin(t + baseR * 3.0 + customData[i * 4 + 1] * 6.28) * noiseStrength;
        const currentR = baseR + pulse;

        pos[idx] = nx * currentR;
        pos[idx + 1] = ny * currentR;
        pos[idx + 2] = nz * currentR;
      }
    }
    return pos;
  }, [basePositions, count, customData, noiseStrength, time, pulseSpeed]);

  return (
    <ParticleEngine
      positions={currentPositions}
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
