"use client";
import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceArea,
  CartesianGrid,
  Rectangle,
  Legend,
  LegendProps,
} from "recharts";
import { addDays, isAfter } from "date-fns";
import { format, parse, differenceInDays } from "date-fns";
import Text from "../new-ui/Text";
import { TooltipProps } from "recharts";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { columnsDropdown } from "@/data/trends";
import { CategoricalChartState } from "recharts/types/chart/types";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import Disable from "/public/disable.svg";
import Image from "next/image";
import { generateDatesArray, toMidnightISOString } from "@/utils/lineChart";
import { TableGroupedHoliday } from "@/types";
import HolidayIcon from "/public/eventType/holiday.svg";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IProps {
  predictedData: any;
  selectedEventType: string;
  threshold: number;
  showLegend: boolean;
  doInvertTicks?: boolean;
  showThresholdLines?: boolean;
}

type CustomPayload = LegendProps["payload"] & { tooltipDescription?: string }[];

const LineChartComponent = ({
  predictedData,
  selectedEventType,
  threshold,
  showLegend,
  doInvertTicks = false,
  showThresholdLines = true,
}: IProps) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const locationIds = searchParams.get("locationIds");
  const eventTypes = searchParams.get("eventTypes");
  const [link, setLink] = useState("");
  const eventService = useEventsService();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const thresholdArea = [
    threshold * 1.5, // 5% above threshold
    threshold * 0.5, // 5% below threshold
  ];

  const [dragging, setDragging] = useState(false);
  const [linePosition, setLinePosition] = useState(300); // Initial Y position of the line

  // Handle drag start
  const handleDragStart = (e: any) => {
    setDragging(true);
  };

  // Handle drag move
  const handleDrag = (e: any) => {
    if (dragging) {
      const chartHeight = e.currentTarget.getBoundingClientRect().height;
      const mouseY = e.clientY - e.currentTarget.getBoundingClientRect().top;

      // Calculate the new value based on the chart height
      const newValue = Math.max(
        0,
        Math.min((1 - mouseY / chartHeight) * 500, 500)
      ); // Adjust min/max values as per your data
      setLinePosition(newValue);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDragging(false);
  };

  // const tickFormatter = (value: any) => {
  //   if (value >= 1000) {
  //     return Math.round(value / 1000) + "k";
  //   }
  //   return String(Math.round(value));
  // };

  const tickFormatter = (value: any) => {
    if (value >= 1e9) {
      return `${value / 1e9}B`;
      // return `${Math.round(value / 1e9)}B`;
    } else if (value >= 1e6) {
      return `${value / 1e6}M`;
      // return `${Math.round(value / 1e6)}M`;
    } else if (value >= 1e3) {
      return `${Math.round(value / 1e3)}k`;
    }
    return value.toString();
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, index } = props;

    // Get the interval dates
    const intervalDates = generateDateIntervals(
      graphData[0].date,
      graphData[graphData.length - 1].date
    );

    // Check if the payload's date matches any of the interval dates
    const shouldRenderDot = intervalDates.includes(
      format(new Date(payload.date), "yyyy-MM-dd")
    );

    if (shouldRenderDot && payload.total < thresholdArea[1]) {
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="#E1313A1F"
            stroke="#E1313A"
            strokeWidth={2}
          />
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill="#E1313A"
            stroke="#E1313A"
            strokeWidth={2}
          />
        </g>
      );
    }
    if (shouldRenderDot && payload.total > thresholdArea[0]) {
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="#D2E7BF"
            stroke="#16A54F"
            strokeWidth={2}
          />
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill="#16A54F"
            stroke="#16A54F"
            strokeWidth={2}
          />
        </g>
      );
    }

    return null;
  };

  const [tooltipData, setTooltipData] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chartRef.current &&
        !chartRef.current.contains(event.target as Node)
      ) {
        setTooltipVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setRedirectionLinkOnDate = (date: string): string => {
    const geoCoordinates = params.get("geoCoordinates");
    const locationIds = params.get("locationIds");
    const searchEventParams = new URLSearchParams({
      status: "active,cancelled,postponed",
    });

    if (date) {
      searchEventParams.set("active_gte", date);
      searchEventParams.set("active_lte", date);
    }
    if (locationIds) {
      searchEventParams.set("locationIds", locationIds);
    }
    if (geoCoordinates) {
      searchEventParams.set("geoCoordinates", geoCoordinates);
    }
    if (eventTypes && eventTypes.length > 0) {
      searchEventParams.set("eventTypes", eventTypes);
    }
    return searchEventParams.toString();
  };

  const handleChartClick = (e: CategoricalChartState) => {
    if (e.activeLabel) {
      const utcDate = new Date(e.activeLabel).toISOString();
      const link = setRedirectionLinkOnDate(utcDate);
      setLink(link);
      if (e.activePayload && e.activePayload.length > 0) {
        const { payload } = e.activePayload[0];
        setTooltipData(payload);
        setTooltipVisible(true);
      } else {
        setTooltipVisible(false);
      }
    } else {
      setTooltipVisible(false);
    }
  };

  const {
    data: eventData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["events", link],
    queryFn: () =>
      eventService.getEventsWithSearchParams(link + "&sortBy=-visitors"),
    enabled: !!link,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  function generateDateIntervals(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = differenceInDays(end, start) + 1;

    // If range is 10 days or less, show all dates
    if (totalDays <= 10) {
      const dates = [];
      for (let i = 0; i < totalDays; i++) {
        dates.push(format(addDays(start, i), "yyyy-MM-dd"));
      }
      return dates;
    }

    // For more than 10 days, calculate intervals
    const interval = Math.floor(totalDays / 10);
    const remainder = totalDays % 10;
    const dates = [format(start, "yyyy-MM-dd")];

    let currentDate = start;

    // Generate dates based on interval, adjusting for remainder
    for (let i = 1; i <= 9; i++) {
      currentDate = addDays(
        currentDate,
        interval + (i === 9 && remainder > 0 ? remainder : 0)
      );
      if (!isAfter(currentDate, end)) {
        dates.push(format(currentDate, "yyyy-MM-dd"));
      }
    }

    // Ensure the last date is included
    if (dates[dates.length - 1] !== format(end, "yyyy-MM-dd")) {
      dates.push(format(end, "yyyy-MM-dd"));
    }

    return dates;
  }

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const date = new Date(payload.value);
    const dayMonth = format(date, "dd MMM");
    const year = format(date, "yyyy");

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={doInvertTicks ? -10 : 0}
          dy={16}
          textAnchor="middle"
          fill="#615E83"
          fontSize="14px"
          fontWeight="500"
          transform={`${doInvertTicks ? "rotate(-90)" : ""}`}
        >
          <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1em">
            {dayMonth}
          </tspan>
          <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1.3em">
            {year}
          </tspan>
        </text>
      </g>
    );
  };

  const graphData =
    predictedData.length > 0
      ? predictedData.map((data: any) => ({
          ...data,
        }))
      : generateDatesArray(
          searchParams.get("active_gte")?.split("T")[0] ?? "",
          searchParams.get("active_lte")?.split("T")[0] ?? ""
        ).map((date) => ({
          date: format(
            new Date(toMidnightISOString(date).split("T")[0]),
            "d MMM yyyy"
          ),
        }));

  const label =
    columnsDropdown.find((column) => column.value === selectedEventType)
      ?.label ?? "";

  const CustomToolTip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (payload && payload.length === 0) {
      return;
    }
    if (!isTooltipVisible) {
      return null;
    }
    const { date, total, social, business } = payload && payload[0].payload;
    return (
      <div className="border-none shadow-lg bg-[#ffffff] w-72 z-10">
        <div className="px-4 py-2 flex text-lg font-medium border-b">
          {format(date, "d MMM yyyy")}
        </div>
        <div className="px-4 py-2 border-b">
          <p className="font-semibold text-[var(--primary-color)]">{total}</p>
          <Text size="normal" color="secondary" fontWeight="regular">
            {columnsDropdown.find(
              (column) => column.value === selectedEventType
            )?.label ?? ""}
          </Text>
        </div>
        <div className="flex flex-col px-4 py-2 gap-2 border-b">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-[var(--business-color)] w-1 rounded-lg h-5"></div>
              <p className="font-semibold text-[var(--business-color)]">
                Business Events
              </p>
            </div>
            <p className="font-semibold text-[var(--business-color)]">
              {business}
            </p>
          </div>
        </div>
        <div className="px-4 py-2">
          <p className="text-sm font-medium">TOP EVENTS</p>
          <ul className="flex flex-col gap-2 mt-4">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin self-center" />
            ) : eventData && (eventData as any).events.length > 0 ? (
              (eventData as any).events
                .slice(0, 4)
                .map((event: any, index: number) => (
                  <li key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] font-semibold">
                        {/* {event.} */}
                        {index + 1}.
                      </span>
                      {/* <span className="text-[12px] text-[#79747E]">EIS</span> */}
                    </div>
                    <p className="text-[#79747E] text-[12px] truncate whitespace-nowrap">
                      {event.name}
                    </p>
                  </li>
                ))
            ) : (
              <p className="text-[#666666] text-sm flex items-center gap-2">
                <Image src={Disable} alt="Disable" width={15} height={15} />
                No events found
              </p>
            )}
          </ul>
        </div>
        <Link
          href={`/internal/search/events?${link}`}
          className="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-[var(--primary-color)] cursor-pointer"
        >
          VIEW ALL
          <ArrowUpRight height={18} width={18} stroke="#6750a4" />
        </Link>
      </div>
    );
  };

  const CustomLegend = ({ payload }: { payload?: any[] }) => {
    return (
      <div className="flex gap-5 items-center justify-end w-fit">
        {payload &&
          payload.map((entry, index) => (
            <div
              key={`legend-item-${index}`}
              className="flex items-center gap-2"
            >
              <div
                className={`w-2 h-2 rounded-full`}
                style={{
                  backgroundColor: entry.color,
                }}
              ></div>
              {/* <span
                className={`text-sm font-medium ${`text-[${entry.color}]`}`}
              >
                {entry.value}
              </span> */}
              <TooltipProvider>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`cursor-pointer text-sm font-medium ${`text-[${entry.color}]`}`}
                    >
                      {entry.value}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="w-60 tooltip-content-styles">
                    <p className="font-medium text-[var(--secondary-text-color)]">
                      {entry.tooltipDescription}
                    </p>
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div ref={chartRef}>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={graphData}
          margin={{
            left: 10,
            right: 30,
            top: 40,
            bottom: doInvertTicks ? 30 : 0,
          }}
          onClick={(e) => handleChartClick(e)}
        >
          <defs>
            <linearGradient id="eventChange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            fontSize="12px"
            height={40}
            tick={<CustomTick />}
            ticks={generateDateIntervals(
              graphData[0].date,
              graphData[graphData.length - 1].date
            )}
            interval={0}
            width={10}
            axisLine={false}
            tickLine={true}
            label={{
              style: { fill: "#615E83" },
            }}
          />
          <YAxis
            dataKey="total"
            fontSize="12px"
            width={70}
            domain={["auto", "auto"]}
            tickCount={5}
            tickFormatter={tickFormatter}
            label={{
              value: label,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#7D7D7D" },
              fontSize: "14px",
            }}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#615E83",
              fontSize: "14px",
              fontWeight: "500",
            }}
          />
          <Tooltip
            content={<CustomToolTip />}
            trigger="click"
            wrapperStyle={{ pointerEvents: "auto" }}
          />
          {showThresholdLines && (
            <ReferenceArea
              y1={thresholdArea[0]}
              y2={thresholdArea[1]}
              fill="#FAEFE2"
            />
          )}
          {threshold && threshold > 0 && showThresholdLines && (
            <ReferenceLine
              y={thresholdArea[0]}
              stroke="#398E4A"
              strokeDasharray="12 12"
              label={{
                position: "insideBottomRight",
                className: "text-[#398E4A]",
                // value: "UPPER THRESHOLD",
                style: {
                  fill: "#398E4A",
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                dy: -8,
              }}
            />
          )}

          {threshold && threshold > 0 && showThresholdLines && (
            <ReferenceLine
              y={threshold}
              stroke="#DF2670"
              label={{
                position: "insideTopRight",
                className: "text-[#DF2670]",
                // value: "AVERAGE",
                style: {
                  fill: "#DF2670",
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                dy: 0,
              }}
            />
          )}
          {/* <svg
            x="800" // Adjust X position
            y={400 - linePosition - 1} // Adjust Y position based on line
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="steelblue"
              stroke="white"
              strokeWidth="2"
              cursor="pointer"
              z={200}
            />
          </svg> */}
          {threshold && threshold > 0 && showThresholdLines && (
            <ReferenceLine
              y={thresholdArea[1]}
              stroke="#FF990A"
              strokeDasharray="12 12"
              label={{
                position: "insideTopRight",
                className: "text-[#FF990A]",
                // value: "LOWER THRESHOLD",
                style: {
                  fill: "#FF990A",
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                dy: 8,
              }}
            />
          )}
          <Area
            type="linear"
            dataKey="total"
            stroke="#6750a4"
            strokeWidth={2}
            strokeOpacity={1}
            fillOpacity={0.2}
            connectNulls={true}
            fill="#8884d8"
            dot={<CustomDot />}
          />
          {showLegend && (
            <Legend
              content={<CustomLegend />}
              payload={
                [
                  {
                    value: "Upper Threshold",
                    type: "circle",
                    id: "upper_threshold",
                    color: "#398E4A",
                    tooltipDescription:
                      "Represents the maximum boundary relative to the average value for this trend.",
                  },
                  {
                    value: "Average",
                    type: "circle",
                    id: "average",
                    color: "#DF2670",
                    tooltipDescription:
                      "The unique average value for the trend based on the selected location.",
                  },
                  {
                    value: "Lower Threshold",
                    type: "circle",
                    id: "lower_threshold",
                    color: "#FF990A",
                    tooltipDescription:
                      "Represents the minimum boundary relative to the average value for this trend.",
                  },
                ] as CustomPayload
              }
              wrapperStyle={{
                width: "auto",
                top: -30,
                right: 0,
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
