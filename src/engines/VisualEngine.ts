export interface SafeZone {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ColorTheme {
  background: string;
  surface: string;
  surfaceLight: string;
  border: string;
  borderGlow: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentCyan: string;
  accentIndigo: string;
  accentEmerald: string;
  accentRose: string;
  accentAmber: string;
}

export const DARK_TECH_THEME: ColorTheme = {
  background: "#090a0f",
  surface: "#11141e",
  surfaceLight: "#1a1f2e",
  border: "#232b3e",
  borderGlow: "rgba(56, 189, 248, 0.25)",
  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#64748b",
  accentCyan: "#38bdf8",
  accentIndigo: "#818cf8",
  accentEmerald: "#34d399",
  accentRose: "#f43f5e",
  accentAmber: "#f59e0b",
};

export const TIKTOK_SAFE_ZONE: SafeZone = {
  top: 160,
  bottom: 260,
  left: 60,
  right: 60,
};

export class VisualEngine {
  public static getTheme(): ColorTheme {
    return DARK_TECH_THEME;
  }

  public static getSafeZone(): SafeZone {
    return TIKTOK_SAFE_ZONE;
  }

  public static formatTerminalLines(command: string, output?: string): string[] {
    const lines = [`$ ${command}`];
    if (output) {
      lines.push(...output.split("\n"));
    }
    return lines;
  }

  public static formatCodeTokens(code: string): Array<{ text: string; color: string }> {
    // Simple fast syntax tokenization for Remotion rendering without heavy external deps
    const lines = code.split("\n");
    return lines.map((line) => {
      let color = DARK_TECH_THEME.textPrimary;
      if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
        color = DARK_TECH_THEME.textMuted;
      } else if (line.includes("import ") || line.includes("export ") || line.includes("const ") || line.includes("await ")) {
        color = DARK_TECH_THEME.accentIndigo;
      } else if (line.includes("function") || line.includes("class") || line.includes("return")) {
        color = DARK_TECH_THEME.accentCyan;
      } else if (line.includes('"') || line.includes("'") || line.includes("`")) {
        color = DARK_TECH_THEME.accentEmerald;
      }
      return { text: line, color };
    });
  }
}
