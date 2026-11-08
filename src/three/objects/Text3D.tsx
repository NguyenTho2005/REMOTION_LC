import React from "react";
import { useVideoConfig } from "remotion";
import { Text } from "@react-three/drei";
import type { Text3DObjectConfig } from "../core/types";
import { useThreeAnimation } from "../animations/useThreeAnimation";
import { DEFAULT_3D_FONT } from "../core/constants";
import { getAspectRatioInfo } from "../../3d/utils/fitObjectToCamera";

export const Text3DObject: React.FC<{ config: Text3DObjectConfig }> = ({ config }) => {
  const { width, height } = useVideoConfig();
  const aspectInfo = getAspectRatioInfo(width, height);

  const { position, rotation, scale, opacity } = useThreeAnimation(
    config.position,
    config.rotation,
    config.scale,
    config.animation
  );

  const baseFontSize = config.fontSize ?? 0.8;
  const textLen = (config.text || "").length;
  // Dynamically constrain font size to prevent lateral clipping in portrait 9:16
  const maxCharsAtBaseSize = aspectInfo.isPortrait ? 9 : 18;
  const autoScale = textLen > maxCharsAtBaseSize ? maxCharsAtBaseSize / textLen : 1.0;
  const effectiveFontSize = baseFontSize * autoScale;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Text
        font={DEFAULT_3D_FONT}
        fontSize={effectiveFontSize}
        color={config.color ?? "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={config.letterSpacing ?? 0.02}
        fillOpacity={opacity}
      >
        {config.text}
        <meshStandardMaterial
          attach="material"
          color={config.color ?? "#FFFFFF"}
          metalness={config.metalness ?? 0.2}
          roughness={config.roughness ?? 0.2}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </Text>
    </group>
  );
};
