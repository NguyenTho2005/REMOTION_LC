import fs from "fs";
import path from "path";
import { VideoOrchestrator } from "../src/orchestrator/VideoOrchestrator.ts";

async function main() {
  const args = process.argv.slice(2);
  const prompt =
    args.join(" ").trim() ||
    "Giải thích AI Agent là gì và vì sao đây là xu hướng lập trình 2025 trong 30s";

  console.log("\n=======================================================");
  console.log("  REMOTION-LC — AUTONOMOUS AI VIDEO ORCHESTRATOR");
  console.log("=======================================================\n");
  console.log(`Prompt: "${prompt}"\n`);

  const startTime = Date.now();

  const finalState = await VideoOrchestrator.createVideo(prompt, {
    onProgress: (state) => {
      const barLength = 20;
      const filled = Math.round((state.progress / 100) * barLength);
      const bar = "█".repeat(filled) + "░".repeat(barLength - filled);
      console.log(
        `[${bar}] ${String(state.progress).padStart(3)}% | Stage: ${state.currentStage.padEnd(12)} | ${state.status}`
      );
    },
  });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  if (finalState.videoProject) {
    // Also save as current active project for Remotion Studio live preview
    try {
      const activeProjPath = path.join(process.cwd(), "public", "projects", "current-project.json");
      fs.writeFileSync(activeProjPath, JSON.stringify(finalState.videoProject, null, 2), "utf-8");
      console.log("\n✔ Updated active project at public/projects/current-project.json");
    } catch (err) {
      console.warn("Failed to update current-project.json:", err);
    }
  }

  console.log("\n=======================================================");
  console.log("  VIDEO PRODUCTION COMPLETED SUCCESSFULLY!");
  console.log("=======================================================");
  console.log(`Video ID:         ${finalState.videoId}`);
  console.log(`Title:            ${finalState.videoProject?.title || "N/A"}`);
  console.log(`Category:         ${finalState.videoProject?.category || "N/A"}`);
  console.log(`Duration:         ${finalState.videoProject?.durationInSeconds || 0}s (${finalState.videoProject?.durationInFrames || 0} frames @ 30 FPS)`);
  console.log(`Voice Narration:  ${finalState.videoProject?.voice.name} (${finalState.videoProject?.voice.voiceId})`);
  console.log(`Output MP4:       ${finalState.outputPath}`);
  console.log(`Production Time:  ${durationSec}s`);
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("\n❌ Production failed:", err);
  process.exit(1);
});
