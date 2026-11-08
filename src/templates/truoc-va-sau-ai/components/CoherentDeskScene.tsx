import React from "react";
import { FILM_COLORS } from "../design-tokens";
import { MinhCharacter, MinhExpression } from "../character/MinhCharacter";
import { SemanticPoseName } from "../character/character-poses";
import { LaptopProp, CoffeeCup, StackOfBooks } from "./HandDrawnProps";

export interface CoherentDeskSceneProps {
  pose?: SemanticPoseName;
  expression?: MinhExpression;
  laptopContent?: "tabs" | "code" | "chat" | "blank";
  isLaptopOpen?: boolean;
  showBooks?: boolean;
  showCoffee?: boolean;
  coffeeSteam?: boolean;
  customTorsoTilt?: number;
  children?: React.ReactNode;
}

export const SCENE_ANCHORS = {
  floorY: 860,
  desk: {
    topY: 620,
    surfaceThickness: 28,
    leftX: 380,
    width: 1240,
    legWidth: 26,
  },
  chair: {
    seatX: 680,
    seatY: 680, // 60px below desk surface
    width: 140,
    backrestTopX: 600,
    backrestTopY: 460,
  },
  character: {
    pelvisX: 680,
    pelvisY: 680, // Anchored directly to chair seat
    scale: 1.25,
  },
  laptop: {
    x: 880,
    y: 620, // Rests on desk surface
    scale: 1.25,
  },
  coffee: {
    x: 520,
    y: 620,
    scale: 1.05,
  },
  books: {
    x: 410,
    y: 620,
    scale: 1.1,
  },
} as const;

