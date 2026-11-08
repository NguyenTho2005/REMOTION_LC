import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { WorkflowDiagram } from "../components/WorkflowDiagram";

export const S10LimitationsRisks: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="10 / RỦI RO" category="LIMITATIONS & RISKS">
      <Headline
        title="AI Không Hoàn Hảo: Hạn Chế & Rủi Ro"
        highlight="Không Hoàn Hảo"
        subtitle="AI IS NOT PERFECT — Cần kiểm soát quyền hạn cẩn trọng"
      />

      <WorkflowDiagram activeStep={3} isErrorMode />

      <MotionSubtitle text={text} keyword="không phải phép màu" />
    </MotionBackground>
  );
};
