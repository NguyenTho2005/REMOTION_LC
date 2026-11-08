import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { random } from "remotion";

export interface ZeroTTSSynthesizeParams {
  text: string;
  voiceId?: string; // e.g. "quangminh", "tiendat", "baotrang", "maichi"
  outputFilePath?: string;
  speed?: number;
}

export interface ZeroTTSSynthesizeResult {
  assetId: string;
  filePath: string;
  publicAudioUrl: string;
  durationInSeconds: number;
  durationInFrames: number;
  sampleRate: number;
  voiceId: string;
}

export class ZeroTTSClient {
  private static readonly CLOUD_ENDPOINT = "https://api.zerotts.com/v1/tts";
  private static readonly LOCAL_ENDPOINT =
    process.env.REMOTION_TTS_API_URL || "http://127.0.0.1:8000/api/tts";

  /**
   * Synthesizes Vietnamese speech using either:
   * 1. Official Cloud ZeroTTS API (if ZEROTTS_API_KEY is present)
   * 2. Local FastAPI service (if running on port 8000)
   * 3. Local ONNX zero-latency runtime via python tts-service
   */
  public static async synthesize(
    params: ZeroTTSSynthesizeParams
  ): Promise<ZeroTTSSynthesizeResult> {
    const text = params.text.trim();
    const voiceId = params.voiceId || "tiendat";
    const apiKey = process.env.ZEROTTS_API_KEY;

    // 1. Try ZeroTTS Cloud API if API key is provided
    if (apiKey) {
      try {
        const response = await fetch(this.CLOUD_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text,
            voice_id: voiceId,
            speed: params.speed || 1.0,
            output_format: "wav",
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          const assetId = `cloud_${Date.now()}_${random(null).toString(36).substring(2, 7)}`;
          const outDir = path.join(process.cwd(), "public", "audio", "generated");
          fs.mkdirSync(outDir, { recursive: true });
          const targetFile =
            params.outputFilePath || path.join(outDir, `${assetId}.wav`);

          if (contentType.includes("audio")) {
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(targetFile, buffer);
            const durationSec = Math.max(1, buffer.length / (48000 * 2));
            return {
              assetId,
              filePath: targetFile,
              publicAudioUrl: `/audio/generated/${path.basename(targetFile)}`,
              durationInSeconds: durationSec,
              durationInFrames: Math.ceil(durationSec * 30),
              sampleRate: 48000,
              voiceId,
            };
          } else {
            const json = (await response.json()) as {
              audio_url?: string;
              audio_base64?: string;
              duration?: number;
            };
            if (json.audio_base64) {
              const buffer = Buffer.from(json.audio_base64, "base64");
              fs.writeFileSync(targetFile, buffer);
              const durationSec = json.duration || Math.max(1, buffer.length / (48000 * 2));
              return {
                assetId,
                filePath: targetFile,
                publicAudioUrl: `/audio/generated/${path.basename(targetFile)}`,
                durationInSeconds: durationSec,
                durationInFrames: Math.ceil(durationSec * 30),
                sampleRate: 48000,
                voiceId,
              };
            }
          }
        }
      } catch (cloudErr) {
        console.warn(
          `[ZeroTTSClient] Cloud API failed or unreachable, falling back to local engine:`,
          cloudErr
        );
      }
    }

    // 2. Try Local FastAPI service
    try {
      const localRes = await fetch(`${this.LOCAL_ENDPOINT}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice_id: voiceId,
          normalize_text: true,
        }),
      });

      if (localRes.ok) {
        const localData = (await localRes.json()) as {
          asset_id: string;
          duration: number;
          sample_rate: number;
          audio_url: string;
          file_name: string;
        };

        const generatedPath = path.join(
          process.cwd(),
          "public",
          "audio",
          "generated",
          localData.file_name
        );

        let finalPath = generatedPath;
        let finalUrl = localData.audio_url;

        if (params.outputFilePath && params.outputFilePath !== generatedPath) {
          fs.mkdirSync(path.dirname(params.outputFilePath), { recursive: true });
          fs.copyFileSync(generatedPath, params.outputFilePath);
          finalPath = params.outputFilePath;
          finalUrl = `/audio/${path.basename(path.dirname(params.outputFilePath))}/${path.basename(params.outputFilePath)}`;
        }

        return {
          assetId: localData.asset_id,
          filePath: finalPath,
          publicAudioUrl: finalUrl,
          durationInSeconds: localData.duration,
          durationInFrames: Math.ceil(localData.duration * 30),
          sampleRate: localData.sample_rate || 48000,
          voiceId,
        };
      }
    } catch {
      // Local FastAPI not running, fallback to direct python runtime
    }

    // 3. Direct Python ONNX runtime fallback
    const assetId = `tts_${Date.now()}_${random(null).toString(36).substring(2, 7)}`;
    const outDir = path.join(process.cwd(), "public", "audio", "generated");
    fs.mkdirSync(outDir, { recursive: true });
    const targetFile =
      params.outputFilePath || path.join(outDir, `${assetId}.wav`);
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });

    const escapedText = text.replace(/"/g, '\\"');
    const pyScript = `
PYTHONPATH=tts-service tts-service/.venv/bin/python -c '
from app.services.zerotts_engine import engine
from pathlib import Path
engine.initialize_model()
audio, sr, dur = engine.synthesize("""${escapedText}""", voice_id="${voiceId}")
engine.save_audio(audio, Path("${targetFile}"), sample_rate=sr)
print(f"DURATION:{dur:.3f}")
'
`;

    const output = execSync(pyScript, {
      cwd: process.cwd(),
      encoding: "utf-8",
    });

    const match = output.match(/DURATION:([0-9.]+)/);
    const duration = match ? parseFloat(match[1]) : 5.0;

    const publicUrl = targetFile.includes("/public/")
      ? targetFile.substring(targetFile.indexOf("/public/") + 7)
      : `/audio/generated/${path.basename(targetFile)}`;

    return {
      assetId,
      filePath: targetFile,
      publicAudioUrl: publicUrl,
      durationInSeconds: duration,
      durationInFrames: Math.ceil(duration * 30),
      sampleRate: 48000,
      voiceId,
    };
  }
}
