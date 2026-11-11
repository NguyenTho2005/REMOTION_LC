import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend, type ThreeElement } from "@react-three/fiber";

export type AuroraGlassUniforms = {
  uTime: number;
  uResolution: THREE.Vector2;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
  uColorC: THREE.Color;
  uIntensity: number;
  uRoughness: number;
};

export type AuroraGlassMaterialProps = Partial<{
  uTime: number;
  uResolution: THREE.Vector2 | [number, number];
  uColorA: THREE.ColorRepresentation;
  uColorB: THREE.ColorRepresentation;
  uColorC: THREE.ColorRepresentation;
  uIntensity: number;
  uRoughness: number;
  transparent: boolean;
  depthWrite: boolean;
}>;

export const auroraGlassVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const auroraGlassFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uIntensity;
  uniform float uRoughness;

  varying vec2 vUv;

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = uv;
    aspectUv.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.12;
    float wave = fbm(aspectUv * 1.4 + vec2(t, -t * 0.7));
    float wave2 = fbm(aspectUv * 2.2 + vec2(-t * 0.6, t * 0.9) + wave * 0.35);
    float band = smoothstep(-0.2, 0.9, uv.y + wave * 0.18 + wave2 * 0.12);

    vec3 aurora = mix(uColorA, uColorB, clamp(0.5 + 0.5 * wave, 0.0, 1.0));
    aurora = mix(aurora, uColorC, clamp(0.5 + 0.5 * wave2, 0.0, 1.0));
    aurora *= 0.55 + 0.75 * band * (0.6 + 0.4 * uIntensity);

    float vignette = smoothstep(1.15, 0.15, distance(uv, vec2(0.5)));
    vec3 base = vec3(0.02, 0.03, 0.08);
    vec3 color = base + aurora * uIntensity;
    color *= 0.7 + 0.3 * vignette;

    // Subtle grain modulated by roughness for a frosted/glass-adjacent feel
    float grain = snoise(uv * uResolution.xy * 0.35 + uTime * 0.8) * 0.02 * uRoughness;
    color += grain;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export const AuroraGlassMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1080, 1920),
    uColorA: new THREE.Color("#22d3ee"),
    uColorB: new THREE.Color("#7c3aed"),
    uColorC: new THREE.Color("#34d399"),
    uIntensity: 1.0,
    uRoughness: 0.25,
  },
  auroraGlassVertexShader,
  auroraGlassFragmentShader,
);

extend({ AuroraGlassMaterial: AuroraGlassMaterialImpl });

export type AuroraGlassMaterialInstance = THREE.ShaderMaterial & AuroraGlassUniforms;

declare module "@react-three/fiber" {
  interface ThreeElements {
    auroraGlassMaterial: ThreeElement<typeof AuroraGlassMaterialImpl> &
      AuroraGlassMaterialProps;
  }
}
