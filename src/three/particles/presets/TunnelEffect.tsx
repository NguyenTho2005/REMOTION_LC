import React, { useMemo } from "react";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { TunnelConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";

export const TunnelEffect: React.FC<TunnelConfig> = ({
  particleCount,
  seed = 42,
  color = "#38BDF8",
  secondaryColor = "#EC4899",
  size = 0.09,
  opacity = 0.9,
  tunnelRadius = 3.2,
  tunnelLength = 24.0,
  travelSpeed = 6.0,
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 4000, maxBudget);

  const { time } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  const { basePositions, customData } = useMemo(() => {
    const basePos = ParticleGeometryFactory.sampleTunnel(count, tunnelRadius, tunnelLength, seed);
    const cData = ParticleGeometryFactory.generateCustomData(count, seed + 1);
    return { basePositions: basePos, customData: cData };
  }, [count, seed, tunnelLength, tunnelRadius]);

  // Stream particles along Z-axis towards camera
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(basePositions);
    const halfLen = tunnelLength / 2;
    const offsetZ = time * travelSpeed;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Wrap-around modulo along Z
      let z = (basePositions[idx + 2] + offsetZ) % tunnelLength;
      if (z < 0) z += tunnelLength;
      pos[idx + 2] = z - halfLen;

      // Gentle spiraling angle
      const angleOffset = (pos[idx + 2] / tunnelLength) * Math.PI * 1.5;
      const x = basePositions[idx];
      const y = basePositions[idx + 1];

      pos[idx] = x * Math.cos(angleOffset) - y * Math.sin(angleOffset);
      pos[idx + 1] = x * Math.sin(angleOffset) + y * Math.cos(angleOffset);
    }
    return pos;
  }, [basePositions, count, time, travelSpeed, tunnelLength]);

  return (
    <ParticleEngine
      positions={currentPositions}
      customData={customData}
      count={count}
      color={color}
      secondaryColor={secondaryColor}
      size={size}
      opacity={opacity}
      noiseStrength={0.05}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      quality={quality}
      position={position}
    />
  );
};
