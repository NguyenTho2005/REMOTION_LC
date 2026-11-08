import React from "react";
import { useCurrentFrame } from "remotion";
import { PALETTE } from "../constants";

export const DoodleDefs: React.FC = () => {
  const frame = useCurrentFrame();
  // Line boil changes every 3 frames for authentic 10fps hand-drawn animation feeling
  const boilSeed = Math.floor(frame / 3) % 20;

  return (
    <>
      {/* Web Fonts for Hand-drawn Typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Caveat:wght@700&display=swap');
      `}</style>
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
      <defs>
        {/* Dynamic line wobble / boil filter */}
        <filter id="doodle-wobble" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves={3}
            seed={boilSeed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={3.2}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Stronger wobbly filter for rough scribbles & crayon */}
        <filter id="rough-crayon" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.06"
            numOctaves={4}
            seed={boilSeed + 5}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={5.5}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Paper texture noise filter */}
        <filter id="paper-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={4}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.1
                    0 0 0 0 0.1
                    0 0 0 0 0.1
                    0 0 0 0.035 0"
          />
        </filter>

        {/* Arrow markers */}
        <marker
          id="doodle-arrowhead"
          markerWidth="16"
          markerHeight="16"
          refX="14"
          refY="8"
          orient="auto"
        >
          <path
            d="M 2 2 L 14 8 L 2 14 Q 5 8 2 2"
            fill={PALETTE.charcoal}
            stroke={PALETTE.charcoal}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </marker>

        <marker
          id="doodle-arrowhead-coral"
          markerWidth="16"
          markerHeight="16"
          refX="14"
          refY="8"
          orient="auto"
        >
          <path
            d="M 2 2 L 14 8 L 2 14 Q 5 8 2 2"
            fill={PALETTE.coralRed}
            stroke={PALETTE.coralRed}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </marker>

        {/* Dot grid pattern for sketchbook page */}
        <pattern
          id="sketch-dot-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1.2" fill={PALETTE.charcoal} opacity="0.08" />
        </pattern>
      </defs>
    </svg>
    </>
  );
};
