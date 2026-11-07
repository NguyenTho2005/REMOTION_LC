# Engine Design & Interface Specifications

## 1. Engine Isolation Principles
1. **Stateless Functions / Classes:** All engines are stateless or interface cleanly via explicit input arguments and return strictly validated types.
2. **Runtime Validation:** All engine inputs and outputs are validated with Zod schemas defined in `src/schemas/index.ts`.
3. **No Direct OS Shell Calls in UI Code:** Engines that require OS commands (`RenderEngine`, `QualityEngine`) reside in isolated backend modules invoked via CLI or `ToolRegistry`.

## 2. Engine Interfaces

### `ResearchEngine`
```ts
interface ResearchResult {
  title: string;
  summary: string;
  facts: string[];
  specs: Record<string, string>;
  codeSnippet?: string;
  terminalCommand?: string;
  tags: string[];
}
```

### `ScriptEngine`
```ts
interface Script {
  fullText: string;
  wordCount: number;
  sections: Array<{
    id: string;
    type: "hook" | "context" | "main" | "analysis" | "conclusion" | "cta";
    text: string;
    startTime: number;
    endTime: number;
  }>;
}
```

### `VoiceEngine`
```ts
interface VoiceEngineResult {
  voiceConfig: VoiceConfig;
  assetId: string;
  fileName: string;
  durationInSeconds: number;
  durationInFrames: number;
}
```

### `QualityEngine`
```ts
interface QAReport {
  videoId: string;
  overallPassed: boolean;
  score: number;
  checks: Array<{
    name: string;
    passed: boolean;
    details: string;
    score: number;
  }>;
  mediaMetadata?: {
    width?: number;
    height?: number;
    fps?: number;
    duration?: number;
    hasAudio?: boolean;
    audioChannels?: number;
    fileSizeBytes?: number;
  };
  timestamp: string;
}
```
