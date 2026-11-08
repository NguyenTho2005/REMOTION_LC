import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { AgentNetwork } from "../components/AgentNetwork";

export const S08MultiAgent: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="08 / ĐA TÁC TỬ" category="MULTI-AGENT SYSTEM">
      <Headline
        title="Đội Ngũ Agent Phối Hợp Chuyên Sâu"
        highlight="Đa Tác Tử"
        subtitle="Orchestrator • Researcher • Writer • Reviewer"
      />

      <AgentNetwork />

      <MotionSubtitle text={text} keyword="hệ thống nhiều Agent" />
    </MotionBackground>
  );
};
