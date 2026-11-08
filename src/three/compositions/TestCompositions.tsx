import React from "react";
import { Composition } from "remotion";
import { ThreeCanvasContainer } from "../core/ThreeCanvasContainer";
import { GeometryObject } from "../objects/Geometries";
import { Text3DObject } from "../objects/Text3D";
import { ModelViewer3D } from "../objects/ModelViewer3D";
import { Template03AlgorithmViz } from "../templates/Template03AlgorithmViz";
import { Template06HybridExplainer } from "../templates/Template06HybridExplainer";

// 1. Rotating 3D Object Test
export const TestRotatingObjectComponent: React.FC = () => {
  return (
    <ThreeCanvasContainer
      config={{
        type: "3d-tech-explainer",
        durationInFrames: 90,
        camera: { preset: "static", position: [0, 1, 5], distance: 5 },
        lighting: { preset: "studio" },
        objects: [],
        captionOverlay: {
          badge: "Test 01",
          title: "Rotating 3D Torus Object",
          subtitle: "Frame-driven rotation and specular highlights",
        },
      }}
    >
      <GeometryObject
        config={{
          id: "test-torus",
          type: "torus",
          args: [1.2, 0.4, 32, 64],
          color: "#38BDF8",
          metalness: 0.8,
          roughness: 0.2,
          animation: {
            type: "rotate",
            axis: "all",
            speed: 1.5,
          },
        }}
      />
    </ThreeCanvasContainer>
  );
};

// 2. Animated 3D Typography Test
export const TestTypographyComponent: React.FC = () => {
  return (
    <ThreeCanvasContainer
      config={{
        type: "3d-cinematic-intro",
        durationInFrames: 90,
        camera: { preset: "dolly", distance: 6 },
        lighting: { preset: "cyberpunk" },
        objects: [],
        captionOverlay: {
          badge: "Test 02",
          title: "Animated 3D Typography",
          subtitle: "Extruded vector text with spring scale-up",
        },
      }}
    >
      <Text3DObject
        config={{
          id: "test-text",
          type: "text3d",
          text: "REMOTION 3D",
          fontSize: 0.9,
          color: "#FFFFFF",
          letterSpacing: 0.05,
          animation: {
            type: "scaleUp",
            speed: 1.2,
          },
        }}
      />
    </ThreeCanvasContainer>
  );
};

// 3. Camera Orbit Test
export const TestCameraOrbitComponent: React.FC = () => {
  return (
    <ThreeCanvasContainer
      config={{
        type: "3d-tech-explainer",
        durationInFrames: 90,
        camera: { preset: "orbit", distance: 7, speed: 1.5 },
        lighting: { preset: "warm" },
        objects: [],
        captionOverlay: {
          badge: "Test 03",
          title: "Camera Orbit Motion",
          subtitle: "Deterministic 360-degree camera trajectory",
        },
      }}
    >
      <GeometryObject
        config={{
          id: "center-cube",
          type: "cube",
          args: [1.5, 1.5, 1.5],
          color: "#F59E0B",
          wireframe: true,
        }}
      />
      <GeometryObject
        config={{
          id: "satellite-sphere",
          type: "sphere",
          args: [0.5, 24, 24],
          position: [2.5, 0, 0],
          color: "#10B981",
        }}
      />
    </ThreeCanvasContainer>
  );
};

// 4. GLB Model Loading Test (with fallback)
export const TestGLBModelComponent: React.FC = () => {
  return (
    <ThreeCanvasContainer
      config={{
        type: "3d-product-showcase",
        durationInFrames: 90,
        camera: { preset: "static", position: [0, 0, 5], distance: 5 },
        lighting: { preset: "studio" },
        objects: [],
        captionOverlay: {
          badge: "Test 04",
          title: "GLTF/GLB Model Pipeline",
          subtitle: "Suspense fallback with delayRender synchronization",
        },
      }}
    >
      <ModelViewer3D
        config={{
          id: "test-glb",
          type: "gltfModel",
          modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb",
          color: "#A855F7",
          animation: {
            type: "rotate",
            axis: "y",
            speed: 1,
          },
        }}
      />
    </ThreeCanvasContainer>
  );
};

// Compositions
export const ThreeTestRotatingObject: React.FC = () => (
  <Composition
    id="ThreeTestRotatingObject"
    component={TestRotatingObjectComponent}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const ThreeTestTypography: React.FC = () => (
  <Composition
    id="ThreeTestTypography"
    component={TestTypographyComponent}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const ThreeTestCameraOrbit: React.FC = () => (
  <Composition
    id="ThreeTestCameraOrbit"
    component={TestCameraOrbitComponent}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const ThreeTestGLBModel: React.FC = () => (
  <Composition
    id="ThreeTestGLBModel"
    component={TestGLBModelComponent}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const ThreeTestAlgorithmViz: React.FC = () => (
  <Composition
    id="ThreeTestAlgorithmViz"
    component={Template03AlgorithmViz}
    durationInFrames={180}
    fps={30}
    width={1080}
    height={1920}
  />
);

export const ThreeTestHybridScene: React.FC = () => (
  <Composition
    id="ThreeTestHybridScene"
    component={Template06HybridExplainer}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
  />
);
