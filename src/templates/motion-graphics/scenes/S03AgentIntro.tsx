import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { DashboardMockup } from "../components/DashboardMockup";

export const S03AgentIntro: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="03 / ĐỘT PHÁ" category="AI AGENT INTRODUCTION">
      <Headline
        title="Tiếp Nhận Mục Tiêu & Tự Hành Động"
        highlight="Mục Tiêu"
        subtitle="GOAL → PLAN → ACTION"
      />

      <DashboardMockup />

      <MotionSubtitle text={text} keyword="mục tiêu" />
    </MotionBackground>
  );
};
