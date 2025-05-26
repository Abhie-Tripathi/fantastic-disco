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
import {
  useRouter,
  useSearchParams,
  ReadonlyURLSearchParams,
} from "next/navigation";
import React from "react";

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
  const { getFilterValue } = useFilterState();
  const metrics = (getFilterValue("columns") as string)?.split(",") || [];

  // Define which metrics share the right axis
  const rightAxisMetrics = [
    "predictedAttendance",
    "inboundEstimate",
    "internationalEstimate",
  ] as const;
  type MetricType = (typeof rightAxisMetrics)[number] | "eventCount";

  // Separate metrics by axis
  const leftAxisMetric = metrics.find((m) => m === "eventCount") as
    | MetricType
    | undefined;
  const activeRightAxisMetrics = metrics.filter((m) =>
    rightAxisMetrics.includes(m as (typeof rightAxisMetrics)[number])
  ) as MetricType[];

  // Get labels for all active metrics
  const metricLabels = metrics.reduce((acc, metric) => {
    const label =
      columnsDropdown.find((column) => column.value === metric)?.label ??
      metric;
    if (
      rightAxisMetrics.includes(metric as (typeof rightAxisMetrics)[number]) ||
      metric === "eventCount"
    ) {
      acc[metric as MetricType] = label;
    }
    return acc;
  }, {} as Record<MetricType, string>);

  const primaryMetric = leftAxisMetric as
    | "eventCount"
    | "predictedAttendance"
    | "inboundEstimate"
    | "internationalEstimate";
  const secondaryMetric = activeRightAxisMetrics[0] as
    | "eventCount"
    | "predictedAttendance"
    | "inboundEstimate"
    | "internationalEstimate"
    | undefined;

  const primaryLabel = metricLabels[primaryMetric];
  const secondaryLabel = secondaryMetric ? metricLabels[secondaryMetric] : "";

  const stringParams = `groupBy=date&dateView=day&${searchParams.toString()}`;

  const apiParams = useMemo(() => {
    const params = new URLSearchParams({
      groupBy: "date",
      dateView: "day",
    });
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    params.delete("categories");
    return params.toString();
  }, [stringParams]);

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
      const graphData = morphToGraphData(eventTrendsData.groupedData, metrics);
      const previousYearGraphData = previousYearData
        ? morphToGraphData(previousYearData.groupedData, metrics)
        : [];

      // Combine current and previous year data with proper date alignment
      const combinedData = graphData.map((currentItem, index) => {
        if (!compareFrom || !compareTo) {
          return currentItem;
        }

        // Calculate the relative position (0 to 1) of the current date in the main range
        const mainStartDate = new Date(searchParams.get("active_gte") || "");
        const mainEndDate = new Date(searchParams.get("active_lte") || "");
        const currentDate = new Date(currentItem.date);

        const compareStartDate = new Date(compareFrom);
        const compareEndDate = new Date(compareTo);

        const mainRangePosition =
          (currentDate.getTime() - mainStartDate.getTime()) /
          (mainEndDate.getTime() - mainStartDate.getTime());

        // Find the corresponding date in the comparison range
        const targetCompareDate = new Date(
          compareStartDate.getTime() +
            mainRangePosition *
              (compareEndDate.getTime() - compareStartDate.getTime())
        );

        // Find the closest date in previousYearGraphData
        const comparisonItem = previousYearGraphData.find((item) => {
          const itemDate = new Date(item.date);
          // Allow for a small tolerance (same day)
          return (
            Math.abs(itemDate.getTime() - targetCompareDate.getTime()) <
            24 * 60 * 60 * 1000
          );
        });

        if (comparisonItem) {
          // Create a new object with all current metrics
          const result = { ...currentItem };

          // Add previous year data for all metrics
          metrics.forEach((metric) => {
            result[`previousYear${metric}`] = comparisonItem[metric];

            // Handle social and business breakdowns if they exist
            if (comparisonItem[`social${metric}`] !== undefined) {
              result[`previousYearSocial${metric}`] =
                comparisonItem[`social${metric}`];
            }
            if (comparisonItem[`business${metric}`] !== undefined) {
              result[`previousYearBusiness${metric}`] =
                comparisonItem[`business${metric}`];
            }
          });

          // Add general social and business data if they exist
          if (comparisonItem.social !== undefined) {
            result.previousYearSocial = comparisonItem.social;
          }
          if (comparisonItem.business !== undefined) {
            result.previousYearBusiness = comparisonItem.business;
          }

          return result;
        }

        return currentItem;
      });

      // Only update state if the data has actually changed
      if (JSON.stringify(combinedData) !== JSON.stringify(predictedData)) {
        setPredictedData(combinedData);
      }
    }
  }, [
    eventTrendsData?.groupedData,
    previousYearData?.groupedData,
    metrics,
    compareFrom,
    compareTo,
    searchParams.get("active_gte"),
    searchParams.get("active_lte"),
  ]);

  // Remove the separate useEffect for trendsData
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

    // Don't render custom dot if multiple metrics are selected or comparison is enabled
    if (metrics.length > 1 || (compareFrom && compareTo)) {
      return null;
    }

    // Get the interval dates
    const intervalDates = generateDateIntervals(
      graphData[0].date,
      graphData[graphData.length - 1].date
    );

    // Check if the payload's date matches any of the interval dates
    const shouldRenderDot = intervalDates.includes(
      format(new Date(payload.date), "yyyy-MM-dd")
    );

    const hasMatchingHoliday =
      (isEventeli &&
        holidayByDates &&
        holidayByDates.length > 0 &&
        holidayByDates?.some((holiday) => holiday.date === payload.date)) ||
      false;

    const total = payload.business + payload.social;

    if (shouldRenderDot && total < thresholdArea[1]) {
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
    if (shouldRenderDot && total > thresholdArea[0]) {
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
    (eventTrendsData &&
      eventTrendsData.thresholds[
        primaryMetric as keyof typeof eventTrendsData.thresholds
      ]) ??
    0;
  const thresholdArea = [
    threshold * 1.5, // 5% above threshold
    threshold * 0.5, // 5% below threshold
  ];

  function generateDateIntervals(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = differenceInDays(end, start) + 1;

    // For mobile screens, show exactly 6 ticks
    if (isMobileView) {
      const dates = [];
      dates.push(format(start, "yyyy-MM-dd")); // First date

      // Calculate an even interval for 4 middle points
      const step = Math.max(1, Math.floor(totalDays / 5));

      // Add 4 evenly spaced points (for a total of 6 with start and end)
      for (let i = 1; i <= 4; i++) {
        const nextDate = addDays(start, i * step);
        if (!isAfter(nextDate, end)) {
          dates.push(format(nextDate, "yyyy-MM-dd"));
        }
      }

      // Add end date if not already included
      const lastDateStr = format(end, "yyyy-MM-dd");
      if (dates[dates.length - 1] !== lastDateStr) {
        dates.push(lastDateStr);
      }

      return dates;
    }

    // Desktop view - improved logic for consistent intervals
    if (totalDays <= 10) {
      // For 10 days or less, show all dates
      const dates = [];
      for (let i = 0; i < totalDays; i++) {
        dates.push(format(addDays(start, i), "yyyy-MM-dd"));
      }
      return dates;
    }

    // For longer periods, use a fixed number of ticks based on the duration
    const getTickCount = (days: number) => {
      if (days <= 30) return 6; // 6 ticks for up to 1 month
      if (days <= 90) return 7; // 7 ticks for up to 3 months
      if (days <= 180) return 8; // 8 ticks for up to 6 months
      if (days <= 365) return 9; // 9 ticks for up to 1 year
      return 10; // 10 ticks for more than 1 year
    };

    const tickCount = getTickCount(totalDays);
    const dates = [];

    // Always include start date
    dates.push(format(start, "yyyy-MM-dd"));

    // Calculate the interval between ticks
    const interval = Math.floor(totalDays / (tickCount - 1));

    // Generate intermediate dates
    for (let i = 1; i < tickCount - 1; i++) {
      const nextDate = addDays(start, i * interval);
      if (!isAfter(nextDate, end)) {
        dates.push(format(nextDate, "yyyy-MM-dd"));
      }
    }

    // Always include end date
    const lastDateStr = format(end, "yyyy-MM-dd");
    if (dates[dates.length - 1] !== lastDateStr) {
      dates.push(lastDateStr);
    }

    return dates;
  }

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const date = new Date(payload.value);

    if (isMobileView) {
      // Simplified format for mobile
      const mobileDateFormat = format(date, "dd MMM");

      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="middle"
            fill="#615E83"
            fontSize="12px"
            fontWeight="500"
          >
            <tspan x={0} dy="1em">
              {mobileDateFormat}
            </tspan>
          </text>
        </g>
      );
    }

    // Desktop format with date and year on separate lines
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
    predictedData && predictedData.length > 0
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

  const CustomToolTip = ({
    active,
    payload,
    label,
    holidayByDates,
    compareFrom,
    compareTo,
    searchParams,
  }: TooltipProps<number, string> & {
    holidayByDates?: TableGroupedHoliday[];
    compareFrom?: string;
    compareTo?: string;
    searchParams: {
      get: (key: string) => string | null;
    };
  }) => {
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

    // If there's more than one metric, show simplified tooltip
    if (metrics.length > 1) {
      const { date } = tooltipPayload;
      const matchingHoliday =
        holidayByDates &&
        holidayByDates.find((holiday) => holiday.date === date);

      // Calculate comparison date based on relative position
      let comparisonDate = new Date(date);

      if (compareFrom && compareTo) {
        const activeGte = searchParams.get("active_gte");
        const activeLte = searchParams.get("active_lte");
        if (!activeGte || !activeLte) return null;

        const mainStartDate = new Date(activeGte);
        const mainEndDate = new Date(activeLte);
        const currentDate = new Date(date);

        const mainRangePosition =
          (currentDate.getTime() - mainStartDate.getTime()) /
          (mainEndDate.getTime() - mainStartDate.getTime());

        const compareStartDate = new Date(compareFrom);
        const compareEndDate = new Date(compareTo);

        comparisonDate = new Date(
          compareStartDate.getTime() +
            mainRangePosition *
              (compareEndDate.getTime() - compareStartDate.getTime())
        );
      }

      const renderMetricValue = (metric: string, isPreviousYear = false) => {
        const key = isPreviousYear ? `previousYear${metric}` : metric;
        const value = tooltipPayload[key];
        if (value === undefined || !metric) return null;

        const label =
          columnsDropdown.find((column) => column.value === metric)?.label ??
          metric;

        // Format the number to be more readable
        const formattedValue = new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
          compactDisplay: "short",
        }).format(value);

        return (
          <div key={key} className="flex justify-between">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{formattedValue}</span>
          </div>
        );
      };

      return (
        <div
          className={`bg-white p-4 rounded-lg shadow-lg border border-gray-200 ${
            compareFrom && compareTo ? "w-[400px]" : "w-[300px]"
          }`}
        >
          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex justify-between items-center">
                {compareFrom && compareTo ? (
                  <div className="font-medium text-gray-600">
                    Selected Date ({format(new Date(date), "d MMM yyyy")})
                  </div>
                ) : (
                  <div className="font-medium text-gray-600">
                    {format(new Date(date), "d MMM yyyy")}
                  </div>
                )}
                <Link
                  href={`/internal/search/events?${generateViewAllEventsParams.toString()}`}
                  className="flex items-center gap-1 text-sm font-semibold text-[var(--primary-color)] cursor-pointer"
                >
                  View All
                  <ArrowUpRight height={16} width={16} stroke="#6750a4" />
                </Link>
              </div>
              <div className="mt-1">
                {leftAxisMetric && renderMetricValue(leftAxisMetric)}
                {activeRightAxisMetrics.map(
                  (metric) => metric && renderMetricValue(metric)
                )}
              </div>
            </div>

            {compareFrom && compareTo && (
              <div className="text-sm pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-600">
                    Compared Date ({format(comparisonDate, "d MMM yyyy")})
                  </div>
                  <Link
                    href={`/internal/search/events?${previousYearLink}`}
                    className="flex items-center gap-1 text-sm font-semibold text-[#4B9EF4] cursor-pointer"
                  >
                    View All
                    <ArrowUpRight height={16} width={16} stroke="#4B9EF4" />
                  </Link>
                </div>
                <div className="mt-1">
                  {leftAxisMetric && renderMetricValue(leftAxisMetric, true)}
                  {activeRightAxisMetrics.map(
                    (metric) => metric && renderMetricValue(metric, true)
                  )}
                </div>
              </div>
            )}

            {matchingHoliday && (
              <div className="text-sm pt-2 border-t border-gray-200">
                <div className="font-medium text-gray-600">Holiday</div>
                <div className="mt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {matchingHoliday.holidays.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // For single metric, show the original detailed tooltip
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

      const mainRangePosition =
        (currentDate.getTime() - mainStartDate.getTime()) /
        (mainEndDate.getTime() - mainStartDate.getTime());

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

    console.log(tooltipPayload);

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
                      {columnsDropdown.find(
                        (column) => column.value === metrics[0]
                      )?.label ?? ""}
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
                          (column) => column.value === metrics[0]
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
    if (!payload) return null;

    // Filter out entries that aren't selected metrics
    const filteredPayload = payload.filter((entry) => {
      // Handle metric entries
      if (entry.id?.startsWith("metric_")) {
        const metricName = entry.id.replace("metric_", "");
        return metrics.includes(metricName);
      }
      // Handle primary metric
      if (entry.id === "primary_metric") {
        return true;
      }
      // Handle previous year entries
      if (entry.id?.startsWith("previous_year_")) {
        const metricName = entry.id.replace("previous_year_", "");
        return metrics.includes(metricName) || metricName === "primary";
      }
      // Handle threshold entries
      return ["upper_threshold", "lower_threshold", "average"].includes(
        entry.id
      );
    });

    // Separate threshold entries from metric entries
    const thresholdEntries = filteredPayload.filter((entry) =>
      ["upper_threshold", "lower_threshold", "average"].includes(entry.id)
    );

    const metricEntries = filteredPayload.filter(
      (entry) =>
        !["upper_threshold", "lower_threshold", "average"].includes(entry.id)
    );

    // Split metric entries into rows based on screen size and number of entries
    const splitMetricEntries = () => {
      if (isMobileView) {
        // For mobile, show 2 items per row
        const rows = [];
        for (let i = 0; i < metricEntries.length; i += 2) {
          rows.push(metricEntries.slice(i, i + 2));
        }
        return rows;
      } else {
        // For desktop, split into 2 rows if more than 2 entries
        if (metricEntries.length <= 2) return [metricEntries];
        const midPoint = Math.ceil(metricEntries.length / 2);
        return [
          metricEntries.slice(0, midPoint),
          metricEntries.slice(midPoint),
        ];
      }
    };

    // Helper to get proper metric display name
    const getMetricDisplayName = (entry: any) => {
      if (entry.id === "primary_metric") {
        return entry.value;
      }
      if (entry.id?.startsWith("metric_")) {
        return entry.value;
      }
      if (entry.id?.startsWith("previous_year_")) {
        const baseMetric = entry.value.replace("Previous Year ", "");
        return `Compared ${baseMetric}`;
      }
      return entry.value;
    };

    const metricRows = splitMetricEntries();

    return (
      <div
        className={`flex flex-col items-end ${
          isMobileView ? "gap-1 w-full" : "gap-2"
        }`}
      >
        {/* Metric entries rows */}
        {metricRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`flex items-center ${
              isMobileView ? "w-full justify-between gap-2 flex-wrap" : "gap-5"
            }`}
          >
            {row.map((entry, index) => {
              const isComparedMetric = entry.id?.startsWith("previous_year_");
              return (
                <div
                  key={`metric-item-${rowIndex}-${index}`}
                  className={`flex items-center ${
                    isMobileView
                      ? "gap-1 flex-1 min-w-[120px] max-w-[160px]"
                      : "gap-2"
                  }`}
                >
                  <div
                    className={`${isMobileView ? "w-3" : "w-4"} h-0 border-t-2`}
                    style={{
                      borderColor: entry.color,
                      borderStyle: isComparedMetric ? "dashed" : "solid",
                    }}
                  ></div>
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`cursor-pointer text-xs font-medium truncate block ${
                            isMobileView ? "max-w-[120px]" : ""
                          }`}
                          style={{
                            color: entry.color,
                          }}
                        >
                          {getMetricDisplayName(entry)}
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
              );
            })}
          </div>
        ))}

        {/* Threshold entries row */}
        {thresholdEntries.length > 0 && (
          <div
            className={`flex items-center ${
              isMobileView ? "w-full justify-between gap-2 flex-wrap" : "gap-5"
            }`}
          >
            {thresholdEntries.map((entry, index) => (
              <div
                key={`threshold-item-${index}`}
                className={`flex items-center ${
                  isMobileView
                    ? "gap-1 flex-1 min-w-[120px] max-w-[160px]"
                    : "gap-2"
                }`}
              >
                <div
                  className={`${isMobileView ? "w-3" : "w-4"} h-0 border-t-2`}
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
                        className={`cursor-pointer text-xs font-medium truncate block ${
                          isMobileView ? "max-w-[120px]" : ""
                        }`}
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
        )}
      </div>
    );
  };

  const renderLegend = (props: LegendProps) => {
    const { payload } = props;

    if (!payload) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {payload.map((entry, index) => {
          const isPreviousYear = entry.dataKey
            ?.toString()
            .startsWith("previousYear");
          const isSecondaryMetric =
            entry.dataKey === secondaryMetric ||
            entry.dataKey
              ?.toString()
              .startsWith(`previousYear${secondaryMetric}`);
          const color = isSecondaryMetric ? "#9333ea" : "#615E83";
          const label = isPreviousYear
            ? `${entry.value} (Previous Year)`
            : entry.value;

          return (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: color,
                  opacity: isPreviousYear ? 0.5 : 1,
                }}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          );
        })}
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
          {leftAxisMetric && (
            <YAxis
              yAxisId="left"
              dataKey={primaryMetric}
              fontSize="12px"
              width={isMobileView ? 55 : 70}
              domain={[
                () => {
                  if (!graphData || graphData.length === 0) return 0;
                  const validTotals = graphData
                    .map((item: any) => item[primaryMetric])
                    .filter(
                      (val: any) =>
                        val !== undefined && val !== null && !isNaN(val)
                    );
                  const validPrevYears = graphData
                    .map((item: any) => item[`previousYear${primaryMetric}`])
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
                  const overallMax = Math.max(maxTotal, maxPreviousYear, 1);
                  const paddedMax = overallMax * 1.1;
                  const range = Math.max(paddedMax - minValue, 1);
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
                  return (
                    Math.floor(minValue / roundedTickSize) * roundedTickSize
                  );
                },
                () => {
                  if (!graphData || graphData.length === 0) return 100;
                  const validTotals = graphData
                    .map((item: any) => item[primaryMetric])
                    .filter(
                      (val: any) =>
                        val !== undefined && val !== null && !isNaN(val)
                    );
                  const validPrevYears = graphData
                    .map((item: any) => item[`previousYear${primaryMetric}`])
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
                  const overallMax = Math.max(maxTotal, maxPreviousYear, 1);
                  const paddedMax = overallMax * 1.1;
                  const range = Math.max(paddedMax - minValue, 1);
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
                  return (
                    Math.ceil(paddedMax / roundedTickSize) * roundedTickSize
                  );
                },
              ]}
              tickCount={5}
              tickFormatter={tickFormatter}
              label={{
                value: primaryLabel,
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#7D7D7D" },
                fontSize: isMobileView ? "12px" : "14px",
                offset: isMobileView ? 15 : 0,
              }}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#615E83",
                fontSize: isMobileView ? "10px" : "14px",
                fontWeight: isMobileView ? "400" : "500",
              }}
            />
          )}
          {activeRightAxisMetrics.length > 0 && (
            <YAxis
              yAxisId="right"
              orientation={leftAxisMetric ? "right" : "left"}
              dataKey={secondaryMetric}
              fontSize="12px"
              width={isMobileView ? 50 : 70}
              domain={[
                () => {
                  if (!graphData || graphData.length === 0) return 0;
                  const allValues = activeRightAxisMetrics.flatMap((metric) =>
                    graphData
                      .map((item: any) => [
                        item[metric],
                        item[`previousYear${metric}`],
                      ])
                      .flat()
                      .filter(
                        (val: any) =>
                          val !== undefined && val !== null && !isNaN(val)
                      )
                  );

                  if (allValues.length === 0) return 0;
                  const minValue = Math.min(...allValues, 0);
                  const maxValue = Math.max(...allValues, 1);
                  const paddedMax = maxValue * 1.1;
                  const range = Math.max(paddedMax - minValue, 1);
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
                  return (
                    Math.floor(minValue / roundedTickSize) * roundedTickSize
                  );
                },
                () => {
                  if (!graphData || graphData.length === 0) return 100;
                  const allValues = activeRightAxisMetrics.flatMap((metric) =>
                    graphData
                      .map((item: any) => [
                        item[metric],
                        item[`previousYear${metric}`],
                      ])
                      .flat()
                      .filter(
                        (val: any) =>
                          val !== undefined && val !== null && !isNaN(val)
                      )
                  );

                  if (allValues.length === 0) return 100;
                  const minValue = Math.min(...allValues, 0);
                  const maxValue = Math.max(...allValues, 1);
                  const paddedMax = maxValue * 1.1;
                  const range = Math.max(paddedMax - minValue, 1);
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
                  return (
                    Math.ceil(paddedMax / roundedTickSize) * roundedTickSize
                  );
                },
              ]}
              tickCount={5}
              tickFormatter={tickFormatter}
              label={{
                value: (() => {
                  if (activeRightAxisMetrics.length === 0)
                    return "Attendance & Estimates";
                  if (activeRightAxisMetrics.length === 1)
                    return metricLabels[activeRightAxisMetrics[0]];

                  // Check if both attendance and estimate are selected
                  const hasAttendance = activeRightAxisMetrics.includes(
                    "predictedAttendance"
                  );
                  const hasEstimate =
                    activeRightAxisMetrics.includes("inboundEstimate") ||
                    activeRightAxisMetrics.includes("internationalEstimate");

                  if (hasAttendance && hasEstimate)
                    return "Attendance & Estimates";

                  // For inbound and international estimates
                  const hasInbound =
                    activeRightAxisMetrics.includes("inboundEstimate");
                  const hasInternational = activeRightAxisMetrics.includes(
                    "internationalEstimate"
                  );
                  if (hasInbound && hasInternational) {
                    return "Inbound & International Estimates";
                  }

                  // For any other combination, join with &
                  return activeRightAxisMetrics
                    .map((metric) => metricLabels[metric])
                    .join(" & ");
                })(),
                angle: leftAxisMetric ? 90 : -90,
                position: leftAxisMetric ? "insideRight" : "insideLeft",
                style: { textAnchor: "middle", fill: "#7D7D7D" },
                fontSize: isMobileView ? "12px" : "14px",
              }}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#615E83",
                fontSize: isMobileView ? "10px" : "14px",
                fontWeight: isMobileView ? "400" : "500",
              }}
            />
          )}
          <Tooltip
            content={
              <CustomToolTip
                holidayByDates={holidayByDates}
                compareFrom={compareFrom ?? undefined}
                compareTo={compareTo ?? undefined}
                searchParams={searchParams}
              />
            }
            trigger="click"
            wrapperStyle={{ pointerEvents: "auto" }}
          />
          {showThresholdLines && metrics.length === 1 && (
            <>
              {(() => {
                const metric = metrics[0];
                const metricThreshold =
                  eventTrendsData?.thresholds[
                    metric as keyof typeof eventTrendsData.thresholds
                  ];
                if (!metricThreshold) return null;

                const thresholdArea = [
                  metricThreshold * 1.5, // 50% above threshold
                  metricThreshold * 0.5, // 50% below threshold
                ];

                return (
                  <>
                    <ReferenceArea
                      yAxisId={leftAxisMetric ? "left" : "right"}
                      y1={thresholdArea[0]}
                      y2={thresholdArea[1]}
                      fill="#FAEFE2"
                    />
                    <ReferenceLine
                      yAxisId={leftAxisMetric ? "left" : "right"}
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
                      yAxisId={leftAxisMetric ? "left" : "right"}
                      y={metricThreshold}
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
                      yAxisId={leftAxisMetric ? "left" : "right"}
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
                );
              })()}
            </>
          )}
          <Line
            yAxisId={leftAxisMetric ? "left" : "right"}
            type="linear"
            dataKey={leftAxisMetric}
            name={leftAxisMetric ? metricLabels[leftAxisMetric] : "Event Count"}
            stroke="#6750a4"
            strokeWidth={2}
            strokeOpacity={1}
            connectNulls={true}
            dot={<CustomDot />}
          />
          {activeRightAxisMetrics.map((metric, index) => {
            const colors = ["#3b82f6", "#8b5cf6", "#f97316"];
            return (
              <Line
                key={metric}
                yAxisId={leftAxisMetric ? "right" : "right"}
                type="linear"
                dataKey={metric}
                name={metricLabels[metric]}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                strokeOpacity={1}
                connectNulls={true}
                dot={<CustomDot />}
              />
            );
          })}
          {compareFrom && compareTo && (
            <>
              {leftAxisMetric && (
                <Line
                  key={`previousYear-${leftAxisMetric}`}
                  yAxisId={leftAxisMetric ? "left" : "right"}
                  type="linear"
                  dataKey={`previousYear${leftAxisMetric}`}
                  name={`Previous Year ${metricLabels[leftAxisMetric]}`}
                  stroke="#6750a4"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  connectNulls={true}
                  dot={false}
                />
              )}
              {activeRightAxisMetrics.map((metric, index) => {
                const colors = ["#3b82f6", "#8b5cf6", "#f97316"];
                return (
                  <Line
                    key={`previousYear-${metric}`}
                    yAxisId={leftAxisMetric ? "right" : "right"}
                    type="linear"
                    dataKey={`previousYear${metric}`}
                    name={`Previous Year ${metricLabels[metric]}`}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    connectNulls={true}
                    dot={false}
                  />
                );
              })}
            </>
          )}
          {showLegend && (
            <Legend
              content={<CustomLegend />}
              payload={
                [
                  ...(leftAxisMetric
                    ? [
                        {
                          value: primaryLabel,
                          type: "line",
                          id: "primary_metric",
                          color: "#6750a4",
                          tooltipDescription: `Data for ${primaryLabel}`,
                        },
                      ]
                    : []),
                  ...activeRightAxisMetrics.map((metric, index) => {
                    const colors = ["#3b82f6", "#8b5cf6", "#f97316"];
                    return {
                      value: metricLabels[metric],
                      type: "line",
                      id: `metric_${metric}`,
                      color: colors[index % colors.length],
                      tooltipDescription: `Data for ${metricLabels[metric]}`,
                    };
                  }),
                  ...(compareFrom && compareTo
                    ? [
                        ...(leftAxisMetric
                          ? [
                              {
                                value: `Previous Year ${primaryLabel}`,
                                type: "line",
                                id: "previous_year_primary",
                                color: "#6750a4",
                                tooltipDescription: `Previous year data for ${primaryLabel}`,
                                strokeDasharray: "5 5",
                              },
                            ]
                          : []),
                        ...activeRightAxisMetrics.map((metric, index) => {
                          const colors = ["#3b82f6", "#8b5cf6", "#f97316"];
                          return {
                            value: `Previous Year ${metricLabels[metric]}`,
                            type: "line",
                            id: `previous_year_${metric}`,
                            color: colors[index % colors.length],
                            tooltipDescription: `Previous year data for ${metricLabels[metric]}`,
                            strokeDasharray: "5 5",
                          };
                        }),
                      ]
                    : []),
                  ...(showThresholdLines && metrics.length === 1
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
                      bottom: 54,
                      left: 16,
                      fontSize: "12px",
                      fontWeight: "400",
                      display: "flex",
                      justifyContent: "flex-start",
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
