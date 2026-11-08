import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { ToolCallingHub } from "../components/ToolCallingHub";

export const S06ToolCalling: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="06 / CÔNG CỤ" category="TOOL CALLING & ACTIONS">
      <Headline
        title="Tương Tác Với Phần Mềm Bên Ngoài"
        highlight="Tương Tác"
        subtitle="Browser • Database • API • File System"
      />

      <ToolCallingHub />

      <MotionSubtitle text={text} keyword="Tool Calling" />
    </MotionBackground>
  );
};
