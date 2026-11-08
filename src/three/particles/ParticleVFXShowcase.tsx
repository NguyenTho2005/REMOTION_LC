import React from "react";
import { Composition, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvasContainer } from "../core/ThreeCanvasContainer";
import {
  ExplosionEffect,
  FormationEffect,
  WaveEffect,
  DataFlowEffect,
  GalaxyEffect,
  EnergySphereEffect,
  TunnelEffect,
  HologramEffect,
  MorphingEffect,
  DisintegrationEffect,
} from "./presets";

export const TOTAL_PARTICLE_SHOWCASE_FRAMES = 1170; // 39 seconds @ 30fps

interface ParticleSceneOverlayProps {
  title: string;
  subtitle: string;
  badge: string;
}

const ParticleSceneOverlay: React.FC<ParticleSceneOverlayProps> = ({
  title,
  subtitle,
  badge,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "160px 48px 300px 48px", // TikTok safe zones
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Header Badge */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "8px 18px",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "30px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1.5px",
            color: "#38BDF8",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 20px rgba(56, 189, 248, 0.25)",
          }}
        >
          {badge}
        </div>
      </div>

      {/* Bottom Subtitle / Info Card with gradient backing */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(8, 11, 22, 0.85) 0%, rgba(3, 7, 18, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "24px 28px",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div
          style={{
            fontSize: "26px",
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "0.5px",
            marginBottom: "8px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#94A3B8",
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const ParticleVFXShowcaseVideo: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#05070E",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 01. Particle Explosion: frames 0 -> 100 (3.3s) */}
      <Sequence durationInFrames={100} name="01. Particle Explosion">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 100,
            camera: { preset: "dolly", distance: 7.5, fov: 45, speed: 1.2 },
            lighting: { preset: "dramatic" },
            objects: [],
          }}
        >
          <ExplosionEffect
            preset="explosion"
            particleCount={4500}
            color="#F59E0B"
            secondaryColor="#EF4444"
            spread={5.5}
            durationInFrames={100}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 01 · PARTICLE EXPLOSION"
          title="Vụ Nổ Hạt Năng Lượng"
          subtitle="Gia tốc ly tâm & trọng lực mô phỏng toán học chính xác"
        />
      </Sequence>

      {/* 02. Particle Formation: frames 100 -> 220 (4s) */}
      <Sequence from={100} durationInFrames={120} name="02. Particle Formation">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "orbit", distance: 8.0, fov: 45, speed: 0.8 },
            lighting: { preset: "cyberpunk" },
            objects: [],
          }}
        >
          <FormationEffect
            preset="formation"
            targetShape="torus"
            particleCount={4000}
            color="#38BDF8"
            secondaryColor="#818CF8"
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 02 · PARTICLE FORMATION"
          title="Hạt Tụ Hình Khối 3D"
          subtitle="Tập hợp hàng ngàn hạt tự do thành hình xuyến Torus hoàn chỉnh"
        />
      </Sequence>

      {/* 03. Particle Wave: frames 220 -> 340 (4s) */}
      <Sequence from={220} durationInFrames={120} name="03. Particle Wave">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "isometric", distance: 10.0, fov: 45, speed: 0.6 },
            lighting: { preset: "studio" },
            objects: [],
          }}
        >
          <WaveEffect
            preset="wave"
            particleCount={4500}
            color="#06B6D4"
            secondaryColor="#6366F1"
            frequency={0.7}
            amplitude={0.9}
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 03 · PARTICLE WAVE"
          title="Sóng Hạt Đa Hài Âm"
          subtitle="Mô phỏng mặt sóng dữ liệu thời gian thực cho mạng nơ-ron"
        />
      </Sequence>

      {/* 04. Particle Data Flow: frames 340 -> 460 (4s) */}
      <Sequence from={340} durationInFrames={120} name="04. Particle Data Flow">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "orbit", distance: 8.5, fov: 45, speed: 0.7 },
            lighting: { preset: "cyberpunk" },
            objects: [],
          }}
        >
          <DataFlowEffect
            preset="data-flow"
            particleCount={3500}
            color="#10B981"
            secondaryColor="#38BDF8"
            flowSpeed={1.4}
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 04 · PARTICLE DATA FLOW"
          title="Luồng Hạt Dữ Liệu Spline"
          subtitle="Truyền dẫn gói tin qua các nút mạng kiến trúc phân tán"
        />
      </Sequence>

      {/* 05. Particle Galaxy: frames 460 -> 580 (4s) */}
      <Sequence from={460} durationInFrames={120} name="05. Particle Galaxy">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "orbit", distance: 9.0, fov: 45, speed: 0.6 },
            lighting: { preset: "cyberpunk" },
            objects: [],
          }}
        >
          <GalaxyEffect
            preset="galaxy"
            particleCount={5000}
            color="#A855F7"
            secondaryColor="#38BDF8"
            arms={3}
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 05 · PARTICLE GALAXY"
          title="Thiên Hà Xoắn Ốc Vi Sai"
          subtitle="Tốc độ quay theo hàm Kepler phân chia nhánh xoắn và nhân lõi"
        />
      </Sequence>

      {/* 06. Particle Energy Sphere: frames 580 -> 700 (4s) */}
      <Sequence from={580} durationInFrames={120} name="06. Particle Energy Sphere">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "orbit", distance: 7.5, fov: 45, speed: 0.9 },
            lighting: { preset: "dramatic" },
            objects: [],
          }}
        >
          <EnergySphereEffect
            preset="energy-sphere"
            particleCount={4000}
            color="#EC4899"
            secondaryColor="#06B6D4"
            pulseSpeed={3.0}
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 06 · ENERGY SPHERE"
          title="Cầu Năng Lượng Xung Kích"
          subtitle="Trường hạt biến thiên liên tục với lõi phát sáng đa tầng"
        />
      </Sequence>

      {/* 07. Particle Tunnel: frames 700 -> 820 (4s) */}
      <Sequence from={700} durationInFrames={120} name="07. Particle Tunnel">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "static", distance: 0.1, fov: 60, speed: 0 },
            lighting: { preset: "cyberpunk" },
            objects: [],
          }}
        >
          <TunnelEffect
            preset="tunnel"
            particleCount={4500}
            color="#38BDF8"
            secondaryColor="#EC4899"
            travelSpeed={8.0}
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 07 · PARTICLE TUNNEL"
          title="Hầm Hạt Vận Tốc Siêu Thanh"
          subtitle="Bay xuyên không gian 3D với hiệu ứng dịch chuyển ánh sáng"
        />
      </Sequence>

      {/* 08. Particle Hologram: frames 820 -> 940 (4s) */}
      <Sequence from={820} durationInFrames={120} name="08. Particle Hologram">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "orbit", distance: 8.0, fov: 45, speed: 0.7 },
            lighting: { preset: "cool" },
            objects: [],
          }}
        >
          <HologramEffect
            preset="hologram"
            shape="cylinder"
            particleCount={3500}
            color="#00FFFF"
            secondaryColor="#3B82F6"
            scanSpeed={2.2}
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 08 · PARTICLE HOLOGRAM"
          title="Hình Chiếu Kỹ Thuật Số Hologram"
          subtitle="Tái tạo giao diện máy tính với đường quét scanline và nhiễu sóng"
        />
      </Sequence>

      {/* 09. Particle Morphing: frames 940 -> 1060 (4s) */}
      <Sequence from={940} durationInFrames={120} name="09. Particle Morphing">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 120,
            camera: { preset: "orbit", distance: 8.0, fov: 45, speed: 0.8 },
            lighting: { preset: "cyberpunk" },
            objects: [],
          }}
        >
          <MorphingEffect
            preset="morphing"
            shapeA="sphere"
            shapeB="cube"
            particleCount={3500}
            color="#8B5CF6"
            secondaryColor="#06B6D4"
            durationInFrames={120}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 09 · PARTICLE MORPHING"
          title="Biến Hình Khối Hạt Ổn Định"
          subtitle="Chuyển đổi hình cầu sang hình lập phương mà không nhảy hạt"
        />
      </Sequence>

      {/* 10. Particle Disintegration: frames 1060 -> 1170 (3.6s) */}
      <Sequence from={1060} durationInFrames={110} name="10. Particle Disintegration">
        <ThreeCanvasContainer
          config={{
            type: "3d-particle",
            durationInFrames: 110,
            camera: { preset: "orbit", distance: 8.5, fov: 45, speed: 0.7 },
            lighting: { preset: "dramatic" },
            objects: [],
          }}
        >
          <DisintegrationEffect
            preset="disintegration"
            sourceShape="cube"
            particleCount={4000}
            color="#F43F5E"
            secondaryColor="#FB923C"
            durationInFrames={110}
          />
        </ThreeCanvasContainer>
        <ParticleSceneOverlay
          badge="PRESET 10 · PARTICLE DISINTEGRATION"
          title="Tan Biến Hạt Kết Video"
          subtitle="Tách rời từng mảng hạt với vector gió và lực cản khí động học"
        />
      </Sequence>
    </div>
  );
};

export const ParticleVFXShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="ParticleVFXShowcase"
      component={ParticleVFXShowcaseVideo}
      durationInFrames={TOTAL_PARTICLE_SHOWCASE_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
