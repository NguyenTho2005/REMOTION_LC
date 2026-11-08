import { ParticleGeometryFactory } from "../core/ParticleGeometryFactory.ts";
import type { ParticlePresetType, ParticleQualityPreset } from "../types.ts";
import { PARTICLE_QUALITY_BUDGETS } from "../types.ts";

export interface BenchmarkRecord {
  preset: ParticlePresetType;
  quality: ParticleQualityPreset;
  particleCount: number;
  resolution: { width: number; height: number };
  samplingDurationMs: number;
  frameSimulationDurationMs: number;
  fpsTheoretical: number;
  memoryUsageMb: number;
  status: "SUCCESS" | "FAILED";
  timestamp: string;
}

export class ParticleBenchmark {
  /**
   * Run benchmark for sampling and frame math for a given particle preset
   */
  public static benchmarkPreset(
    preset: ParticlePresetType,
    quality: ParticleQualityPreset = "standard",
    frameCount: number = 30
  ): BenchmarkRecord {
    const budget = PARTICLE_QUALITY_BUDGETS[quality].maxParticles;

    try {
      // 1. Measure initial sampling
      const sampleStart = performance.now();
      switch (preset) {
        case "explosion":
          ParticleGeometryFactory.sampleSphere(budget, 0.4, 42, true);
          ParticleGeometryFactory.sampleExplosionVectors(budget, 1.2, 43);
          break;
        case "galaxy":
          ParticleGeometryFactory.sampleSpiralGalaxy(budget, 3, 0.6, 0.8, 5.5, 1.3, 42);
          break;
        case "wave":
          ParticleGeometryFactory.sampleWaveGrid(
            Math.floor(Math.sqrt(budget * 1.5)),
            Math.floor(budget / Math.floor(Math.sqrt(budget * 1.5))),
            10,
            8
          );
          break;
        case "data-flow":
          ParticleGeometryFactory.sampleSplinePath(
            budget,
            [[-3, -1, 0], [0, 2, 0], [3, -1, 0]],
            0.2,
            42
          );
          break;
        case "tunnel":
          ParticleGeometryFactory.sampleTunnel(budget, 3.2, 24.0, 42);
          break;
        case "hologram":
          ParticleGeometryFactory.sampleCylinder(budget, 1.8, 3.5, 42);
          break;
        case "formation":
        case "morphing":
          ParticleGeometryFactory.sampleSphere(budget, 2.2, 42, false);
          ParticleGeometryFactory.sampleCube(budget, 2.6, 43, true);
          break;
        case "disintegration":
        case "energy-sphere":
        default:
          ParticleGeometryFactory.sampleSphere(budget, 2.2, 42, false);
          break;
      }
      ParticleGeometryFactory.generateCustomData(budget, 44);
      const samplingDurationMs = performance.now() - sampleStart;

      // 2. Measure deterministic frame calculations across N frames
      const frameStart = performance.now();
      const pos = new Float32Array(budget * 3);
      for (let f = 0; f < frameCount; f++) {
        const time = f / 30;
        for (let i = 0; i < budget; i++) {
          const idx = i * 3;
          pos[idx + 1] = Math.sin(time + i * 0.01) * 0.5;
        }
      }
      const frameSimulationDurationMs = (performance.now() - frameStart) / frameCount;

      const mem = typeof process !== "undefined" && process.memoryUsage
        ? Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100
        : 0;

      const fpsTheoretical = Math.round(1000 / Math.max(0.1, frameSimulationDurationMs));

      return {
        preset,
        quality,
        particleCount: budget,
        resolution: { width: 1080, height: 1920 },
        samplingDurationMs: Math.round(samplingDurationMs * 100) / 100,
        frameSimulationDurationMs: Math.round(frameSimulationDurationMs * 100) / 100,
        fpsTheoretical,
        memoryUsageMb: mem,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        preset,
        quality,
        particleCount: budget,
        resolution: { width: 1080, height: 1920 },
        samplingDurationMs: 0,
        frameSimulationDurationMs: 0,
        fpsTheoretical: 0,
        memoryUsageMb: 0,
        status: "FAILED",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Run benchmark across all 10 presets
   */
  public static runFullBenchmark(quality: ParticleQualityPreset = "standard"): BenchmarkRecord[] {
    const presets: ParticlePresetType[] = [
      "explosion",
      "formation",
      "disintegration",
      "wave",
      "galaxy",
      "data-flow",
      "energy-sphere",
      "tunnel",
      "hologram",
      "morphing",
    ];

    return presets.map((preset) => this.benchmarkPreset(preset, quality));
  }
}
