import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, SPRING_BOUNCE, SPRING_DOODLE } from "../constants";
import { StepBadge } from "../components/StepBadge";
import { DoodleText } from "../components/DoodleText";
import { HandDrawnBox } from "../components/HandDrawnBox";
import { DoodleArrow } from "../components/DoodleArrow";

export const S02Level1Chatbot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const sceneEntrance = spring({
    frame,
    fps,
    config: SPRING_BOUNCE,
  });

  // Whip transition out at end (frames 430-450)
  const exitOpacity = interpolate(frame, [430, 450], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitShift = interpolate(frame, [430, 450], [0, -100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bouncing dots animation
  const dot1 = Math.sin(frame * 0.4) * 6;
  const dot2 = Math.sin(frame * 0.4 + 1.2) * 6;
  const dot3 = Math.sin(frame * 0.4 + 2.4) * 6;

  // Spring pops for chat items
  const promptPop = spring({
    frame: frame - 25,
    fps,
    config: SPRING_BOUNCE,
  });
  const dotsPop = spring({
    frame: frame - 60,
    fps,
    config: SPRING_DOODLE,
  });
  const responsePop = spring({
    frame: frame - 110,
    fps,
    config: SPRING_BOUNCE,
  });
  const limitCardPop = spring({
    frame: frame - 210,
    fps,
    config: SPRING_BOUNCE,
  });
  const exampleBadgePop = spring({
    frame: frame - 300,
    fps,
    config: SPRING_BOUNCE,
  });

  const boil = Math.sin(frame * 0.25) * 0.7;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: sceneEntrance * exitOpacity,
        transform: `translateY(${exitShift}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Header & Step Badge */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          right: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <StepBadge
          levelNumber={1}
          label="CHATBOTS & LLMs"
          themeColor={PALETTE.softMint}
          delayFrames={5}
          rotation={-1.5}
        />

        <div style={{ marginTop: 6, maxWidth: 840 }}>
          <DoodleText
            fontSize={42}
            color={PALETTE.charcoal}
            delayFrames={15}
            staggerFrames={3}
            highlights={[{ word: "Hội thoại", color: PALETTE.softMint }]}
          >
            Trò chuyện & Trả lời câu hỏi
          </DoodleText>
        </div>
      </div>

      {/* Main Chat Interface Doodle Window */}
      <div
        style={{
          position: "absolute",
          top: 360,
          width: 820,
          height: 620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HandDrawnBox
          width={820}
          height={620}
          fillColor="#FFFFFF"
          fillOpacity={0.9}
          strokeColor={PALETTE.charcoal}
          strokeWidth={4}
          rotation={0.5}
          seed={5}
        >
          {/* Chat Window Top Bar */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 28,
              right: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `2px dashed ${PALETTE.charcoalFaint}`,
              paddingBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `2px solid ${PALETTE.charcoal}`,
                  backgroundColor: PALETTE.coralRed,
                }}
              />
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `2px solid ${PALETTE.charcoal}`,
                  backgroundColor: PALETTE.mustardYellow,
                }}
              />
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `2px solid ${PALETTE.charcoal}`,
                  backgroundColor: PALETTE.softMint,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Patrick Hand', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: PALETTE.charcoalLight,
              }}
            >
              💬 ai_chat_prompt.sh
            </span>
          </div>

          {/* User Prompt Message Bubble (Rubber-band popup) */}
          {promptPop > 0.05 && (
            <div
              style={{
                position: "absolute",
                top: 90,
                right: 36,
                transform: `scale(${promptPop}) rotate(${-1 + boil}deg)`,
                transformOrigin: "bottom right",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  backgroundColor: PALETTE.mustardLight,
                  borderRadius: "18px 18px 4px 18px",
                  border: `2.5px solid ${PALETTE.charcoal}`,
                  maxWidth: 500,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: PALETTE.charcoal,
                  }}
                >
                  "Hãy tóm tắt báo cáo và lập kế hoạch giúp tôi nhé?"
                </span>
              </div>
            </div>
          )}

          {/* AI Thinking Bouncing Dots */}
          {dotsPop > 0.05 && frame < 150 && (
            <div
              style={{
                position: "absolute",
                top: 230,
                left: 40,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 24px",
                backgroundColor: "#F4F4F5",
                borderRadius: "18px 18px 18px 4px",
                border: `2px solid ${PALETTE.charcoal}`,
                transform: `scale(${dotsPop})`,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: PALETTE.charcoal,
                  transform: `translateY(${dot1}px)`,
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: PALETTE.charcoal,
                  transform: `translateY(${dot2}px)`,
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: PALETTE.charcoal,
                  transform: `translateY(${dot3}px)`,
                }}
              />
            </div>
          )}

          {/* AI Response Message Bubble */}
          {responsePop > 0.05 && (
            <div
              style={{
                position: "absolute",
                top: 210,
                left: 36,
                transform: `scale(${responsePop}) rotate(${1 + boil}deg)`,
                transformOrigin: "bottom left",
              }}
            >
              <div
                style={{
                  padding: "18px 26px",
                  backgroundColor: PALETTE.mintLight,
                  borderRadius: "18px 18px 18px 4px",
                  border: `2.5px solid ${PALETTE.charcoal}`,
                  maxWidth: 580,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 27,
                    fontWeight: 700,
                    color: PALETTE.charcoal,
                    lineHeight: 1.35,
                  }}
                >
                  "Đây là bản tóm tắt gợi ý. Nhưng tôi KHÔNG THỂ tự mở file, không thể tự gửi email hay bấm nút giúp bạn được!"
                </span>
              </div>
            </div>
          )}

          {/* Input field mock at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 28,
              right: 28,
              height: 58,
              backgroundColor: "#FAFAFA",
              borderRadius: "12px",
              border: `2px solid ${PALETTE.charcoal}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
            }}
          >
            <span
              style={{
                fontFamily: "'Patrick Hand', sans-serif",
                fontSize: 22,
                color: PALETTE.charcoalFaint,
              }}
            >
              Nhập câu hỏi tiếp theo...
            </span>
            <span style={{ fontSize: 24 }}>➡️</span>
          </div>
        </HandDrawnBox>
      </div>

      {/* Arrow pointing down to limitation card */}
      {frame > 190 && (
        <DoodleArrow
          startX={540}
          startY={990}
          endX={540}
          endY={1050}
          curveOffset={15}
          strokeColor={PALETTE.coralRed}
          strokeWidth={4}
          delayFrames={190}
        />
      )}

      {/* Critical Limitation Note Card */}
      {limitCardPop > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: 1070,
            width: 820,
            transform: `scale(${limitCardPop}) rotate(${-1.5 + boil}deg)`,
            transformOrigin: "center center",
          }}
        >
          <HandDrawnBox
            width={820}
            height={250}
            fillColor={PALETTE.coralLight}
            fillOpacity={0.8}
            strokeColor={PALETTE.coralRed}
            strokeWidth={3.5}
            seed={8}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 36 }}>🛑</span>
                <span
                  style={{
                    fontFamily: "'Patrick Hand', sans-serif",
                    fontSize: 32,
                    fontWeight: 800,
                    color: PALETTE.coralRed,
                    textTransform: "uppercase",
                  }}
                >
                  Bản chất Level 1: Thụ Động (Passive)
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Patrick Hand', sans-serif",
                  fontSize: 26,
                  color: PALETTE.charcoal,
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                Bạn phải tự tay copy-paste, tự kiểm chứng và tự thực thi từng câu lệnh. AI chỉ nói, không làm!
              </p>
            </div>
          </HandDrawnBox>
        </div>
      )}

      {/* Bottom Typical Examples Pills */}
      {exampleBadgePop > 0.05 && (
        <div
          style={{
            position: "absolute",
            bottom: 300,
            display: "flex",
            gap: 20,
            transform: `scale(${exampleBadgePop})`,
          }}
        >
          {["ChatGPT 3.5 / 4o", "Claude Chat", "Siri / Alexa"].map((item, i) => (
            <div
              key={item}
              style={{
                padding: "8px 20px",
                backgroundColor: "#FFFFFF",
                border: `2px solid ${PALETTE.charcoal}`,
                borderRadius: "20px",
                fontFamily: "'Patrick Hand', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: PALETTE.charcoal,
                transform: `rotate(${((i % 2 === 0 ? 1 : -1) * 2) + boil}deg)`,
                boxShadow: "2px 2px 0px rgba(0,0,0,0.15)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
