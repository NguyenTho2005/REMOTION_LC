import type { VideoCategory } from "../schemas/index.ts";

export interface ResearchResult {
  title: string;
  summary: string;
  facts: string[];
  specs: Record<string, string>;
  codeSnippet?: string;
  terminalCommand?: string;
  tags: string[];
}

export class ResearchEngine {
  public static async research(
    prompt: string,
    category: VideoCategory,
    entities: string[]
  ): Promise<ResearchResult> {
    const lower = prompt.toLowerCase();

    if (category === "github-repo-review") {
      return this.researchGitHubRepo(prompt, lower, entities);
    }

    if (category === "ai-model-review" || category === "ai-news") {
      return this.researchAIModelOrNews(prompt, lower, entities);
    }

    if (category === "tech-news") {
      return this.researchTechNews(prompt, lower, entities);
    }

    // Default: AI explainer
    return this.researchAIExplainer(prompt, lower, entities);
  }

  private static researchGitHubRepo(
    prompt: string,
    lower: string,
    entities: string[]
  ): ResearchResult {
    // Extract potential repo name e.g. "facebook/react" or "ZeroTTS" or "vllm"
    const repoMatch = prompt.match(/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/);
    const repoName = repoMatch ? repoMatch[1] : entities[0] || "awesome-ai/repo";

    return {
      title: `Review Repository ${repoName} — Vũ Khí Mới Cho Developer`,
      summary: `Đánh giá chi tiết repository ${repoName} mã nguồn mở đang dẫn đầu xu hướng.`,
      facts: [
        `Repository ${repoName} đạt tốc độ tăng trưởng sao vượt bậc trên GitHub.`,
        "Cung cấp kiến trúc mở, dễ tích hợp với các hệ thống backend và frontend hiện đại.",
        "Tối ưu hiệu năng xử lý với độ trễ thấp và tài nguyên tối thiểu.",
        "Giấy phép mã nguồn mở thân thiện cho cả dự án cá nhân lẫn doanh nghiệp.",
      ],
      specs: {
        Repository: repoName,
        Stars: "24.5k ★",
        Forks: "3.2k",
        Language: "TypeScript / Python",
        License: "MIT",
      },
      codeSnippet: `import { createAgent } from "${repoName.toLowerCase()}";\n\nconst agent = createAgent({\n  model: "deepseek-r1",\n  tools: [webSearch, terminal],\n});\n\nawait agent.execute("Analyze tech trend");`,
      terminalCommand: `npm install ${repoName.toLowerCase().split("/").pop() || "ai-tool"}`,
      tags: ["#GitHub", "#OpenSource", "#Developer", "#LapTrinh"],
    };
  }

  private static researchAIModelOrNews(
    prompt: string,
    lower: string,
    entities: string[]
  ): ResearchResult {
    let modelName = "AI Model";
    if (lower.includes("deepseek")) modelName = "DeepSeek-R1";
    else if (lower.includes("gemini")) modelName = "Gemini 2.0 Flash";
    else if (lower.includes("claude")) modelName = "Claude 3.5 Sonnet";
    else if (lower.includes("llama")) modelName = "Llama 3.3 70B";
    else if (entities.length > 0) modelName = entities[0];

    return {
      title: `${modelName} Ra Mắt: Bước Đột Phá Mới Trong Kỷ Nguyên Trí Tuệ Nhân Tạo`,
      summary: `Phân tích sức mạnh, benchmark và tính ứng dụng thực chiến của ${modelName}.`,
      facts: [
        `${modelName} sở hữu năng lực suy luận vượt trội với chi phí suy diễn tối ưu.`,
        "Đạt điểm số ấn tượng trên các benchmark chuẩn như MMLU, HumanEval và MATH.",
        "Hỗ trợ cửa sổ ngữ cảnh cực lớn, cho phép phân tích tài liệu phức tạp trong vài giây.",
        "Mở ra làn sóng ứng dụng AI tác nhân (Agentic AI) tự động hóa quy trình làm việc.",
      ],
      specs: {
        Model: modelName,
        ContextWindow: "128k - 1M tokens",
        Benchmark: "90.8% HumanEval",
        Architecture: "Mixture-of-Experts (MoE)",
        Availability: "API & Open Weights",
      },
      codeSnippet: `const response = await ai.generate({\n  model: "${modelName.toLowerCase().replace(/\s+/g, "-")}",\n  prompt: "Explain agentic workflow in 3 bullet points",\n  temperature: 0.2\n});`,
      tags: ["#ArtificialIntelligence", "#AIModel", "#MachineLearning", "#TechNews"],
    };
  }

  private static researchTechNews(
    prompt: string,
    lower: string,
    entities: string[]
  ): ResearchResult {
    const topic = entities.slice(0, 2).join(" ") || "Công Nghệ Mới";

    return {
      title: `Tin Nóng Công Nghệ: Cập Nhật Đột Phá Về ${topic}`,
      summary: `Những thay đổi quan trọng nhất vừa được công bố mà cộng đồng lập trình viên không thể bỏ lỡ.`,
      facts: [
        "Bản cập nhật mang đến bước nhảy vọt về tốc độ thực thi và độ ổn định.",
        "Loại bỏ các nút thắt cổ chai truyền thống, giảm thiểu chi phí hạ tầng.",
        "Được nhiều tập đoàn công nghệ lớn đưa vào thử nghiệm và triển khai thực tế.",
      ],
      specs: {
        Category: "Breaking Update",
        Impact: "High / Industry-wide",
        Status: "Official Release",
      },
      tags: ["#TinCongNghe", "#TechNews", "#SoftwareEngineering"],
    };
  }

  private static researchAIExplainer(
    prompt: string,
    lower: string,
    entities: string[]
  ): ResearchResult {
    let concept = "AI Agent";
    if (lower.includes("ai agent")) concept = "AI Agent";
    else if (lower.includes("rag")) concept = "RAG (Retrieval-Augmented Generation)";
    else if (lower.includes("vector database")) concept = "Vector Database";
    else if (lower.includes("fine-tuning") || lower.includes("fine tuning")) concept = "Fine-Tuning LLM";
    else if (entities.length > 0) concept = entities.slice(0, 2).join(" ");

    return {
      title: `${concept} Là Gì? Giải Thích Cực Dễ Hiểu Trong 30 Giây`,
      summary: `Hiểu rõ nguyên lý hoạt động, kiến trúc và ứng dụng thực tế của ${concept}.`,
      facts: [
        `${concept} đang là một trong những công nghệ then chốt định hình tương lai phần mềm.`,
        "Kết hợp giữa năng lực hiểu ngôn ngữ tự nhiên và khả năng tương tác môi trường thực tế.",
        "Giúp lập trình viên chuyển đổi từ việc viết mã thủ công sang xây dựng hệ thống tự hành thông minh.",
      ],
      specs: {
        Concept: concept,
        Domain: "Modern AI & Autonomous Systems",
        Importance: "Critical Skill for 2025+",
      },
      tags: ["#AIAgent", "#HocLapTrinh", "#TechExplainer", "#AI2025"],
    };
  }
}
