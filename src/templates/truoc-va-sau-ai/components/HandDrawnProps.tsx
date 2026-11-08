import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FILM_COLORS } from "../design-tokens";

// 1. Hand-Drawn Coffee Cup with Animated Rising Steam
export const CoffeeCup: React.FC<{
  scale?: number;
  steam?: boolean;
  style?: React.CSSProperties;
}> = ({ scale = 1, steam = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Steam animation
  const t = (frame / fps) * 2;
  const steam1Offset = Math.sin(t) * 4;
  const steam2Offset = Math.cos(t * 1.2) * 5;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
        ...style,
      }}
    >
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        {/* Steam Wisps */}
        {steam && (
          <g stroke={FILM_COLORS.inkSubtle} strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
            <path
              d={`M 38 40 Q ${42 + steam1Offset} 25, ${36 - steam1Offset} 12 Q ${40 + steam1Offset} 4, 38 0`}
            />
            <path
              d={`M 54 40 Q ${50 + steam2Offset} 22, ${58 - steam2Offset} 10 Q ${52 + steam2Offset} 3, 54 0`}
            />
          </g>
        )}

        {/* Mug Sticker Border */}
        <path
          d="M 22 45 L 26 100 Q 28 108, 48 108 Q 68 108, 70 100 L 74 45 Z"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Mug Body Fill */}
        <path
          d="M 26 48 L 29 97 Q 31 104, 48 104 Q 65 104, 67 97 L 70 48 Z"
          fill={FILM_COLORS.coral}
        />

        {/* Mug Handle */}
        <path
          d="M 70 54 C 88 56, 88 88, 68 90"
          fill="none"
          stroke={FILM_COLORS.stickerWhite}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 70 54 C 88 56, 88 88, 68 90"
          fill="none"
          stroke={FILM_COLORS.ink}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Coffee Liquid Rim */}
        <ellipse cx="48" cy="48" rx="22" ry="7" fill={FILM_COLORS.ink} />
        <ellipse cx="48" cy="49" rx="19" ry="5" fill="#4A2E18" />

        {/* Decorative hand-drawn star/accent on mug */}
        <circle cx="48" cy="74" r="5" fill={FILM_COLORS.warmYellow} />
      </svg>
    </div>
  );
};

