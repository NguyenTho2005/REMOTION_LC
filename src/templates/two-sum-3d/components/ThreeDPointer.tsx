import React from "react";
import { staticFile } from "remotion";
import { Text } from "@react-three/drei";
import { TWO_SUM_COLORS, TWO_SUM_SPECS } from "../design-tokens";

export interface ThreeDPointerProps {
  type: "i" | "j";
  targetIndex: number;
  arrayLength?: number;
  spacing?: number;
  frame?: number;
  yOffset?: number;
}

export const ThreeDPointer: React.FC<ThreeDPointerProps> = ({
  type,
  targetIndex,
  arrayLength = 4,
  spacing = TWO_SUM_SPECS.arraySpacing,
  frame = 0,
  yOffset = 1.6,
}) => {
  const fontPath = staticFile("fonts/default.ttf");
  const totalWidth = (arrayLength - 1) * spacing;
  const startX = -totalWidth / 2;
  const targetX = startX + targetIndex * spacing;

  const isPointerI = type === "i";
  const pointerColor = isPointerI ? TWO_SUM_COLORS.pointerI : TWO_SUM_COLORS.pointerJ;
  const label = isPointerI ? "i" : "j";

  // Subtle natural floating bounce
  const bounceY = Math.sin((frame * 0.12) + (isPointerI ? 0 : Math.PI / 2)) * 0.08;

  return (
    <group position={[targetX, yOffset + bounceY, 0]}>
      {/* 3D Arrow Head (Cone pointing down) */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.3, 0.45, 16]} />
        <meshStandardMaterial
          color={pointerColor}
          emissive={pointerColor}
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.2}
        />
      </mesh>

      {/* Pointer Stem (Cylinder) */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial
          color={pointerColor}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Pointer Label Sphere Badge */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial
          color="#0F172A"
          emissive={pointerColor}
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Text Label ("i" or "j") */}
      <Text
        font={fontPath}
        position={[0, 0.65, 0.25]}
        fontSize={0.36}
        color={pointerColor}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};
