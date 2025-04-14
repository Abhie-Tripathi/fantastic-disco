import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from "recharts";
interface IntelValue{
  name:string;
  value:number;
  fill:string;
}
// Function to render the active shape (hover effect)
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
  className="bg-gray-800 text-gray-100"
  style={{
    width: "90px",
    zIndex: 999,
    fontSize:"10px",
    position: "sticky",
    left: coordinate.x - 40,
    top: coordinate.y - 50,
    padding: "2px",
    borderRadius: "4px",
    textAlign: "center",
    pointerEvents: "none",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  }}
>
  Relevance Score
</div>

  );
};

export default function PieChartComponent({
  width = "100px",
  height = "100px",
  intelScore,
}: {
  width?: string;
  height?: string;
  intelScore: IntelValue[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalValue = intelScore.reduce((sum, item) => sum + item.value, 0);
  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
        {totalValue > 0 ? (
            // Render Pie if values exist
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={intelScore}
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          ) : (
            // Render Empty Circle if total value is 0
            <circle
            cx="50%"
            cy="50%"
            // innerRadius="80%"
            // outerRadius="100%"
              stroke="#E0E0E0"
              fill="none"
              strokeWidth={2}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <text
            x="50%"
            y="50%"
            dy={5}
            textAnchor="middle"
            fill="#333"
            fontSize="14px"
            fontWeight="bold"
          >
            {intelScore?.reduce((sum:number, item:IntelValue) => sum + item.value, 0)}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
