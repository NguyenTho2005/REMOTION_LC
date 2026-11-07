import type { VideoProject } from "../schemas/index.ts";

export class RemotionEngine {
  public static assembleComposition(project: VideoProject): VideoProject {
    // Validate scene frames strictly match total frames
    let currentFrame = 0;
    const validatedScenes = project.scenes.map((scene) => {
      const startFrame = currentFrame;
      const durationInFrames = Math.max(30, scene.durationInFrames);
      currentFrame += durationInFrames;

      return {
        ...scene,
        startFrame,
        durationInFrames,
      };
    });

    return {
      ...project,
      durationInFrames: currentFrame,
      durationInSeconds: Number((currentFrame / project.fps).toFixed(2)),
      scenes: validatedScenes,
    };
  }
}
