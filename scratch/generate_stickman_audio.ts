import fs from "fs";
import path from "path";

interface SceneText {
  id: string;
  title: string;
  text: string;
}

const SCENES: SceneText[] = [
  {
    id: "S01",
    title: "Hook - Nhân viên 24/7",
    text: "Hãy tưởng tượng bạn có một nhân viên làm việc hai mươi bốn giờ mỗi ngày, không cần nghỉ trưa, không phàn nàn và có thể xử lý hàng loạt công việc chỉ bằng vài dòng yêu cầu. Nghe giống khoa học viễn tưởng đúng không? Nhưng đây chính là ý tưởng đằng sau AI Agent.",
  },
  {
    id: "S02",
    title: "Vấn đề của AI thông thường",
    text: "Thông thường, khi sử dụng AI chatbot, chúng ta đặt câu hỏi và nhận câu trả lời. Muốn làm việc tiếp theo, chúng ta lại phải nhập yêu cầu mới. AI chủ yếu phản hồi những gì được yêu cầu, chứ không tự động thực hiện toàn bộ quy trình thay chúng ta.",
  },
  {
    id: "S03",
    title: "Giới thiệu AI Agent",
    text: "AI Agent được phát triển để giải quyết một phần hạn chế đó. Thay vì chỉ trả lời câu hỏi, nó có thể tiếp nhận một mục tiêu, phân tích công việc, lập kế hoạch và sử dụng các công cụ phù hợp để hoàn thành nhiệm vụ.",
  },
  {
    id: "S04",
    title: "Cách AI Agent hoạt động",
    text: "Hãy nhìn vào quy trình cơ bản. Đầu tiên, Agent nhận mục tiêu. Tiếp theo, nó phân tích yêu cầu và chia công việc thành từng bước. Sau đó, nó lựa chọn công cụ, thực hiện hành động, kiểm tra kết quả và điều chỉnh nếu cần thiết.",
  },
  {
    id: "S05",
    title: "Ví dụ thực tế",
    text: "Ví dụ, bạn yêu cầu Agent nghiên cứu một chủ đề và tạo báo cáo. Thay vì chỉ đưa ra vài gợi ý, Agent có thể tìm kiếm thông tin, đọc tài liệu, tổng hợp nội dung, tạo bản báo cáo và lưu kết quả vào một tệp. Tất nhiên, những thao tác quan trọng vẫn cần được kiểm tra.",
  },
  {
    id: "S06",
    title: "Tool Calling",
    text: "Một thành phần rất quan trọng là Tool Calling. AI Agent có thể sử dụng những công cụ được cấp quyền như trình duyệt, hệ thống tệp, cơ sở dữ liệu hoặc API. Nhờ đó, nó không chỉ tạo ra văn bản mà còn có thể tương tác với phần mềm bên ngoài.",
  },
  {
    id: "S07",
    title: "Memory & Context",
    text: "Nhưng nếu Agent không nhớ những gì đã làm trước đó thì sao? Đây là lúc Memory phát huy tác dụng. Bộ nhớ giúp hệ thống lưu lại thông tin liên quan, ghi nhận tiến trình và sử dụng ngữ cảnh từ những lần tương tác trước. Nhờ vậy, Agent có thể làm việc nhất quán hơn.",
  },
  {
    id: "S08",
    title: "Multi-Agent System",
    text: "Với những nhiệm vụ lớn hơn, chúng ta có thể xây dựng hệ thống nhiều Agent. Một Agent phụ trách nghiên cứu, một Agent viết nội dung, một Agent kiểm tra và một Agent tổng hợp kết quả. Chúng phối hợp với nhau dưới sự điều phối của một hệ thống trung tâm.",
  },
  {
    id: "S09",
    title: "Ứng dụng trong thực tế",
    text: "AI Agent có thể được ứng dụng trong rất nhiều lĩnh vực. Ví dụ, hỗ trợ lập trình, phân tích dữ liệu, chăm sóc khách hàng, nghiên cứu tài liệu hay tự động hóa những công việc lặp đi lặp lại. Điều quan trọng là lựa chọn đúng nhiệm vụ và công cụ phù hợp.",
  },
  {
    id: "S10",
    title: "Hạn chế & Rủi ro",
    text: "Tuy nhiên, AI Agent không phải phép màu. Nó có thể hiểu sai yêu cầu, lựa chọn công cụ không phù hợp hoặc tạo ra kết quả thiếu chính xác. Nếu được cấp quyền quá rộng, một hành động sai cũng có thể gây ra hậu quả ngoài ý muốn.",
  },
  {
    id: "S11",
    title: "Human in the Loop",
    text: "Vì vậy, Human in the Loop rất quan trọng. Con người vẫn cần kiểm tra, phê duyệt những hành động nhạy cảm và đánh giá kết quả cuối cùng. AI nên hỗ trợ con người làm việc hiệu quả hơn, chứ không có nghĩa là chúng ta giao toàn bộ quyền kiểm soát cho nó.",
  },
  {
    id: "S12",
    title: "Tương lai của AI Agent",
    text: "Trong tương lai, AI Agent có thể trở thành một lớp trợ lý thông minh nằm trong các phần mềm chúng ta sử dụng hằng ngày. Từ việc quản lý công việc, hỗ trợ phát triển phần mềm đến kết nối nhiều dịch vụ khác nhau, khả năng tự động hóa sẽ ngày càng mở rộng.",
  },
  {
    id: "S13",
    title: "Tóm tắt 5 trụ cột",
    text: "Tóm lại, AI Agent không đơn thuần là một chatbot thông minh hơn. Nó là một hệ thống có khả năng tiếp nhận mục tiêu, lập kế hoạch, sử dụng công cụ, ghi nhớ ngữ cảnh và đánh giá kết quả. Đây chính là điểm khác biệt quan trọng giữa việc hỏi AI và giao một nhiệm vụ cho AI thực hiện.",
  },
  {
    id: "S14",
    title: "Outro & CTA",
    text: "Bạn nghĩ AI Agent sẽ thay đổi công việc nào đầu tiên? Hãy để lại ý kiến ở phần bình luận. Nếu muốn khám phá thêm những công nghệ AI mới, hãy theo dõi kênh để không bỏ lỡ những video tiếp theo nhé!",
  },
];

