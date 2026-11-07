/* eslint-disable @remotion/non-pure-animation */
import type { Scene, Script, VideoCategory } from "../schemas/index.ts";
import type { ResearchResult } from "./ResearchEngine.ts";

export class StoryboardEngine {
  public static createStoryboard(
    script: Script,
    research: ResearchResult,
    category: VideoCategory,
    fps: number = 30,
    totalFrames: number
  ): Scene[] {
    const scenes: Scene[] = [];
    const sections = script.sections;

    if (sections.length === 0) {
      return scenes;
    }

    // Allocate frames proportional to section timestamps
    let currentFrame = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const isLast = i === sections.length - 1;

      const sectionStartFrame = Math.round(section.startTime * fps);
      const sectionEndFrame = isLast ? totalFrames : Math.round(section.endTime * fps);
      const frameDuration = Math.max(fps, sectionEndFrame - sectionStartFrame);

      const sceneId = `scene-${i + 1}-${section.type}`;
      const template = this.chooseTemplate(category, section.type, i, sections.length);
      const props = this.buildSceneProps(template, section.text, research, category);

      scenes.push({
        id: sceneId,
        template,
        startFrame: currentFrame,
        durationInFrames: frameDuration,
        transition: {
          type: i === 0 ? "none" : "fade",
          durationInFrames: 8,
        },
        props,
      });

      currentFrame += frameDuration;
    }

    // Normalize final duration to match totalFrames exactly
    if (scenes.length > 0) {
      const totalAllocated = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
      const diff = totalFrames - totalAllocated;
      scenes[scenes.length - 1].durationInFrames += diff;
    }

    return scenes;
  }

  private static chooseTemplate(
    category: VideoCategory,
    sectionType: string,
    index: number,
    total: number
  ): Scene["template"] {
    if (index === total - 1 || sectionType === "cta") {
      return "OutroScene";
    }

    if (index === 0 || sectionType === "hook") {
      if (category === "tech-news" || category === "ai-news") {
        return "BreakingNews";
      }
      return "HookScene";
    }

    if (category === "github-repo-review") {
      if (index === 1) return "RepositoryCard";
      if (index === 2) return "CodeShowcase";
      return "TerminalAnimation";
    }

    if (category === "ai-model-review" || category === "ai-tool-review") {
      if (index === 1) return "AIConceptScene";
      return "FeatureHighlight";
    }

    if (category === "tech-news" || category === "ai-news") {
      if (index === 1) return "NewsTimeline";
      return "FeatureHighlight";
    }

    // ai-explainer default
    if (index === 1) return "AIConceptScene";
    return "ArchitectureScene";
  }

  private static buildSceneProps(
    template: Scene["template"],
    sectionText: string,
    research: ResearchResult,
    category: VideoCategory
  ): Record<string, unknown> {
    switch (template) {
      case "BreakingNews":
        return {
          alertBadge: "TIN NÓNG CÔNG NGHỆ",
          headline: research.title,
          summary: sectionText,
          accentColor: "#ef4444",
        };

      case "NewsTimeline":
        return {
          title: "Diễn Biến Cập Nhật",
          events: research.facts.map((fact, idx) => ({
            step: `Điểm ${idx + 1}`,
            detail: fact,
          })),
          accentColor: "#f59e0b",
        };

      case "RepositoryCard":
        return {
          repoName: research.specs["Repository"] || "awesome-repo",
          stars: research.specs["Stars"] || "20k+ ★",
          forks: research.specs["Forks"] || "2.5k",
          language: research.specs["Language"] || "TypeScript",
          license: research.specs["License"] || "MIT",
          description: sectionText,
          accentColor: "#10b981",
        };

      case "CodeShowcase":
        return {
          title: "Cú Pháp & Triển Khai",
          code: research.codeSnippet || `// Quick start example\nconst result = await runTask();`,
          language: "typescript",
          explanation: sectionText,
          accentColor: "#6366f1",
        };

      case "TerminalAnimation":
        return {
          title: "Cài Đặt & Khởi Chạy",
          command: research.terminalCommand || "npm install",
          output: "✔ Package installed successfully\n✔ Ready to deploy in production",
          accentColor: "#06b6d4",
        };

      case "AIConceptScene":
        return {
          conceptTitle: research.specs["Concept"] || research.specs["Model"] || "Kiến Trúc AI",
          summary: sectionText,
          pillars: [
            { title: "Hiểu Ngữ Cảnh", description: "Tiếp nhận và giải mã prompt", icon: "brain" },
            { title: "Lập Kế Hoạch", description: "Phân rã bài toán thành tác vụ", icon: "tree" },
            { title: "Gọi Công Cụ", description: "API, Terminal, Database", icon: "tools" },
            { title: "Đánh Giá & Trả Lời", description: "Tự kiểm tra chất lượng đầu ra", icon: "check" },
          ],
          accentColor: "#8b5cf6",
        };

      case "ArchitectureScene":
      case "FeatureHighlight":
        return {
          headline: "Điểm Nổi Bật & Ứng Dụng",
          points: research.facts.slice(0, 3),
          highlightText: sectionText,
          accentColor: "#38bdf8",
        };

      case "OutroScene":
        return {
          callToAction: "Follow ngay để nắm bắt AI thực chiến!",
          channelName: "Tech Pulse Vietnam",
          tags: research.tags,
          accentColor: "#ec4899",
        };

      case "HookScene":
      default:
        return {
          badgeText: category.toUpperCase().replace(/-/g, " "),
          title: research.title,
          subtitle: sectionText,
          accentColor: "#38bdf8",
        };
    }
  }
}
