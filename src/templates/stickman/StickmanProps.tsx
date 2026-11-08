import React from "react";
import { useCurrentFrame } from "remotion";

/** Desk with Laptop and Coffee Cup */
export const DeskAndLaptop: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <svg width={360} height={180} viewBox="0 0 360 180" style={{ overflow: "visible", ...style }}>
      {/* Desk top */}
      <rect x={20} y={100} width={320} height={16} rx={4} fill="#475569" stroke="#0f172a" strokeWidth={6} />
      {/* Desk Legs */}
      <line x1={50} y1={116} x2={50} y2={180} stroke="#0f172a" strokeWidth={8} strokeLinecap="round" />
      <line x1={310} y1={116} x2={310} y2={180} stroke="#0f172a" strokeWidth={8} strokeLinecap="round" />
      {/* Laptop base */}
      <rect x={110} y={94} width={100} height={8} rx={2} fill="#94a3b8" stroke="#0f172a" strokeWidth={4} />
      {/* Laptop Screen (tilted) */}
      <polygon points="120,94 130,42 210,42 200,94" fill="#0f172a" stroke="#0f172a" strokeWidth={4} />
      <polygon points="123,90 132,46 207,46 198,90" fill="#38bdf8" opacity={0.85} />
      {/* Coffee Cup */}
      <rect x={250} y={80} width={24} height={20} rx={4} fill="#f1f5f9" stroke="#0f172a" strokeWidth={4} />
      <path d="M 274 84 C 284 84 284 96 274 96" fill="none" stroke="#0f172a" strokeWidth={4} />
    </svg>
  );
};

/** Fast Spinning Clock for S01 */
export const FastClock: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const minuteAngle = (frame * 18) % 360;
  const hourAngle = (frame * 1.5) % 360;

  return (
    <svg width={140} height={140} viewBox="-70 -70 140 140" style={{ overflow: "visible", ...style }}>
      {/* Clock Face */}
      <circle cx={0} cy={0} r={56} fill="#ffffff" stroke="#0f172a" strokeWidth={8} />
      {/* Ticks */}
      <line x1={0} y1={-48} x2={0} y2={-40} stroke="#0f172a" strokeWidth={4} strokeLinecap="round" />
      <line x1={48} y1={0} x2={40} y2={0} stroke="#0f172a" strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={48} x2={0} y2={40} stroke="#0f172a" strokeWidth={4} strokeLinecap="round" />
      <line x1={-48} y1={0} x2={-40} y2={0} stroke="#0f172a" strokeWidth={4} strokeLinecap="round" />
      {/* Hour Hand */}
      <line
        x1={0}
        y1={0}
        x2={Math.sin((hourAngle * Math.PI) / 180) * 26}
        y2={-Math.cos((hourAngle * Math.PI) / 180) * 26}
        stroke="#0f172a"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Minute Hand */}
      <line
        x1={0}
        y1={0}
        x2={Math.sin((minuteAngle * Math.PI) / 180) * 38}
        y2={-Math.cos((minuteAngle * Math.PI) / 180) * 38}
        stroke="#ef4444"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Center cap */}
      <circle cx={0} cy={0} r={5} fill="#0f172a" />
    </svg>
  );
};

/** Paper and Document Stack */
export const PaperStack: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <svg width={140} height={120} viewBox="0 0 140 120" style={{ overflow: "visible", ...style }}>
      <rect x={10} y={70} width={90} height={20} rx={2} fill="#e2e8f0" stroke="#0f172a" strokeWidth={4} />
      <rect x={14} y={54} width={88} height={18} rx={2} fill="#f1f5f9" stroke="#0f172a" strokeWidth={4} />
      <rect x={8} y={38} width={92} height={18} rx={2} fill="#ffffff" stroke="#0f172a" strokeWidth={4} />
      <rect x={16} y={20} width={86} height={20} rx={2} fill="#ffffff" stroke="#0f172a" strokeWidth={4} />
      {/* Lines on top sheet */}
      <line x1={26} y1={28} x2={70} y2={28} stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
      <line x1={26} y1={34} x2={86} y2={34} stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};

