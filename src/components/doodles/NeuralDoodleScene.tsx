import React, { useMemo } from "react";
import { interpolate, spring } from "remotion";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

export interface NeuralDoodleSceneProps {
  frame: number;
  fps?: number;
}

// Reusable RoughJS shape renderer for pure declarative SVG
interface RoughShapeProps {
  type: "circle" | "rect" | "line" | "curve" | "polygon" | "ellipse";
  args: number[];
  curvePoints?: [number, number][];
  options?: Options;
}

const RoughShape: React.FC<RoughShapeProps> = ({ type, args, curvePoints, options }) => {
  const paths = useMemo(() => {
    const gen = rough.generator();
    try {
      if (type === "circle") {
        const [x, y, d] = args;
        return gen.toPaths(gen.circle(x, y, d, options));
      }
      if (type === "ellipse") {
        const [x, y, w, h] = args;
        return gen.toPaths(gen.ellipse(x, y, w, h, options));
      }
      if (type === "rect") {
        const [x, y, w, h] = args;
        return gen.toPaths(gen.rectangle(x, y, w, h, options));
      }
      if (type === "line") {
        const [x1, y1, x2, y2] = args;
        return gen.toPaths(gen.line(x1, y1, x2, y2, options));
      }
      if (type === "curve" && curvePoints && curvePoints.length > 1) {
        return gen.toPaths(gen.curve(curvePoints, options));
      }
      if (type === "polygon" && curvePoints && curvePoints.length > 2) {
        return gen.toPaths(gen.polygon(curvePoints, options));
      }
    } catch {
      return [];
    }
    return [];
  }, [type, args, curvePoints, options]);

  return (
    <>
      {paths.map((p, idx) => (
        <path
          key={`${p.stroke}-${idx}`}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill && p.fill !== "none" ? p.fill : "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </>
  );
};

export const NeuralDoodleScene: React.FC<NeuralDoodleSceneProps> = ({ frame, fps = 30 }) => {
  // Boiling Line seed: shifts every 3 frames (10 FPS boiling sketch on 30 FPS render)
  const boilStep = Math.floor(frame / 3);
  const getSeed = (offset: number) => (boilStep * 73 + offset) % 100000 + 1;

  // Gentle physical idle sway
  const idleSway = Math.sin(frame / 10) * 0.05; // radians (~2.8 deg)
  const idleDeg = (idleSway * 180) / Math.PI;

  // Detect active scene
  // Scene 1: 0 - 240
  // Scene 2: 240 - 600
  // Scene 3: 600 - 1050
  // Scene 4: 1050 - 1350
  const isScene1 = frame < 240;
  const isScene2 = frame >= 240 && frame < 600;
  const isScene3 = frame >= 600 && frame < 1050;
  const isScene4 = frame >= 1050;

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <defs>
        {/* Glow filter for neon chalk accents */}
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="chalk-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Global Blackboard Top Header Card */}
      <g transform="translate(540, 195)">
        <RoughShape
          type="rect"
          args={[-460, -45, 920, 90]}
          options={{
            seed: getSeed(5),
            stroke: "#FFE600",
            strokeWidth: 3,
            fill: "rgba(255, 230, 0, 0.08)",
            fillStyle: "hachure",
            hachureGap: 14,
            roughness: 1.4,
          }}
        />
        <text
          x={0}
          y={12}
          textAnchor="middle"
          fill="#FFE600"
          style={{
            fontFamily: '"Arial Black", "Baloo 2", "Comic Sans MS", system-ui, sans-serif',
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            filter: "url(#chalk-shadow)",
          }}
        >
          {isScene1 && "MÁY TÍNH HỌC NHƯ THẾ NÀO? (HOOK)"}
          {isScene2 && "BĂM ẢNH THÀNH SỐ ➡️ MẠNG NƠ-RON"}
          {isScene3 && "THỬ & SAI: LỘI NGƯỢC DÒNG (BACKPROP)"}
          {isScene4 && "HỌC SÂU: KIÊN TRÌ SỬA SAI TỶ LẦN"}
        </text>
      </g>

      {/* ========================================================
          SCENE 1: HOOK (Frame 0 - 240)
          Cat vs Dog & Confused Machine
          ======================================================== */}
      {isScene1 && (
        <Scene1Hook frame={frame} fps={fps} getSeed={getSeed} idleDeg={idleDeg} />
      )}

      {/* ========================================================
          SCENE 2: INPUT & LAYER (Frame 240 - 600)
          Pixel Discretization & Multi-layer Neural Network
          ======================================================== */}
      {isScene2 && (
        <Scene2InputLayer frame={frame} fps={fps} getSeed={getSeed} idleDeg={idleDeg} />
      )}

      {/* ========================================================
          SCENE 3: TRIAL & ERROR & BACKPROPAGATION (Frame 600 - 1050)
          Deducted points, reverse arrows, error gauge tuning
          ======================================================== */}
      {isScene3 && (
        <Scene3Backpropagation frame={frame} fps={fps} getSeed={getSeed} idleDeg={idleDeg} />
      )}

      {/* ========================================================
          SCENE 4: CONCLUSION & OUTRO (Frame 1050 - 1350)
          Deep Learning Brain, Floppy Chips, Comic CTA button
          ======================================================== */}
      {isScene4 && (
        <Scene4Outro frame={frame} fps={fps} getSeed={getSeed} idleDeg={idleDeg} />
      )}
    </svg>
  );
};

// =========================================================================
// SUB-SCENE 1: THE HOOK
// =========================================================================
interface SubSceneProps {
  frame: number;
  fps: number;
  getSeed: (offset: number) => number;
  idleDeg: number;
}

const Scene1Hook: React.FC<SubSceneProps> = ({ frame, fps, getSeed, idleDeg }) => {
  // Spring pop-ins with overshoot
  const catScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const dogScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const questionScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 190 },
  });

  const robotScale = spring({
    frame: frame - 75,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  // Bouncing question marks vertical float
  const qFloat = Math.sin((frame + 20) / 7) * 14;

  return (
    <g>
      {/* LEFT CARD: CON MÈO */}
      <g
        transform={`translate(280, 500) scale(${Math.max(0, catScale)}) rotate(${idleDeg})`}
      >
        {/* Paper card frame */}
        <RoughShape
          type="rect"
          args={[-190, -180, 380, 360]}
          options={{
            seed: getSeed(11),
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "rgba(255, 255, 255, 0.05)",
            fillStyle: "hachure",
            hachureGap: 16,
            roughness: 1.5,
          }}
        />
        {/* Cat head */}
        <RoughShape
          type="circle"
          args={[0, -20, 150]}
          options={{ seed: getSeed(12), stroke: "#FFFFFF", strokeWidth: 4, roughness: 1.6 }}
        />
        {/* Left ear */}
        <RoughShape
          type="polygon"
          args={[]}
          curvePoints={[
            [-50, -85],
            [-30, -150],
            [0, -95],
          ]}
          options={{
            seed: getSeed(13),
            stroke: "#FFE600",
            strokeWidth: 3.5,
            fill: "rgba(255,230,0,0.15)",
            fillStyle: "solid",
          }}
        />
        {/* Right ear */}
        <RoughShape
          type="polygon"
          args={[]}
          curvePoints={[
            [0, -95],
            [30, -150],
            [50, -85],
          ]}
          options={{
            seed: getSeed(14),
            stroke: "#FFE600",
            strokeWidth: 3.5,
            fill: "rgba(255,230,0,0.15)",
            fillStyle: "solid",
          }}
        />
        {/* Cat eyes */}
        <RoughShape
          type="circle"
          args={[-28, -25, 22]}
          options={{
            seed: getSeed(15),
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "#FFE600",
            fillStyle: "solid",
          }}
        />
        <RoughShape
          type="circle"
          args={[28, -25, 22]}
          options={{
            seed: getSeed(16),
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "#FFE600",
            fillStyle: "solid",
          }}
        />
        {/* Nose & Mouth */}
        <RoughShape
          type="polygon"
          args={[]}
          curvePoints={[
            [-8, -5],
            [8, -5],
            [0, 5],
          ]}
          options={{ seed: getSeed(17), stroke: "#FF4D6D", fill: "#FF4D6D", fillStyle: "solid" }}
        />
        <RoughShape
          type="curve"
          args={[]}
          curvePoints={[
            [-18, 12],
            [0, 20],
            [18, 12],
          ]}
          options={{ seed: getSeed(18), stroke: "#FFFFFF", strokeWidth: 3 }}
        />
        {/* Whiskers */}
        <RoughShape
          type="line"
          args={[-35, -5, -85, -15]}
          options={{ seed: getSeed(19), stroke: "#FFFFFF", strokeWidth: 2.5 }}
        />
        <RoughShape
          type="line"
          args={[-35, 5, -85, 10]}
          options={{ seed: getSeed(20), stroke: "#FFFFFF", strokeWidth: 2.5 }}
        />
        <RoughShape
          type="line"
          args={[35, -5, 85, -15]}
          options={{ seed: getSeed(21), stroke: "#FFFFFF", strokeWidth: 2.5 }}
        />
        <RoughShape
          type="line"
          args={[35, 5, 85, 10]}
          options={{ seed: getSeed(22), stroke: "#FFFFFF", strokeWidth: 2.5 }}
        />
        {/* Label badge */}
        <text
          x={0}
          y={140}
          textAnchor="middle"
          fill="#FFE600"
          style={{
            fontFamily: '"Arial Black", "Baloo 2", sans-serif',
            fontSize: 34,
            fontWeight: 900,
            filter: "url(#chalk-shadow)",
          }}
        >
          CON MÈO 🐱
        </text>
      </g>

      {/* RIGHT CARD: CON CHÓ */}
      <g
        transform={`translate(800, 500) scale(${Math.max(0, dogScale)}) rotate(${-idleDeg})`}
      >
        <RoughShape
          type="rect"
          args={[-190, -180, 380, 360]}
          options={{
            seed: getSeed(23),
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "rgba(255, 255, 255, 0.05)",
            fillStyle: "hachure",
            hachureGap: 16,
            roughness: 1.5,
          }}
        />
        {/* Dog head */}
        <RoughShape
          type="circle"
          args={[0, -20, 160]}
          options={{ seed: getSeed(24), stroke: "#FFFFFF", strokeWidth: 4, roughness: 1.6 }}
        />
        {/* Floppy left ear */}
        <RoughShape
          type="curve"
          args={[]}
          curvePoints={[
            [-50, -70],
            [-95, -30],
            [-75, 40],
            [-50, 0],
          ]}
          options={{
            seed: getSeed(25),
            stroke: "#00F0FF",
            strokeWidth: 3.5,
            fill: "rgba(0,240,255,0.15)",
            fillStyle: "solid",
          }}
        />
        {/* Floppy right ear */}
        <RoughShape
          type="curve"
          args={[]}
          curvePoints={[
            [50, -70],
            [95, -30],
            [75, 40],
            [50, 0],
          ]}
          options={{
            seed: getSeed(26),
            stroke: "#00F0FF",
            strokeWidth: 3.5,
            fill: "rgba(0,240,255,0.15)",
            fillStyle: "solid",
          }}
        />
        {/* Dog eyes */}
        <RoughShape
          type="circle"
          args={[-28, -25, 20]}
          options={{
            seed: getSeed(27),
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "#00F0FF",
            fillStyle: "solid",
          }}
        />
        <RoughShape
          type="circle"
          args={[28, -25, 20]}
          options={{
            seed: getSeed(28),
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "#00F0FF",
            fillStyle: "solid",
          }}
        />
        {/* Snout oval */}
        <RoughShape
          type="ellipse"
          args={[0, 8, 70, 48]}
          options={{ seed: getSeed(29), stroke: "#FFFFFF", strokeWidth: 2.5 }}
        />
        {/* Nose */}
        <RoughShape
          type="circle"
          args={[0, -2, 18]}
          options={{ seed: getSeed(30), stroke: "#1E1E24", fill: "#FFFFFF", fillStyle: "solid" }}
        />
        {/* Tongue */}
        <RoughShape
          type="curve"
          args={[]}
          curvePoints={[
            [-10, 16],
            [0, 36],
            [10, 16],
          ]}
          options={{
            seed: getSeed(31),
            stroke: "#FF4D6D",
            strokeWidth: 3,
            fill: "rgba(255,77,109,0.3)",
            fillStyle: "solid",
          }}
        />
        <text
          x={0}
          y={140}
          textAnchor="middle"
          fill="#00F0FF"
          style={{
            fontFamily: '"Arial Black", "Baloo 2", sans-serif',
            fontSize: 34,
            fontWeight: 900,
            filter: "url(#chalk-shadow)",
          }}
        >
          CON CHÓ 🐶
        </text>
      </g>

      {/* FLOATING BOUNCY QUESTION MARKS */}
      <g
        transform={`translate(540, 480) scale(${Math.max(0, questionScale)}) translate(0, ${qFloat})`}
      >
        <RoughShape
          type="circle"
          args={[-15, -40, 70]}
          options={{
            seed: getSeed(32),
            stroke: "#FFE600",
            strokeWidth: 4,
            fill: "rgba(255,230,0,0.12)",
          }}
        />
        <text
          x={-15}
          y={-22}
          textAnchor="middle"
          fill="#FFE600"
          style={{
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 60,
            fontWeight: 900,
            filter: "url(#chalk-shadow)",
          }}
        >
          ?
        </text>
        <text
          x={35}
          y={-50}
          textAnchor="middle"
          fill="#00F0FF"
          style={{
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 48,
            fontWeight: 900,
            filter: "url(#chalk-shadow)",
          }}
        >
          ?
        </text>
      </g>

      {/* BOTTOM: THE CONFUSED COMPUTER / ROBOT */}
      <g
        transform={`translate(540, 1050) scale(${Math.max(0, robotScale)}) rotate(${idleDeg * 0.7})`}
      >
        {/* Computer outer monitor */}
        <RoughShape
          type="rect"
          args={[-320, -200, 640, 380]}
          options={{
            seed: getSeed(33),
            stroke: "#FFFFFF",
            strokeWidth: 4,
            fill: "rgba(255,255,255,0.04)",
            fillStyle: "hachure",
            hachureGap: 18,
            roughness: 1.6,
          }}
        />
        {/* Screen inner frame */}
        <RoughShape
          type="rect"
          args={[-280, -160, 560, 270]}
          options={{
            seed: getSeed(34),
            stroke: "#00F0FF",
            strokeWidth: 3,
            fill: "rgba(0, 240, 255, 0.06)",
            fillStyle: "solid",
          }}
        />
        {/* Antenna */}
        <RoughShape
          type="line"
          args={[0, -200, 0, -260]}
          options={{ seed: getSeed(35), stroke: "#FFE600", strokeWidth: 4 }}
        />
        <RoughShape
          type="circle"
          args={[0, -270, 26]}
          options={{
            seed: getSeed(36),
            stroke: "#FFE600",
            strokeWidth: 3,
            fill: "#FFE600",
            fillStyle: "solid",
          }}
        />
        {/* Sparks on antenna */}
        <RoughShape
          type="line"
          args={[-20, -290, -40, -315]}
          options={{ seed: getSeed(37), stroke: "#FFE600", strokeWidth: 3 }}
        />
        <RoughShape
          type="line"
          args={[20, -290, 40, -315]}
          options={{ seed: getSeed(38), stroke: "#FFE600", strokeWidth: 3 }}
        />

        {/* Confused spiral eyes */}
        <g transform="translate(-110, -50)">
          <RoughShape
            type="circle"
            args={[0, 0, 60]}
            options={{ seed: getSeed(39), stroke: "#FFFFFF", strokeWidth: 3 }}
          />
          <text
            x={0}
            y={12}
            textAnchor="middle"
            fill="#FFE600"
            style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 36, fontWeight: 900 }}
          >
            @
          </text>
        </g>
        <g transform="translate(110, -50)">
          <RoughShape
            type="circle"
            args={[0, 0, 60]}
            options={{ seed: getSeed(40), stroke: "#FFFFFF", strokeWidth: 3 }}
          />
          <text
            x={0}
            y={12}
            textAnchor="middle"
            fill="#FFE600"
            style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 36, fontWeight: 900 }}
          >
            @
          </text>
        </g>

        {/* Computer Screen Text */}
        <text
          x={0}
          y={50}
          textAnchor="middle"
          fill="#FFFFFF"
          style={{
            fontFamily: '"Arial Black", "Baloo 2", sans-serif',
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "0.05em",
          }}
        >
          {"10101001 ? ERROR ? 0101"}
        </text>
        <text
          x={0}
          y={86}
          textAnchor="middle"
          fill="#FF4D6D"
          style={{
            fontFamily: '"Arial Black", "Baloo 2", sans-serif',
            fontSize: 26,
            fontWeight: 900,
          }}
        >
          {"CỖ MÁY VÔ TRI: ĐÂU LÀ MÈO? ĐÂU LÀ CHÓ?"}
        </text>

        {/* Monitor Stand */}
        <RoughShape
          type="rect"
          args={[-70, 180, 140, 40]}
          options={{ seed: getSeed(41), stroke: "#FFFFFF", strokeWidth: 3 }}
        />
        <RoughShape
          type="rect"
          args={[-150, 220, 300, 30]}
          options={{ seed: getSeed(42), stroke: "#FFFFFF", strokeWidth: 3 }}
        />
      </g>

      {/* Question Chalk Arrows pointing to machine */}
      <RoughShape
        type="line"
        args={[300, 700, 420, 830]}
        options={{ seed: getSeed(43), stroke: "#FFE600", strokeWidth: 4 }}
      />
      <RoughShape
        type="line"
        args={[780, 700, 660, 830]}
        options={{ seed: getSeed(44), stroke: "#00F0FF", strokeWidth: 4 }}
      />
    </g>
  );
};

