// "use client";
// import React, { PureComponent } from 'react';
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//     { x: 5, y: 1508 },
//     { x: 6, y: 107 },
//     { x: 7, y: 325 },
// ];

// const Label = (props: any) => {
//     const { x, y, value } = props;

//     return (
//         <text
//             x={x}
//             y={y}
//             dx={"2%"}
//             dy={"-1%"}
//             fontSize="15"
//             fontWeight="bold"
//             fill={"#181818"}
//             textAnchor="left"
//         >
//             {value}
//         </text>
//     );
// };


// const BarChartComponent = () => {

//     return (
//         <div style={{ width: "100vw", height: "100vh" }}>
//             <BarChart width={730} height={250} data={data}>
//                 <XAxis
//                     tick={{ fontSize: 8 }}
//                     dataKey="x"
//                     type="number"
//                     axisLine={false}
//                     domain={[4.5, 13.5]}
//                     ticks={[5, 6, 7, 8, 9, 10, 11, 12, 13]}
//                 />
//                 <YAxis
//                 />
//                 <Bar dataKey="y" label={<Label />} fill="#8884d8" />
//             </BarChart>
//         </div>
//     );
// }
// export default BarChartComponent

// "use client"

// import { TrendingUp } from "lucide-react";
// import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

// const BarChartComponent = () => {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Bar Chart - Mixed</CardTitle>
//                 <CardDescription>January - June 2024</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig}>
//                     <BarChart
//                         accessibilityLayer
//                         data={chartData}
//                         layout="horizontal"
//                         margin={{
//                             left: 0,
//                         }}
//                     >
//                         <YAxis
//                             dataKey="browser"
//                             type="category"
//                             tickLine={false}
//                             tickMargin={10}
//                             axisLine={false}
//                             tickFormatter={(value) =>
//                                 chartConfig[value as keyof typeof chartConfig]?.label
//                             }
//                         />
//                         <XAxis dataKey="visitors" type="number" hide />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Bar dataKey="visitors" layout="horizontal" radius={5} />
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col items-start gap-2 text-sm">
//                 <div className="flex gap-2 font-medium leading-none">
//                     Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="leading-none text-muted-foreground">
//                     Showing total visitors for the last 6 months
//                 </div>
//             </CardFooter>
//         </Card>
//     )
// }

// export default BarChartComponent;


"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { category: "social", visitors: 187, fill: "#0072F5" },
    { category: "business", visitors: 200, fill: "#8E4EC6" },
]
const chartConfig = {
    visitors: {
        label: "Events",
    },
    social: {
        label: "Social",
        color: "#0072F5",
    },
    business: {
        label: "Business",
        color: "#8E4EC6",
    },
} satisfies ChartConfig

const BarChartComponent = () => {
    return (
        <Card className="border-none shadow-none mt-12">
            <CardContent className="p-0">
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} barSize={40} barGap="10">
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <YAxis
                            tickMargin={35}
                            axisLine={false}
                            tickLine={false}
                        />
                        {/* <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        /> */}
                        <Bar
                            dataKey="visitors"
                            strokeWidth={1}
                            radius={5}
                            activeIndex={1}
                            // label={{ position: 'top' }}
                            activeBar={({ ...props }) => {
                                return (
                                    <Rectangle
                                        {...props}
                                        fillOpacity={0.8}
                                        stroke={props.payload.fill}
                                        strokeDasharray={4}
                                        strokeDashoffset={4}
                                    />
                                )
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={1}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
export default BarChartComponent;
