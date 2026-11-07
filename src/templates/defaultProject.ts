import { VideoProject } from "../schemas/index.ts";

export const DEFAULT_TIKTOK_PROJECT: VideoProject = {
  id: "default-project",
  title: "AI Agent Là Gì? Kỷ Nguyên Tự Động Hóa 2025",
  category: "ai-explainer",
  aspectRatio: "9:16",
  resolution: { width: 1080, height: 1920 },
  fps: 30,
  durationInFrames: 900,
  durationInSeconds: 30.0,
  voice: {
    voiceId: "quangminh",
    name: "Quang Minh",
    gender: "male",
    speed: 1.0,
    sampleRate: 48000,
  },
  script: {
    fullText: "AI Agent là gì mà ai cũng đang nhắc tới? Khác với chatbot thông thường chỉ trò chuyện qua lại, AI Agent sở hữu khả năng tự lập kế hoạch, tự gọi công cụ và giải quyết các bài toán phức tạp một cách độc lập từ đầu đến cuối. Trong kỷ nguyên mới, đây chính là kỹ năng quan trọng giúp bạn bứt phá năng suất lập trình và tự động hóa công việc thường nhật. Bạn đã sẵn sàng xây dựng hệ thống thông minh của riêng mình chưa? Hãy bấm follow để đón xem các hướng dẫn thực chiến tiếp theo nhé!",
    wordCount: 88,
    sections: [
      {
        id: "sec-1",
        type: "hook",
        text: "AI Agent là gì mà ai cũng đang nhắc tới?",
        startTime: 0,
        endTime: 4,
      },
      {
        id: "sec-2",
        type: "context",
        text: "Khác với chatbot thông thường chỉ trò chuyện qua lại, AI Agent sở hữu khả năng tự lập kế hoạch, tự gọi công cụ và giải quyết các bài toán phức tạp một cách độc lập từ đầu đến cuối.",
        startTime: 4,
        endTime: 16,
      },
      {
        id: "sec-3",
        type: "analysis",
        text: "Trong kỷ nguyên mới, đây chính là kỹ năng quan trọng giúp bạn bứt phá năng suất lập trình và tự động hóa công việc thường nhật.",
        startTime: 16,
        endTime: 24,
      },
      {
        id: "sec-4",
        type: "cta",
        text: "Bạn đã sẵn sàng xây dựng hệ thống thông minh của riêng mình chưa? Hãy bấm follow để đón xem các hướng dẫn thực chiến tiếp theo nhé!",
        startTime: 24,
        endTime: 30,
      },
    ],
  },
  scenes: [
    {
      id: "scene-1-hook",
      template: "HookScene",
      startFrame: 0,
      durationInFrames: 120,
      props: {
        badgeText: "AI AGENT 2025",
        title: "AI Agent Là Gì?",
        subtitle: "Khác gì so với Chatbot thông thường?",
        accentColor: "#38bdf8",
      },
    },
    {
      id: "scene-2-concept",
      template: "AIConceptScene",
      startFrame: 120,
      durationInFrames: 360,
      props: {
        conceptTitle: "4 Trụ Cột Cốt Lõi Của AI Agent",
        summary: "Perception, Planning, Tools và Action",
        accentColor: "#8b5cf6",
      },
    },
    {
      id: "scene-3-arch",
      template: "ArchitectureScene",
      startFrame: 480,
      durationInFrames: 240,
      props: {
        headline: "Vũ Khí Bứt Phá Năng Suất 2025",
        points: [
          "Tự động hóa toàn bộ quy trình DevOps & Code Review",
          "Tối ưu chi phí vận hành và giải quyết nút thắt cổ chai",
          "Chuyển đổi kỹ sư thành kiến trúc sư hệ thống tự hành",
        ],
        highlightText: "Kỹ năng sống còn cho lập trình viên hiện đại",
        accentColor: "#38bdf8",
      },
    },
    {
      id: "scene-4-outro",
      template: "OutroScene",
      startFrame: 720,
      durationInFrames: 180,
      props: {
        callToAction: "Follow ngay để đón xem hướng dẫn thực chiến tiếp theo!",
        channelName: "Tech Pulse Vietnam",
        tags: ["#AIAgent", "#LapTrinh", "#CongNghe", "#AI2025"],
        accentColor: "#ec4899",
      },
    },
  ],
};
