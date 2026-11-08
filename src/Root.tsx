import React from "react";
import { MyComposition } from "./Composition";
import { TikTokVideoComposition } from "./templates/TikTokComposition";
import { SupermemoryReviewComposition } from "./templates/supermemory/SupermemoryReview";
import { AIAgentMotionGraphicsExplainerComposition } from "./templates/motion-graphics/AIAgentMotionGraphicsExplainer";
import { VoiceStudioOverlay } from "./components/voice-studio/VoiceStudioOverlay";
import { FiveLevelsOfAIComposition } from "./templates/five-levels-of-ai/FiveLevelsOfAI";
import { NarratoAIEditorialSketchComposition } from "./templates/editorial-sketch/index";
import { ChatGPTCodexLimitsComposition } from "./templates/chatgpt-codex-limits/VideoComposition";
import { Motion3DShowcaseComposition } from "./three/compositions/Motion3DShowcase";
import { ParticleVFXShowcaseComposition } from "./three/particles/ParticleVFXShowcase";
import {
  ThreeTestRotatingObject,
  ThreeTestTypography,
  ThreeTestCameraOrbit,
  ThreeTestGLBModel,
  ThreeTestAlgorithmViz,
  ThreeTestHybridScene,
} from "./three/compositions/TestCompositions";
import { ProofOfStyleComposition } from "./templates/truoc-va-sau-ai/ProofOfStyleComposition";
import { TruocVaSauAIComposition } from "./templates/truoc-va-sau-ai/TruocVaSauAIComposition";
import { CharacterReferenceSheetComposition } from "./templates/truoc-va-sau-ai/character/CharacterReferenceSheet";
import {
  PosesGridComposition,
  DeskValidationComposition,
} from "./templates/truoc-va-sau-ai/character/RigVisualRegression";
import {
  TwoSum3DComposition,
  TwoSum3DComposition3x16,
} from "./templates/two-sum-3d/VideoComposition";
import {
  Responsive3DComposition9x16,
  Responsive3DComposition16x9,
  Responsive3DComposition1x1,
} from "./three/compositions/Responsive3DMultiAspectShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <TikTokVideoComposition />
      <SupermemoryReviewComposition />
      <AIAgentMotionGraphicsExplainerComposition />
      <VoiceStudioOverlay />
      <FiveLevelsOfAIComposition />
      <NarratoAIEditorialSketchComposition />
      <ChatGPTCodexLimitsComposition />
      <Motion3DShowcaseComposition />
      <ParticleVFXShowcaseComposition />
      <ThreeTestRotatingObject />
      <ThreeTestTypography />
      <ThreeTestCameraOrbit />
      <ThreeTestGLBModel />
      <ThreeTestAlgorithmViz />
      <ThreeTestHybridScene />
      {/* TRƯỚC VÀ SAU AI — 5-MINUTE FILM COMPOSITIONS */}
      <ProofOfStyleComposition />
      <TruocVaSauAIComposition />
      <CharacterReferenceSheetComposition />
      <PosesGridComposition />
      <DeskValidationComposition />
      {/* TWO SUM 3D ALGORITHM EXPLAINER */}
      <TwoSum3DComposition />
      <TwoSum3DComposition3x16 />
      {/* RESPONSIVE 3D MULTI-ASPECT SHOWCASE */}
      <Responsive3DComposition9x16 />
      <Responsive3DComposition16x9 />
      <Responsive3DComposition1x1 />
    </>
  );
};


