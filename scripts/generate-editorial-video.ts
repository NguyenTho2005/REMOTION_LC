import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { ZeroTTSClient } from "../src/services/zerotts-client.ts";
import { NARRATO_AI_PROJECT } from "../src/templates/editorial-sketch/NarratoAIManifest.ts";
import type { VideoProjectManifest } from "../src/types/schema.ts";

async function main() {
  const args = process.argv.slice(2);
  const inputTopic = args.join(" ").trim() || "https://github.com/linyqh/NarratoAI";

  console.log("\n=======================================================");
  console.log("  REMOTION-LC — EDITORIAL HAND-DRAWN SKETCH GENERATOR");
  console.log("=======================================================\n");
  console.log(`Topic / Repo: "${inputTopic}"`);
  console.log(`Aesthetic:    Warm Paper & Charcoal Ink (Anti-AI Slop)`);
  console.log(`Resolution:   1080x1920 (9:16 Vertical @ 30 FPS)\n`);

  const manifest: VideoProjectManifest = NARRATO_AI_PROJECT;

  console.log("Synthesizing voice tracks via ZeroTTS...");
  const audioDir = path.join(process.cwd(), "public", "audio", "narratoai");
  fs.mkdirSync(audioDir, { recursive: true });

  for (const scene of manifest.scenes) {
    const targetFile = path.join(process.cwd(), "public", scene.audioFilePath.replace(/^\//, ""));
    if (!fs.existsSync(targetFile)) {
      console.log(`  Synthesizing [${scene.sceneId}]...`);
      const result = await ZeroTTSClient.synthesize({
        text: scene.voiceoverText,
        voiceId: "tiendat",
        outputFilePath: targetFile,
      });
      console.log(`  ✔ [${scene.sceneId}] synthesized (${result.durationInSeconds.toFixed(2)}s)`);
    } else {
      console.log(`  ✔ [${scene.sceneId}] audio asset cached (${targetFile})`);
    }
  }

  // Save active project json for studio inspection
  const activeProjPath = path.join(process.cwd(), "public", "projects", "narratoai-editorial.json");
  fs.mkdirSync(path.dirname(activeProjPath), { recursive: true });
  fs.writeFileSync(activeProjPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\n✔ Saved project manifest to public/projects/narratoai-editorial.json`);

  const outMp4 = path.join(process.cwd(), "out", "narratoai-editorial.mp4");
  if (!fs.existsSync(outMp4)) {
    console.log("\nRendering video via Remotion...");
    execSync("npx remotion render NarratoAIEditorialSketch out/narratoai-editorial.mp4", {
      stdio: "inherit",
    });
  } else {
    console.log(`\n✔ Rendered video available at out/narratoai-editorial.mp4`);
  }

  console.log("\n=======================================================");
  console.log("  EDITORIAL VIDEO READY!");
  console.log("=======================================================");
  console.log(`Title:       ${manifest.projectTitle}`);
  console.log(`Duration:    ${manifest.totalDurationInSeconds}s (${manifest.totalDurationInFrames} frames)`);
  console.log(`Scenes:      ${manifest.scenes.length} scenes`);
  console.log(`Output:      ${outMp4}`);
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("Generator failed:", err);
  process.exit(1);
});
