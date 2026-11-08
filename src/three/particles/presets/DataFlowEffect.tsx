import React, { useMemo } from "react";
import * as THREE from "three";
import { ParticleEngine } from "../core/ParticleEngine";
import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory";
import type { DataFlowConfig } from "../types";
import { PARTICLE_QUALITY_BUDGETS } from "../types";
import { useParticleTimeline } from "../core/useParticleTimeline";
import { seededRandom } from "../../core/constants";

export const DataFlowEffect: React.FC<DataFlowConfig> = ({
  particleCount,
  seed = 42,
  color = "#10B981",
  secondaryColor = "#38BDF8",
  size = 0.08,
  opacity = 0.9,
  flowSpeed = 1.2,
  curveTightness = 1.0,
  startFrame = 0,
  durationInFrames = 120,
  quality = "standard",
  position = [0, 0, 0],
}) => {
  const maxBudget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;
  const count = Math.min(particleCount ?? 2500, maxBudget);

  const { time } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  // Construct deterministic 3D curves between nodes
  const { curves, particleBaseData, customData } = useMemo(() => {
    const rng = seededRandom(seed);

    // 4 interconnected nodes in 3D
    const nodeA = new THREE.Vector3(-3.5, -1.5, -1.0);
    const nodeB = new THREE.Vector3(-1.0, 1.8, 0.5);
    const nodeC = new THREE.Vector3(1.5, -1.0, 1.0);
    const nodeD = new THREE.Vector3(3.5, 1.5, -0.5);

    const path1 = new THREE.CatmullRomCurve3([
      nodeA,
      new THREE.Vector3(-2.2, 0.5, 1.2 * curveTightness),
      nodeB,
      new THREE.Vector3(0.2, 0.8, -1.0 * curveTightness),
      nodeC,
      new THREE.Vector3(2.5, 0.2, 0.8 * curveTightness),
      nodeD,
    ]);

    const path2 = new THREE.CatmullRomCurve3([
      nodeA,
      new THREE.Vector3(-1.8, -1.8, -0.8 * curveTightness),
      nodeC,
      new THREE.Vector3(1.8, 1.8, -1.2 * curveTightness),
      nodeD,
    ]);

    const curveList = [path1, path2];

    const baseData = [];
    for (let i = 0; i < count; i++) {
      const curveIndex = i % 2;
      const baseT = rng();
      const speed = 0.8 + rng() * 0.4;
      const jitterAngle = rng() * Math.PI * 2;
      const jitterDist = rng() * 0.22;

      baseData.push({
        curveIndex,
        baseT,
        speed,
        jitterX: Math.cos(jitterAngle) * jitterDist,
        jitterY: Math.sin(jitterAngle) * jitterDist,
        jitterZ: (rng() - 0.5) * 0.15,
      });
    }

    const cData = ParticleGeometryFactory.generateCustomData(count, seed);
    return { curves: curveList, particleBaseData: baseData, customData: cData };
  }, [count, curveTightness, seed]);

  // Compute positions along curve deterministically based on frame time
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const p = particleBaseData[i];
      const curve = curves[p.curveIndex];

      // Normalized progress loop along spline: [0, 1)
      const t = (p.baseT + time * flowSpeed * 0.25 * p.speed) % 1.0;
      const point = curve.getPointAt(t);

      const idx = i * 3;
      pos[idx] = point.x + p.jitterX;
      pos[idx + 1] = point.y + p.jitterY;
      pos[idx + 2] = point.z + p.jitterZ;
    }
    return pos;
  }, [count, curves, flowSpeed, particleBaseData, time]);

  return (
    <ParticleEngine
      positions={currentPositions}
      customData={customData}
      count={count}
      color={color}
      secondaryColor={secondaryColor}
      size={size}
      opacity={opacity}
      noiseStrength={0.1}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      quality={quality}
      position={position}
    />
  );
};
