import React from "react";
import { MyComposition } from "./Composition";
import { TikTokVideoComposition } from "./templates/TikTokComposition";
import { SupermemoryReviewComposition } from "./templates/supermemory/SupermemoryReview";
import { VoiceStudioOverlay } from "./components/voice-studio/VoiceStudioOverlay";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <TikTokVideoComposition />
      <SupermemoryReviewComposition />
      <VoiceStudioOverlay />
    </>
  );
};

