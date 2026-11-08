import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { ApprovalCard } from "../components/ApprovalCard";

export const S11HumanInLoop: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="11 / KIỂM SOÁT" category="HUMAN IN THE LOOP">
      <Headline
        title="Con Người Giữ Quyền Quyết Định Cuối"
        highlight="Quyền Quyết Định"
        subtitle="HUMAN IN THE LOOP — Phê duyệt các hành động nhạy cảm"
      />

      <ApprovalCard />

      <MotionSubtitle text={text} keyword="Human in the Loop" />
    </MotionBackground>
  );
};
