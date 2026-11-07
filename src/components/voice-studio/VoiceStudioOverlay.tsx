/* eslint-disable @remotion/non-pure-animation */
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getRemotionEnvironment } from "remotion";
import { VoiceStudioPanel } from "./VoiceStudioPanel";

export const VoiceStudioOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render in Studio environment
  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const env = getRemotionEnvironment();
  if (env.isRendering) {
    return null;
  }

  const overlayContent = (
    <>
      {/* Floating Toggle Button */}
      <div
        style={{
          position: "fixed",
          top: "14px",
          right: isOpen ? "390px" : "16px",
          zIndex: 999999,
          transition: "right 0.25s ease",
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "20px",
            backgroundColor: isOpen ? "#312e81" : "#4f46e5",
            color: "#ffffff",
            border: "1px solid #818cf8",
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: "16px" }}>🎙️</span>
          <span>{isOpen ? "Thu gọn Voice Studio" : "Mở Voice Studio"}</span>
        </button>
      </div>

      {/* Slide-out Sidebar Panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "380px",
            zIndex: 999998,
            boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.6)",
            animation: "slideInRight 0.2s ease-out",
          }}
        >
          <VoiceStudioPanel isDocked={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );

  return createPortal(overlayContent, document.body);
};
