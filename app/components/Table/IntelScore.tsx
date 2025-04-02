import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from "recharts";

// Sample Data with Fixed Fill Colors
const data = [
  { name: "People", value: 40, fill: "#646BDC" },
  // { name: "Purpose", value: 20, fill: "#E99CD4" },
  // { name: "Prospect", value: 40, fill: "#9B86D4" },
];

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
const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        width: "90px",
        zIndex: 999,
        position: "sticky",
        left: coordinate.x - 20,
        top: coordinate.y - 40,
        background: "white",
        fontSize: "12px",
        borderRadius: "6px",
        textAlign: "center",
        pointerEvents: "none",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
      }}
    >
      {payload[0].name}
      <div>
       {payload[0].value}
       </div>
    </div>
  );
};

export default function PieChartComponent({
  width = "100px",
  height = "100px",
}: {
  width?: string;
  height?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
          {/* <Tooltip content={<CustomTooltip />} /> */}
          <text
            x="50%"
            y="50%"
            dy={5}
            textAnchor="middle"
            fill="#333"
            fontSize="14px"
            fontWeight="bold"
          >
            {totalValue}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
