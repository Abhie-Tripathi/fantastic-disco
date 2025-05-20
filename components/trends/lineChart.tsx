"use client";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isEventeli } from "@/config";
import { columnsDropdown, EVENT_TYPE_GROUPS } from "@/data/trends";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
import { useTrendsService } from "@/services/trendsService";
import { TableGroupedHoliday } from "@/types";
import { EventResponse } from "@/types/events";
import { EventTrendsResponse } from "@/types/trends/trends";
import {
  generateDatesArray,
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  toMidnightISOString,
} from "@/utils/lineChart";
import { useQuery } from "@tanstack/react-query";
import { addDays, differenceInDays, format, isAfter } from "date-fns";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  LegendProps,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/types";
import Loading from "../ui/Loading";
import Disable from "/public/disable.svg";
import Text from "../new-ui/Text";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Button } from "../ui/button";

type ViewType = "day" | "week" | "month";

interface IProps {
  showLegend: boolean;
  holidayByDates?: TableGroupedHoliday[];
  doInvertTicks?: boolean;
  showThresholdLines?: boolean;
}

type CustomPayload = LegendProps["payload"] & { tooltipDescription?: string }[];

const LineChartComponent = ({
  showLegend,
  holidayByDates,
  doInvertTicks = false,
  showThresholdLines = true,
}: IProps) => {
  const [link, setLink] = useState("");
  const { setFilter, getFilterValue } = useFilterState();
  const currentView = getFilterValue("dateView") as ViewType || "day";

  const eventService = useEventsService();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { searchParams } = useDefaultFilters();
  const { getEventTrends } = useTrendsService();
  const compareFrom = searchParams.get("compare_from");
  const compareTo = searchParams.get("compare_to");
  const isMobileView = useIsMobile();
  const eventTypes = searchParams.get("eventTypes");
  const eventTypesArray = eventTypes ? eventTypes.split(",") : [];
  const hasHoliday =
    eventTypesArray.length > 0 ? eventTypesArray.includes("holiday") : false;
  const [eventTrendsData, setEventTrendsData] = useState<
    EventTrendsResponse | undefined
  >();
  const [predictedData, setPredictedData] = useState<any>();

  const { getEventsWithSearchParams } = useEventsService();
  const metric = getFilterValue("columns") as
    | "eventCount"
    | "predictedAttendance"
    | "inboundEstimate"
    | "internationalEstimate";

  const apiParams = useMemo(() => {
    const params = new URLSearchParams({
      groupBy: "date",
      dateView: currentView,
    });
    searchParams.forEach((value, key) => {
      if (key !== "dateView") {
        params.append(key, value);
      }
    });
    params.delete("categories");
    return params.toString();
  }, [currentView, searchParams]);

  const previousYearParams = useMemo(() => {
    const currentParams = new URLSearchParams(apiParams);

    if (compareFrom && compareTo) {
      currentParams.set("active_gte", compareFrom);
      currentParams.set("active_lte", compareTo);
      return currentParams.toString();
    }
    return "";
  }, [apiParams, compareFrom, compareTo]);

  const updatedParams = useMemo(() => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("eventTypes", "holiday");
    updatedSearchParams.delete("skip");
    return updatedSearchParams.toString();
  }, [searchParams]);

  const {
    data: trendsData,
    error,
    isLoading,
  } = useQuery<EventTrendsResponse | undefined>({
    queryKey: ["trends", apiParams.toString()],
    queryFn: () => getEventTrends(apiParams.toString()),
    enabled: !!apiParams.toString(),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const {
    data: previousYearData,
    error: previousYearError,
    isLoading: previousYearLoading,
  } = useQuery<EventTrendsResponse | undefined>({
    queryKey: ["trends-previous-year", previousYearParams],
    queryFn: () => getEventTrends(previousYearParams),
    enabled: !!previousYearParams && !!compareFrom && !!compareTo,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const { data: holdiayData } = useQuery({
    queryKey: ["holiday", updatedParams],
    queryFn: async () => await getEventsWithSearchParams(updatedParams),
    enabled: isEventeli && hasHoliday,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const groupedData = (holdiayData as EventResponse)?.events.reduce<
    Record<string, TableGroupedHoliday>
  >((acc, { basic }) => {
    const { startDateTime, name } = basic;
    if (!acc[startDateTime]) {
      acc[startDateTime] = { date: startDateTime, count: 0, holidays: [] };
    }
    acc[startDateTime].count++;
    acc[startDateTime].holidays.push(name);
    return acc;
  }, {});

  useEffect(() => {
    if (trendsData !== undefined) {
      setEventTrendsData(trendsData);
    }
  }, [trendsData]);

  useEffect(() => {
    if (eventTrendsData && eventTrendsData.groupedData) {
      const graphData = morphToGraphData(eventTrendsData.groupedData, metric);
      const previousYearGraphData = previousYearData
        ? morphToGraphData(previousYearData.groupedData, metric)
        : [];

      // Combine current and previous year data with proper date alignment
      const combinedData = graphData.map((currentItem) => {
        if (!compareFrom || !compareTo) {
          return currentItem;
        }

        // Get the date range for the current item
        const [startDate, endDate] = currentItem.date.split('_');
        const currentStartDate = new Date(startDate);
        const currentEndDate = new Date(endDate || startDate);

        // Calculate the relative position in the main range
        const mainStartDate = new Date(searchParams.get("active_gte") || "");
        const mainEndDate = new Date(searchParams.get("active_lte") || "");
        
        const mainRangePosition = (currentStartDate.getTime() - mainStartDate.getTime()) /
          (mainEndDate.getTime() - mainStartDate.getTime());

        // Calculate the corresponding date in the comparison range
        const compareStartDate = new Date(compareFrom);
        const compareEndDate = new Date(compareTo);
        
        const targetCompareDate = new Date(
          compareStartDate.getTime() +
          mainRangePosition * (compareEndDate.getTime() - compareStartDate.getTime())
        );

        // Find the closest week in previousYearGraphData
        const comparisonItem = previousYearGraphData.find((item) => {
          const [itemStartDate, itemEndDate] = item.date.split('_');
          const itemDate = new Date(itemStartDate);
          const itemEnd = new Date(itemEndDate || itemStartDate);
          
          // Check if the target date falls within this week
          return targetCompareDate >= itemDate && targetCompareDate <= itemEnd;
        });

        if (comparisonItem) {
          return {
            ...currentItem,
            previousYearTotal: comparisonItem.total,
            previousYearSocial: comparisonItem.social,
            previousYearBusiness: comparisonItem.business,
          };
        }

        return {
          ...currentItem,
          previousYearTotal: undefined,
          previousYearSocial: undefined,
          previousYearBusiness: undefined,
        };
      });

      setPredictedData(combinedData);
    }
  }, [
    eventTrendsData,
    previousYearData,
    metric,
    searchParams,
    compareFrom,
    compareTo,
  ]);

  useEffect(() => {
    if (trendsData === undefined) {
      setPredictedData(undefined);
    }
  }, [trendsData]);

  const tickFormatter = (value: any) => {
    if (typeof value !== "number" || isNaN(value)) return "";

    const absValue = Math.abs(value);

    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
      compactDisplay: "short",
    });

    return formatter.format(value);
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, index } = props;

    // Get the interval dates
    const intervalDates = generateDateIntervals(
      graphData[0].date,
      graphData[graphData.length - 1].date
    );

    // Check if the payload's date matches any of the interval dates
    const shouldRenderDot = intervalDates.includes(payload.date);

    const hasMatchingHoliday =
      (isEventeli &&
        holidayByDates &&
        holidayByDates.length > 0 &&
        holidayByDates?.some((holiday) => holiday.date === payload.date)) ||
      false;

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
          {hasMatchingHoliday && isEventeli && (
            <svg
              x={cx - 10} // Center horizontally
              y={cy - 35} // Raise it to appear above the circle
              width={20}
              height={20}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                d="M9 16.5C8.3 16.5 7.70833 16.2583 7.225 15.775C6.74167 15.2917 6.5 14.7 6.5 14C6.5 13.3 6.74167 12.7083 7.225 12.225C7.70833 11.7417 8.3 11.5 9 11.5C9.7 11.5 10.2917 11.7417 10.775 12.225C11.2583 12.7083 11.5 13.3 11.5 14C11.5 14.7 11.2583 15.2917 10.775 15.775C10.2917 16.2583 9.7 16.5 9 16.5ZM5 22C4.45 22 3.97933 21.8043 3.588 21.413C3.19667 21.0217 3.00067 20.5507 3 20V6C3 5.45 3.196 4.97934 3.588 4.588C3.98 4.19667 4.45067 4.00067 5 4H6V3C6 2.71667 6.096 2.47934 6.288 2.288C6.48 2.09667 6.71733 2.00067 7 2C7.28267 1.99934 7.52033 2.09534 7.713 2.288C7.90567 2.48067 8.00133 2.718 8 3V4H16V3C16 2.71667 16.096 2.47934 16.288 2.288C16.48 2.09667 16.7173 2.00067 17 2C17.2827 1.99934 17.5203 2.09534 17.713 2.288C17.9057 2.48067 18.0013 2.718 18 3V4H19C19.55 4 20.021 4.196 20.413 4.588C20.805 4.98 21.0007 5.45067 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.0217 21.805 19.5507 22.0007 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8Z"
                fill="#7D7D7D"
              />
            </svg>
          )}
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
          {hasMatchingHoliday && isEventeli && (
            <svg
              x={cx - 10}
              y={cy - 35}
              width={20}
              height={20}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                d="M9 16.5C8.3 16.5 7.70833 16.2583 7.225 15.775C6.74167 15.2917 6.5 14.7 6.5 14C6.5 13.3 6.74167 12.7083 7.225 12.225C7.70833 11.7417 8.3 11.5 9 11.5C9.7 11.5 10.2917 11.7417 10.775 12.225C11.2583 12.7083 11.5 13.3 11.5 14C11.5 14.7 11.2583 15.2917 10.775 15.775C10.2917 16.2583 9.7 16.5 9 16.5ZM5 22C4.45 22 3.97933 21.8043 3.588 21.413C3.19667 21.0217 3.00067 20.5507 3 20V6C3 5.45 3.196 4.97934 3.588 4.588C3.98 4.19667 4.45067 4.00067 5 4H6V3C6 2.71667 6.096 2.47934 6.288 2.288C6.48 2.09667 6.71733 2.00067 7 2C7.28267 1.99934 7.52033 2.09534 7.713 2.288C7.90567 2.48067 8.00133 2.718 8 3V4H16V3C16 2.71667 16.096 2.47934 16.288 2.288C16.48 2.09667 16.7173 2.00067 17 2C17.2827 1.99934 17.5203 2.09534 17.713 2.288C17.9057 2.48067 18.0013 2.718 18 3V4H19C19.55 4 20.021 4.196 20.413 4.588C20.805 4.98 21.0007 5.45067 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.0217 21.805 19.5507 22.0007 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8Z"
                fill="#7D7D7D"
              />
            </svg>
          )}
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
    if (hasMatchingHoliday) {
      return (
        <g>
          <svg
            x={cx - 10}
            y={cy - 10}
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 49 49"
            fill="none"
          >
            <rect x="1" y="1" width="47" height="47" rx="23.5" fill="#7D7D7D" />
            <rect
              x="1"
              y="1"
              width="47"
              height="47"
              rx="23.5"
              stroke="#E6E6E6"
              strokeWidth="2"
            />
            <path
              d="M20.5 30.125C19.625 30.125 18.8854 29.8229 18.2812 29.2187C17.6771 28.6146 17.375 27.875 17.375 27C17.375 26.125 17.6771 25.3854 18.2812 24.7813C18.8854 24.1771 19.625 23.875 20.5 23.875C21.375 23.875 22.1146 24.1771 22.7187 24.7813C23.3229 25.3854 23.625 26.125 23.625 27C23.625 27.875 23.3229 28.6146 22.7187 29.2187C22.1146 29.8229 21.375 30.125 20.5 30.125ZM15.5 37C14.8125 37 14.2242 36.7554 13.735 36.2662C13.2458 35.7771 13.0008 35.1884 13 34.5V17C13 16.3125 13.245 15.7242 13.735 15.235C14.225 14.7458 14.8133 14.5008 15.5 14.5H16.75V13.25C16.75 12.8958 16.87 12.5992 17.11 12.36C17.35 12.1208 17.6467 12.0008 18 12C18.3533 11.9992 18.6504 12.1192 18.8912 12.36C19.1321 12.6008 19.2517 12.8975 19.25 13.25V14.5H29.25V13.25C29.25 12.8958 29.37 12.5992 29.61 12.36C29.85 12.1208 30.1466 12.0008 30.5 12C30.8534 11.9992 31.1504 12.1192 31.3912 12.36C31.6321 12.6008 31.7516 12.8975 31.75 13.25V14.5H33C33.6875 14.5 34.2762 14.745 34.7662 15.235C35.2562 15.725 35.5009 16.3133 35.5 17V34.5C35.5 35.1875 35.2554 35.7762 34.7662 36.2662C34.2771 36.7562 33.6884 37.0009 33 37H15.5ZM15.5 34.5H33V22H15.5V34.5ZM15.5 19.5H33V17H15.5V19.5Z"
              fill="white"
            />
          </svg>
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
    const viewBound = searchParams.get("viewBound");
    const locationIds = searchParams.get("locationIds");
    const searchEventParams = new URLSearchParams({
      status: "active,cancelled,postponed",
      sortBy: "-visitors",
    });

    if (date) {
      searchEventParams.set("active_gte", date);
      searchEventParams.set("active_lte", date);
    }
    if (locationIds) {
      searchEventParams.set("locationIds", locationIds);
    }
    if (viewBound) {
      searchEventParams.set("viewBound", viewBound);
    }
    if (eventTypes && eventTypes.length > 0) {
      searchEventParams.set("eventTypes", eventTypes);
    }
    return searchEventParams.toString();
  };

  const generatePreviousYearParams = (date: string): string => {
    const searchEventParams = new URLSearchParams({
      status: "active,cancelled,postponed",
      sortBy: "-visitors",
    });

    if (compareFrom && compareTo) {
      // Calculate the relative position of the date within the main date range
      const mainStartDate = new Date(searchParams.get("active_gte") || "");
      const mainEndDate = new Date(searchParams.get("active_lte") || "");
      const currentDate = new Date(date);

      const compareStartDate = new Date(compareFrom);
      const compareEndDate = new Date(compareTo);

      // Calculate the relative position (0 to 1) of the current date in the main range
      const mainRangePosition =
        (currentDate.getTime() - mainStartDate.getTime()) /
        (mainEndDate.getTime() - mainStartDate.getTime());

      // Use this position to find the corresponding date in the comparison range
      const compareDate = new Date(
        compareStartDate.getTime() +
          mainRangePosition *
            (compareEndDate.getTime() - compareStartDate.getTime())
      );

      searchEventParams.set("active_gte", format(compareDate, "yyyy-MM-dd"));
      searchEventParams.set("active_lte", format(compareDate, "yyyy-MM-dd"));
    }

    const locationIds = searchParams.get("locationIds");
    const geoCoordinates = searchParams.get("viewBound");

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

  const [previousYearLink, setPreviousYearLink] = useState("");

  const handleChartClick = (e: CategoricalChartState) => {
    if (e.activeLabel) {
      const utcDate = new Date(e.activeLabel).toISOString();
      const link = setRedirectionLinkOnDate(utcDate);
      const prevYearLink = generatePreviousYearParams(e.activeLabel);
      setLink(link);
      setPreviousYearLink(prevYearLink);
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

  const generateViewAllEventsParams = useMemo(() => {
    const params = new URLSearchParams(link);
    params && params.delete("sortBy");
    return params;
  }, [link]);

  const { data: eventData, isLoading: iseventsLoading } = useQuery({
    queryKey: ["events", link],
    queryFn: () => eventService.getEventsWithSearchParams(link),
    enabled: !!link,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const { data: previousYearEventData, isLoading: isPreviouseventsLoading } =
    useQuery({
      queryKey: ["previous-year-events", previousYearLink],
      queryFn: () => eventService.getEventsWithSearchParams(previousYearLink),
      enabled: !!previousYearLink,
      refetchOnWindowFocus: false,
      gcTime: 0,
      staleTime: 0,
    });

  const threshold =
    (eventTrendsData && eventTrendsData.thresholds[metric]) ?? 0;
  const thresholdArea = [
    threshold * 1.5, // 5% above threshold
    threshold * 0.5, // 5% below threshold
  ];

  const handleViewChange = (view: ViewType) => {
    setFilter("dateView", view);
  };

  const formatDateForWeekView = (dateString: string) => {
    try {
      if (currentView === "month") {
        return format(new Date(dateString), 'MMM yyyy');
      }
      if (currentView === "week" && dateString.includes('_')) {
        const [startDate, endDate] = dateString.split('_');
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn('Invalid date in week view:', dateString);
          return dateString;
        }
        
        return `${format(start, 'dd MMM')} - ${format(end, 'dd MMM yyyy')}`;
      }
      // For day view
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return dateString;
      }
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const formattedDate = formatDateForWeekView(payload.value);
    
    // Split the date range for week view
    const dateLines = formattedDate.split(' - ');
    const isWeekView = currentView === "week" && dateLines.length > 1;
    const isMonthView = currentView === "month";

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
          {isWeekView ? (
            <>
              <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1em">
                {dateLines[0]}
              </tspan>
              <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1.3em">
                {dateLines[1]}
              </tspan>
            </>
          ) : isMonthView ? (
            <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1em">
              {formattedDate}
            </tspan>
          ) : (
            <>
              <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1em">
                {formattedDate.split(' ').slice(0, 2).join(' ')}
              </tspan>
              <tspan x={`${doInvertTicks ? -30 : 0}`} dy="1.3em">
                {formattedDate.split(' ')[2]}
              </tspan>
            </>
          )}
        </text>
      </g>
    );
  };

  function generateDateIntervals(startDate: string, endDate: string): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = differenceInDays(end, start) + 1;

    if (currentView === "month") {
      // For month view, return all month dates from the data
      return predictedData?.map((data: any) => data.date) || [];
    }

    if (currentView === "week") {
      // For week view, limit the number of ticks to avoid overlapping
      if (!predictedData) return [];
      
      const weekData = predictedData.map((data: any) => {
        // Handle both single dates and date ranges
        if (data.date.includes('_')) {
          return data.date;
        }
        return data.date;
      });
      
      const totalWeeks = weekData.length;
      
      // If 10 or fewer weeks, show all
      if (totalWeeks <= 10) {
        return weekData;
      }
      
      // For more weeks, show only 10 ticks
      const interval = Math.ceil(totalWeeks / 10);
      const selectedWeeks = weekData.filter((_: string, index: number) => index % interval === 0);
      
      // Always include the first and last week
      if (!selectedWeeks.includes(weekData[0])) {
        selectedWeeks.unshift(weekData[0]);
      }
      if (!selectedWeeks.includes(weekData[weekData.length - 1])) {
        selectedWeeks.push(weekData[weekData.length - 1]);
      }
      
      return selectedWeeks;
    }

    // For day view
    // If range is 10 days or less, show all dates
    if (totalDays <= 10) {
      const dates = [];
      for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(start, i);
        dates.push(format(currentDate, "yyyy-MM-dd"));
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

  const graphData =
    predictedData && predictedData.length > 0
      ? predictedData.map((data: any) => {
          if (currentView === "week") {
            return {
              ...data,
              date: data.date // Keep the week format as is
            };
          } else {
            // For day and month views, ensure we're using the correct date format
            const date = data.date.includes('_') ? data.date.split('_')[0] : data.date;
            return {
              ...data,
              date: format(new Date(date), "yyyy-MM-dd")
            };
          }
        })
      : generateDatesArray(
          searchParams.get("active_gte")?.split("T")[0] ?? "",
          searchParams.get("active_lte")?.split("T")[0] ?? ""
        ).map((date) => ({
          date: format(
            new Date(toMidnightISOString(date).split("T")[0]),
            "yyyy-MM-dd"
          ),
        }));

  const label =
    columnsDropdown.find((column) => column.value === metric)?.label ?? "";

  const CustomToolTip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (
      !payload ||
      !Array.isArray(payload) ||
      payload.length === 0 ||
      !isTooltipVisible
    ) {
      return null;
    }

    const tooltipPayload = payload[0]?.payload;
    if (!tooltipPayload) {
      return null;
    }

    const { date, total, previousYearTotal } = tooltipPayload;
    const matchingHoliday =
      holidayByDates && holidayByDates.find((holiday) => holiday.date === date);

    // Calculate comparison date based on relative position
    let comparisonDate = new Date(date);

    if (compareFrom && compareTo) {
      const mainStartDate = new Date(searchParams.get("active_gte") || "");
      const mainEndDate = new Date(searchParams.get("active_lte") || "");
      const currentDate = new Date(date);

      const compareStartDate = new Date(compareFrom);
      const compareEndDate = new Date(compareTo);

      // Calculate the relative position (0 to 1) of the current date in the main range
      const mainRangePosition =
        (currentDate.getTime() - mainStartDate.getTime()) /
        (mainEndDate.getTime() - mainStartDate.getTime());

      // Find the corresponding date in the comparison range
      comparisonDate = new Date(
        compareStartDate.getTime() +
          mainRangePosition *
            (compareEndDate.getTime() - compareStartDate.getTime())
      );
    }

    const hasSocial = eventTypes
      ?.split(",")
      .some((type) => EVENT_TYPE_GROUPS.Social.includes(type));
    const hasBusiness = eventTypes
      ?.split(",")
      .some((type) => EVENT_TYPE_GROUPS.Business.includes(type));

    // Current year event types
    const currentYearEventTypes = [];
    if (hasSocial && tooltipPayload.social !== undefined) {
      currentYearEventTypes.push({
        text: "Social",
        bg: "--social-color",
        value: tooltipPayload.social,
      });
    }
    if (hasBusiness && tooltipPayload.business !== undefined) {
      currentYearEventTypes.push({
        text: "Business",
        bg: "--business-color",
        value: tooltipPayload.business,
      });
    }

    // Previous year event types
    const previousYearEventTypes = [];
    if (compareFrom && compareTo) {
      if (hasSocial && tooltipPayload.previousYearSocial !== undefined) {
        previousYearEventTypes.push({
          text: "Social",
          bg: "--social-color",
          value: tooltipPayload.previousYearSocial,
        });
      }
      if (hasBusiness && tooltipPayload.previousYearBusiness !== undefined) {
        previousYearEventTypes.push({
          text: "Business",
          bg: "--business-color",
          value: tooltipPayload.previousYearBusiness,
        });
      }
    }

    return (
      <div
        className={`border-none shadow-lg bg-background ${
          compareFrom && compareTo ? "w-[600px]" : "w-[300px]"
        } z-10`}
      >
        <div
          className={`px-4 py-2 flex text-lg font-medium border-b ${
            compareFrom && compareTo ? "justify-between" : "justify-start"
          }`}
        >
          <span>{format(new Date(date), "d MMM yyyy")}</span>
          {compareFrom && compareTo && (
            <span className="text-[#4B9EF4]">
              {format(comparisonDate, "d MMM yyyy")}
            </span>
          )}
        </div>
        {isEventeli &&
          matchingHoliday &&
          matchingHoliday.holidays.length > 0 && (
            <div className="px-4 py-2 border-b">
              <p className="font-semibold text-[var(--primary-color)]">
                Holidays :
              </p>
              <ul
                className={`${
                  matchingHoliday.holidays.length > 1
                    ? "list-decimal"
                    : "list-none"
                } list-inside text-sm text-gray-600 dark:text-gray-300`}
              >
                {matchingHoliday.holidays.map((holidayName, index) => (
                  <li key={index}>{holidayName}</li>
                ))}
              </ul>
            </div>
          )}
        <div
          className={`grid ${
            compareFrom && compareTo ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Current Year Section */}
          <div className={compareFrom && compareTo ? "border-r" : ""}>
            {isEventeli && (
              <div className="px-4 py-2 border-b">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="font-semibold text-[#6750a4]">{total}</p>
                    <Text size="normal" color="secondary" fontWeight="regular">
                      {columnsDropdown.find((column) => column.value === metric)
                        ?.label ?? ""}
                    </Text>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col px-4 py-2 gap-2 border-b">
              {currentYearEventTypes.map((eventTypesValues) => (
                <div
                  key={eventTypesValues.text}
                  className="flex justify-between"
                >
                  <div className="flex gap-2">
                    <div
                      className={`bg-[var(${eventTypesValues.bg})] w-1 rounded-lg h-5`}
                    ></div>
                    <p
                      className={`font-semibold text-[var(${eventTypesValues.bg})]`}
                    >
                      {eventTypesValues.text} Events
                    </p>
                  </div>
                  <p
                    className={`font-semibold text-[var(${eventTypesValues.bg})]`}
                  >
                    {eventTypesValues.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-4 py-2">
              <p className="text-sm font-medium">TOP EVENTS</p>
              <ul className="flex flex-col gap-2 mt-4">
                {iseventsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin self-center" />
                ) : eventData && (eventData as any).events.length > 0 ? (
                  (eventData as any).events
                    .slice(0, 4)
                    .map((event: any, index: number) => {
                      const { basic } = event || {};
                      const { name, id } = basic || {};
                      return (
                        <li key={id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span className="text-[12px] font-semibold">
                              {index + 1}.
                            </span>
                          </div>
                          <p className="text-[#79747E] text-[12px] truncate whitespace-nowrap">
                            {name}
                          </p>
                        </li>
                      );
                    })
                ) : (
                  <p className="text-[#666666] text-sm flex items-center gap-2">
                    <Image src={Disable} alt="Disable" width={15} height={15} />
                    No events found.
                  </p>
                )}
              </ul>
            </div>
          </div>

          {/* Comparison Section */}
          {compareFrom && compareTo && (
            <div>
              {isEventeli && (
                <div className="px-4 py-2 border-b">
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="font-semibold text-[#4B9EF4]">
                        {previousYearTotal}
                      </p>
                      <Text
                        size="normal"
                        color="secondary"
                        fontWeight="regular"
                      >
                        {columnsDropdown.find(
                          (column) => column.value === metric
                        )?.label ?? ""}
                      </Text>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col px-4 py-2 gap-2 border-b">
                {previousYearEventTypes.map((eventTypesValues) => (
                  <div
                    key={eventTypesValues.text}
                    className="flex justify-between"
                  >
                    <div className="flex gap-2">
                      <div
                        className={`bg-[var(${eventTypesValues.bg})] w-1 rounded-lg h-5`}
                      ></div>
                      <p
                        className={`font-semibold text-[var(${eventTypesValues.bg})]`}
                      >
                        {eventTypesValues.text} Events
                      </p>
                    </div>
                    <p
                      className={`font-semibold text-[var(${eventTypesValues.bg})]`}
                    >
                      {eventTypesValues.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2">
                <p className="text-sm font-medium">TOP EVENTS</p>
                <ul className="flex flex-col gap-2 mt-4">
                  {isPreviouseventsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin self-center" />
                  ) : previousYearEventData &&
                    (previousYearEventData as any).events.length > 0 ? (
                    (previousYearEventData as any).events
                      .slice(0, 4)
                      .map((event: any, index: number) => {
                        const { basic } = event || {};
                        const { name, id } = basic || {};
                        return (
                          <li key={id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-[12px] font-semibold">
                                {index + 1}.
                              </span>
                            </div>
                            <p className="text-[#79747E] text-[12px] truncate whitespace-nowrap">
                              {name}
                            </p>
                          </li>
                        );
                      })
                  ) : (
                    <p className="text-[#666666] text-sm flex items-center gap-2">
                      <Image
                        src={Disable}
                        alt="Disable"
                        width={15}
                        height={15}
                      />
                      No historical events found
                    </p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div
          className={`grid ${
            compareFrom && compareTo ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <Link
            href={`/internal/search/events?${generateViewAllEventsParams.toString()}`}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold text-[var(--primary-color)] cursor-pointer ${
              compareFrom && compareTo ? "border-r" : ""
            }`}
          >
            VIEW ALL
            <ArrowUpRight height={18} width={18} stroke="#6750a4" />
          </Link>
          {compareFrom && compareTo && (
            <Link
              href={`/internal/search/events?${previousYearLink}`}
              className="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-[#4B9EF4] cursor-pointer"
            >
              VIEW ALL
              <ArrowUpRight height={18} width={18} stroke="#4B9EF4" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  const CustomLegend = ({ payload }: { payload?: any[] }) => {
    // Get the comparison option label - we'll use a generic name regardless of the comparison type
    const comparisonLabel = "Compared Period";

    // Separate year entries from threshold entries
    const yearEntries =
      payload?.filter(
        (entry) =>
          entry.id === "current_year" ||
          (compareFrom && compareTo && entry.id === "previous_year")
      ) || [];

    const thresholdEntries =
      payload?.filter(
        (entry) => entry.id !== "current_year" && entry.id !== "previous_year"
      ) || [];

    return (
      <div className="flex flex-col items-end gap-4">
        {/* Year entries row */}
        <div className="flex gap-5 items-center">
          {yearEntries.map((entry, index) => {
            if (entry.id === "previous_year") {
              entry.value = comparisonLabel;
            }
            return (
              <div
                key={`year-item-${index}`}
                className="flex items-center gap-2"
              >
                <div
                  className="w-4 h-0 border-t-2"
                  style={{
                    borderColor: entry.color,
                  }}
                ></div>
                <TooltipProvider>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`cursor-pointer text-sm font-medium`}
                        style={{
                          color: entry.color,
                        }}
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
            );
          })}
        </div>

        {/* Threshold entries row */}
        <div className="flex gap-5 items-center">
          {thresholdEntries.map((entry, index) => (
            <div
              key={`threshold-item-${index}`}
              className="flex items-center gap-2"
            >
              <div
                className="w-4 h-0 border-t-2"
                style={{
                  borderColor: entry.color,
                  borderStyle:
                    entry.id === "upper_threshold" ||
                    entry.id === "lower_threshold"
                      ? "dashed"
                      : "solid",
                }}
              ></div>
              <TooltipProvider>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`cursor-pointer text-sm font-medium`}
                      style={{
                        color: entry.color,
                      }}
                    >
                      {isMobileView && entry.value.length > 10
                        ? entry.value === "Upper Threshold"
                          ? "Upper"
                          : entry.value === "Lower Threshold"
                          ? "Lower"
                          : entry.value
                        : entry.value}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    className={`${
                      isMobileView ? "w-48" : "w-60"
                    } tooltip-content-styles`}
                  >
                    <p className="font-medium text-[var(--secondary-text-color)]">
                      {entry.tooltipDescription}
                    </p>
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading || (compareFrom && compareTo && previousYearLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error.message}</p>
      </div>
    );
  }

  if (eventData && (eventData as any).events.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
          No events found. Try expanding your preferences by selecting more
          categories, products, or topics.
        </p>
      </div>
    );
  }

  return (
    <div ref={chartRef}>
      <div className="flex justify-start gap-2 mb-4">
        <Button
          variant={currentView === "day" ? "default" : "outline"}
          onClick={() => handleViewChange("day")}
          size="sm"
        >
          Day
        </Button>
        <Button
          variant={currentView === "week" ? "default" : "outline"}
          onClick={() => handleViewChange("week")}
          size="sm"
        >
          Week
        </Button>
        <Button
          variant={currentView === "month" ? "default" : "outline"}
          onClick={() => handleViewChange("month")}
          size="sm"
        >
          Month
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={graphData}
          margin={{
            left: isMobileView ? -10 : 10,
            right: isMobileView ? 0 : 30,
            top: isMobileView ? 20 : 40,
            bottom: isMobileView ? 40 : doInvertTicks ? 30 : 0,
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
            fontSize={isMobileView ? "10px" : "12px"}
            height={isMobileView ? 30 : 40}
            tick={<CustomTick />}
            ticks={generateDateIntervals(
              graphData[0].date,
              graphData[graphData.length - 1].date
            )}
            interval={0}
            width={10}
            axisLine={false}
            tickLine={isMobileView ? false : true}
            padding={{
              left: isMobileView ? 0 : 10,
              right: isMobileView ? 0 : 10,
            }}
            label={{
              style: { fill: "#615E83" },
            }}
          />
          <YAxis
            dataKey="total"
            fontSize="12px"
            width={isMobileView ? 50 : 70}
            domain={[
              () => {
                if (!graphData || graphData.length === 0) return 0;

                const validTotals = graphData
                  .map((item: any) => item.total)
                  .filter(
                    (val: any) =>
                      val !== undefined && val !== null && !isNaN(val)
                  );
                const validPrevYears = graphData
                  .map((item: any) => item.previousYearTotal)
                  .filter(
                    (val: any) =>
                      val !== undefined && val !== null && !isNaN(val)
                  );

                if (validTotals.length === 0 && validPrevYears.length === 0)
                  return 0;

                const minTotal =
                  validTotals.length > 0 ? Math.min(...validTotals) : 0;
                const minPreviousYear =
                  validPrevYears.length > 0 ? Math.min(...validPrevYears) : 0;
                const minValue = Math.min(minTotal, minPreviousYear, 0);
                const maxTotal =
                  validTotals.length > 0 ? Math.max(...validTotals) : 0;
                const maxPreviousYear =
                  validPrevYears.length > 0 ? Math.max(...validPrevYears) : 0;
                const overallMax = Math.max(maxTotal, maxPreviousYear, 1); // Ensure at least 1 for non-zero range
                const paddedMax = overallMax * 1.1; // Add 10% padding

                const range = Math.max(paddedMax - minValue, 1); // Ensure non-zero range
                const idealTickSize = range / 4;

                const magnitude = Math.pow(
                  10,
                  Math.floor(Math.log10(idealTickSize))
                );
                let roundedTickSize = magnitude;
                if (idealTickSize / magnitude >= 5)
                  roundedTickSize = magnitude * 5;
                else if (idealTickSize / magnitude >= 2)
                  roundedTickSize = magnitude * 2;

                return Math.floor(minValue / roundedTickSize) * roundedTickSize;
              },
              () => {
                if (!graphData || graphData.length === 0) return 100;

                const validTotals = graphData
                  .map((item: any) => item.total)
                  .filter(
                    (val: any) =>
                      val !== undefined && val !== null && !isNaN(val)
                  );
                const validPrevYears = graphData
                  .map((item: any) => item.previousYearTotal)
                  .filter(
                    (val: any) =>
                      val !== undefined && val !== null && !isNaN(val)
                  );

                if (validTotals.length === 0 && validPrevYears.length === 0)
                  return 100;

                const minTotal =
                  validTotals.length > 0 ? Math.min(...validTotals) : 0;
                const minPreviousYear =
                  validPrevYears.length > 0 ? Math.min(...validPrevYears) : 0;
                const minValue = Math.min(minTotal, minPreviousYear, 0);
                const maxTotal =
                  validTotals.length > 0 ? Math.max(...validTotals) : 0;
                const maxPreviousYear =
                  validPrevYears.length > 0 ? Math.max(...validPrevYears) : 0;
                const overallMax = Math.max(maxTotal, maxPreviousYear, 1); // Ensure at least 1 for non-zero range
                const paddedMax = overallMax * 1.1; // Add 10% padding

                const range = Math.max(paddedMax - minValue, 1); // Ensure non-zero range
                const idealTickSize = range / 4;

                const magnitude = Math.pow(
                  10,
                  Math.floor(Math.log10(idealTickSize))
                );
                let roundedTickSize = magnitude;
                if (idealTickSize / magnitude >= 5)
                  roundedTickSize = magnitude * 5;
                else if (idealTickSize / magnitude >= 2)
                  roundedTickSize = magnitude * 2;

                return Math.ceil(paddedMax / roundedTickSize) * roundedTickSize;
              },
            ]}
            tickCount={5}
            tickFormatter={tickFormatter}
            label={
              isMobileView
                ? undefined
                : {
                    value: label,
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#7D7D7D" },
                    fontSize: "14px",
                  }
            }
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#615E83",
              fontSize: isMobileView ? "10px" : "14px",
              fontWeight: isMobileView ? "400" : "500",
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
            <>
              <ReferenceLine
                y={thresholdArea[0]}
                stroke="#398E4A"
                strokeDasharray="12 12"
                label={{
                  position: "insideBottomRight",
                  className: "text-[#398E4A]",
                  style: {
                    fill: "#398E4A",
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  dy: -8,
                }}
              />
              <ReferenceLine
                y={threshold}
                stroke="#DF2670"
                label={{
                  position: "insideTopRight",
                  className: "text-[#DF2670]",
                  style: {
                    fill: "#DF2670",
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  dy: 0,
                }}
              />
              <ReferenceLine
                y={thresholdArea[1]}
                stroke="#FF990A"
                strokeDasharray="12 12"
                label={{
                  position: "insideTopRight",
                  className: "text-[#FF990A]",
                  style: {
                    fill: "#FF990A",
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  dy: 8,
                }}
              />
            </>
          )}
          <Line
            type="linear"
            dataKey="total"
            name="Selected Period"
            stroke="#6750a4"
            strokeWidth={2}
            strokeOpacity={1}
            connectNulls={true}
            dot={<CustomDot />}
          />
          {compareFrom && compareTo && (
            <Line
              type="linear"
              dataKey="previousYearTotal"
              name="Compared Period"
              stroke="#4B9EF4"
              strokeWidth={2}
              strokeOpacity={1}
              connectNulls={true}
              dot={false}
            />
          )}
          {showLegend && (
            <Legend
              content={<CustomLegend />}
              payload={
                [
                  {
                    value: "Selected Period",
                    type: "line",
                    id: "current_year",
                    color: "#6750a4",
                    tooltipDescription: "Data for the current selected period",
                  },
                  {
                    value: "Compared Period",
                    type: "line",
                    id: "previous_year",
                    color: "#4B9EF4",
                    tooltipDescription: "Data for the comparison period",
                  },
                  ...(showThresholdLines
                    ? [
                        {
                          value: "Upper Threshold",
                          type: "line",
                          id: "upper_threshold",
                          color: "#398E4A",
                          tooltipDescription:
                            "Represents the maximum boundary relative to the average value for this trend.",
                          strokeDasharray: "12 12",
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
                          type: "line",
                          id: "lower_threshold",
                          color: "#FF990A",
                          tooltipDescription:
                            "Represents the minimum boundary relative to the average value for this trend.",
                          strokeDasharray: "12 12",
                        },
                      ]
                    : []),
                ] as CustomPayload
              }
              wrapperStyle={
                isMobileView
                  ? {
                      width: "100%",
                      position: "relative",
                      bottom: -5,
                      left: 0,
                      fontSize: "12px",
                      fontWeight: "400",
                      display: "flex",
                      justifyContent: "center",
                    }
                  : {
                      width: "auto",
                      top: -30,
                      right: 0,
                      fontSize: "14px",
                      fontWeight: "500",
                    }
              }
              verticalAlign={isMobileView ? "bottom" : "top"}
              align={isMobileView ? "center" : "right"}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
