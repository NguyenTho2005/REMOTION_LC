# Developer Guide — Extending Engines & Templates

## 1. Adding a New Scene Template

1. Create the template component under `src/templates/<category>/<TemplateName>.tsx`.
2. Wrap content with `<AbsoluteFill style={{ overflow: "hidden" }}>`.
3. Include `<BackgroundEffects glowColor={accentColor} />`.
4. Ensure text and graphics adhere to TikTok safe zones:
   - Top: 160px
   - Bottom: 260px
   - Left/Right: 60px
5. Include `<SubtitleSequence text={...} durationInFrames={durationInFrames} />`.
6. Register the template name in `src/schemas/scene.schema.json` and `src/schemas/index.ts`.
7. Add the component case to `renderSceneContent` in `src/templates/TikTokComposition.tsx`.

## 2. Registering a New Tool in `ToolRegistry`

```ts
import { ToolRegistry } from "./src/tools/ToolRegistry.ts";

ToolRegistry.registerTool({
  name: "custom_analysis_tool",
  description: "Performs custom data analysis",
  parameters: {
    type: "object",
    required: ["inputData"],
    properties: {
      inputData: { type: "string" },
    },
  },
  execute: async (args: { inputData: string }) => {
    // Implementation
    return { success: true };
  },
});
```

## 3. Running Verification Commands
- `npm test`: Runs Node native TypeScript test suite.
- `npm run test:tts`: Runs Python FastAPI + ZeroTTS pytest suite.
- `npm run lint`: Runs ESLint and strict TypeScript typechecking.
- `npm run build`: Bundles the Remotion project for web preview and headless rendering.
- `npm run render:tiktok`: Renders the default vertical 9:16 TikTok video to `out/tiktok-video.mp4`.
