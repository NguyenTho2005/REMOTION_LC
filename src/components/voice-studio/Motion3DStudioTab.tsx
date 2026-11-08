import React, { useState } from "react";
import type {
  CameraPreset,
  LightingPreset,
  QualityPreset,
  AnimationType,
  ObjectType,
} from "../../three/core/types";

export interface Motion3DStudioTabProps {
  onRender3D?: (templateName: string) => void;
}

export const Motion3DStudioTab: React.FC<Motion3DStudioTabProps> = ({ onRender3D }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Template01TechExplainer");
  const [selectedObject, setSelectedObject] = useState<ObjectType>("networkGraph");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("orbit");
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("cyberpunk");
  const [animationType, setAnimationType] = useState<AnimationType>("rotate");
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>("standard");
  const [bgColor, setBgColor] = useState<string>("#080B16");
  const [durationSeconds, setDurationSeconds] = useState<number>(5);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const templates = [
    { id: "Template01TechExplainer", label: "01 · Tech Explainer (AI & Network)", icon: "🧠" },
    { id: "Template02ProductShowcase", label: "02 · Product Showcase (3D Device)", icon: "💎" },
    { id: "Template03AlgorithmViz", label: "03 · Algorithm Viz (Binary Search)", icon: "⚡" },
    { id: "Template04DataViz", label: "04 · Data Viz (3D Bar Charts)", icon: "📊" },
    { id: "Template05CinematicIntro", label: "05 · Cinematic Intro (Hook & Glow)", icon: "🎬" },
    { id: "Template06HybridExplainer", label: "06 · Hybrid 2D + 3D (TikTok Callouts)", icon: "📐" },
  ];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setStatusMessage("Đang tính toán lại ma trận 3D và cấu hình Camera/Lighting...");
    setTimeout(() => {
      setIsRegenerating(false);
      setStatusMessage("✔ Đã tái tạo cấu hình 3D Scene thành công!");
      setTimeout(() => setStatusMessage(null), 3500);
    }, 600);
  };

  const handleRender = () => {
    if (onRender3D) {
      onRender3D(selectedTemplate);
    } else {
      setStatusMessage(`Lệnh render: npx remotion render ThreeMotionShowcase out/three-motion.mp4`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        padding: "16px",
        fontSize: "13px",
        color: "#E2E8F0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🧊</span>
          <span style={{ fontWeight: 800, fontSize: "14px", color: "#38BDF8" }}>
            3D Motion Engine Studio
          </span>
        </div>
        <span
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            color: "#38BDF8",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: 700,
          }}
        >
          Three.js / R3F
        </span>
      </div>

      {/* Template Selection */}
      <div>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
          3D TEMPLATE FAMILY
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#161622",
            border: "1px solid #2E2E46",
            borderRadius: "8px",
            color: "#FFFFFF",
            padding: "8px 10px",
            fontSize: "12px",
            outline: "none",
          }}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Row: Object & Animation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            3D OBJECT
          </label>
          <select
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value as ObjectType)}
            style={{
              width: "100%",
              backgroundColor: "#161622",
              border: "1px solid #2E2E46",
              borderRadius: "8px",
              color: "#FFFFFF",
              padding: "7px 8px",
              fontSize: "12px",
            }}
          >
            <option value="networkGraph">Network Graph</option>
            <option value="cube">Cube (Hộp 3D)</option>
            <option value="sphere">Sphere (Khối cầu)</option>
            <option value="torus">Torus (Vòng Neon)</option>
            <option value="text3d">3D Typography</option>
            <option value="particles">Particle Cloud</option>
            <option value="barChart">3D Bar Chart</option>
            <option value="gltfModel">GLTF/GLB Model</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            ANIMATION PRESET
          </label>
          <select
            value={animationType}
            onChange={(e) => setAnimationType(e.target.value as AnimationType)}
            style={{
              width: "100%",
              backgroundColor: "#161622",
              border: "1px solid #2E2E46",
              borderRadius: "8px",
              color: "#FFFFFF",
              padding: "7px 8px",
              fontSize: "12px",
            }}
          >
            <option value="rotate">Rotate (Xoay liên tục)</option>
            <option value="pulse">Pulse (Đập nhịp)</option>
            <option value="float">Float (Lơ lửng)</option>
            <option value="scaleUp">Scale Up (Phóng lớn)</option>
            <option value="explode">Explode (Phát nổ)</option>
            <option value="orbit">Orbit (Quỹ đạo)</option>
            <option value="dataFlow">Data Flow (Dòng dữ liệu)</option>
          </select>
        </div>
      </div>

      {/* Row: Camera & Lighting */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            CAMERA PRESET
          </label>
          <select
            value={cameraPreset}
            onChange={(e) => setCameraPreset(e.target.value as CameraPreset)}
            style={{
              width: "100%",
              backgroundColor: "#161622",
              border: "1px solid #2E2E46",
              borderRadius: "8px",
              color: "#FFFFFF",
              padding: "7px 8px",
              fontSize: "12px",
            }}
          >
            <option value="orbit">Orbit (Quay vòng 360)</option>
            <option value="dolly">Dolly (Tiến lại gần)</option>
            <option value="zoom">Zoom (Thu phóng)</option>
            <option value="static">Static (Cố định)</option>
            <option value="flyThrough">Fly Through (Bay xuyên)</option>
            <option value="topDown">Top Down (Nhìn trên xuống)</option>
            <option value="isometric">Isometric (Góc nghiêng)</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            LIGHTING PRESET
          </label>
          <select
            value={lightingPreset}
            onChange={(e) => setLightingPreset(e.target.value as LightingPreset)}
            style={{
              width: "100%",
              backgroundColor: "#161622",
              border: "1px solid #2E2E46",
              borderRadius: "8px",
              color: "#FFFFFF",
              padding: "7px 8px",
              fontSize: "12px",
            }}
          >
            <option value="cyberpunk">Cyberpunk (Neon hồng/cyan)</option>
            <option value="studio">Studio (Trắng trung tính)</option>
            <option value="dramatic">Dramatic (Tương phản cao)</option>
            <option value="warm">Warm (Vàng ấm)</option>
            <option value="cool">Cool (Xanh mát)</option>
            <option value="flat">Flat (Đều sáng)</option>
          </select>
        </div>
      </div>

      {/* Row: Background Color & Duration & Quality */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            NỀN 3D
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{
                width: "28px",
                height: "28px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: "transparent",
              }}
            />
            <span style={{ fontSize: "10px", color: "#CBD5E1" }}>{bgColor}</span>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            THỜI LƯỢNG
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="number"
              min={2}
              max={30}
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(Number(e.target.value))}
              style={{
                width: "100%",
                backgroundColor: "#161622",
                border: "1px solid #2E2E46",
                borderRadius: "6px",
                color: "#FFFFFF",
                padding: "6px 4px",
                fontSize: "12px",
                textAlign: "center",
              }}
            />
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>s</span>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "6px" }}>
            CHẤT LƯỢNG
          </label>
          <select
            value={qualityPreset}
            onChange={(e) => setQualityPreset(e.target.value as QualityPreset)}
            style={{
              width: "100%",
              backgroundColor: "#161622",
              border: "1px solid #2E2E46",
              borderRadius: "6px",
              color: "#FFFFFF",
              padding: "6px 4px",
              fontSize: "11px",
            }}
          >
            <option value="preview">Preview</option>
            <option value="standard">Standard</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            color: "#38BDF8",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          style={{
            flex: 1,
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
          }}
        >
          {isRegenerating ? "Đang xử lý..." : "🔄 Tái Tạo Scene 3D"}
        </button>

        <button
          onClick={handleRender}
          style={{
            flex: 1,
            backgroundColor: "#10B981",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
          }}
        >
          🚀 Xuất Video 3D (MP4)
        </button>
      </div>
    </div>
  );
};
