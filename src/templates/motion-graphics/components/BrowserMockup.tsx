import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const BrowserMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const reportSpring = spring({ frame: frame - 140, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Browser Window */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "2px solid rgba(56, 189, 248, 0.35)",
          borderRadius: 32,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          transform: `scale(${interpolate(browserSpring, [0, 1], [0.85, 1])})`,
          opacity: browserSpring,
        }}
      >
        {/* Browser URL Bar */}
        <div
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.9)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#10b981" }} />
          </div>
          <div
            style={{
              flex: 1,
              marginLeft: 14,
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              borderRadius: 12,
              padding: "10px 20px",
              fontSize: 20,
              color: "#38bdf8",
              fontWeight: 600,
              border: "1px solid rgba(56, 189, 248, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>🔒</span>
            <span>https://arxiv.org/abs/2303.11366 — LLM Autonomous Research</span>
          </div>
        </div>

        {/* Content Preview */}
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>
              🌐 Trích xuất thông tin tự động từ 12 nguồn học thuật
            </div>
            <div style={{ fontSize: 18, color: "#10b981", fontWeight: 700 }}>
              ● 100% TRÍCH XUẤT TỰ ĐỘNG
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: "14px 20px", backgroundColor: "rgba(30, 41, 59, 0.6)", borderRadius: 16, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#38bdf8" }}>ReAct Framework: Reason + Act</div>
              <div style={{ fontSize: 18, color: "#94a3b8" }}>Kết hợp tư duy logic và gọi công cụ trong vòng lặp thời gian thực</div>
            </div>
            <div style={{ padding: "14px 20px", backgroundColor: "rgba(30, 41, 59, 0.6)", borderRadius: 16, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#818cf8" }}>Toolformer & MCP Protocol</div>
              <div style={{ fontSize: 18, color: "#94a3b8" }}>Giao thức kết nối công cụ và mở rộng bối cảnh ngoài</div>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Output Report Document (Springs in after processing) */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "3px solid #10b981",
          borderRadius: 32,
          padding: "28px 36px",
          boxShadow: "0 0 50px rgba(16, 185, 129, 0.35)",
          display: "flex",
          alignItems: "center",
          gap: 24,
          transform: `scale(${interpolate(reportSpring, [0, 1], [0.85, 1])})`,
          opacity: reportSpring,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            border: "2px solid #10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          📄
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981" }}>
            TỔNG HỢP & XUẤT BÁO CÁO THÀNH CÔNG
          </div>
          <div style={{ fontSize: 20, color: "#f8fafc", marginTop: 4 }}>
            Tệp tin: <code style={{ color: "#38bdf8" }}>autonomous_agent_report_2025.pdf</code>
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 4 }}>
            ✔ Tự động tìm kiếm • Đọc hiểu • Tổng hợp biểu đồ • Lưu file
          </div>
        </div>
      </div>
    </div>
  );
};
