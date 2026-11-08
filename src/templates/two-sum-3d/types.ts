/**
 * TWO SUM 3D — TYPE DEFINITIONS
 */

export interface WordAlignment {
  text: string;
  relStartMs: number;
  relEndMs: number;
  absStartMs: number;
  absEndMs: number;
  startFrame: number;
  endFrame: number;
}

export interface PhraseAlignment {
  phraseText: string;
  startMs: number;
  endMs: number;
  startFrame: number;
  endFrame: number;
  words: WordAlignment[];
}

export interface SceneAlignment {
  sceneId: string;
  name: string;
  title: string;
  audioFile: string;
  audioDurationSec: number;
  startFrame: number;
  durationInFrames: number;
  audioOffsetFrame: number;
  phrases: PhraseAlignment[];
  words: WordAlignment[];
}

export interface TwoSumNumberItem {
  value: number;
  index: number;
  status: "idle" | "active" | "complement" | "match" | "dim";
}

export interface HashMapEntry {
  key: number; // Value in array
  value: number; // Index in array
  highlight?: boolean;
}

export interface Camera3DKeyframe {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}
