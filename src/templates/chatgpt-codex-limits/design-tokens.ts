/**
 * Design Tokens for ChatGPT & Codex Usage Limits Explainer
 * Style: Editorial Motion Graphics + Kinetic Typography + Minimalist 2D Tech
 */

export const DESIGN_TOKENS = {
  colors: {
    // Backgrounds (editorial alternating dark & light)
    bgDark: "#0B0F19",
    bgDarkElevated: "#111827",
    bgLight: "#F8F9FA",
    bgLightElevated: "#FFFFFF",

    // Accent Brand Colors
    chatgptGreen: "#10A37F",
    codexCyan: "#38BDF8",
    codexAmber: "#F59E0B",
    openaiWhite: "#FFFFFF",
    warningRed: "#EF4444",
    purpleAccent: "#A855F7",

    // Card & Surface Fills
    cardDark: "rgba(22, 30, 46, 0.94)",
    cardDarkBorder: "rgba(56, 189, 248, 0.18)",
    cardLight: "#FFFFFF",
    cardLightBorder: "rgba(15, 23, 42, 0.08)",

    // Typography
    textDarkPrimary: "#F8FAFC",
    textDarkSecondary: "#94A3B8",
    textDarkMuted: "#64748B",
    textLightPrimary: "#0F172A",
    textLightSecondary: "#475569",
    textLightMuted: "#94A3B8",

    // Karaoke Subtitle
    karaokeBg: "rgba(11, 15, 25, 0.92)",
    karaokeBorder: "rgba(56, 189, 248, 0.35)",
    karaokeTextInactive: "rgba(248, 250, 252, 0.65)",
    karaokeHighlight: "#38BDF8",
    karaokeHighlightSecondary: "#10A37F",
  },

  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    monoFontFamily:
      "'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    sizes: {
      hero: 76,
      h1: 58,
      h2: 44,
      body: 34,
      caption: 26,
      badge: 22,
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },

  layout: {
    width: 1080,
    height: 1920,
    safeArea: {
      top: 150, // Avoid TikTok header
      bottom: 280, // Avoid TikTok caption/audio bar
      right: 120, // Avoid Like / Comment / Share icons
      left: 60,
    },
    borderRadius: {
      sm: 12,
      md: 20,
      lg: 28,
      pill: 9999,
    },
  },

  shadows: {
    softDark: "0 20px 48px -12px rgba(0, 0, 0, 0.65)",
    cardDark: "0 12px 32px -8px rgba(0, 0, 0, 0.5)",
    softLight: "0 20px 48px -12px rgba(15, 23, 42, 0.12)",
    glowGreen: "0 0 32px rgba(16, 163, 127, 0.35)",
    glowCyan: "0 0 32px rgba(56, 189, 248, 0.35)",
  },
} as const;
