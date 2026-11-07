# Orchestrator & Tool Registry API Reference

## 1. VideoOrchestrator

### `createVideo(prompt: string, options?: OrchestratorOptions): Promise<PipelineState>`
Runs the end-to-end production pipeline from prompt to final video.

```ts
import { VideoOrchestrator } from "./src/orchestrator/VideoOrchestrator.ts";

const result = await VideoOrchestrator.createVideo(
  "Giải thích AI Agent là gì trong 30s",
  {
    outputPath: "out/ai_agent.mp4",
    skipRender: false,
    skipQA: false,
    onProgress: (state) => {
      console.log(`Stage: ${state.currentStage} (${state.progress}%)`);
    },
  }
);
```

## 2. ToolRegistry

The `ToolRegistry` allows individual tools to be executed programmatically or by an AI agent:

### Available Tools:
1. `research_topic`
   - Parameters: `{ prompt: string, category: VideoCategory, entities?: string[] }`
2. `generate_script`
   - Parameters: `{ research: ResearchResult, category: VideoCategory, durationInSeconds: number }`
3. `synthesize_speech`
   - Parameters: `{ script: Script, voiceId: VoiceId, speed?: number }`
4. `create_storyboard`
   - Parameters: `{ script: Script, research: ResearchResult, category: VideoCategory, totalFrames: number }`
5. `render_video`
   - Parameters: `{ compositionId?: string, outputPath?: string, props?: Record<string, unknown> }`
6. `verify_quality`
   - Parameters: `{ videoId: string, videoPath: string, expectedDurationSeconds?: number }`
