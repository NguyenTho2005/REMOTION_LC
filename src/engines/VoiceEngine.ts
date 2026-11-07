import type { VoiceConfig, VoiceId, Script } from "../schemas/index.ts";
import { ttsApi } from "../services/tts-api.ts";

export interface VoiceEngineResult {
  voiceConfig: VoiceConfig;
  assetId: string;
  fileName: string;
  durationInSeconds: number;
  durationInFrames: number;
}

const VOICE_CATALOG_METADATA: Record<VoiceId, { name: string; gender: "female" | "male"; description: string; tags: string[] }> = {
  maichi: {
    name: "Mai Chi",
    gender: "female",
    description: "Giọng nữ miền Bắc nhẹ nhàng, thanh lịch, phù hợp cho tin tức và phóng sự ngắn.",
    tags: ["Miền Bắc", "Truyền cảm", "Nhẹ nhàng"],
  },
  baotrang: {
    name: "Bảo Trang",
    gender: "female",
    description: "Giọng nữ miền Bắc chuyên nghiệp, sắc nét, hoàn hảo cho bản tin công nghệ.",
    tags: ["Miền Bắc", "Chuyên nghiệp", "Tin tức"],
  },
  kimoanh: {
    name: "Kim Oanh",
    gender: "female",
    description: "Giọng nữ miền Bắc ấm áp, thân thiện, thích hợp cho hướng dẫn và explainer.",
    tags: ["Miền Bắc", "Ấm áp", "Hướng dẫn"],
  },
  hamy: {
    name: "Hà My",
    gender: "female",
    description: "Giọng nữ miền Nam trẻ trung, năng động, bắt tai trên TikTok.",
    tags: ["Miền Nam", "Trẻ trung", "Năng động"],
  },
  giahuy: {
    name: "Gia Huy",
    gender: "male",
    description: "Giọng nam miền Nam hiện đại, sôi nổi, phù hợp review sản phẩm và AI tools.",
    tags: ["Miền Nam", "Hiện đại", "Review"],
  },
  huuduc: {
    name: "Hữu Đức",
    gender: "male",
    description: "Giọng nam miền Trung đĩnh đạc, mộc mạc, tạo cảm giác đáng tin cậy.",
    tags: ["Miền Trung", "Đĩnh đạc", "Tin cậy"],
  },
  quangminh: {
    name: "Quang Minh",
    gender: "male",
    description: "Giọng nam miền Bắc chuẩn phát thanh, sắc bén, lý tưởng cho phân tích chuyên sâu.",
    tags: ["Miền Bắc", "Chuẩn phát thanh", "Chuyên gia"],
  },
  tiendat: {
    name: "Tiến Đạt",
    gender: "male",
    description: "Giọng nam miền Bắc trầm ấm, dứt khoát, hoàn hảo cho review mã nguồn mở.",
    tags: ["Miền Bắc", "Trầm ấm", "Lập trình"],
  },
};

export class VoiceEngine {
  public static getVoiceMetadata(voiceId: VoiceId): VoiceConfig {
    const meta = VOICE_CATALOG_METADATA[voiceId] || VOICE_CATALOG_METADATA.quangminh;
    return {
      voiceId,
      name: meta.name,
      gender: meta.gender,
      description: meta.description,
      tags: meta.tags,
      sampleRate: 48000,
      speed: 1.0,
    };
  }

  public static async synthesize(
    script: Script,
    voiceId: VoiceId = "quangminh",
    speed: number = 1.0,
    attachToTimeline: boolean = true
  ): Promise<VoiceEngineResult> {
    const meta = this.getVoiceMetadata(voiceId);

    const response = await ttsApi.generateSpeech({
      text: script.fullText,
      voice_id: voiceId,
      normalize_text: true,
    });

    if (attachToTimeline) {
      try {
        await ttsApi.clearTimeline();
        await ttsApi.addToTimeline(response.asset_id, 0, 1.0);
      } catch (err) {
        console.warn("Failed to automatically attach to timeline:", err);
      }
    }

    const durationInFrames = Math.max(30, Math.ceil(response.duration * 30));

    return {
      voiceConfig: {
        ...meta,
        speed,
        audioFile: response.file_name,
      },
      assetId: response.asset_id,
      fileName: response.file_name,
      durationInSeconds: response.duration,
      durationInFrames,
    };
  }
}
