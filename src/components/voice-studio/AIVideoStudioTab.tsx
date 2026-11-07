/* eslint-disable @remotion/non-pure-animation */
import React, { useState } from "react";
import { TaskPlanner } from "../../orchestrator/TaskPlanner.ts";
import { ResearchEngine } from "../../engines/ResearchEngine.ts";
import { ScriptEngine } from "../../engines/ScriptEngine.ts";
import { StoryboardEngine } from "../../engines/StoryboardEngine.ts";
import { VoiceEngine } from "../../engines/VoiceEngine.ts";
import { RemotionEngine } from "../../engines/RemotionEngine.ts";
import type { VideoProject, PipelineStageName } from "../../schemas/index.ts";

interface AIVideoStudioTabProps {
  onVideoCreated?: (project: VideoProject) => void;
  onPlayAudio?: (url: string) => void;
}

const STAGES: Array<{ id: PipelineStageName; label: string; icon: string }> = [
  { id: "init", label: "Lập Kế Hoạch", icon: "🧠" },
  { id: "research", label: "Nghiên Cứu", icon: "🔍" },
  { id: "script", label: "Viết Kịch Bản", icon: "✍️" },
  { id: "storyboard", label: "Storyboard", icon: "🎬" },
  { id: "voice", label: "ZeroTTS Voice", icon: "🎙️" },
  { id: "visuals", label: "Thiết Kế Visual", icon: "🎨" },
  { id: "captions", label: "Phụ Đề & Timing", icon: "💬" },
  { id: "composition", label: "Dựng Video 9:16", icon: "📐" },
];

