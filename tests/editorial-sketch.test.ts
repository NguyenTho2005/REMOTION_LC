import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NARRATO_AI_PROJECT } from "../src/templates/editorial-sketch/NarratoAIManifest.ts";
import type { VideoProjectManifest } from "../src/types/schema.ts";

test("EditorialSketch: Video specs match vertical TikTok requirements", () => {
  const manifest: VideoProjectManifest = NARRATO_AI_PROJECT;

  // Framework specs
  assert.equal(manifest.width, 1080, "Width must be 1080");
  assert.equal(manifest.height, 1920, "Height must be 1920");
  assert.equal(manifest.fps, 30, "FPS must be 30");

  // Duration constraints
  assert.ok(
    manifest.totalDurationInFrames < 3600,
    `Duration must be strictly under 2 minutes (< 3600 frames). Got ${manifest.totalDurationInFrames}`
  );
  assert.ok(
    manifest.totalDurationInFrames >= 1800 && manifest.totalDurationInFrames <= 2700,
    `Ideal duration is 60s - 90s (1800 - 2700 frames). Got ${manifest.totalDurationInFrames}`
  );
});

test("EditorialSketch: Scene structure strictly follows 5-7 scenes under 20s each", () => {
  const { scenes, totalDurationInFrames } = NARRATO_AI_PROJECT;

  // 5 to 7 scenes
  assert.ok(
    scenes.length >= 5 && scenes.length <= 7,
    `Must have between 5 and 7 scenes. Got ${scenes.length}`
  );

  let currentGlobalFrame = 0;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];

    // Scene index check
    assert.equal(scene.sceneIndex, i, `Scene index must match position ${i}`);

    // No scene longer than 20 seconds (600 frames)
    assert.ok(
      scene.durationInFrames <= 600,
      `Scene ${scene.sceneId} duration (${scene.durationInFrames} frames) exceeds 20s (600 frames)`
    );

    // Continuous timeline tiling without gaps or overlap
    assert.equal(
      scene.startFrameGlobal,
      currentGlobalFrame,
      `Scene ${scene.sceneId} startFrameGlobal (${scene.startFrameGlobal}) must tile previous end (${currentGlobalFrame})`
    );

    currentGlobalFrame += scene.durationInFrames;

    // Visual spec checks
    assert.ok(
      ["#D94E34", "#2B5B6C", "#E5A93C"].includes(scene.visualSpec.accentColor),
      `Accent color must be Warm Editorial palette (#D94E34, #2B5B6C, #E5A93C). Got ${scene.visualSpec.accentColor}`
    );

    assert.ok(
      [
        "svg_self_draw",
        "rough_flowchart",
        "kinetic_sketch_text",
        "split_comparison",
        "diagram_zoom_pan",
      ].includes(scene.visualSpec.type),
      `Invalid visual animation type: ${scene.visualSpec.type}`
    );

    // Audio file existence check
    const audioRelative = scene.audioFilePath.replace(/^\//, "");
    const audioFullPath = path.join(process.cwd(), "public", audioRelative.replace(/^audio\//, "audio/"));
    assert.ok(
      fs.existsSync(audioFullPath),
      `Audio file for scene ${scene.sceneId} must exist at ${audioFullPath}`
    );

    // Captions verification
    assert.ok(scene.captions.length > 0, `Scene ${scene.sceneId} must have captions`);
    for (const caption of scene.captions) {
      assert.ok(caption.text.length > 0, "Caption text must not be empty");
      assert.ok(
        caption.endFrame > caption.startFrame,
        `Caption ${caption.id} endFrame must be greater than startFrame`
      );
      assert.ok(
        caption.highlightWords.length > 0,
        `Caption ${caption.id} must define at least one highlightWord`
      );
    }
  }

  // Final frames must match totalDurationInFrames exactly
  assert.equal(
    currentGlobalFrame,
    totalDurationInFrames,
    `Sum of scene frames (${currentGlobalFrame}) must match totalDurationInFrames (${totalDurationInFrames})`
  );
});

test("EditorialSketch: Theme colors and anti-slop rules enforced", () => {
  const { theme } = NARRATO_AI_PROJECT;

  // Background must be warm cream paper
  assert.ok(
    ["#F4F1EA", "#EFECE6"].includes(theme.background),
    `Background must be warm cream paper (#F4F1EA or #EFECE6). Got ${theme.background}`
  );

  // Ink color must be charcoal black
  assert.equal(theme.inkColor, "#1E1E1C", "Ink color must be charcoal black #1E1E1C");
});
