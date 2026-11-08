import React from "react";
import type { Any3DObjectConfig, Scene3DConfig } from "../core/types";
import { ThreeCanvasContainer } from "../core/ThreeCanvasContainer";
import { GeometryObject } from "../objects/Geometries";
import { Text3DObject } from "../objects/Text3D";
import { ParticleCloud } from "../objects/ParticleCloud";
import { NetworkGraph3D } from "../objects/NetworkGraph3D";
import { Chart3D } from "../objects/Chart3D";
import { ModelViewer3D } from "../objects/ModelViewer3D";
import { ParticleDispatcher } from "../particles/presets";

export const Render3DObject: React.FC<{ object: Any3DObjectConfig }> = ({ object }) => {
  switch (object.type) {
    case "cube":
    case "sphere":
    case "cylinder":
    case "torus":
      return <GeometryObject key={object.id} config={object} />;
    case "text3d":
      return <Text3DObject key={object.id} config={object} />;
    case "particles":
      return <ParticleCloud key={object.id} config={object} />;
    case "networkGraph":
      return <NetworkGraph3D key={object.id} config={object} />;
    case "barChart":
      return <Chart3D key={object.id} config={object} />;
    case "gltfModel":
      return <ModelViewer3D key={object.id} config={object} />;
    default:
      return null;
  }
};

export const Scene3DDispatcher: React.FC<{ config: Scene3DConfig }> = ({ config }) => {
  return (
    <ThreeCanvasContainer config={config}>
      {config.particleConfig && (
        <ParticleDispatcher config={config.particleConfig} />
      )}
      {config.objects.map((obj) => (
        <Render3DObject key={obj.id} object={obj} />
      ))}
    </ThreeCanvasContainer>
  );
};
