import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

export interface LiquidMotionBlobProps {
  /** Remotion frame number (deterministic clock source). */
  frame: number;
  width?: number;
  height?: number;
  colorA?: string;
  colorB?: string;
  background?: string;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// SDF metaballs with capped raymarch loop (<= 40 steps) for headless render performance.
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uBackground;

  varying vec2 vUv;

  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float mapScene(vec3 p) {
    float t = uTime;
    vec3 b1 = vec3(0.55 * sin(t * 0.9), 0.35 * cos(t * 1.1), 0.15 * sin(t * 0.7));
    vec3 b2 = vec3(0.65 * cos(t * 0.7 + 1.2), 0.45 * sin(t * 0.8 + 0.4), -0.2 * cos(t * 0.9));
    vec3 b3 = vec3(0.35 * sin(t * 1.25 + 2.1), -0.5 * cos(t * 0.6 + 0.8), 0.25 * sin(t * 1.0 + 1.7));
    vec3 b4 = vec3(-0.45 * cos(t * 1.05 + 0.5), 0.25 * sin(t * 1.3 + 1.9), -0.1 * sin(t * 0.85));

    float d = sdSphere(p - b1, 0.62);
    d = smin(d, sdSphere(p - b2, 0.48), 0.35);
    d = smin(d, sdSphere(p - b3, 0.42), 0.32);
    d = smin(d, sdSphere(p - b4, 0.38), 0.30);
    return d;
  }

  vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(0.0015, 0.0);
    return normalize(vec3(
      mapScene(p + e.xyy) - mapScene(p - e.xyy),
      mapScene(p + e.yxy) - mapScene(p - e.yxy),
      mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, 3.2);
    vec3 rd = normalize(vec3(uv, -1.8));

    float t = 0.0;
    bool hit = false;
    for (int i = 0; i < 40; i++) {
      vec3 p = ro + rd * t;
      float h = mapScene(p);
      if (h < 0.0012) {
        hit = true;
        break;
      }
      t += h;
      if (t > 6.0) {
        break;
      }
    }

    vec3 col = uBackground;
    if (hit) {
      vec3 p = ro + rd * t;
      vec3 n = calcNormal(p);
      vec3 lightDir = normalize(vec3(0.35, 0.55, 1.0));
      vec3 viewDir = normalize(ro - p);
      vec3 halfDir = normalize(lightDir + viewDir);

      float diff = clamp(dot(n, lightDir), 0.0, 1.0);
      float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 48.0);
      float fres = pow(1.0 - clamp(dot(n, viewDir), 0.0, 1.0), 3.0);
      float grad = clamp(0.5 + 0.5 * (p.y + 0.3 * sin(uTime * 0.8)), 0.0, 1.0);

      vec3 base = mix(uColorA, uColorB, grad);
      col = base * (0.18 + 0.95 * diff) + vec3(1.0) * spec * 0.55 + base * fres * 0.35;
    } else {
      float glow = smoothstep(1.2, 0.0, length(uv));
      col = mix(uBackground, mix(uColorA, uColorB, 0.5) * 0.25, glow * 0.35);
    }

    col = pow(clamp(col, 0.0, 1.0), vec3(0.95));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const LiquidBlobMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1080, 1920),
    uColorA: new THREE.Color("#ff4fd8"),
    uColorB: new THREE.Color("#38bdf8"),
    uBackground: new THREE.Color("#090b16"),
  },
  vertexShader,
  fragmentShader,
);

extend({ LiquidBlobMaterial: LiquidBlobMaterialImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidBlobMaterial: ThreeElement<typeof LiquidBlobMaterialImpl> & {
      uTime?: number;
      uResolution?: THREE.Vector2 | [number, number];
      uColorA?: THREE.ColorRepresentation;
      uColorB?: THREE.ColorRepresentation;
      uBackground?: THREE.ColorRepresentation;
    };
  }
}

const LiquidScene: React.FC<{
  frame: number;
  width: number;
  height: number;
  colorA: string;
  colorB: string;
  background: string;
}> = ({ frame, width, height, colorA, colorB, background }) => {
  // Requirement: uTime = frame / 30 (deterministic, Remotion-driven)
  const uTime = frame / 30;

  const uniforms = useMemo(
    () => ({
      uTime,
      uResolution: new THREE.Vector2(width, height),
      uColorA: new THREE.Color(colorA),
      uColorB: new THREE.Color(colorB),
      uBackground: new THREE.Color(background),
    }),
    [uTime, width, height, colorA, colorB, background],
  );

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[width, height, 1, 1]} />
      <liquidBlobMaterial
        uTime={uniforms.uTime}
        uResolution={uniforms.uResolution}
        uColorA={uniforms.uColorA}
        uColorB={uniforms.uColorB}
        uBackground={uniforms.uBackground}
      />
    </mesh>
  );
};

export const LiquidMotionBlob: React.FC<LiquidMotionBlobProps> = ({
  frame,
  width = 1080,
  height = 1920,
  colorA = "#ff4fd8",
  colorB = "#38bdf8",
  background = "#090b16",
}) => {
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic
      camera={{
        left: -halfW,
        right: halfW,
        top: halfH,
        bottom: -halfH,
        near: 0.1,
        far: 100,
        position: [0, 0, 10],
        zoom: 1,
      }}
      style={{ width, height }}
    >
      <LiquidScene
        frame={frame}
        width={width}
        height={height}
        colorA={colorA}
        colorB={colorB}
        background={background}
      />
    </ThreeCanvas>
  );
};
