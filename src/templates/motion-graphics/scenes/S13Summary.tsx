import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { FivePillarsCircle } from "../components/FivePillarsCircle";

export const S13Summary: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="13 / TỔNG KẾT" category="5 CORE PILLARS">
      <Headline
        title="5 Trụ Cột Phân Biệt Hỏi vs. Giao Việc"
        highlight="5 Trụ Cột"
        subtitle="Goal • Plan • Tools • Memory • Evaluation"
      />

      <FivePillarsCircle />

      <MotionSubtitle text={text} keyword="giao một nhiệm vụ" />
    </MotionBackground>
  );
};
