import fs from "fs";
import path from "path";

interface SceneText {
  id: string;
  text: string;
}

const SCENES: SceneText[] = [
  {
    id: "S01",
    text: "Bạn có bao giờ bực mình vì mỗi lần mở đoạn chat mới, AI lại quên sạch mọi thông tin về bạn?",
  },
  {
    id: "S02",
    text: "Dù context window có lớn đến đâu, AI vẫn gặp hiện tượng mất ngữ cảnh thảm khốc khi chuyển đổi giữa các phiên làm việc.",
  },
  {
    id: "S03",
    text: "Supermemory là dự án mã nguồn mở với hơn ba mươi hai nghìn ngôi sao trên GitHub, đóng vai trò như bộ não ngoài của AI.",
  },
  {
    id: "S04",
    text: "Khác với RAG thông thường, hệ thống tự động bóc tách sự thật, xây dựng đồ thị quan hệ và cập nhật hồ sơ người dùng chỉ trong năm mươi mili giây.",
  },
  {
    id: "S05",
    text: "Chế độ tìm kiếm lai kết hợp cả vector ngữ nghĩa lẫn từ khóa chính xác, giúp AI truy xuất thông tin quá khứ mà không bỏ sót bất kỳ chi tiết nào.",
  },
  {
    id: "S06",
    text: "Nhờ giao thức Model Context Protocol, Supermemory tích hợp trực tiếp vào Cursor và Claude Code, đồng bộ dữ liệu từ Notion, Drive và trình duyệt.",
  },
  {
    id: "S07",
    text: "Bạn có thể tự chạy Supermemory cục bộ bằng Docker hoặc một lệnh đơn giản, kết nối với mô hình AI cục bộ để bảo mật dữ liệu tuyệt đối.",
  },
  {
    id: "S08",
    text: "Supermemory chính là mảnh ghép còn thiếu để AI thực sự hiểu bạn. Bạn nghĩ sao về công nghệ này? Follow ngay để đón xem các công cụ đột phá tiếp theo!",
  },
];

async function generateAll() {
  console.log("Generating ZeroTTS audio for 8 scenes using voice 'maichi'...\n");

  const voiceId = "maichi";
  const results = [];

  const targetAudioDir = path.join(
    process.cwd(),
    "production/videos/supermemory-review-001/audio"
  );
  const publicAudioDir = path.join(process.cwd(), "public/audio/supermemory");

  fs.mkdirSync(targetAudioDir, { recursive: true });
  fs.mkdirSync(publicAudioDir, { recursive: true });

  for (const scene of SCENES) {
    console.log(`[${scene.id}] Generating: "${scene.text.slice(0, 40)}..."`);
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
    console.log(
      `✔ ${scene.id}: duration ${data.duration}s, sample_rate: ${data.sample_rate}Hz, file: ${data.file_name}`
    );

    // Copy generated file from public/audio/generated/{data.file_name} to production audio and public/audio/supermemory
    const srcFile = path.join(process.cwd(), "public/audio/generated", data.file_name);
    const destSceneFile = path.join(targetAudioDir, `${scene.id}.wav`);
    const publicSceneFile = path.join(publicAudioDir, `${scene.id}.wav`);

    fs.copyFileSync(srcFile, destSceneFile);
    fs.copyFileSync(srcFile, publicSceneFile);

    results.push({
      sceneId: scene.id,
      text: scene.text,
      duration: data.duration,
      durationInFrames: Math.ceil(data.duration * 30),
      sampleRate: data.sample_rate,
      fileName: `${scene.id}.wav`,
      publicSrc: `audio/supermemory/${scene.id}.wav`,
    });
  }

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const totalFrames = results.reduce((sum, r) => sum + r.durationInFrames, 0);

  console.log(`\n========================================`);
  console.log(`ALL 8 SCENES GENERATED SUCCESSFULLY!`);
  console.log(`Total Audio Duration: ${totalDuration.toFixed(2)}s`);
  console.log(`Total Frames (@ 30fps): ${totalFrames} frames`);
  console.log(`========================================\n`);

  fs.writeFileSync(
    path.join(process.cwd(), "production/videos/supermemory-review-001/audio-manifest.json"),
    JSON.stringify({ voiceId, totalDuration, totalFrames, scenes: results }, null, 2)
  );
}

generateAll().catch((err) => {
  console.error("Audio generation failed:", err);
  process.exit(1);
});
