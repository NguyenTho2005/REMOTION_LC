import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import storedTracks from "../../public/audio/tracks.json";
import { VideoProject } from "../schemas/index.ts";
import { AudioTrack } from "../Composition";
import { DEFAULT_TIKTOK_PROJECT } from "./defaultProject";
import { HookScene } from "./shared/HookScene";
import { OutroScene } from "./shared/OutroScene";
import { BreakingNews } from "./news/BreakingNews";
import { NewsTimeline, type TimelineEvent } from "./news/NewsTimeline";
import { AIConceptScene, type Pillar } from "./ai-explainer/AIConceptScene";
import { ArchitectureScene } from "./ai-explainer/ArchitectureScene";
import { FeatureHighlight } from "./ai-explainer/FeatureHighlight";
import { RepositoryCard } from "./repo-review/RepositoryCard";
import { CodeShowcase } from "./repo-review/CodeShowcase";
import { TerminalAnimation } from "./repo-review/TerminalAnimation";
import {
  Template01TechExplainer,
  Template02ProductShowcase,
  Template03AlgorithmViz,
  Template04DataViz,
  Template05CinematicIntro,
  Template06HybridExplainer,
} from "../three/templates";
import { ParticleDispatcher } from "../three/particles/presets";
import { ThreeCanvasContainer } from "../three/core/ThreeCanvasContainer";
import type { AnyParticleConfig, ParticlePresetType } from "../three/particles/types";

export interface TikTokCompositionProps {
  project?: VideoProject;
  tracks?: AudioTrack[];
  [key: string]: unknown;
}

function getStoredTracks(): AudioTrack[] {
  if (Array.isArray(storedTracks) && storedTracks.length > 0) {
    return (storedTracks as AudioTrack[]).filter((t) => t && t.src && t.asset_id);
  }
  return [];
}

export const calculateTikTokMetadata: CalculateMetadataFunction<TikTokCompositionProps> = ({ props }) => {
  const project = props.project || DEFAULT_TIKTOK_PROJECT;
  const tracks = props.tracks && props.tracks.length > 0 ? props.tracks : getStoredTracks();

  let maxAudioEnd = 0;
  for (const t of tracks) {
    const end = (t.start_frame || 0) + (t.duration_in_frames || 60);
    if (end > maxAudioEnd) maxAudioEnd = end;
  }

  const durationInFrames = Math.max(
    90,
    project.durationInFrames,
    maxAudioEnd > 0 ? maxAudioEnd + 15 : 90
  );

  return {
    props: {
      project,
      tracks,
    },
    durationInFrames,
    width: 1080,
    height: 1920,
    fps: 30,
  };
};

