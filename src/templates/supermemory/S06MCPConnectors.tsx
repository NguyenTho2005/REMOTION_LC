import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { BackgroundEffects } from "../shared/BackgroundEffects";
import { SubtitleSequence } from "../shared/SubtitleSequence";

export interface S06MCPConnectorsProps {
  durationInFrames: number;
  narration: string;
}

export const S06MCPConnectors: React.FC<S06MCPConnectorsProps> = ({
  durationInFrames,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  const connectors = [
    { title: "Cursor & Claude Code", desc: "Tích hợp MCP nhớ context lập trình", icon: "💻", color: "#38bdf8" },
    { title: "Google Drive & Notion", desc: "Đồng bộ tài liệu và ghi chú tự động", icon: "📁", color: "#818cf8" },
    { title: "Chrome Extension", desc: "Lưu web, bài viết, tweet chỉ 1 click", icon: "🌐", color: "#34d399" },
    { title: "Autonomous AI Agents", desc: "Cung cấp Memory API cho đa tác nhân", icon: "🤖", color: "#f43f5e" },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#090a0f" }}>
      <BackgroundEffects glowColor="#8B5CF6" />

      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: "rgba(139, 92, 246, 0.15)",
              border: "1px solid #8B5CF6",
              color: "#a78bfa",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            HỆ SINH THÁI MỞ RỘNG
          </span>
          <h2
            style={{
              transform: `scale(${titleSpring})`,
              fontSize: 46,
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "18px 0 0 0",
            }}
          >
            Model Context Protocol (MCP)
          </h2>
        </div>

        {/* 4 Connector Items Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {connectors.map((item, idx) => {
            const itemSpring = spring({
              frame: frame - (idx + 1) * 6,
              fps,
              config: { damping: 14 },
            });

            return (
              <div
                key={item.title}
                style={{
                  transform: `scale(${Math.max(0, itemSpring)})`,
                  opacity: Math.max(0, Math.min(1, itemSpring)),
                  padding: "22px 20px",
                  borderRadius: 18,
                  backgroundColor: "#11141e",
                  border: `1px solid ${item.color}44`,
                  boxShadow: `0 8px 20px rgba(0,0,0,0.5), 0 0 15px ${item.color}15`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 32 }}>{item.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.35 }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SubtitleSequence text={narration} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
