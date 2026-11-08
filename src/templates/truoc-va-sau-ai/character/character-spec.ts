/**
 * TRƯỚC VÀ SAU AI — Canonical Character Specification Lock (MINH)
 * Proportions Version: v2-rigged
 */

export const MINH_CHARACTER = {
  version: "v2-rigged",
  name: "Minh",
  age: "27",
  
  // Official Visual Palette
  palette: {
    skin: "#FDEED9",
    skinShadow: "#F0D7BB",
    hair: "#222024",
    shirt: "#6D9DC5",
    shirtShadow: "#5682A6",
    shirtCollar: "#FFFFFF",
    pants: "#242424",
    pantsShadow: "#181818",
    shoes: "#1A191D",
    shoesSole: "#ECE4D4",
    outline: "#242424",
    eyes: "#242424",
    eyebrows: "#222024",
    mouth: "#242424",
    blush: "rgba(230, 126, 103, 0.25)",
  },

  // Line weight and aesthetic
  strokeWidth: {
    outer: 4.5,
    inner: 2.5,
    fine: 1.8,
  },

  // Canonical Proportions (in Character Local Coordinate Space, where Pelvis is (0, 0))
  proportions: {
    totalHeight: 320,
    
    // Head & Neck
    headRadius: 36,
    headCenterY: -150, // Relative to pelvis (0, 0)
    neckTopY: -115,
    neckBottomY: -100,
    neckWidth: 16,

    // Torso
    torsoTopY: -100,
    torsoBottomY: 0,
    shoulderWidth: 64,
    waistWidth: 50,
    pelvisWidth: 52,

    // Arms
    shoulderOffset: { x: 26, y: -90 }, // Distance from torso center
    upperArmLength: 52,
    forearmLength: 48,
    armWidth: 16,
    handRadius: 10,

    // Legs
    hipOffset: { x: 14, y: 0 },
    thighLength: 68,
    shinLength: 68,
    legWidth: 20,
    footLength: 32,
    footHeight: 14,
  },
} as const;

export type JointAngle = number; // in degrees

export interface LimbChain {
  angle1: number; // Upper limb angle relative to parent (degrees)
  angle2: number; // Lower limb angle relative to upper limb (degrees)
}

export interface CharacterPoseDefinition {
  name: string;
  view: "side" | "threeQuarter" | "front";
  torsoTilt: number; // degrees, positive tilts forward
  torsoOffsetY: number; // vertical breathing or crouching offset
  headTilt: number; // degrees
  headOffsetX?: number;
  headOffsetY?: number;

  leftArm: LimbChain;
  rightArm: LimbChain;

  leftLeg: LimbChain;
  rightLeg: LimbChain;

  // Interaction targets
  handsTarget?: { left: { x: number; y: number }; right: { x: number; y: number } };
}
