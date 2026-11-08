import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MINH_CHARACTER, LimbChain } from "./character-spec";
import { CANONICAL_POSES, SemanticPoseName } from "./character-poses";

export type MinhPose = SemanticPoseName;

export type MinhExpression =
  | "neutral"
  | "happy"
  | "confused"
  | "frustrated"
  | "surprised"
  | "thoughtful"
  | "exhausted"
  | "focused";

export interface MinhCharacterProps {
  pose?: SemanticPoseName;
  expression?: MinhExpression;
  facing?: "left" | "right";
  scale?: number;
  // Specific body overrides if needed
  customTorsoTilt?: number;
  layerMode?: "full" | "lowerBody" | "upperBody" | "armsOnly" | "noArms";
  style?: React.CSSProperties;
}

export const MinhCharacter: React.FC<MinhCharacterProps> = ({
  pose = "typing",
  expression = "neutral",
  facing = "right",
  scale = 1.0,
  customTorsoTilt,
  layerMode = "full",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Retrieve canonical pose definition
  const poseDef = CANONICAL_POSES[pose] || CANONICAL_POSES.typing;

  // 1. Natural Deterministic Secondary Animation
  // Gentle breathing (slow sine wave ~0.4 Hz)
  const breathCycle = (frame / fps) * 2.5;
  const breathOffsetY = Math.sin(breathCycle) * 1.8;
  const breathChestExpand = Math.sin(breathCycle) * 0.015;

  // Natural blinking (blink every 3.5 seconds for ~4 frames)
  const blinkCycle = frame % 105;
  const isBlinking = blinkCycle >= 101 && blinkCycle <= 104;

  // Typing micro-motion for arms (when in typing pose)
  const isTyping = pose === "typing";
  const typeFreq = frame * 0.6;
  const leftTypeTwitch = isTyping ? Math.sin(typeFreq) * 2.5 : 0;
  const rightTypeTwitch = isTyping ? Math.cos(typeFreq * 1.1) * 2.5 : 0;

  // 2. Pose & Joint Configuration
  const effectiveTorsoTilt = customTorsoTilt ?? poseDef.torsoTilt;
  const torsoY = poseDef.torsoOffsetY + breathOffsetY;

  // Expression Head modifiers
  let exprHeadTilt = poseDef.headTilt;
  let eyeType: "normal" | "closed" | "wide" | "squint" = "normal";
  let mouthType: "neutral" | "smile" | "frown" | "open" | "flat" = "neutral";
  let browAngle = 0;

  if (isBlinking) {
    eyeType = "closed";
  }

  switch (expression) {
    case "happy":
      mouthType = "smile";
      browAngle = -4;
      break;
    case "confused":
      exprHeadTilt += 7;
      browAngle = 10;
      mouthType = "flat";
      break;
    case "frustrated":
      exprHeadTilt += 14;
      browAngle = 18;
      mouthType = "frown";
      eyeType = "squint";
      break;
    case "surprised":
      exprHeadTilt -= 10;
      browAngle = -12;
      eyeType = "wide";
      mouthType = "open";
      break;
    case "thoughtful":
      exprHeadTilt += 5;
      browAngle = 4;
      mouthType = "neutral";
      break;
    case "exhausted":
      exprHeadTilt += 16;
      browAngle = 6;
      mouthType = "flat";
      eyeType = "squint";
      break;
    case "focused":
      browAngle = 6;
      mouthType = "flat";
      break;
    default:
      break;
  }

  const isFacingLeft = facing === "left";
  const P = MINH_CHARACTER.palette;
  const SW = MINH_CHARACTER.strokeWidth;
  const PROP = MINH_CHARACTER.proportions;

  // -------------------------------------------------------------
  // KINEMATIC LIMB RENDERERS (PARENT-CHILD JOINT HIERARCHY)
  // -------------------------------------------------------------

  // LEG (Thigh -> Knee -> Shin -> Foot)
  const renderLeg = (leg: LimbChain, isFar: boolean) => {
    const hipX = isFar ? -4 : 8;
    const hipY = 0;
    const thighColor = isFar ? P.pantsShadow : P.pants;
    const shoeColor = isFar ? "#121114" : P.shoes;

    return (
      <g
        id={isFar ? "leftLeg-far" : "rightLeg-near"}
        transform={`translate(${hipX}, ${hipY})`}
      >
        {/* Hip Joint */}
        <circle cx={0} cy={0} r={PROP.legWidth / 2} fill={thighColor} />

        {/* Thigh (Parent) */}
        <g transform={`rotate(${leg.angle1})`}>
          {/* Thigh Stroke & Fill */}
          <line
            x1={0}
            y1={0}
            x2={PROP.thighLength}
            y2={0}
            stroke={thighColor}
            strokeWidth={PROP.legWidth}
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={0}
            x2={PROP.thighLength}
            y2={0}
            stroke={P.outline}
            strokeWidth={SW.fine}
            strokeLinecap="round"
          />

          {/* Knee Joint (Child of Thigh) */}
          <g transform={`translate(${PROP.thighLength}, 0)`}>
            <circle cx={0} cy={0} r={PROP.legWidth / 2} fill={thighColor} stroke={P.outline} strokeWidth={SW.fine} />

            {/* Shin (Child of Knee) */}
            <g transform={`rotate(${leg.angle2})`}>
              <line
                x1={0}
                y1={0}
                x2={PROP.shinLength}
                y2={0}
                stroke={thighColor}
                strokeWidth={PROP.legWidth - 2}
                strokeLinecap="round"
              />
              <line
                x1={0}
                y1={0}
                x2={PROP.shinLength}
                y2={0}
                stroke={P.outline}
                strokeWidth={SW.fine}
                strokeLinecap="round"
              />

              {/* Ankle & Foot (Child of Shin) */}
              <g transform={`translate(${PROP.shinLength}, 0)`}>
                {/* Shoe Foot pointing forward */}
                <path
                  d={`M -6 -${PROP.footHeight / 2} L ${PROP.footLength} -${PROP.footHeight / 2} Q ${PROP.footLength + 8} 0, ${PROP.footLength} ${PROP.footHeight / 2} L -6 ${PROP.footHeight / 2} Z`}
                  fill={shoeColor}
                  stroke={P.outline}
                  strokeWidth={SW.outer}
                  strokeLinejoin="round"
                />
                {/* Sole accent */}
                <line
                  x1={-4}
                  y1={PROP.footHeight / 2 - 1}
                  x2={PROP.footLength + 2}
                  y2={PROP.footHeight / 2 - 1}
                  stroke={P.shoesSole}
                  strokeWidth={2}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  };

  // ARM (Upper Arm -> Elbow -> Forearm -> Hand)
  const renderArm = (arm: LimbChain, isFar: boolean, twitch: number) => {
    const shoulderX = isFar ? -8 : 12;
    const shoulderY = PROP.shoulderOffset.y;
    const armColor = isFar ? P.shirtShadow : P.shirt;

    return (
      <g
        id={isFar ? "leftArm-far" : "rightArm-near"}
        transform={`translate(${shoulderX}, ${shoulderY})`}
      >
        {/* Shoulder Joint */}
        <circle cx={0} cy={0} r={PROP.armWidth / 2} fill={armColor} />

        {/* Upper Arm (Parent) */}
        <g transform={`rotate(${arm.angle1})`}>
          <line
            x1={0}
            y1={0}
            x2={PROP.upperArmLength}
            y2={0}
            stroke={armColor}
            strokeWidth={PROP.armWidth}
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={0}
            x2={PROP.upperArmLength}
            y2={0}
            stroke={P.outline}
            strokeWidth={SW.fine}
            strokeLinecap="round"
          />

          {/* Elbow Joint (Child of Upper Arm) */}
          <g transform={`translate(${PROP.upperArmLength}, 0)`}>
            <circle cx={0} cy={0} r={PROP.armWidth / 2} fill={armColor} />

            {/* Forearm (Child of Elbow) */}
            <g transform={`rotate(${arm.angle2 + twitch})`}>
              <line
                x1={0}
                y1={0}
                x2={PROP.forearmLength}
                y2={0}
                stroke={armColor}
                strokeWidth={PROP.armWidth - 2}
                strokeLinecap="round"
              />
              <line
                x1={0}
                y1={0}
                x2={PROP.forearmLength}
                y2={0}
                stroke={P.outline}
                strokeWidth={SW.fine}
                strokeLinecap="round"
              />

              {/* Hand (Child of Forearm) */}
              <g transform={`translate(${PROP.forearmLength}, 0)`}>
                <circle
                  cx={PROP.handRadius - 2}
                  cy={0}
                  r={PROP.handRadius}
                  fill={P.skin}
                  stroke={P.outline}
                  strokeWidth={SW.outer}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  };

  // -------------------------------------------------------------
  // TORSO, NECK & HEAD RENDERERS
  // -------------------------------------------------------------
  const renderTorsoAndHead = () => {
    return (
      <g id="torso-and-head" transform={`translate(0, ${torsoY}) rotate(${effectiveTorsoTilt})`}>
        {/* 1. PELVIS / WAIST JUNCTION */}
        <path
          d={`M -${PROP.pelvisWidth / 2} -10 L ${PROP.pelvisWidth / 2} -10 L ${PROP.pelvisWidth / 2 - 2} 12 L -${PROP.pelvisWidth / 2 - 2} 12 Z`}
          fill={P.pants}
          stroke={P.outline}
          strokeWidth={SW.outer}
          strokeLinejoin="round"
        />

        {/* 2. TORSO (SHIRT) */}
        <g transform={`scale(${1 + breathChestExpand}, 1)`}>
          <path
            d={`M -${PROP.waistWidth / 2} 0 
               C -${PROP.waistWidth / 2 + 4} -40, -${PROP.shoulderWidth / 2 + 6} -80, -${PROP.shoulderWidth / 2} ${PROP.torsoTopY}
               C -15 ${PROP.torsoTopY - 4}, 15 ${PROP.torsoTopY - 4}, ${PROP.shoulderWidth / 2} ${PROP.torsoTopY}
               C ${PROP.shoulderWidth / 2 + 6} -80, ${PROP.waistWidth / 2 + 4} -40, ${PROP.waistWidth / 2} 0
               Z`}
            fill={P.shirt}
            stroke={P.outline}
            strokeWidth={SW.outer}
            strokeLinejoin="round"
          />

          {/* Shirt Collar */}
          <path
            d={`M -14 ${PROP.torsoTopY + 2} L 0 ${PROP.torsoTopY + 16} L 14 ${PROP.torsoTopY + 2}`}
            fill="none"
            stroke={P.outline}
            strokeWidth={SW.inner}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Front button placket line */}
          <line
            x1={0}
            y1={PROP.torsoTopY + 16}
            x2={0}
            y2={-6}
            stroke={P.outline}
            strokeWidth={SW.fine}
            strokeDasharray="6 5"
          />
        </g>

        {/* 3. NECK */}
        <rect
          x={-PROP.neckWidth / 2}
          y={PROP.neckTopY}
          width={PROP.neckWidth}
          height={PROP.neckBottomY - PROP.neckTopY + 6}
          rx={3}
          fill={P.skin}
          stroke={P.outline}
          strokeWidth={SW.fine}
        />

        {/* 4. HEAD HIERARCHY */}
        <g
          id="head"
          transform={`translate(0, ${PROP.headCenterY}) rotate(${exprHeadTilt})`}
        >
          {/* Head Base Skin */}
          <circle
            cx={0}
            cy={0}
            r={PROP.headRadius}
            fill={P.skin}
            stroke={P.outline}
            strokeWidth={SW.outer}
          />

          {/* Subtle Cheek Blush */}
          <circle cx={14} cy={12} r={8} fill={P.blush} />

          {/* Hair (Tousled Short Cut, canonical Minh design) */}
          <path
            d={`M -${PROP.headRadius + 2} -4 
               C -${PROP.headRadius + 4} -32, -18 -${PROP.headRadius + 14}, 8 -${PROP.headRadius + 12}
               C 26 -${PROP.headRadius + 10}, ${PROP.headRadius + 4} -24, ${PROP.headRadius + 2} -2
               C ${PROP.headRadius - 4} -12, 28 -20, 16 -18
               C 8 -16, 2 -26, -10 -22
               C -20 -18, -26 -10, -${PROP.headRadius + 2} -4 Z`}
            fill={P.hair}
            stroke={P.outline}
            strokeWidth={SW.outer}
            strokeLinejoin="round"
          />

          {/* Sideburns */}
          <path
            d={`M -${PROP.headRadius} -4 L -${PROP.headRadius - 4} 12 L -${PROP.headRadius - 10} 6 Z`}
            fill={P.hair}
          />

          {/* Eyebrow */}
          <g transform={`translate(14, -8) rotate(${browAngle})`}>
            <line
              x1={-10}
              y1={0}
              x2={10}
              y2={0}
              stroke={P.eyebrows}
              strokeWidth={SW.inner + 1}
              strokeLinecap="round"
            />
          </g>

          {/* Eye */}
          <g transform="translate(16, 2)">
            {eyeType === "normal" && (
              <>
                <ellipse cx={0} cy={0} rx={4.5} ry={5.5} fill={P.eyes} />
                <circle cx={1.5} cy={-1.5} r={1.5} fill="#FFFFFF" />
              </>
            )}
            {eyeType === "closed" && (
              <path
                d="M -5 2 Q 0 -3 5 2"
                fill="none"
                stroke={P.outline}
                strokeWidth={SW.inner}
                strokeLinecap="round"
              />
            )}
            {eyeType === "wide" && (
              <>
                <circle cx={0} cy={0} r={6.5} fill="#FFFFFF" stroke={P.outline} strokeWidth={SW.inner} />
                <circle cx={1} cy={0} r={3.5} fill={P.eyes} />
                <circle cx={2} cy={-1} r={1.2} fill="#FFFFFF" />
              </>
            )}
            {eyeType === "squint" && (
              <path
                d="M -5 0 L 5 0"
                stroke={P.outline}
                strokeWidth={SW.inner + 0.5}
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Nose Accent */}
          <path
            d="M 28 8 Q 32 10 28 14"
            fill="none"
            stroke={P.outline}
            strokeWidth={SW.fine}
            strokeLinecap="round"
          />

          {/* Mouth */}
          <g transform="translate(18, 22)">
            {mouthType === "neutral" && (
              <line x1={-6} y1={0} x2={6} y2={0} stroke={P.mouth} strokeWidth={SW.inner} strokeLinecap="round" />
            )}
            {mouthType === "smile" && (
              <path
                d="M -6 -2 Q 0 6 8 -2"
                fill="none"
                stroke={P.mouth}
                strokeWidth={SW.inner}
                strokeLinecap="round"
              />
            )}
            {mouthType === "frown" && (
              <path
                d="M -6 4 Q 0 -3 6 4"
                fill="none"
                stroke={P.mouth}
                strokeWidth={SW.inner}
                strokeLinecap="round"
              />
            )}
            {mouthType === "open" && (
              <ellipse cx={0} cy={2} rx={4.5} ry={6} fill={P.mouth} stroke={P.outline} strokeWidth={SW.fine} />
            )}
            {mouthType === "flat" && (
              <line x1={-5} y1={1} x2={5} y2={1} stroke={P.mouth} strokeWidth={SW.inner} strokeLinecap="round" />
            )}
          </g>
        </g>
      </g>
    );
  };

  // -------------------------------------------------------------
  // COMPOSITION & LAYER ASSEMBLY
  // -------------------------------------------------------------
  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale}) ${isFacingLeft ? "scaleX(-1)" : ""}`,
        transformOrigin: "0 0", // Anchor at character root (Pelvis)
        filter: "drop-shadow(0 4px 14px rgba(36, 36, 36, 0.12))",
        ...style,
      }}
    >
      <svg
        width="340"
        height="440"
        viewBox="-170 -220 340 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Layer 1: Far Arm (Behind Torso) */}
        {(layerMode === "full" || layerMode === "upperBody" || layerMode === "armsOnly") && (
          <g id="layer-far-arm">
            {renderArm(poseDef.leftArm, true, leftTypeTwitch)}
          </g>
        )}

        {/* Layer 2: Far Leg (Behind Pelvis) */}
        {(layerMode === "full" || layerMode === "lowerBody") && (
          <g id="layer-far-leg">
            {renderLeg(poseDef.leftLeg, true)}
          </g>
        )}

        {/* Layer 3: Torso, Neck & Head */}
        {(layerMode === "full" || layerMode === "upperBody" || layerMode === "noArms") && (
          <g id="layer-torso-head">
            {renderTorsoAndHead()}
          </g>
        )}

        {/* Layer 4: Near Leg (In front of Pelvis) */}
        {(layerMode === "full" || layerMode === "lowerBody") && (
          <g id="layer-near-leg">
            {renderLeg(poseDef.rightLeg, false)}
          </g>
        )}

        {/* Layer 5: Near Arm (In front of Torso) */}
        {(layerMode === "full" || layerMode === "upperBody" || layerMode === "armsOnly") && (
          <g id="layer-near-arm">
            {renderArm(poseDef.rightArm, false, rightTypeTwitch)}
          </g>
        )}
      </svg>
    </div>
  );
};
