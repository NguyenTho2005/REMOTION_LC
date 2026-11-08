/**
 * TRƯỚC VÀ SAU AI — Design Tokens & Visual Style Guide
 * Hand-drawn Sticker Animation Style (1920x1080 16:9 Landscape)
 */

export const FILM_COLORS = {
  // Official film palette
  paper: "#F6F0E4",
  paperDark: "#ECE4D4",
  ink: "#242424",
  inkSubtle: "#4B4B4B",
  warmYellow: "#F2C14E",
  mutedBlue: "#6D9DC5",
  coral: "#E67E67",
  sageGreen: "#86A88A",

  // Character Minh specific
  minhSkin: "#FDEED9",
  minhHair: "#222024",
  minhShirt: "#6D9DC5",
  minhTrousers: "#242424",
  minhShoes: "#1C1B1E",

  // Secondary characters
  teacherCardigan: "#86A88A",
  studentHoodie: "#E67E67",
  colleagueShirt: "#F2C14E",
  elderSweater: "#9C8578",

  // Sticker accents
  stickerWhite: "#FFFFFF",
  stickerShadow: "rgba(36, 36, 36, 0.12)",
  cardboardBorder: "#DCD0BD",

  // Subtitle highlights
  subtitleBg: "rgba(36, 36, 36, 0.88)",
  subtitleText: "#FFFFFF",
  subtitleHighlight: "#F2C14E",
  subtitleActiveWord: "#F2C14E",
};

export const FILM_SPECS = {
  width: 1920,
  height: 1080,
  fps: 30,
  targetDurationSeconds: 300,
  totalFrames: 9000, // 300s * 30fps

  // 16:9 Safe Zones
  safeZone: {
    top: 90,
    bottom: 90,
    left: 140,
    right: 140,
  },

  // Subtitle Area
  subtitleZone: {
    bottom: 95,
    maxLines: 2,
    fontSize: 34,
    highlightColor: FILM_COLORS.warmYellow,
  },
};

export const ACT_TIMINGS = {
  act1: { startFrame: 0, durationInFrames: 1350, title: "Hồi 1 · Thói Quen Cũ (00:00 - 00:45)" },
  act2: { startFrame: 1350, durationInFrames: 1500, title: "Hồi 2 · Cuộc Sống Trước Generative AI (00:45 - 01:35)" },
  act3: { startFrame: 2850, durationInFrames: 1200, title: "Hồi 3 · Sự Xuất Hiện Của AI Phổ Cập (01:35 - 02:15)" },
  act4: { startFrame: 4050, durationInFrames: 1950, title: "Hồi 4 · Vạn Vật Đổi Thay (02:15 - 03:20)" },
  act5: { startFrame: 6000, durationInFrames: 1650, title: "Hồi 5 · Cú Vấp Bất Ngờ & Điểm Nghẽn (03:20 - 04:15)" },
  act6: { startFrame: 7650, durationInFrames: 1350, title: "Hồi 6 · Lựa Chọn Của Con Người (04:15 - 05:00)" },
};
