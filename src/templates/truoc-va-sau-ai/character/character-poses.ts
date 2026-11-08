import { CharacterPoseDefinition } from "./character-spec";

export type SemanticPoseName =
  | "standing"
  | "sitting"
  | "sittingAtDesk"
  | "typing"
  | "writing"
  | "walking"
  | "thinking"
  | "surprised"
  | "frustrated"
  | "relaxed";

export const CANONICAL_POSES: Record<SemanticPoseName, CharacterPoseDefinition> = {
  // 1. Standing relaxed
  standing: {
    name: "standing",
    view: "side",
    torsoTilt: 0,
    torsoOffsetY: 0,
    headTilt: 0,
    // Straight down legs
    leftLeg: { angle1: 90, angle2: 0 },
    rightLeg: { angle1: 88, angle2: 2 },
    // Arms resting at sides
    leftArm: { angle1: 85, angle2: 10 },
    rightArm: { angle1: 80, angle2: 12 },
  },

  // 2. Sitting neutral (on chair, no desk)
  sitting: {
    name: "sitting",
    view: "side",
    torsoTilt: -3, // Slight natural recline
    torsoOffsetY: 0,
    headTilt: 0,
    // Thighs horizontal forward, shins straight down
    leftLeg: { angle1: 0, angle2: 90 },
    rightLeg: { angle1: 2, angle2: 88 },
    // Hands resting on lap
    leftArm: { angle1: 55, angle2: 50 },
    rightArm: { angle1: 50, angle2: 55 },
  },

  // 3. Sitting at desk (ready, hands resting near desk surface)
  sittingAtDesk: {
    name: "sittingAtDesk",
    view: "side",
    torsoTilt: 4, // Slight forward attention
    torsoOffsetY: 0,
    headTilt: 4,
    leftLeg: { angle1: 0, angle2: 90 },
    rightLeg: { angle1: 2, angle2: 88 },
    leftArm: { angle1: 42, angle2: 45 },
    rightArm: { angle1: 38, angle2: 48 },
  },

  // 4. Typing on laptop keyboard
  typing: {
    name: "typing",
    view: "side",
    torsoTilt: 6, // Leaning in slightly toward screen
    torsoOffsetY: 0,
    headTilt: 8, // Looking at screen
    leftLeg: { angle1: 0, angle2: 90 },
    rightLeg: { angle1: 2, angle2: 88 },
    // Forearms reaching keyboard horizontally
    leftArm: { angle1: 45, angle2: 52 },
    rightArm: { angle1: 40, angle2: 58 },
  },

  // 5. Writing in notebook with pen
  writing: {
    name: "writing",
    view: "side",
    torsoTilt: 12, // Leaning down toward paper
    torsoOffsetY: 4,
    headTilt: 18, // Head down focused on notebook
    leftLeg: { angle1: 0, angle2: 90 },
    rightLeg: { angle1: 2, angle2: 88 },
    // Left hand stabilizing notebook, right hand holding pen
    leftArm: { angle1: 50, angle2: 40 },
    rightArm: { angle1: 55, angle2: 60 },
  },

  // 6. Walking cycle reference
  walking: {
    name: "walking",
    view: "side",
    torsoTilt: 3,
    torsoOffsetY: -4,
    headTilt: -2,
    leftLeg: { angle1: 70, angle2: 25 },
    rightLeg: { angle1: 110, angle2: 15 },
    leftArm: { angle1: 115, angle2: 20 },
    rightArm: { angle1: 65, angle2: 25 },
  },

  // 7. Thinking / Propping chin
  thinking: {
    name: "thinking",
    view: "side",
    torsoTilt: 2,
    torsoOffsetY: 0,
    headTilt: -6, // Head tilted slightly up or thoughtfully
    leftLeg: { angle1: 0, angle2: 90 },
    rightLeg: { angle1: 2, angle2: 88 },
    // Left arm resting on desk, right arm elbow on desk, hand propping chin
    leftArm: { angle1: 45, angle2: 45 },
    rightArm: { angle1: 42, angle2: -75 },
  },

  // 8. Surprised (jerked back, hands up)
  surprised: {
    name: "surprised",
    view: "side",
    torsoTilt: -12, // Jerked backward
    torsoOffsetY: -6,
    headTilt: -14,
    leftLeg: { angle1: -5, angle2: 95 },
    rightLeg: { angle1: 0, angle2: 90 },
    // Hands pulled back in surprise
    leftArm: { angle1: 10, angle2: 80 },
    rightArm: { angle1: 5, angle2: 85 },
  },

  // 9. Frustrated (slumped forward, head down)
  frustrated: {
    name: "frustrated",
    view: "side",
    torsoTilt: 20, // Heavily slumped forward
    torsoOffsetY: 8,
    headTilt: 25, // Head hanging down
    leftLeg: { angle1: 0, angle2: 90 },
    rightLeg: { angle1: 3, angle2: 87 },
    // Arms drooping down or hands near head
    leftArm: { angle1: 65, angle2: 30 },
    rightArm: { angle1: 60, angle2: 35 },
  },

  // 10. Relaxed (reclined back on chair, hands resting comfortably)
  relaxed: {
    name: "relaxed",
    view: "side",
    torsoTilt: -10, // Leaning back on chair backrest
    torsoOffsetY: 2,
    headTilt: -5,
    leftLeg: { angle1: 5, angle2: 80 },
    rightLeg: { angle1: 8, angle2: 78 },
    leftArm: { angle1: 35, angle2: 50 },
    rightArm: { angle1: 30, angle2: 55 },
  },
};

/**
 * Interpolate between two semantic poses smoothly
 */
export function interpolatePose(
  poseA: CharacterPoseDefinition,
  poseB: CharacterPoseDefinition,
  t: number
): CharacterPoseDefinition {
  const clampT = Math.max(0, Math.min(1, t));
  const lerp = (a: number, b: number) => a + (b - a) * clampT;

  return {
    name: `${poseA.name}_to_${poseB.name}`,
    view: poseA.view,
    torsoTilt: lerp(poseA.torsoTilt, poseB.torsoTilt),
    torsoOffsetY: lerp(poseA.torsoOffsetY, poseB.torsoOffsetY),
    headTilt: lerp(poseA.headTilt, poseB.headTilt),
    headOffsetX: lerp(poseA.headOffsetX ?? 0, poseB.headOffsetX ?? 0),
    headOffsetY: lerp(poseA.headOffsetY ?? 0, poseB.headOffsetY ?? 0),
    leftLeg: {
      angle1: lerp(poseA.leftLeg.angle1, poseB.leftLeg.angle1),
      angle2: lerp(poseA.leftLeg.angle2, poseB.leftLeg.angle2),
    },
    rightLeg: {
      angle1: lerp(poseA.rightLeg.angle1, poseB.rightLeg.angle1),
      angle2: lerp(poseA.rightLeg.angle2, poseB.rightLeg.angle2),
    },
    leftArm: {
      angle1: lerp(poseA.leftArm.angle1, poseB.leftArm.angle1),
      angle2: lerp(poseA.leftArm.angle2, poseB.leftArm.angle2),
    },
    rightArm: {
      angle1: lerp(poseA.rightArm.angle1, poseB.rightArm.angle1),
      angle2: lerp(poseA.rightArm.angle2, poseB.rightArm.angle2),
    },
  };
}
