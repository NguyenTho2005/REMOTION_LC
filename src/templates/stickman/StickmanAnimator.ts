export type StickmanPose =
  | "idle"
  | "talking"
  | "walking"
  | "running"
  | "thinking"
  | "pointing"
  | "waving"
  | "sitting"
  | "typing"
  | "celebrating"
  | "confused"
  | "surprised"
  | "presenting"
  | "holding_object"
  | "exhausted";

export interface JointAngles {
  // Head
  headTilt: number; // degrees
  headY: number; // vertical bounce
  mouthOpen: number; // 0 to 1
  eyeBlink: boolean;

  // Torso
  torsoAngle: number; // degrees
  torsoY: number; // vertical bobbing

  // Arms (angles relative to vertical down, in degrees)
  leftShoulder: number;
  leftElbow: number;
  rightShoulder: number;
  rightElbow: number;

  // Legs (angles relative to vertical down, in degrees)
  leftHip: number;
  leftKnee: number;
  rightHip: number;
  rightKnee: number;
}

/**
 * Calculates deterministic frame-based joint angles for stickman poses.
 */
export function calculateStickmanJoints(
  frame: number,
  fps: number,
  pose: StickmanPose
): JointAngles {
  // Common idle breathing cycle (subtle 2s period)
  const breathCycle = Math.sin((frame / fps) * Math.PI);
  const blinkCycle = frame % 90 > 84; // blinks every 3 seconds for 6 frames

  switch (pose) {
    case "walking": {
      // 0.6s per complete 2-step cycle
      const cycle = ((frame % (fps * 0.8)) / (fps * 0.8)) * Math.PI * 2;
      const legSwing = Math.sin(cycle) * 32;
      const armSwing = Math.sin(cycle) * 28;
      const bounce = Math.abs(Math.sin(cycle)) * 8;

      return {
        headTilt: Math.sin(cycle) * 3,
        headY: -bounce * 0.4,
        mouthOpen: 0,
        eyeBlink: blinkCycle,

        torsoAngle: 4,
        torsoY: -bounce,

        leftShoulder: armSwing,
        leftElbow: armSwing > 0 ? armSwing * 0.6 : 10,
        rightShoulder: -armSwing,
        rightElbow: -armSwing > 0 ? -armSwing * 0.6 : 10,

        leftHip: legSwing,
        leftKnee: legSwing < 0 ? -legSwing * 0.9 : 5,
        rightHip: -legSwing,
        rightKnee: -legSwing < 0 ? legSwing * 0.9 : 5,
      };
    }

    case "talking": {
      // Mouth flap frequency ~4 times per second
      const mouthFlap = (Math.sin((frame / fps) * Math.PI * 8) + 1) / 2;
      const handGesture = Math.sin((frame / fps) * Math.PI * 2.5) * 15;
      const headNod = Math.sin((frame / fps) * Math.PI * 3) * 4;

      return {
        headTilt: headNod,
        headY: breathCycle * 1.5,
        mouthOpen: mouthFlap > 0.3 ? 0.7 : 0.1,
        eyeBlink: blinkCycle,

        torsoAngle: 0,
        torsoY: breathCycle * 1.5,

        leftShoulder: 25 + handGesture,
        leftElbow: 45 + handGesture * 0.5,
        rightShoulder: -15,
        rightElbow: 20,

        leftHip: 8,
        leftKnee: 0,
        rightHip: -8,
        rightKnee: 0,
      };
    }

    case "typing": {
      const handAlternation = Math.sin((frame / fps) * Math.PI * 14) * 8;
      return {
        headTilt: 16, // looking down at laptop
        headY: 0,
        mouthOpen: 0,
        eyeBlink: blinkCycle,

        torsoAngle: 12, // leaning forward
        torsoY: 0,

        leftShoulder: 55 + handAlternation,
        leftElbow: 75 - handAlternation,
        rightShoulder: 55 - handAlternation,
        rightElbow: 75 + handAlternation,

        leftHip: 85, // sitting
        leftKnee: 90,
        rightHip: 85,
        rightKnee: 90,
      };
    }

    case "sitting": {
      return {
        headTilt: 4,
        headY: breathCycle,
        mouthOpen: 0,
        eyeBlink: blinkCycle,

        torsoAngle: 2,
        torsoY: 0,

        leftShoulder: 20,
        leftElbow: 30,
        rightShoulder: 20,
        rightElbow: 30,

        leftHip: 85,
        leftKnee: 90,
        rightHip: 85,
        rightKnee: 90,
      };
    }

    case "exhausted": {
      const deepSigh = Math.sin((frame / fps) * Math.PI * 1.2) * 5;
      return {
        headTilt: 35, // head down on desk
        headY: 10 + deepSigh,
        mouthOpen: 0,
        eyeBlink: true, // eyes closed

        torsoAngle: 30, // slouched far forward
        torsoY: 5,

        leftShoulder: 70,
        leftElbow: 85,
        rightShoulder: 70,
        rightElbow: 85,

        leftHip: 85,
        leftKnee: 90,
        rightHip: 85,
        rightKnee: 90,
      };
    }

    case "pointing": {
      const armPulse = Math.sin((frame / fps) * Math.PI * 4) * 4;
      return {
        headTilt: -6,
        headY: breathCycle,
        mouthOpen: 0.4,
        eyeBlink: blinkCycle,

        torsoAngle: -4,
        torsoY: 0,

        leftShoulder: -75 + armPulse, // extended pointing arm
        leftElbow: 5,
        rightShoulder: 20,
        rightElbow: 40,

        leftHip: -6,
        leftKnee: 0,
        rightHip: 12,
        rightKnee: 5,
      };
    }

    case "waving": {
      const wave = Math.sin((frame / fps) * Math.PI * 8) * 22;
      return {
        headTilt: 5,
        headY: breathCycle * 2,
        mouthOpen: 0.5,
        eyeBlink: blinkCycle,

        torsoAngle: 0,
        torsoY: 0,

        leftShoulder: -140, // arm raised high
        leftElbow: wave,
        rightShoulder: 15,
        rightElbow: 20,

        leftHip: -8,
        leftKnee: 0,
        rightHip: 8,
        rightKnee: 0,
      };
    }

    case "thinking": {
      return {
        headTilt: -15, // head tilted in deep thought
        headY: breathCycle,
        mouthOpen: 0,
        eyeBlink: blinkCycle,

        torsoAngle: -3,
        torsoY: 0,

        leftShoulder: 65, // hand on chin
        leftElbow: 125,
        rightShoulder: 40, // arm crossed under
        rightElbow: 80,

        leftHip: 6,
        leftKnee: 4,
        rightHip: -6,
        rightKnee: 0,
      };
    }

    case "celebrating": {
      const jump = Math.abs(Math.sin((frame / fps) * Math.PI * 4)) * 18;
      const armWave = Math.sin((frame / fps) * Math.PI * 6) * 12;
      return {
        headTilt: -8,
        headY: -jump,
        mouthOpen: 0.8, // wide smile / cheer
        eyeBlink: false,

        torsoAngle: 0,
        torsoY: -jump,

        leftShoulder: -135 + armWave,
        leftElbow: 20,
        rightShoulder: 135 - armWave,
        rightElbow: 20,

        leftHip: jump > 5 ? 20 : 10,
        leftKnee: jump > 5 ? 40 : 0,
        rightHip: jump > 5 ? -20 : -10,
        rightKnee: jump > 5 ? 40 : 0,
      };
    }

    case "confused": {
      const shrug = Math.sin((frame / fps) * Math.PI * 2) * 5;
      return {
        headTilt: 14 + shrug,
        headY: -shrug,
        mouthOpen: 0.2,
        eyeBlink: blinkCycle,

        torsoAngle: 0,
        torsoY: 0,

        leftShoulder: 45, // shrugging hands outward
        leftElbow: 65,
        rightShoulder: -45,
        rightElbow: -65,

        leftHip: 12,
        leftKnee: 5,
        rightHip: -12,
        rightKnee: 5,
      };
    }

    case "surprised": {
      return {
        headTilt: -10,
        headY: -8,
        mouthOpen: 0.9, // gasp
        eyeBlink: false,

        torsoAngle: -8, // jumping back slightly
        torsoY: -5,

        leftShoulder: 60,
        leftElbow: 90,
        rightShoulder: -60,
        rightElbow: -90,

        leftHip: 15,
        leftKnee: 20,
        rightHip: -15,
        rightKnee: 20,
      };
    }

    case "presenting": {
      const sweep = Math.sin((frame / fps) * Math.PI * 2) * 12;
      return {
        headTilt: 5,
        headY: breathCycle,
        mouthOpen: 0.4,
        eyeBlink: blinkCycle,

        torsoAngle: 4,
        torsoY: 0,

        leftShoulder: -65 + sweep, // open presenting hand
        leftElbow: 25,
        rightShoulder: 25,
        rightElbow: 30,

        leftHip: -10,
        leftKnee: 0,
        rightHip: 10,
        rightKnee: 0,
      };
    }

    case "holding_object": {
      return {
        headTilt: 6,
        headY: breathCycle,
        mouthOpen: 0,
        eyeBlink: blinkCycle,

        torsoAngle: 2,
        torsoY: 0,

        leftShoulder: 45,
        leftElbow: 75,
        rightShoulder: 45,
        rightElbow: 75,

        leftHip: 6,
        leftKnee: 0,
        rightHip: -6,
        rightKnee: 0,
      };
    }

    case "idle":
    default: {
      return {
        headTilt: breathCycle * 1.5,
        headY: breathCycle * 1.5,
        mouthOpen: 0,
        eyeBlink: blinkCycle,

        torsoAngle: 0,
        torsoY: breathCycle * 1.5,

        leftShoulder: 12,
        leftElbow: 15,
        rightShoulder: -12,
        rightElbow: 15,

        leftHip: 6,
        leftKnee: 0,
        rightHip: -6,
        rightKnee: 0,
      };
    }
  }
}
