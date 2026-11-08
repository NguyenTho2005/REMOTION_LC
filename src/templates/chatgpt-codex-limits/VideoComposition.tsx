import React from "react";
import { Composition, Sequence, Audio, staticFile } from "remotion";
import {
  Scene1Hook,
  Scene2Announcement,
  Scene3SharedLimit,
  Scene4TokenUsage,
  Scene5TaskComplexity,
  Scene6InstantException,
  Scene7UsageDashboard,
  Scene8ReachingLimits,
  Scene9Closing,
} from "./scenes";
import alignmentData from "./alignment.json";

export const TOTAL_PROJECT_FRAMES = alignmentData.totalFrames; // 1773 frames (~59.1s @ 30 FPS)

export const ChatGPTCodexLimitsVideo: React.FC = () => {
  const scenes = alignmentData.scenes;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0B0F19",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* S01: Hook */}
      <Sequence
        from={scenes[0].startFrame}
        durationInFrames={scenes[0].sceneDurationFrames}
        name="01 - Hook ChatGPT & Codex"
      >
        <Scene1Hook words={scenes[0].words} />
        <Audio src={staticFile(scenes[0].audioFile)} />
      </Sequence>

      {/* S02: Announcement */}
      <Sequence
        from={scenes[1].startFrame}
        durationInFrames={scenes[1].sceneDurationFrames}
        name="02 - Announcement Timeline"
      >
        <Scene2Announcement words={scenes[1].words} />
        <Audio src={staticFile(scenes[1].audioFile)} />
      </Sequence>

      {/* S03: Shared Limit */}
      <Sequence
        from={scenes[2].startFrame}
        durationInFrames={scenes[2].sceneDurationFrames}
        name="03 - Separate Caps (Before)"
      >
        <Scene3SharedLimit words={scenes[2].words} />
        <Audio src={staticFile(scenes[2].audioFile)} />
      </Sequence>

      {/* S04: Token Usage */}
      <Sequence
        from={scenes[3].startFrame}
        durationInFrames={scenes[3].sceneDurationFrames}
        name="04 - Shared Token Pool"
      >
        <Scene4TokenUsage words={scenes[3].words} />
        <Audio src={staticFile(scenes[3].audioFile)} />
      </Sequence>

      {/* S05: Task Complexity */}
      <Sequence
        from={scenes[4].startFrame}
        durationInFrames={scenes[4].sceneDurationFrames}
        name="05 - Task Complexity & Models"
      >
        <Scene5TaskComplexity words={scenes[4].words} />
        <Audio src={staticFile(scenes[4].audioFile)} />
      </Sequence>

      {/* S06: Instant Exception */}
      <Sequence
        from={scenes[5].startFrame}
        durationInFrames={scenes[5].sceneDurationFrames}
        name="06 - ChatGPT Instant Exception"
      >
        <Scene6InstantException words={scenes[5].words} />
        <Audio src={staticFile(scenes[5].audioFile)} />
      </Sequence>

      {/* S07: Usage Dashboard */}
      <Sequence
        from={scenes[6].startFrame}
        durationInFrames={scenes[6].sceneDurationFrames}
        name="07 - Settings & Usage Dashboard"
      >
        <Scene7UsageDashboard words={scenes[6].words} />
        <Audio src={staticFile(scenes[6].audioFile)} />
      </Sequence>

      {/* S08: Reaching Limits */}
      <Sequence
        from={scenes[7].startFrame}
        durationInFrames={scenes[7].sceneDurationFrames}
        name="08 - Reaching Limits Decision Tree"
      >
        <Scene8ReachingLimits words={scenes[7].words} />
        <Audio src={staticFile(scenes[7].audioFile)} />
      </Sequence>

      {/* S09: Closing */}
      <Sequence
        from={scenes[8].startFrame}
        durationInFrames={scenes[8].sceneDurationFrames}
        name="09 - Closing & Developer Advice"
      >
        <Scene9Closing words={scenes[8].words} />
        <Audio src={staticFile(scenes[8].audioFile)} />
      </Sequence>
    </div>
  );
};

export const ChatGPTCodexLimitsComposition: React.FC = () => {
  return (
    <Composition
      id="ChatGPTCodexLimits"
      component={ChatGPTCodexLimitsVideo}
      durationInFrames={TOTAL_PROJECT_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
