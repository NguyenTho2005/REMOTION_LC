import React from "react";
import { Sequence, Audio, staticFile } from "remotion";
import { PaperBackground } from "./components/PaperBackground.tsx";
import { Scene1Hook } from "./scenes/Scene1Hook.tsx";
import { Scene2SplitComparison } from "./scenes/Scene2SplitComparison.tsx";
import { Scene3VisionLLM } from "./scenes/Scene3VisionLLM.tsx";
import { Scene4VoiceTimeline } from "./scenes/Scene4VoiceTimeline.tsx";
import { Scene5Architecture } from "./scenes/Scene5Architecture.tsx";
import { Scene6OutroCTA } from "./scenes/Scene6OutroCTA.tsx";
import { NARRATO_AI_PROJECT } from "./NarratoAIManifest.ts";
import type { VideoProjectManifest } from "../../types/schema.ts";

interface EditorialSketchVideoProps {
  manifest?: VideoProjectManifest;
}

export const EditorialSketchComposition: React.FC<EditorialSketchVideoProps> = ({
  manifest = NARRATO_AI_PROJECT,
}) => {
  const { scenes } = manifest;

  return (
    <div
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: manifest.theme.background,
      }}
    >
      {/* Persistent Warm Paper Background with Noise & Grid */}
      <PaperBackground />

      {/* Render Scenes Sequentially */}
      {scenes.map((scene) => {
        return (
          <Sequence
            key={scene.sceneId}
            from={scene.startFrameGlobal}
            durationInFrames={scene.durationInFrames}
            name={`Scene_${scene.sceneIndex + 1}_${scene.visualSpec.type}`}
          >
            {/* Audio Voiceover synthesized by ZeroTTS */}
            {scene.audioFilePath && (
              <Audio
                src={staticFile(scene.audioFilePath)}
                volume={1.0}
                startFrom={0}
              />
            )}

            {/* Visual Scene Component Based on Index */}
            {scene.sceneIndex === 0 && <Scene1Hook scene={scene} />}
            {scene.sceneIndex === 1 && <Scene2SplitComparison scene={scene} />}
            {scene.sceneIndex === 2 && <Scene3VisionLLM scene={scene} />}
            {scene.sceneIndex === 3 && <Scene4VoiceTimeline scene={scene} />}
            {scene.sceneIndex === 4 && <Scene5Architecture scene={scene} />}
            {scene.sceneIndex === 5 && <Scene6OutroCTA scene={scene} />}
          </Sequence>
        );
      })}
    </div>
  );
};
