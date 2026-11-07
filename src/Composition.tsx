import React, { useState, useEffect } from "react";
import storedTracks from "../public/audio/tracks.json";
import {
  Audio,
  CalculateMetadataFunction,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  getRemotionEnvironment,
} from "remotion";

export interface AudioTrack {
  id: string;
  asset_id: string;
  name: string;
  src: string;
  voice_id: string;
  voice_name: string;
  text?: string;
  start_frame: number;
  duration_in_frames: number;
  volume: number;
}

export type MyCompProps = {
  tracks?: AudioTrack[];
  [key: string]: unknown;
};

// Helper to safely load tracks
function getStoredTracks(): AudioTrack[] {
  if (Array.isArray(storedTracks) && storedTracks.length > 0) {
    return (storedTracks as AudioTrack[]).filter((t) => t && t.src && t.asset_id);
  }
  return [];
}

const calculateMetadata: CalculateMetadataFunction<MyCompProps> = ({ props }) => {
  const tracks = props.tracks && props.tracks.length > 0 ? props.tracks : getStoredTracks();

  let maxEndFrame = 0;
  for (const t of tracks) {
    const end = (t.start_frame || 0) + (t.duration_in_frames || 60);
    if (end > maxEndFrame) {
      maxEndFrame = end;
    }
  }

  // Ensure minimum 90 frames (3s at 30fps), or extend to fit audio + 15 frames buffer
  const durationInFrames = Math.max(90, maxEndFrame > 0 ? maxEndFrame + 15 : 90);

  return {
    props: {
      tracks,
    },
    durationInFrames,
  };
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={90}
      fps={30}
      width={1280}
      height={720}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        tracks: getStoredTracks(),
      }}
    />
  );
};

