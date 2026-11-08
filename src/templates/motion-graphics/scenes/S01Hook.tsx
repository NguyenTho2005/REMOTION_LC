import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MotionBackground } from "../components/MotionBackground";
import { Headline, MotionSubtitle } from "../components/Typography";

export const S01Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Task cards swarm effect: 6 cards floating around, then collapsing inward at frame 180
  const isCollapsed = frame > 180;

  // Big Banner "AI AGENT?" appears at frame 220
  const bannerSpring = spring({ frame: frame - 220, fps, config: { damping: 12 } });

  const tasks = [
    { title: "Đọc 50 email khách hàng", x: 180, y: 520, color: "#38bdf8" },
    { title: "Tổng hợp dữ liệu doanh thu", x: 680, y: 520, color: "#818cf8" },
    { title: "Viết báo cáo kỹ thuật Q4", x: 180, y: 720, color: "#ec4899" },
    { title: "Kiểm tra mã nguồn GitHub", x: 680, y: 720, color: "#10b981" },
    { title: "Lập lịch họp tự động", x: 180, y: 920, color: "#f59e0b" },
    { title: "Đối chiếu hợp đồng pháp lý", x: 680, y: 920, color: "#38bdf8" },
  ];

  // Clock rotation
  const clockDeg = (frame * 12) % 360;

  return (
    <MotionBackground sceneNumber="01 / HOOK" category="24/7 AUTONOMOUS WORKER">
      <Headline
        title="Nhân Viên Làm Việc 24/7"
        highlight="24/7"
        subtitle="Xử lý hàng loạt công việc chỉ bằng một mục tiêu"
      />

      {/* Spinning Clock Widget */}
      <div
        style={{
          position: "absolute",
          top: 380,
          right: 90,
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          border: "2px solid rgba(56, 189, 248, 0.3)",
          borderRadius: 20,
          padding: "10px 20px",
        }}
      >
        <svg width={36} height={36} viewBox="-18 -18 36 36">
          <circle cx={0} cy={0} r={15} fill="none" stroke="#94a3b8" strokeWidth={3} />
          <line
            x1={0}
            y1={0}
            x2={Math.sin((clockDeg * Math.PI) / 180) * 11}
            y2={-Math.cos((clockDeg * Math.PI) / 180) * 11}
            stroke="#38bdf8"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#38bdf8" }}>24H / NGÀY</div>
      </div>

      {/* Task Cards Swarm (Collapses into center after frame 180) */}
      {!isCollapsed ? (
        tasks.map((t, idx) => {
          const cardSpring = spring({ frame: frame - idx * 10, fps, config: { damping: 14 } });
          const floatY = Math.sin((frame / fps) * Math.PI * 2 + idx) * 8;
          return (
            <div
              key={t.title}
              style={{
                position: "absolute",
                top: t.y + floatY,
                left: t.x,
                transform: `translate(-50%, -50%) scale(${interpolate(cardSpring, [0, 1], [0.8, 1])})`,
                opacity: cardSpring,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: `2px solid ${t.color}`,
                borderRadius: 24,
                padding: "22px 28px",
                width: 320,
                boxShadow: `0 8px 30px ${t.color}25`,
              }}
            >
              <div style={{ fontSize: 16, color: t.color, fontWeight: 800, marginBottom: 6 }}>
                TASK #{idx + 1}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc" }}>{t.title}</div>
            </div>
          );
        })
      ) : (
        /* Collapsed Central Core "AI AGENT" */
        <div
          style={{
            position: "absolute",
            top: 720,
            left: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(bannerSpring, [0, 1], [0.8, 1])})`,
            opacity: bannerSpring,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#080c18",
              border: "6px solid #38bdf8",
              borderRadius: "50%",
              width: 240,
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 80,
              boxShadow: "0 0 80px rgba(56, 189, 248, 0.6)",
              marginBottom: 30,
            }}
          >
            ⚡
          </div>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "3px solid #38bdf8",
              padding: "20px 48px",
              borderRadius: 28,
              fontSize: 54,
              fontWeight: 900,
              color: "#38bdf8",
              letterSpacing: 2,
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            AI AGENT?
          </div>
        </div>
      )}

      <MotionSubtitle text={text} keyword="AI Agent" />
    </MotionBackground>
  );
};
