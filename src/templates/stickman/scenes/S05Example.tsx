import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S05Example: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations:
  // 1. Browser pops in at frame 20
  const browserSpring = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  // 2. Report card appears at frame 180
  const reportSpring = spring({ frame: frame - 180, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, #f8fafc 1.5px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
          opacity: 0.6,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 05 / VÍ DỤ THỰC TẾ
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          RESEARCH & REPORT
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 900, color: "#0f172a" }}>
          Nghiên Cứu Đề Tài & Tạo Báo Cáo
        </div>
      </div>

      {/* Browser Window mockup */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 100,
          right: 100,
          backgroundColor: "#ffffff",
          border: "5px solid #0f172a",
          borderRadius: 28,
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          transform: `scale(${interpolate(browserSpring, [0, 1], [0.8, 1])})`,
          opacity: browserSpring,
          overflow: "hidden",
        }}
      >
        {/* Browser Top bar */}
        <div
          style={{
            backgroundColor: "#e2e8f0",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "4px solid #0f172a",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#10b981" }} />
          {/* URL bar */}
          <div
            style={{
              flex: 1,
              marginLeft: 16,
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: "8px 18px",
              fontSize: 20,
              color: "#334155",
              fontWeight: 600,
              border: "2px solid #cbd5e1",
            }}
          >
            🔍 https://arxiv.org/search?q=autonomous+agent
          </div>
        </div>

        {/* Browser Content */}
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#0284c7" }}>📄 Tìm thấy 14 tài liệu liên quan</div>
            <div style={{ fontSize: 20, color: "#10b981", fontWeight: 700 }}>● Đang trích xuất tự động</div>
          </div>
          {/* Fake Search results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "12px 18px", backgroundColor: "#f8fafc", borderRadius: 12, border: "2px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#0f172a" }}>ReAct: Synergizing Reasoning and Acting</div>
              <div style={{ fontSize: 16, color: "#64748b" }}>Yao et al. — Princeton University & Google Research</div>
            </div>
            <div style={{ padding: "12px 18px", backgroundColor: "#f8fafc", borderRadius: 12, border: "2px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#0f172a" }}>Toolformer: Language Models Can Teach Themselves to Use Tools</div>
              <div style={{ fontSize: 16, color: "#64748b" }}>Schick et al. — Meta AI Research</div>
            </div>
          </div>
        </div>
      </div>

      {/* Robot floating above browser with processing glow */}
      <div style={{ position: "absolute", top: 780, right: 120 }}>
        <CompanionRobot expression="happy" scale={1.4} holdingTray />
      </div>

      {/* Resulting Report Card (Appears at frame 180) */}
      {frame >= 180 && (
        <div
          style={{
            position: "absolute",
            top: 760,
            left: 100,
            width: 440,
            backgroundColor: "#0f172a",
            border: "5px solid #10b981",
            borderRadius: 28,
            padding: 30,
            color: "#ffffff",
            boxShadow: "0 20px 50px rgba(16,185,129,0.3)",
            transform: `scale(${interpolate(reportSpring, [0, 1], [0.7, 1])})`,
            opacity: reportSpring,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 48 }}>📊</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#10b981" }}>HOÀN TẤT BÁO CÁO</div>
              <div style={{ fontSize: 18, color: "#94a3b8" }}>autonomous_agent_report.pdf</div>
            </div>
          </div>
          <div style={{ fontSize: 20, lineHeight: 1.5, color: "#e2e8f0" }}>
            ✔ Tổng hợp 14 bài báo<br />
            ✔ Trích xuất bảng so sánh<br />
            ✔ Đã lưu vào thư mục dự án
          </div>
        </div>
      )}

      {/* Stickman at bottom left */}
      <div style={{ position: "absolute", bottom: 530, left: 140 }}>
        <Stickman pose="celebrating" scale={1.35} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="nghiên cứu một chủ đề" />
    </div>
  );
};
