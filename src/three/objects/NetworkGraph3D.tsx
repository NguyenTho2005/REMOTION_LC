import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { NetworkGraph3DObjectConfig } from "../core/types";
import { useThreeAnimation } from "../animations/useThreeAnimation";
import { DEFAULT_3D_FONT } from "../core/constants";

export const NetworkGraph3D: React.FC<{
  config: NetworkGraph3DObjectConfig;
}> = ({ config }) => {
  const frame = useCurrentFrame();
  const nodeCount = config.nodeCount ?? 8;
  const radius = config.radius ?? 3;

  const { position, rotation, scale } = useThreeAnimation(
    config.position,
    config.rotation,
    config.scale,
    config.animation
  );

  // Generate deterministic node positions in a sphere/layer layout
  const { nodes, edges } = useMemo(() => {
    const labels = config.nodeLabels ?? [
      "Input",
      "Encoder",
      "Self-Attention",
      "FeedForward",
      "Decoder",
      "Cross-Attention",
      "Linear",
      "Output",
    ];
    const nodeList: Array<{ id: number; pos: [number, number, number]; label: string }> = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi) * 0.7;
      const z = radius * Math.cos(phi);

      nodeList.push({
        id: i,
        pos: [x, y, z],
        label: labels[i % labels.length],
      });
    }

    // Connect adjacent nodes
    const edgeList: Array<{ from: [number, number, number]; to: [number, number, number] }> = [];
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const d = Math.hypot(
          nodeList[i].pos[0] - nodeList[j].pos[0],
          nodeList[i].pos[1] - nodeList[j].pos[1],
          nodeList[i].pos[2] - nodeList[j].pos[2]
        );
        // Connect if close enough
        if (d < radius * 1.5 || (i === 0 && j === 1) || (j === i + 1)) {
          edgeList.push({ from: nodeList[i].pos, to: nodeList[j].pos });
        }
      }
    }

    return { nodes: nodeList, edges: edgeList };
  }, [nodeCount, radius, config.nodeLabels]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Node Spheres and Labels */}
      {nodes.map((node, idx) => {
        const pulse = 1 + Math.sin(frame * 0.08 + idx) * 0.15;
        const nodeColor =
          idx === 0
            ? "#10B981"
            : idx === nodes.length - 1
            ? "#F59E0B"
            : config.color ?? "#38BDF8";

        return (
          <group key={node.id} position={node.pos}>
            <mesh scale={[pulse, pulse, pulse]}>
              <sphereGeometry args={[0.35, 24, 24]} />
              <meshStandardMaterial
                color={nodeColor}
                metalness={0.4}
                roughness={0.2}
                emissive={nodeColor}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Label */}
            <Text
              font={DEFAULT_3D_FONT}
              position={[0, 0.6, 0]}
              fontSize={0.28}
              color="#FFFFFF"
              anchorX="center"
              anchorY="bottom"
            >
              {node.label}
            </Text>
          </group>
        );
      })}

      {/* Connecting Edges */}
      {edges.map((edge, idx) => {
        const points = [new THREE.Vector3(...edge.from), new THREE.Vector3(...edge.to)];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

        // Calculate animated packet along edge
        const t = ((frame * 0.03 + idx * 0.2) % 1);
        const packetX = edge.from[0] + (edge.to[0] - edge.from[0]) * t;
        const packetY = edge.from[1] + (edge.to[1] - edge.from[1]) * t;
        const packetZ = edge.from[2] + (edge.to[2] - edge.from[2]) * t;

        return (
          <group key={idx}>
            <primitive object={new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: "#1e293b", linewidth: 1 }))} />
            {/* Moving data packet */}
            {config.activeFlow !== false && (
              <mesh position={[packetX, packetY, packetZ]}>
                <sphereGeometry args={[0.09, 12, 12]} />
                <meshBasicMaterial color="#38BDF8" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
