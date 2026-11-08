import React from "react";
import { Composition, Sequence, Audio, staticFile } from "remotion";
import { TWO_SUM_SPECS } from "./design-tokens";
import { KaraokeCaptions } from "./components/KaraokeCaptions";

import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { BruteForceScene } from "./scenes/BruteForceScene";
import { ComplexityScene } from "./scenes/ComplexityScene";
import { HashMapScene } from "./scenes/HashMapScene";
import { ComplementScene } from "./scenes/ComplementScene";
import { MatchScene } from "./scenes/MatchScene";
import { MistakesScene } from "./scenes/MistakesScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { OutroScene } from "./scenes/OutroScene";

export interface SceneConfig {
  id: string;
  startFrame: number;
  durationInFrames: number;
  audioFile: string;
  audioOffset: number; // relative to scene start
  component: React.FC;
}

export const SCENES: SceneConfig[] = [
  {
    id: "scene01",
    startFrame: 0,
    durationInFrames: 234,
    audioFile: "audio/two-sum-3d/scene01.wav",
    audioOffset: 8,
    component: HookScene,
  },
  {
    id: "scene02",
    startFrame: 234,
    durationInFrames: 320,
    audioFile: "audio/two-sum-3d/scene02.wav",
    audioOffset: 8,
    component: ProblemScene,
  },
  {
    id: "scene03",
    startFrame: 554,
    durationInFrames: 260,
    audioFile: "audio/two-sum-3d/scene03.wav",
    audioOffset: 8,
    component: BruteForceScene,
  },
  {
    id: "scene04",
    startFrame: 814,
    durationInFrames: 265,
    audioFile: "audio/two-sum-3d/scene04.wav",
    audioOffset: 8,
    component: ComplexityScene,
  },
  {
    id: "scene05",
    startFrame: 1079,
    durationInFrames: 270,
    audioFile: "audio/two-sum-3d/scene05.wav",
    audioOffset: 8,
    component: HashMapScene,
  },
  {
    id: "scene06",
    startFrame: 1349,
    durationInFrames: 402,
    audioFile: "audio/two-sum-3d/scene06.wav",
    audioOffset: 8,
    component: ComplementScene,
  },
  {
    id: "scene07",
    startFrame: 1751,
    durationInFrames: 272,
    audioFile: "audio/two-sum-3d/scene07.wav",
    audioOffset: 8,
    component: MatchScene,
  },
  {
    id: "scene08",
    startFrame: 2023,
    durationInFrames: 330,
    audioFile: "audio/two-sum-3d/scene08.wav",
    audioOffset: 8,
    component: MistakesScene,
  },
  {
    id: "scene09",
    startFrame: 2353,
    durationInFrames: 337,
    audioFile: "audio/two-sum-3d/scene09.wav",
    audioOffset: 8,
    component: ComparisonScene,
  },
  {
    id: "scene10",
    startFrame: 2690,
    durationInFrames: 232,
    audioFile: "audio/two-sum-3d/scene10.wav",
    audioOffset: 8,
    component: OutroScene,
  },
];

export const TOTAL_DURATION_IN_FRAMES = 2922; // 97.40s @ 30 FPS

export const TwoSum3DVideo: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: TWO_SUM_SPECS.width,
        height: TWO_SUM_SPECS.height,
        backgroundColor: "#080B14",
        overflow: "hidden",
      }}
    >
      {/* 10 Sequenced Visual Scenes & Audio Narration */}
      {SCENES.map((scene) => {
        const SceneComp = scene.component;
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            name={scene.id}
          >
            <SceneComp />
            <Sequence from={scene.audioOffset}>
              <Audio src={staticFile(scene.audioFile)} />
            </Sequence>
          </Sequence>
        );
      })}

      {/* Global Synchronized Word-Level Karaoke Subtitles */}
      <KaraokeCaptions />
    </div>
  );
};

export const TwoSum3DVideo3x16: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 1920,
        backgroundColor: "#080B14",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: (360 - 1080) / 2,
          width: 1080,
          height: 1920,
        }}
      >
        <TwoSum3DVideo />
      </div>
    </div>
  );
};

export const TwoSum3DComposition: React.FC = () => {
  return (
    <Composition
      id="TwoSum3DExplainer"
      component={TwoSum3DVideo}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};

export const TwoSum3DComposition3x16: React.FC = () => {
  return (
    <Composition
      id="TwoSum3DExplainer3x16"
      component={TwoSum3DVideo3x16}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={30}
      width={360}
      height={1920}
      defaultProps={{}}
    />
  );
};
