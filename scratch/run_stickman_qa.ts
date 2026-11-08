import fs from "fs";
import { QualityEngine } from "../src/engines/QualityEngine.ts";

async function main() {
  const videoId = "stickman-ai-agent-001";
  const videoPath = "production/videos/stickman-ai-agent-001/output/ai-agent-motion-graphics-explainer.mp4";
  const targetDuration = 159.04;

  console.log("Analyzing Motion Graphics video output with QualityEngine...");
  const report = await QualityEngine.analyzeVideo(videoId, videoPath, targetDuration);

  // Save JSON report
  const jsonReportPath = "production/videos/stickman-ai-agent-001/reports/qa-report.json";
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), "utf-8");

  // Save Render Report
  const renderReportPath = "production/videos/stickman-ai-agent-001/reports/render-report.json";
  const renderData = {
    compositionId: "AIAgentMotionGraphicsExplainer",
    style: "Modern Minimalist Technology Motion Graphics",
    outputFile: videoPath,
    overallPassed: report.overallPassed,
    qaScore: report.score,
    metadata: report.mediaMetadata,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(renderReportPath, JSON.stringify(renderData, null, 2), "utf-8");

  // Save Markdown QA Report
  const mdReportPath = "production/videos/stickman-ai-agent-001/reports/qa-report.md";
  const mdContent = `# BÁO CÁO KIỂM THỬ CHẤT LƯỢNG (QA REPORT)
## Dự Án: \`${videoId}\` — Motion Graphics Edition
- **Thời gian đánh giá:** ${new Date().toLocaleString("vi-VN")}
- **Phong cách thị giác:** Modern Minimalist Technology Motion Graphics (100% không dùng người que / nhân vật)
- **Tập tin video:** \`${videoPath}\`
- **Kết quả tổng thể:** ${report.overallPassed ? "✅ PASS" : "❌ FAIL"}
- **Điểm chất lượng (QA Score):** **${report.score} / 100**

---

### Chi Tiết Các Hạng Mục Kiểm Tra

| Tiêu chí | Kết quả | Chi tiết kiểm thử | Điểm |
| :--- | :---: | :--- | :---: |
${report.checks
  .map(
    (c) =>
      `| **${c.name}** | ${c.passed ? "✔ ĐẠT" : "❌ KHÔNG ĐẠT"} | ${c.details} | ${c.score}/100 |`
  )
  .join("\n")}

---

### Thông Số Kỹ Thuật Đa Phương Tiện (FFprobe Metadata)

- **Độ phân giải:** ${report.mediaMetadata?.width} × ${report.mediaMetadata?.height} (Tỷ lệ 9:16 dọc)
- **Tốc độ khung hình:** ${report.mediaMetadata?.fps} FPS
- **Thời lượng video:** ${report.mediaMetadata?.duration?.toFixed(2)}s (Mục tiêu: ${targetDuration}s)
- **Kênh âm thanh:** ${report.mediaMetadata?.audioChannels} kênh (${report.mediaMetadata?.hasAudio ? "Có âm thanh" : "Không"})
- **Dung lượng tập tin:** ${((report.mediaMetadata?.fileSizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB
`;

  fs.writeFileSync(mdReportPath, mdContent, "utf-8");
  console.log(`QA completed! Score: ${report.score}/100. Reports saved to reports/`);
}

main().catch(console.error);
