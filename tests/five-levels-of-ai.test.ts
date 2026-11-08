import test from "node:test";
import assert from "node:assert/strict";
import { SCENE_TIMINGS, VIDEO_CONFIG } from "../src/templates/five-levels-of-ai/constants.ts";

test("FiveLevelsOfAI: Video configuration matches TikTok vertical requirements", () => {
  assert.equal(VIDEO_CONFIG.width, 1080);
  assert.equal(VIDEO_CONFIG.height, 1920);
  assert.equal(VIDEO_CONFIG.fps, 30);
  assert.equal(VIDEO_CONFIG.durationInFrames, 3000); // 100 seconds
});

test("FiveLevelsOfAI: Scene timings perfectly tile 3000 frames without overlap or gaps", () => {
  const { intro, level1, level2, level3, level4, level5 } = SCENE_TIMINGS;

  assert.equal(intro.start, 0);
  assert.equal(intro.duration, 300);
  assert.equal(intro.end, 300);

  assert.equal(level1.start, 300);
  assert.equal(level1.duration, 450);
  assert.equal(level1.end, 750);

  assert.equal(level2.start, 750);
  assert.equal(level2.duration, 510);
  assert.equal(level2.end, 1260);

  assert.equal(level3.start, 1260);
  assert.equal(level3.duration, 480);
  assert.equal(level3.end, 1740);

  assert.equal(level4.start, 1740);
  assert.equal(level4.duration, 600);
  assert.equal(level4.end, 2340);

  assert.equal(level5.start, 2340);
  assert.equal(level5.duration, 660);
  assert.equal(level5.end, 3000);

  const totalDuration =
    intro.duration +
    level1.duration +
    level2.duration +
    level3.duration +
    level4.duration +
    level5.duration;

  assert.equal(totalDuration, 3000);
});
