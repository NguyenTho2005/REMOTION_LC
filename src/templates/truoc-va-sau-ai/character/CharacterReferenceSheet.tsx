import React from "react";
import { Composition } from "remotion";
import { MinhCharacter, MinhExpression } from "./MinhCharacter";
import { FILM_COLORS } from "../design-tokens";

export const CharacterReferenceSheet: React.FC = () => {
  const expressions: Array<{ label: string; exp: MinhExpression }> = [
    { label: "Bình thản (Neutral)", exp: "neutral" },
    { label: "Hạnh phúc (Happy)", exp: "happy" },
    { label: "Bối rối (Confused)", exp: "confused" },
    { label: "Bất ngờ (Surprised)", exp: "surprised" },
    { label: "Trầm tư (Thoughtful)", exp: "thoughtful" },
    { label: "Kiệt sức (Exhausted)", exp: "exhausted" },
    { label: "Bực bội (Frustrated)", exp: "frustrated" },
    { label: "Tập trung (Focused)", exp: "focused" },
  ];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: FILM_COLORS.paper,
        padding: "48px 64px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `3px solid ${FILM_COLORS.ink}`, paddingBottom: "16px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "36px", fontWeight: 900, color: FILM_COLORS.ink, letterSpacing: "1px" }}>
            BẢNG THIẾT KẾ NHÂN VẬT · CHARACTER MODEL SHEET
          </h1>
          <div style={{ fontSize: "16px", color: FILM_COLORS.inkSubtle, marginTop: "4px" }}>
            Nhân vật chính: MINH (27 tuổi) · Dự án hoạt hình: "Trước Và Sau AI — Khi Cuộc Sống Thay Đổi"
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.entries({
            "Giấy (#F6F0E4)": FILM_COLORS.paper,
            "Mực (#242424)": FILM_COLORS.ink,
            "Áo (#6D9DC5)": FILM_COLORS.minhShirt,
            "Vàng (#F2C14E)": FILM_COLORS.warmYellow,
            "San hô (#E67E67)": FILM_COLORS.coral,
          }).map(([name, hex]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "32px", height: "32px", backgroundColor: hex, borderRadius: "50%", border: `2px solid ${FILM_COLORS.ink}` }} />
              <span style={{ fontSize: "10px", color: FILM_COLORS.inkSubtle }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Views & Expressions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", flex: 1 }}>
        {expressions.map((item) => (
          <div
            key={item.exp}
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${FILM_COLORS.ink}`,
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 6px 16px rgba(36, 36, 36, 0.08)",
            }}
          >
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MinhCharacter
                scale={0.7}
                expression={item.exp}
                pose={item.exp === "exhausted" ? "frustrated" : "sittingAtDesk"}
              />
            </div>
            <div
              style={{
                marginTop: "12px",
                padding: "6px 14px",
                backgroundColor: FILM_COLORS.paper,
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 700,
                color: FILM_COLORS.ink,
                border: `1px solid ${FILM_COLORS.ink}`,
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CharacterReferenceSheetComposition: React.FC = () => {
  return (
    <Composition
      id="TruocVaSauAICharacterSheet"
      component={CharacterReferenceSheet}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

