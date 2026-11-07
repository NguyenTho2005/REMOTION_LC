import React from "react";
import { MyComposition } from "./Composition";
import { VoiceStudioOverlay } from "./components/voice-studio/VoiceStudioOverlay";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <VoiceStudioOverlay />
    </>
  );
};
