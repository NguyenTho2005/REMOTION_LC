import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "../Stickman";
import { CompanionRobot } from "../CompanionRobot";
import { DeskAndLaptop, FastClock, PaperStack } from "../StickmanProps";
import { StickmanSubtitle } from "../StickmanSubtitle";

export const S01Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stickman pose shifts from typing (frantic) to exhausted
  const pose = frame < 150 ? "typing" : "exhausted";

  // Robot entrance at frame 160
  const robotSpring = spring({
    frame: frame - 160,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const robotX = interpolate(robotSpring, [0, 1], [1150, 720]);

  // Big Banner "AI AGENT?" popup at frame 220
  const bannerSpring = spring({
    frame: frame - 220,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const bannerScale = interpolate(bannerSpring, [0, 1], [0, 1]);

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
      {/* Background Grid Accent */}
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

      {/* Top Header Badge */}
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
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "10px 24px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          ● 01 / HOOK
        </div>
        <div
          style={{
            color: "#64748b",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          24/7 AUTONOMOUS WORKER
        </div>
      </div>

      {/* Fast Clock on Wall */}
      <div style={{ position: "absolute", top: 320, right: 140 }}>
        <FastClock />
        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 20,
            fontWeight: 700,
            color: "#ef4444",
          }}
        >
          24H / 7 NGÀY
        </div>
      </div>

      {/* Desk and Sitting Stickman */}
      <div style={{ position: "absolute", bottom: 580, left: 160 }}>
        {/* Stickman */}
        <div style={{ position: "absolute", left: 10, bottom: 20 }}>
          <Stickman pose={pose} scale={1.35} accessory="glasses" />
        </div>
        {/* Desk with laptop */}
        <div style={{ position: "absolute", left: 100, bottom: 0 }}>
          <DeskAndLaptop />
        </div>
        {/* Stack of Papers */}
        <div style={{ position: "absolute", left: 340, bottom: 60 }}>
          <PaperStack />
        </div>
      </div>

      {/* Companion Robot Flying In */}
      {frame >= 160 && (
        <div
          style={{
            position: "absolute",
            bottom: 720,
            left: robotX,
            transform: "translate(-50%, 0)",
          }}
        >
          <CompanionRobot expression="happy" scale={1.5} holdingTray={frame > 200} />
          <div
            style={{
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#38bdf8",
              color: "#0f172a",
              padding: "6px 18px",
              borderRadius: 14,
              fontSize: 20,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            "Tôi nhận việc nhé!"
          </div>
        </div>
      )}

      {/* Big Central Popup Banner "AI AGENT?" */}
      {frame >= 220 && (
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${bannerScale})`,
          }}
        >
          <div
            style={{
              backgroundColor: "#0f172a",
              color: "#38bdf8",
              padding: "24px 60px",
              borderRadius: 36,
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: 2,
              border: "6px solid #38bdf8",
              boxShadow: "0 20px 60px rgba(56, 189, 248, 0.4)",
            }}
          >
            AI AGENT LÀ GÌ?
          </div>
        </div>
      )}

      {/* Subtitle */}
      <StickmanSubtitle text={text} keyword="AI Agent" />
    </div>
  );
};
