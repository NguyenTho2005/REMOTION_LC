import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  calculateStickmanJoints,
  StickmanPose,
} from "./StickmanAnimator";

export interface StickmanProps {
  pose?: StickmanPose;
  facing?: "left" | "right";
  scale?: number;
  strokeColor?: string;
  strokeWidth?: number;
  accessory?: "glasses" | "tie" | "headband" | "none";
  style?: React.CSSProperties;
}

export const Stickman: React.FC<StickmanProps> = ({
  pose = "idle",
  facing = "right",
  scale = 1,
  strokeColor = "#0f172a",
  strokeWidth = 9,
  accessory = "none",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const joints = calculateStickmanJoints(frame, fps, pose);

  // Convert degrees to radians
  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Arm geometry (Shoulders at x=0, y=0)
  const armLen1 = 58;
  const armLen2 = 52;

  // Left Arm calculations
  const lShoulderAngle = rad(joints.leftShoulder);
  const lElbowX = Math.sin(lShoulderAngle) * armLen1;
  const lElbowY = Math.cos(lShoulderAngle) * armLen1;

  const lElbowAngle = lShoulderAngle + rad(joints.leftElbow);
  const lHandX = lElbowX + Math.sin(lElbowAngle) * armLen2;
  const lHandY = lElbowY + Math.cos(lElbowAngle) * armLen2;

  // Right Arm calculations
  const rShoulderAngle = rad(joints.rightShoulder);
  const rElbowX = Math.sin(rShoulderAngle) * armLen1;
  const rElbowY = Math.cos(rShoulderAngle) * armLen1;

  const rElbowAngle = rShoulderAngle + rad(joints.rightElbow);
  const rHandX = rElbowX + Math.sin(rElbowAngle) * armLen2;
  const rHandY = rElbowY + Math.cos(rElbowAngle) * armLen2;

  // Leg geometry (Hips at x=0, y=115)
  const hipY = 115;
  const legLen1 = 68;
  const legLen2 = 64;

  // Left Leg
  const lHipAngle = rad(joints.leftHip);
  const lKneeX = Math.sin(lHipAngle) * legLen1;
  const lKneeY = hipY + Math.cos(lHipAngle) * legLen1;

  const lKneeAngle = lHipAngle + rad(joints.leftKnee);
  const lFootX = lKneeX + Math.sin(lKneeAngle) * legLen2;
  const lFootY = lKneeY + Math.cos(lKneeAngle) * legLen2;

  // Right Leg
  const rHipAngle = rad(joints.rightHip);
  const rKneeX = Math.sin(rHipAngle) * legLen1;
  const rKneeY = hipY + Math.cos(rHipAngle) * legLen1;

  const rKneeAngle = rHipAngle + rad(joints.rightKnee);
  const rFootX = rKneeX + Math.sin(rKneeAngle) * legLen2;
  const rFootY = rKneeY + Math.cos(rKneeAngle) * legLen2;

  // Head coordinates
  const headRadius = 38;
  const headCenterY = -58 + joints.headY;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale}) ${facing === "left" ? "scaleX(-1)" : ""}`,
        transformOrigin: "center bottom",
        ...style,
      }}
    >
      <svg
        width={240}
        height={380}
        viewBox="-120 -110 240 380"
        style={{ overflow: "visible" }}
      >
        {/* Shadow on ground */}
        {pose !== "sitting" && pose !== "exhausted" && (
          <ellipse
            cx={0}
            cy={250}
            rx={50}
            ry={9}
            fill="#000000"
            opacity={0.12}
          />
        )}

        {/* Back Arm (Right Arm) */}
        <g stroke={strokeColor} strokeWidth={strokeWidth - 1} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={`M 0 0 L ${rElbowX} ${rElbowY} L ${rHandX} ${rHandY}`} />
          <circle cx={rHandX} cy={rHandY} r={strokeWidth * 0.7} fill={strokeColor} />
        </g>

        {/* Legs (Hips at 0, 115) */}
        <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Left Leg */}
          <path d={`M 0 ${hipY} L ${lKneeX} ${lKneeY} L ${lFootX} ${lFootY} L ${lFootX + 14} ${lFootY}`} />
          {/* Right Leg */}
          <path d={`M 0 ${hipY} L ${rKneeX} ${rKneeY} L ${rFootX} ${rFootY} L ${rFootX + 14} ${rFootY}`} />
        </g>

        {/* Torso */}
        <line
          x1={0}
          y1={-18}
          x2={Math.sin(rad(joints.torsoAngle)) * 120}
          y2={hipY}
          stroke={strokeColor}
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
        />

        {/* Optional Accessory: Tie */}
        {accessory === "tie" && (
          <path
            d="M -3 0 L 3 0 L 6 45 L 0 58 L -6 45 Z"
            fill="#0284c7"
          />
        )}

        {/* Front Arm (Left Arm) */}
        <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={`M 0 0 L ${lElbowX} ${lElbowY} L ${lHandX} ${lHandY}`} />
          <circle cx={lHandX} cy={lHandY} r={strokeWidth * 0.7} fill={strokeColor} />
        </g>

        {/* Head Group with Tilt */}
        <g transform={`translate(0, ${headCenterY}) rotate(${joints.headTilt})`}>
          {/* Head Circle */}
          <circle
            cx={0}
            cy={0}
            r={headRadius}
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* Eyes */}
          {joints.eyeBlink ? (
            // Blinking Eye (horizontal line)
            <line
              x1={10}
              y1={-6}
              x2={24}
              y2={-6}
              stroke={strokeColor}
              strokeWidth={4}
              strokeLinecap="round"
            />
          ) : (
            // Open Eye
            <>
              <circle cx={18} cy={-6} r={5} fill={strokeColor} />
              {/* Eye sparkle */}
              <circle cx={19.5} cy={-8} r={1.5} fill="#ffffff" />
            </>
          )}

          {/* Eyebrow */}
          {pose === "thinking" || pose === "confused" ? (
            <path d="M 8 -18 Q 16 -12 25 -19" stroke={strokeColor} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          ) : pose === "surprised" ? (
            <path d="M 10 -22 Q 18 -26 26 -22" stroke={strokeColor} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 11 -16 Q 18 -18 25 -15" stroke={strokeColor} strokeWidth={3} fill="none" strokeLinecap="round" />
          )}

          {/* Mouth */}
          {joints.mouthOpen > 0.4 ? (
            // Open Mouth (Talking or Smiling)
            <path
              d={`M 10 12 Q 18 ${12 + joints.mouthOpen * 14} 24 12 Z`}
              fill={pose === "celebrating" ? "#ef4444" : strokeColor}
            />
          ) : joints.mouthOpen > 0.1 ? (
            // Small Talking Mouth
            <ellipse cx={17} cy={14} rx={4} ry={2.5} fill={strokeColor} />
          ) : pose === "exhausted" ? (
            // Tired straight line
            <line x1={10} y1={14} x2={22} y2={17} stroke={strokeColor} strokeWidth={3.5} strokeLinecap="round" />
          ) : (
            // Gentle Smile
            <path d="M 12 12 Q 18 19 24 14" stroke={strokeColor} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          )}

          {/* Accessory: Glasses */}
          {accessory === "glasses" && (
            <g stroke="#0284c7" strokeWidth={3} fill="none">
              <rect x={6} y={-14} width={24} height={16} rx={3} />
              <line x1={0} y1={-6} x2={6} y2={-6} />
              <line x1={30} y1={-6} x2={36} y2={-6} />
            </g>
          )}

          {/* Accessory: Headband */}
          {accessory === "headband" && (
            <path
              d="M -36 -12 Q 0 -18 36 -12"
              stroke="#ef4444"
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </g>
      </svg>
    </div>
  );
};