async function generateAll() {
  const voiceId = "quangminh";
  console.log(`\n======================================================`);
  console.log(`  ZEROTTS SYNTHESIS: 14 SCENES (Voice: ${voiceId})`);
  console.log(`======================================================\n`);

  const results = [];
  const targetAudioDir = path.join(
    process.cwd(),
    "production/videos/stickman-ai-agent-001/audio"
  );
  const publicAudioDir = path.join(process.cwd(), "public/audio/stickman");

  fs.mkdirSync(targetAudioDir, { recursive: true });
  fs.mkdirSync(publicAudioDir, { recursive: true });

  let totalDuration = 0;

  for (const scene of SCENES) {
    console.log(`[${scene.id}] Generating: "${scene.title}" (${scene.text.length} chars)...`);
    const res = await fetch("http://127.0.0.1:8000/api/tts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: scene.text,
        voice_id: voiceId,
        normalize_text: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Generation failed for ${scene.id}: ${err}`);
    }

    const data = await res.json();
    const sourceFilePath = path.join(
      process.cwd(),
      "public/audio/generated",
      data.file_name
    );

    const destTargetAudio = path.join(targetAudioDir, `${scene.id}.wav`);
    const destPublicAudio = path.join(publicAudioDir, `${scene.id}.wav`);

    // Copy to production folder and public folder
    fs.copyFileSync(sourceFilePath, destTargetAudio);
    fs.copyFileSync(sourceFilePath, destPublicAudio);

    const durationSec = data.duration;
    const durationFrames = Math.round(durationSec * 30);
    totalDuration += durationSec;

    console.log(
      `   ✔ ${scene.id}.wav: ${durationSec.toFixed(2)}s (${durationFrames} frames) -> saved to audio/ and public/audio/stickman/`
    );

    results.push({
      id: scene.id,
      title: scene.title,
      text: scene.text,
      fileName: `${scene.id}.wav`,
      path: `production/videos/stickman-ai-agent-001/audio/${scene.id}.wav`,
      publicPath: `audio/stickman/${scene.id}.wav`,
      duration: durationSec,
      frames: durationFrames,
      sampleRate: data.sample_rate || 48000,
    });
  }

  const manifest = {
    projectId: "stickman-ai-agent-001",
    voice: {
      provider: "ZeroTTS",
      voiceId,
      sampleRate: 48000,
    },
    totalDurationSeconds: parseFloat(totalDuration.toFixed(2)),
    totalFrames: Math.round(totalDuration * 30),
    scenes: results,
    generatedAt: new Date().toISOString(),
  };

  const manifestPath = path.join(
    process.cwd(),
    "production/videos/stickman-ai-agent-001/audio-manifest.json"
  );
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(`\n======================================================`);
  console.log(`  ALL 14 AUDIO FILES GENERATED SUCCESSFULLY!`);
  console.log(`======================================================`);
  console.log(`Total Duration: ${totalDuration.toFixed(2)}s (${Math.round(totalDuration * 30)} frames @ 30 FPS)`);
  console.log(`Manifest saved: ${manifestPath}\n`);
}

generateAll().catch((err) => {
  console.error("Audio generation failed:", err);
  process.exit(1);
});
