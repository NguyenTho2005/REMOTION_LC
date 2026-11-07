import { VideoOrchestrator } from "../src/orchestrator/VideoOrchestrator.ts";

async function main() {
  console.log("=================================================");
  console.log("REMOTION-LC — AI VIDEO PRODUCTION E2E EXECUTION");
  console.log("=================================================\n");

  const prompt = "Giải thích AI Agent là gì và vì sao đây là xu hướng lập trình 2025 trong 30s";
  console.log("Input Prompt:", prompt);

  const startTime = Date.now();

  const finalState = await VideoOrchestrator.createVideo(prompt, {
    outputPath: "out/ai_agent_tiktok.mp4",
    onProgress: (state) => {
      console.log(
        `[Stage: ${state.currentStage.padEnd(12)}] Progress: ${String(state.progress).padStart(3)}% | Status: ${state.status}`
      );
    },
  });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n=================================================");
  console.log("PRODUCTION PIPELINE COMPLETED SUCCESSFULLY!");
  console.log("=================================================");
  console.log("Video ID:", finalState.videoId);
  console.log("Status:", finalState.status);
  console.log("Output MP4 Path:", finalState.outputPath);
  console.log("Total Execution Time:", `${totalTime}s`);

  if (finalState.videoProject) {
    console.log("\n--- Generated Project Summary ---");
    console.log("Title:", finalState.videoProject.title);
    console.log("Category:", finalState.videoProject.category);
    console.log("Duration:", `${finalState.videoProject.durationInSeconds}s (${finalState.videoProject.durationInFrames} frames)`);
    console.log("Voice Selected:", `${finalState.videoProject.voice.name} (${finalState.videoProject.voice.voiceId})`);
    console.log("Word Count:", finalState.videoProject.script.wordCount);
    console.log("Scenes Generated:", finalState.videoProject.scenes.length);
    finalState.videoProject.scenes.forEach((s, idx) => {
      console.log(`  ${idx + 1}. [${s.template}] start: ${s.startFrame}f, duration: ${s.durationInFrames}f (${(s.durationInFrames / 30).toFixed(1)}s)`);
    });
  }
}

main().catch((err) => {
  console.error("E2E Execution Failed:", err);
  process.exit(1);
});
