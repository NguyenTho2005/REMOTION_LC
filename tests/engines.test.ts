import test from "node:test";
import assert from "node:assert";
import { ResearchEngine } from "../src/engines/ResearchEngine.ts";
import { ScriptEngine } from "../src/engines/ScriptEngine.ts";
import { StoryboardEngine } from "../src/engines/StoryboardEngine.ts";
import { VisualEngine } from "../src/engines/VisualEngine.ts";

test("ResearchEngine: researches AI explainer prompt", async () => {
  const result = await ResearchEngine.research(
    "Giải thích AI Agent là gì",
    "ai-explainer",
    ["AI", "Agent"]
  );

  assert.ok(result.title.includes("AI Agent"));
  assert.ok(result.facts.length >= 3);
  assert.ok(result.tags.length > 0);
  assert.strictEqual(result.specs["Concept"], "AI Agent");
});

test("ResearchEngine: researches GitHub repository", async () => {
  const result = await ResearchEngine.research(
    "Review repo zeroweight-ai/ZeroTTS",
    "github-repo-review",
    ["zeroweight-ai/ZeroTTS"]
  );

  assert.ok(result.title.includes("ZeroTTS"));
  assert.ok(result.codeSnippet?.includes("import"));
  assert.ok(result.terminalCommand?.includes("install"));
});

test("ScriptEngine: generates 6-part Vietnamese script and normalizes text", () => {
  const mockResearch = {
    title: "AI Agent Là Gì?",
    summary: "Tổng quan về Agentic AI",
    facts: ["Nhanh", "Tiện", "Chính xác"],
    specs: { Concept: "AI Agent" },
    tags: ["#AI"],
  };

  const script = ScriptEngine.generateScript(mockResearch, "ai-explainer", 30, 85);
  assert.ok(script.sections.length >= 4);
  assert.ok(script.wordCount > 40);
  assert.ok(script.fullText.length > 100);

  // Test Vietnamese normalization
  const normalized = ScriptEngine.normalizeForTTS("Công cụ A & B đạt 100% đánh giá 5★ giá $10 tại @user");
  assert.ok(normalized.includes("và"));
  assert.ok(normalized.includes("phần trăm"));
  assert.ok(normalized.includes("sao"));
  assert.ok(normalized.includes("đô la"));
  assert.ok(normalized.includes("a còng"));
});

test("StoryboardEngine: allocates frames strictly tiling totalFrames without gaps", () => {
  const mockResearch = {
    title: "AI Agent Là Gì?",
    summary: "Tổng quan",
    facts: ["Pillar 1", "Pillar 2"],
    specs: { Concept: "AI Agent" },
    tags: ["#AI"],
  };
  const mockScript = {
    fullText: "Hook. Context. Analysis. CTA.",
    wordCount: 20,
    sections: [
      { id: "1", type: "hook" as const, text: "Hook", startTime: 0, endTime: 5 },
      { id: "2", type: "context" as const, text: "Context", startTime: 5, endTime: 15 },
      { id: "3", type: "analysis" as const, text: "Analysis", startTime: 15, endTime: 25 },
      { id: "4", type: "cta" as const, text: "CTA", startTime: 25, endTime: 30 },
    ],
  };

  const scenes = StoryboardEngine.createStoryboard(
    mockScript,
    mockResearch,
    "ai-explainer",
    30,
    900
  );

  assert.strictEqual(scenes.length, 4);
  let totalAllocated = 0;
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    assert.strictEqual(s.startFrame, totalAllocated);
    totalAllocated += s.durationInFrames;
  }
  assert.strictEqual(totalAllocated, 900);
});

test("VisualEngine: safe zone and dark tech theme properties", () => {
  const theme = VisualEngine.getTheme();
  assert.strictEqual(theme.background, "#090a0f");
  assert.strictEqual(theme.accentCyan, "#38bdf8");

  const safeZone = VisualEngine.getSafeZone();
  assert.strictEqual(safeZone.top, 160);
  assert.strictEqual(safeZone.bottom, 260);

  const tokens = VisualEngine.formatCodeTokens("const x = 1;\n// comment\nreturn x;");
  assert.strictEqual(tokens.length, 3);
});
