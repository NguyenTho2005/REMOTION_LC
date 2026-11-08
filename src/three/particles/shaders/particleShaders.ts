/**
 * GLSL Shaders for GPU-driven Particle VFX in Remotion + Three.js
 * Compatible with WebGL 1/2 in headless Chromium.
 */

export const PARTICLE_VERTEX_SHADER = /* glsl */ `
  uniform float uFrame;
  uniform float uFps;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uBaseSize;
  uniform float uOpacity;
  uniform float uNoiseStrength;

  attribute vec3 targetPosition;
  attribute vec3 velocity;
  attribute vec4 customData; // x: scale, y: phase, z: speed, w: id
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  // Simple pseudo-random hash
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // 3D Simplex-like deterministic noise function
  vec3 curlNoise(vec3 p) {
    float n1 = sin(p.y * 1.5 + uTime * 0.5) * cos(p.z * 1.5);
    float n2 = sin(p.z * 1.5 + uTime * 0.5) * cos(p.x * 1.5);
    float n3 = sin(p.x * 1.5 + uTime * 0.5) * cos(p.y * 1.5);
    return vec3(n1, n2, n3);
  }

  void main() {
    vPhase = customData.y;
    float particleId = customData.w;
    float speedMult = customData.z;

    // Interpolate or displace position based on progress
    vec3 currentPos = position;

    // If targetPosition is set and differs from position, morph towards it
    if (length(targetPosition) > 0.001) {
      // Smooth S-curve transition with per-particle phase delay
      float localProgress = clamp((uProgress - customData.y * 0.25) / 0.75, 0.0, 1.0);
      float smoothProg = smoothstep(0.0, 1.0, localProgress);
      currentPos = mix(position, targetPosition, smoothProg);
    }

    // Add deterministic turbulence / velocity motion
    if (uNoiseStrength > 0.001) {
      vec3 noise = curlNoise(currentPos * 0.5 + vec3(particleId * 0.01));
      currentPos += noise * (uNoiseStrength * sin(uTime + customData.y * 6.28318));
    }

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation: larger when closer to camera
    float pSize = uBaseSize * customData.x;
    float depthFactor = 280.0 / -mvPosition.z;
    gl_PointSize = clamp(pSize * depthFactor, 1.5, 96.0);

    // Color gradient interpolation based on position & phase
    float colorMix = clamp((currentPos.y + 3.0) / 6.0 + sin(uTime + customData.y * 3.14159) * 0.2, 0.0, 1.0);
    vColor = mix(uColor1, uColor2, colorMix);
    if (length(aColor) > 0.01) {
      vColor = mix(vColor, aColor, 0.5);
    }

    // Alpha fade based on progress and particle lifetime
    float pulse = 0.8 + 0.2 * sin(uTime * 3.0 + customData.y * 6.28318);
    vAlpha = uOpacity * pulse;
  }
`;

export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    // Distance from center of the point sprite: [0, 0.5]
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Soft circular falloff with hot center glow
    float core = smoothstep(0.15, 0.0, dist);
    float glow = smoothstep(0.5, 0.05, dist);
    float finalAlpha = (glow * 0.7 + core * 0.3) * vAlpha;

    // Intense center core color
    vec3 finalColor = vColor + vec3(core * 0.45);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

export const HOLOGRAM_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Holographic scanlines & flicker
    float scanline = sin(gl_FragCoord.y * 0.35 + uTime * 8.0) * 0.25 + 0.75;
    float flicker = sin(uTime * 15.0 + vPhase * 10.0) * 0.15 + 0.85;

    float glow = smoothstep(0.5, 0.08, dist);
    float finalAlpha = glow * vAlpha * scanline * flicker;

    // Cyan/Electric holographic tint
    vec3 holoTint = vec3(0.1, 0.9, 1.0);
    vec3 finalColor = mix(vColor, holoTint, 0.4) * (1.1 + flicker * 0.2);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;
