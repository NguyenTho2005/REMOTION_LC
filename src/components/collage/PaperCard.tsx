import React from "react";

export interface PaperCardProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  rotationDeg?: number;
  style?: React.CSSProperties;
  className?: string;
  padding?: number | string;
  borderRadius?: number;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  width = "100%",
  height = "auto",
  backgroundColor = "#fffdf7",
  rotationDeg = 0,
  style,
  className,
  padding = 24,
  borderRadius = 18,
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor,
        padding,
        borderRadius,
        border: "4px solid #FFFFFF",
        filter: "drop-shadow(6px 6px 0px #000000)",
        transform: `rotate(${rotationDeg}deg)`,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle paper grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 5px)",
          mixBlendMode: "multiply",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
