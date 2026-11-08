import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ApplicationsGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const apps = [
    {
      title: "LẬP TRÌNH & SOFTWARE",
      desc: "Tự viết mã nguồn, debug lỗi, review pull request và deploy",
      icon: "💻",
      color: "#38bdf8",
      metric: "90% GIẢM THỜI GIAN DEBUG",
    },
    {
      title: "PHÂN TÍCH DỮ LIỆU",
      desc: "Trích xuất insight từ dữ liệu lớn, vẽ biểu đồ dự báo xu hướng",
      icon: "📈",
      color: "#818cf8",
      metric: "TỰ ĐỘNG BIỂU DIỄN SỐ LIỆU",
    },
    {
      title: "CHĂM SÓC KHÁCH HÀNG",
      desc: "Trợ lý giải quyết ticket 24/7, phản hồi đa ngôn ngữ tức thì",
      icon: "🎧",
      color: "#ec4899",
      metric: "PHẢN HỒI REALTIME 24/7",
    },
    {
      title: "XỬ LÝ TÀI LIỆU & PHÁP LÝ",
      desc: "Đọc hợp đồng, đối chiếu điều khoản, trích xuất hóa đơn tự động",
      icon: "📑",
      color: "#10b981",
      metric: "TRÍCH XUẤT CHÍNH XÁC CAO",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 26,
      }}
    >
      {apps.map((a, idx) => {
        const appSpring = spring({ frame: frame - idx * 16, fps, config: { damping: 14 } });
        return (
          <div
            key={a.title}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: `3px solid ${a.color}`,
              borderRadius: 32,
              padding: "32px 28px",
              boxShadow: `0 8px 30px ${a.color}25`,
              transform: `scale(${interpolate(appSpring, [0, 1], [0.85, 1])})`,
              opacity: appSpring,
            }}
          >
            <div style={{ fontSize: 50, marginBottom: 14 }}>{a.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: a.color, marginBottom: 8 }}>
              {a.title}
            </div>
            <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.4, marginBottom: 16 }}>
              {a.desc}
            </div>
            <div
              style={{
                backgroundColor: `${a.color}15`,
                color: a.color,
                padding: "8px 14px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              ● {a.metric}
            </div>
          </div>
        );
      })}
    </div>
  );
};
