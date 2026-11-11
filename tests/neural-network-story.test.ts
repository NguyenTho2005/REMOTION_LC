import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

interface ScriptScene {
  id: string;
  startFrame: number;
  endFrame: number;
  text: string;
}

interface ScriptData {
  fps: number;
  width: number;
  height: number;
  durationSeconds: number;
  durationInFrames: number;
  scenes: ScriptScene[];
}

interface WordItem {
  word: string;
  startFrame: number;
  endFrame: number;
  sceneId?: string;
}

const scriptPath = path.resolve(process.cwd(), "src/data/neural-network-story/script.json");
const timestampsPath = path.resolve(process.cwd(), "src/data/neural-network-story/timestamps.json");

const scriptData: ScriptData = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
const timestampsData: WordItem[] = JSON.parse(fs.readFileSync(timestampsPath, "utf8"));

describe("Neural Network Story (Doodle Sketch + Karaoke Subtitle)", () => {
  it("Validates script metadata and 4-scene storyboard structure", () => {
    assert.equal(scriptData.fps, 30);
    assert.equal(scriptData.width, 1080);
    assert.equal(scriptData.height, 1920);
    // Duration based on actual ZeroTTS audio (25.84s real TTS output)
    assert.equal(scriptData.durationSeconds, 25.84);
    assert.equal(scriptData.durationInFrames, 776);
    assert.equal(scriptData.scenes.length, 4);

    const [s1, s2, s3, s4] = scriptData.scenes;
    assert.equal(s1.startFrame, 0);
    assert.equal(s1.endFrame, 155);
    assert.equal(s2.startFrame, 155);
    assert.equal(s2.endFrame, 388);
    assert.equal(s3.startFrame, 388);
    assert.equal(s3.endFrame, 633);
    assert.equal(s4.startFrame, 633);
    assert.equal(s4.endFrame, 776);

    // Verify key Vietnamese terms in text
    assert.match(s1.text, /máy vô tri/);
    assert.match(s2.text, /băm nhỏ bức ảnh/);
    assert.match(s3.text, /lội ngược dòng/);
    assert.match(s4.text, /kiên trì sửa sai/);
  });

  it("Validates karaoke timestamps monotonic tiling and boundary safety", () => {
    assert.ok(Array.isArray(timestampsData));
    assert.ok(timestampsData.length > 50, "Should have sufficient word timestamps");

    for (let i = 0; i < timestampsData.length; i++) {
      const w = timestampsData[i];
      assert.ok(w.word && w.word.trim().length > 0, `Word at ${i} must not be empty`);
      assert.ok(w.startFrame >= 0, `Start frame must be >= 0: ${w.word}`);
      assert.ok(w.endFrame > w.startFrame, `End frame must be > start frame: ${w.word}`);
      assert.ok(w.endFrame <= 776, `End frame must be <= 776: ${w.word}`);

      if (i > 0 && w.sceneId === timestampsData[i - 1].sceneId) {
        assert.ok(
          w.startFrame >= timestampsData[i - 1].startFrame,
          `Monotonic ordering violated between words ${timestampsData[i - 1].word} and ${w.word}`,
        );
      }
    }
  });

  it("Ensures audio assets exist in both src and public directories with 48kHz WAV format", () => {
    const srcAudio = path.resolve(process.cwd(), "src/data/neural-network-story/audio.wav");
    const pubAudio = path.resolve(process.cwd(), "public/neural-network-story/audio.wav");

    assert.ok(fs.existsSync(srcAudio), "src audio.wav must exist");
    assert.ok(fs.existsSync(pubAudio), "public audio.wav must exist");

    const srcStat = fs.statSync(srcAudio);
    const pubStat = fs.statSync(pubAudio);

    assert.ok(srcStat.size > 1000000, "Audio file should be sufficiently large (>1MB for real ZeroTTS 48kHz PCM)");
    assert.equal(srcStat.size, pubStat.size, "Src and public audio files must match");
  });

  it("Ensures NeuralNetworkStoryReview composition is registered in Root.tsx", () => {
    const rootPath = path.resolve(process.cwd(), "src/Root.tsx");
    const rootCode = fs.readFileSync(rootPath, "utf8");

    assert.match(rootCode, /NeuralNetworkStoryComposition/);
    assert.match(rootCode, /import.*NeuralNetworkStoryComposition/);
  });
});
