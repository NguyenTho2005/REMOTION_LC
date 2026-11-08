import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { ChatInterface } from "../components/ChatInterface";

export const S02ChatbotProblem: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="02 / HẠN CHẾ" category="TRADITIONAL CHATBOTS">
      <Headline
        title="Giới Hạn Của Chatbot Thông Thường"
        highlight="Giới Hạn"
        subtitle="Hỏi đâu trả lời đó — Không tự động thực hiện quy trình"
      />

      <ChatInterface />

      <MotionSubtitle text={text} keyword="toàn bộ quy trình" />
    </MotionBackground>
  );
};
