import React from "react";
import { Composition } from "remotion";
import { EditorialSketchComposition } from "./EditorialSketchComposition.tsx";
import { NARRATO_AI_PROJECT } from "./NarratoAIManifest.ts";
import type { VideoProjectManifest } from "../../types/schema.ts";

export const NarratoAIEditorialSketchComposition: React.FC = () => {
  return (
    <Composition
      id="NarratoAIEditorialSketch"
      component={EditorialSketchComposition}
      durationInFrames={NARRATO_AI_PROJECT.totalDurationInFrames}
      fps={NARRATO_AI_PROJECT.fps}
      width={NARRATO_AI_PROJECT.width}
      height={NARRATO_AI_PROJECT.height}
      defaultProps={{
        manifest: NARRATO_AI_PROJECT,
      }}
      calculateMetadata={async ({ props }) => {
        const manifest = (props.manifest || NARRATO_AI_PROJECT) as VideoProjectManifest;
        return {
          durationInFrames: manifest.totalDurationInFrames,
          fps: manifest.fps,
          width: manifest.width,
          height: manifest.height,
        };
      }}
    />
  );
};
