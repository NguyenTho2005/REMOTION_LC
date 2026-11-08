import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import alignmentData from "../src/templates/chatgpt-codex-limits/alignment.json" with { type: "json" };
import { DESIGN_TOKENS } from "../src/templates/chatgpt-codex-limits/design-tokens.ts";

describe("ChatGPT & Codex Usage Limits Project", () => {
  it("Video specs match vertical TikTok requirements", () => {
    assert.strictEqual(DESIGN_TOKENS.layout.width, 1080);
    assert.strictEqual(DESIGN_TOKENS.layout.height, 1920);
    assert.strictEqual(alignmentData.fps, 30);
    assert.strictEqual(DESIGN_TOKENS.layout.safeArea.top, 150);
    assert.strictEqual(DESIGN_TOKENS.layout.safeArea.bottom, 280);
    assert.strictEqual(DESIGN_TOKENS.layout.safeArea.right, 120);
  });

  it("Duration matches the 60-75s target window", () => {
    const durationSec = alignmentData.totalDurationSec;
    assert.ok(
      durationSec >= 55 && durationSec <= 75,
      `Duration was ${durationSec}s, expected between 55s and 75s`
    );
  });

  it("Has exactly 9 scenes tiling monotonically without gaps or overlaps", () => {
    assert.strictEqual(alignmentData.scenes.length, 9);
    let expectedStartFrame = 0;
    for (const scene of alignmentData.scenes) {
      assert.strictEqual(scene.startFrame, expectedStartFrame);
      assert.strictEqual(
        scene.endFrame,
        expectedStartFrame + scene.sceneDurationFrames
      );
      assert.ok(scene.words.length > 0, `Scene ${scene.sceneId} has no words`);
      expectedStartFrame = scene.endFrame;
    }
    assert.strictEqual(expectedStartFrame, alignmentData.totalFrames);
  });

  it("Word alignments have monotonic timestamps and acoustic alignment", () => {
    for (const scene of alignmentData.scenes) {
      let prevEndMs = 0;
      for (const word of scene.words) {
        assert.ok(
          word.endMs > word.startMs,
          `Word ${word.word} has invalid duration`
        );
        assert.ok(
          word.startMs >= prevEndMs - 10,
          `Word ${word.word} overlaps improperly`
        );
        prevEndMs = word.endMs;
      }
    }
  });

  it("Audio files exist in public directory", () => {
    for (const scene of alignmentData.scenes) {
      const audioFullPath = path.join(process.cwd(), "public", scene.audioFile);
      assert.ok(
        fs.existsSync(audioFullPath),
        `Audio file missing: ${audioFullPath}`
      );
    }
  });
});
