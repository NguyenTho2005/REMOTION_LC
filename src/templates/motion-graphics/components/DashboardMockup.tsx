import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const DashboardMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const goalSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const task1Spring = spring({ frame: frame - 35, fps, config: { damping: 14 } });
  const task2Spring = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  const task3Spring = spring({ frame: frame - 85, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}
    >
      {/* Primary Goal Card */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "3px solid #38bdf8",
          borderRadius: 32,
          padding: "32px 36px",
          boxShadow: "0 0 45px rgba(56, 189, 248, 0.35)",
          transform: `scale(${interpolate(goalSpring, [0, 1], [0.85, 1])})`,
          opacity: goalSpring,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: "#38bdf8", fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>
            🎯 PRIMARY GOAL (MỤC TIÊU CẤP CAO)
          </div>
          <div
            style={{
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            AUTONOMOUS AGENT
          </div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#f8fafc", lineHeight: 1.3 }}>
          "Nghiên cứu công nghệ AI Agent & Tự động xuất bản báo cáo hoàn chỉnh"
        </div>
      </div>

      {/* Subtask Decomposition Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingLeft: 10,
        }}
      >
        <div style={{ height: 2, flex: 1, backgroundColor: "rgba(56, 189, 248, 0.3)" }} />
        <div style={{ color: "#94a3b8", fontSize: 22, fontWeight: 800, letterSpacing: 1.5 }}>
          PHÂN RÃ THÀNH CÁC HÀNH ĐỘNG CON (ACTION PLAN)
        </div>
        <div style={{ height: 2, flex: 1, backgroundColor: "rgba(56, 189, 248, 0.3)" }} />
      </div>

      {/* 3 Subtasks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Task 1 */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            border: "2px solid #10b981",
            borderRadius: 24,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 8px 24px rgba(16,185,129,0.15)",
            transform: `scale(${interpolate(task1Spring, [0, 1], [0.9, 1])})`,
            opacity: task1Spring,
          }}
        >
          <div style={{ fontSize: 32, marginRight: 20 }}>🌐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc" }}>Bước 1: Thu thập & Đọc tài liệu ArXiv</div>
            <div style={{ fontSize: 20, color: "#94a3b8" }}>Tìm kiếm 15 bài báo về LLM Agent</div>
          </div>
          <div style={{ color: "#10b981", fontWeight: 800, fontSize: 20 }}>✔ HOÀN THÀNH</div>
        </div>

        {/* Task 2 */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "2px solid #38bdf8",
            borderRadius: 24,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 0 30px rgba(56, 189, 248, 0.3)",
            transform: `scale(${interpolate(task2Spring, [0, 1], [0.9, 1])})`,
            opacity: task2Spring,
          }}
        >
          <div style={{ fontSize: 32, marginRight: 20 }}>📊</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#38bdf8" }}>Bước 2: Tổng hợp dữ liệu & Trích xuất sự thật</div>
            <div style={{ fontSize: 20, color: "#94a3b8" }}>Phân tích so sánh bảng tính năng</div>
          </div>
          <div style={{ color: "#38bdf8", fontWeight: 900, fontSize: 20 }}>⚡ ĐANG XỬ LÝ</div>
        </div>

        {/* Task 3 */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 24,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            transform: `scale(${interpolate(task3Spring, [0, 1], [0.9, 1])})`,
            opacity: task3Spring,
          }}
        >
          <div style={{ fontSize: 32, marginRight: 20 }}>📁</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#94a3b8" }}>Bước 3: Xuất bản file PDF báo cáo & Lưu trữ</div>
            <div style={{ fontSize: 20, color: "#64748b" }}>Tự động ghi vào thư mục hệ thống</div>
          </div>
          <div style={{ color: "#64748b", fontWeight: 700, fontSize: 20 }}>⏳ ĐANG CHỜ</div>
        </div>
      </div>
    </div>
  );
};
