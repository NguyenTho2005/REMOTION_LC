import test from "node:test";
import assert from "node:assert";
import { TaskPlanner } from "../src/orchestrator/TaskPlanner.ts";

test("TaskPlanner: detects AI explainer category and default voice", () => {
  const plan = TaskPlanner.plan("Giải thích AI Agent là gì và cách hoạt động trong 30s");
  assert.strictEqual(plan.category, "ai-explainer");
  assert.strictEqual(plan.durationInSeconds, 30);
  assert.strictEqual(plan.fps, 30);
  assert.strictEqual(plan.durationInFrames, 900);
  assert.strictEqual(plan.recommendedVoiceId, "quangminh");
  assert.ok(plan.targetWordCount > 0);
  assert.ok(plan.suggestedScenes.length >= 3);
});

test("TaskPlanner: detects GitHub repo review category and tiendat voice", () => {
  const plan = TaskPlanner.plan("Review repo github facebook/react với mã nguồn mở trong 45 giây");
  assert.strictEqual(plan.category, "github-repo-review");
  assert.strictEqual(plan.durationInSeconds, 45);
  assert.strictEqual(plan.durationInFrames, 1350);
  assert.strictEqual(plan.recommendedVoiceId, "tiendat");
});

test("TaskPlanner: detects Tech News category and baotrang voice", () => {
  const plan = TaskPlanner.plan("Tin tức công nghệ mới ra mắt bản cập nhật hệ điều hành");
  assert.strictEqual(plan.category, "tech-news");
  assert.strictEqual(plan.recommendedVoiceId, "baotrang");
  assert.strictEqual(plan.durationInSeconds, 35);
});

test("TaskPlanner: detects AI Model Review category", () => {
  const plan = TaskPlanner.plan("Đánh giá mô hình DeepSeek R1 benchmark và khả năng suy luận");
  assert.strictEqual(plan.category, "ai-model-review");
  assert.strictEqual(plan.recommendedVoiceId, "quangminh");
  assert.strictEqual(plan.durationInSeconds, 45);
});
