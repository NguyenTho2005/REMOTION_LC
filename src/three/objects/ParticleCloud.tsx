import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import type { Particles3DObjectConfig } from "../core/types";
import { seededRandom } from "../core/constants";
import { useThreeAnimation } from "../animations/useThreeAnimation";

export const ParticleCloud: React.FC<{ config: Particles3DObjectConfig }> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const count = config.count ?? 500;
  const spread = config.spread ?? 6;
  const seed = config.seed ?? 42;

  const { position, rotation, scale } = useThreeAnimation(
    config.position,
    config.rotation,
    config.scale,
    config.animation
  );

  // Generate deterministic base positions using seeded PRNG
  const { positions, initialY } = useMemo(() => {
    const rng = seededRandom(seed);
    const pos = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = rng() * spread;
      const theta = rng() * 2 * Math.PI;
      const phi = Math.acos(2 * rng() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 1] = y;
      initY[i] = y;
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return { positions: pos, initialY: initY };
  }, [count, spread, seed]);

  // Animate particles based on frame
  const animatedPositions = useMemo(() => {
    const pos = new Float32Array(positions);
    const time = frame * 0.02;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle wave / float
      pos[idx + 1] = initialY[i] + Math.sin(time + pos[idx] * 0.5) * 0.3;
    }
    return pos;
  }, [positions, initialY, frame, count]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[animatedPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={config.particleSize ?? 0.07}
          color={config.color ?? "#38BDF8"}
          transparent
          opacity={config.opacity ?? 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
