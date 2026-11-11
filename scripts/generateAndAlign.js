#!/usr/bin/env node
/**
 * Generate ZeroTTS voice for bang-motion review, align to word timestamps,
 * and copy outputs into public/src data locations for Remotion.
 *
 * Usage:
 *   node scripts/generateAndAlign.js
 *   node scripts/generateAndAlign.js --skip-generate   (reuse existing src audio)
 *   node scripts/generateAndAlign.js --api http://127.0.0.1:8000/api/tts
 *
 * Requirements for generation:
 *   - ZeroTTS backend running (default http://127.0.0.1:8000/api/tts)
 * For alignment:
 *   - python3 with numpy, scipy, soundfile (or faster-whisper if installed)
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data", "bang-motion");
const PUBLIC_DIR = path.join(ROOT, "public", "bang-motion");
const SCRIPT_PATH = path.join(DATA_DIR, "script.json");
const SRC_AUDIO = path.join(DATA_DIR, "audio.wav");
const PUBLIC_AUDIO = path.join(PUBLIC_DIR, "audio.wav");
const TIMESTAMPS_PATH = path.join(DATA_DIR, "timestamps.json");
const ALIGN_SCRIPT = path.join(ROOT, "scripts", "align_audio.py");

function parseArgs(argv) {
  const args = { skipGenerate: false, api: "http://127.0.0.1:8000/api/tts" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--skip-generate") args.skipGenerate = true;
    else if (a === "--api" && argv[i + 1]) args.api = argv[++i];
  }
  return args;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const detail = data && (data.detail || data.error) ? (data.detail || data.error) : text;
    throw new Error(`HTTP ${res.status} ${url}: ${detail}`);
  }
  return data;
}

async function downloadToFile(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed HTTP ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

async function generateVoice(apiBase, script) {
  const base = apiBase.replace(/\/$/, "");
  // health check
  try {
    await fetchJson(`${base}/health`);
  } catch (e) {
    throw new Error(
      `TTS backend chưa sẵn sàng tại ${base}. Hãy chạy: npm run tts (hoặc khởi động tts-service). Chi tiết: ${e.message}`
    );
  }

  const voiceId = (script.voice && script.voice.voiceId) || "quangminh";
  const text = script.fullText || (script.scenes || []).map(s => s.text).join(" ");
  if (!text || !text.trim()) throw new Error("Script không có fullText/text để synthesize.");

  console.log(`[tts] Generating voice '${voiceId}' via ${base}/generate ...`);
  const gen = await fetchJson(`${base}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice_id: voiceId, normalize_text: true }),
  });

  // Prefer downloading from backend static mount; fall back to local generated path if same machine.
  const audioUrl = gen.audio_url || gen.audioUrl;
  const backendOrigin = base.replace(/\/api\/tts\/?$/, "");
  let downloaded = false;
  if (audioUrl) {
    const fullUrl = audioUrl.startsWith("http") ? audioUrl : `${backendOrigin}${audioUrl.startsWith("/") ? "" : "/"}${audioUrl}`;
    try {
      await downloadToFile(fullUrl, SRC_AUDIO);
      downloaded = true;
      console.log(`[tts] Downloaded audio -> ${path.relative(ROOT, SRC_AUDIO)}`);
    } catch (e) {
      console.warn(`[tts] Không tải được từ ${fullUrl}: ${e.message}`);
    }
  }
  if (!downloaded && gen.file_name) {
    const localGen = path.join(ROOT, "public", "audio", "generated", gen.file_name);
    if (fs.existsSync(localGen)) {
      fs.copyFileSync(localGen, SRC_AUDIO);
      downloaded = true;
      console.log(`[tts] Copied generated audio -> ${path.relative(ROOT, SRC_AUDIO)}`);
    }
  }
  if (!downloaded) {
    throw new Error("Không lấy được file audio từ TTS service. Kiểm tra audio_url/file_name và quyền truy cập.");
  }

  return gen;
}

function getWavDurationSec(wavPath) {
  // Minimal WAV header parse for PCM/IEEE float; fallback null.
  try {
    const fd = fs.openSync(wavPath, "r");
    const head = Buffer.alloc(64);
    fs.readSync(fd, head, 0, 64, 0);
    const riff = head.toString("ascii", 0, 4);
    const wave = head.toString("ascii", 8, 12);
    if (riff !== "RIFF" || wave !== "WAVE") { fs.closeSync(fd); return null; }
    // find fmt/data chunks (simple scan)
    const stat = fs.fstatSync(fd);
    const buf = Buffer.alloc(Math.min(stat.size, 4096));
    fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    let off = 12;
    let byteRate = 0, dataSize = 0;
    while (off + 8 <= buf.length) {
      const id = buf.toString("ascii", off, off + 4);
      const sz = buf.readUInt32LE(off + 4);
      if (id === "fmt " && off + 8 + 16 <= buf.length) {
        byteRate = buf.readUInt32LE(off + 8 + 8);
      }
      if (id === "data") {
        dataSize = sz;
        break;
      }
      off += 8 + sz + (sz % 2);
    }
    if (byteRate > 0 && dataSize > 0) return dataSize / byteRate;
  } catch {}
  return null;
}

function resolvePython() {
  if (process.env.PYTHON) return process.env.PYTHON;
  const venvPy = path.join(ROOT, "tts-service", ".venv", "bin", "python");
  if (fs.existsSync(venvPy)) return venvPy;
  return "python3";
}

function runAlignment(fps) {
  const py = resolvePython();
  const args = [
    ALIGN_SCRIPT,
    "--audio", SRC_AUDIO,
    "--script", SCRIPT_PATH,
    "--output", TIMESTAMPS_PATH,
    "--fps", String(fps),
  ];
  console.log(`[align] ${py} ${args.map(a => JSON.stringify(a)).join(" ")}`);
  const res = spawnSync(py, args, { cwd: ROOT, encoding: "utf8" });
  if (res.stdout) process.stdout.write(res.stdout);
  if (res.stderr) process.stderr.write(res.stderr);
  if (res.status !== 0) {
    throw new Error(
      `Alignment failed (exit ${res.status}). Cần Python có numpy/scipy/soundfile ` +
      `(gợi ý: dùng tts-service/.venv hoặc PYTHON=/path/to/python).`
    );
  }
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!fs.existsSync(SCRIPT_PATH)) throw new Error(`Missing script: ${SCRIPT_PATH}`);
  ensureDir(DATA_DIR);
  ensureDir(PUBLIC_DIR);

  const script = readJson(SCRIPT_PATH);
  const fps = Number(script.fps || 30);

  if (!opts.skipGenerate) {
    try {
      const gen = await generateVoice(opts.api, script);
      if (gen && typeof gen.duration === "number") {
        script.durationSeconds = Math.round(gen.duration * 1000) / 1000;
        script.durationInFrames = Math.max(1, Math.round(gen.duration * fps));
      }
    } catch (e) {
      console.error(`[tts] ${e.message}`);
      console.error("[tts] Tiếp tục bằng audio hiện có (nếu có) với --skip-generate hoặc sau khi khởi động TTS.");
      if (!fs.existsSync(SRC_AUDIO)) process.exit(1);
    }
  } else {
    console.log("[tts] Bỏ qua bước generate (--skip-generate), dùng audio hiện có.");
  }

  if (!fs.existsSync(SRC_AUDIO)) {
    throw new Error(`Không tìm thấy audio nguồn: ${SRC_AUDIO}`);
  }

  runAlignment(fps);

  // Sync outputs
  fs.copyFileSync(SRC_AUDIO, PUBLIC_AUDIO);
  console.log(`[sync] Copied audio -> ${path.relative(ROOT, PUBLIC_AUDIO)}`);

  // Update script duration from actual audio if possible
  const dur = getWavDurationSec(SRC_AUDIO);
  if (dur && isFinite(dur)) {
    script.durationSeconds = Math.round(dur * 1000) / 1000;
    script.durationInFrames = Math.max(1, Math.round(dur * fps));
    // keep scene end aligned if total is 48-ish only when consistent; otherwise leave scenes as authored
    if (script.scenes && script.scenes.length) {
      const last = script.scenes[script.scenes.length - 1];
      if (typeof last.end_sec === "number") {
        last.end_sec = script.durationSeconds;
      }
    }
    writeJson(SCRIPT_PATH, script);
    console.log(`[meta] Updated script duration: ${script.durationSeconds}s (${script.durationInFrames} frames)`);
  }

  // copy timestamps to public optional mirror? keep canonical in src/data
  console.log("[done] Updated timestamps:", path.relative(ROOT, TIMESTAMPS_PATH));
  console.log("[note] Nếu dùng audio/timestamps thật từ ZeroTTS, hãy kiểm tra lại ranh giới scene trong script.json cho khớp nhịp đọc.");
}

main().catch((err) => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});