export const MyComponent: React.FC<MyCompProps> = ({ tracks: initialTracks = [] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const [tracks, setTracks] = useState<AudioTrack[]>(initialTracks);

  // Sync tracks with filesystem / API in Studio mode
  useEffect(() => {
    if (!getRemotionEnvironment().isStudio) return;

    const fetchTracks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tts/timeline/tracks");
        if (res.ok) {
          const data = await res.json();
          setTracks(data);
        }
      } catch {
        // Fallback or offline
      }
    };

    fetchTracks();

    const handleUpdate = () => {
      fetchTracks();
    };

    window.addEventListener("remotion-tracks-updated", handleUpdate);
    return () => {
      window.removeEventListener("remotion-tracks-updated", handleUpdate);
    };
  }, []);

  const activeTracks = tracks.length > 0 ? tracks : initialTracks;

  // Determine which track is actively playing at the current frame
  const currentlyPlaying = activeTracks.find(
    (t) => frame >= t.start_frame && frame < t.start_frame + t.duration_in_frames,
  );

  // Master timeline progress %
  const videoProgressPercent = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  // Voice track progress % and timer
  let voiceCurrentSec = 0;
  let voiceTotalSec = 0;
  let voiceProgressPercent = 0;
  if (currentlyPlaying) {
    const elapsedFrames = frame - currentlyPlaying.start_frame;
    voiceCurrentSec = Math.max(0, elapsedFrames / fps);
    voiceTotalSec = currentlyPlaying.duration_in_frames / fps;
    voiceProgressPercent = Math.min(
      100,
      Math.max(0, (elapsedFrames / currentlyPlaying.duration_in_frames) * 100),
    );
  }

  return (
    <div
      style={{
        flex: 1,
        width,
        height,
        backgroundColor: "#0d0d14",
        backgroundImage:
          "radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0d0d14 70%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        boxSizing: "border-box",
        padding: "40px",
      }}
    >
      {/* Remotion Audio sequences */}
      {activeTracks.map((track) => (
        <Sequence
          key={track.id}
          from={track.start_frame}
          durationInFrames={track.duration_in_frames}
          name={track.name}
        >
          <Audio src={staticFile(track.src)} volume={track.volume ?? 1} />
        </Sequence>
      ))}

      {/* Master Video Progress Bar at Top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#1f1f2e",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${videoProgressPercent}%`,
            backgroundColor: "#6366f1",
            boxShadow: "0 0 8px #6366f1",
          }}
        />
      </div>

      {/* Top Header Badge */}
      <div
        style={{
          position: "absolute",
          top: "36px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "20px",
          backgroundColor: "#1e1e2f",
          border: "1px solid #3b3b54",
          fontSize: "14px",
          color: "#c7d2fe",
          fontWeight: 600,
        }}
      >
        <span>🎙️</span>
        <span>ZeroTTS Voice Studio · REMOTION-LC</span>
      </div>

      {/* Center Visual Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          maxWidth: "840px",
          width: "100%",
          padding: "32px",
          borderRadius: "16px",
          backgroundColor: "#16162288",
          backdropFilter: "blur(12px)",
          border: "1px solid #2e2e46",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Đồng bộ Voice & Video Timer
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#9ca3af" }}>
            Kiểm tra tính đồng bộ khung hình, thời lượng giọng đọc và audio waveform
          </p>
        </div>

        {/* Audio Waveform & Status Visualizer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "18px 24px",
            borderRadius: "12px",
            backgroundColor: "#12121a",
            border: currentlyPlaying ? "1px solid #6366f1" : "1px solid #232332",
            boxSizing: "border-box",
          }}
        >
          {currentlyPlaying ? (
            <>
              {/* Voice Name & Individual Voice Timer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                    }}
                  />
                  <span style={{ fontWeight: 600, fontSize: "16px", color: "#818cf8" }}>
                    🔊 Đang phát: {currentlyPlaying.voice_name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#34d399",
                    backgroundColor: "#064e3b44",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    border: "1px solid #065f46",
                  }}
                >
                  ⏱️ Voice Timer: {voiceCurrentSec.toFixed(2)}s / {voiceTotalSec.toFixed(2)}s
                </div>
              </div>

              {/* Individual Voice Progress Bar */}
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: "#1e1e2f",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${voiceProgressPercent}%`,
                    backgroundColor: "#10b981",
                  }}
                />
              </div>

              {/* Subtitle / Script Box */}
              {currentlyPlaying.text && (
                <div
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#181826",
                    borderRadius: "8px",
                    borderLeft: "3px solid #818cf8",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    color: "#e0e7ff",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  "{currentlyPlaying.text}"
                </div>
              )}

              {/* Animated Waveform Bars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  height: "44px",
                  width: "100%",
                }}
              >
                {Array.from({ length: 28 }).map((_, i) => {
                  const factor = Math.sin((frame / fps) * 8 + i * 0.35);
                  const barHeight = Math.max(6, Math.min(40, Math.abs(factor) * 36 + 6));
                  return (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: `${barHeight}px`,
                        borderRadius: "3px",
                        backgroundColor: i % 2 === 0 ? "#6366f1" : "#8b5cf6",
                        opacity: 0.9,
                      }}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ color: "#6b7280", fontSize: "14px", padding: "16px 0", textAlign: "center" }}>
              {activeTracks.length > 0
                ? "⏸ Khoảng nghỉ giữa các đoạn thoại (Silent gap / End buffer)..."
                : "ℹ️ Chưa có audio track. Mở Voice Studio để thêm âm thanh."}
            </div>
          )}
        </div>

        {/* Master Video Timeline & Counters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: "13px",
            color: "#9ca3af",
            borderTop: "1px solid #232332",
            paddingTop: "14px",
          }}
        >
          <div>
            🎬 Video Time:{" "}
            <span style={{ color: "#f3f4f6", fontWeight: 600 }}>
              {(frame / fps).toFixed(2)}s
            </span>{" "}
            / {(durationInFrames / fps).toFixed(2)}s
          </div>
          <div>
            Khung hình:{" "}
            <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{frame}</span> /{" "}
            {durationInFrames} ({fps} fps)
          </div>
          <div>
            Đoạn âm thanh:{" "}
            <span style={{ color: "#818cf8", fontWeight: 600 }}>{activeTracks.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
