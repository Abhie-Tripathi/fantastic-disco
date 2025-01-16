"use client";
interface CircularProgressProps {
  value: number | null;
  visibility: boolean;
}

export const CircularProgressBar: React.FC<CircularProgressProps> = ({
  value,
  visibility,
}) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const svgSize = radius * 2 + 8;

  const displayValue = visibility ? (value !== null ? value : 0) : 0;

  const getColorByValue = (score: number): string => {
    if (score <= 0) return "text-transparent";
    if (score <= 25) return "text-[#398e4a]";
    if (score <= 50) return "text-[#FFD70A]";
    if (score <= 75) return "text-[#FF990A]";
    if (score <= 100) return "text-[#DA2F35]";
    return "text-gray-200";
  };

  const className = getColorByValue(displayValue);

  return (
    <div className="text-center">
      <div className="relative inline-flex">
        <svg
          className="block"
          width={svgSize}
          height={svgSize}
          aria-hidden="true"
        >
          <circle
            className="text-gray-200 dark:text-[#292929]"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />
          <circle
            className={className}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (displayValue / 100) * circumference
            }
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={svgSize / 2}
            cy={svgSize / 2}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
          aria-hidden="true"
        >
          {visibility ? (value !== null && value > 0 ? value : "--") : ""}
        </span>
      </div>
    </div>
  );
};
