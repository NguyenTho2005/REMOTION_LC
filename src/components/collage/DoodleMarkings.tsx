import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";
import rough from "roughjs/bin/rough";

export interface DoodleMarkingsProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const DoodleMarkings: React.FC<DoodleMarkingsProps> = ({
  width = 1080,
  height = 1920,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);
    const seed = Math.floor(frame / 3); // boiling line effect

    const common = {
      roughness: 1.8,
      bowing: 1.5,
      strokeWidth: 4,
      seed,
    };

    // Arrow pointing to center-right card area
    svg.appendChild(
      rc.linearPath(
        [
          [140, 520],
          [260, 620],
          [360, 560],
          [470, 700],
        ],
        { ...common, stroke: "#ff5722" },
      ),
    );
    svg.appendChild(
      rc.polygon(
        [
          [470, 700],
          [430, 675],
          [445, 720],
        ],
        { ...common, stroke: "#ff5722", fill: "#ff5722", fillStyle: "solid" },
      ),
    );

    // Circle highlight around top hook area
    svg.appendChild(
      rc.ellipse(540, 420, 700, 260, {
        ...common,
        stroke: "#2563eb",
        strokeWidth: 5,
      }),
    );

    // Stars
    const stars: Array<[number, number, number]> = [
      [860, 260, 34],
      [210, 1180, 26],
      [920, 1320, 30],
      [180, 300, 22],
    ];
    stars.forEach(([cx, cy, r], i) => {
      const points: [number, number][] = [];
      for (let p = 0; p < 10; p += 1) {
        const angle = (-Math.PI / 2) + (p * Math.PI) / 5;
        const rad = p % 2 === 0 ? r : r * 0.45;
        points.push([cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad]);
      }
      svg.appendChild(
        rc.polygon(points, {
          ...common,
          seed: seed + i + 1,
          stroke: "#f59e0b",
          fill: "#fde047",
          fillStyle: "solid",
          strokeWidth: 3,
        }),
      );
    });

    // Underline scribbles
    svg.appendChild(
      rc.line(220, 1030, 860, 1045, { ...common, stroke: "#16a34a", strokeWidth: 5, seed: seed + 10 }),
    );
    svg.appendChild(
      rc.line(240, 1060, 820, 1050, { ...common, stroke: "#16a34a", strokeWidth: 3, seed: seed + 11 }),
    );

    // Small spiral doodle
    const spiral: [number, number][] = [];
    for (let t = 0; t < 22; t += 1) {
      const a = t * 0.55;
      const rr = 4 + t * 3;
      spiral.push([900 + Math.cos(a) * rr, 820 + Math.sin(a) * rr]);
    }
    svg.appendChild(rc.linearPath(spiral, { ...common, stroke: "#9333ea", strokeWidth: 3, seed: seed + 20 }));
  }, [frame]);

  return (
    <svg
      ref={svgRef}
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        ...style,
      }}
    />
  );
};
