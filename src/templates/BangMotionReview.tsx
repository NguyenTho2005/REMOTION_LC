import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PaperCard } from "../components/collage/PaperCard";
import { DoodleMarkings } from "../components/collage/DoodleMarkings";
import { KaraokeSubtitle, type WordTimestamp } from "../components/subtitles/KaraokeSubtitle";
import scriptData from "../data/bang-motion/script.json";
import timestampsData from "../data/bang-motion/timestamps.json";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;
const SCRIPT_DURATION_FRAMES =
  typeof (scriptData as { durationInFrames?: number }).durationInFrames === "number"
    ? (scriptData as { durationInFrames: number }).durationInFrames
    : 1440;
const LAST_WORD_END_FRAME = (timestampsData as WordTimestamp[]).reduce(
  (max, w) => Math.max(max, w.endFrame),
  0,
);
const DURATION_IN_FRAMES = Math.max(SCRIPT_DURATION_FRAMES, LAST_WORD_END_FRAME, 1440);

type ScriptScene = {
  id: string;
  title: string;
  start_sec: number;
  end_sec: number;
  text: string;
};

type ScriptData = {
  scenes: ScriptScene[];
  durationInFrames: number;
  fps: number;
};

const scenes = (scriptData as ScriptData).scenes;
const words = timestampsData as WordTimestamp[];

const popSpring = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 180 },
  });

