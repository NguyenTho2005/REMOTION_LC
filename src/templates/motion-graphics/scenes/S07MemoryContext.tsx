import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { MemoryVisualization } from "../components/MemoryVisualization";

export const S07MemoryContext: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="07 / BỘ NHỚ" category="MEMORY & CONTEXT">
      <Headline
        title="Lưu Trữ Tiến Trình & Ngữ Cảnh"
        highlight="Ngữ Cảnh"
        subtitle="Duy trì tính nhất quán và hiểu sâu người dùng"
      />

      <MemoryVisualization />

      <MotionSubtitle text={text} keyword="Memory" />
    </MotionBackground>
  );
};
