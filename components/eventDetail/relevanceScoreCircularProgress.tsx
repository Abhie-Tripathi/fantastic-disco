import React, { useEffect, useState } from "react";

interface CircularProgressProps {
  percentages: number[];
  relevanceScore: string;
}

const CircularProgress = ({
  percentages,
  relevanceScore,
}: CircularProgressProps) => {
  const colors = ["#646BDC", "#E99CD4", "#9B86D4"];
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([]);

  const baseRadius = 22;
  const spacing = 3;
  const strokeWidth = 3;

  useEffect(() => {
    setAnimatedPercentages(percentages.map(() => 0));
    
    const animationDuration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const newPercentages = percentages.map(p => p * progress);
      setAnimatedPercentages(newPercentages);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  const circleRadius = (index: number) => {
    const radius = baseRadius - index * (strokeWidth + spacing);
    return radius > 0 ? radius : 0;
  };

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <svg viewBox="0 0 52 52" style={{ width: "200px", height: "200px" }}>
        {animatedPercentages.map((percentage, index) => {
          const radius = circleRadius(index);
          const circum = 2 * Math.PI * radius;

          return (
            radius > 0 && (
              <React.Fragment key={`circle-${index}`}>
                <circle
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