// 2. Hand-Drawn Laptop (Open / Closed / Typing Glow)
export const LaptopProp: React.FC<{
  isOpen?: boolean;
  screenContent?: "code" | "tabs" | "chat" | "blank";
  scale?: number;
  style?: React.CSSProperties;
}> = ({ isOpen = true, screenContent = "code", scale = 1, style }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
        ...style,
      }}
    >
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none">
        {/* Drop shadow */}
        <ellipse cx="110" cy="142" rx="90" ry="8" fill="rgba(36,36,36,0.12)" />

        {isOpen ? (
          <>
            {/* Screen Lid Backing */}
            <rect
              x="30"
              y="12"
              width="160"
              height="105"
              rx="8"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="4"
            />
            {/* Display Bezel */}
            <rect x="36" y="18" width="148" height="93" rx="4" fill="#242832" />

            {/* Screen Content */}
            {screenContent === "code" && (
              <g opacity="0.9">
                <rect x="42" y="24" width="30" height="4" rx="2" fill="#E67E67" />
                <rect x="76" y="24" width="45" height="4" rx="2" fill="#6D9DC5" />
                <rect x="42" y="34" width="60" height="3" rx="1.5" fill="#86A88A" />
                <rect x="42" y="42" width="75" height="3" rx="1.5" fill="#FAF6ED" />
                <rect x="52" y="50" width="50" height="3" rx="1.5" fill="#F2C14E" />
                <rect x="52" y="58" width="65" height="3" rx="1.5" fill="#FAF6ED" />
                <rect x="42" y="66" width="35" height="3" rx="1.5" fill="#86A88A" />
                {/* Blinking cursor */}
                {(frame % 20 < 10) && (
                  <rect x="80" y="66" width="3" height="5" fill="#F2C14E" />
                )}
              </g>
            )}

            {screenContent === "tabs" && (
              <g opacity="0.95">
                {/* Tab bar overload */}
                <rect x="40" y="22" width="140" height="12" rx="2" fill="#3A3F4D" />
                <rect x="42" y="24" width="22" height="8" rx="2" fill="#586073" />
                <rect x="66" y="24" width="22" height="8" rx="2" fill="#586073" />
                <rect x="90" y="24" width="22" height="8" rx="2" fill="#E67E67" />
                <rect x="114" y="24" width="22" height="8" rx="2" fill="#586073" />
                <rect x="138" y="24" width="22" height="8" rx="2" fill="#586073" />
                <text x="163" y="31" fill="#FAF6ED" fontSize="7" fontWeight="bold">24+</text>

                {/* Stack of error cards / search */}
                <rect x="44" y="42" width="132" height="40" rx="4" fill="#FAF6ED" stroke={FILM_COLORS.ink} strokeWidth="1.5" />
                <circle cx="56" cy="54" r="5" fill="#E67E67" />
                <line x1="68" y1="52" x2="160" y2="52" stroke={FILM_COLORS.ink} strokeWidth="2" />
                <line x1="68" y1="62" x2="135" y2="62" stroke={FILM_COLORS.inkSubtle} strokeWidth="1.5" />
                <line x1="68" y1="72" x2="150" y2="72" stroke={FILM_COLORS.inkSubtle} strokeWidth="1.5" />
              </g>
            )}

            {screenContent === "chat" && (
              <g opacity="0.95">
                <rect x="40" y="22" width="140" height="85" fill="#1E2026" />
                {/* User Bubble */}
                <rect x="90" y="28" width="85" height="18" rx="4" fill="#3D4559" />
                <rect x="96" y="34" width="73" height="4" rx="2" fill="#FAF6ED" />
                {/* AI Assistant Bubble with yellow spark */}
                <circle cx="48" cy="62" r="6" fill={FILM_COLORS.warmYellow} />
                <rect x="58" y="54" width="115" height="36" rx="4" fill="#2E3444" stroke={FILM_COLORS.warmYellow} strokeWidth="1" />
                <rect x="64" y="62" width="100" height="3" rx="1.5" fill="#FAF6ED" />
                <rect x="64" y="70" width="85" height="3" rx="1.5" fill="#FAF6ED" />
                <rect x="64" y="78" width="50" height="3" rx="1.5" fill={FILM_COLORS.warmYellow} />
              </g>
            )}

            {/* Laptop Base / Keyboard */}
            <path
              d="M 12 135 L 208 135 L 188 116 L 32 116 Z"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M 16 133 L 204 133 L 185 119 L 35 119 Z"
              fill="#D4D9E2"
            />
            {/* Keyboard grid & trackpad */}
            <rect x="52" y="121" width="116" height="7" rx="1" fill="#757D8E" />
            <rect x="96" y="129" width="28" height="4" rx="1" fill="#9BA3B4" />
          </>
        ) : (
          /* Closed Laptop */
          <g>
            <path
              d="M 24 132 L 196 132 L 182 114 L 38 114 Z"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M 28 130 L 192 130 L 179 116 L 41 116 Z"
              fill="#7B8394"
            />
            <circle cx="110" cy="123" r="5" fill={FILM_COLORS.warmYellow} />
          </g>
        )}
      </svg>
    </div>
  );
};

// 3. Wall Clock with Rotating Hands
export const WallClock: React.FC<{
  hour?: number;
  minute?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ hour = 11, minute = 0, scale = 1, style }) => {
  const frame = useCurrentFrame();

  // Subtle natural second twitch
  const minuteAngle = ((minute + (frame / 30) * 0.2) / 60) * 360;
  const hourAngle = ((hour % 12) + minute / 60) * 30;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        {/* Outer Shadow */}
        <circle cx="60" cy="63" r="48" fill="rgba(36,36,36,0.1)" />

        {/* Clock Frame */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="4.5"
        />

        {/* Clock Face */}
        <circle cx="60" cy="60" r="42" fill={FILM_COLORS.paper} />

        {/* 12 Hour Marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="60"
            y1="22"
            x2="60"
            y2={deg % 90 === 0 ? "27" : "25"}
            stroke={FILM_COLORS.ink}
            strokeWidth={deg % 90 === 0 ? "3" : "1.8"}
            strokeLinecap="round"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}

        {/* Hour Hand */}
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="38"
          stroke={FILM_COLORS.ink}
          strokeWidth="4.5"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 60 60)`}
        />

        {/* Minute Hand */}
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="28"
          stroke={FILM_COLORS.coral}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 60 60)`}
        />

        {/* Center Pivot */}
        <circle cx="60" cy="60" r="4.5" fill={FILM_COLORS.ink} />
        <circle cx="60" cy="60" r="2" fill={FILM_COLORS.warmYellow} />
      </svg>
    </div>
  );
};

