import React from "react";

export const ChatGPTIcon: React.FC<{
  size?: number;
  color?: string;
  fill?: string;
}> = ({ size = 64, color = "#10A37F", fill = "none" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49l-.49.163-.163-.49C14.167 19.135 12 16.27 12 12A10 10 0 0 1 2 12a10 10 0 0 1 10-10z" />
      <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
};

export const CodexIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 64, color = "#38BDF8" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export const OpenAILogo: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 48, color = "#FFFFFF" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5a4.5 4.5 0 0 0-4.4 3.5 4.5 4.5 0 0 0-3.5 4.4 4.5 4.5 0 0 0 1.5 5.2 4.5 4.5 0 0 0 2.9 5.9 4.5 4.5 0 0 0 7 0 4.5 4.5 0 0 0 2.9-5.9 4.5 4.5 0 0 0 1.5-5.2 4.5 4.5 0 0 0-3.5-4.4A4.5 4.5 0 0 0 12 2.5z" />
      <path d="M12 7.5v9" />
      <path d="M8.1 9.75l7.8 4.5" />
      <path d="M8.1 14.25l7.8-4.5" />
    </svg>
  );
};

export const TokenCubeIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 32, color = "#38BDF8" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
};
