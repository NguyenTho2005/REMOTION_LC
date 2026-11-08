import React from "react";
import { useCurrentFrame } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { ToolIconsGroup } from "../StickmanProps";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S06ToolCalling: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  // Cycle through tools as the voice describes them
  let activeTool = "browser";
  if (frame > 260) activeTool = "filesystem";
  else if (frame > 180) activeTool = "database";
  else if (frame > 100) activeTool = "api";

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
            backgroundColor: "#ec4899",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 06 / CÔNG CỤ
        </div>
        <div style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
          TOOL CALLING & ACTIONS
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
          Tương Tác Với Phần Mềm Bên Ngoài
        </div>
      </div>

      {/* Center Tool Grid */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 180,
        }}
      >
        <ToolIconsGroup activeTool={activeTool} />
      </div>

      {/* Floating Robot pointing at active tool */}
      <div
        style={{
          position: "absolute",
          top: 880,
          right: 120,
        }}
      >
        <CompanionRobot expression="happy" scale={1.4} />
      </div>

      {/* Stickman pointing at bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 530,
          left: 140,
        }}
      >
        <Stickman pose="pointing" scale={1.35} facing="right" />
      </div>

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="Tool Calling" />
    </div>
  );
};