/** Chat Bubbles Stack for S02 */
export const ChatBubbleStack: React.FC<{ activeIndex?: number; style?: React.CSSProperties }> = ({
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 720, ...style }}>
      {/* User Bubble 1 */}
      <div
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#0284c7",
          color: "#ffffff",
          padding: "20px 32px",
          borderRadius: "28px 28px 4px 28px",
          fontSize: 28,
          fontWeight: 600,
          boxShadow: "0 10px 25px rgba(2,132,199,0.25)",
          maxWidth: "80%",
        }}
      >
        Bạn tìm giúp tôi tài liệu về AI Agent?
      </div>

      {/* Bot Bubble 1 */}
      <div
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          padding: "20px 32px",
          borderRadius: "28px 28px 28px 4px",
          fontSize: 28,
          fontWeight: 500,
          border: "4px solid #0f172a",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          maxWidth: "80%",
        }}
      >
        Đây là vài tài liệu về AI Agent...
      </div>

      {/* User Bubble 2 (Repeating prompt) */}
      <div
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#0284c7",
          color: "#ffffff",
          padding: "20px 32px",
          borderRadius: "28px 28px 4px 28px",
          fontSize: 28,
          fontWeight: 600,
          boxShadow: "0 10px 25px rgba(2,132,199,0.25)",
          maxWidth: "80%",
          opacity: frame > 60 ? 1 : 0.3,
          transform: `translateY(${frame > 60 ? 0 : 20}px)`,
        }}
      >
        Bây giờ hãy tóm tắt và gửi vào email giúp tôi?
      </div>

      {/* Bot limitation */}
      <div
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          padding: "20px 32px",
          borderRadius: "28px 28px 28px 4px",
          fontSize: 28,
          fontWeight: 600,
          border: "4px solid #ef4444",
          boxShadow: "0 10px 25px rgba(239,68,68,0.15)",
          maxWidth: "85%",
          opacity: frame > 120 ? 1 : 0,
        }}
      >
        ❌ Tôi không thể tự gửi email hay truy cập phần mềm ngoài!
      </div>
    </div>
  );
};

/** 5-Step Process Diagram for S04 */
export const FiveStepWorkflow: React.FC<{ activeStep?: number; style?: React.CSSProperties }> = ({
  activeStep = 1,
  style,
}) => {
  const steps = [
    { num: 1, name: "Goal", desc: "Tiếp nhận mục tiêu", color: "#38bdf8" },
    { num: 2, name: "Planning", desc: "Phân rã kế hoạch", color: "#818cf8" },
    { num: 3, name: "Tool Use", desc: "Chọn công cụ", color: "#c084fc" },
    { num: 4, name: "Execution", desc: "Thực thi hành động", color: "#f472b6" },
    { num: 5, name: "Evaluation", desc: "Kiểm tra & Sửa lỗi", color: "#4ade80" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 760, ...style }}>
      {steps.map((st) => {
        const isActive = activeStep === st.num;
        return (
          <div
            key={st.num}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: isActive ? "#0f172a" : "#ffffff",
              color: isActive ? "#ffffff" : "#0f172a",
              border: `5px solid ${isActive ? st.color : "#cbd5e1"}`,
              borderRadius: 24,
              padding: "16px 28px",
              boxShadow: isActive ? `0 12px 30px ${st.color}40` : "0 4px 12px rgba(0,0,0,0.04)",
              transform: isActive ? "scale(1.04) translateX(12px)" : "scale(1)",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                backgroundColor: st.color,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                marginRight: 24,
              }}
            >
              {st.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{st.name}</div>
              <div style={{ fontSize: 22, opacity: isActive ? 0.9 : 0.6 }}>{st.desc}</div>
            </div>
            {isActive && (
              <div style={{ fontSize: 28, color: st.color, fontWeight: 800 }}>⚡ ACTIVE</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Tool Icons Group for S06 */
export const ToolIconsGroup: React.FC<{ activeTool?: string; style?: React.CSSProperties }> = ({
  activeTool = "browser",
  style,
}) => {
  const tools = [
    { id: "browser", label: "Browser", icon: "🌐", color: "#0284c7" },
    { id: "database", label: "Database", icon: "🗄️", color: "#8b5cf6" },
    { id: "api", label: "REST / API", icon: "🔌", color: "#ec4899" },
    { id: "filesystem", label: "File System", icon: "📁", color: "#10b981" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, width: 720, ...style }}>
      {tools.map((t) => {
        const isSelected = activeTool === t.id;
        return (
          <div
            key={t.id}
            style={{
              backgroundColor: isSelected ? "#0f172a" : "#ffffff",
              border: `6px solid ${isSelected ? t.color : "#0f172a"}`,
              borderRadius: 32,
              padding: "36px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isSelected ? `0 16px 40px ${t.color}50` : "0 8px 20px rgba(0,0,0,0.06)",
              transform: isSelected ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 12 }}>{t.icon}</div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: isSelected ? "#ffffff" : "#0f172a",
              }}
            >
              {t.label}
            </div>
            {isSelected && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  fontWeight: 700,
                  color: t.color,
                  letterSpacing: 1,
                }}
              >
                ● CONNECTED
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
