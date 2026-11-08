/**
 * TWO SUM 3D — DESIGN TOKENS & VISUAL SPECIFICATION
 * Cinematic 3D Algorithm Explainer (1080x1920 Vertical 9:16)
 */

export const TWO_SUM_COLORS = {
  // 3D Scene Environment
  bgDark: "#080B14",
  bgGradientTop: "#0C1322",
  bgGradientBottom: "#04060A",
  gridFloor: "#1E293B",

  // Semantic Element Colors
  tileDefault: "#1E2538",
  tileDefaultStroke: "#334155",
  tileText: "#F8FAFC",

  // Algorithmic State Colors
  target: "#F59E0B", // Gold / Amber
  pointerI: "#38BDF8", // Sky Blue
  pointerJ: "#FB923C", // Coral Orange
  matchSuccess: "#10B981", // Emerald Green
  bruteForceSlow: "#EF4444", // Crimson Red
  hashMapKey: "#60A5FA", // Light Blue
  hashMapVal: "#A78BFA", // Lavender Purple

  // UI Overlays & Subtitles
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  codeBg: "rgba(15, 23, 42, 0.85)",
  codeBorder: "rgba(51, 65, 85, 0.6)",
  
  // Karaoke Subtitles
  subtitleBg: "rgba(15, 23, 42, 0.94)",
  subtitleBorder: "rgba(245, 158, 11, 0.5)",
  subtitleActiveWord: "#F59E0B",
  subtitleSpokenWord: "#E2E8F0",
  subtitleUpcomingWord: "rgba(226, 232, 240, 0.5)",
};

export const TWO_SUM_SPECS = {
  width: 1080,
  height: 1920,
  fps: 30,

  // 3D Array Layout Geometry
  arraySpacing: 1.45,

  // 9:16 Mobile Safe Margins
  safeArea: {
    top: 150,
    bottom: 260,
    left: 80,
    right: 120,
  },

  // 3D Camera Default
  camera: {
    fov: 42,
    position: [0, 1.2, 11] as [number, number, number],
  },
};
