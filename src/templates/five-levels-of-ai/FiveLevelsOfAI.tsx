import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { PALETTE, SCENE_TIMINGS, VIDEO_CONFIG } from "./constants";
import { DoodleDefs } from "./components/DoodleDefs";
import { PaperBackground } from "./components/PaperBackground";
import { ScribbleWipe } from "./components/ScribbleWipe";
import { DoodleSubtitle } from "./components/DoodleSubtitle";
import { S01Intro } from "./scenes/S01Intro";
import { S02Level1Chatbot } from "./scenes/S02Level1Chatbot";
import { S03Level2Agent } from "./scenes/S03Level2Agent";
import { S04Level3Multimodal } from "./scenes/S04Level3Multimodal";
import { S05Level4AGI } from "./scenes/S05Level4AGI";
import { S06Level5ASISummary } from "./scenes/S06Level5ASISummary";

export interface FiveLevelsOfAIProps {
  darkSlate?: boolean;
  enableAudio?: boolean;
  showSubtitles?: boolean;
}

export const FiveLevelsOfAI: React.FC<FiveLevelsOfAIProps> = ({
  darkSlate = false,
  enableAudio = true,
  showSubtitles = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: darkSlate ? PALETTE.bgSlate : PALETTE.bgPaper,
        fontFamily: "'Patrick Hand', 'Caveat', 'Comic Sans MS', cursive, sans-serif",
      }}
    >
      {/* Global SVG Filters & Patterns */}
      <DoodleDefs />

      {/* Hand-drawn Paper Background & Texture */}
      <PaperBackground darkSlate={darkSlate} />

      {/* Scene 1: Intro (0 - 300 frames) */}
      <Sequence
        from={SCENE_TIMINGS.intro.start}
        durationInFrames={SCENE_TIMINGS.intro.duration}
        name="01_Intro_Staircase"
      >
        {enableAudio && (
          <Audio src={staticFile(SCENE_TIMINGS.intro.audioSrc)} />
        )}
        <S01Intro />
        {showSubtitles && (
          <DoodleSubtitle
            text={SCENE_TIMINGS.intro.narration}
            durationFrames={SCENE_TIMINGS.intro.duration}
            highlightWords={["Năm", "cấp", "độ", "cách", "mạng"]}
          />
        )}
      </Sequence>

      {/* Scene 2: Level 1 Chatbot (300 - 750 frames) */}
      <Sequence
        from={SCENE_TIMINGS.level1.start}
        durationInFrames={SCENE_TIMINGS.level1.duration}
        name="02_Level1_Chatbot"
      >
        {enableAudio && (
          <Audio src={staticFile(SCENE_TIMINGS.level1.audioSrc)} />
        )}
        <S02Level1Chatbot />
        {showSubtitles && (
          <DoodleSubtitle
            text={SCENE_TIMINGS.level1.narration}
            durationFrames={SCENE_TIMINGS.level1.duration}
            highlightWords={["Chatbot", "thụ", "động", "tự", "làm"]}
          />
        )}
      </Sequence>

      {/* Scene 3: Level 2 AI Agent (750 - 1260 frames) */}
      <Sequence
        from={SCENE_TIMINGS.level2.start}
        durationInFrames={SCENE_TIMINGS.level2.duration}
        name="03_Level2_AIAgent"
      >
        {enableAudio && (
          <Audio src={staticFile(SCENE_TIMINGS.level2.audioSrc)} />
        )}
        <S03Level2Agent />
        {showSubtitles && (
          <DoodleSubtitle
            text={SCENE_TIMINGS.level2.narration}
            durationFrames={SCENE_TIMINGS.level2.duration}
            highlightWords={["Agent", "bước", "ngoặt", "tự", "lập", "kế", "hoạch"]}
          />
        )}
      </Sequence>

      {/* Scene 4: Level 3 Multimodal (1260 - 1740 frames) */}
      <Sequence
        from={SCENE_TIMINGS.level3.start}
        durationInFrames={SCENE_TIMINGS.level3.duration}
        name="04_Level3_Multimodal"
      >
        {enableAudio && (
          <Audio src={staticFile(SCENE_TIMINGS.level3.audioSrc)} />
        )}
        <S04Level3Multimodal />
        {showSubtitles && (
          <DoodleSubtitle
            text={SCENE_TIMINGS.level3.narration}
            durationFrames={SCENE_TIMINGS.level3.duration}
            highlightWords={["Multimodal", "nhìn", "nghe", "thời", "gian", "thực"]}
          />
        )}
      </Sequence>

      {/* Scene 5: Level 4 AGI (1740 - 2340 frames) */}
      <Sequence
        from={SCENE_TIMINGS.level4.start}
        durationInFrames={SCENE_TIMINGS.level4.duration}
        name="05_Level4_AGI"
      >
        {enableAudio && (
          <Audio src={staticFile(SCENE_TIMINGS.level4.audioSrc)} />
        )}
        <S05Level4AGI />
        {showSubtitles && (
          <DoodleSubtitle
            text={SCENE_TIMINGS.level4.narration}
            durationFrames={SCENE_TIMINGS.level4.duration}
            highlightWords={["AGI", "tổng", "quát", "chuyên", "gia", "nghiên", "cứu"]}
          />
        )}
      </Sequence>

      {/* Scene 6: Level 5 ASI & Outro (2340 - 3000 frames) */}
      <Sequence
        from={SCENE_TIMINGS.level5.start}
        durationInFrames={SCENE_TIMINGS.level5.duration}
        name="06_Level5_ASI_Outro"
      >
        {enableAudio && (
          <Audio src={staticFile(SCENE_TIMINGS.level5.audioSrc)} />
        )}
        <S06Level5ASISummary />
        {showSubtitles && (
          <DoodleSubtitle
            text={SCENE_TIMINGS.level5.narration}
            durationFrames={SCENE_TIMINGS.level5.duration}
            highlightWords={["ASI", "cấp", "độ", "hai", "Agent", "follow"]}
          />
        )}
      </Sequence>

      {/* Scribble Transition Wipes between major scenes */}
      <ScribbleWipe startFrame={290} durationInFrames={20} color={PALETTE.charcoal} />
      <ScribbleWipe startFrame={740} durationInFrames={20} color={PALETTE.charcoal} />
      <ScribbleWipe startFrame={1250} durationInFrames={20} color={PALETTE.charcoal} />
      <ScribbleWipe startFrame={1730} durationInFrames={20} color={PALETTE.charcoal} />
      <ScribbleWipe startFrame={2330} durationInFrames={20} color={PALETTE.charcoal} />
    </AbsoluteFill>
  );
};

export const FiveLevelsOfAIComposition: React.FC = () => {
  return (
    <Composition
      id="FiveLevelsOfAI"
      component={FiveLevelsOfAI}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
      defaultProps={{
        darkSlate: false,
        enableAudio: true,
        showSubtitles: true,
      }}
    />
  );
};
