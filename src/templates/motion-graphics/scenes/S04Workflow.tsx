import React from "react";
import { useCurrentFrame } from "remotion";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { WorkflowDiagram } from "../components/WorkflowDiagram";

export const S04Workflow: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  // Progress through steps 1 to 5 based on frame
  // Total frames: 307
  let activeStep = 1;
  if (frame > 240) activeStep = 5;
  else if (frame > 180) activeStep = 4;
  else if (frame > 120) activeStep = 3;
  else if (frame > 60) activeStep = 2;

  return (
    <MotionBackground sceneNumber="04 / QUY TRÌNH" category="5 CORE STAGES">
      <Headline
        title="Quy Trình 5 Bước Khép Kín"
        highlight="5 Bước"
        subtitle="Goal → Planning → Tool Use → Execution → Evaluation"
      />

      <WorkflowDiagram activeStep={activeStep} />

      <MotionSubtitle text={text} keyword="quy trình cơ bản" />
    </MotionBackground>
  );
};
