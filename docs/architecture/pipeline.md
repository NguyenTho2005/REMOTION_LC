# Production Pipeline Specification

## 1. 10-Stage Execution Lifecycle

| Stage | Name | Target Duration | Responsibility | Failure Recovery |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `init` | < 1s | Intent classification & category detection | Fallback to `ai-explainer` |
| 2 | `research` | 1–2s | Fact extraction, specs, code & command lookup | Fallback to knowledge graph defaults |
| 3 | `script` | 1–2s | 6-part Vietnamese script formulation | Calibrate word count to target duration |
| 4 | `storyboard` | < 1s | Scene selection and frame allocation | Ensure $\sum \text{frames} = \text{totalFrames}$ |
| 5 | `voice` | 15–25s | ZeroTTS speech synthesis & timeline attach | 3x retry with exponential backoff |
| 6 | `visuals` | < 1s | Theme tokenization & safe margin validation | Dark tech palette enforcement |
| 7 | `captions` | < 1s | Subtitle chunking & word timing alignment | Synchronized with audio duration |
| 8 | `composition` | < 1s | Remotion TikTokVideo composition assembly | Validate tile continuity |
| 9 | `render` | 20–35s | Headless rendering of 1080x1920 30FPS MP4 | Timeout handling & GL renderer fallback |
| 10 | `qa` | 1–2s | FFprobe stream inspection & scorecard | Generate comprehensive JSON QA report |

## 2. Telemetry and Progress Tracking

The pipeline maintains a reactive `StateManager` reporting continuous progress from 0% to 100%:
- 0–10%: Initialization
- 10–25%: Research
- 25–40%: Script & Storyboard
- 40–60%: ZeroTTS Narration
- 60–80%: Visuals, Captions & Composition
- 80–95%: Remotion Rendering
- 95–100%: Quality Assurance & Completion
