import { ResearchEngine, type ResearchResult } from "../engines/ResearchEngine.ts";
import { ScriptEngine } from "../engines/ScriptEngine.ts";
import { StoryboardEngine } from "../engines/StoryboardEngine.ts";
import { VoiceEngine, type VoiceEngineResult } from "../engines/VoiceEngine.ts";
import { RenderEngine, type RenderOptions, type RenderResult } from "../engines/RenderEngine.ts";
import { QualityEngine } from "../engines/QualityEngine.ts";
import type { VideoCategory, VoiceId, Script, Scene, QAReport } from "../schemas/index.ts";

export interface ToolDefinition<TInput = Record<string, unknown>, TOutput = unknown> {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (args: TInput) => Promise<TOutput>;
}

export class ToolRegistry {
  private static tools: Map<string, ToolDefinition<never, unknown>> = new Map();

  public static registerTool<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>): void {
    this.tools.set(tool.name, tool as unknown as ToolDefinition<never, unknown>);
  }

  public static getTool(name: string): ToolDefinition<never, unknown> | undefined {
    return this.tools.get(name);
  }

  public static listTools(): Array<{ name: string; description: string; parameters: Record<string, unknown> }> {
    return Array.from(this.tools.values()).map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    }));
  }

  public static async invokeTool<T = unknown>(name: string, args: unknown): Promise<T> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered in ToolRegistry.`);
    }
    return tool.execute(args as never) as Promise<T>;
  }
}

// Register built-in tools
ToolRegistry.registerTool<{ prompt: string; category: VideoCategory; entities?: string[] }, ResearchResult>({
  name: "research_topic",
  description: "Researches a tech news topic, AI model, or GitHub repository and extracts structured facts and code snippets.",
  parameters: {
    type: "object",
    required: ["prompt", "category"],
    properties: {
      prompt: { type: "string" },
      category: { type: "string" },
      entities: { type: "array", items: { type: "string" } },
    },
  },
  execute: async (args) => {
    return ResearchEngine.research(args.prompt, args.category, args.entities || []);
  },
});

ToolRegistry.registerTool<{
  research: ResearchResult;
  category: VideoCategory;
  durationInSeconds: number;
  targetWordCount?: number;
}, Script>({
  name: "generate_script",
  description: "Generates a structured 6-part Vietnamese video script respecting duration and speaking rate.",
  parameters: {
    type: "object",
    required: ["research", "category", "durationInSeconds"],
    properties: {
      research: { type: "object" },
      category: { type: "string" },
      durationInSeconds: { type: "number" },
      targetWordCount: { type: "number" },
    },
  },
  execute: async (args) => {
    const wordCount = args.targetWordCount || Math.round(args.durationInSeconds * 2.8);
    return ScriptEngine.generateScript(args.research, args.category, args.durationInSeconds, wordCount);
  },
});

ToolRegistry.registerTool<{ script: Script; voiceId: VoiceId; speed?: number }, VoiceEngineResult>({
  name: "synthesize_speech",
  description: "Synthesizes real Vietnamese speech using ZeroTTS and attaches to Remotion timeline.",
  parameters: {
    type: "object",
    required: ["script", "voiceId"],
    properties: {
      script: { type: "object" },
      voiceId: { type: "string" },
      speed: { type: "number" },
    },
  },
  execute: async (args) => {
    return VoiceEngine.synthesize(args.script, args.voiceId, args.speed || 1.0, true);
  },
});

ToolRegistry.registerTool<{
  script: Script;
  research: ResearchResult;
  category: VideoCategory;
  fps?: number;
  totalFrames: number;
}, Scene[]>({
  name: "create_storyboard",
  description: "Plans and allocates frames for Remotion scene sequence based on script sections.",
  parameters: {
    type: "object",
    required: ["script", "research", "category", "totalFrames"],
    properties: {
      script: { type: "object" },
      research: { type: "object" },
      category: { type: "string" },
      fps: { type: "number" },
      totalFrames: { type: "number" },
    },
  },
  execute: async (args) => {
    return StoryboardEngine.createStoryboard(
      args.script,
      args.research,
      args.category,
      args.fps || 30,
      args.totalFrames
    );
  },
});

ToolRegistry.registerTool<RenderOptions, RenderResult>({
  name: "render_video",
  description: "Renders Remotion composition to an MP4 video file on disk.",
  parameters: {
    type: "object",
    properties: {
      compositionId: { type: "string" },
      outputPath: { type: "string" },
      props: { type: "object" },
    },
  },
  execute: async (args) => {
    return RenderEngine.renderVideo(args);
  },
});

ToolRegistry.registerTool<{
  videoId: string;
  videoPath: string;
  expectedDurationSeconds?: number;
}, QAReport>({
  name: "verify_quality",
  description: "Performs media stream inspection on rendered MP4 video via ffprobe and produces QA report.",
  parameters: {
    type: "object",
    required: ["videoId", "videoPath"],
    properties: {
      videoId: { type: "string" },
      videoPath: { type: "string" },
      expectedDurationSeconds: { type: "number" },
    },
  },
  execute: async (args) => {
    return QualityEngine.analyzeVideo(args.videoId, args.videoPath, args.expectedDurationSeconds);
  },
});
