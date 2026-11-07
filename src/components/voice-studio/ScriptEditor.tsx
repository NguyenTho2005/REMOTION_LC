/* eslint-disable @remotion/non-pure-animation */
import React from "react";
import { SAMPLE_SCRIPTS } from "../../hooks/useTTS";

interface ScriptEditorProps {
  script: string;
  isGenerating: boolean;
  selectedVoiceName: string;
  onChangeScript: (text: string) => void;
  onGenerate: () => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  isGenerating,
  selectedVoiceName,
  onChangeScript,
  onGenerate,
}) => {
  const charCount = script.length;
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#e5e7eb" }}>
          Kịch bản lời thoại
        </label>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          {wordCount} từ · {charCount} ký tự
        </div>
      </div>

      <textarea
        rows={4}
        value={script}
        onChange={(e) => onChangeScript(e.target.value)}
        placeholder="Nhập nội dung lời thoại tiếng Việt..."
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          backgroundColor: "#181822",
          border: "1px solid #2e2e42",
          color: "#ffffff",
          fontSize: "13px",
          lineHeight: "1.5",
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />

      {/* Quick sample script chips */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", color: "#6b7280" }}>Mẫu:</span>
        {SAMPLE_SCRIPTS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChangeScript(s)}
            style={{
              fontSize: "10px",
              padding: "3px 8px",
              borderRadius: "4px",
              backgroundColor: "#222230",
              color: "#9ca3af",
              border: "1px solid #333344",
              cursor: "pointer",
            }}
          >
            Mẫu {idx + 1}
          </button>
        ))}
        {script.length > 0 && (
          <button
            type="button"
            onClick={() => onChangeScript("")}
            style={{
              fontSize: "10px",
              padding: "3px 8px",
              borderRadius: "4px",
              backgroundColor: "#2e1a1a",
              color: "#f87171",
              border: "none",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            Xóa
          </button>
        )}
      </div>

      {/* Generate Button */}
      <button
        type="button"
        disabled={isGenerating || !script.trim()}
        onClick={onGenerate}
        style={{
          marginTop: "4px",
          padding: "10px 16px",
          borderRadius: "8px",
          backgroundColor: isGenerating || !script.trim() ? "#374151" : "#4f46e5",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: "13px",
          border: "none",
          cursor: isGenerating || !script.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "background-color 0.2s",
        }}
      >
        {isGenerating ? (
          <>
            <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
            Đang tạo giọng {selectedVoiceName}...
          </>
        ) : (
          <>🎙️ Tạo âm thanh với {selectedVoiceName}</>
        )}
      </button>
    </div>
  );
};
