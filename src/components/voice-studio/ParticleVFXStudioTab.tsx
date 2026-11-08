import React, { useState } from "react";
import { random } from "remotion";
import type { ParticlePresetType, ParticleQualityPreset } from "../../three/particles/types";
import { PARTICLE_QUALITY_BUDGETS } from "../../three/particles/types";

export interface ParticleVFXStudioTabProps {
  onApplyPreset?: (config: Record<string, unknown>) => void;
}

export const ParticleVFXStudioTab: React.FC<ParticleVFXStudioTabProps> = ({ onApplyPreset }) => {
  const [selectedPreset, setSelectedPreset] = useState<ParticlePresetType>("explosion");
  const [particleCount, setParticleCount] = useState<number>(3500);
  const [primaryColor, setPrimaryColor] = useState<string>("#38BDF8");
  const [secondaryColor, setSecondaryColor] = useState<string>("#EC4899");
  const [speed, setSpeed] = useState<number>(1.0);
  const [spread, setSpread] = useState<number>(5.0);
  const [quality, setQuality] = useState<ParticleQualityPreset>("standard");
  const [seed, setSeed] = useState<number>(42);
  const [enableBloom, setEnableBloom] = useState<boolean>(true);
  const [durationSec, setDurationSec] = useState<number>(4);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const presets: Array<{ id: ParticlePresetType; label: string; icon: string; desc: string }> = [
    { id: "explosion", label: "01 · Particle Explosion", icon: "💥", desc: "Nổ hạt từ tâm, áp dụng cho hook mở màn và cú hích ấn tượng" },
    { id: "formation", label: "02 · Particle Formation", icon: "🧩", desc: "Hàng ngàn hạt tụ lại thành hình khối mục tiêu (Cube, Sphere, Torus)" },
    { id: "disintegration", label: "03 · Particle Disintegration", icon: "💨", desc: "Vật thể 3D tan biến thành các hạt bay theo gió" },
    { id: "wave", label: "04 · Particle Wave", icon: "🌊", desc: "Sóng hạt uốn lượn đa hài âm cho nền công nghệ & neural network" },
    { id: "galaxy", label: "05 · Particle Galaxy", icon: "🌌", desc: "Thiên hà xoắn ốc với tốc độ quay vi sai và lõi phát sáng" },
    { id: "data-flow", label: "06 · Particle Data Flow", icon: "⚡", desc: "Luồng hạt di chuyển dọc đường cong 3D kết nối các nút API/Model" },
    { id: "energy-sphere", label: "07 · Particle Energy Sphere", icon: "🔮", desc: "Khối cầu năng lượng xung kích với nhiễu loạn bề mặt" },
    { id: "tunnel", label: "08 · Particle Tunnel", icon: "🌀", desc: "Hầm hạt 3D vô tận bay xuyên không gian với tốc độ warp" },
    { id: "hologram", label: "09 · Particle Hologram", icon: "📡", desc: "Hình chiếu Hologram kỹ thuật số với đường quét scanline" },
    { id: "morphing", label: "10 · Particle Morphing", icon: "🔄", desc: "Biến hình hạt mượt mà giữa 2 hình khối với định danh ổn định" },
  ];

  const handleRegenerate = () => {
    const newSeed = Math.floor(random(null) * 9000) + 1000;
    setSeed(newSeed);
    setStatusMessage(`✔ Đã cập nhật Seed ngẫu nhiên: ${newSeed}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleApply = () => {
    const payload = {
      preset: selectedPreset,
      particleCount,
      color: primaryColor,
      secondaryColor,
      speed,
      spread,
      quality,
      seed,
      enableBloom,
      durationInFrames: durationSec * 30,
    };

    if (onApplyPreset) {
      onApplyPreset(payload);
    }
    setStatusMessage(`✔ Đã áp dụng preset "${selectedPreset}" vào Composition!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const currentPresetInfo = presets.find((p) => p.id === selectedPreset);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        fontSize: "13px",
        color: "#E2E8F0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>✨</span>
          <span style={{ fontWeight: 800, fontSize: "14px", color: "#38BDF8" }}>
            Particle VFX Engine Studio
          </span>
        </div>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            backgroundColor: "#065F46",
            color: "#6EE7B7",
            borderRadius: "10px",
            fontWeight: 700,
          }}
        >
          DevPeek36 GPU
        </span>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#0F281E",
            border: "1px solid #059669",
            borderRadius: "6px",
            color: "#34D399",
            fontSize: "11px",
            lineHeight: 1.4,
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* Preset Selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>
          CHỌN HIỆU ỨNG HẠT (10 PRESETS)
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value as ParticlePresetType)}
          style={{
            padding: "8px 10px",
            backgroundColor: "#1E2235",
            border: "1px solid #334155",
            borderRadius: "6px",
            color: "#FFFFFF",
            fontSize: "12px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.icon} {p.label}
            </option>
          ))}
        </select>
        {currentPresetInfo && (
          <div style={{ fontSize: "11px", color: "#38BDF8", marginTop: "2px", lineHeight: 1.4 }}>
            {currentPresetInfo.desc}
          </div>
        )}
      </div>

      {/* Particle Count Slider */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>SỐ LƯỢNG HẠT</label>
          <span style={{ color: "#38BDF8", fontWeight: 700 }}>
            {particleCount.toLocaleString()} hạt (Tối đa {PARTICLE_QUALITY_BUDGETS[quality].maxParticles.toLocaleString()})
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={PARTICLE_QUALITY_BUDGETS[quality].maxParticles}
          step={500}
          value={particleCount}
          onChange={(e) => setParticleCount(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#38BDF8" }}
        />
      </div>

      {/* Colors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>MÀU CHỦ ĐẠO</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{
                width: "36px",
                height: "28px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: "transparent",
              }}
            />
            <span style={{ fontSize: "11px", color: "#CBD5E1" }}>{primaryColor}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>MÀU PHỐI / GLOW</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              style={{
                width: "36px",
                height: "28px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: "transparent",
              }}
            />
            <span style={{ fontSize: "11px", color: "#CBD5E1" }}>{secondaryColor}</span>
          </div>
        </div>
      </div>

      {/* Speed & Spread */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>
            TỐC ĐỘ: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min={0.2}
            max={3.0}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#818CF8" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>
            ĐỘ PHÂN TÁN: {spread.toFixed(1)}
          </label>
          <input
            type="range"
            min={1.0}
            max={12.0}
            step={0.5}
            value={spread}
            onChange={(e) => setSpread(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#EC4899" }}
          />
        </div>
      </div>

      {/* Duration Control */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>THỜI LƯỢNG HIỆU ỨNG</label>
          <span style={{ color: "#38BDF8", fontWeight: 700 }}>{durationSec}s ({durationSec * 30} frames)</span>
        </div>
        <input
          type="range"
          min={2}
          max={10}
          step={1}
          value={durationSec}
          onChange={(e) => setDurationSec(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#38BDF8" }}
        />
      </div>

      {/* Quality & Seed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>CHẤT LƯỢNG RENDER</label>
          <select
            value={quality}
            onChange={(e) => {
              const q = e.target.value as ParticleQualityPreset;
              setQuality(q);
              if (particleCount > PARTICLE_QUALITY_BUDGETS[q].maxParticles) {
                setParticleCount(PARTICLE_QUALITY_BUDGETS[q].maxParticles);
              }
            }}
            style={{
              padding: "6px 8px",
              backgroundColor: "#1E2235",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#FFFFFF",
              fontSize: "11px",
            }}
          >
            <option value="preview">Preview (1k hạt, 1x DPR)</option>
            <option value="standard">Standard (5k hạt, 1.5x DPR)</option>
            <option value="high">High (15k hạt, 2x DPR)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontWeight: 700, fontSize: "11px", color: "#94A3B8" }}>SEED: {seed}</label>
          <button
            type="button"
            onClick={handleRegenerate}
            style={{
              padding: "6px 8px",
              backgroundColor: "#312E81",
              border: "1px solid #4338CA",
              borderRadius: "6px",
              color: "#C7D2FE",
              fontWeight: 600,
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            🎲 Đổi Seed Ngẫu Nhiên
          </button>
        </div>
      </div>

      {/* Bloom toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#CBD5E1" }}>Bật Soft Glow / Bloom Shader</span>
        <input
          type="checkbox"
          checked={enableBloom}
          onChange={(e) => setEnableBloom(e.target.checked)}
          style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#38BDF8" }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
        <button
          type="button"
          onClick={handleApply}
          style={{
            flex: 1,
            padding: "10px 14px",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
          }}
        >
          🚀 Áp Dụng Cho Scene
        </button>
      </div>

      {/* JSON Payload Inspector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
        <label style={{ fontWeight: 700, fontSize: "10px", color: "#64748B" }}>
          CẤU HÌNH JSON (AI-COMPATIBLE)
        </label>
        <pre
          style={{
            margin: 0,
            padding: "10px",
            backgroundColor: "#0B0E17",
            borderRadius: "6px",
            fontSize: "10px",
            color: "#38BDF8",
            overflowX: "auto",
            maxHeight: "120px",
            border: "1px solid #1E293B",
          }}
        >
          {JSON.stringify(
            {
              type: "3d-particle",
              preset: selectedPreset,
              durationInFrames: durationSec * 30,
              particleCount,
              seed,
              colors: [primaryColor, secondaryColor],
              quality,
              bloom: enableBloom,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
