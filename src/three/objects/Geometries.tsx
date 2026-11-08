import React from "react";
import type { Geometry3DObjectConfig } from "../core/types";
import { useThreeAnimation } from "../animations/useThreeAnimation";

export const GeometryObject: React.FC<{ config: Geometry3DObjectConfig }> = ({
  config,
}) => {
  const { position, rotation, scale, opacity } = useThreeAnimation(
    config.position,
    config.rotation,
    config.scale,
    config.animation
  );

  const renderGeometry = () => {
    switch (config.type) {
      case "sphere": {
        const radius = config.args?.[0] ?? 1;
        const widthSegments = config.args?.[1] ?? 32;
        const heightSegments = config.args?.[2] ?? 32;
        return <sphereGeometry args={[radius, widthSegments, heightSegments]} />;
      }
      case "cylinder": {
        const radiusTop = config.args?.[0] ?? 1;
        const radiusBottom = config.args?.[1] ?? 1;
        const height = config.args?.[2] ?? 2;
        const radialSegments = config.args?.[3] ?? 32;
        return <cylinderGeometry args={[radiusTop, radiusBottom, height, radialSegments]} />;
      }
      case "torus": {
        const radius = config.args?.[0] ?? 1.2;
        const tube = config.args?.[1] ?? 0.35;
        const radialSegments = config.args?.[2] ?? 24;
        const tubularSegments = config.args?.[3] ?? 48;
        return <torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />;
      }
      case "cube":
      default: {
        const width = config.args?.[0] ?? 1.8;
        const height = config.args?.[1] ?? 1.8;
        const depth = config.args?.[2] ?? 1.8;
        return <boxGeometry args={[width, height, depth]} />;
      }
    }
  };

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {renderGeometry()}
      <meshStandardMaterial
        color={config.color ?? "#38BDF8"}
        metalness={config.metalness ?? 0.3}
        roughness={config.roughness ?? 0.3}
        wireframe={config.wireframe ?? false}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
};
