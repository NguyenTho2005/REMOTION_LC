import React from "react";
import { FILM_COLORS } from "../design-tokens";

export type SecondaryCharacterType = "student" | "programmer" | "business_owner" | "designer" | "elder" | "colleague";

export interface SecondaryCharacterProps {
  type: SecondaryCharacterType;
  scale?: number;
  facing?: "left" | "right";
  style?: React.CSSProperties;
}

export const SecondaryCharacter: React.FC<SecondaryCharacterProps> = ({
  type,
  scale = 1.0,
  facing = "right",
  style,
}) => {
  const isFacingLeft = facing === "left";

  let shirtColor = FILM_COLORS.mutedBlue;

  switch (type) {
    case "student":
      shirtColor = FILM_COLORS.studentHoodie;
      break;
    case "programmer":
      shirtColor = "#4F46E5";
      break;
    case "business_owner":
      shirtColor = FILM_COLORS.warmYellow;
      break;
    case "designer":
      shirtColor = FILM_COLORS.coral;
      break;
    case "elder":
      shirtColor = FILM_COLORS.elderSweater;
      break;
    case "colleague":
      shirtColor = FILM_COLORS.colleagueShirt;
      break;
  }

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale}) ${isFacingLeft ? "scaleX(-1)" : ""}`,
        transformOrigin: "bottom center",
        filter: "drop-shadow(0 6px 20px rgba(36, 36, 36, 0.14))",
        ...style,
      }}
    >
      <svg
        width="280"
        height="400"
        viewBox="-140 -60 280 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White Sticker Outline */}
        <ellipse cx="0" cy="40" rx="55" ry="52" fill="#FFFFFF" />
        <rect x="-48" y="90" width="96" height="180" rx="24" fill="#FFFFFF" />

        {/* Legs */}
        <line x1="-16" y1="180" x2="-18" y2="300" stroke={FILM_COLORS.ink} strokeWidth="24" strokeLinecap="round" />
        <line x1="-16" y1="180" x2="-18" y2="300" stroke={FILM_COLORS.ink} strokeWidth="5" strokeLinecap="round" />
        <line x1="16" y1="180" x2="18" y2="300" stroke={FILM_COLORS.ink} strokeWidth="24" strokeLinecap="round" />
        <line x1="16" y1="180" x2="18" y2="300" stroke={FILM_COLORS.ink} strokeWidth="5" strokeLinecap="round" />

        {/* Shoes */}
        <ellipse cx="-20" cy="305" rx="16" ry="8" fill={FILM_COLORS.minhShoes} stroke={FILM_COLORS.ink} strokeWidth="4" />
        <ellipse cx="20" cy="305" rx="16" ry="8" fill={FILM_COLORS.minhShoes} stroke={FILM_COLORS.ink} strokeWidth="4" />

        {/* Torso */}
        <path
          d="M-32 95 C-38 130, -38 165, -30 185 C-10 190, 10 190, 30 185 C38 165, 38 130, 32 95 Z"
          fill={shirtColor}
          stroke={FILM_COLORS.ink}
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Head */}
        <ellipse cx="0" cy="40" rx="44" ry="42" fill={FILM_COLORS.minhSkin} stroke={FILM_COLORS.ink} strokeWidth="5.5" />

        {/* Hair / Accessories */}
        {type === "elder" ? (
          // Gray hair & glasses
          <>
            <path d="M-44 35 C-42 5, -28 -8, 0 -8 C28 -8, 42 5, 44 35 C38 18, 15 12, 0 12 C-15 12, -38 18, -44 35 Z" fill="#D1D5DB" stroke={FILM_COLORS.ink} strokeWidth="5" />
            {/* Glasses */}
            <circle cx="-16" cy="40" r="10" fill="none" stroke={FILM_COLORS.ink} strokeWidth="4" />
            <circle cx="16" cy="40" r="10" fill="none" stroke={FILM_COLORS.ink} strokeWidth="4" />
            <line x1="-6" y1="40" x2="6" y2="40" stroke={FILM_COLORS.ink} strokeWidth="4" />
            <circle cx="-16" cy="40" r="3.5" fill={FILM_COLORS.ink} />
            <circle cx="16" cy="40" r="3.5" fill={FILM_COLORS.ink} />
            {/* Gentle smile */}
            <path d="M-8 58 Q0 65 8 58" fill="none" stroke={FILM_COLORS.ink} strokeWidth="4" strokeLinecap="round" />
          </>
        ) : type === "student" ? (
          // Student with cap/hair
          <>
            <path d="M-44 35 C-42 5, -28 -8, 0 -8 C28 -8, 42 5, 44 35 Z" fill="#4B5563" stroke={FILM_COLORS.ink} strokeWidth="5" />
            <circle cx="-16" cy="42" r="4.5" fill={FILM_COLORS.ink} />
            <circle cx="16" cy="42" r="4.5" fill={FILM_COLORS.ink} />
            <path d="M-10 60 Q0 70 10 60" fill="none" stroke={FILM_COLORS.ink} strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          // Default hair & friendly face
          <>
            <path d="M-44 32 C-40 4, -25 -6, 0 -6 C25 -6, 40 4, 44 32 Z" fill="#1F2937" stroke={FILM_COLORS.ink} strokeWidth="5" />
            <circle cx="-15" cy="42" r="4.5" fill={FILM_COLORS.ink} />
            <circle cx="15" cy="42" r="4.5" fill={FILM_COLORS.ink} />
            <path d="M-8 60 Q0 68 8 60" fill="none" stroke={FILM_COLORS.ink} strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {/* Arms */}
        <path d="M-30 105 Q-40 145 -15 160" fill="none" stroke={shirtColor} strokeWidth="20" strokeLinecap="round" />
        <path d="M-30 105 Q-40 145 -15 160" fill="none" stroke={FILM_COLORS.ink} strokeWidth="5" strokeLinecap="round" />
        <circle cx="-15" cy="160" r="8" fill={FILM_COLORS.minhSkin} stroke={FILM_COLORS.ink} strokeWidth="4" />

        <path d="M30 105 Q40 145 15 160" fill="none" stroke={shirtColor} strokeWidth="20" strokeLinecap="round" />
        <path d="M30 105 Q40 145 15 160" fill="none" stroke={FILM_COLORS.ink} strokeWidth="5" strokeLinecap="round" />
        <circle cx="15" cy="160" r="8" fill={FILM_COLORS.minhSkin} stroke={FILM_COLORS.ink} strokeWidth="4" />
      </svg>
    </div>
  );
};
