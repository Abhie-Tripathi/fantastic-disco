import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from "recharts";

interface IntelValue {
  name: string;
  value: number;
  fill: string;
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
// const CustomTooltip = ({ active, payload, coordinate }: any) => {
//   if (!active || !payload || !payload.length) return null;

//   return (
//     <div
//       className="bg-gray-800 text-gray-100"
//       style={{
//         width: "90px",
//         zIndex: 999,
//         fontSize: "10px",
//         position: "sticky",
//         left: coordinate.x - 40,
//         top: coordinate.y - 50,
//         padding: "2px",
//         borderRadius: "4px",
//         textAlign: "center",
//         pointerEvents: "none",
//         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
//       }}
//     >
//       Relevance Score
//     </div>
//   );
// };

export default function PieChartComponent({
  width = "100px",
  height = "100px",
  intelScore,
  source,
}: {
  source?: string;
  width?: string;
  height?: string;
  intelScore: IntelValue[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const chartData =
   ( source === "Prospect" || source=== "People" || source === "Purpose")
      ? intelScore.map((item) => ({
        ...item,
        value: 30, 
        fill: item?.name !== source ? "#E6E6E6" : item.fill, 
      }))
      : intelScore.map((item) => ({
        ...item,
        value: 30, 
        fill: item.value === 0 ? "#E6E6E6" : item.fill, 
      }));

  const totalValue =
  (source === "Prospect" || source=== "People" || source === "Purpose")
      ? 100
      : intelScore.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {totalValue > 0 ? (
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270} 
              innerRadius="80%"
              outerRadius="100%"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          ) : (
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              stroke="#E0E0E0"
              fill="none"
              strokeWidth={2}
            />
          )}
          {/* <Tooltip content={<CustomTooltip />} /> */}
          <text
            x="50%"
            y="50%"
            dy={5}
            textAnchor="middle"
            fill="var(--primary-text-color)"
            fontSize="14px"
            fontWeight="bold"
          >
            {( source === "Prospect" || source=== "People" || source === "Purpose")
              ? `+ ${intelScore.find((item)=>item.name==source)?.value}` ?? 0
              : intelScore.reduce((sum, item) => sum + item.value, 0)}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
