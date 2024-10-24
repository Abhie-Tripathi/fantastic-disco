import React from "react";

interface PulsingDotProps {
  color: string;
  size?: number;
}

export const PulsingDot: React.FC<PulsingDotProps> = ({ color, size = 50 }) => {
  color = "#ffff";
  return (
    <div
      className="pulsing-dot-container"
      style={{ width: size, height: size }}
    >
      <div className="pulsing-dot" style={{ backgroundColor: color }}></div>
      <div className="pulsing-outline"></div>
      <div className="pulsing-outline" style={{ animationDelay: "0.5s" }}></div>
      <div className="pulsing-outline" style={{ animationDelay: "1s" }}></div>
      <style jsx>{`
        .pulsing-dot-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulsing-dot {
          width: 50%;
          height: 50%;
          border-radius: 50%;
          opacity: 0;
        }
        .pulsing-outline {
          position: absolute;
          top: 25%;
          left: 25%;
          right: 25%;
          bottom: 25%;
          border-radius: 50%;
          border: 2px solid #ff0000;
          opacity: 0;
          animation: pulse 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
