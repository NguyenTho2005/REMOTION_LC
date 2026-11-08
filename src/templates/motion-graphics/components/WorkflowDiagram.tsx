import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface WorkflowDiagramProps {
  activeStep?: number;
  isErrorMode?: boolean;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
  activeStep = 1,
  isErrorMode = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: 1, id: "goal", title: "1. GOAL", desc: "Tiếp nhận mục tiêu cấp cao", icon: "🎯", color: "#38bdf8" },
    { num: 2, id: "plan", title: "2. PLANNING", desc: "Phân rã thành chuỗi nhiệm vụ", icon: "🧠", color: "#818cf8" },
    { num: 3, id: "tool", title: "3. TOOL USE", desc: "Lựa chọn công cụ & gọi API", icon: "🛠️", color: isErrorMode ? "#ef4444" : "#c084fc" },
    { num: 4, id: "exec", title: "4. EXECUTION", desc: "Thực thi tác vụ với môi trường", icon: "⚡", color: isErrorMode ? "#64748b" : "#f472b6" },
    { num: 5, id: "eval", title: "5. EVALUATION", desc: "Kiểm tra kết quả & điều chỉnh", icon: "⚖️", color: isErrorMode ? "#64748b" : "#4ade80" },
  ];

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
      {steps.map((st) => {
        const isActive = activeStep === st.num;
        const isCurrentError = isErrorMode && st.id === "tool";

        const entranceSpring = spring({
          frame: frame - st.num * 12,
          fps,
          config: { damping: 14 },
        });

        return (
          <div
            key={st.num}
            style={{
              backgroundColor: isCurrentError
                ? "rgba(239, 68, 68, 0.2)"
                : isActive
                ? "rgba(15, 23, 42, 0.95)"
                : "rgba(15, 23, 42, 0.6)",
              border: `3px solid ${isCurrentError ? "#ef4444" : isActive ? st.color : "rgba(255, 255, 255, 0.12)"}`,
              borderRadius: 28,
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              boxShadow: isCurrentError
                ? "0 0 35px rgba(239, 68, 68, 0.4)"
                : isActive
                ? `0 0 30px ${st.color}50`
                : "none",
              transform: `scale(${interpolate(entranceSpring, [0, 1], [0.9, 1])}) ${
                isActive ? "translateX(14px)" : "translateX(0)"
              }`,
              opacity: entranceSpring,
            }}
          >
            {/* Step Icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: isCurrentError ? "#ef4444" : st.color,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 900,
                marginRight: 24,
                boxShadow: `0 8px 20px ${isCurrentError ? "#ef4444" : st.color}40`,
              }}
            >
              {isCurrentError ? "⚠️" : st.icon}
            </div>

            {/* Step Titles */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: isCurrentError ? "#f87171" : isActive ? st.color : "#f8fafc",
                  letterSpacing: 0.5,
                }}
              >
                {st.title}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: isCurrentError ? "#fca5a5" : "#94a3b8",
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {isCurrentError ? "LỖI: Tham số gọi API không hợp lệ" : st.desc}
              </div>
            </div>

            {/* Status Pill */}
            {isCurrentError ? (
              <div
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  padding: "8px 20px",
                  borderRadius: 14,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                ● TẠM DỪNG
              </div>
            ) : isActive ? (
              <div
                style={{
                  backgroundColor: st.color,
                  color: "#080c18",
                  padding: "8px 20px",
                  borderRadius: 14,
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                RUNNING ⚡
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
