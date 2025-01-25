// "use client"

import { SetStateAction, useCallback, useState } from "react";
import Image from "next/image";
import {
  Pie,
  PieChart,
  Sector,
  ResponsiveContainer,
  Label,
  LabelList,
} from "recharts";

// import { TrendingUp } from "lucide-react"
// import { Label, Pie, PieChart, Sector } from "recharts"
// import { PieSectorDataItem } from "recharts/types/polar/Pie"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// const chartData = [
//     { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//     { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//     { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//     { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//     { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

// const chartConfig = {
//     visitors: {
//         label: "Visitors",
//     },
//     chrome: {
//         label: "Chrome",
//         color: "hsl(var(--chart-1))",
//     },
//     safari: {
//         label: "Safari",
//         color: "hsl(var(--chart-2))",
//     },
//     firefox: {
//         label: "Firefox",
//         color: "hsl(var(--chart-3))",
//     },
//     edge: {
//         label: "Edge",
//         color: "hsl(var(--chart-4))",
//     },
//     other: {
//         label: "Other",
//         color: "hsl(var(--chart-5))",
//     },
// } satisfies ChartConfig

// const PieChartComponent = () => {
//     return (
//         <Card className="flex flex-col border-none shadow-none">
//             <CardContent className="flex-1 pb-0">
//                 <ChartContainer
//                     config={chartConfig}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <PieChart>
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Pie
//                             data={chartData}
//                             dataKey="visitors"
//                             nameKey="browser"
//                             innerRadius={60}
//                             strokeWidth={5}
//                             activeIndex={0}
//                             activeShape={({
//                                 outerRadius = 0,
//                                 ...props
//                             }: PieSectorDataItem) => (
//                                 <Sector {...props} outerRadius={outerRadius + 10} />
//                             )}
//                         />
//                     </PieChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }
// export default PieChartComponent;

// const data = [
//     { name: 'Concert', value: 400 },
//     { name: 'Performing Arts', value: 300 },
//     { name: 'Speciality Shows', value: 300 },
// ];

const data = [
  { name: "Concert", value: 400, fill: "#BEF4EB" },
  { name: "Performing Arts", value: 300, fill: "#12A594" },
  { name: "Speciality Shows", value: 300, fill: "#45DEC5" },
];

interface IProps {
  subCategory: any;
  activeCategory: string;
}

const PieChartComponent = ({ subCategory, activeCategory }: IProps) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const convertToChartData = (subcategory: any) => {
    if (!subCategory || Object.keys(subCategory).length === 0) return [];

    const iconsList: Record<string, string> = {
      "performing-arts": "/performingArtsIcon.png",
      concert: "/concertIcon.png",
      festival: "/festivalIcon.png",
      community: "/communityIcon.png",
      sport: "/sportIcon.png",
      workshops: "/workshopIcon.png",
      tradeshows: "/tradeshowIcon.png",
      conferences: "/conferencesIcon.png",
    };

    const colors = [
      "#FF7D45",
      "#0062D1",
      // "#BEF4EB",
      // "#12A594",
      // "#45DEC5",
      // "#F26D6D",
      // "#FFA07A",
      // "#FFDD8F",
    ]; // Add more colors if needed
    let colorIndex = 0;

    // return Object.entries(subcategory).map(([name, value]) => {
    //   const chartItem = {
    //     name: name
    //       .replace(/-/g, " ")
    //       .replace(/\b\w/g, (char) => char.toUpperCase()), // Format name
    //     value: value,
    //     fill: colors[colorIndex % colors.length], // Assign color dynamically
    //   };
    //   colorIndex++;
    //   return chartItem;
    // });
    return Object.entries(subcategory)
      .filter(([_, value]) => typeof value === "number" && value > 0) // Filter out entries with value 0
      .map(([name, value]) => {
        const iconKey = name as keyof typeof iconsList;
        const chartItem = {
          name: name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()), // Format name
          value, // Keep the value as number
          fill: `${activeCategory === "Social" ? colors[0] : colors[1]}`, // Assign color dynamically
          image: iconsList[iconKey] || "",
        };
        colorIndex++;
        return chartItem;
      });
  };

  //   const renderCustomLabel = ({ name, value, x, y }: any) => {
  //     return `${name}: Events ${value}`;
  //   };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const offsetX = x + (x > cx ? 20 : -20); // Add a little offset
    const offsetY = y + (y > cy ? 10 : -10); // Add a little offset

    return (
      <text
        x={offsetX}
        y={offsetY}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "12px", fontWeight: "bold" }}
      >
        {`${data[index].name}: Events ${data[index].value}`}
      </text>
    );
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    const imgX = cx + outerRadius * cos - 15; // Center the image horizontally
    const imgY = cy + outerRadius * sin - 10; // Center the image vertically
    const sliceCenterX =
      cx + (innerRadius + (outerRadius - innerRadius) / 2) * cos;
    const sliceCenterY =
      cy + (innerRadius + (outerRadius - innerRadius) / 2) * sin;

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"#000"}>
          {/* {payload.name} */}
          {activeCategory}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          // outerRadius={outerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff" // Add stroke to create the gap
          strokeWidth={3} // Define the width of the gap
          cornerRadius={10} // Apply corner radius for smooth edges
        />
        <image
          href={payload.image} // Image URL from payload
          x={sliceCenterX - 15} // X position for image
          y={sliceCenterY - 15} // Y position for image
          height="40px" // Image height
          width="40px" // Image width
          preserveAspectRatio="xMidYMid slice" // To make sure image scales correctly
        />
        {/* <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                /> */}
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={"#000"}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={"#000"} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${payload.name}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`Events : ${value}`}
        </text>
      </g>
    );
  };

  const data = convertToChartData(subCategory);

  const onPieEnter = useCallback(
    (_: any, index: SetStateAction<number>) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  // Function to dynamically calculate outerRadius based on value
  const getDynamicOuterRadius = (entry: any): number => {
    const baseRadius = 120; // Base radius
    const scaleFactor = 1.5; // Scale factor to differentiate radii
    return baseRadius + (entry.value / 100) * scaleFactor; // Adjust scale for your data
  };
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            // activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={120}
            outerRadius={180} // Use dynamic outerRadius
            fill="#8884d8"
            label={renderActiveShape}
            // label={({ name, value, x, y }) => (
            //   <text
            //     x={x}
            //     y={y}
            //     fill="black"
            //     textAnchor="middle"
            //     dominantBaseline="central"
            //     style={{ fontSize: "12px", fontWeight: "bold" }}
            //   >
            //     {`${name}: Events ${value}`}
            //   </text>
            // )}
            stroke="#fff" // Apply stroke for gap between slices
            strokeWidth={2} // Define the width of the gap
            cornerRadius={10} // Apply corner radius for smooth edges
            dataKey="value"
            startAngle={0}
            endAngle={360}
            // onMouseEnter={onPieEnter}
          >
            {/* <LabelList
              position="outside"
              offset={10}
              dataKey="name"
              formatter={(value: any, entry: { value: any }) =>
                `${value}: Events ${entry.value}`
              }
              style={{ fontSize: "12px", fontWeight: "bold", fill: "#000" }}
            /> */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PieChartComponent;
