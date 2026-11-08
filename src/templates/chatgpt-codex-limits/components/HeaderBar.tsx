import React from "react";
import { DESIGN_TOKENS } from "../design-tokens";

export interface HeaderBarProps {
  sceneNumber: number;
  totalScenes?: number;
  category?: string;
  theme?: "dark" | "light";
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  sceneNumber,
  totalScenes = 9,
  category = "OPENAI OFFICIAL NOTICE",
  theme = "dark",
}) => {
  const isDark = theme === "dark";
  const textColor = isDark
    ? DESIGN_TOKENS.colors.textDarkSecondary
    : DESIGN_TOKENS.colors.textLightSecondary;
  const badgeBg = isDark
    ? "rgba(56, 189, 248, 0.12)"
    : "rgba(16, 163, 127, 0.1)";
  const badgeBorder = isDark
    ? "rgba(56, 189, 248, 0.28)"
    : "rgba(16, 163, 127, 0.25)";
  const badgeColor = isDark
    ? DESIGN_TOKENS.colors.codexCyan
    : DESIGN_TOKENS.colors.chatgptGreen;

  return (
    <div
      style={{
        position: "absolute",
        top: DESIGN_TOKENS.layout.safeArea.top,
        left: DESIGN_TOKENS.layout.safeArea.left,
        right: DESIGN_TOKENS.layout.safeArea.right,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 90,
      }}
    >
      {/* Category Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: badgeBg,
          border: `1.5px solid ${badgeBorder}`,
          borderRadius: DESIGN_TOKENS.layout.borderRadius.pill,
          padding: "8px 18px",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: badgeColor,
            boxShadow: `0 0 8px ${badgeColor}`,
          }}
        />
        <span
          style={{
            fontFamily: DESIGN_TOKENS.typography.monoFontFamily,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: badgeColor,
            textTransform: "uppercase",
          }}
        >
          {category}
        </span>
      </div>

      {/* Scene Index counter */}
      <div
        style={{
          fontFamily: DESIGN_TOKENS.typography.monoFontFamily,
          fontSize: 22,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "0.05em",
        }}
      >
        {String(sceneNumber).padStart(2, "0")} / {String(totalScenes).padStart(2, "0")}
      </div>
    </div>
  );
};