// 4. Large Hand-Drawn Desk and Office Setup
export const DeskAndEnvironment: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ style, children }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 1920,
        height: 480,
        pointerEvents: "none",
        ...style,
      }}
    >
      <svg width="1920" height="480" viewBox="0 0 1920 480" fill="none">
        {/* Floor Line */}
        <line
          x1="0"
          y1="460"
          x2="1920"
          y2="460"
          stroke={FILM_COLORS.inkSubtle}
          strokeWidth="3"
          strokeDasharray="20 12"
        />

        {/* Desk Surface Table Top */}
        <rect
          x="180"
          y="280"
          width="1560"
          height="32"
          rx="6"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="5"
        />
        <rect x="184" y="284" width="1552" height="24" rx="3" fill="#DFD2C0" />

        {/* Subtle woodgrain hand-drawn lines */}
        <path
          d="M 240 295 Q 400 293, 720 295 M 880 295 Q 1120 296, 1420 294"
          stroke={FILM_COLORS.inkSubtle}
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* Desk Legs */}
        {/* Left Leg */}
        <rect
          x="260"
          y="312"
          width="28"
          height="148"
          rx="4"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="4"
        />
        <rect x="264" y="316" width="20" height="144" fill="#B3A28F" />

        {/* Right Leg */}
        <rect
          x="1632"
          y="312"
          width="28"
          height="148"
          rx="4"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="4"
        />
        <rect x="1636" y="316" width="20" height="144" fill="#B3A28F" />

        {/* Crossbar */}
        <rect
          x="288"
          y="390"
          width="1344"
          height="16"
          rx="2"
          fill="#C4B5A3"
          stroke={FILM_COLORS.ink}
          strokeWidth="3"
        />
      </svg>
      {children}
    </div>
  );
};

