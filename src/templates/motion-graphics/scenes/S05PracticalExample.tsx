import React from "react";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";
import { BrowserMockup } from "../components/BrowserMockup";

export const S05PracticalExample: React.FC<{ text: string }> = ({ text }) => {
  return (
    <MotionBackground sceneNumber="05 / VÍ DỤ THỰC TẾ" category="RESEARCH & REPORT">
      <Headline
        title="Tự Động Nghiên Cứu & Tạo Báo Cáo"
        highlight="Tự Động"
        subtitle="Tìm kiếm thông tin, tổng hợp tài liệu và ghi tệp tin"
      />

      <BrowserMockup />

      <MotionSubtitle text={text} keyword="nghiên cứu một chủ đề" />
    </MotionBackground>
  );
};
