import fs from "fs";
import path from "path";

interface SceneAudioSpec {
  id: string;
  name: string;
  startFrame: number;
  durationFrames: number;
  text: string;
}

const SCENE_AUDIO: SceneAudioSpec[] = [
  {
    id: "S01",
    name: "Intro Staircase",
    startFrame: 0,
    durationFrames: 300,
    text: "Năm cấp độ của trí tuệ nhân tạo. Bạn có biết chúng ta đang thực sự đứng ở bậc thang nào trong cuộc cách mạng này không?",
  },
  {
    id: "S02",
    name: "Level 1 Chatbot",
    startFrame: 300,
    durationFrames: 450,
    text: "Cấp độ một: Chatbot. Ở cấp độ này, chúng ta đặt câu hỏi và AI trả lời. Nó rất thông minh về mặt ngôn ngữ, nhưng hoàn toàn thụ động. Bạn phải tự làm mọi thao tác từ mở file, gửi email đến chạy lệnh.",
  },
  {
    id: "S03",
    name: "Level 2 AI Agent",
    startFrame: 750,
    durationFrames: 510,
    text: "Cấp độ hai: AI Agent. Đây chính là bước ngoặt công nghệ của năm hai mươi hai mươi lăm! Thay vì chỉ trò chuyện, AI Agent có thể tiếp nhận mục tiêu, tự lập kế hoạch và tự động sử dụng trình duyệt, cơ sở dữ liệu và mã lệnh để hoàn thành công việc.",
  },
  {
    id: "S04",
    name: "Level 3 Multimodal",
    startFrame: 1260,
    durationFrames: 480,
    text: "Cấp độ ba: Đa giác quan Multimodal. Không còn giới hạn ở văn bản, AI giờ đây có thể nhìn thấy qua camera, nghe giọng nói và phản hồi tức thời theo thời gian thực dưới ba trăm mili giây như một người trợ lý thực thụ.",
  },
  {
    id: "S05",
    name: "Level 4 AGI",
    startFrame: 1740,
    durationFrames: 600,
    text: "Cấp độ bốn: Trí tuệ nhân tạo tổng quát AGI. Đây là khi một hệ thống AI duy nhất có thể học tập, nghiên cứu và làm việc ngang tầm hoặc vượt qua các chuyên gia hàng đầu trong mọi lĩnh vực trí tuệ, từ toán học đến y sinh.",
  },
  {
    id: "S06",
    name: "Level 5 ASI & Outro",
    startFrame: 2340,
    durationFrames: 660,
    text: "Cấp độ năm: Siêu trí tuệ ASI, vượt xa toàn bộ nhân loại cộng lại. Nhưng thực tế hôm nay, bạn chỉ cần làm chủ cấp độ hai là AI Agent. Ai làm chủ công nghệ hôm nay, người đó sẽ dẫn đầu ngày mai. Bấm follow ngay để cùng làm chủ AI nhé!",
  },
];

async function generateAudio(voiceId = "quangminh") {
  console.log(`\n======================================================`);
  console.log(`  SYNTHESIZING 5 LEVELS OF AI AUDIO (Voice: ${voiceId})`);
  console.log(`======================================================\n`);

  const publicDir = path.join(process.cwd(), "public/audio/five-levels-of-ai");
  fs.mkdirSync(publicDir, { recursive: true });

  const generatedTracks = [];
  let totalAudioSeconds = 0;

  for (const item of SCENE_AUDIO) {
    console.log(`[${item.id}] Synthesizing for "${item.name}"...`);
    console.log(`   Text: "${item.text}"`);

    const res = await fetch("http://127.0.0.1:8000/api/tts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: item.text,
        voice_id: voiceId,
        normalize_text: true,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TTS synthesis failed for ${item.id}: ${errorText}`);
    }

    const data = await res.json();
    const sourceFilePath = path.join(
      process.cwd(),
      "public/audio/generated",
      data.file_name
    );

    const destPath = path.join(publicDir, `${item.id}.wav`);
    fs.copyFileSync(sourceFilePath, destPath);

    const durationSec = data.duration;
    const audioFrames = Math.round(durationSec * 30);
    const maxFrames = item.durationFrames;
    const isWithinBounds = audioFrames <= maxFrames;

    console.log(
      `   ✔ ${item.id}.wav generated: ${durationSec.toFixed(2)}s (${audioFrames}f / allocated ${maxFrames}f) - ${isWithinBounds ? "PERFECT FIT" : "WARNING: EXCEEDS SCENE"}`
    );

    totalAudioSeconds += durationSec;

    generatedTracks.push({
      id: item.id,
      name: item.name,
      fileName: `${item.id}.wav`,
      publicSrc: `audio/five-levels-of-ai/${item.id}.wav`,
      startFrame: item.startFrame,
      durationFrames: item.durationFrames,
      audioDurationSec: durationSec,
      audioFrames,
      text: item.text,
      voiceId,
    });
  }

  const manifestPath = path.join(publicDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(generatedTracks, null, 2));

  console.log(`\n======================================================`);
  console.log(`  ALL 6 SCENE VOICES GENERATED & SYNCHRONIZED!`);
  console.log(`  Total Audio Duration: ${totalAudioSeconds.toFixed(2)}s`);
  console.log(`  Manifest saved to: ${manifestPath}`);
  console.log(`======================================================\n`);
}

generateAudio().catch((err) => {
  console.error("Audio generation failed:", err);
  process.exit(1);
});