export const CoherentDeskScene: React.FC<CoherentDeskSceneProps> = ({
  pose = "typing",
  expression = "neutral",
  laptopContent = "code",
  isLaptopOpen = true,
  showBooks = true,
  showCoffee = true,
  coffeeSteam = true,
  customTorsoTilt,
  children,
}) => {
  const { floorY, desk, chair, character, laptop, coffee, books } = SCENE_ANCHORS;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      {/* ========================================================
          LAYER 1: BACKGROUND FLOOR CONTACT LINE
          ======================================================== */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
        }}
      >
        <line
          x1={100}
          y1={floorY}
          x2={1820}
          y2={floorY}
          stroke={FILM_COLORS.inkSubtle}
          strokeWidth={3}
          strokeDasharray="24 14"
        />
      </svg>

      {/* ========================================================
          LAYER 2: CHAIR BACKREST (BEHIND CHARACTER)
          ======================================================== */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
        }}
      >
        {/* Chair Back Support Spine */}
        <path
          d={`M ${chair.seatX - 50} ${chair.seatY} 
             Q ${chair.backrestTopX - 10} ${(chair.seatY + chair.backrestTopY) / 2}, ${chair.backrestTopX} ${chair.backrestTopY}`}
          stroke={FILM_COLORS.ink}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
        />
        {/* Chair Cushion Backrest */}
        <path
          d={`M ${chair.backrestTopX - 18} ${chair.backrestTopY} 
             L ${chair.backrestTopX + 16} ${chair.backrestTopY}
             L ${chair.backrestTopX + 8} ${chair.seatY - 30}
             L ${chair.backrestTopX - 22} ${chair.seatY - 30}
             Z`}
          fill="#4A5262"
          stroke={FILM_COLORS.ink}
          strokeWidth={4.5}
          strokeLinejoin="round"
        />
        {/* Wooden / Fabric accent on backrest */}
        <line
          x1={chair.backrestTopX - 4}
          y1={chair.backrestTopY + 20}
          x2={chair.backrestTopX - 8}
          y2={chair.seatY - 50}
          stroke="#697589"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>

      {/* ========================================================
          LAYER 3: CHARACTER LOWER BODY (LEGS & PELVIS)
          Sitting firmly on the chair seat
          ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: character.pelvisX,
          top: character.pelvisY,
          pointerEvents: "none",
        }}
      >
        <MinhCharacter
          pose={pose}
          expression={expression}
          scale={character.scale}
          customTorsoTilt={customTorsoTilt}
          layerMode="lowerBody"
        />
      </div>

      {/* ========================================================
          LAYER 4: CHAIR SEAT CUSHION & BASE LEGS
          ======================================================== */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
        }}
      >
        {/* Chair Seat Cushion */}
        <rect
          x={chair.seatX - 70}
          y={chair.seatY - 8}
          width={chair.width}
          height={22}
          rx={6}
          fill="#3F4654"
          stroke={FILM_COLORS.ink}
          strokeWidth={4.5}
        />
        {/* Chair Central Column */}
        <rect
          x={chair.seatX - 8}
          y={chair.seatY + 14}
          width={16}
          height={floorY - chair.seatY - 26}
          fill="#2C323D"
          stroke={FILM_COLORS.ink}
          strokeWidth={3.5}
        />
        {/* Chair Base Feet / Wheels */}
        <line
          x1={chair.seatX - 55}
          y1={floorY - 6}
          x2={chair.seatX + 55}
          y2={floorY - 6}
          stroke={FILM_COLORS.ink}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={chair.seatX - 50} cy={floorY - 4} r={5} fill="#1E2026" stroke={FILM_COLORS.ink} strokeWidth={2.5} />
        <circle cx={chair.seatX + 50} cy={floorY - 4} r={5} fill="#1E2026" stroke={FILM_COLORS.ink} strokeWidth={2.5} />
      </svg>

      {/* ========================================================
          LAYER 5: CHARACTER TORSO & HEAD
          ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: character.pelvisX,
          top: character.pelvisY,
          pointerEvents: "none",
        }}
      >
        <MinhCharacter
          pose={pose}
          expression={expression}
          scale={character.scale}
          customTorsoTilt={customTorsoTilt}
          layerMode="noArms"
        />
      </div>

      {/* ========================================================
          LAYER 6: DESK REAR STRUCTURE (Legs & Modesty Backboard)
          ======================================================== */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
        }}
      >
        {/* Left Leg */}
        <rect
          x={desk.leftX + 24}
          y={desk.topY + desk.surfaceThickness}
          width={desk.legWidth}
          height={floorY - desk.topY - desk.surfaceThickness}
          rx={4}
          fill="#B5A492"
          stroke={FILM_COLORS.ink}
          strokeWidth={4}
        />
        {/* Right Leg */}
        <rect
          x={desk.leftX + desk.width - 50}
          y={desk.topY + desk.surfaceThickness}
          width={desk.legWidth}
          height={floorY - desk.topY - desk.surfaceThickness}
          rx={4}
          fill="#B5A492"
          stroke={FILM_COLORS.ink}
          strokeWidth={4}
        />
        {/* Modesty Panel (recessed backboard) */}
        <rect
          x={desk.leftX + 56}
          y={desk.topY + desk.surfaceThickness + 12}
          width={desk.width - 116}
          height={110}
          rx={2}
          fill="#C4B5A3"
          stroke={FILM_COLORS.ink}
          strokeWidth={3}
          opacity={0.85}
        />
      </svg>

      {/* ========================================================
          LAYER 7: CHARACTER ARMS & HANDS
          Natural depth-aware arm movement interacting with desk/keyboard
          ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: character.pelvisX,
          top: character.pelvisY,
          pointerEvents: "none",
        }}
      >
        <MinhCharacter
          pose={pose}
          expression={expression}
          scale={character.scale}
          customTorsoTilt={customTorsoTilt}
          layerMode="armsOnly"
        />
      </div>

      {/* ========================================================
          LAYER 8: DESK SURFACE & FOREGROUND EDGE
          (Partially occludes thighs below Y=620)
          ======================================================== */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
        }}
      >
        {/* Solid Desk Top Surface */}
        <rect
          x={desk.leftX}
          y={desk.topY}
          width={desk.width}
          height={desk.surfaceThickness}
          rx={6}
          fill="#D6C7B2"
          stroke={FILM_COLORS.ink}
          strokeWidth={4.5}
        />
        {/* Subtle Hand-Drawn Woodgrain Highlights */}
        <path
          d={`M ${desk.leftX + 40} ${desk.topY + 12} Q ${desk.leftX + 300} ${desk.topY + 10}, ${desk.leftX + 600} ${desk.topY + 12}
             M ${desk.leftX + 700} ${desk.topY + 14} Q ${desk.leftX + 950} ${desk.topY + 13}, ${desk.leftX + 1180} ${desk.topY + 14}`}
          stroke={FILM_COLORS.inkSubtle}
          strokeWidth={1.5}
          opacity={0.35}
          fill="none"
        />
        {/* Edge bevel highlight */}
        <line
          x1={desk.leftX + 4}
          y1={desk.topY + 3}
          x2={desk.leftX + desk.width - 4}
          y2={desk.topY + 3}
          stroke="#EAE0D2"
          strokeWidth={2}
        />
      </svg>

      {/* ========================================================
          LAYER 9: LAPTOP & KEYBOARD (Rests on Desk Surface)
          ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: laptop.x,
          top: laptop.y - 128, // Sits directly on desk surface Y=620
          pointerEvents: "none",
        }}
      >
        <LaptopProp
          isOpen={isLaptopOpen}
          screenContent={laptopContent}
          scale={laptop.scale}
        />
      </div>

      {/* ========================================================
          LAYER 10: FOREGROUND PROPS (Books, Coffee Cup)
          ======================================================== */}
      {showBooks && (
        <div
          style={{
            position: "absolute",
            left: books.x,
            top: books.y - 110,
            pointerEvents: "none",
          }}
        >
          <StackOfBooks count={3} scale={books.scale} />
        </div>
      )}

      {showCoffee && (
        <div
          style={{
            position: "absolute",
            left: coffee.x,
            top: coffee.y - 105,
            pointerEvents: "none",
          }}
        >
          <CoffeeCup scale={coffee.scale} steam={coffeeSteam} />
        </div>
      )}

      {/* ========================================================
          LAYER 11: FOREGROUND CUSTOM CHILDREN (Popups, Overlays)
          ======================================================== */}
      {children}
    </div>
  );
};
