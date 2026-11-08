import React from "react";
import { staticFile } from "remotion";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { TWO_SUM_COLORS, TWO_SUM_SPECS } from "../design-tokens";

export interface ArrayTileItem {
  value: number;
  index: number;
  status?: "idle" | "active" | "complement" | "match" | "dim" | "danger";
  customOffsetY?: number;
}

export interface ThreeDArrayProps {
  items: ArrayTileItem[];
  position?: [number, number, number];
  scale?: number;
  frame?: number;
  spacing?: number;
}

export const ThreeDArray: React.FC<ThreeDArrayProps> = ({
  items,
  position = [0, 0, 0],
  scale = 1.0,
  frame = 0,
  spacing = TWO_SUM_SPECS.arraySpacing,
}) => {
  const fontPath = staticFile("fonts/default.ttf");
  const totalWidth = (items.length - 1) * spacing;
  const startX = -totalWidth / 2;

  return (
    <group position={position} scale={scale}>
      {items.map((item, i) => {
        const xPos = startX + i * spacing;
        const status = item.status ?? "idle";

        // Color and elevation based on status
        let tileColor = TWO_SUM_COLORS.tileDefault;
        let strokeColor = TWO_SUM_COLORS.tileDefaultStroke;
        let textColor = "#FFFFFF";
        let targetElevation = 0;
        let emissiveIntensity = 0.1;

        if (status === "active") {
          tileColor = TWO_SUM_COLORS.pointerI;
          strokeColor = "#7DD3FC";
          targetElevation = 0.4;
          emissiveIntensity = 0.4;
        } else if (status === "complement") {
          tileColor = TWO_SUM_COLORS.hashMapVal;
          strokeColor = "#C084FC";
          targetElevation = 0.5;
          emissiveIntensity = 0.5;
        } else if (status === "match") {
          tileColor = TWO_SUM_COLORS.matchSuccess;
          strokeColor = "#34D399";
          targetElevation = 0.7;
          emissiveIntensity = 0.7;
        } else if (status === "danger") {
          tileColor = TWO_SUM_COLORS.bruteForceSlow;
          strokeColor = "#F87171";
          targetElevation = 0.3;
          emissiveIntensity = 0.5;
        } else if (status === "dim") {
          tileColor = "#111624";
          strokeColor = "#1E2538";
          textColor = "#64748B";
          targetElevation = -0.1;
          emissiveIntensity = 0.0;
        }

        const floatWobble = Math.sin((frame * 0.05) + i * 1.2) * 0.04;
        const elevationY = (item.customOffsetY ?? targetElevation) + floatWobble;

        return (
          <group key={`tile-${item.index}-${item.value}`} position={[xPos, elevationY, 0]}>
            {/* 3D Tile Box Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.35, 1.35, 0.35]} />
              <meshStandardMaterial
                color={tileColor}
                emissive={tileColor}
                emissiveIntensity={emissiveIntensity}
                metalness={0.25}
                roughness={0.3}
              />
            </mesh>

            {/* Glowing Border Frame */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.35, 1.35, 0.35)]} />
              <lineBasicMaterial color={strokeColor} linewidth={2} />
            </lineSegments>

            {/* Tile Number Text */}
            <Text
              font={fontPath}
              position={[0, 0, 0.22]}
              fontSize={0.7}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              characters="0123456789-+[]"
            >
              {item.value}
            </Text>

            {/* Index Badge below tile */}
            <group position={[0, -1.05, 0]}>
              <mesh>
                <boxGeometry args={[0.9, 0.38, 0.1]} />
                <meshStandardMaterial
                  color="#0F172A"
                  roughness={0.6}
                  metalness={0.2}
                />
              </mesh>
              <Text
                font={fontPath}
                position={[0, 0, 0.08]}
                fontSize={0.26}
                color="#94A3B8"
                anchorX="center"
                anchorY="middle"
              >
                {`i = ${item.index}`}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
};
