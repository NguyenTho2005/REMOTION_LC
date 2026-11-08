export const PALETTE = {
  bgPaper: "#F8F6F0",
  bgSlate: "#1E1E24",
  charcoal: "#18181B",
  charcoalLight: "#3F3F46",
  charcoalFaint: "#71717A",
  chalkWhite: "#ECEEDF",
  mustardYellow: "#E5A93C",
  mustardLight: "#FDE68A",
  softMint: "#52B788",
  mintLight: "#D1FAE5",
  coralRed: "#E05A47",
  coralLight: "#FEE2E2",
  pencilBlue: "#4A90E2",
};

export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 3000,
  safeZone: {
    top: 150,
    bottom: 280,
    right: 120,
    left: 80,
    contentWidth: 920,
  },
};

export const SCENE_TIMINGS = {
  intro: {
    start: 0,
    duration: 300,
    end: 300,
    audioSrc: "audio/five-levels-of-ai/S01.wav",
    narration:
      "Năm cấp độ của trí tuệ nhân tạo. Bạn có biết chúng ta đang thực sự đứng ở bậc thang nào trong cuộc cách mạng này không?",
  },
  level1: {
    start: 300,
    duration: 450,
    end: 750,
    audioSrc: "audio/five-levels-of-ai/S02.wav",
    narration:
      "Cấp độ một: Chatbot. Ở cấp độ này, chúng ta đặt câu hỏi và AI trả lời. Nó rất thông minh về mặt ngôn ngữ, nhưng hoàn toàn thụ động. Bạn phải tự làm mọi thao tác từ mở file, gửi email đến chạy lệnh.",
  },
  level2: {
    start: 750,
    duration: 510,
    end: 1260,
    audioSrc: "audio/five-levels-of-ai/S03.wav",
    narration:
      "Cấp độ hai: AI Agent. Đây chính là bước ngoặt công nghệ của năm hai mươi hai mươi lăm! Thay vì chỉ trò chuyện, AI Agent có thể tiếp nhận mục tiêu, tự lập kế hoạch và tự động sử dụng trình duyệt, cơ sở dữ liệu và mã lệnh để hoàn thành công việc.",
  },
  level3: {
    start: 1260,
    duration: 480,
    end: 1740,
    audioSrc: "audio/five-levels-of-ai/S04.wav",
    narration:
      "Cấp độ ba: Đa giác quan Multimodal. Không còn giới hạn ở văn bản, AI giờ đây có thể nhìn thấy qua camera, nghe giọng nói và phản hồi tức thời theo thời gian thực dưới ba trăm mili giây như một người trợ lý thực thụ.",
  },
  level4: {
    start: 1740,
    duration: 600,
    end: 2340,
    audioSrc: "audio/five-levels-of-ai/S05.wav",
    narration:
      "Cấp độ bốn: Trí tuệ nhân tạo tổng quát AGI. Đây là khi một hệ thống AI duy nhất có thể học tập, nghiên cứu và làm việc ngang tầm hoặc vượt qua các chuyên gia hàng đầu trong mọi lĩnh vực trí tuệ, từ toán học đến y sinh.",
  },
  level5: {
    start: 2340,
    duration: 660,
    end: 3000,
    audioSrc: "audio/five-levels-of-ai/S06.wav",
    narration:
      "Cấp độ năm: Siêu trí tuệ ASI, vượt xa toàn bộ nhân loại cộng lại. Nhưng thực tế hôm nay, bạn chỉ cần làm chủ cấp độ hai là AI Agent. Ai làm chủ công nghệ hôm nay, người đó sẽ dẫn đầu ngày mai. Bấm follow ngay để cùng làm chủ AI nhé!",
  },
} as const;

export const SPRING_DOODLE = {
  damping: 12,
  stiffness: 120,
  mass: 0.8,
};

export const SPRING_BOUNCE = {
  damping: 9,
  stiffness: 140,
  mass: 0.6,
};
