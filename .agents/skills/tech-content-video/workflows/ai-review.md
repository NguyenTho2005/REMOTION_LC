# Workflow: AI Model & Tool Review (35–60s)

## Target Audience
Vietnamese AI practitioners, software developers, prompt engineers, and tech creators.

## Objectives
- Present an objective, concise review of a newly released AI model (e.g. Gemini, DeepSeek, Claude, Llama) or AI developer tool.
- Clarify real-world capabilities, benchmark metrics, context window size, pricing or open-weight availability.
- Provide a concrete hands-on example (prompt, benchmark chart, or code snippet).

## Execution Sequence
1. **Model / Tool Research:**
   - Extract model provider (Google, Anthropic, DeepSeek, Meta, OpenAI).
   - Identify standout specs: parameter size, context length, MMLU/HumanEval score, pricing per million tokens, license (open weights vs API).
   - Note key strengths and current limitations.
2. **Script Generation:**
   - Duration: 35–60s (~120–190 Vietnamese words).
   - Tone: Analytical, sharp, professional.
   - Recommended Voice: `quangminh` (analytical authority) or `giahuy` (enthusiastic & energetic).
   - Structure:
     - **Hook (0–5s):** Shock metric or paradigm shift ("Mô hình AI mã nguồn mở này vừa đánh bại các đối thủ thương mại lớn nhất?").
     - **Context & Key Specs (5–20s):** Architecture, parameters, latency, cost.
     - **Benchmark / Demo Showcase (20–40s):** Concrete benchmark comparison or coding performance.
     - **Pros & Cons / Pricing (40–50s):** Real-world trade-offs, license.
     - **Verdict & CTA (50–60s):** Who should use this and call to action.
3. **Visual Layout:**
   - Scene 1: `HookScene` with glowing model badge and release highlight.
   - Scene 2: `FeatureHighlight` / `AIConceptScene` showing specs and architecture metrics.
   - Scene 3: Benchmark comparison chart or code execution showcase.
   - Scene 4: Summary scorecard with pros, cons, and rating badge.
   - Scene 5: Outro with source attribution and discussion question.
4. **Audio & Narration:**
   - ZeroTTS generation via `/api/tts/generate` with selected voice.
   - Validate narration duration and align Remotion composition frames ($T_{\text{frames}} = \lceil T_{\text{audio}} \times 30 \rceil$).
5. **Render & QA Verification:**
   - Ensure benchmark labels and parameter specs fit vertical 9:16 safe margins.
   - Verify audio level (-16 to -14 LUFS) and subtitle word alignment.
