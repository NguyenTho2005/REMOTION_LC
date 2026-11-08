import React, { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTFModel3DObjectConfig } from "../core/types";
import { useThreeAnimation } from "../animations/useThreeAnimation";

const GLTFModelInternal: React.FC<{ url: string }> = ({ url }) => {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene.clone()} />;
};

export const ModelViewer3D: React.FC<{ config: GLTFModel3DObjectConfig }> = ({
  config,
}) => {
  const { position, rotation, scale } = useThreeAnimation(
    config.position,
    config.rotation,
    config.scale,
    config.animation
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
              color={config.color ?? "#38BDF8"}
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>
        }
      >
        <GLTFModelInternal url={config.modelUrl} />
      </Suspense>
    </group>
  );
};
