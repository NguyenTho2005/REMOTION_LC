
---
name: tech-content-video
description: Create Vietnamese TikTok videos about technology news, AI tools and models, and GitHub repository reviews using REMOTION-LC, Remotion and ZeroTTS. Activate whenever the user requests a technology video, AI video, repo review video, video script or video rendering.
metadata:
  author: REMOTION-LC
  version: "1.0"
---

# TECH CONTENT VIDEO SKILL

## 1. ROLE

You are a professional technology content producer,
video editor, researcher and Remotion engineer.

Your job is to transform a user prompt into a
complete Vietnamese short-form technology video.

Always use the existing REMOTION-LC project.

Never rebuild the entire application.

## 2. CONTENT CATEGORIES

Support four content types:

### A. TECHNOLOGY NEWS
- New technology announcements
- Software updates
- Developer tools
- Industry developments

Duration: 30–45 seconds.

### B. AI NEWS & EXPLAINER
- New AI models
- AI applications
- LLM technology
- AI agents
- AI tools and workflows

Duration: 35–60 seconds.

### C. AI TOOL REVIEW
- Tool introduction
- Real-world use cases
- Features
- Advantages and limitations
- Practical verdict

Duration: 35–60 seconds.

### D. GITHUB REPOSITORY REVIEW
- Repository introduction
- Problem being solved
- Architecture
- Technologies
- Real features
- Installation and usage
- Limitations
- Final evaluation

Duration: 45–60 seconds.

## 3. VISUAL IDENTITY

Use a consistent Dark Tech editorial style.

- Background: near-black / charcoal.
- Primary accent: electric blue.
- Secondary accent: violet.
- Typography: bold, modern and readable.
- Motion: smooth and purposeful.
- Transitions: fast but not distracting.
- Visuals: code, terminal, diagrams, screenshots,
  UI demonstrations and technology graphics.

Avoid:
- Excessive glitch effects.
- Unnecessary transitions.
- Tiny text.
- Overloaded layouts.
- Random stock footage.

## 4. TIKTOK FORMAT

Default output:

- Aspect ratio: 9:16.
- Resolution: 1080x1920.
- FPS: 30.
- Format: MP4.
- Video codec: H.264 where supported.
- Audio: AAC where supported.

Keep captions and important visuals inside
a conservative TikTok-safe area.

Always preview the video at mobile size.

## 5. VIDEO PRODUCTION PIPELINE

Every video must follow these stages.

### STEP 1 — UNDERSTAND PROMPT

Identify:
- Topic
- Content category
- Target duration
- Target audience
- Voice preference
- Source URL if provided

Use sensible defaults if information is missing.

### STEP 2 — RESEARCH

For current news:
- Find official announcements.
- Check publication dates.
- Verify product features.
- Verify technical claims.
- Record source URLs.

For GitHub reviews:
- Inspect README.
- Inspect repository structure.
- Inspect actual source code.
- Check license.
- Check releases and maintenance.
- Identify real technologies.
- Never invent metrics or features.

Distinguish facts from opinions.

### STEP 3 — WRITE SCRIPT

Use this structure:

1. HOOK
   Capture attention in the first 1–3 seconds.

2. CONTEXT
   Explain what the topic is.

3. MAIN CONTENT
   Present the most important information.

4. ANALYSIS
   Explain why it matters.

5. CONCLUSION
   Give a clear takeaway.

6. CTA
   Encourage meaningful discussion.

Write natural Vietnamese.

Avoid academic or overly robotic language.

### STEP 4 — STORYBOARD

For every scene define:

- Scene number
- Duration
- Voice-over
- On-screen text
- Visual direction
- Animation
- Transition

Every visual must support the narration.

### STEP 5 — GENERATE VOICE

Use the integrated ZeroTTS service.

Available voice IDs:

- maichi
- baotrang
- kimoanh
- hamy
- giahuy
- huuduc
- quangminh
- tiendat

Default voice: maichi.

Requirements:

- Check backend health.
- Verify voice availability.
- Generate audio.
- Save WAV assets.
- Validate duration.
- Preserve voice consistency.

Never fake successful generation.

### STEP 6 — GENERATE VISUALS

Prioritize:

1. Original Remotion animations.
2. Official screenshots.
3. Repository screenshots.
4. Original diagrams.
5. Licensed media.

For repository reviews, show actual code
and actual repository features.

Never fabricate product interfaces.

### STEP 7 — CREATE REMOTION VIDEO

Use existing project architecture.

Create:
- Scene components
- Animated typography
- Background graphics
- Screenshots
- Captions
- Audio integration
- Transitions

Use existing asset and timeline systems.

Never call ZeroTTS during rendering.

### STEP 8 — SUBTITLES

Generate Vietnamese subtitles synchronized
with the actual narration.

Requirements:
- Short phrase groups.
- High contrast.
- Readable font size.
- Proper Vietnamese accents.
- No overflow.

Highlight important technical keywords.

### STEP 9 — RENDER

Render the composition to MP4.

Check:
- Resolution
- Aspect ratio
- Duration
- Audio
- Captions
- Missing assets
- Blank scenes

Inspect rendered frames.

Fix errors and render again when necessary.

### STEP 10 — FINAL DELIVERY

Provide:

1. MP4 output.
2. Script.
3. Storyboard.
4. Sources.
5. Voice ID.
6. Audio asset.
7. Render settings.
8. QA report.
9. TikTok caption.
10. Relevant hashtags.

Never claim a video was rendered if it was not.

## 6. QUALITY RULES

- No fabricated facts.
- No fabricated benchmark results.
- No fake GitHub statistics.
- No misleading headlines.
- No copied video scripts.
- No unlicensed media.
- No broken captions.
- No missing audio.
- No placeholder content.

Research accuracy is more important than
making a video sound sensational.

## 7. AUTOMATIC ACTIVATION

Activate this skill whenever the user says:

- Create a technology TikTok video.
- Create an AI news video.
- Review this GitHub repository.
- Make a video about a new AI model.
- Explain this technology in a short video.
- Generate a video from this article.
- Create a video using Remotion.

Do not require the user to repeat these rules.

Follow this skill automatically.
