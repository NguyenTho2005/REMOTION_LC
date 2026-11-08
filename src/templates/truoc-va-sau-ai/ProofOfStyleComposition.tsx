import React from "react";
import { Composition, Sequence, Audio, staticFile } from "remotion";
import { FILM_SPECS } from "./design-tokens";
import { Act1TheOldRoutine } from "./scenes/Act1TheOldRoutine";
import { KaraokeSubtitle } from "./components/KaraokeSubtitle";

export const TruocVaSauAIProofView: React.FC = () => {
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
      {/* Visual Scene: Act 1 Hook (frames 0 - 600) */}
      <Sequence durationInFrames={600}>
        <Act1TheOldRoutine />
      </Sequence>

      {/* ZeroTTS Audio for Act 1 */}
      <Sequence from={90} durationInFrames={510}>
        <Audio src={staticFile("audio/truoc-va-sau-ai/act1.wav")} />
      </Sequence>

      {/* Frame-Accurate Word-Level Karaoke Subtitles */}
      <KaraokeSubtitle />
    </div>
  );
};

export const ProofOfStyleComposition: React.FC = () => {
  return (
    <Composition
      id="TruocVaSauAIProof"
      component={TruocVaSauAIProofView}
      durationInFrames={600} // 20s proof of style
      fps={FILM_SPECS.fps}
      width={FILM_SPECS.width}
      height={FILM_SPECS.height}
    />
  );
};
