import type { VideoCategory, VoiceId } from "../schemas/index.ts";

export interface PlanResult {
  category: VideoCategory;
  durationInSeconds: number;
  durationInFrames: number;
  fps: number;
  recommendedVoiceId: VoiceId;
  targetWordCount: number;
  suggestedScenes: Array<{
    template: string;
    targetDurationSeconds: number;
    description: string;
  }>;
  keyEntities: string[];
}

export class TaskPlanner {
  public static plan(prompt: string): PlanResult {
    const lower = prompt.toLowerCase();
    const category = this.detectCategory(lower);
    const durationInSeconds = this.detectDuration(lower, category);
    const fps = 30;
    const durationInFrames = Math.round(durationInSeconds * fps);
    const recommendedVoiceId = this.recommendVoice(category);
    // Speaking speed in Vietnamese is roughly 2.8 - 3.2 words per second
    const targetWordCount = Math.round(durationInSeconds * 2.8);
    const suggestedScenes = this.planSceneStructure(category, durationInSeconds);
    const keyEntities = this.extractEntities(prompt);

    return {
      category,
      durationInSeconds,
      durationInFrames,
      fps,
      recommendedVoiceId,
      targetWordCount,
      suggestedScenes,
      keyEntities,
    };
  }

  private static detectCategory(lower: string): VideoCategory {
    if (lower.includes("3d") || lower.includes("three.js") || lower.includes("threejs") || lower.includes("motion 3d") || lower.includes("không gian 3d")) {
      return "3d-motion";
    }
    if (lower.includes("github") || lower.includes("repo") || lower.includes("mã nguồn mở") || lower.includes("open-source")) {
      return "github-repo-review";
    }
    if (lower.includes("mô hình") || lower.includes("model review") || lower.includes("benchmark") || lower.includes("llm")) {
      return "ai-model-review";
    }
    if (lower.includes("công cụ") || lower.includes("ai tool") || lower.includes("tiện ích") || lower.includes("phần mềm ai")) {
      return "ai-tool-review";
    }
    if (lower.includes("tin ai") || lower.includes("ai news") || lower.includes("deepseek") || lower.includes("openai") || lower.includes("anthropic")) {
      return "ai-news";
    }
    if (lower.includes("tin tức") || lower.includes("news") || lower.includes("ra mắt") || lower.includes("phát hành") || lower.includes("bản cập nhật")) {
      return "tech-news";
    }
    return "ai-explainer";
  }

  private static detectDuration(lower: string, category: VideoCategory): number {
    const secMatch = lower.match(/(\d+)\s*(s|giây|sec|second)/i);
    if (secMatch) {
      const parsed = parseInt(secMatch[1], 10);
      if (parsed >= 15 && parsed <= 90) return parsed;
    }
    const minMatch = lower.match(/(\d+)\s*(phút|min|minute)/i);
    if (minMatch) {
      const parsed = parseInt(minMatch[1], 10) * 60;
      if (parsed >= 15 && parsed <= 90) return Math.min(parsed, 60);
    }

    // Default durations per category
    switch (category) {
      case "3d-motion":
        return 30;
      case "tech-news":
        return 35;
      case "ai-news":
        return 40;
      case "ai-model-review":
        return 45;
      case "ai-tool-review":
        return 45;
      case "github-repo-review":
        return 50;
      case "ai-explainer":
      default:
        return 30;
    }
  }

  private static recommendVoice(category: VideoCategory): VoiceId {
    switch (category) {
      case "3d-motion":
        return "quangminh";
      case "tech-news":
        return "baotrang";
      case "ai-news":
      case "ai-model-review":
      case "ai-explainer":
        return "quangminh";
      case "github-repo-review":
        return "tiendat";
      case "ai-tool-review":
        return "giahuy";
      default:
        return "quangminh";
    }
  }

  private static planSceneStructure(
    category: VideoCategory,
    totalDuration: number
  ): PlanResult["suggestedScenes"] {
    switch (category) {
      case "3d-motion":
        return [
          { template: "ThreeCinematicIntro", targetDurationSeconds: 4, description: "3D typography reveal & particle intro hook" },
          { template: "ThreeTechExplainer", targetDurationSeconds: 10, description: "3D connected graph and node network" },
          { template: "ThreeAlgorithmViz", targetDurationSeconds: 10, description: "Step-by-step 3D algorithm visualization" },
          { template: "ThreeHybridExplainer", targetDurationSeconds: Math.max(6, totalDuration - 24), description: "Hybrid 3D object with 2D callouts and CTA" },
        ];
      case "github-repo-review":
        return [
          { template: "HookScene", targetDurationSeconds: 5, description: "Attention-grabbing hook highlighting repo impact" },
          { template: "RepositoryCard", targetDurationSeconds: 12, description: "Repo overview: stars, owner, language, mission" },
          { template: "CodeShowcase", targetDurationSeconds: 15, description: "Syntax highlighted code snippet of usage" },
          { template: "TerminalAnimation", targetDurationSeconds: 10, description: "Installation command and CLI run" },
          { template: "OutroScene", targetDurationSeconds: Math.max(5, totalDuration - 42), description: "Call to action and GitHub link pill" },
        ];
      case "tech-news":
      case "ai-news":
        return [
          { template: "BreakingNews", targetDurationSeconds: 6, description: "Alert badge and breaking news headline" },
          { template: "NewsTimeline", targetDurationSeconds: 14, description: "Key changes, changelog or event timeline" },
          { template: "FeatureHighlight", targetDurationSeconds: 10, description: "Impact analysis for developers" },
          { template: "OutroScene", targetDurationSeconds: Math.max(5, totalDuration - 30), description: "Summary take and follow CTA" },
        ];
      case "ai-model-review":
      case "ai-tool-review":
        return [
          { template: "HookScene", targetDurationSeconds: 5, description: "Hook with model release and benchmark score" },
          { template: "AIConceptScene", targetDurationSeconds: 15, description: "Architecture, parameters, and key specs" },
          { template: "FeatureHighlight", targetDurationSeconds: 15, description: "Hands-on capabilities, pros & cons" },
          { template: "OutroScene", targetDurationSeconds: Math.max(5, totalDuration - 35), description: "Verdict and discussion CTA" },
        ];
      case "ai-explainer":
      default:
        return [
          { template: "HookScene", targetDurationSeconds: 5, description: "Question hook provoking curiosity" },
          { template: "AIConceptScene", targetDurationSeconds: 15, description: "Core definition and 4 pillars" },
          { template: "ArchitectureScene", targetDurationSeconds: 12, description: "Why it matters and real-world impact" },
          { template: "OutroScene", targetDurationSeconds: Math.max(5, totalDuration - 32), description: "Wrap-up and follow CTA" },
        ];
    }
  }

  private static extractEntities(prompt: string): string[] {
    const tokens = prompt.split(/[\s,;.!?:()]+/);
    const candidates = tokens.filter(
      (t) => t.length > 2 && (t[0] === t[0]?.toUpperCase() || t.includes("/") || t.includes("-"))
    );
    return Array.from(new Set(candidates));
  }
}
