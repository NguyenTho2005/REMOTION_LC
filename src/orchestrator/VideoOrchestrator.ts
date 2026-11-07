/* eslint-disable @remotion/deterministic-randomness */
import { StateManager, type StateListener } from "./StateManager.ts";
import { PipelineRunner, type PipelineRunnerOptions } from "./PipelineRunner.ts";
import type { PipelineState } from "../schemas/index.ts";

export interface OrchestratorOptions extends PipelineRunnerOptions {
  onProgress?: StateListener;
  storagePath?: string;
}

export class VideoOrchestrator {
  private static activeManagers: Map<string, StateManager> = new Map();

  public static async createVideo(
    prompt: string,
    options: OrchestratorOptions = {}
  ): Promise<PipelineState> {
    const videoId = `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const storagePath =
      options.storagePath || `public/projects/${videoId}-state.json`;

    const stateManager = new StateManager(videoId, prompt, storagePath);
    this.activeManagers.set(videoId, stateManager);

    if (options.onProgress) {
      stateManager.subscribe(options.onProgress);
    }

    const runner = new PipelineRunner(stateManager, options);
    return runner.run();
  }

  public static getState(videoId: string): PipelineState | null {
    const manager = this.activeManagers.get(videoId);
    if (manager) {
      return manager.getState();
    }
    // Attempt load from disk
    const loaded = StateManager.loadFromDisk(`public/projects/${videoId}-state.json`);
    if (loaded) {
      this.activeManagers.set(videoId, loaded);
      return loaded.getState();
    }
    return null;
  }
}
