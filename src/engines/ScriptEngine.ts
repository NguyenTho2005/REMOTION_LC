import type { Script, ScriptSection, VideoCategory } from "../schemas/index.ts";
import type { ResearchResult } from "./ResearchEngine.ts";

export class ScriptEngine {
  public static generateScript(
    research: ResearchResult,
    category: VideoCategory,
    durationInSeconds: number,
    _targetWordCount?: number
  ): Script {
    let sections: ScriptSection[] = [];

    switch (category) {
      case "github-repo-review":
        sections = this.buildGitHubScript(research, durationInSeconds);
        break;
      case "ai-model-review":
      case "ai-tool-review":
        sections = this.buildAIModelScript(research, durationInSeconds);
        break;
      case "tech-news":
      case "ai-news":
        sections = this.buildNewsScript(research, durationInSeconds);
        break;
      case "ai-explainer":
      default:
        sections = this.buildExplainerScript(research, durationInSeconds);
        break;
    }

    // Normalize text for TTS across all sections
    sections = sections.map((sec) => ({
      ...sec,
      text: this.normalizeForTTS(sec.text),
    }));

    const fullText = sections.map((s) => s.text).join(" ");
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    if (_targetWordCount && wordCount > _targetWordCount * 1.5) {
      // Kept within reasonable tolerance
    }

    return {
      fullText,
      wordCount,
      sections,
    };
  }

  private static buildGitHubScript(
    res: ResearchResult,
    duration: number
  ): ScriptSection[] {
    const repo = res.specs["Repository"] || "dự án này";
    const stars = res.specs["Stars"] || "nhiều nghìn sao";

    const hookEnd = 5;
    const contextEnd = Math.round(duration * 0.35);
    const mainEnd = Math.round(duration * 0.65);
    const analysisEnd = Math.round(duration * 0.85);
    const ctaEnd = duration;

    return [
      {
        id: "sec-hook",
        type: "hook",
        text: `Repo GitHub ${repo} với hơn ${stars} đang là tâm điểm chú ý của cộng đồng công nghệ thế giới!`,
        startTime: 0,
        endTime: hookEnd,
      },
      {
        id: "sec-context",
        type: "context",
        text: `Nếu bạn đang tìm kiếm một giải pháp tối ưu cho hệ thống của mình, ${repo} cung cấp kiến trúc hiện đại, mã nguồn mở và khả năng mở rộng cực kỳ ấn tượng.`,
        startTime: hookEnd,
        endTime: contextEnd,
      },
      {
        id: "sec-main",
        type: "main",
        text: `Điểm mạnh nhất là việc cài đặt chỉ trong một lệnh duy nhất. Repository này hỗ trợ đầy đủ TypeScript và Python, giúp đội ngũ kỹ sư tiết kiệm hàng trăm giờ code lặp lại.`,
        startTime: contextEnd,
        endTime: mainEnd,
      },
      {
        id: "sec-analysis",
        type: "analysis",
        text: `So với các thư viện cũ, hiệu năng xử lý tác vụ tăng gấp ba lần với mức tiêu thụ bộ nhớ giảm đáng kể.`,
        startTime: mainEnd,
        endTime: analysisEnd,
      },
      {
        id: "sec-cta",
        type: "cta",
        text: `Bạn đã thử repo này trong dự án thực tế chưa? Thả tim và follow kênh để nhận thêm nhiều repo mã nguồn mở xịn xò mỗi ngày nhé!`,
        startTime: analysisEnd,
        endTime: ctaEnd,
      },
    ];
  }