export const TikTokComposition: React.FC<TikTokCompositionProps> = ({
  project = DEFAULT_TIKTOK_PROJECT,
  tracks: initialTracks,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tracks = initialTracks && initialTracks.length > 0 ? initialTracks : getStoredTracks();

  const progressPercent = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  return (
    <AbsoluteFill style={{ backgroundColor: "#090a0f" }}>
      {/* Visual Scenes Timeline */}
      {project.scenes.map((scene) => {
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            name={scene.template}
          >
            {renderSceneContent(scene.template, scene.props, scene.durationInFrames)}
          </Sequence>
        );
      })}

      {/* Voice Narration Audio Tracks */}
      {tracks.map((track) => (
        <Sequence
          key={track.id}
          from={track.start_frame}
          durationInFrames={track.duration_in_frames}
          name={track.name}
        >
          <Audio src={staticFile(track.src)} volume={track.volume ?? 1} />
        </Sequence>
      ))}

      {/* Top Video Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #38bdf8, #818cf8, #ec4899)",
            boxShadow: "0 0 12px rgba(56, 189, 248, 0.8)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

function renderSceneContent(
  template: string,
  props: Record<string, unknown>,
  durationInFrames: number
): React.ReactElement {
  switch (template) {
    case "HookScene":
      return (
        <HookScene
          title={String(props.title || "")}
          subtitle={String(props.subtitle || "")}
          badgeText={props.badgeText ? String(props.badgeText) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "BreakingNews":
      return (
        <BreakingNews
          headline={String(props.headline || "")}
          summary={String(props.summary || "")}
          alertBadge={props.alertBadge ? String(props.alertBadge) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "NewsTimeline":
      return (
        <NewsTimeline
          title={props.title ? String(props.title) : undefined}
          events={props.events as TimelineEvent[] | undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "AIConceptScene":
      return (
        <AIConceptScene
          conceptTitle={String(props.conceptTitle || "")}
          summary={String(props.summary || "")}
          pillars={props.pillars as Pillar[] | undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ArchitectureScene":
      return (
        <ArchitectureScene
          headline={props.headline ? String(props.headline) : undefined}
          points={props.points as string[]}
          highlightText={props.highlightText ? String(props.highlightText) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "FeatureHighlight":
      return (
        <FeatureHighlight
          headline={props.headline ? String(props.headline) : undefined}
          points={props.points as string[]}
          highlightText={props.highlightText ? String(props.highlightText) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "RepositoryCard":
      return (
        <RepositoryCard
          repoName={String(props.repoName || "")}
          stars={props.stars ? String(props.stars) : undefined}
          forks={props.forks ? String(props.forks) : undefined}
          language={props.language ? String(props.language) : undefined}
          license={props.license ? String(props.license) : undefined}
          description={props.description ? String(props.description) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "CodeShowcase":
      return (
        <CodeShowcase
          title={props.title ? String(props.title) : undefined}
          code={String(props.code || "")}
          language={props.language ? String(props.language) : undefined}
          explanation={props.explanation ? String(props.explanation) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "TerminalAnimation":
      return (
        <TerminalAnimation
          title={props.title ? String(props.title) : undefined}
          command={String(props.command || "")}
          output={props.output ? String(props.output) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeCinematicIntro":
      return (
        <Template05CinematicIntro
          hookTitle={props.hookTitle ? String(props.hookTitle) : undefined}
          hookSubtitle={props.hookSubtitle ? String(props.hookSubtitle) : undefined}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeTechExplainer":
      return (
        <Template01TechExplainer
          title={props.title ? String(props.title) : undefined}
          subtitle={props.subtitle ? String(props.subtitle) : undefined}
          nodeLabels={props.nodeLabels as string[] | undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeProductShowcase":
      return (
        <Template02ProductShowcase
          productName={props.productName ? String(props.productName) : undefined}
          tagline={props.tagline ? String(props.tagline) : undefined}
          features={props.features as string[] | undefined}
          heroColor={props.heroColor ? String(props.heroColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeAlgorithmViz":
      return (
        <Template03AlgorithmViz
          algorithm={props.algorithm as "binary-search" | "bubble-sort" | undefined}
          target={typeof props.target === "number" ? props.target : undefined}
          array={props.array as number[] | undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeDataViz":
      return (
        <Template04DataViz
          title={props.title ? String(props.title) : undefined}
          subtitle={props.subtitle ? String(props.subtitle) : undefined}
          data={props.data as Array<{ label: string; value: number; color?: string }> | undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeHybridExplainer":
      return (
        <Template06HybridExplainer
          title={props.title ? String(props.title) : undefined}
          subtitle={props.subtitle ? String(props.subtitle) : undefined}
          durationInFrames={durationInFrames}
        />
      );

    case "ThreeParticleVFX": {
      const presetName = (typeof props.preset === "string" ? props.preset : "wave") as ParticlePresetType;
      const particleConfig: AnyParticleConfig = (props.particleConfig as AnyParticleConfig) || {
        preset: presetName,
        color: props.color ? String(props.color) : "#38BDF8",
        secondaryColor: props.secondaryColor ? String(props.secondaryColor) : "#A855F7",
        durationInFrames,
      };

      return (
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames,
            camera: { preset: "orbit", distance: 8, fov: 45, speed: 0.8 },
            lighting: { preset: "cyberpunk" },
            objects: [],
            captionOverlay: {
              title: props.title ? String(props.title) : undefined,
              subtitle: props.subtitle ? String(props.subtitle) : undefined,
            },
          }}
        >
          <ParticleDispatcher config={particleConfig} />
        </ThreeCanvasContainer>
      );
    }

    case "OutroScene":
    default:
      return (
        <OutroScene
          callToAction={String(props.callToAction || "Follow ngay!")}
          channelName={props.channelName ? String(props.channelName) : undefined}
          tags={props.tags as string[]}
          accentColor={props.accentColor ? String(props.accentColor) : undefined}
          durationInFrames={durationInFrames}
        />
      );
  }
}

export const TikTokVideoComposition: React.FC = () => {
  return (
    <Composition
      id="TikTokVideo"
      component={TikTokComposition}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={calculateTikTokMetadata}
      defaultProps={{
        project: DEFAULT_TIKTOK_PROJECT,
        tracks: getStoredTracks(),
      }}
    />
  );
};
