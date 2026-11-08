import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Stickman } from "../Stickman";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S09Applications: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  const domains = [
    { icon: "💻", title: "LẬP TRÌNH & CODE", desc: "Viết mã, debug lỗi, review pull request", color: "#0284c7" },
    { icon: "📈", title: "PHÂN TÍCH DỮ LIỆU", desc: "Xử lý số liệu, vẽ biểu đồ trực quan", color: "#8b5cf6" },
    { icon: "🎧", title: "CHĂM SÓC KHÁCH HÀNG", desc: "Phản hồi 24/7, xử lý khiếu nại tự động", color: "#ec4899" },
    { icon: "📑", title: "XỬ LÝ TÀI LIỆU", desc: "Đọc hóa đơn, phân loại hợp đồng, trích xuất", color: "#10b981" },
  ];

  // Stickman walks slowly across bottom
  const stickmanX = interpolate(frame, [0, 350], [100, 680], {
    extrapolateRight: "clamp",
  });

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
          ● 09 / ỨNG DỤNG
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          REAL-WORLD USE CASES
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
          Ứng Dụng Thực Tế Đa Ngành
        </div>
      </div>

      {/* 4 Application Domain Cards */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {domains.map((d, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#ffffff",
              border: `5px solid ${d.color}`,
              borderRadius: 28,
              padding: "28px 20px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>{d.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: d.color, marginBottom: 8 }}>{d.title}</div>
            <div style={{ fontSize: 18, color: "#475569", lineHeight: 1.4 }}>{d.desc}</div>
          </div>
        ))}
      </div>

      {/* Walking Stickman */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: stickmanX,
        }}
      >
        <Stickman pose="walking" scale={1.35} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="rất nhiều lĩnh vực" />
    </div>
  );
};
