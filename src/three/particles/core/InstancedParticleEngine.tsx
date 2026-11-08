import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { useParticleTimeline } from "./useParticleTimeline";
import { seededRandom } from "../../core/constants";

export interface InstancedParticleEngineProps {
  count?: number;
  shape?: "box" | "tetrahedron" | "octahedron";
  color?: string;
  secondaryColor?: string;
  size?: number;
  speed?: number;
  spread?: number;
  seed?: number;
  startFrame?: number;
  durationInFrames?: number;
  position?: [number, number, number];
}

const dummyMatrix = new THREE.Matrix4();
const dummyPosition = new THREE.Vector3();
const dummyRotation = new THREE.Euler();
const dummyQuaternion = new THREE.Quaternion();
const dummyScale = new THREE.Vector3();

export const InstancedParticleEngine: React.FC<InstancedParticleEngineProps> = ({
  count = 200,
  shape = "box",
  color = "#38BDF8",
  secondaryColor = "#EC4899",
  size = 0.12,
  speed = 1.0,
  spread = 4.0,
  seed = 42,
  startFrame = 0,
  durationInFrames,
  position = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { frame, fps, opacityMultiplier } = useParticleTimeline({
    startFrame,
    durationInFrames,
  });

  // Deterministic initial states
  const instances = useMemo(() => {
    const rng = seededRandom(seed);
    const data = [];
    const colorObj1 = new THREE.Color(color);
    const colorObj2 = new THREE.Color(secondaryColor);

    for (let i = 0; i < count; i++) {
      const radius = (0.5 + rng() * 0.5) * spread;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);

      const vx = Math.sin(phi) * Math.cos(theta);
      const vy = Math.sin(phi) * Math.sin(theta);
      const vz = Math.cos(phi);

      const rotSpeedX = (rng() - 0.5) * 4;
      const rotSpeedY = (rng() - 0.5) * 4;
      const rotSpeedZ = (rng() - 0.5) * 4;
      const scaleBase = 0.5 + rng() * 0.8;

      const instanceColor = rng() > 0.5 ? colorObj1 : colorObj2;

      data.push({
        basePos: [vx * radius, vy * radius, vz * radius] as [number, number, number],
        velocity: [vx, vy, vz] as [number, number, number],
        rotSpeed: [rotSpeedX, rotSpeedY, rotSpeedZ] as [number, number, number],
        scaleBase,
        color: instanceColor,
      });
    }
    return data;
  }, [count, seed, spread, color, secondaryColor]);

  // Update instance matrices synchronously per frame
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const time = (frame / fps) * speed;

    for (let i = 0; i < count; i++) {
      const inst = instances[i];

      // Deterministic explosion / orbital displacement
      const currentRadius = 1.0 + Math.sin(time * 0.8 + i * 0.1) * 0.4;
      dummyPosition.set(
        inst.basePos[0] * currentRadius,
        inst.basePos[1] * currentRadius + Math.sin(time * 1.5 + inst.basePos[0]) * 0.3,
        inst.basePos[2] * currentRadius
      );

      dummyRotation.set(
        time * inst.rotSpeed[0],
        time * inst.rotSpeed[1],
        time * inst.rotSpeed[2]
      );
      dummyQuaternion.setFromEuler(dummyRotation);

      const s = inst.scaleBase * size * opacityMultiplier;
      dummyScale.set(s, s, s);

      dummyMatrix.compose(dummyPosition, dummyQuaternion, dummyScale);
      mesh.setMatrixAt(i, dummyMatrix);
      mesh.setColorAt(i, inst.color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, fps, frame, instances, opacityMultiplier, size, speed]);

  const geometry = useMemo(() => {
    switch (shape) {
      case "tetrahedron":
        return new THREE.TetrahedronGeometry(1);
      case "octahedron":
        return new THREE.OctahedronGeometry(1);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [shape]);

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, undefined, count]}
      >
        <meshStandardMaterial
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.9 * opacityMultiplier}
        />
      </instancedMesh>
    </group>
  );
};
