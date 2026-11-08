import test from "node:test";
import assert from "node:assert/strict";
import {
  validateScene3D,
  safeValidateScene3D,
} from "../src/three/core/schema.ts";
import {
  QUALITY_CONFIGS,
  LIGHTING_RIGS,
  seededRandom,
} from "../src/three/core/constants.ts";
import { SHOWCASE_SCENES } from "../src/three/compositions/showcase-data.ts";
import { TaskPlanner } from "../src/orchestrator/TaskPlanner.ts";
import { StoryboardEngine } from "../src/engines/StoryboardEngine.ts";

test("ThreeMotion: Schema validates valid 3D Tech Explainer config", () => {
  const validConfig = {
    type: "3d-tech-explainer" as const,
    durationInFrames: 150,
    camera: {
      preset: "orbit" as const,
      distance: 9,
      fov: 50,
      speed: 1,
      target: [0, 0, 0] as [number, number, number],
    },
    lighting: {
      preset: "cyberpunk" as const,
      ambientIntensity: 0.5,
      mainLightIntensity: 1.5,
      accentColor: "#38bdf8",
    },
    quality: "standard" as const,
    objects: [
      {
        id: "core-node",
        type: "sphere" as const,
        position: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number],
        color: "#6366F1",
        wireframe: false,
        animation: {
          rotate: { speedX: 0.5, speedY: 1, speedZ: 0 },
          pulse: { frequency: 2, scaleMultiplier: 1.2 },
        },
      },
    ],
  };

  const parsed = validateScene3D(validConfig);
  assert.equal(parsed.type, "3d-tech-explainer");
  assert.equal(parsed.durationInFrames, 150);
  assert.equal(parsed.objects.length, 1);
  assert.equal(parsed.objects[0].id, "core-node");
});

test("ThreeMotion: Schema rejects invalid geometry type and malformed input", () => {
  const invalidConfig = {
    type: "3d-tech-explainer",
    durationInFrames: 120,
    camera: { preset: "orbit" },
    objects: [
      {
        id: "invalid-obj",
        type: "hypercube_nonexistent",
      },
    ],
  };

  assert.throws(
    () => {
      validateScene3D(invalidConfig);
    },
    (err: unknown) => {
      return err instanceof Error;
    },
    "Should throw on invalid geometry type"
  );
});

test("ThreeMotion: safeValidateScene3D gracefully handles corrupt input", () => {
  const corruptInput = { garbage: 12345 };
  const result = safeValidateScene3D(corruptInput);

  assert.equal(result.success, false, "Corrupt input should fail validation");
  if (!result.success) {
    assert.ok(result.error.issues.length > 0, "Should contain validation error details");
  }
});

test("ThreeMotion: Quality presets and lighting rigs contain required configurations", () => {
  assert.ok(QUALITY_CONFIGS.preview, "Preview quality must be defined");
  assert.ok(QUALITY_CONFIGS.standard, "Standard quality must be defined");
  assert.ok(QUALITY_CONFIGS.high, "High quality must be defined");

  assert.equal(QUALITY_CONFIGS.preview.shadows, false);
  assert.equal(QUALITY_CONFIGS.high.shadows, true);

  const rigs = ["studio", "cyberpunk", "dramatic", "warm", "cool", "flat"] as const;
  for (const rig of rigs) {
    assert.ok(LIGHTING_RIGS[rig], `Lighting rig ${rig} must exist`);
    assert.ok(
      LIGHTING_RIGS[rig].ambient.intensity >= 0,
      `Lighting rig ${rig} ambient intensity must be non-negative`
    );
  }
});

test("ThreeMotion: Deterministic seeded PRNG produces identical sequences", () => {
  const rand1 = seededRandom(1337);
  const rand2 = seededRandom(1337);

  const seq1: number[] = [];
  const seq2: number[] = [];

  for (let i = 0; i < 20; i++) {
    seq1.push(rand1());
    seq2.push(rand2());
  }

  assert.deepEqual(seq1, seq2, "Same seed must produce identical numbers");

  // All values must be in [0, 1)
  for (const n of seq1) {
    assert.ok(n >= 0 && n < 1, `Value ${n} must be within [0, 1)`);
  }
});

test("ThreeMotion: Showcase composition adheres to TikTok 9:16 vertical specs", () => {
  const totalFrames = SHOWCASE_SCENES.reduce((acc, s) => acc + s.durationInFrames, 0);

  // 30 seconds at 30 fps = 900 frames
  assert.equal(totalFrames, 900, "Total showcase frames must be 900 (30 seconds)");
  assert.equal(SHOWCASE_SCENES.length, 6, "Must contain all 6 template scenes");

  // Verify all scenes have non-zero durations and valid 3D type
  for (const scene of SHOWCASE_SCENES) {
    assert.ok(scene.durationInFrames > 0, `Scene ${scene.id} duration must be positive`);
    assert.ok(scene.config.type.startsWith("3d-"), `Scene ${scene.id} must be a 3D type`);
  }
});

test("ThreeMotion: TaskPlanner detects 3d-motion category from prompt", () => {
  const plan = TaskPlanner.plan(
    "Tạo video 3D Motion Graphics giải thích kiến trúc Transformer Neural Network bằng Three.js"
  );

  assert.equal(plan.category, "3d-motion", "Planner must detect 3d-motion category");
  assert.ok(
    plan.durationInSeconds >= 30 && plan.durationInSeconds <= 45,
    "Target duration for 3D motion should be 30-45s"
  );
  assert.ok(plan.suggestedScenes.length >= 3, "Plan must contain suggested scenes");
});

test("ThreeMotion: StoryboardEngine creates 3D templates for 3d-motion category", () => {
  const mockResearch = {
    title: "Transformer 3D Architecture",
    summary: "Visualizing self-attention mechanisms in 3D space",
    facts: ["Query Key Value projections", "Multi-head attention matrix", "Feed forward blocks"],
    specs: { Concept: "Transformer 3D" },
    tags: ["#ThreeJS", "#AI3D"],
  };

  const mockScript = {
    fullText: "Hook intro 3D. Architecture explanation. Algorithm trace. Call to action.",
    wordCount: 25,
    sections: [
      { id: "1", type: "hook" as const, text: "Khám phá Transformer 3D", startTime: 0, endTime: 5 },
      { id: "2", type: "context" as const, text: "Cơ chế Self-Attention", startTime: 5, endTime: 15 },
      { id: "3", type: "main" as const, text: "Luồng tính toán tensor", startTime: 15, endTime: 25 },
      { id: "4", type: "cta" as const, text: "Thực hành ngay với code 3D", startTime: 25, endTime: 30 },
    ],
  };

  const scenes = StoryboardEngine.createStoryboard(
    mockScript,
    mockResearch,
    "3d-motion",
    30,
    900
  );

  assert.equal(scenes.length, 4);
  assert.equal(scenes[0].template, "ThreeCinematicIntro");
  assert.equal(scenes[1].template, "ThreeTechExplainer");
  assert.equal(scenes[2].template, "ThreeAlgorithmViz");
  assert.equal(scenes[3].template, "ThreeHybridExplainer");

  let totalAllocated = 0;
  for (const s of scenes) {
    assert.equal(s.startFrame, totalAllocated);
    totalAllocated += s.durationInFrames;
  }
  assert.equal(totalAllocated, 900);
});
