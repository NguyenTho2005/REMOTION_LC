import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { NeuralDoodleScene } from "../components/doodles/NeuralDoodleScene";
import { KaraokeSubtitle, type WordTimestamp } from "../components/subtitles/KaraokeSubtitle";
import timestampsData from "../data/neural-network-story/timestamps.json";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_IN_FRAMES = 776; // 25.84s actual ZeroTTS audio @ 30 FPS

const words = timestampsData as WordTimestamp[];

/**
 * Chalkboard Background with subtle chalk dust, vignetting, and classroom grid dots
 */
const ChalkboardBackground: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1E1E24", overflow: "hidden" }}>
      {/* Radial soft lighting from center simulating classroom blackboard */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(circle at 20% 85%, rgba(0,240,255,0.03) 0%, transparent 45%), radial-gradient(circle at 80% 85%, rgba(255,230,0,0.03) 0%, transparent 45%)",
        }}
      />

      {/* Classroom subtle chalk grid dots */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px",
          backgroundPosition: "0 0",
          opacity: 0.6,
        }}
      />

      {/* SVG Chalk Noise Filter for authentic chalk texture */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="chalk-dust-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="12" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.09" />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          filter: "url(#chalk-dust-grain)",
          opacity: 0.45,
          mixBlendMode: "screen",
        }}
      />

      {/* Chalkboard Slate Vignette */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 65%, rgba(10, 10, 15, 0.8) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Smooth continuous subtle camera drift to keep animation feeling organic
 */
const CameraDrift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();

  // Gentle breathing camera movement across scenes
  const p = frame / DURATION_IN_FRAMES;
  const x = interpolate(
    Math.sin(p * Math.PI * 4),
    [-1, 1],
    [-8, 8],
  );
  const y = interpolate(
    Math.cos(p * Math.PI * 3),
    [-1, 1],
    [-6, 6],
  );
  const scale = interpolate(
    Math.sin(p * Math.PI * 2),
    [-1, 1],
    [1.0, 1.025],
  );
  const rot = interpolate(
    Math.sin(p * Math.PI * 3),
    [-1, 1],
    [-0.3, 0.3],
  );

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Top Chalkboard Timeline Bar indicating the 4 scenes
 */
const ChalkTimelineHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const progressRatio = Math.min(1, Math.max(0, frame / DURATION_IN_FRAMES));
  const barWidth = 920;
  const activeWidth = progressRatio * barWidth;

  return (
    <div
      style={{
        position: "absolute",
        top: 155,
        left: 80,
        right: 80,
        height: 12,
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        borderRadius: 6,
        overflow: "hidden",
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      {/* Filled progress bar */}
      <div
        style={{
          width: `${activeWidth}px`,
          height: "100%",
          background: "linear-gradient(90deg, #00F0FF 0%, #FFE600 70%, #00FF9D 100%)",
          borderRadius: 6,
          boxShadow: "0 0 10px rgba(255, 230, 0, 0.6)",
        }}
      />
    </div>
  );
};

/**
 * Main Neural Network Story Component
 */
export const NeuralNetworkStory: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#1E1E24" }}>
      {/* 1. Chalkboard Textured Background */}
      <ChalkboardBackground />

      {/* 2. Top Scene Progress Indicator */}
      <ChalkTimelineHeader />

      {/* 3. Subtle Camera Drift wrapping main Doodle Content */}
      <CameraDrift>
        <NeuralDoodleScene frame={frame} fps={FPS} />
      </CameraDrift>

      {/* 4. Playful Comic Karaoke Subtitles */}
      <KaraokeSubtitle
        words={words}
        wordsPerChunk={4}
        bottomOffset={290}
        maxWidth={940}
      />

      {/* 5. Pre-synthesized 48kHz Audio Track */}
      <Sequence durationInFrames={DURATION_IN_FRAMES} name="VoiceoverAudio">
        <Audio
          src={staticFile("neural-network-story/audio.wav")}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Composition Registration Definition
 */
export const NeuralNetworkStoryComposition: React.FC = () => {
  return (
    <Composition
      id="NeuralNetworkStoryReview"
      component={NeuralNetworkStory}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
