import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { ApplicationsGrid } from "../components/ApplicationsGrid";

export const S09Applications: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="09 / THỰC TIỄN" category="REAL-WORLD USE CASES">
      <Headline
        title="Ứng Dụng Thực Tế Đa Ngành"
        highlight="Thực Tế"
        subtitle="Coding • Data Analysis • Customer Support • Document Research"
      />

      <ApplicationsGrid />

      <MotionSubtitle text={text} keyword="rất nhiều lĩnh vực" />
    </MotionBackground>
  );
};
