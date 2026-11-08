import React from "react";
import { staticFile, interpolate } from "remotion";
import { Text } from "@react-three/drei";
import { TWO_SUM_COLORS } from "../design-tokens";

export interface ComparisonMatrixProps {
  progress?: number; // 0 to 1
  scale?: number;
  position?: [number, number, number];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  progress = 0,
  scale = 1.0,
  position = [0, 0, 0],
}) => {
  const fontPath = staticFile("fonts/default.ttf");

  // Grid size grows from 4 up to 8 rows for visual metaphor
  const currentN = Math.round(interpolate(progress, [0, 1], [4, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  const spacing = 0.55;
  const cubeSize = 0.42;

  // Generate upper triangular pairs (j > i)
  const pairs: Array<{ i: number; j: number }> = [];
  for (let i = 0; i < currentN; i++) {
    for (let j = i + 1; j < currentN; j++) {
      pairs.push({ i, j });
    }
  }

  const comparisonsCount = (currentN * (currentN - 1)) / 2;

  return (
    <group position={position} scale={scale}>
      {/* Title */}
      <Text
        font={fontPath}
        position={[0, 2.8, 0]}
        fontSize={0.42}
        color={TWO_SUM_COLORS.bruteForceSlow}
        anchorX="center"
        anchorY="middle"
      >
        MA TRẬN VÉT CẠN: O(n²)
      </Text>

      {/* Formula & Count subtitle */}
      <Text
        font={fontPath}
        position={[0, 2.2, 0]}
        fontSize={0.28}
        color="#CBD5E1"
        anchorX="center"
        anchorY="middle"
      >
        {`n = ${currentN} → Số phép so sánh: ${comparisonsCount}`}
      </Text>

      {/* 3D Triangular Grid of Comparisons */}
      <group position={[-(currentN * spacing) / 2, 0.8, 0]}>
        {pairs.map((pair) => {
          const x = pair.j * spacing;
          const y = -pair.i * spacing;

          return (
            <group key={`pair-${pair.i}-${pair.j}`} position={[x, y, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
                <meshStandardMaterial
                  color={TWO_SUM_COLORS.bruteForceSlow}
                  emissive={TWO_SUM_COLORS.bruteForceSlow}
                  emissiveIntensity={0.4}
                  metalness={0.2}
                  roughness={0.3}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Extreme Case Label */}
      {progress > 0.6 && (
        <group position={[0, -2.2, 0]}>
          <Text
            font={fontPath}
            fontSize={0.32}
            color="#FCA5A5"
            anchorX="center"
            anchorY="middle"
          >
            n = 10,000 → ~50,000,000 phép tính!
          </Text>
        </group>
      )}
    </group>
  );
};
