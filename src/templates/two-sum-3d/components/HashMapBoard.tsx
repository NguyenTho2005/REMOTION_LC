import React from "react";
import { staticFile } from "remotion";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { TWO_SUM_COLORS } from "../design-tokens";
import type { HashMapEntry } from "../types";

export interface HashMapBoardProps {
  entries: HashMapEntry[];
  position?: [number, number, number];
  scale?: number;
  activeComplementKey?: number | null;
  frame?: number;
}

export const HashMapBoard: React.FC<HashMapBoardProps> = ({
  entries,
  position = [0, 0, 0],
  scale = 0.9,
  activeComplementKey = null,
  frame = 0,
}) => {
  const fontPath = staticFile("fonts/default.ttf");

  const boardWidth = 3.6;
  const rowHeight = 0.72;
  const boardHeight = Math.max(3.2, 1.4 + entries.length * rowHeight);

  return (
    <group position={position} scale={scale}>
      {/* 3D Backing Board */}
      <mesh position={[0, -boardHeight / 2 + 1.2, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[boardWidth, boardHeight, 0.2]} />
        <meshStandardMaterial
          color="#0F172A"
          emissive="#1E293B"
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Board Glowing Border */}
      <lineSegments position={[0, -boardHeight / 2 + 1.2, -0.05]}>
        <edgesGeometry args={[new THREE.BoxGeometry(boardWidth, boardHeight, 0.2)]} />
        <lineBasicMaterial color={TWO_SUM_COLORS.matchSuccess} linewidth={2} />
      </lineSegments>

      {/* Header Badge */}
      <group position={[0, 0.8, 0.1]}>
        <Text
          font={fontPath}
          fontSize={0.36}
          color={TWO_SUM_COLORS.target}
          anchorX="center"
          anchorY="middle"
        >
          HASH MAP (O(1) Tra cứu)
        </Text>
      </group>

      {/* Column Titles */}
      <group position={[0, 0.25, 0.1]}>
        <Text
          font={fontPath}
          position={[-1.0, 0, 0]}
          fontSize={0.26}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          Key (Giá trị)
        </Text>
        <Text
          font={fontPath}
          position={[0, 0, 0]}
          fontSize={0.28}
          color="#64748B"
          anchorX="center"
          anchorY="middle"
        >
          →
        </Text>
        <Text
          font={fontPath}
          position={[1.0, 0, 0]}
          fontSize={0.26}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          Val (Chỉ số)
        </Text>
      </group>

      {/* Divider Line */}
      <mesh position={[0, 0.05, 0.08]}>
        <boxGeometry args={[3.6, 0.03, 0.02]} />
        <meshBasicMaterial color="#334155" />
      </mesh>

      {/* Rows */}
      {entries.length === 0 ? (
        <group position={[0, -0.6, 0.1]}>
          <Text
            font={fontPath}
            fontSize={0.28}
            color="#475569"
            anchorX="center"
            anchorY="middle"
          >
            [Bảng đang trống...]
          </Text>
        </group>
      ) : (
        entries.map((entry, idx) => {
          const yPos = -0.4 - idx * rowHeight;
          const isMatched = entry.key === activeComplementKey || entry.highlight;

          const rowBgColor = isMatched ? TWO_SUM_COLORS.matchSuccess : "#1E293B";
          const glowPulse = isMatched ? 0.6 + Math.sin(frame * 0.2) * 0.3 : 0.1;

          return (
            <group key={`row-${entry.key}-${entry.value}`} position={[0, yPos, 0.1]}>
              {/* Row Capsule */}
              <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[3.6, 0.55, 0.08]} />
                <meshStandardMaterial
                  color={rowBgColor}
                  emissive={isMatched ? TWO_SUM_COLORS.matchSuccess : "#1E293B"}
                  emissiveIntensity={glowPulse}
                  metalness={0.2}
                  roughness={0.3}
                />
              </mesh>

              {/* Key Value */}
              <Text
                font={fontPath}
                position={[-1.0, 0, 0.05]}
                fontSize={0.34}
                color={isMatched ? "#FFFFFF" : TWO_SUM_COLORS.hashMapKey}
                anchorX="center"
                anchorY="middle"
              >
                {entry.key}
              </Text>

              {/* Arrow */}
              <Text
                font={fontPath}
                position={[0, 0, 0.05]}
                fontSize={0.28}
                color={isMatched ? "#FFFFFF" : "#64748B"}
                anchorX="center"
                anchorY="middle"
              >
                :
              </Text>

              {/* Index Value */}
              <Text
                font={fontPath}
                position={[1.0, 0, 0.05]}
                fontSize={0.34}
                color={isMatched ? "#FFFFFF" : TWO_SUM_COLORS.hashMapVal}
                anchorX="center"
                anchorY="middle"
              >
                {`index ${entry.value}`}
              </Text>
            </group>
          );
        })
      )}
    </group>
  );
};