const PaperBackground: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#efe3c8" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.25), transparent 30%), radial-gradient(circle at 30% 80%, rgba(0,0,0,0.04), transparent 35%), repeating-linear-gradient(0deg, rgba(120,90,60,0.03) 0px, rgba(120,90,60,0.03) 2px, transparent 2px, transparent 8px)",
        }}
      />
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="paper-noise-bm">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.08" />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: "url(#paper-noise-bm)", opacity: 0.35, mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

const CameraDrift: React.FC<{ children: React.ReactNode; start: number; duration: number }> = ({
  children,
  start,
  duration,
}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const p = duration > 0 ? local / duration : 0;
  const x = interpolate(p, [0, 1], [-12, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(p, [0, 1], [10, -12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = interpolate(p, [0, 1], [-0.4, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(p, [0, 1], [1.02, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SceneHeaderSticker: React.FC<{ text: string; color: string; delay?: number }> = ({ text, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  return (
    <div style={{ transform: `scale(${0.6 + 0.4 * s}) rotate(-2deg)`, opacity: Math.min(1, s * 1.2) }}>
      <PaperCard width={760} backgroundColor={color} rotationDeg={-2} padding="18px 26px" style={{ borderRadius: 24 }}>
        <div
          style={{
            fontFamily: '"Arial Black", "Segoe UI", system-ui, sans-serif',
            fontSize: 44,
            fontWeight: 900,
            color: "#111827",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {text}
        </div>
      </PaperCard>
    </div>
  );
};

const CodeMockup: React.FC<{ delay?: number }> = ({ delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  return (
    <div style={{ transform: `scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.2) }}>
      <PaperCard width={820} backgroundColor="#111827" rotationDeg={2} padding={0} style={{ borderRadius: 22 }}>
        <div style={{ padding: "16px 20px", borderBottom: "3px solid #374151", display: "flex", gap: 10 }}>
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#ef4444", display: "inline-block" }} />
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#f59e0b", display: "inline-block" }} />
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#22c55e", display: "inline-block" }} />
          <span style={{ marginLeft: 12, color: "#cbd5e1", fontSize: 22, fontWeight: 700 }}>agent-skill.md</span>
        </div>
        <div style={{ padding: "22px 24px", color: "#e5e7eb", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 28, lineHeight: 1.45 }}>
          <div><span style={{ color: "#60a5fa" }}># bang-motion</span></div>
          <div><span style={{ color: "#34d399" }}>- continuous camera</span></div>
          <div><span style={{ color: "#34d399" }}>- kinetic typography</span></div>
          <div><span style={{ color: "#34d399" }}>- spatial continuity</span></div>
          <div style={{ marginTop: 8, color: "#fbbf24" }}>{"=> teach AI to animate, not slide"}</div>
        </div>
      </PaperCard>
    </div>
  );
};

const StatSticker: React.FC<{ label: string; value: string; delay?: number; rotate?: number; bg?: string }> = ({
  label,
  value,
  delay = 0,
  rotate = -2,
  bg = "#fff7cc",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  return (
    <div style={{ transform: `scale(${0.6 + 0.4 * s}) rotate(${rotate}deg)`, opacity: Math.min(1, s * 1.2) }}>
      <PaperCard width={360} backgroundColor={bg} rotationDeg={rotate} padding="18px 20px">
        <div style={{ fontSize: 22, fontWeight: 800, color: "#374151", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#111827", lineHeight: 1 }}>{value}</div>
      </PaperCard>
    </div>
  );
};

const Scene1Hook: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 170, left: 120 }}>
      <SceneHeaderSticker text="AI làm video mà như PowerPoint?!" color="#fde047" delay={0} />
    </div>
    <div style={{ position: "absolute", top: 470, left: 130 }}>
      <StatSticker label="VẤN ĐỀ" value="Slide cứng nhắc" bg="#fecaca" rotate={-3} delay={6} />
    </div>
    <div style={{ position: "absolute", top: 520, right: 120 }}>
      <StatSticker label="CẢM GIÁC" value="Ngắt quãng" bg="#bfdbfe" rotate={3} delay={10} />
    </div>
    <div style={{ position: "absolute", top: 760, left: 130, right: 130, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: "rotate(1deg)" }}>
        <PaperCard width={820} backgroundColor="#fff" rotationDeg={1} padding="26px 30px">
          <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.25, color: "#111827", textAlign: "center", fontFamily: '"Arial Black", system-ui, sans-serif' }}>
            Hook mạnh trước khi repo xuất hiện!
          </div>
        </PaperCard>
      </div>
    </div>
  </AbsoluteFill>
);

const Scene2Solution: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 160, left: 160 }}>
      <SceneHeaderSticker text="bang-motion = Agent Skill" color="#bbf7d0" delay={0} />
    </div>
    <div style={{ position: "absolute", top: 360, left: 130, right: 130, display: "flex", justifyContent: "center" }}>
      <CodeMockup delay={5} />
    </div>
    <div style={{ position: "absolute", top: 980, left: 90 }}>
      <StatSticker label="KHÔNG PHẢI" value="UI Library" bg="#fecaca" rotate={-4} delay={12} />
    </div>
    <div style={{ position: "absolute", top: 1020, right: 90 }}>
      <StatSticker label="MÀ LÀ" value="Motion Mindset" bg="#ddd6fe" rotate={3} delay={16} />
    </div>
  </AbsoluteFill>
);

const Scene3Mechanics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = popSpring(frame, fps, 2);
  const s2 = popSpring(frame, fps, 10);
  const s3 = popSpring(frame, fps, 18);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 150, left: 150 }}>
        <SceneHeaderSticker text="Core Mechanics" color="#bae6fd" delay={0} />
      </div>
      <div style={{ position: "absolute", top: 360, left: 100, transform: `scale(${0.7 + 0.3 * s1}) rotate(-2deg)`, opacity: Math.min(1, s1 * 1.2) }}>
        <PaperCard width={420} backgroundColor="#fff" rotationDeg={-2} padding="20px">
          <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>Continuous Camera</div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#334155", lineHeight: 1.35 }}>Camera trôi liên tục, không ngắt cảnh kiểu slide.</div>
        </PaperCard>
      </div>
      <div style={{ position: "absolute", top: 560, right: 90, transform: `scale(${0.7 + 0.3 * s2}) rotate(3deg)`, opacity: Math.min(1, s2 * 1.2) }}>
        <PaperCard width={430} backgroundColor="#fef3c7" rotationDeg={3} padding="20px">
          <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>Kinetic Typography</div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#334155", lineHeight: 1.35 }}>Chữ bung theo nhịp, dẫn mắt và nhấn ý.</div>
        </PaperCard>
      </div>
      <div style={{ position: "absolute", top: 820, left: 200, transform: `scale(${0.7 + 0.3 * s3}) rotate(1deg)`, opacity: Math.min(1, s3 * 1.2) }}>
        <PaperCard width={680} backgroundColor="#dcfce7" rotationDeg={1} padding="22px">
          <div style={{ fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Spatial Continuity</div>
          <div style={{ marginTop: 8, fontSize: 24, color: "#334155", lineHeight: 1.35 }}>Biến dòng lệnh thành hoạt ảnh sống động, liền mạch giữa các ý.</div>
        </PaperCard>
      </div>
    </AbsoluteFill>
  );
};

const Scene4CTA: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 180, left: 150 }}>
      <SceneHeaderSticker text="Nâng cấp video code của bạn" color="#fbcfe8" delay={0} />
    </div>
    <div style={{ position: "absolute", top: 420, left: 130, right: 130, display: "flex", justifyContent: "center" }}>
      <CodeMockup delay={4} />
    </div>
    <div style={{ position: "absolute", top: 980, left: 110, right: 110, display: "flex", justifyContent: "center" }}>
      <div>
        <PaperCard width={860} backgroundColor="#fde68a" rotationDeg={-1} padding="24px 28px">
          <div style={{ fontSize: 44, fontWeight: 900, color: "#111827", textAlign: "center", lineHeight: 1.2, fontFamily: '"Arial Black", system-ui, sans-serif' }}>
            Clone repo vào thư mục skill của agent
          </div>
          <div style={{ marginTop: 14, fontSize: 30, fontWeight: 800, color: "#1f2937", textAlign: "center" }}>
            github.com/bangtutorial/bang-motion
          </div>
        </PaperCard>
      </div>
    </div>
  </AbsoluteFill>
);

const SceneById: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  if (sceneId === "scene-1-hook") return <Scene1Hook />;
  if (sceneId === "scene-2-problem-solution") return <Scene2Solution />;
  if (sceneId === "scene-3-core-mechanics") return <Scene3Mechanics />;
  return <Scene4CTA />;
};

export const BangMotionReviewVideo: React.FC = () => {
  const sceneRanges = useMemo(
    () =>
      scenes.map((s) => ({
        ...s,
        from: Math.round(s.start_sec * FPS),
        durationInFrames: Math.max(1, Math.round((s.end_sec - s.start_sec) * FPS)),
      })),
    [],
  );

  return (
    <AbsoluteFill style={{ width: WIDTH, height: HEIGHT, backgroundColor: "#efe3c8", overflow: "hidden" }}>
      <PaperBackground />

      {sceneRanges.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} name={scene.title}>
          <CameraDrift start={scene.from} duration={scene.durationInFrames}>
            <AbsoluteFill>
              <SceneById sceneId={scene.id} />
              <DoodleMarkings width={WIDTH} height={HEIGHT} />
            </AbsoluteFill>
          </CameraDrift>
        </Sequence>
      ))}

      {/* Cartoon Comic Karaoke Subtitles (word-level timestamps) */}
      <KaraokeSubtitle words={words} wordsPerChunk={4} bottomOffset={320} />

      {/* Audio: pre-synthesized WAV in public (ZeroTTS pipeline output/placeholder) */}
      <Audio src={staticFile("bang-motion/audio.wav")} />
    </AbsoluteFill>
  );
};

export const BangMotionReviewComposition: React.FC = () => {
  return (
    <Composition
      id="BangMotionCartoonReview"
      component={BangMotionReviewVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  );
};
