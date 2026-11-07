import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { S01Hook } from "./S01Hook";
import { S02Problem } from "./S02Problem";
import { S03Repo } from "./S03Repo";
import { S04MemoryEngine } from "./S04MemoryEngine";
import { S05HybridSearch } from "./S05HybridSearch";
import { S06MCPConnectors } from "./S06MCPConnectors";
import { S07TerminalDeployment } from "./S07TerminalDeployment";
import { S08Outro } from "./S08Outro";

export interface SupermemorySceneConfig {
  id: string;
  startFrame: number;
  durationInFrames: number;
  audioSrc: string;
  narration: string;
}

export const SUPERMEMORY_SCENES: SupermemorySceneConfig[] = [
  {
    id: "S01",
    startFrame: 0,
    durationInFrames: 166,
    audioSrc: "audio/supermemory/S01.wav",
    narration: "Bạn có bao giờ bực mình vì mỗi lần mở đoạn chat mới, AI lại quên sạch mọi thông tin về bạn?",
  },
  {
    id: "S02",
    startFrame: 166,
    durationInFrames: 195,
    audioSrc: "audio/supermemory/S02.wav",
    narration: "Dù context window có lớn đến đâu, AI vẫn gặp hiện tượng mất ngữ cảnh thảm khốc khi chuyển đổi giữa các phiên làm việc.",
  },
  {
    id: "S03",
    startFrame: 361,
    durationInFrames: 236,
    audioSrc: "audio/supermemory/S03.wav",
    narration: "Supermemory là dự án mã nguồn mở với hơn ba mươi hai nghìn ngôi sao trên GitHub, đóng vai trò như bộ não ngoài của AI.",
  },
  {
    id: "S04",
    startFrame: 597,
    durationInFrames: 212,
    audioSrc: "audio/supermemory/S04.wav",
    narration: "Khác với RAG thông thường, hệ thống tự động bóc tách sự thật, xây dựng đồ thị quan hệ và cập nhật hồ sơ người dùng chỉ trong năm mươi mili giây.",
  },
  {
    id: "S05",
    startFrame: 809,
    durationInFrames: 243,
    audioSrc: "audio/supermemory/S05.wav",
    narration: "Chế độ tìm kiếm lai kết hợp cả vector ngữ nghĩa lẫn từ khóa chính xác, giúp AI truy xuất thông tin quá khứ mà không bỏ sót bất kỳ chi tiết nào.",
  },
  {
    id: "S06",
    startFrame: 1052,
    durationInFrames: 243,
    audioSrc: "audio/supermemory/S06.wav",
    narration: "Nhờ giao thức Model Context Protocol, Supermemory tích hợp trực tiếp vào Cursor và Claude Code, đồng bộ dữ liệu từ Notion, Drive và trình duyệt.",
  },
  {
    id: "S07",
    startFrame: 1295,
    durationInFrames: 257,
    audioSrc: "audio/supermemory/S07.wav",
    narration: "Bạn có thể tự chạy Supermemory cục bộ bằng Docker hoặc một lệnh đơn giản, kết nối với mô hình AI cục bộ để bảo mật dữ liệu tuyệt đối.",
  },
  {
    id: "S08",
    startFrame: 1552,
    durationInFrames: 257,
    audioSrc: "audio/supermemory/S08.wav",
    narration: "Supermemory chính là mảnh ghép còn thiếu để AI thực sự hiểu bạn. Bạn nghĩ sao về công nghệ này? Follow ngay để đón xem các công cụ đột phá tiếp theo!",
  },
];

export const TOTAL_SUPERMEMORY_FRAMES = 1809; // 60.3s @ 30fps

export const calculateSupermemoryMetadata: CalculateMetadataFunction<Record<string, unknown>> = () => {
  return {
    durationInFrames: TOTAL_SUPERMEMORY_FRAMES,
    width: 1080,
    height: 1920,
    fps: 30,
  };
};

export const SupermemoryReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progressPercent = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  return (
    <AbsoluteFill style={{ backgroundColor: "#090a0f" }}>
      {/* 8 Visual Scenes */}
      <Sequence from={SUPERMEMORY_SCENES[0].startFrame} durationInFrames={SUPERMEMORY_SCENES[0].durationInFrames} name="S01 - Hook">
        <S01Hook durationInFrames={SUPERMEMORY_SCENES[0].durationInFrames} narration={SUPERMEMORY_SCENES[0].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[1].startFrame} durationInFrames={SUPERMEMORY_SCENES[1].durationInFrames} name="S02 - The Problem">
        <S02Problem durationInFrames={SUPERMEMORY_SCENES[1].durationInFrames} narration={SUPERMEMORY_SCENES[1].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[2].startFrame} durationInFrames={SUPERMEMORY_SCENES[2].durationInFrames} name="S03 - Introduction">
        <S03Repo durationInFrames={SUPERMEMORY_SCENES[2].durationInFrames} narration={SUPERMEMORY_SCENES[2].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[3].startFrame} durationInFrames={SUPERMEMORY_SCENES[3].durationInFrames} name="S04 - Memory Engine">
        <S04MemoryEngine durationInFrames={SUPERMEMORY_SCENES[3].durationInFrames} narration={SUPERMEMORY_SCENES[3].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[4].startFrame} durationInFrames={SUPERMEMORY_SCENES[4].durationInFrames} name="S05 - Hybrid Search">
        <S05HybridSearch durationInFrames={SUPERMEMORY_SCENES[4].durationInFrames} narration={SUPERMEMORY_SCENES[4].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[5].startFrame} durationInFrames={SUPERMEMORY_SCENES[5].durationInFrames} name="S06 - MCP & Connectors">
        <S06MCPConnectors durationInFrames={SUPERMEMORY_SCENES[5].durationInFrames} narration={SUPERMEMORY_SCENES[5].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[6].startFrame} durationInFrames={SUPERMEMORY_SCENES[6].durationInFrames} name="S07 - Local Deployment">
        <S07TerminalDeployment durationInFrames={SUPERMEMORY_SCENES[6].durationInFrames} narration={SUPERMEMORY_SCENES[6].narration} />
      </Sequence>

      <Sequence from={SUPERMEMORY_SCENES[7].startFrame} durationInFrames={SUPERMEMORY_SCENES[7].durationInFrames} name="S08 - Conclusion">
        <S08Outro durationInFrames={SUPERMEMORY_SCENES[7].durationInFrames} narration={SUPERMEMORY_SCENES[7].narration} />
      </Sequence>

      {/* 8 Audio Narration Sequences */}
      {SUPERMEMORY_SCENES.map((scene) => (
        <Sequence
          key={`audio-${scene.id}`}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={`Audio ${scene.id}`}
        >
          <Audio src={staticFile(scene.audioSrc)} volume={1.0} />
        </Sequence>
      ))}

      {/* Top Video Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, #0066FF, #8B5CF6, #38bdf8)",
            boxShadow: "0 0 16px rgba(0, 102, 255, 0.8)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const SupermemoryReviewComposition: React.FC = () => {
  return (
    <Composition
      id="SupermemoryReview"
      component={SupermemoryReview}
      durationInFrames={TOTAL_SUPERMEMORY_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={calculateSupermemoryMetadata}
    />
  );
};
