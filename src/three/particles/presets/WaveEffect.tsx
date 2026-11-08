import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { WaveConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const WaveEffect: React.FC<WaveConfig> = ({
  particleCount,
  seed = 42,
  color = "#38BDF8",
  secondaryColor = "#6366F1",
  size = 0.07,
  opacity = 0.85,
  frequency = 0.6,
  amplitude = 0.8,
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, -0.5, 0],
  rotation = [0.4, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 4000, maxBudget);

  const cols = Math.floor(Math.sqrt(count * 1.5));
  const rows = Math.floor(count / cols);
  const actualCount = cols * rows;

  const { time } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  const { baseGrid, customData } = useMemo(() => {
    const grid = ParticleGeometryFactory.sampleWaveGrid(cols, rows, 10, 8);
    const data = ParticleGeometryFactory.generateCustomData(actualCount, seed);
    return { baseGrid: grid, customData: data };
  }, [actualCount, cols, rows, seed]);

  // Analytical wave elevation function of (x, z, time)
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(baseGrid);
    const t = time * 1.8;

    for (let i = 0; i < actualCount; i++) {
      const idx = i * 3;
      const x = baseGrid[idx];
      const z = baseGrid[idx + 2];

      // Multi-harmonic wave equation
      const wave1 = Math.sin(x * frequency + t) * Math.cos(z * frequency * 0.8 + t * 0.7);
      const wave2 = Math.sin((x + z) * frequency * 0.5 + t * 1.2) * 0.5;
      const wave3 = Math.cos(Math.sqrt(x * x + z * z) * 0.8 - t * 1.5) * 0.4;

      pos[idx + 1] = (wave1 + wave2 + wave3) * amplitude;
    }
    return pos;
  }, [actualCount, amplitude, baseGrid, frequency, time]);

  return (
    <ParticleEngine
      positions={currentPositions}
      customData={customData}
      count={actualCount}
      color={color}
      secondaryColor={secondaryColor}
      size={size}
      opacity={opacity}
      noiseStrength={0.05}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      quality={quality}
      position={position}
      rotation={rotation}
    />
  );
};
