import React from "react";
import { Composition } from "remotion";
import { FILM_COLORS } from "../design-tokens";
import { MinhCharacter } from "./MinhCharacter";
import { SemanticPoseName } from "./character-poses";
import { CoherentDeskScene } from "../components/CoherentDeskScene";
import { PaperBackground } from "../components/PaperBackground";

// 1. All Poses Grid Showcase Component
export const PosesGridShowcase: React.FC = () => {
  const testPoses: { name: SemanticPoseName; label: string }[] = [
    { name: "standing", label: "1. Standing (Đứng)" },
    { name: "sitting", label: "2. Sitting (Ngồi ghế)" },
    { name: "sittingAtDesk", label: "3. Sitting At Desk (Ngồi bàn)" },
    { name: "typing", label: "4. Typing (Gõ phím)" },
    { name: "walking", label: "5. Walking (Bước đi)" },
    { name: "thinking", label: "6. Thinking (Trầm tư)" },
  ];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: FILM_COLORS.paper,
        padding: "40px 60px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `3px solid ${FILM_COLORS.ink}`,
          paddingBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: FILM_COLORS.ink }}>
            CANONICAL CHARACTER RIG VALIDATION · 6 MASTER POSES
          </h1>
          <div style={{ fontSize: 16, color: FILM_COLORS.inkSubtle, marginTop: 4 }}>
            Rig v2: Parent-Child Joints · Zero Detached Limbs · Exact Kinematic Chains · No Rogue Polygons
          </div>
        </div>
        <div
          style={{
            backgroundColor: FILM_COLORS.warmYellow,
            padding: "8px 18px",
            borderRadius: 12,
            border: `2px solid ${FILM_COLORS.ink}`,
            fontWeight: 800,
            fontSize: 16,
            color: FILM_COLORS.ink,
          }}
        >
          RIG SPEC: LOCKED
        </div>
      </div>

      {/* Grid of 6 Poses */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 16,
          flex: 1,
        }}
      >
        {testPoses.map((p) => (
          <div
            key={p.name}
            style={{
              backgroundColor: "#FFFFFF",
              border: `2.5px solid ${FILM_COLORS.ink}`,
              borderRadius: 20,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 20px rgba(36, 36, 36, 0.08)",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <MinhCharacter
                pose={p.name}
                expression={p.name === "thinking" ? "thoughtful" : "neutral"}
                scale={0.72}
              />
            </div>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                backgroundColor: FILM_COLORS.paperDark,
                padding: "8px 4px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 800,
                color: FILM_COLORS.ink,
                border: `1.5px solid ${FILM_COLORS.ink}`,
              }}
            >
              {p.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Desk Scene Validation Component (Minh seated at desk)
export const DeskSceneValidation: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        backgroundColor: FILM_COLORS.paper,
        overflow: "hidden",
      }}
    >
      <PaperBackground ambient="night" showGrid={true}>
        <CoherentDeskScene
          pose="typing"
          expression="focused"
          laptopContent="code"
          isLaptopOpen={true}
        />
      </PaperBackground>
    </div>
  );
};

export const PosesGridComposition: React.FC = () => {
  return (
    <Composition
      id="RigPosesValidation"
      component={PosesGridShowcase}
      durationInFrames={60}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

export const DeskValidationComposition: React.FC = () => {
  return (
    <Composition
      id="DeskSceneValidation"
      component={DeskSceneValidation}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
