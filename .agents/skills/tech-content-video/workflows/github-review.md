# Workflow: GitHub Repository Review (45–60s)

## Target Audience
Vietnamese software engineers, open-source contributors, DevOps practitioners, and full-stack developers.

## Objectives
- Review an trending or high-impact open-source repository on GitHub.
- Highlight GitHub star count, primary language, core problem solved, architecture, and quick start installation.
- Show animated code syntax or terminal command execution.

## Execution Sequence
1. **Repository Research:**
   - Extract owner/repo name, official GitHub URL.
   - Star count, primary programming language, license (MIT, Apache-2.0, etc.).
   - Read `README.md`, extract key value proposition and terminal install command (`npm install`, `pip install`, `cargo add`, `docker run`).
   - Identify 2–3 key features that differentiate it from existing tools.
2. **Script Generation:**
   - Duration: 45–60s (~150–200 Vietnamese words).
   - Recommended Voice: `tiendat` (deep, tech specialist) or `quangminh` (authoritative).
   - Structure:
     - **Hook (0–5s):** "Repo GitHub hơn 20.000 stars này đang thay đổi cách chúng ta viết code..."
     - **Repo Identity (5–18s):** Show repo header card, stars, language badge, and core mission.
     - **Core Features (18–35s):** 2 standout architectural highlights or benchmarks.
     - **Quick Start (35–48s):** Simulated terminal installation or code snippet showcase.
     - **Conclusion & Star CTA (48–60s):** Practical takeaway, license notice, and reminder to star the repo.
3. **Visual Layout:**
   - Scene 1: `RepositoryCard` featuring repo avatar, owner/name, star counter, and fork count.
   - Scene 2: `TerminalAnimation` demonstrating instant setup or CLI usage.
   - Scene 3: `CodeShowcase` with highlighted syntax demonstrating developer ergonomic API.
   - Scene 4: Architecture diagram or feature matrix.
   - Scene 5: Outro with GitHub link pill and call to action.
4. **Narration Synthesis & Alignment:**
   - Synthesize speech via ZeroTTS `/api/tts/generate`.
   - Calculate exact duration and map scene frames proportionally.
5. **Quality Assurance Check:**
   - Verify code snippet text is sharp and readable on mobile screens (font size >= 24px).
   - Ensure repository stars and tags stay inside safe zones (top: 150px, bottom: 250px).
