import React from "react";

interface CircularProgressProps {
  percentages: number[];
  relevanceScore: string;
}

const CircularProgress = ({
  percentages,
  relevanceScore,
}: CircularProgressProps) => {
  const colors = ["#646BDC", "#E99CD4", "#9B86D4"];

  const baseRadius = 22;
  const spacing = 3;
  const strokeWidth = 3;

  const circleRadius = (index: number) => {
    const radius = baseRadius - index * (strokeWidth + spacing);
    return radius > 0 ? radius : 0;
  };

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <svg viewBox="0 0 52 52" style={{ width: "200px", height: "200px" }}>
        {percentages.map((percentage, index) => {
          const radius = circleRadius(index);
          const circum = 2 * Math.PI * radius;
          const filledBar = Math.round((percentage * circum) / 100);

          return (
            radius > 0 && (
              <React.Fragment key={`circle-${percentage}`}>
                <circle
                  className="text-gray-200"
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="26"
                  cy="26"
                  style={{ color: "var(--neutral-light-color)" }}
                  transform="rotate(-90 26 26)"
                  strokeLinecap="round"
                />
                <circle
                  strokeWidth={strokeWidth}
                  strokeDasharray={circum}
                  strokeDashoffset={circum - (percentage / 100) * circum}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="26"
                  cy="26"
                  style={{ color: colors[index] }}
                  transform="rotate(-90 26 26)"
                />
              </React.Fragment>
            )
          );
        })}
      </svg>
      <span
        className="absolute flex justify-center items-center font-bold text-[var(--primary-color)] border border-[var(--border-color)] rounded-full p-[10px] top-[40%] left-[40%] w-[40px] h-[40px]"
        aria-hidden="true"
      >
        {relevanceScore ? relevanceScore : "--"}
      </span>
    </div>
  );
};

export default CircularProgress;