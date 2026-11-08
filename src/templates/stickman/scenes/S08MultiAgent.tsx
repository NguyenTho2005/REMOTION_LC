import React from "react";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S08MultiAgent: React.FC<{ text: string }> = ({ text }) => {
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
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 08 / ĐA TÁC TỬ
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          MULTI-AGENT COLLABORATION
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
          Đội Ngũ Agent Phối Hợp Chuyên Sâu
        </div>
      </div>

      {/* Central Manager Robot */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "8px 24px",
            borderRadius: 20,
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          ORCHESTRATOR / QUẢN LÝ
        </div>
        <CompanionRobot expression="happy" scale={1.5} />
      </div>

      {/* 3 Specialist Agents Orbiting Below */}
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
        }}
      >
        {/* Agent 1: Researcher */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "4px solid #0284c7",
            borderRadius: 24,
            padding: "20px 14px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(2,132,199,0.15)",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0284c7" }}>AGENT 1</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Nghiên Cứu</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Thu thập dữ liệu</div>
        </div>

        {/* Agent 2: Writer */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "4px solid #8b5cf6",
            borderRadius: 24,
            padding: "20px 14px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(139,92,246,0.15)",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>✍️</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6" }}>AGENT 2</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Soạn Thảo</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Viết báo cáo</div>
        </div>

        {/* Agent 3: Reviewer */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "4px solid #10b981",
            borderRadius: 24,
            padding: "20px 14px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(16,185,129,0.15)",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🛡️</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>AGENT 3</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Kiểm Tra</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Soát lỗi & QA</div>
        </div>
      </div>

      {/* SVG Connecting Flow Lines */}
      <svg
        width={920}
        height={180}
        viewBox="0 0 920 180"
        style={{ position: "absolute", top: 580, left: 80, overflow: "visible" }}
      >
        <path d="M 460 0 L 160 120" stroke="#0284c7" strokeWidth={4} strokeDasharray="8 6" fill="none" />
        <path d="M 460 0 L 460 120" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="8 6" fill="none" />
        <path d="M 460 0 L 760 120" stroke="#10b981" strokeWidth={4} strokeDasharray="8 6" fill="none" />
      </svg>

      {/* Stickman presenting at bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 140,
        }}
      >
        <Stickman pose="presenting" scale={1.35} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="hệ thống nhiều Agent" />
    </div>
  );
};
