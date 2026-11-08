import React from "react";
import { Composition, Sequence } from "remotion";
import {
  Template01TechExplainer,
  Template02ProductShowcase,
  Template03AlgorithmViz,
  Template04DataViz,
  Template05CinematicIntro,
  Template06HybridExplainer,
} from "../templates";

export const TOTAL_3D_SHOWCASE_FRAMES = 900; // 30 seconds @ 30fps

export const Motion3DShowcaseVideo: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#080B16",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 01. Cinematic Intro: frames 0 -> 90 (3s) */}
      <Sequence durationInFrames={90} name="3D Cinematic Intro">
        <Template05CinematicIntro
          hookTitle="3D MOTION ENGINE"
          hookSubtitle="Three.js & React Three Fiber bên trong Remotion"
          durationInFrames={90}
        />
      </Sequence>

      {/* 02. Tech Explainer: frames 90 -> 240 (5s) */}
      <Sequence from={90} durationInFrames={150} name="3D Tech Explainer">
        <Template01TechExplainer
          title="Transformer Attention 3D"
          subtitle="Mạng nơ-ron đa tầng & luồng dữ liệu thời gian thực"
          durationInFrames={150}
        />
      </Sequence>

      {/* 03. Product Showcase: frames 240 -> 390 (5s) */}
      <Sequence from={240} durationInFrames={150} name="3D Product Showcase">
        <Template02ProductShowcase
          productName="ZeroTTS 3D Pipeline"
          tagline="Sản xuất video công nghệ tự động hóa"
          features={["Phụ đề Karaoke 3D", "Deterministic Camera", "WebGL Frame-Accurate"]}
          durationInFrames={150}
        />
      </Sequence>

      {/* 04. Algorithm Viz: frames 390 -> 570 (6s) */}
      <Sequence from={390} durationInFrames={180} name="3D Algorithm Viz">
        <Template03AlgorithmViz
          algorithm="binary-search"
          target={23}
          durationInFrames={180}
        />
      </Sequence>

      {/* 05. Data Viz: frames 570 -> 720 (5s) */}
      <Sequence from={570} durationInFrames={150} name="3D Data Viz">
        <Template04DataViz
          title="Đánh Giá Hiệu Năng Mô Hình (2025)"
          subtitle="So sánh chỉ số Benchmark xử lý ngôn ngữ tự nhiên"
          durationInFrames={150}
        />
      </Sequence>

      {/* 06. Hybrid 2D + 3D Explainer: frames 720 -> 900 (6s) */}
      <Sequence from={720} durationInFrames={180} name="Hybrid 2D + 3D Explainer">
        <Template06HybridExplainer
          title="Kiến Trúc Hybrid 2D + 3D"
          subtitle="Kết hợp chiều sâu không gian 3D với thẻ UI phẳng 2D"
          durationInFrames={180}
        />
      </Sequence>
    </div>
  );
};

export const Motion3DShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="ThreeMotionShowcase"
      component={Motion3DShowcaseVideo}
      durationInFrames={TOTAL_3D_SHOWCASE_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