// =========================================================================
// SUB-SCENE 2: INPUT & LAYER (PIXEL MATRIX & MULTI-LAYER NEURAL NETWORK)
// =========================================================================
const Scene2InputLayer: React.FC<SubSceneProps> = ({ frame, fps, getSeed }) => {
  const localFrame = frame - 240;

  // Stagger springs
  const gridScale = spring({
    frame: localFrame - 5,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const matrixScale = spring({
    frame: localFrame - 25,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const networkScale = spring({
    frame: localFrame - 45,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  // Layer node positions
  // Layer 0: Input (4 nodes)
  const l0 = [
    { x: 180, y: 780 },
    { x: 180, y: 890 },
    { x: 180, y: 1000 },
    { x: 180, y: 1110 },
  ];
  // Layer 1: Hidden 1 (5 nodes)
  const l1 = [
    { x: 420, y: 730 },
    { x: 420, y: 830 },
    { x: 420, y: 930 },
    { x: 420, y: 1030 },
    { x: 420, y: 1130 },
  ];
  // Layer 2: Hidden 2 (5 nodes)
  const l2 = [
    { x: 670, y: 730 },
    { x: 670, y: 830 },
    { x: 670, y: 930 },
    { x: 670, y: 1030 },
    { x: 670, y: 1130 },
  ];
  // Layer 3: Output (2 nodes)
  const l3 = [
    { x: 910, y: 850, label: "MÈO 🐱" },
    { x: 910, y: 1030, label: "CHÓ 🐶" },
  ];

  // Active forward propagation wave across layers (repeating 40 frames loop)
  const loopT = (localFrame % 50) / 50;

  return (
    <g>
      {/* TOP SECTION: BĂM NHỎ BỨC ẢNH THÀNH MA TRẬN SỐ */}
      <g transform="translate(100, 270)">
        {/* Left: Cutout Image Frame */}
        <g transform={`translate(140, 110) scale(${Math.max(0, gridScale)})`}>
          <RoughShape
            type="rect"
            args={[-120, -95, 240, 190]}
            options={{
              seed: getSeed(50),
              stroke: "#FFFFFF",
              strokeWidth: 3,
              fill: "rgba(255, 255, 255, 0.05)",
            }}
          />
          {/* Mini Cat Sketch inside frame */}
          <RoughShape
            type="circle"
            args={[0, -10, 75]}
            options={{ seed: getSeed(51), stroke: "#FFE600", strokeWidth: 3 }}
          />
          {/* Grid lines slicing the image into pixels */}
          <RoughShape
            type="line"
            args={[-110, -35, 110, -35]}
            options={{ seed: getSeed(52), stroke: "rgba(0,240,255,0.7)", strokeWidth: 2 }}
          />
          <RoughShape
            type="line"
            args={[-110, 25, 110, 25]}
            options={{ seed: getSeed(53), stroke: "rgba(0,240,255,0.7)", strokeWidth: 2 }}
          />
          <RoughShape
            type="line"
            args={[-40, -90, -40, 90]}
            options={{ seed: getSeed(54), stroke: "rgba(0,240,255,0.7)", strokeWidth: 2 }}
          />
          <RoughShape
            type="line"
            args={[40, -90, 40, 90]}
            options={{ seed: getSeed(55), stroke: "rgba(0,240,255,0.7)", strokeWidth: 2 }}
          />
          <text
            x={0}
            y={125}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            ẢNH GỐC (PIXELS)
          </text>
        </g>

        {/* Data arrow pointing right */}
        <g transform="translate(325, 110)">
          <RoughShape
            type="line"
            args={[0, 0, 90, 0]}
            options={{ seed: getSeed(56), stroke: "#FFE600", strokeWidth: 4 }}
          />
          <RoughShape
            type="line"
            args={[70, -18, 95, 0]}
            options={{ seed: getSeed(57), stroke: "#FFE600", strokeWidth: 4 }}
          />
          <RoughShape
            type="line"
            args={[70, 18, 95, 0]}
            options={{ seed: getSeed(58), stroke: "#FFE600", strokeWidth: 4 }}
          />
        </g>

        {/* Right: Numbers Matrix Grid */}
        <g transform={`translate(670, 110) scale(${Math.max(0, matrixScale)})`}>
          <RoughShape
            type="rect"
            args={[-210, -95, 420, 190]}
            options={{
              seed: getSeed(59),
              stroke: "#00F0FF",
              strokeWidth: 3,
              fill: "rgba(0,240,255,0.06)",
              fillStyle: "hachure",
              hachureGap: 14,
            }}
          />
          <text
            x={0}
            y={-55}
            textAnchor="middle"
            fill="#00F0FF"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "0.06em",
            }}
          >
            HÀNG TRIỆU CON SỐ:
          </text>
          <text
            x={0}
            y={-10}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.12em",
            }}
          >
            [0.82, 0.14, 0.95, 0.03]
          </text>
          <text
            x={0}
            y={32}
            textAnchor="middle"
            fill="#FFE600"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.12em",
            }}
          >
            [0.19, 0.77, 0.42, 0.61]
          </text>
          <text
            x={0}
            y={125}
            textAnchor="middle"
            fill="#00F0FF"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            ĐỘ SÁNG MỖI ĐIỂM ẢNH
          </text>
        </g>
      </g>

      {/* BOTTOM SECTION: MULTI-LAYER NEURAL NETWORK */}
      <g transform={`scale(${Math.max(0, networkScale)})`} style={{ transformOrigin: "540px 950px" }}>
        {/* Layer Titles */}
        <text
          x={180}
          y={690}
          textAnchor="middle"
          fill="#FFFFFF"
          style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 24, fontWeight: 900 }}
        >
          INPUT
        </text>
        <text
          x={420}
          y={660}
          textAnchor="middle"
          fill="#00F0FF"
          style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 24, fontWeight: 900 }}
        >
          HIDDEN 1
        </text>
        <text
          x={670}
          y={660}
          textAnchor="middle"
          fill="#FFE600"
          style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 24, fontWeight: 900 }}
        >
          HIDDEN 2
        </text>
        <text
          x={910}
          y={780}
          textAnchor="middle"
          fill="#00FF9D"
          style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 24, fontWeight: 900 }}
        >
          OUTPUT
        </text>

        {/* Synaptic Connections Layer 0 -> Layer 1 */}
        {l0.map((n0, i) =>
          l1.map((n1, j) => {
            const seed = getSeed(100 + i * 5 + j);
            return (
              <RoughShape
                key={`l01-${i}-${j}`}
                type="line"
                args={[n0.x, n0.y, n1.x, n1.y]}
                options={{
                  seed,
                  stroke: "rgba(255, 255, 255, 0.28)",
                  strokeWidth: (i + j) % 2 === 0 ? 2.5 : 1.5,
                }}
              />
            );
          }),
        )}

        {/* Synaptic Connections Layer 1 -> Layer 2 */}
        {l1.map((n1, i) =>
          l2.map((n2, j) => {
            const seed = getSeed(150 + i * 5 + j);
            return (
              <RoughShape
                key={`l12-${i}-${j}`}
                type="line"
                args={[n1.x, n1.y, n2.x, n2.y]}
                options={{
                  seed,
                  stroke: "rgba(0, 240, 255, 0.35)",
                  strokeWidth: (i + j) % 3 === 0 ? 3 : 1.8,
                }}
              />
            );
          }),
        )}

        {/* Synaptic Connections Layer 2 -> Layer 3 */}
        {l2.map((n2, i) =>
          l3.map((n3, j) => {
            const seed = getSeed(200 + i * 2 + j);
            return (
              <RoughShape
                key={`l23-${i}-${j}`}
                type="line"
                args={[n2.x, n2.y, n3.x, n3.y]}
                options={{
                  seed,
                  stroke: "rgba(255, 230, 0, 0.4)",
                  strokeWidth: (i + j) % 2 === 0 ? 3.5 : 2,
                }}
              />
            );
          }),
        )}

        {/* Forward Propagation Glowing Light Pulses */}
        <circle
          cx={interpolate(loopT, [0, 0.33, 0.66, 1], [180, 420, 670, 910])}
          cy={interpolate(loopT, [0, 0.33, 0.66, 1], [890, 830, 830, 850])}
          r={16}
          fill="#FFE600"
          filter="url(#neon-glow)"
        />
        <circle
          cx={interpolate(loopT, [0, 0.33, 0.66, 1], [180, 420, 670, 910])}
          cy={interpolate(loopT, [0, 0.33, 0.66, 1], [1000, 1030, 1030, 1030])}
          r={14}
          fill="#00F0FF"
          filter="url(#neon-glow)"
        />

        {/* Layer 0: Input Nodes */}
        {l0.map((n, i) => (
          <g key={`n0-${i}`} transform={`translate(${n.x}, ${n.y})`}>
            <RoughShape
              type="circle"
              args={[0, 0, 64]}
              options={{
                seed: getSeed(250 + i),
                stroke: "#FFFFFF",
                strokeWidth: 3.5,
                fill: "#1E1E24",
                fillStyle: "solid",
              }}
            />
            <text
              x={0}
              y={8}
              textAnchor="middle"
              fill="#FFFFFF"
              style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 24, fontWeight: 900 }}
            >
              x{i + 1}
            </text>
          </g>
        ))}

        {/* Layer 1: Hidden Layer 1 Nodes */}
        {l1.map((n, i) => (
          <g key={`n1-${i}`} transform={`translate(${n.x}, ${n.y})`}>
            <RoughShape
              type="circle"
              args={[0, 0, 68]}
              options={{
                seed: getSeed(260 + i),
                stroke: "#00F0FF",
                strokeWidth: 4,
                fill: "rgba(0, 240, 255, 0.18)",
                fillStyle: "solid",
              }}
            />
            <text
              x={0}
              y={8}
              textAnchor="middle"
              fill="#00F0FF"
              style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 22, fontWeight: 900 }}
            >
              h1
            </text>
          </g>
        ))}

        {/* Layer 2: Hidden Layer 2 Nodes */}
        {l2.map((n, i) => (
          <g key={`n2-${i}`} transform={`translate(${n.x}, ${n.y})`}>
            <RoughShape
              type="circle"
              args={[0, 0, 68]}
              options={{
                seed: getSeed(270 + i),
                stroke: "#FFE600",
                strokeWidth: 4,
                fill: "rgba(255, 230, 0, 0.18)",
                fillStyle: "solid",
              }}
            />
            <text
              x={0}
              y={8}
              textAnchor="middle"
              fill="#FFE600"
              style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 22, fontWeight: 900 }}
            >
              h2
            </text>
          </g>
        ))}

        {/* Layer 3: Output Nodes */}
        {l3.map((n, i) => (
          <g key={`n3-${i}`} transform={`translate(${n.x}, ${n.y})`}>
            <RoughShape
              type="circle"
              args={[0, 0, 86]}
              options={{
                seed: getSeed(280 + i),
                stroke: "#00FF9D",
                strokeWidth: 4.5,
                fill: "rgba(0, 255, 157, 0.2)",
                fillStyle: "solid",
              }}
            />
            <text
              x={0}
              y={10}
              textAnchor="middle"
              fill="#FFFFFF"
              style={{ fontFamily: '"Arial Black", sans-serif', fontSize: 22, fontWeight: 900 }}
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Math annotation banner */}
        <g transform="translate(540, 1260)">
          <RoughShape
            type="rect"
            args={[-380, -35, 760, 70]}
            options={{
              seed: getSeed(290),
              stroke: "#FFFFFF",
              strokeWidth: 2.5,
              fill: "rgba(255,255,255,0.06)",
            }}
          />
          <text
            x={0}
            y={10}
            textAnchor="middle"
            fill="#FFE600"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "0.06em",
            }}
          >
            CÂN ĐO ĐONG ĐẾM: y = f(W · x + b)
          </text>
        </g>
      </g>
    </g>
  );
};

