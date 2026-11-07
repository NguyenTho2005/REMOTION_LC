import test from "node:test";
import assert from "node:assert";
import { StateManager } from "../src/orchestrator/StateManager.ts";
import { ToolRegistry } from "../src/tools/ToolRegistry.ts";

test("StateManager: lifecycle and subscriber events", () => {
  const manager = new StateManager("test-video-1", "Test video prompt");
  const initial = manager.getState();

  assert.strictEqual(initial.status, "idle");
  assert.strictEqual(initial.currentStage, "init");
  assert.strictEqual(initial.progress, 0);

  let notified = false;
  const unsubscribe = manager.subscribe((state) => {
    if (state.currentStage === "research") {
      notified = true;
    }
  });

  manager.startStage("research");
  manager.setProgress(20);

  assert.strictEqual(notified, true);
  assert.strictEqual(manager.getState().status, "running");
  assert.strictEqual(manager.getState().progress, 20);

  unsubscribe();
});

test("ToolRegistry: registration and invocation", async () => {
  const tools = ToolRegistry.listTools();
  assert.ok(tools.length >= 5);

  const researchTool = ToolRegistry.getTool("research_topic");
  assert.ok(researchTool !== undefined);

  const result: any = await ToolRegistry.invokeTool("research_topic", {
    prompt: "Khám phá AI Agent",
    category: "ai-explainer",
    entities: ["AI Agent"],
  });

  assert.ok(result.title.includes("AI Agent"));
  assert.ok(result.facts.length > 0);
});
