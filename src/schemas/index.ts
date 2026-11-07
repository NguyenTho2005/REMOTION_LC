/* eslint-disable @remotion/non-pure-animation */
import { z } from "zod";

// --- Enums & Literals ---
export const VideoCategorySchema = z.enum([
  "tech-news",
  "ai-news",
  "ai-model-review",
  "ai-tool-review",
  "github-repo-review",
  "ai-explainer",
]);
export type VideoCategory = z.infer<typeof VideoCategorySchema>;

export const VoiceIdSchema = z.enum([
  "maichi",
  "baotrang",
  "kimoanh",
  "hamy",
  "giahuy",
  "huuduc",
  "quangminh",
  "tiendat",
]);
export type VoiceId = z.infer<typeof VoiceIdSchema>;

export const SceneTemplateSchema = z.enum([
  "HookScene",
  "NewsIntro",
  "BreakingNews",
  "NewsTimeline",
  "AIConceptScene",
  "ArchitectureScene",
  "FeatureHighlight",
  "RepositoryCard",
  "CodeShowcase",
  "TerminalAnimation",
  "OutroScene",
]);
export type SceneTemplate = z.infer<typeof SceneTemplateSchema>;

// --- Voice Configuration ---
export const VoiceConfigSchema = z.object({
  voiceId: VoiceIdSchema,
  name: z.string(),
  gender: z.enum(["female", "male"]),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sampleRate: z.number().int().default(48000),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  audioFile: z.string().optional(),
});
export type VoiceConfig = z.infer<typeof VoiceConfigSchema>;

// --- Script Schemas ---
export const ScriptSectionTypeSchema = z.enum([
  "hook",
  "context",
  "main",
  "analysis",
  "conclusion",
  "cta",
]);
export type ScriptSectionType = z.infer<typeof ScriptSectionTypeSchema>;

export const ScriptSectionSchema = z.object({
  id: z.string(),
  type: ScriptSectionTypeSchema,
  text: z.string(),
  startTime: z.number().min(0),
  endTime: z.number().min(0),
});
export type ScriptSection = z.infer<typeof ScriptSectionSchema>;

export const ScriptSchema = z.object({
  fullText: z.string(),
  wordCount: z.number().int().min(0),
  sections: z.array(ScriptSectionSchema),
});
export type Script = z.infer<typeof ScriptSchema>;

// --- Scene Schema ---
export const SceneSchema = z.object({
  id: z.string(),
  template: SceneTemplateSchema,
  startFrame: z.number().int().min(0),
  durationInFrames: z.number().int().min(1),
  transition: z
    .object({
      type: z.enum(["fade", "slide-left", "zoom-in", "glitch", "none"]),
      durationInFrames: z.number().int().default(10),
    })
    .optional(),
  props: z.record(z.string(), z.unknown()),
});
export type Scene = z.infer<typeof SceneSchema>;

// --- Video Project Schema ---
export const VideoProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: VideoCategorySchema,
  aspectRatio: z.enum(["9:16", "16:9", "1:1"]).default("9:16"),
  resolution: z.object({
    width: z.number().int().default(1080),
    height: z.number().int().default(1920),
  }),
  fps: z.number().int().default(30),
  durationInFrames: z.number().int().min(30),
  durationInSeconds: z.number().min(1.0),
  voice: VoiceConfigSchema,
  script: ScriptSchema,
  scenes: z.array(SceneSchema),
  metadata: z
    .object({
      sourceUrl: z.string().optional(),
      author: z.string().optional(),
      createdAt: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});
export type VideoProject = z.infer<typeof VideoProjectSchema>;

// --- Pipeline Schemas ---
export const PipelineStageNameSchema = z.enum([
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
]);
export type PipelineStageName = z.infer<typeof PipelineStageNameSchema>;

export const StageStatusSchema = z.enum([
  "pending",
  "in-progress",
  "completed",
  "failed",
  "skipped",
]);
export type StageStatus = z.infer<typeof StageStatusSchema>;

export const StageTelemetrySchema = z.object({
  name: PipelineStageNameSchema,
  status: StageStatusSchema,
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  error: z.string().optional(),
  retryCount: z.number().int().default(0),
});
export type StageTelemetry = z.infer<typeof StageTelemetrySchema>;

export const PipelineStatusSchema = z.enum([
  "idle",
  "running",
  "paused",
  "completed",
  "failed",
]);
export type PipelineStatus = z.infer<typeof PipelineStatusSchema>;

export const PipelineStateSchema = z.object({
  videoId: z.string(),
  prompt: z.string(),
  status: PipelineStatusSchema,
  currentStage: PipelineStageNameSchema,
  progress: z.number().min(0).max(100),
  stages: z.array(StageTelemetrySchema),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  videoProject: VideoProjectSchema.optional(),
  outputPath: z.string().optional(),
});
export type PipelineState = z.infer<typeof PipelineStateSchema>;

// --- QA Report Schema ---
export const QACheckItemSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  details: z.string(),
  score: z.number().min(0).max(100),
});
export type QACheckItem = z.infer<typeof QACheckItemSchema>;

export const QAReportSchema = z.object({
  videoId: z.string(),
  overallPassed: z.boolean(),
  score: z.number().min(0).max(100),
  checks: z.array(QACheckItemSchema),
  mediaMetadata: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      fps: z.number().optional(),
      duration: z.number().optional(),
      hasAudio: z.boolean().optional(),
      audioChannels: z.number().optional(),
      fileSizeBytes: z.number().optional(),
    })
    .optional(),
  timestamp: z.string(),
});
export type QAReport = z.infer<typeof QAReportSchema>;
