import React from "react";
import { useCurrentFrame } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { FiveStepWorkflow } from "../StickmanProps";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S04Workflow: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  // Progress through steps 1 to 5 based on frame
  // Total frames ~307
  let activeStep = 1;
  if (frame > 240) activeStep = 5;
  else if (frame > 180) activeStep = 4;
  else if (frame > 120) activeStep = 3;
  else if (frame > 60) activeStep = 2;

  // Robot Y position tracks active step
  const robotTargetY = 460 + (activeStep - 1) * 110;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, #f8fafc 1.5px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
          opacity: 0.6,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#8b5cf6",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 04 / QUY TRÌNH
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          5 CORE STAGES
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 900, color: "#0f172a" }}>
          Quy Trình Hoạt Động Khép Kín
        </div>
      </div>

      {/* 5-Step Workflow list */}
      <div style={{ position: "absolute", top: 380, left: 80 }}>
        <FiveStepWorkflow activeStep={activeStep} />
      </div>

      {/* Companion Robot following the active step */}
      <div
        style={{
          position: "absolute",
          top: robotTargetY,
          right: 90,
        }}
      >
        <CompanionRobot expression="happy" scale={1.2} />
      </div>

      {/* Stickman pointing at bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 120,
        }}
      >
        <Stickman pose="pointing" scale={1.3} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="quy trình cơ bản" />
    </div>
  );
};
