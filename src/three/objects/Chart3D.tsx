import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Text } from "@react-three/drei";
import type { BarChart3DObjectConfig } from "../core/types";
import { useThreeAnimation } from "../animations/useThreeAnimation";
import { DEFAULT_3D_FONT } from "../core/constants";
import { getAspectRatioInfo } from "../../3d/utils/fitObjectToCamera";

export const Chart3D: React.FC<{ config: BarChart3DObjectConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const aspectInfo = getAspectRatioInfo(width, height);

  const data = config.data;
  const maxHeight = config.maxHeight ?? 3.5;
  const barWidth = config.barWidth ?? 0.7;

  const { position, rotation, scale } = useThreeAnimation(
    config.position,
    config.rotation,
    config.scale,
    config.animation
  );

  // Responsive scale & position: keep chart safely within portrait 9:16 bounds
  const responsiveScale = aspectInfo.isPortrait ? 0.65 : 1.0;
  const adjustedY = aspectInfo.isPortrait ? position[1] + 0.5 : position[1];

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const totalBars = data.length;
  const spacing = 1.3;
  const startX = -((totalBars - 1) * spacing) / 2;

  // Staggered spring entrance
  const barSprings = data.map((_, i) =>
    spring({
      frame: Math.max(0, frame - i * 6),
      fps,
      config: { damping: 14, stiffness: 100 },
    })
  );

  return (
    <group
      position={[position[0], adjustedY, position[2]]}
      rotation={rotation}
      scale={[scale[0] * responsiveScale, scale[1] * responsiveScale, scale[2] * responsiveScale]}
    >
      {/* Base Grid Plane */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[totalBars * spacing + 1.5, 3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* 3D Bar Columns */}
      {data.map((item, idx) => {
        const targetHeight = (item.value / maxValue) * maxHeight;
        const currentHeight = Math.max(0.05, targetHeight * barSprings[idx]);
        const xPos = startX + idx * spacing;
        const barColor = item.color ?? (idx % 2 === 0 ? "#38BDF8" : "#818CF8");

        return (
          <group key={item.label} position={[xPos, 0, 0]}>
            {/* 3D Bar Mesh */}
            <mesh position={[0, currentHeight / 2, 0]}>
              <boxGeometry args={[barWidth, currentHeight, barWidth]} />
              <meshStandardMaterial
                color={barColor}
                metalness={0.3}
                roughness={0.2}
                emissive={barColor}
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Value on top of bar */}
            <Text
              font={DEFAULT_3D_FONT}
              position={[0, currentHeight + 0.35, 0]}
              fontSize={0.32}
              color="#FFFFFF"
              anchorX="center"
              anchorY="bottom"
            >
              {String(item.value)}
            </Text>

            {/* Category Label at bottom */}
            <Text
              font={DEFAULT_3D_FONT}
              position={[0, -0.3, 0.8]}
              fontSize={0.26}
              color="#94A3B8"
              anchorX="center"
              anchorY="top"
              rotation={[-0.4, 0, 0]}
            >
              {item.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
