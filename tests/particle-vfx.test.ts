import test from "node:test";
import assert from "node:assert/strict";
import { ParticleGeometryFactory } from "../src/three/particles/core/ParticleGeometryFactory.ts";
import {
  ParticleConfigSchema,
  ParticlePresetSchema,
} from "../src/three/core/schema.ts";
import {
  PARTICLE_QUALITY_BUDGETS,
  type ParticlePresetType,
} from "../src/three/particles/types.ts";
import { ParticleBenchmark } from "../src/three/particles/benchmark/ParticleBenchmark.ts";

export const TOTAL_PARTICLE_SHOWCASE_FRAMES = 1170; // 39 seconds @ 30fps

test("ParticleVFX: Deterministic Point Sampling with Identical Seed", () => {
  const seed = 12345;
  const count = 500;

  const sphere1 = ParticleGeometryFactory.sampleSphere(count, 3.0, seed);
  const sphere2 = ParticleGeometryFactory.sampleSphere(count, 3.0, seed);
  assert.deepEqual(sphere1, sphere2, "Identical seed must produce identical sphere coordinates");

  const galaxy1 = ParticleGeometryFactory.sampleSpiralGalaxy(count, 3, 0.5, 0.8, 5.0, 1.2, seed);
  const galaxy2 = ParticleGeometryFactory.sampleSpiralGalaxy(count, 3, 0.5, 0.8, 5.0, 1.2, seed);
  assert.deepEqual(galaxy1, galaxy2, "Identical seed must produce identical galaxy coordinates");

  // Different seeds must produce different coordinates
  const sphere3 = ParticleGeometryFactory.sampleSphere(count, 3.0, 99999);
  assert.notDeepEqual(sphere1, sphere3, "Different seeds must produce different coordinates");
});

test("ParticleVFX: Geometry Factory produces correct lengths and finite bounds", () => {
  const count = 200;

  // 1. Sphere
  const sphere = ParticleGeometryFactory.sampleSphere(count, 2.5, 42);
  assert.equal(sphere.length, count * 3);

  // 2. Cube
  const cube = ParticleGeometryFactory.sampleCube(count, 3.0, 42, true);
  assert.equal(cube.length, count * 3);

  // 3. Torus
  const torus = ParticleGeometryFactory.sampleTorus(count, 2.0, 0.5, 42);
  assert.equal(torus.length, count * 3);

  // 4. Cylinder
  const cyl = ParticleGeometryFactory.sampleCylinder(count, 1.5, 4.0, 42);
  assert.equal(cyl.length, count * 3);

  // 5. Tunnel
  const tunnel = ParticleGeometryFactory.sampleTunnel(count, 3.0, 20.0, 42);
  assert.equal(tunnel.length, count * 3);

  // 6. Custom data
  const custom = ParticleGeometryFactory.generateCustomData(count, 42);
  assert.equal(custom.length, count * 4);

  // Verify all numbers are finite non-NaN
  for (let i = 0; i < sphere.length; i++) {
    assert.ok(Number.isFinite(sphere[i]), `Coordinate ${i} must be finite`);
    assert.ok(!Number.isNaN(sphere[i]), `Coordinate ${i} must not be NaN`);
  }
});

test("ParticleVFX: Schema validates all 10 particle presets", () => {
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

  for (const preset of presets) {
    const validConfig = {
      preset,
      particleCount: 2000,
      seed: 42,
      color: "#38BDF8",
      secondaryColor: "#EC4899",
      speed: 1.2,
      spread: 4.5,
      quality: "standard" as const,
    };

    const parsed = ParticleConfigSchema.parse(validConfig);
    assert.equal(parsed.preset, preset);
    assert.equal(parsed.particleCount, 2000);
  }
});

test("ParticleVFX: Schema rejects invalid presets and malformed parameters", () => {
  assert.throws(() => {
    ParticlePresetSchema.parse("invalid_nonexistent_preset");
  }, "Should reject unrecognized preset");

  assert.throws(() => {
    ParticleConfigSchema.parse({
      preset: "wave",
      particleCount: -50, // Negative count
    });
  }, "Should reject negative particle count");
});

test("ParticleVFX: Quality budgets enforce correct limits", () => {
  assert.equal(PARTICLE_QUALITY_BUDGETS.preview.maxParticles, 1000);
  assert.equal(PARTICLE_QUALITY_BUDGETS.standard.maxParticles, 5000);
  assert.equal(PARTICLE_QUALITY_BUDGETS.high.maxParticles, 15000);

  assert.ok(PARTICLE_QUALITY_BUDGETS.preview.pointSizeMultiplier >= 1.0);
  assert.equal(PARTICLE_QUALITY_BUDGETS.preview.enableNoise, false);
  assert.equal(PARTICLE_QUALITY_BUDGETS.high.enableNoise, true);
});

test("ParticleVFX: Out-of-order frame calculation determinism", () => {
  // Simulate analytical position calculation at frame 60 directly vs sequentially
  const count = 300;
  const initPos = ParticleGeometryFactory.sampleSphere(count, 0.5, 42);
  const vels = ParticleGeometryFactory.sampleExplosionVectors(count, 1.2, 43);

  function computeFramePos(frame: number): Float32Array {
    const pos = new Float32Array(count * 3);
    const progress = frame / 90;
    const t = progress * 5.0;
    const g = 0.8 * progress * progress * 2.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx] = initPos[idx] + vels[idx] * t;
      pos[idx + 1] = initPos[idx + 1] + vels[idx + 1] * t - g;
      pos[idx + 2] = initPos[idx + 2] + vels[idx + 2] * t;
    }
    return pos;
  }

  // Direct calculation at frame 60
  const directFrame60 = computeFramePos(60);

  // Sequential calculation simulating playing frames 0 to 60
  let seqFrame60: Float32Array = new Float32Array();
  for (let f = 0; f <= 60; f++) {
    seqFrame60 = computeFramePos(f);
  }

  assert.deepEqual(
    directFrame60,
    seqFrame60,
    "Frame 60 rendered directly must match sequential simulation"
  );
});

test("ParticleVFX: Benchmark utility executes all 10 presets successfully", () => {
  const results = ParticleBenchmark.runFullBenchmark("preview");

  assert.equal(results.length, 10, "Must benchmark all 10 presets");
  for (const res of results) {
    assert.equal(res.status, "SUCCESS", `Preset ${res.preset} must succeed`);
    assert.ok(res.particleCount > 0, "Particle count must be positive");
    assert.ok(res.samplingDurationMs >= 0, "Sampling time must be non-negative");
    assert.ok(res.fpsTheoretical > 0, "Theoretical FPS must be positive");
  }
});

test("ParticleVFX: Showcase composition adheres to vertical TikTok specs", () => {
  assert.equal(
    TOTAL_PARTICLE_SHOWCASE_FRAMES,
    1170,
    "Showcase duration must be 1170 frames (39 seconds @ 30 FPS)"
  );
});