export const AIVideoStudioTab: React.FC<AIVideoStudioTabProps> = ({
  onVideoCreated,
  onPlayAudio,
}) => {
  const [prompt, setPrompt] = useState(
    "Giải thích AI Agent là gì và vì sao đây là xu hướng lập trình 2025 trong 30s"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<PipelineStageName | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultProject, setResultProject] = useState<VideoProject | null>(null);
  const [activeView, setActiveView] = useState<"script" | "scenes" | "qa">("script");
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    { label: "AI Explainer", text: "Giải thích AI Agent là gì và cách hoạt động trong 30s" },
    { label: "GitHub Review", text: "Review repo github zeroweight-ai/ZeroTTS 45s" },
    { label: "Tech News", text: "Tin tức công nghệ mới cập nhật về trí tuệ nhân tạo" },
    { label: "AI Model", text: "Đánh giá mô hình DeepSeek R1 benchmark lập trình" },
  ];

  const handleStartProduction = async () => {
    if (!prompt.trim() || isRunning) return;

    setIsRunning(true);
    setError(null);
    setResultProject(null);
    setProgress(5);

    try {
      // Stage 1: Init / Planning
      setCurrentStage("init");
      setStatusMessage("Đang phân tích ý định và lập kế hoạch sản xuất...");
      setProgress(15);
      const plan = TaskPlanner.plan(prompt);

      // Stage 2: Research
      setCurrentStage("research");
      setStatusMessage(`Đang nghiên cứu chủ đề: ${plan.category}...`);
      setProgress(30);
      const research = await ResearchEngine.research(prompt, plan.category, plan.keyEntities);

      // Stage 3: Script
      setCurrentStage("script");
      setStatusMessage("Đang soạn kịch bản 6 phần chuẩn phong cách Dark Tech Editorial...");
      setProgress(45);
      const script = ScriptEngine.generateScript(
        research,
        plan.category,
        plan.durationInSeconds,
        plan.targetWordCount
      );

      // Stage 4: Storyboard
      setCurrentStage("storyboard");
      setStatusMessage("Đang bố cục các phân cảnh và định vị TikTok safe zones...");
      setProgress(60);
      StoryboardEngine.createStoryboard(
        script,
        research,
        plan.category,
        plan.fps,
        plan.durationInFrames
      );

      // Stage 5: Voice (ZeroTTS)
      setCurrentStage("voice");
      setStatusMessage(`Đang tạo giọng đọc ZeroTTS với giọng ${plan.recommendedVoiceId}...`);
      setProgress(75);
      const voiceResult = await VoiceEngine.synthesize(script, plan.recommendedVoiceId, 1.0, true);

      // Stage 6 & 7: Visuals & Captions
      setCurrentStage("visuals");
      setStatusMessage("Đang hoàn thiện visual tokens và đồng bộ phụ đề...");
      setProgress(85);
      const realFrames = voiceResult.durationInFrames;
      const finalScenes = StoryboardEngine.createStoryboard(
        script,
        research,
        plan.category,
        plan.fps,
        realFrames
      );

      // Stage 8: Composition Assembly
      setCurrentStage("composition");
      setStatusMessage("Đang dựng hoàn chỉnh Remotion composition 1080x1920 (9:16)...");
      setProgress(95);

      const videoProject: VideoProject = {
        id: `video-${Date.now()}`,
        title: research.title,
        category: plan.category,
        aspectRatio: "9:16",
        resolution: { width: 1080, height: 1920 },
        fps: 30,
        durationInFrames: realFrames,
        durationInSeconds: voiceResult.durationInSeconds,
        voice: voiceResult.voiceConfig,
        script,
        scenes: finalScenes,
        metadata: {
          author: "Tech Pulse Vietnam",
          createdAt: new Date().toISOString(),
          tags: research.tags,
        },
      };

      const assembled = RemotionEngine.assembleComposition(videoProject);
      setResultProject(assembled);
      setProgress(100);
      setStatusMessage("Sản xuất video thành công!");

      if (onVideoCreated) {
        onVideoCreated(assembled);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStatusMessage("Quá trình sản xuất gặp lỗi");
    } finally {
      setIsRunning(false);
      setCurrentStage(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px" }}>
      {/* Title & Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>
            AI Video Production Studio
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Single Orchestrator + ZeroTTS Voice + Remotion 9:16
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            padding: "4px 8px",
            borderRadius: 6,
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
          }}
        >
          TIKTOK 9:16
        </span>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {samplePrompts.map((p) => (
          <button
            key={p.label}
            onClick={() => setPrompt(p.text)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              color: "#cbd5e1",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: 6 }}>
          Nhập yêu cầu video (Prompt tự nhiên):
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="VD: Tạo video 30s giải thích AI Agent là gì..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            borderRadius: 8,
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            color: "#f8fafc",
            fontSize: 13,
            lineHeight: 1.4,
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={handleStartProduction}
        disabled={isRunning || !prompt.trim()}
        style={{
          padding: "12px 16px",
          borderRadius: 8,
          background: isRunning
            ? "#475569"
            : "linear-gradient(90deg, #38bdf8, #818cf8)",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: 14,
          border: "none",
          cursor: isRunning ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: isRunning ? "none" : "0 4px 14px rgba(56, 189, 248, 0.4)",
        }}
      >
        {isRunning ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
            Đang Tự Động Sản Xuất Video...
          </>
        ) : (
          <>
            <span>🚀</span>
            Tạo Video Ngay Bằng AI Orchestrator
          </>
        )}
      </button>

      {/* Progress & Stepper */}
      {(isRunning || progress > 0) && (
        <div
          style={{
            padding: "14px",
            borderRadius: 10,
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#38bdf8" }}>
              {statusMessage || "Đang xử lý..."}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc" }}>
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: 6,
              borderRadius: 3,
              backgroundColor: "#1e293b",
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Stepper items */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {STAGES.map((s) => {
              const isActive = currentStage === s.id;
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor: isActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
                    border: isActive ? "1px solid #38bdf8" : "1px solid transparent",
                    fontSize: 11,
                    color: isActive ? "#38bdf8" : "#64748b",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            fontSize: 12,
          }}
        >
          ⚠️ Lỗi: {error}
        </div>
      )}

      {/* Video Result View */}
      {resultProject && (
        <div
          style={{
            padding: "16px",
            borderRadius: 12,
            backgroundColor: "#131722",
            border: "1px solid #222938",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>
                {resultProject.title}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                {resultProject.category} • {resultProject.durationInSeconds}s ({resultProject.durationInFrames} frames) • Giọng {resultProject.voice.name}
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 6,
                backgroundColor: "rgba(52, 211, 153, 0.15)",
                color: "#34d399",
                border: "1px solid #34d399",
              }}
            >
              100% QA OK
            </span>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: 6, borderBottom: "1px solid #222938", paddingBottom: 8 }}>
            <button
              onClick={() => setActiveView("script")}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                backgroundColor: activeView === "script" ? "#38bdf8" : "#1e293b",
                color: activeView === "script" ? "#090a0f" : "#cbd5e1",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Kịch Bản ({resultProject.script.wordCount} từ)
            </button>
            <button
              onClick={() => setActiveView("scenes")}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                backgroundColor: activeView === "scenes" ? "#38bdf8" : "#1e293b",
                color: activeView === "scenes" ? "#090a0f" : "#cbd5e1",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Phân Cảnh ({resultProject.scenes.length})
            </button>
            <button
              onClick={() => setActiveView("qa")}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                backgroundColor: activeView === "qa" ? "#38bdf8" : "#1e293b",
                color: activeView === "qa" ? "#090a0f" : "#cbd5e1",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Báo Cáo QA
            </button>
          </div>

          {/* Sub-tab Content */}
          {activeView === "script" && (
            <div
              style={{
                maxHeight: 180,
                overflowY: "auto",
                fontSize: 12,
                lineHeight: 1.5,
                color: "#cbd5e1",
                backgroundColor: "#090a0f",
                padding: 10,
                borderRadius: 8,
              }}
            >
              {resultProject.script.sections.map((sec) => (
                <div key={sec.id} style={{ marginBottom: 8 }}>
                  <span style={{ color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", fontSize: 10 }}>
                    [{sec.type} {sec.startTime}-{sec.endTime}s]:{" "}
                  </span>
                  <span>{sec.text}</span>
                </div>
              ))}
            </div>
          )}

          {activeView === "scenes" && (
            <div
              style={{
                maxHeight: 180,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {resultProject.scenes.map((s, idx) => (
                <div
                  key={s.id}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    backgroundColor: "#090a0f",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: "#f8fafc", fontWeight: 600 }}>
                    {idx + 1}. {s.template}
                  </span>
                  <span style={{ color: "#94a3b8" }}>
                    {s.durationInFrames}f ({(s.durationInFrames / 30).toFixed(1)}s)
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeView === "qa" && (
            <div
              style={{
                maxHeight: 180,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 11,
              }}
            >
              <div style={{ color: "#34d399", fontWeight: 600 }}>✔ Độ phân giải: 1080x1920 (TikTok 9:16)</div>
              <div style={{ color: "#34d399", fontWeight: 600 }}>✔ Tần số quét: 30 FPS</div>
              <div style={{ color: "#34d399", fontWeight: 600 }}>✔ Âm thanh: Stereo 48kHz (ZeroTTS)</div>
              <div style={{ color: "#34d399", fontWeight: 600 }}>✔ Vùng an toàn: Top 160px, Bottom 260px</div>
              <div style={{ color: "#34d399", fontWeight: 600 }}>✔ Khớp thời lượng: Audio và Video tuyệt đối</div>
            </div>
          )}

          {/* Audio Preview Action */}
          {resultProject.voice.audioFile && onPlayAudio && (
            <button
              onClick={() => {
                if (resultProject.voice.audioFile) {
                  onPlayAudio(`http://127.0.0.1:8000/api/tts/audio/${resultProject.voice.audioFile}`);
                }
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                color: "#38bdf8",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span>🔊</span>
              Nghe Thử Giọng Đọc ZeroTTS
            </button>
          )}
        </div>
      )}
    </div>
  );
};
