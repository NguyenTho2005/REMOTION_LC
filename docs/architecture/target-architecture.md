# REMOTION-LC — Target Architecture Specification

## 1. Vision & Architecture Paradigm

The target system upgrades REMOTION-LC into an **Autonomous AI Video Production System** specifically designed for Vietnamese Technology, AI, and GitHub Repository videos formatted for **TikTok (9:16 vertical, 1080×1920, 30 FPS, MP4)** in **Dark Tech Editorial** style.

### Architectural Paradigm:
**Single Orchestrator Agent + Modular Engines + Tool-Based Execution**

```text
User Natural Language Prompt
            ↓
    Video Orchestrator
            ↓
       Task Planner
            ↓
     Pipeline Runner
            ↓
┌───────────────────────────────────────────────┐
│ 1. Research Engine     (Web, GitHub, Models)  │
│ 2. Script Engine       (Hook-Context-Content) │
│ 3. Storyboard Engine   (Scenes, Visual Cues)  │
│ 4. Voice Engine        (ZeroTTS Adapter)      │
│ 5. Visual Engine       (Code, Motion, Cards)  │
│ 6. Remotion Engine     (TikTok 9:16 Template) │
│ 7. Quality Engine      (Multi-point QA Checks)│
└───────────────────────────────────────────────┘
            ↓
       Render Engine
            ↓
   Final MP4 Video + QA JSON Report
```

---

## 2. Target Component Breakdown

### 2.1 Video Orchestrator (`src/orchestrator/VideoOrchestrator.ts`)
- Coordinates the entire workflow from user prompt to final video.
- Determines category:
  1. `tech_news`: Fast-paced, breaking tech developments (30–45s).
  2. `ai_news`: AI model releases, benchmarks, industry announcements (35–60s).
  3. `ai_model_review`: Deep dive into model architecture, weights, benchmark results (35–60s).
  4. `ai_tool_review`: Hands-on product demonstration, features, UX review (35–60s).
  5. `github_review`: Repository analysis, architecture, code showcase, stars/stats (45–60s).
  6. `tech_explainer`: Conceptual breakdown of tech topics for Vietnamese engineers (35–60s).
- Selects the optimal Vietnamese ZeroTTS voice based on tone and content type:
  - `quangminh` / `baotrang`: News & formal announcements.
  - `giahuy` / `huuduc`: Deep technical explainers & storytelling.
  - `maichi` / `kimoanh`: Warm educational explainers.
  - `tiendat` / `hamy`: High-energy commentary, tool & repo showcases.

### 2.2 Pipeline Runner & State Manager (`src/orchestrator/PipelineRunner.ts`, `StateManager.ts`)
Executes an explicit 10-stage sequential pipeline with progress logging and stage-level recovery:
1. `PLANNING`: Intent analysis, category selection, voice selection, time budget.
2. `RESEARCHING`: Technical facts verification, GitHub README & commit inspection, documentation review.
3. `SCRIPTING`: 6-part Vietnamese script generation (Hook, Context, Main Content, Analysis, Conclusion, CTA).
4. `STORYBOARDING`: Scene-by-scene breakdown with on-screen text, visual types, transitions, durations.
5. `GENERATING_VOICE`: Speech synthesis via ZeroTTS FastAPI backend (`/api/tts/generate`), verifying audio durations.
6. `GENERATING_ASSETS`: Code snippets, terminal outputs, feature badges, diagrams, icons.
7. `COMPOSING`: Assembling Remotion 9:16 vertical composition (`TikTokVideo`), binding audio and subtitle sequences.
8. `RENDERING`: Remotion CLI bundle & render to MP4.
9. `QUALITY_CHECK`: Dimensions (1080×1920), FPS (30), audio presence, speech sync, asset integrity.
10. `COMPLETED`: Delivery of final MP4 and production report.

### 2.3 Modular Engines (`src/engines/`)
- **ResearchEngine:** Gathers facts, parses GitHub repository data (README, languages, stars, dependencies), official AI model paper/weights details.
- **ScriptEngine:** Generates high-retention Vietnamese spoken narrations adhering to duration limits.
- **StoryboardEngine:** Maps script paragraphs to visual scenes (intro, code view, diagram, split screen, summary).
- **VoiceEngine:** Wraps ZeroTTS backend client (`ttsApi`) to synthesize WAVs, check audio levels, and manage persistent audio assets.
- **VisualEngine:** Prepares code highlight blocks, architecture diagrams, terminal logs, and feature metric cards.
- **RemotionEngine:** Injects storyboard scenes, audio tracks, and word captions into Remotion templates.
- **QualityEngine:** Evaluates output video via `ffprobe` and metadata analysis against strict QA criteria.

### 2.4 Remotion Template System (`src/templates/`)
Vertical 9:16 (`1080×1920`) templates engineered with TikTok safe margins (top 150px, bottom 280px, right 120px):
- `news/`: `NewsIntro`, `BreakingNews`, `NewsHeadline`, `NewsTimeline`
- `ai-explainer/`: `AIConceptScene`, `ArchitectureScene`, `FeatureHighlight`
- `repo-review/`: `RepositoryCard`, `CodeShowcase`, `TerminalAnimation`, `ArchitectureDiagram`
- `shared/`: `HookScene`, `SubtitleSequence`, `SourceCredit`, `OutroScene`, `BackgroundEffects`

---

## 3. Data Models & Schemas (`src/schemas/`)
Strict JSON Schemas and Zod definitions ensuring runtime validation:
- `video.schema.json`: Complete video manifest (id, category, script, scenes, voice, audio, render output).
- `scene.schema.json`: Scene definition (id, visualType, narration, onScreenText, durationInFrames, transition, props).
- `voice.schema.json`: Voice configuration (voiceId, displayName, audioPath, durationSec, sampleRate).
- `pipeline.schema.json`: Pipeline run state (stage, progress, status, error, timestamps).
