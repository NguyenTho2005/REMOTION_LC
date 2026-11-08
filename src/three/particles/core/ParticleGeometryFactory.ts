import * as THREE from "three";
import { seededRandom } from "../../core/constants.ts";

export interface SampledPointsData {
  positions: Float32Array;
  targetPositions?: Float32Array;
  velocities?: Float32Array;
  customData: Float32Array; // [scale, phase, speed, id] * count
  colors?: Float32Array;
}

export class ParticleGeometryFactory {
  /**
   * Deterministic Spherical sampling (Fibonacci spiral or volumetric)
   */
  public static sampleSphere(
    count: number,
    radius: number,
    seed: number = 42,
    volumetric: boolean = false
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const r = volumetric ? radius * Math.cbrt(rng()) : radius;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);

      positions[idx] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = r * Math.cos(phi);
    }
    return positions;
  }

  /**
   * Deterministic Cube sampling (hollow or solid)
   */
  public static sampleCube(
    count: number,
    size: number,
    seed: number = 42,
    hollow: boolean = false
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);
    const half = size / 2;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      if (hollow) {
        // Choose one of 6 faces
        const face = Math.floor(rng() * 6);
        const u = (rng() - 0.5) * size;
        const v = (rng() - 0.5) * size;

        switch (face) {
          case 0: positions[idx] = half; positions[idx + 1] = u; positions[idx + 2] = v; break;
          case 1: positions[idx] = -half; positions[idx + 1] = u; positions[idx + 2] = v; break;
          case 2: positions[idx] = u; positions[idx + 1] = half; positions[idx + 2] = v; break;
          case 3: positions[idx] = u; positions[idx + 1] = -half; positions[idx + 2] = v; break;
          case 4: positions[idx] = u; positions[idx + 1] = v; positions[idx + 2] = half; break;
          default: positions[idx] = u; positions[idx + 1] = v; positions[idx + 2] = -half; break;
        }
      } else {
        positions[idx] = (rng() - 0.5) * size;
        positions[idx + 1] = (rng() - 0.5) * size;
        positions[idx + 2] = (rng() - 0.5) * size;
      }
    }
    return positions;
  }

  /**
   * Deterministic Torus sampling
   */
  public static sampleTorus(
    count: number,
    radius: number,
    tube: number,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const u = rng() * Math.PI * 2;
      const v = rng() * Math.PI * 2;

      positions[idx] = (radius + tube * Math.cos(v)) * Math.cos(u);
      positions[idx + 1] = tube * Math.sin(v);
      positions[idx + 2] = (radius + tube * Math.cos(v)) * Math.sin(u);
    }
    return positions;
  }

  /**
   * Deterministic Cylinder sampling
   */
  public static sampleCylinder(
    count: number,
    radius: number,
    height: number,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const theta = rng() * Math.PI * 2;
      const y = (rng() - 0.5) * height;

      positions[idx] = radius * Math.cos(theta);
      positions[idx + 1] = y;
      positions[idx + 2] = radius * Math.sin(theta);
    }
    return positions;
  }

  /**
   * Deterministic Spiral Galaxy sampling (Logarithmic arms + core bulge)
   */
  public static sampleSpiralGalaxy(
    count: number,
    arms: number = 3,
    armSpread: number = 0.5,
    coreRadius: number = 0.8,
    maxRadius: number = 5.0,
    spiralTightness: number = 1.2,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // 20% in core bulge, 80% in arms
      const isCore = rng() < 0.2;

      if (isCore) {
        const r = coreRadius * Math.cbrt(rng());
        const theta = rng() * Math.PI * 2;
        const phi = Math.acos(2 * rng() - 1);
        positions[idx] = r * Math.sin(phi) * Math.cos(theta);
        positions[idx + 1] = r * Math.cos(phi) * 0.4; // Flatter core
        positions[idx + 2] = r * Math.sin(phi) * Math.sin(theta);
      } else {
        const armIndex = i % arms;
        const armAngle = (armIndex * 2 * Math.PI) / arms;
        const dist = coreRadius + (maxRadius - coreRadius) * Math.pow(rng(), 0.8);
        const spiralAngle = armAngle + dist * spiralTightness;
        const spreadAngle = (rng() - 0.5) * armSpread;
        const angle = spiralAngle + spreadAngle;

        const verticalSpread = (rng() - 0.5) * (0.35 * (1 - dist / maxRadius) + 0.1);

        positions[idx] = Math.cos(angle) * dist;
        positions[idx + 1] = verticalSpread;
        positions[idx + 2] = Math.sin(angle) * dist;
      }
    }
    return positions;
  }

  /**
   * Deterministic Wave Grid sampling
   */
  public static sampleWaveGrid(
    cols: number,
    rows: number,
    width: number,
    depth: number
  ): Float32Array {
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const stepX = width / (cols - 1);
    const stepZ = depth / (rows - 1);
    const startX = -width / 2;
    const startZ = -depth / 2;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[idx] = startX + c * stepX;
        positions[idx + 1] = 0;
        positions[idx + 2] = startZ + r * stepZ;
        idx += 3;
      }
    }
    return positions;
  }

  /**
   * Deterministic Tunnel sampling (Spiraling cylinder)
   */
  public static sampleTunnel(
    count: number,
    radius: number,
    length: number,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const z = (rng() - 0.5) * length;
      const angle = rng() * Math.PI * 2;
      const r = radius + (rng() - 0.5) * 0.4; // slight jitter

      positions[idx] = Math.cos(angle) * r;
      positions[idx + 1] = Math.sin(angle) * r;
      positions[idx + 2] = z;
    }
    return positions;
  }

  /**
   * Deterministic Spline Path sampling for Data Flow
   */
  public static sampleSplinePath(
    count: number,
    waypoints: [number, number, number][],
    spread: number = 0.2,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const positions = new Float32Array(count * 3);

    const vectors = waypoints.map((pt) => new THREE.Vector3(...pt));
    const curve = new THREE.CatmullRomCurve3(vectors);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const t = rng();
      const point = curve.getPoint(t);
      const jitterX = (rng() - 0.5) * spread;
      const jitterY = (rng() - 0.5) * spread;
      const jitterZ = (rng() - 0.5) * spread;

      positions[idx] = point.x + jitterX;
      positions[idx + 1] = point.y + jitterY;
      positions[idx + 2] = point.z + jitterZ;
    }
    return positions;
  }

  /**
   * Deterministic Explosion velocities and burst vectors
   */
  public static sampleExplosionVectors(
    count: number,
    speed: number = 1.0,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const vel = (0.5 + rng() * 0.8) * speed;

      velocities[idx] = vel * Math.sin(phi) * Math.cos(theta);
      velocities[idx + 1] = vel * Math.sin(phi) * Math.sin(theta);
      velocities[idx + 2] = vel * Math.cos(phi);
    }
    return velocities;
  }

  /**
   * Custom particle attribute data: [scale, phase, speed, id]
   */
  public static generateCustomData(
    count: number,
    seed: number = 42
  ): Float32Array {
    const rng = seededRandom(seed);
    const data = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const idx = i * 4;
      data[idx] = 0.6 + rng() * 0.8;      // scale (x)
      data[idx + 1] = rng();             // phase (y)
      data[idx + 2] = 0.7 + rng() * 0.6; // speed multiplier (z)
      data[idx + 3] = i;                 // particle id (w)
    }
    return data;
  }
}