// 5. Stack of Books & Notebook
export const StackOfBooks: React.FC<{
  count?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ count = 3, scale = 1, style }) => {
  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
        ...style,
      }}
    >
      <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
        {/* Book 1 (Bottom, Blue) */}
        <rect
          x="10"
          y="85"
          width="130"
          height="26"
          rx="4"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="3.5"
        />
        <rect x="14" y="88" width="122" height="20" rx="2" fill={FILM_COLORS.mutedBlue} />
        <line x1="22" y1="92" x2="22" y2="105" stroke={FILM_COLORS.stickerWhite} strokeWidth="3" />
        <rect x="32" y="96" width="60" height="4" rx="2" fill={FILM_COLORS.stickerWhite} />

        {/* Book 2 (Middle, Coral) */}
        {count >= 2 && (
          <>
            <rect
              x="20"
              y="60"
              width="112"
              height="25"
              rx="4"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="3.5"
            />
            <rect x="24" y="63" width="104" height="19" rx="2" fill={FILM_COLORS.coral} />
            <line x1="30" y1="67" x2="30" y2="79" stroke={FILM_COLORS.warmYellow} strokeWidth="2.5" />
            <rect x="40" y="70" width="50" height="4" rx="2" fill={FILM_COLORS.stickerWhite} />
          </>
        )}

        {/* Book 3 (Top, Sage Green, Open or Tilted) */}
        {count >= 3 && (
          <>
            <g transform="rotate(-3 75 45)">
              <rect
                x="28"
                y="36"
                width="95"
                height="24"
                rx="3"
                fill={FILM_COLORS.stickerWhite}
                stroke={FILM_COLORS.ink}
                strokeWidth="3.5"
              />
              <rect x="32" y="39" width="87" height="18" rx="2" fill={FILM_COLORS.sageGreen} />
              <rect x="42" y="46" width="45" height="3.5" rx="1.5" fill={FILM_COLORS.warmYellow} />
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

// 6. Tangled Thread vs Structured Mind-Map (The Visual Metaphor for AI Clarity)
export const TangledToOrderMetaphor: React.FC<{
  progress: number; // 0 (tangled black chaos) to 1 (straight yellow ordered clarity)
  scale?: number;
  style?: React.CSSProperties;
}> = ({ progress, scale = 1, style }) => {
  const frame = useCurrentFrame();
  const clamped = Math.max(0, Math.min(1, progress));
  const wobble = Math.sin((frame * 0.15)) * (1 - clamped) * 8;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      <svg width="480" height="320" viewBox="0 0 480 320" fill="none">
        {/* Chaos Phase (Black scribbles, fades out as progress -> 1) */}
        {clamped < 0.95 && (
          <g opacity={1 - clamped}>
            <path
              d={`M 140 160 C ${100 + wobble} 80, ${220 - wobble} 60, 240 160 C 260 260, ${120 + wobble} 250, 160 180 C 190 120, ${280 - wobble} 90, 290 190 C 300 280, ${180 + wobble} 280, 220 140`}
              fill="none"
              stroke={FILM_COLORS.ink}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M 180 130 C 120 190, 320 220, 260 130 C 210 50, ${130 + wobble} 160, 210 210`}
              fill="none"
              stroke={FILM_COLORS.coral}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <text
              x="240"
              y="285"
              textAnchor="middle"
              fill={FILM_COLORS.inkSubtle}
              fontSize="20"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Hỗn loạn &amp; Rối rắm
            </text>
          </g>
        )}

        {/* Order Phase (Clean structured glowing node tree, fades in as progress -> 1) */}
        {clamped > 0.05 && (
          <g opacity={clamped}>
            {/* Connection lines */}
            <line
              x1="240"
              y1="90"
              x2="130"
              y2="190"
              stroke={FILM_COLORS.warmYellow}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <line
              x1="240"
              y1="90"
              x2="240"
              y2="190"
              stroke={FILM_COLORS.warmYellow}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <line
              x1="240"
              y1="90"
              x2="350"
              y2="190"
              stroke={FILM_COLORS.warmYellow}
              strokeWidth="4"
              strokeDasharray="6 4"
            />

            {/* Root Node */}
            <circle
              cx="240"
              cy="90"
              r="28"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="4"
            />
            <circle cx="240" cy="90" r="22" fill={FILM_COLORS.warmYellow} />
            <text x="240" y="96" textAnchor="middle" fill={FILM_COLORS.ink} fontSize="14" fontWeight="bold">
              Ý TƯỞNG
            </text>

            {/* Child Node 1 */}
            <circle
              cx="130"
              cy="190"
              r="24"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="3.5"
            />
            <circle cx="130" cy="190" r="18" fill={FILM_COLORS.mutedBlue} />
            <text x="130" y="195" textAnchor="middle" fill={FILM_COLORS.stickerWhite} fontSize="12" fontWeight="bold">
              DỮ LIỆU
            </text>

            {/* Child Node 2 */}
            <circle
              cx="240"
              cy="190"
              r="24"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="3.5"
            />
            <circle cx="240" cy="190" r="18" fill={FILM_COLORS.sageGreen} />
            <text x="240" y="195" textAnchor="middle" fill={FILM_COLORS.stickerWhite} fontSize="12" fontWeight="bold">
              KẾ HOẠCH
            </text>

            {/* Child Node 3 */}
            <circle
              cx="350"
              cy="190"
              r="24"
              fill={FILM_COLORS.stickerWhite}
              stroke={FILM_COLORS.ink}
              strokeWidth="3.5"
            />
            <circle cx="350" cy="190" r="18" fill={FILM_COLORS.coral} />
            <text x="350" y="195" textAnchor="middle" fill={FILM_COLORS.stickerWhite} fontSize="12" fontWeight="bold">
              KẾT QUẢ
            </text>

            <text
              x="240"
              y="285"
              textAnchor="middle"
              fill={FILM_COLORS.ink}
              fontSize="20"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Mạch lạc &amp; Rõ ràng
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// 7. Hand-Drawn Window with Outdoor Day / Night / Sunrise View
export const HandDrawnWindow: React.FC<{
  timeOfDay?: "day" | "sunset" | "night" | "morning";
  scale?: number;
  style?: React.CSSProperties;
}> = ({ timeOfDay = "night", scale = 1, style }) => {
  let skyFill = "#161B26";
  let hasMoon = false;
  let hasSun = false;
  let sunColor = FILM_COLORS.warmYellow;

  if (timeOfDay === "night") {
    skyFill = "#1A1E29";
    hasMoon = true;
  } else if (timeOfDay === "sunset") {
    skyFill = "linear-gradient(180deg, #6B4C66 0%, #E67E67 50%, #F2C14E 100%)";
    hasSun = true;
    sunColor = "#F2C14E";
  } else if (timeOfDay === "morning") {
    skyFill = "linear-gradient(180deg, #87B2D6 0%, #FBE7C6 100%)";
    hasSun = true;
    sunColor = "#FFF275";
  } else {
    skyFill = "#7CB3D9";
    hasSun = true;
  }

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      <svg width="220" height="260" viewBox="0 0 220 260" fill="none">
        {/* Outer Frame with sticker outline */}
        <rect
          x="10"
          y="10"
          width="200"
          height="240"
          rx="6"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="5"
        />

        {/* Sky pane */}
        <rect
          x="20"
          y="20"
          width="180"
          height="220"
          rx="4"
          fill={skyFill.startsWith("linear") ? "#2B354F" : skyFill}
        />

        {/* Stars or Sun / Moon */}
        {hasMoon && (
          <>
            <circle cx="150" cy="55" r="18" fill="#F8F2D8" />
            <circle cx="158" cy="51" r="16" fill="#1A1E29" />
            {/* Small twinkling stars */}
            <circle cx="50" cy="45" r="2.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="95" cy="70" r="2" fill="#FFFFFF" opacity="0.7" />
            <circle cx="65" cy="110" r="1.5" fill="#FFFFFF" opacity="0.6" />
          </>
        )}

        {hasSun && (
          <circle cx="140" cy="80" r="24" fill={sunColor} />
        )}

        {/* Window Pane Grid Cross */}
        <line x1="110" y1="20" x2="110" y2="240" stroke={FILM_COLORS.stickerWhite} strokeWidth="6" />
        <line x1="110" y1="20" x2="110" y2="240" stroke={FILM_COLORS.ink} strokeWidth="3" />
        <line x1="20" y1="120" x2="200" y2="120" stroke={FILM_COLORS.stickerWhite} strokeWidth="6" />
        <line x1="20" y1="120" x2="200" y2="120" stroke={FILM_COLORS.ink} strokeWidth="3" />

        {/* Window Sill */}
        <rect
          x="4"
          y="242"
          width="212"
          height="14"
          rx="3"
          fill={FILM_COLORS.stickerWhite}
          stroke={FILM_COLORS.ink}
          strokeWidth="3.5"
        />
        <rect x="8" y="244" width="204" height="10" rx="2" fill="#D5C5AF" />
      </svg>
    </div>
  );
};

// 8. Hand-Drawn Warning / Notification Card (For Act 5 Hallucination / Problem)
export const AlertBadge: React.FC<{
  title: string;
  subtitle?: string;
  type?: "warning" | "error" | "question";
  scale?: number;
  style?: React.CSSProperties;
}> = ({ title, subtitle, type = "warning", scale = 1, style }) => {
  const badgeColor =
    type === "error"
      ? FILM_COLORS.coral
      : type === "warning"
      ? FILM_COLORS.warmYellow
      : FILM_COLORS.mutedBlue;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: FILM_COLORS.stickerWhite,
          border: `4px solid ${FILM_COLORS.ink}`,
          borderRadius: 20,
          padding: "16px 28px",
          boxShadow: `0 10px 24px ${FILM_COLORS.stickerShadow}`,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: badgeColor,
            border: `3px solid ${FILM_COLORS.ink}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 900,
            color: FILM_COLORS.ink,
            flexShrink: 0,
          }}
        >
          {type === "error" ? "!" : type === "warning" ? "⚠" : "?"}
        </div>
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: FILM_COLORS.ink,
              fontFamily: "sans-serif",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: FILM_COLORS.inkSubtle,
                fontFamily: "sans-serif",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
