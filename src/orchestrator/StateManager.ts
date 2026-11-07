import fs from "fs";
import path from "path";
import type {
  PipelineState,
  PipelineStageName,
  VideoProject,
} from "../schemas/index.ts";

export type StateListener = (state: PipelineState) => void;

export class StateManager {
  private state: PipelineState;
  private listeners: Set<StateListener> = new Set();
  private storagePath?: string;

  constructor(videoId: string, prompt: string, storagePath?: string) {
    this.storagePath = storagePath;
    const now = new Date().toISOString();
    const stageNames: PipelineStageName[] = [
      "init",
      "research",
      "script",
      "storyboard",
      "voice",
      "visuals",
      "captions",
      "composition",
      "render",
      "qa",
      "complete",
    ];

    this.state = {
      videoId,
      prompt,
      status: "idle",
      currentStage: "init",
      progress: 0,
      stages: stageNames.map((name) => ({
        name,
        status: "pending",
        retryCount: 0,
      })),
      createdAt: now,
      updatedAt: now,
    };
  }

  public getState(): PipelineState {
    return { ...this.state };
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.state.updatedAt = new Date().toISOString();
    for (const listener of this.listeners) {
      try {
        listener(this.getState());
      } catch (err) {
        console.error("State listener error:", err);
      }
    }
    this.persist();
  }

  public setStatus(status: PipelineState["status"], error?: string): void {
    this.state.status = status;
    if (error) {
      this.state.error = error;
    }
    this.notify();
  }

  public setProgress(progress: number): void {
    this.state.progress = Math.min(100, Math.max(0, Math.round(progress)));
    this.notify();
  }

  public startStage(stageName: PipelineStageName): void {
    this.state.currentStage = stageName;
    this.state.status = "running";
    const stage = this.state.stages.find((s) => s.name === stageName);
    if (stage) {
      stage.status = "in-progress";
      stage.startedAt = new Date().toISOString();
    }
    this.notify();
  }

  public completeStage(stageName: PipelineStageName): void {
    const stage = this.state.stages.find((s) => s.name === stageName);
    if (stage) {
      stage.status = "completed";
      stage.completedAt = new Date().toISOString();
    }
    this.notify();
  }

  public failStage(stageName: PipelineStageName, error: string): void {
    const stage = this.state.stages.find((s) => s.name === stageName);
    if (stage) {
      stage.status = "failed";
      stage.error = error;
      stage.retryCount += 1;
    }
    this.state.status = "failed";
    this.state.error = error;
    this.notify();
  }

  public setVideoProject(project: VideoProject): void {
    this.state.videoProject = project;
    this.notify();
  }

  public setOutputPath(path: string): void {
    this.state.outputPath = path;
    this.notify();
  }

  private persist(): void {
    if (typeof window === "undefined" && this.storagePath) {
      try {
        const dir = path.dirname(this.storagePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.storagePath, JSON.stringify(this.state, null, 2), "utf-8");
      } catch (err) {
        console.warn("Failed to persist state to disk:", err);
      }
    }
  }

  public static loadFromDisk(filePath: string): StateManager | null {
    if (typeof window !== "undefined") return null;
    try {
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw) as PipelineState;
      const manager = new StateManager(parsed.videoId, parsed.prompt, filePath);
      manager.state = parsed;
      return manager;
    } catch {
      return null;
    }
  }
}
