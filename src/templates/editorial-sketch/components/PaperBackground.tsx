import React from "react";
import { useCurrentFrame } from "remotion";

interface PaperBackgroundProps {
  showSafeMargin?: boolean;
}

export const PaperBackground: React.FC<PaperBackgroundProps> = ({
  showSafeMargin = false,
}) => {
  const frame = useCurrentFrame();

  // Subtle hand-drawn jitter for borders (updates every 6 frames)
  const jitterPhase = Math.floor(frame / 6);
  const borderJitterX = (Math.sin(jitterPhase * 1.7) * 1.2).toFixed(2);
  const borderJitterY = (Math.cos(jitterPhase * 2.3) * 1.2).toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        backgroundColor: "#F4F1EA", // Warm cream paper
        overflow: "hidden",
        zIndex: 0,
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Google Fonts Preload / Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Caveat:wght@600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap');
      `}</style>

      {/* SVG Filters for Paper Grain & Line Boil */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* Subtle Paper Texture Noise */}
          <filter id="paper-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.12   0 0 0 0 0.12   0 0 0 0 0.11   0 0 0 0.04 0"
            />
          </filter>

          {/* Hand-Drawn Sketch Boil Filter */}
          <filter id="sketch-boil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="2"
              seed={jitterPhase % 100}
              result="boilNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="boilNoise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Dot Grid Pattern */}
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1.5" fill="#1E1E1C" fillOpacity="0.07" />
          </pattern>

          {/* Graph Paper Pattern */}
          <pattern
            id="graph-paper"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="#1E1E1C"
              strokeWidth="0.8"
              strokeOpacity="0.05"
            />
          </pattern>
        </defs>
      </svg>

      {/* Layer 1: Dot Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#1E1E1C 1.2px, transparent 1.2px)",
          backgroundSize: "36px 36px",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      {/* Layer 2: Graph paper subtle lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <rect width="100%" height="100%" fill="url(#graph-paper)" />
      </svg>

      {/* Layer 3: Paper Grain Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "url(#paper-noise)",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />

      {/* Layer 4: Editorial Corner Registration Marks & Hand-Drawn Frame */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: 1080,
          height: 1920,
          pointerEvents: "none",
        }}
      >
        {/* Subtle Hand-Drawn Outer Border */}
        <rect
          x={40 + parseFloat(borderJitterX)}
          y={40 + parseFloat(borderJitterY)}
          width={1000}
          height={1840}
          fill="none"
          stroke="#1E1E1C"
          strokeWidth="1.8"
          strokeOpacity="0.25"
          strokeDasharray="16 8 8 8"
        />

        {/* Editorial Crosshair Registration Marks */}
        <g stroke="#1E1E1C" strokeWidth="1.5" strokeOpacity="0.4">
          {/* Top Left */}
          <line x1="28" y1="40" x2="52" y2="40" />
          <line x1="40" y1="28" x2="40" y2="52" />
          {/* Top Right */}
          <line x1="1028" y1="40" x2="1052" y2="40" />
          <line x1="1040" y1="28" x2="1040" y2="52" />
          {/* Bottom Left */}
          <line x1="28" y1="1880" x2="52" y2="1880" />
          <line x1="40" y1="1868" x2="40" y2="1892" />
          {/* Bottom Right */}
          <line x1="1028" y1="1880" x2="1052" y2="1880" />
          <line x1="1040" y1="1868" x2="1040" y2="1892" />
        </g>
      </svg>

      {/* Layer 5: TikTok Safe Zone Markers (Only when debug/preview enabled) */}
      {showSafeMargin && (
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 50,
            right: 120,
            bottom: 280,
            border: "1px dashed rgba(217, 78, 52, 0.4)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              color: "#D94E34",
            }}
          >
            Safe Area 800×1400 (TikTok 9:16)
          </span>
        </div>
      )}
    </div>
  );
};
