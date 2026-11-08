import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Text } from "@react-three/drei";
import { ThreeCanvasContainer } from "../core/ThreeCanvasContainer";
import type { Scene3DConfig } from "../core/types";
import { DEFAULT_3D_FONT } from "../core/constants";
import { getAspectRatioInfo } from "../../3d/utils/fitObjectToCamera";

export interface AlgorithmVizProps {
  algorithm?: "binary-search" | "bubble-sort";
  target?: number;
  array?: number[];
  durationInFrames?: number;
}

export const Template03AlgorithmViz: React.FC<AlgorithmVizProps> = ({
  algorithm: _algorithm = "binary-search",
  target = 23,
  array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
  durationInFrames = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const aspectInfo = getAspectRatioInfo(width, height);

  // Step 1: frame 0 -> 50: Initial array, mid = 4 (value 16)
  // Step 2: frame 50 -> 110: Discard left half, mid = 7 (value 56)
  // Step 3: frame 110 -> 180: Discard right half, mid = 5 (value 23, MATCH!)
  let low = 0;
  let high = array.length - 1;
  let mid = Math.floor((low + high) / 2); // 4
  let statusText = `Khởi tạo: Tìm kiếm số ${target}`;
  let comparisonText = `So sánh arr[mid]=${array[mid]} với ${target}`;
  let matchFound = false;

  if (frame >= 45 && frame < 105) {
    // 16 < 23 -> low = mid + 1 = 5
    low = 5;
    high = 9;
    mid = Math.floor((low + high) / 2); // 7 (value 56)
    statusText = `${array[4]} < ${target} → Bỏ nửa trái, dời low = 5`;
    comparisonText = `So sánh arr[mid]=${array[mid]} với ${target}`;
  } else if (frame >= 105) {
    // 56 > 23 -> high = mid - 1 = 6, low = 5 -> mid = 5 (value 23)
    low = 5;
    high = 6;
    mid = 5; // value 23
    statusText = `${array[7]} > ${target} → Bỏ nửa phải, dời high = 6`;
    comparisonText = `arr[5] = 23 === TARGET! Tìm thấy kết quả`;
    matchFound = true;
  }

  // Multi-aspect-ratio responsive array layout:
  // In portrait (9:16), scale array down and adjust spacing so all 10 elements fit inside safe bounds
  const arrayScale = aspectInfo.isPortrait ? 0.44 : 1.0;
  const spacing = 1.1;
  const startX = -((array.length - 1) * spacing) / 2;
  const arrayYOffset = aspectInfo.isPortrait ? 0.7 : 0;

  const sceneConfig: Scene3DConfig = {
    id: "algorithm-viz",
    type: "3d-algorithm-viz",
    durationInFrames,
    camera: {
      preset: "static",
      position: [0, 2.0, aspectInfo.isPortrait ? 10.5 : 9.5],
      target: [0, arrayYOffset, 0],
      fov: 48,
    },
    lighting: {
      preset: "studio",
      ambientIntensity: 0.7,
      mainLightIntensity: 2.0,
    },
    background: "#080B14",
    objects: [
      {
        id: "placeholder",
        type: "cube",
        position: [0, -10, 0],
      },
    ],
    captionOverlay: {
      badge: `Algorithm: ${_algorithm}`,
      title: "Binary Search (Tìm Kiếm Nhị Phân)",
      subtitle: `${statusText} • ${comparisonText}`,
      safeArea: true,
    },
  };

  return (
    <ThreeCanvasContainer config={sceneConfig}>
      {/* 3D Array Blocks container with responsive scaling */}
      <group position={[0, arrayYOffset, 0]} scale={[arrayScale, arrayScale, arrayScale]}>
        {array.map((val, idx) => {
          const x = startX + idx * spacing;
          const isInRange = idx >= low && idx <= high;
          const isMid = idx === mid;
          const isTarget = isMid && matchFound;

          let blockColor = "#1E293B"; // eliminated
          let emissiveIntensity = 0.1;
          let yOffset = 0;

          if (isTarget) {
            blockColor = "#10B981"; // Target found emerald
            emissiveIntensity = 0.8;
            yOffset = 0.4;
          } else if (isMid) {
            blockColor = "#F59E0B"; // Current mid pointer amber
            emissiveIntensity = 0.5;
            yOffset = 0.2;
          } else if (isInRange) {
            blockColor = "#0284C7"; // Active search range cyan
            emissiveIntensity = 0.2;
          }

          const blockSpring = spring({
            frame: Math.max(0, frame - idx * 2),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          return (
            <group key={idx} position={[x, yOffset * blockSpring, 0]} scale={blockSpring}>
              {/* 3D Box */}
              <mesh>
                <boxGeometry args={[0.9, 1.2, 0.9]} />
                <meshStandardMaterial
                  color={blockColor}
                  metalness={0.3}
                  roughness={0.3}
                  emissive={blockColor}
                  emissiveIntensity={emissiveIntensity}
                />
              </mesh>

              {/* Value Text */}
              <Text
                font={DEFAULT_3D_FONT}
                position={[0, 0, 0.5]}
                fontSize={0.42}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
              >
                {String(val)}
              </Text>

              {/* Index label below */}
              <Text
                font={DEFAULT_3D_FONT}
                position={[0, -0.9, 0]}
                fontSize={0.24}
                color={isInRange ? "#94A3B8" : "#475569"}
                anchorX="center"
                anchorY="top"
              >
                [{idx}]
              </Text>
            </group>
          );
        })}

        {/* Floating Pointer for Mid */}
        <group position={[startX + mid * spacing, 1.8, 0]}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.25, 0.6, 16]} />
            <meshStandardMaterial
              color={matchFound ? "#10B981" : "#F59E0B"}
              emissive={matchFound ? "#10B981" : "#F59E0B"}
              emissiveIntensity={0.6}
            />
          </mesh>
          <Text
            font={DEFAULT_3D_FONT}
            position={[0, 0.6, 0]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
          >
            {matchFound ? "FOUND!" : "MID"}
          </Text>
        </group>

        {/* Low Pointer */}
        <group position={[startX + low * spacing, -1.8, 0]}>
          <Text font={DEFAULT_3D_FONT} fontSize={0.24} color="#38BDF8" anchorX="center">
            LOW={low}
          </Text>
        </group>

        {/* High Pointer */}
        <group position={[startX + high * spacing, -1.8, 0]}>
          <Text font={DEFAULT_3D_FONT} fontSize={0.24} color="#38BDF8" anchorX="center">
            HIGH={high}
          </Text>
        </group>
      </group>
    </ThreeCanvasContainer>
  );
};