// =========================================================================
// SUB-SCENE 3: TRIAL & ERROR & BACKPROPAGATION
// =========================================================================
const Scene3Backpropagation: React.FC<SubSceneProps> = ({ frame, fps, getSeed, idleDeg }) => {
  const localFrame = frame - 600; // 0 to 450 frames

  // Phase 1: Mistake & Loss deduction (localFrame 0 - 160)
  const isMistakePhase = localFrame < 160;
  // Phase 2: Backpropagation reverse sweep (localFrame 140 - 280)
  const isBackpropPhase = localFrame >= 140 && localFrame < 280;
  // Phase 3: High iteration & guessing correct (localFrame >= 260)
  const isCorrectPhase = localFrame >= 260;

  // Springs
  const mistakeStampScale = spring({
    frame: localFrame - 15,
    fps,
    config: { damping: 9, mass: 0.6, stiffness: 220 },
  });

  const reverseArrowScale = spring({
    frame: localFrame - 145,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const correctStampScale = spring({
    frame: localFrame - 275,
    fps,
    config: { damping: 9, mass: 0.5, stiffness: 220 },
  });

  // Iteration counter smoothly scaling up to 1,000,000
  const epochCount = Math.floor(
    interpolate(localFrame, [160, 360], [1, 1000000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // Error gauge progress (drops from 98% down to 0.2%)
  const errorRate = interpolate(localFrame, [160, 350], [98, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const errorBarWidth = (errorRate / 100) * 700;

  return (
    <g>
      {/* ===================================================
          PHASE 1: ĐOÁN SAI & BỊ TRỪ ĐIỂM
          =================================================== */}
      {isMistakePhase && (
        <g
          transform={`translate(540, 520) scale(${Math.max(0, mistakeStampScale)}) rotate(${idleDeg * 1.5})`}
        >
          {/* Mistake warning card */}
          <RoughShape
            type="rect"
            args={[-380, -180, 760, 360]}
            options={{
              seed: getSeed(310),
              stroke: "#FF4D6D",
              strokeWidth: 4,
              fill: "rgba(255, 77, 109, 0.12)",
              fillStyle: "hachure",
              hachureGap: 16,
              roughness: 1.8,
            }}
          />
          {/* Big Cross X mark */}
          <RoughShape
            type="line"
            args={[-80, -120, 80, 40]}
            options={{ seed: getSeed(311), stroke: "#FF4D6D", strokeWidth: 8 }}
          />
          <RoughShape
            type="line"
            args={[80, -120, -80, 40]}
            options={{ seed: getSeed(312), stroke: "#FF4D6D", strokeWidth: 8 }}
          />
          <text
            x={0}
            y={80}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 38,
              fontWeight: 900,
              filter: "url(#chalk-shadow)",
            }}
          >
            LẦN ĐẦU: ĐOÁN CON CHÓ!
          </text>
          <text
            x={0}
            y={130}
            textAnchor="middle"
            fill="#FF4D6D"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: "0.06em",
              filter: "url(#chalk-shadow)",
            }}
          >
            ❌ SAI BÉT! -100 ĐIỂM (LOSS CAO)
          </text>
        </g>
      )}

      {/* ===================================================
          PHASE 2 & 3: BACKPROPAGATION (LỘI NGƯỢC DÒNG)
          =================================================== */}
      {(isBackpropPhase || isCorrectPhase) && (
        <g
          transform={`translate(540, 450) scale(${Math.max(0, reverseArrowScale)})`}
        >
          {/* Reverse backpropagation sweeping arrows */}
          <RoughShape
            type="curve"
            args={[]}
            curvePoints={[
              [350, 0],
              [120, -120],
              [-150, -120],
              [-360, 0],
            ]}
            options={{
              seed: getSeed(320),
              stroke: "#00F0FF",
              strokeWidth: 6,
              roughness: 1.8,
            }}
          />
          {/* Reverse Arrowhead pointing left */}
          <RoughShape
            type="line"
            args={[-360, 0, -320, -35]}
            options={{ seed: getSeed(321), stroke: "#00F0FF", strokeWidth: 6 }}
          />
          <RoughShape
            type="line"
            args={[-360, 0, -320, 35]}
            options={{ seed: getSeed(322), stroke: "#00F0FF", strokeWidth: 6 }}
          />

          {/* Banner Tag */}
          <g transform="translate(0, -60)">
            <RoughShape
              type="rect"
              args={[-300, -40, 600, 80]}
              options={{
                seed: getSeed(323),
                stroke: "#FFE600",
                strokeWidth: 3.5,
                fill: "rgba(255, 230, 0, 0.15)",
                fillStyle: "solid",
              }}
            />
            <text
              x={0}
              y={12}
              textAnchor="middle"
              fill="#FFE600"
              style={{
                fontFamily: '"Arial Black", sans-serif',
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "0.06em",
              }}
            >
              {"LỘI NGƯỢC DÒNG: CHỈNH TRỌNG SỐ"}
            </text>
          </g>

          {/* Weight tuning formula in chalk */}
          <text
            x={0}
            y={80}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            W_new = W_old - η · (∂Loss / ∂W)
          </text>
        </g>
      )}

      {/* ===================================================
          ERROR PROGRESS GAUGE & ITERATION COUNTER (BOTTOM)
          =================================================== */}
      <g transform="translate(540, 820)">
        {/* Progress box container */}
        <RoughShape
          type="rect"
          args={[-420, -110, 840, 220]}
          options={{
            seed: getSeed(330),
            stroke: "#FFFFFF",
            strokeWidth: 3.5,
            fill: "rgba(255,255,255,0.04)",
          }}
        />

        {/* Iteration Counter */}
        <text
          x={0}
          y={-55}
          textAnchor="middle"
          fill="#FFE600"
          style={{
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "0.06em",
          }}
        >
          {`LẶP ĐI LẶP LẠI: ${epochCount.toLocaleString()} LẦN!`}
        </text>

        {/* Progress Bar Track */}
        <RoughShape
          type="rect"
          args={[-350, -25, 700, 48]}
          options={{
            seed: getSeed(331),
            stroke: "#FFFFFF",
            strokeWidth: 2.5,
            fill: "rgba(0,0,0,0.5)",
          }}
        />

        {/* Filled Error Bar */}
        {errorBarWidth > 10 && (
          <RoughShape
            type="rect"
            args={[-350, -25, errorBarWidth, 48]}
            options={{
              seed: getSeed(332),
              stroke: errorRate > 20 ? "#FF4D6D" : "#00FF9D",
              strokeWidth: 3,
              fill: errorRate > 20 ? "rgba(255, 77, 109, 0.6)" : "rgba(0, 255, 157, 0.6)",
              fillStyle: "solid",
            }}
          />
        )}

        <text
          x={0}
          y={65}
          textAnchor="middle"
          fill={errorRate > 20 ? "#FF4D6D" : "#00FF9D"}
          style={{
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 26,
            fontWeight: 900,
          }}
        >
          {errorRate > 20
            ? `TỶ LỆ LỖI (ERROR): ${errorRate.toFixed(1)}% (ĐANG HỌC...)`
            : `TỶ LỆ LỖI (ERROR): ${errorRate.toFixed(1)}% (HOÀN HẢO!)`}
        </text>
      </g>

      {/* ===================================================
          PHASE 3: ĐOÁN TRÚNG PHÓC! (VICTORY STAMP)
          =================================================== */}
      {isCorrectPhase && (
        <g
          transform={`translate(540, 1140) scale(${Math.max(0, correctStampScale)}) rotate(${-idleDeg})`}
        >
          <RoughShape
            type="rect"
            args={[-380, -100, 760, 200]}
            options={{
              seed: getSeed(340),
              stroke: "#00FF9D",
              strokeWidth: 4.5,
              fill: "rgba(0, 255, 157, 0.14)",
              fillStyle: "solid",
            }}
          />
          {/* Big Checkmark */}
          <RoughShape
            type="line"
            args={[-240, 0, -210, 40]}
            options={{ seed: getSeed(341), stroke: "#00FF9D", strokeWidth: 7 }}
          />
          <RoughShape
            type="line"
            args={[-210, 40, -160, -45]}
            options={{ seed: getSeed(342), stroke: "#00FF9D", strokeWidth: 7 }}
          />
          <text
            x={40}
            y={-10}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 34,
              fontWeight: 900,
              filter: "url(#chalk-shadow)",
            }}
          >
            KẾT QUẢ: 100% CON MÈO!
          </text>
          <text
            x={40}
            y={45}
            textAnchor="middle"
            fill="#FFE600"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: "0.06em",
              filter: "url(#chalk-shadow)",
            }}
          >
            ĐOÁN TRÚNG PHÓC! 🎉
          </text>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// SUB-SCENE 4: CONCLUSION & OUTRO (BRAIN CHIP & COMIC CTA)
// =========================================================================
const Scene4Outro: React.FC<SubSceneProps> = ({ frame, fps, getSeed, idleDeg }) => {
  const localFrame = frame - 1050; // 0 to 300 frames

  const brainScale = spring({
    frame: localFrame - 10,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const ctaScale = spring({
    frame: localFrame - 80,
    fps,
    config: { damping: 10, mass: 0.45, stiffness: 190 },
  });

  // Pulsing heartbeat for CTA button
  const pulseScale = 1 + 0.08 * Math.sin(localFrame * 0.25);

  return (
    <g>
      {/* TOP: THE AI NEURAL BRAIN + CHIP */}
      <g
        transform={`translate(540, 520) scale(${Math.max(0, brainScale)}) rotate(${idleDeg})`}
      >
        {/* Silicon chip body */}
        <RoughShape
          type="rect"
          args={[-240, -190, 480, 380]}
          options={{
            seed: getSeed(410),
            stroke: "#00F0FF",
            strokeWidth: 4,
            fill: "rgba(0, 240, 255, 0.06)",
            fillStyle: "hachure",
            hachureGap: 16,
            roughness: 1.5,
          }}
        />

        {/* Chip Pins around border */}
        {[-140, -70, 0, 70, 140].map((px, i) => (
          <React.Fragment key={`pin-${i}`}>
            <RoughShape
              type="line"
              args={[px, -190, px, -230]}
              options={{ seed: getSeed(411 + i), stroke: "#FFE600", strokeWidth: 4 }}
            />
            <RoughShape
              type="line"
              args={[px, 190, px, 230]}
              options={{ seed: getSeed(421 + i), stroke: "#FFE600", strokeWidth: 4 }}
            />
          </React.Fragment>
        ))}

        {/* Hand-drawn Neural Brain Folds */}
        <RoughShape
          type="circle"
          args={[-70, -20, 160]}
          options={{ seed: getSeed(431), stroke: "#FFE600", strokeWidth: 4 }}
        />
        <RoughShape
          type="circle"
          args={[70, -20, 160]}
          options={{ seed: getSeed(432), stroke: "#FFE600", strokeWidth: 4 }}
        />
        {/* Brain sulcus curves */}
        <RoughShape
          type="curve"
          args={[]}
          curvePoints={[
            [-120, -50],
            [-70, 10],
            [-30, -40],
            [-70, -80],
          ]}
          options={{ seed: getSeed(433), stroke: "#FFFFFF", strokeWidth: 3 }}
        />
        <RoughShape
          type="curve"
          args={[]}
          curvePoints={[
            [120, -50],
            [70, 10],
            [30, -40],
            [70, -80],
          ]}
          options={{ seed: getSeed(434), stroke: "#FFFFFF", strokeWidth: 3 }}
        />

        {/* Energy lightning sparks */}
        <RoughShape
          type="line"
          args={[-280, -90, -340, -110]}
          options={{ seed: getSeed(435), stroke: "#00FF9D", strokeWidth: 4 }}
        />
        <RoughShape
          type="line"
          args={[280, -90, 340, -110]}
          options={{ seed: getSeed(436), stroke: "#00FF9D", strokeWidth: 4 }}
        />

        {/* Text inside chip */}
        <text
          x={0}
          y={110}
          textAnchor="middle"
          fill="#00FF9D"
          style={{
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "0.06em",
          }}
        >
          10^12 PHÉP TÍNH / GIÂY
        </text>
      </g>

      {/* CORE MESSAGE BANNER */}
      <g transform="translate(540, 830)">
        <RoughShape
          type="rect"
          args={[-440, -45, 880, 90]}
          options={{
            seed: getSeed(440),
            stroke: "#FFE600",
            strokeWidth: 3,
            fill: "rgba(255, 230, 0, 0.1)",
          }}
        />
        <text
          x={0}
          y={12}
          textAnchor="middle"
          fill="#FFE600"
          style={{
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "0.05em",
          }}
        >
          KIÊN TRÌ SỬA SAI = TRÍ TUỆ NHÂN TẠO!
        </text>
      </g>

      {/* BOTTOM: COMIC CALL TO ACTION (CTA) */}
      <g
        transform={`translate(540, 1100) scale(${Math.max(0, ctaScale)})`}
      >
        {/* Pulsing CTA Button Box */}
        <g transform={`scale(${pulseScale})`}>
          <RoughShape
            type="rect"
            args={[-380, -100, 760, 200]}
            options={{
              seed: getSeed(450),
              stroke: "#FF4D6D",
              strokeWidth: 5,
              fill: "rgba(255, 77, 109, 0.16)",
              fillStyle: "solid",
              roughness: 1.6,
            }}
          />
          {/* Inner border */}
          <RoughShape
            type="rect"
            args={[-360, -85, 720, 170]}
            options={{
              seed: getSeed(451),
              stroke: "#FFE600",
              strokeWidth: 2.5,
              roughness: 1.3,
            }}
          />

          {/* Heart icon on left */}
          <g transform="translate(-250, 0)">
            <RoughShape
              type="circle"
              args={[-15, -15, 36]}
              options={{ seed: getSeed(452), stroke: "#FF4D6D", fill: "#FF4D6D", fillStyle: "solid" }}
            />
            <RoughShape
              type="circle"
              args={[15, -15, 36]}
              options={{ seed: getSeed(453), stroke: "#FF4D6D", fill: "#FF4D6D", fillStyle: "solid" }}
            />
            <RoughShape
              type="polygon"
              args={[]}
              curvePoints={[
                [-30, -5],
                [30, -5],
                [0, 32],
              ]}
              options={{ seed: getSeed(454), stroke: "#FF4D6D", fill: "#FF4D6D", fillStyle: "solid" }}
            />
          </g>

          <text
            x={40}
            y={-8}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontFamily: '"Arial Black", "Baloo 2", sans-serif',
              fontSize: 42,
              fontWeight: 900,
              filter: "url(#chalk-shadow)",
            }}
          >
            FOLLOW KÊNH NGAY!
          </text>
          <text
            x={40}
            y={44}
            textAnchor="middle"
            fill="#FFE600"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "0.06em",
            }}
          >
            ĐỂ KHÁM PHÁ BÍ MẬT MÁY HỌC 🚀
          </text>
        </g>
      </g>
    </g>
  );
};
