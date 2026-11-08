import React from "react";
import { Composition, Sequence, Audio, staticFile } from "remotion";
import { FILM_SPECS, ACT_TIMINGS } from "./design-tokens";
import { Act1TheOldRoutine } from "./scenes/Act1TheOldRoutine";
import { Act2LifeBeforeGenAI } from "./scenes/Act2LifeBeforeGenAI";
import { Act3TheArrivalOfAI } from "./scenes/Act3TheArrivalOfAI";
import { Act4EverythingChanges } from "./scenes/Act4EverythingChanges";
import { Act5TheUnexpectedProblem } from "./scenes/Act5TheUnexpectedProblem";
import { Act6TheHumanChoice } from "./scenes/Act6TheHumanChoice";
import { KaraokeSubtitle } from "./components/KaraokeSubtitle";

export const TruocVaSauAIFilmView: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: FILM_SPECS.width,
        height: FILM_SPECS.height,
        backgroundColor: "#F6F0E4",
        overflow: "hidden",
      }}
    >
      {/* ========================================================
          VISUAL SCENE SEQUENCES (6 ACTS — 9,000 FRAMES)
          ======================================================== */}

      {/* Hồi 1 · Thói Quen Cũ (00:00 - 00:45 / frames 0 - 1350) */}
      <Sequence
        from={ACT_TIMINGS.act1.startFrame}
        durationInFrames={ACT_TIMINGS.act1.durationInFrames}
        name="Act 1 - Thói Quen Cũ"
      >
        <Act1TheOldRoutine />
      </Sequence>

      {/* Hồi 2 · Cuộc Sống Trước Generative AI (00:45 - 01:35 / frames 1350 - 2850) */}
      <Sequence
        from={ACT_TIMINGS.act2.startFrame}
        durationInFrames={ACT_TIMINGS.act2.durationInFrames}
        name="Act 2 - Trước Generative AI"
      >
        <Act2LifeBeforeGenAI />
      </Sequence>

      {/* Hồi 3 · Sự Xuất Hiện Của AI Phổ Cập (01:35 - 02:15 / frames 2850 - 4050) */}
      <Sequence
        from={ACT_TIMINGS.act3.startFrame}
        durationInFrames={ACT_TIMINGS.act3.durationInFrames}
        name="Act 3 - Sự Xuất Hiện Của AI"
      >
        <Act3TheArrivalOfAI />
      </Sequence>

      {/* Hồi 4 · Vạn Vật Đổi Thay (02:15 - 03:20 / frames 4050 - 6000) */}
      <Sequence
        from={ACT_TIMINGS.act4.startFrame}
        durationInFrames={ACT_TIMINGS.act4.durationInFrames}
        name="Act 4 - Vạn Vật Đổi Thay"
      >
        <Act4EverythingChanges />
      </Sequence>

      {/* Hồi 5 · Cú Vấp Bất Ngờ & Điểm Nghẽn (03:20 - 04:15 / frames 6000 - 7650) */}
      <Sequence
        from={ACT_TIMINGS.act5.startFrame}
        durationInFrames={ACT_TIMINGS.act5.durationInFrames}
        name="Act 5 - Cú Vấp Bất Ngờ"
      >
        <Act5TheUnexpectedProblem />
      </Sequence>

      {/* Hồi 6 · Lựa Chọn Của Con Người (04:15 - 05:00 / frames 7650 - 9000) */}
      <Sequence
        from={ACT_TIMINGS.act6.startFrame}
        durationInFrames={ACT_TIMINGS.act6.durationInFrames}
        name="Act 6 - Lựa Chọn Con Người"
      >
        <Act6TheHumanChoice />
      </Sequence>

      {/* ========================================================
          AUDIO TRACKS (ZEROTTS SYNTHESIZED DIALOGUE)
          ======================================================== */}

      {/* Act 1 Audio */}
      <Sequence from={90} durationInFrames={650} name="Audio Act 1">
        <Audio src={staticFile("audio/truoc-va-sau-ai/act1.wav")} />
      </Sequence>

      {/* Act 2 Audio */}
      <Sequence from={1410} durationInFrames={750} name="Audio Act 2">
        <Audio src={staticFile("audio/truoc-va-sau-ai/act2.wav")} />
      </Sequence>

      {/* Act 3 Audio */}
      <Sequence from={2910} durationInFrames={720} name="Audio Act 3">
        <Audio src={staticFile("audio/truoc-va-sau-ai/act3.wav")} />
      </Sequence>

      {/* Act 4 Audio */}
      <Sequence from={4110} durationInFrames={920} name="Audio Act 4">
        <Audio src={staticFile("audio/truoc-va-sau-ai/act4.wav")} />
      </Sequence>

      {/* Act 5 Audio */}
      <Sequence from={6060} durationInFrames={920} name="Audio Act 5">
        <Audio src={staticFile("audio/truoc-va-sau-ai/act5.wav")} />
      </Sequence>

      {/* Act 6 Audio */}
      <Sequence from={7710} durationInFrames={880} name="Audio Act 6">
        <Audio src={staticFile("audio/truoc-va-sau-ai/act6.wav")} />
      </Sequence>

      {/* ========================================================
          FRAME-ACCURATE WORD-LEVEL KARAOKE SUBTITLES
          ======================================================== */}
      <KaraokeSubtitle />
    </div>
  );
};

export const TruocVaSauAIComposition: React.FC = () => {
  return (
    <Composition
      id="TruocVaSauAI"
      component={TruocVaSauAIFilmView}
      durationInFrames={FILM_SPECS.totalFrames} // 9,000 frames = 300.00s
      fps={FILM_SPECS.fps} // 30 FPS
      width={FILM_SPECS.width} // 1920
      height={FILM_SPECS.height} // 1080
    />
  );
};
