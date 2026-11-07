import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import type { QAReport, QACheckItem } from "../schemas/index.ts";

const execAsync = promisify(exec);

export class QualityEngine {
  public static async analyzeVideo(
    videoId: string,
    videoPath: string,
    expectedDurationSeconds?: number
  ): Promise<QAReport> {
    const checks: QACheckItem[] = [];

    // Check 1: File Existence & Size
    const exists = fs.existsSync(videoPath);
    let fileSize = 0;
    if (exists) {
      fileSize = fs.statSync(videoPath).size;
    }

    checks.push({
      name: "File Integrity",
      passed: exists && fileSize > 100 * 1024,
      details: exists
        ? `File size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`
        : "File does not exist on disk",
      score: exists && fileSize > 100 * 1024 ? 100 : 0,
    });

    if (!exists) {
      return {
        videoId,
        overallPassed: false,
        score: 0,
        checks,
        timestamp: new Date().toISOString(),
      };
    }

    // Run ffprobe for deep stream analysis
    try {
      const probeCmd = `ffprobe -v error -show_entries format=duration,size:stream=codec_type,width,height,r_frame_rate,channels -of json "${videoPath}"`;
      const { stdout } = await execAsync(probeCmd);
      const probeData = JSON.parse(stdout);

      const streams = probeData.streams || [];
      const format = probeData.format || {};

      interface StreamInfo {
        codec_type?: string;
        width?: number;
        height?: number;
        r_frame_rate?: string;
        channels?: string | number;
      }
      const videoStream = streams.find((s: StreamInfo) => s.codec_type === "video");
      const audioStream = streams.find((s: StreamInfo) => s.codec_type === "audio");

      const width = videoStream?.width;
      const height = videoStream?.height;
      const duration = parseFloat(format?.duration || "0");
      const hasAudio = !!audioStream;
      const audioChannels = audioStream ? parseInt(audioStream.channels || "2", 10) : 0;

      // Check 2: Resolution (1080x1920)
      const is9x16 = width === 1080 && height === 1920;
      checks.push({
        name: "Resolution & Aspect Ratio (9:16)",
        passed: is9x16,
        details: is9x16
          ? `Resolution verified: 1080x1920 (9:16 vertical)`
          : `Invalid resolution: ${width}x${height} (expected 1080x1920)`,
        score: is9x16 ? 100 : 0,
      });

      // Check 3: Audio Track Presence
      checks.push({
        name: "Audio Stream Presence",
        passed: hasAudio,
        details: hasAudio
          ? `Audio stream detected (${audioChannels} channels)`
          : "No audio stream detected in output video",
        score: hasAudio ? 100 : 0,
      });

      // Check 4: Frame Rate Check (30 FPS)
      const fpsRaw = videoStream?.r_frame_rate || "30/1";
      const [num, den] = fpsRaw.split("/").map(Number);
      const fps = den ? Math.round(num / den) : 30;
      const is30Fps = fps === 30;
      checks.push({
        name: "Frame Rate (30 FPS)",
        passed: is30Fps,
        details: is30Fps ? "Frame rate verified: 30 FPS" : `Frame rate: ${fps} FPS`,
        score: is30Fps ? 100 : 50,
      });

      // Check 5: Duration Alignment
      if (expectedDurationSeconds) {
        const diff = Math.abs(duration - expectedDurationSeconds);
        const durationOk = diff <= 2.0;
        checks.push({
          name: "Duration Alignment",
          passed: durationOk,
          details: `Duration: ${duration.toFixed(2)}s (Target: ${expectedDurationSeconds.toFixed(2)}s, diff: ${diff.toFixed(2)}s)`,
          score: durationOk ? 100 : Math.max(0, 100 - diff * 20),
        });
      }

      const overallPassed = checks.every((c) => c.passed);
      const averageScore = Math.round(
        checks.reduce((sum, c) => sum + c.score, 0) / checks.length
      );

      return {
        videoId,
        overallPassed,
        score: averageScore,
        checks,
        mediaMetadata: {
          width,
          height,
          fps,
          duration,
          hasAudio,
          audioChannels,
          fileSizeBytes: fileSize,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      checks.push({
        name: "Media Stream Analysis",
        passed: false,
        details: `FFprobe inspection failed: ${errorMsg}`,
        score: 0,
      });

      return {
        videoId,
        overallPassed: false,
        score: 30,
        checks,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
