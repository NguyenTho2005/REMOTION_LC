import { StateManager } from "./StateManager.ts";
import { TaskPlanner } from "./TaskPlanner.ts";
import { ResearchEngine } from "../engines/ResearchEngine.ts";
import { ScriptEngine } from "../engines/ScriptEngine.ts";
import { StoryboardEngine } from "../engines/StoryboardEngine.ts";
import { VoiceEngine } from "../engines/VoiceEngine.ts";
import { RemotionEngine } from "../engines/RemotionEngine.ts";
import { RenderEngine } from "../engines/RenderEngine.ts";
import { QualityEngine } from "../engines/QualityEngine.ts";
import type { PipelineState, VideoProject } from "../schemas/index.ts";

export interface PipelineRunnerOptions {
  skipRender?: boolean;
  skipQA?: boolean;
  outputPath?: string;
  maxRetries?: number;
}

export class PipelineRunner {
  private stateManager: StateManager;
  private options: PipelineRunnerOptions;

  constructor(stateManager: StateManager, options: PipelineRunnerOptions = {}) {
    this.stateManager = stateManager;
    this.options = {
      skipRender: false,
      skipQA: false,
      maxRetries: 3,
      ...options,
    };
  }

  public async run(): Promise<PipelineState> {
    const prompt = this.stateManager.getState().prompt;
    const videoId = this.stateManager.getState().videoId;

    try {
      // 1. INIT STAGE (10%)
      this.stateManager.startStage("init");
      this.stateManager.setProgress(10);
      const plan = TaskPlanner.plan(prompt);
      this.stateManager.completeStage("init");

      // 2. RESEARCH STAGE (20%)
      this.stateManager.startStage("research");
      this.stateManager.setProgress(20);
      const research = await this.executeWithRetry("research", () =>
        ResearchEngine.research(prompt, plan.category, plan.keyEntities)
      );
      this.stateManager.completeStage("research");

      // 3. SCRIPT STAGE (30%)
      this.stateManager.startStage("script");
      this.stateManager.setProgress(30);
      const script = await this.executeWithRetry("script", async () =>
        ScriptEngine.generateScript(
          research,
          plan.category,
          plan.durationInSeconds,
          plan.targetWordCount
        )
      );
      this.stateManager.completeStage("script");

      // 4. STORYBOARD STAGE (40%)
      this.stateManager.startStage("storyboard");
      this.stateManager.setProgress(40);
      StoryboardEngine.createStoryboard(
        script,
        research,
        plan.category,
        plan.fps,
        plan.durationInFrames
      );
      this.stateManager.completeStage("storyboard");

      // 5. VOICE STAGE (55%)
      this.stateManager.startStage("voice");
      this.stateManager.setProgress(55);
      const voiceResult = await this.executeWithRetry("voice", () =>
        VoiceEngine.synthesize(script, plan.recommendedVoiceId, 1.0, true)
      );
      this.stateManager.completeStage("voice");

      // 6. VISUALS STAGE (65%)
      this.stateManager.startStage("visuals");
      this.stateManager.setProgress(65);
      // Re-adjust frames if audio duration differed slightly from planned frames
      const realFrames = voiceResult.durationInFrames;
      const scenes = StoryboardEngine.createStoryboard(
        script,
        research,
        plan.category,
        plan.fps,
        realFrames
      );
      this.stateManager.completeStage("visuals");

      // 7. CAPTIONS STAGE (75%)
      this.stateManager.startStage("captions");
      this.stateManager.setProgress(75);
      // Subtitles are integrated inside each Scene component
      this.stateManager.completeStage("captions");

      // 8. COMPOSITION STAGE (80%)
      this.stateManager.startStage("composition");
      this.stateManager.setProgress(80);

      const videoProject: VideoProject = {
        id: videoId,
        title: research.title,
        category: plan.category,
        aspectRatio: "9:16",
        resolution: { width: 1080, height: 1920 },
        fps: 30,
        durationInFrames: realFrames,
        durationInSeconds: voiceResult.durationInSeconds,
        voice: voiceResult.voiceConfig,
        script,
        scenes,
        metadata: {
          author: "Tech Pulse Vietnam",
          createdAt: new Date().toISOString(),
          tags: research.tags,
        },
      };

      const assembledProject = RemotionEngine.assembleComposition(videoProject);
      this.stateManager.setVideoProject(assembledProject);
      this.stateManager.completeStage("composition");

      // 9. RENDER STAGE (90%)
      if (!this.options.skipRender) {
        this.stateManager.startStage("render");
        this.stateManager.setProgress(90);

        const outputPath = this.options.outputPath || `out/${videoId}.mp4`;
        const renderResult = await this.executeWithRetry("render", () =>
          RenderEngine.renderVideo({
            compositionId: "TikTokVideo",
            outputPath,
            props: {
              project: assembledProject,
            },
          })
        );
        this.stateManager.setOutputPath(renderResult.outputPath);
        this.stateManager.completeStage("render");

        // 10. QA STAGE (98%)
        if (!this.options.skipQA) {
          this.stateManager.startStage("qa");
          this.stateManager.setProgress(98);
          await this.executeWithRetry("qa", () =>
            QualityEngine.analyzeVideo(
              videoId,
              renderResult.outputPath,
              assembledProject.durationInSeconds
            )
          );
          this.stateManager.completeStage("qa");
        }
      }

      // COMPLETE (100%)
      this.stateManager.startStage("complete");
      this.stateManager.setProgress(100);
      this.stateManager.setStatus("completed");
      this.stateManager.completeStage("complete");

      return this.stateManager.getState();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.stateManager.setStatus("failed", errorMsg);
      throw err;
    }
  }

  private async executeWithRetry<T>(
    stageName: PipelineState["currentStage"],
    action: () => Promise<T>
  ): Promise<T> {
    const maxRetries = this.options.maxRetries || 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (err) {
        lastError = err;
        console.warn(`[PipelineRunner] Stage ${stageName} attempt ${attempt} failed:`, err);
        if (attempt === maxRetries) {
          const msg = err instanceof Error ? err.message : String(err);
          this.stateManager.failStage(stageName, msg);
          throw err;
        }
        // Small exponential backoff
        await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt - 1)));
      }
    }

    throw lastError;
  }
}
