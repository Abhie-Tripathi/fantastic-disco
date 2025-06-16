import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from "recharts";
import { useSearchParams } from "next/navigation";
// Sample Data with Fixed Fill Colors
const data = [
  { name: "Total", value: 0, fill: "#646BDC" },
  // { name: "People", value: 40, fill: "#646BDC" },
  // { name: "Purpose", value: 20, fill: "#E99CD4" },
  // { name: "Prospect", value: 40, fill: "#9B86D4" },
];
interface IntelValue{
  name:string;
  value:number;
  fill:string;
}
const totalValue = data.reduce((sum, item) => sum + item.value, 0);

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
const CustomTooltip = ({ active, payload, coordinate, briefType  }: any) => {
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
  {`Relevance Score (${briefType})`}
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
  // console.log(intelScore);
  const totalValue = intelScore.reduce((sum, item) => sum + item.value, 0);
  // const intelScore = [
  //   {
  //     name: "Total",
  //     value: 40,
  //     fill: "#646BDC",
  //   }
  // ];
   const path=useSearchParams();
  const type = path.get("type") || "";
  const types={
    "Prospect":["T_COMPETITOR"],
    "People":["T_PEOPLE_FINDER","T_SPEAKING_OPPORTUNITY"],
    "Purpose":["T_PRODUCT_KEYWORDS"]
  }
  const briefType = Object.entries(types).find(([_, values]) => values.includes(type))?.[0];
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
              data={intelScore}
              cx="50%"
              cy="50%"
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
          <Tooltip content={<CustomTooltip briefType={briefType}/>} />
          <text
            x="50%"
            y="50%"
            dy={5}
            textAnchor="middle"
            fill="var(--secondary-text-color)"
            fontSize="14px"
            fontWeight="bold"
          >
            {intelScore?.reduce((sum:number, item:IntelValue) => sum + item.value,0)>0?intelScore?.reduce((sum:number, item:IntelValue) => sum + item.value,0):"-"}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
