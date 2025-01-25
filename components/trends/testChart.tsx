"use client"

import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Rectangle, XAxis, YAxis } from "recharts"

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

interface IProps {
    categoryIntel: any;
    setSubCategory: Dispatch<any>;
    setActiveCategory: Dispatch<SetStateAction<string>>;
}

const TestChartComponent = ({ categoryIntel, setSubCategory, setActiveCategory }: IProps) => {

    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const handleActiveBar = (index: number, category: string) => {
        setClickedIndex(index);
        // Set the appropriate subcategories based on the clicked bar's category
        if (category === "All") {
            const allSubCategories = {
                ...categoryIntel.Social,
                ...categoryIntel.Business,
            };
            setSubCategory(allSubCategories);
        } else if (category === "Social") {
            setSubCategory(categoryIntel.Social);
        } else if (category === "Business") {
            setSubCategory(categoryIntel.Business);
        }
        setActiveCategory(category);
    }

    // Transform data function
    const transformData = (data: any) => {

        if (!data || Object.keys(data).length === 0) return [];
        const socialTotal = Object.values(data.Social).reduce((sum: any, value: any) => sum + value, 0);
        const businessTotal = Object.values(data.Business).reduce((sum: any, value: any) => sum + value, 0);
        return [
            // { category: "All", business: businessTotal, social: socialTotal },
            { category: "Social", social: socialTotal, business: 0 },
            { category: "Business", social: 0, business: businessTotal, },
        ];
    };

    const chartData = transformData(categoryIntel);

    // const TransparentTooltip = ({ active, clicked }: any) => {
    //     if (active || clicked) {
    //         return (
    //             <div
    //                 style={{
    //                     backgroundColor: "rgba(255, 255, 255, 0.8)",
    //                     borderRadius: "4px",
    //                     padding: "8px",
    //                     boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    //                     visibility: "hidden"
    //                 }}
    //             />
    //         );
    //     }
    //     return null;
    // };

    // const chartConfig = {
    //     eventCount: {
    //         label: "Desktop",
    //         color: "hsl(var(--chart-1))",
    //     },
    // } satisfies ChartConfig

    const chartConfig = {
        social: {
            label: "Social",
            color: "#FF7D45",
        },
        business: {
            label: "Business",
            color: "#0062D1",
        },
    } satisfies ChartConfig

    // Function to round up the max value to the nearest "nice" number
    const getRoundedMaxValue = (maxValue: number) => {
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        return Math.ceil(maxValue / magnitude) * magnitude;
    };

    const maxDataValue = useMemo(() => {
        return getRoundedMaxValue(Math.max(...chartData.map(d => Math.max(d.social as number, d.business as number))));
    }, [chartData]);

    const generateTicks = (maxValue: number) => {
        const tickInterval = Math.ceil(maxValue / 10);
        let ticks = [];
        for (let i = 0; i <= maxValue; i += tickInterval) {
            ticks.push(i);
        }
        if (ticks[ticks.length - 1] < maxValue) {
            ticks.push(maxValue); // Ensure the max value is included
        }
        return ticks;
    };

    const ticks = generateTicks(maxDataValue);


    // const CustomTick = ({ x, y, payload }: any) => {
    //     const category = payload.value;
    //     const item = chartData.find((d) => d.category === category);
    //     const color = item ? item.fill : "#000";

    //     return (
    //         <g transform={`translate(${x},${y})`}>
    //             <circle cx={-20} cy={5} r={5} fill={color} />
    //             <text x={8} y={10} dy={0} textAnchor="middle" fill="#000" fontSize={14}>
    //                 {category}
    //             </text>
    //         </g>
    //     );
    // };

    return (
        <>
            <Card className="border-none shadow-none">
                <CardContent className="p-0">
                    <ChartContainer config={chartConfig} className="w-[350px] h-[400px]">
                        <BarChart
                            barGap="5"
                            barSize={40}
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 30,
                            }}
                        >
                            <CartesianGrid horizontal={false} vertical={false} />
                            <XAxis
                                dataKey="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                // tick={<CustomTick/>}
                                style={{ fill: "#000", fontSize: "14px" }}
                                tickFormatter={(value) => value}
                            />
                            <YAxis
                                tickMargin={0}
                                axisLine={false}
                                tickLine={false}
                                // domain={[0, 50]}
                                domain={[0, maxDataValue]}  // Dynamic domain based on max data value
                                ticks={ticks}               // Dynamic ticks
                                interval={1}
                                // ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550]}
                                style={{ fontSize: 14 }}
                                tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                            />
                            {/* <Legend /> */}
                            {/* <ChartTooltip content={<ChartTooltipContent hideLabel />} /> */}
                            {/* <ChartTooltip content={<TransparentTooltip />} /> */}
                            <Bar
                                dataKey="social"
                                stackId="a"
                                fill="var(--color-social)"
                                radius={[4, 4, 4, 4]}
                                label={{
                                    position: "top",
                                    offset: 12,
                                    className: "fill-foreground",
                                    fontWeight: 600,
                                    fontSize: 12
                                }}
                                onMouseEnter={(_, index) => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={(_, index) => handleActiveBar(index, chartData[index].category)}
                                shape={({ ...props }) => {
                                    const isHovered = hoveredIndex === props.index;
                                    const isClicked = clickedIndex === props.index;
                                    return (
                                        <Rectangle
                                            {...props}
                                            fill={props.fill}
                                            stroke={isHovered || isClicked ? "black" : "none"}
                                            strokeWidth={isHovered || isClicked ? 2 : 0}
                                        />
                                    );
                                }}
                            />
                            <Bar
                                dataKey="business"
                                stackId="a"
                                fill="var(--color-business)"
                                radius={[4, 4, 4, 4]}
                                label={{
                                    position: "top",
                                    offset: 12,
                                    className: "fill-foreground",
                                    fontWeight: 600,
                                    fontSize: 12
                                }}
                                onMouseEnter={(_, index) => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={(_, index) => handleActiveBar(index, chartData[index].category)}
                                shape={({ ...props }) => {
                                    const isHovered = hoveredIndex === props.index;
                                    const isClicked = clickedIndex === props.index;
                                    return (
                                        <Rectangle
                                            {...props}
                                            fill={props.fill}
                                            stroke={isHovered || isClicked ? "black" : "none"}
                                            strokeWidth={isHovered || isClicked ? 2 : 0}
                                        />
                                    );
                                }}
                            />
                            {/* {
                                chartData &&
                                <Bar
                                    dataKey="eventCount"
                                    radius={5}
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    onClick={(_, index) => handleActiveBar(index, chartData[index].category)}
                                    shape={({ ...props }) => {
                                        const isActive = activeIndex === props.index;
                                        return (
                                            <Rectangle
                                                {...props}
                                                fill={props.payload.fill} // Use the fill color from data
                                                stroke={isActive ? "black" : props.payload.fill}
                                                strokeWidth={isActive ? 2 : 0}
                                            />
                                        )
                                    }}
                                >
                                    <LabelList
                                        dataKey="eventCount"
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                        style={{ fontSize: 12, fontWeight: 600 }}
                                    />
                                </Bar>
                            } */}
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    )
}

export default TestChartComponent;