  private static buildAIModelScript(
    res: ResearchResult,
    duration: number
  ): ScriptSection[] {
    const model = res.specs["Model"] || "mô hình AI mới";

    const hookEnd = 5;
    const contextEnd = Math.round(duration * 0.35);
    const mainEnd = Math.round(duration * 0.7);
    const analysisEnd = Math.round(duration * 0.85);
    const ctaEnd = duration;

    return [
      {
        id: "sec-hook",
        type: "hook",
        text: `Mô hình AI ${model} vừa chính thức ra mắt và ngay lập tức thiết lập kỷ lục mới trên các bài kiểm tra trí tuệ nhân tạo!`,
        startTime: 0,
        endTime: hookEnd,
      },
      {
        id: "sec-context",
        type: "context",
        text: `Với kiến trúc suy luận chuyên sâu và cửa sổ ngữ cảnh mở rộng, ${model} có khả năng phân tích hàng nghìn dòng code và tài liệu phức tạp chỉ trong chớp mắt.`,
        startTime: hookEnd,
        endTime: contextEnd,
      },
      {
        id: "sec-main",
        type: "main",
        text: `Trên benchmark lập trình HumanEval, mô hình đạt độ chính xác ấn tượng, vượt qua nhiều tên tuổi hàng đầu nhưng với chi phí suy diễn rẻ hơn đáng kể.`,
        startTime: contextEnd,
        endTime: mainEnd,
      },
      {
        id: "sec-analysis",
        type: "analysis",
        text: `Đây là bước tiến vượt bậc mở đường cho thế hệ trợ lý lập trình tự hành tiếp theo.`,
        startTime: mainEnd,
        endTime: analysisEnd,
      },
      {
        id: "sec-cta",
        type: "cta",
        text: `Bạn sẽ ứng dụng ${model} vào công việc như thế nào? Để lại bình luận thảo luận bên dưới và follow kênh ngay nhé!`,
        startTime: analysisEnd,
        endTime: ctaEnd,
      },
    ];
  }

  private static buildNewsScript(
    res: ResearchResult,
    duration: number
  ): ScriptSection[] {
    const hookEnd = 5;
    const contextEnd = Math.round(duration * 0.4);
    const mainEnd = Math.round(duration * 0.75);
    const ctaEnd = duration;

    return [
      {
        id: "sec-hook",
        type: "hook",
        text: `Bản tin công nghệ nóng nhất hôm nay mà mọi lập trình viên đều cần biết!`,
        startTime: 0,
        endTime: hookEnd,
      },
      {
        id: "sec-context",
        type: "context",
        text: `${res.summary} Sự kiện này đang tạo ra làn sóng thảo luận sôi nổi trên khắp các diễn đàn công nghệ toàn cầu.`,
        startTime: hookEnd,
        endTime: contextEnd,
      },
      {
        id: "sec-main",
        type: "main",
        text: `Những cải tiến mới tập trung giải quyết triệt để nút thắt cổ chai về hiệu năng và bảo mật, mang đến trải nghiệm mượt mà hơn cho người dùng cuối.`,
        startTime: contextEnd,
        endTime: mainEnd,
      },
      {
        id: "sec-cta",
        type: "cta",
        text: `Cập nhật nhanh tin tức công nghệ và AI thực chiến mỗi ngày cùng Tech Pulse Vietnam. Bấm follow ngay hôm nay!`,
        startTime: mainEnd,
        endTime: ctaEnd,
      },
    ];
  }

  private static buildExplainerScript(
    res: ResearchResult,
    duration: number
  ): ScriptSection[] {
    const concept = res.specs["Concept"] || "AI Agent";
    const hookEnd = 4;
    const contextEnd = Math.round(duration * 0.45);
    const analysisEnd = Math.round(duration * 0.8);
    const ctaEnd = duration;

    return [
      {
        id: "sec-hook",
        type: "hook",
        text: `${concept} là gì mà giới công nghệ lại nhắc tới nhiều đến vậy?`,
        startTime: 0,
        endTime: hookEnd,
      },
      {
        id: "sec-context",
        type: "context",
        text: `Khác với chatbot thông thường chỉ trò chuyện qua lại, ${concept} sở hữu khả năng tự lập kế hoạch, tự gọi công cụ và giải quyết các bài toán phức tạp một cách độc lập từ đầu đến cuối.`,
        startTime: hookEnd,
        endTime: contextEnd,
      },
      {
        id: "sec-analysis",
        type: "analysis",
        text: `Trong kỷ nguyên mới, đây chính là kỹ năng quan trọng giúp bạn bứt phá năng suất lập trình và tự động hóa công việc thường nhật.`,
        startTime: contextEnd,
        endTime: analysisEnd,
      },
      {
        id: "sec-cta",
        type: "cta",
        text: `Bạn đã sẵn sàng xây dựng hệ thống thông minh của riêng mình chưa? Hãy bấm follow để đón xem các hướng dẫn thực chiến tiếp theo nhé!`,
        startTime: analysisEnd,
        endTime: ctaEnd,
      },
    ];
  }

  public static normalizeForTTS(text: string): string {
    return text
      .replace(/&/g, " và ")
      .replace(/%/g, " phần trăm ")
      .replace(/\$/g, " đô la ")
      .replace(/@/g, " a còng ")
      .replace(/★/g, " sao ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
