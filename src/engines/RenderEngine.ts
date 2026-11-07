import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export interface RenderOptions {
  compositionId?: string;
  outputPath?: string;
  props?: Record<string, unknown>;
  concurrency?: number;
}

export interface RenderResult {
  success: boolean;
  outputPath: string;
  fileSizeBytes: number;
  durationMs: number;
  logs: string;
}

export class RenderEngine {
  public static async renderVideo(options: RenderOptions = {}): Promise<RenderResult> {
    const compositionId = options.compositionId || "TikTokVideo";
    const outputPath =
      options.outputPath ||
      path.join(process.cwd(), "out", `video-${Date.now()}.mp4`);

    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const startTime = Date.now();
    let propsArg = "";
    if (options.props) {
      const propsJson = JSON.stringify(options.props);
      // Escape for bash shell
      propsArg = `--props='${propsJson.replace(/'/g, "'\\''")}'`;
    }

    const cmd = `npx remotion render src/index.ts ${compositionId} ${outputPath} ${propsArg} --gl=angle --timeout=120000`;

    try {
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: process.cwd(),
        maxBuffer: 10 * 1024 * 1024,
      });

      const stats = fs.existsSync(outputPath) ? fs.statSync(outputPath) : null;
      const fileSizeBytes = stats ? stats.size : 0;
      const durationMs = Date.now() - startTime;

      return {
        success: true,
        outputPath,
        fileSizeBytes,
        durationMs,
        logs: `${stdout}\n${stderr}`,
      };
    } catch (err: unknown) {
      const error = err as Error & { stdout?: string; stderr?: string };
      throw new Error(
        `Remotion render failed: ${error.message}\nSTDOUT: ${error.stdout || ""}\nSTDERR: ${error.stderr || ""}`
      );
    }
  }
}
