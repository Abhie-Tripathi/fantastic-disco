"use client";
import Loading from "@/components/ui/Loading";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isEventeli } from "@/config";
import { NewColumn } from "@/data/trendsTableColHead";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
import { useTrendsService } from "@/services/trendsService";
import {
  EventTrendsResponse,
  EventTypeData,
  TableData,
  TableGroupedHoliday,
  Values,
} from "@/types";
import { EventResponse } from "@/types/events";
import { renderFormattedDates } from "@/utils/dateFormat";
import {
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  morphToSmartInsightsData,
  morphToTrendsTableData,
  sortingTableData,
} from "@/utils/lineChart";
import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWide,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CollapseIcon from "/public/collapse.svg";
import HolidayIcon from "/public/eventType/holiday.svg";
import ExpandIcon from "/public/expandColumn.svg";
import SmartInsights from "/public/smartInsights.svg";
import DisableSmartInsights from "/public/smartInsightsColored.svg";
import EnableSmartInsights from "/public/smartInsightsDisable.svg";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context";

// Add tooltipDescription to NewColumn interface if it doesn't exist in the original type
interface ExtendedNewColumn extends NewColumn {
  tooltipDescription?: string;
}

// Helper function to safely access TableData properties
const safelyAccessTableData = (
  data: TableData | undefined,
  key: string | undefined,
  subKey: string
): any => {
  if (!data || !key) return null;

  try {
    // Safely access the property using type assertion
    const value = data[key as keyof TableData];
    if (!value) return null;

    // Access the subproperty if it exists
    // Using type assertion and optional chaining to prevent type errors
    if (typeof value === "object" && value !== null) {
      return (value as Record<string, any>)[subKey];
    }
    return null;
  } catch (error) {
    console.error("Error accessing table data:", error);
    return null;
  }
};

const calculatePercentageChange = (
  current: number,
  comparison: number
): string | null => {
  if (comparison === 0) return null;
  const change = ((current - comparison) / comparison) * 100;
  if (change === 0) return null;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

function convertToLongDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date
    .toLocaleDateString("en-US", options)
    .toLocaleUpperCase()
    .replace(",", "");
}

const TestPeriodicAnalytics = () => {
  const {isTentimesUser} = useAuthContext()
  const params = useSearchParams();
  const router = useRouter();
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({});
  const [tableData, setTableData] = useState<TableData[] | []>();
  const { setFilter, getFilterValue } = useFilterState();
  const currentView =
    (getFilterValue("dateView") as "day" | "week" | "month") || "day";
  const [sortingColumnOrder, setSortingColumnOrder] = useState<{
    order: "asc" | "desc";
    eventType: keyof TableData | null;
  }>({ order: "asc", eventType: null });
  const { searchParams } = useDefaultFilters();
  const { getEventTrends } = useTrendsService();
  const columns = searchParams.get("columns");
  const eventTypes = searchParams.get("eventTypes");
  const compareFrom = searchParams.get("compare_from");
  const compareTo = searchParams.get("compare_to");
  const isMobileView = useIsMobile();
  const eventTypesArray = eventTypes ? eventTypes.split(",") : [];
  const hasHoliday =
    eventTypesArray.length > 0 ? eventTypesArray.includes("holiday") : false;
  const columnsData = (columns && columns.split(",")) || [];
  const [isSmartInsightsEnabled, setIsSmartInsightsEnabled] =
    useState<boolean>(false);
  const [smartInsightState, setSmartInsightState] = useState<{
    [key: string]: boolean;
  }>(
    columnsData.length > 0
      ? columnsData.reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as { [key: string]: boolean })
      : {}
  );
  const [eventTrendsData, setEventTrendsData] = useState<
    EventTrendsResponse | undefined
  >();
  const [tableColumns, setTableColumns] = useState<ExtendedNewColumn[]>();
  const { getEventsWithSearchParams } = useEventsService();
  const metric = getFilterValue("columns") as
    | "eventCount"
    | "predictedAttendance"
    | "inboundEstimate"
    | "internationalEstimate";

  // Add state for comparison data
  const [comparisonData, setComparisonData] = useState<TableData[] | []>();

  const stringParams = `groupBy=date&dateView=day&${searchParams.toString()}`;

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
    return params.toString();
  }, [currentView, searchParams]);

  const updatedParams = useMemo(() => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("eventTypes", "holiday");
    updatedSearchParams.delete("skip");
    return updatedSearchParams.toString();
  }, [searchParams]);

  // Create comparison params
  const comparisonParams = useMemo(() => {
    if (!compareFrom || !compareTo) return "";

    const params = new URLSearchParams(apiParams);
    params.set("active_gte", compareFrom);
    params.set("active_lte", compareTo);
    return params.toString();
  }, [apiParams, compareFrom, compareTo]);

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

  const { data: holdiayData } = useQuery({
    queryKey: ["holiday", updatedParams],
    queryFn: async () => await getEventsWithSearchParams(updatedParams),
    enabled: isEventeli && hasHoliday,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  // Add query for comparison data
  const { data: comparisonTrendsData, isLoading: isComparisonLoading } =
    useQuery<EventTrendsResponse | undefined>({
      queryKey: ["trends-comparison", comparisonParams],
      queryFn: () => getEventTrends(comparisonParams),
      enabled: !!comparisonParams,
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

  const holidaysByDate =
    (groupedData &&
      Object.values(groupedData).length > 0 &&
      Object.values(groupedData)) ||
    [];

  useEffect(() => {
    if (trendsData !== undefined) {
      setEventTrendsData(trendsData);
    }
  }, [trendsData]);

  useEffect(() => {
    const skip = searchParams.get("skip");

    if (!skip) {
      setIsSmartInsightsEnabled(false);

      setSmartInsightState((prev) => {
        const updatedState = columnsData.reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as { [key: string]: boolean });

        return updatedState;
      });
    }
  }, [trendsData, searchParams]);

  useEffect(() => {
    if (Object.keys(smartInsightState).length > 0) {
      const allFalse = Object.values(smartInsightState).every(
        (value) => value === false
      );
      const allTrue = Object.values(smartInsightState).every(
        (value) => value === true
      );
      if (allFalse) {
        setIsSmartInsightsEnabled(false);
      }
      if (allTrue) {
        setIsSmartInsightsEnabled(true);
      }
    }
  }, [smartInsightState]);

  useEffect(() => {
    setSmartInsightState((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = isSmartInsightsEnabled;
        return acc;
      }, {} as { [key: string]: boolean });
      return newState;
    });
  }, [isSmartInsightsEnabled]);

  // Update useEffect to process comparison data
  useEffect(() => {
    const eventTypes = searchParams.get("eventTypes")?.split(",") || [];
    const columns = searchParams.get("columns")?.split(",") || [];

    if (eventTrendsData && eventTrendsData.groupedData) {
      const tableColumns = generateTrendsTableColumnHeaders(
        eventTypes,
        columns
      );

      let processedData = morphToTrendsTableData(
        eventTrendsData.thresholds,
        eventTrendsData.groupedData,
        eventTypes
      );

      // Process data based on view type
      if (currentView === "week") {
        processedData = processDataForWeekView(processedData);
      } else if (currentView === "month") {
        processedData = processDataForMonthView(processedData);
      }

      const smartInsightsData = morphToSmartInsightsData(processedData);
      setTableData(smartInsightsData);
      setTableColumns(tableColumns);
    }

    if (comparisonTrendsData && comparisonTrendsData.groupedData) {
      let comparisonTableData = morphToTrendsTableData(
        comparisonTrendsData.thresholds,
        comparisonTrendsData.groupedData,
        eventTypes
      );

      // Process comparison data based on view type
      if (currentView === "week") {
        comparisonTableData = processDataForWeekView(comparisonTableData);
      } else if (currentView === "month") {
        comparisonTableData = processDataForMonthView(comparisonTableData);
      }

      setComparisonData(comparisonTableData);
    }
  }, [eventTrendsData, comparisonTrendsData, metric, currentView]);

  const processDataForWeekView = (data: TableData[]) => {
    const weeklyData: { [key: string]: TableData } = {};

    data.forEach((item) => {
      try {
        // The date is already in the format "YYYY-MM-DD_YYYY-MM-DD" for week view
        const weekKey = item.date;

        if (!weeklyData[weekKey]) {
          // Initialize the week's data with proper type casting
          weeklyData[weekKey] = {
            date: weekKey,
            predictedAttendance: item.predictedAttendance
              ? ({ ...item.predictedAttendance } as EventTypeData & Values)
              : undefined,
            inboundEstimate: item.inboundEstimate
              ? ({ ...item.inboundEstimate } as EventTypeData & Values)
              : undefined,
            internationalEstimate: item.internationalEstimate
              ? ({ ...item.internationalEstimate } as EventTypeData & Values)
              : undefined,
            impactScore: item.impactScore
              ? ({ ...item.impactScore } as EventTypeData & Values)
              : undefined,
            economicImpact: item.economicImpact
              ? ({ ...item.economicImpact } as EventTypeData & Values)
              : undefined,
            eventCount: item.eventCount
              ? ({ ...item.eventCount } as EventTypeData & Values)
              : undefined,
          };
        } else {
          // Aggregate the data for each metric
          const metrics = [
            "predictedAttendance",
            "inboundEstimate",
            "internationalEstimate",
            "impactScore",
            "economicImpact",
            "eventCount",
          ] as const;

          metrics.forEach((metric) => {
            const currentMetric = item[metric];
            const existingMetric = weeklyData[weekKey][metric];

            if (currentMetric && existingMetric) {
              // Aggregate the Values part
              if ("value" in currentMetric && "value" in existingMetric) {
                const currentValue = (currentMetric as any).value;
                const existingValue = (existingMetric as any).value;
                const currentAvg = (currentMetric as any).avg;
                const existingAvg = (existingMetric as any).avg;

                if (
                  typeof currentValue === "number" &&
                  typeof existingValue === "number"
                ) {
                  (existingMetric as any).value = currentValue + existingValue;
                  (existingMetric as any).avg = (currentAvg + existingAvg) / 2;
                }
              }

              // Aggregate the EventTypeData part
              const eventTypes = [
                "tradeshows",
                "conferences",
                "workshops",
                "festival",
                "concert",
                "sport",
                "community",
                "performing-arts",
              ] as const;

              eventTypes.forEach((eventType) => {
                if (eventType in currentMetric && eventType in existingMetric) {
                  const currentValue = (currentMetric as any)[eventType];
                  const existingValue = (existingMetric as any)[eventType];
                  if (
                    typeof currentValue === "number" &&
                    typeof existingValue === "number"
                  ) {
                    (existingMetric as any)[eventType] =
                      currentValue + existingValue;
                  }
                }
              });
            }
          });
        }
      } catch (error) {
        console.error(
          "Error processing week data:",
          error,
          "for date:",
          item.date
        );
      }
    });

    // Sort the weeks by date
    const sortedWeeks = Object.values(weeklyData).sort((a, b) => {
      try {
        const [aStart] = a.date.split("_");
        const [bStart] = b.date.split("_");
        return new Date(aStart).getTime() - new Date(bStart).getTime();
      } catch (error) {
        console.error("Error sorting weeks:", error);
        return 0;
      }
    });

    return sortedWeeks;
  };

  const processDataForMonthView = (data: TableData[]) => {
    const monthlyData: { [key: string]: TableData } = {};

    data.forEach((item) => {
      try {
        // Skip single-day entries (they have zero values)
        if (item.date.includes("-01") && item.date.length === 10) {
          return;
        }

        // The date is already in the format "YYYY-MM" for month view
        const monthKey = item.date;

        if (!monthlyData[monthKey]) {
          // Initialize the month's data with proper type casting
          monthlyData[monthKey] = {
            date: monthKey,
            predictedAttendance: item.predictedAttendance
              ? ({ ...item.predictedAttendance } as EventTypeData & Values)
              : undefined,
            inboundEstimate: item.inboundEstimate
              ? ({ ...item.inboundEstimate } as EventTypeData & Values)
              : undefined,
            internationalEstimate: item.internationalEstimate
              ? ({ ...item.internationalEstimate } as EventTypeData & Values)
              : undefined,
            impactScore: item.impactScore
              ? ({ ...item.impactScore } as EventTypeData & Values)
              : undefined,
            economicImpact: item.economicImpact
              ? ({ ...item.economicImpact } as EventTypeData & Values)
              : undefined,
            eventCount: item.eventCount
              ? ({ ...item.eventCount } as EventTypeData & Values)
              : undefined,
          };
        } else {
          // Aggregate the data for each metric
          const metrics = [
            "predictedAttendance",
            "inboundEstimate",
            "internationalEstimate",
            "impactScore",
            "economicImpact",
            "eventCount",
          ] as const;

          metrics.forEach((metric) => {
            const currentMetric = item[metric];
            const existingMetric = monthlyData[monthKey][metric];

            if (currentMetric && existingMetric) {
              // Aggregate the Values part
              if ("value" in currentMetric && "value" in existingMetric) {
                const currentValue = (currentMetric as any).value;
                const existingValue = (existingMetric as any).value;
                const currentAvg = (currentMetric as any).avg;
                const existingAvg = (existingMetric as any).avg;

                if (
                  typeof currentValue === "number" &&
                  typeof existingValue === "number"
                ) {
                  (existingMetric as any).value = currentValue + existingValue;
                  (existingMetric as any).avg = (currentAvg + existingAvg) / 2;
                }
              }

              // Aggregate the EventTypeData part
              const eventTypes = [
                "tradeshows",
                "conferences",
                "workshops",
                "festival",
                "concert",
                "sport",
                "community",
                "performing-arts",
              ] as const;

              eventTypes.forEach((eventType) => {
                if (eventType in currentMetric && eventType in existingMetric) {
                  const currentValue = (currentMetric as any)[eventType];
                  const existingValue = (existingMetric as any)[eventType];
                  if (
                    typeof currentValue === "number" &&
                    typeof existingValue === "number"
                  ) {
                    (existingMetric as any)[eventType] =
                      currentValue + existingValue;
                  }
                }
              });
            }
          });
        }
      } catch (error) {
        console.error(
          "Error processing month data:",
          error,
          "for date:",
          item.date
        );
      }
    });

    // Sort the months chronologically
    const sortedMonths = Object.values(monthlyData).sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } catch (error) {
        console.error("Error sorting months:", error);
        return 0;
      }
    });

    return sortedMonths;
  };

  useEffect(() => {
    if (tableData && tableData.length > 0 && sortingColumnOrder.eventType) {
      const sortedTableData = sortingTableData(
        sortingColumnOrder.order,
        sortingColumnOrder.eventType,
        tableData
      );
      setTableData(sortedTableData);
    }
  }, [sortingColumnOrder]);
  const sortingData = (eventType: keyof TableData, order: "asc" | "desc") => {
    setSortingColumnOrder({
      order: order,
      eventType: eventType,
    });
  };
  const toggleSmartInsightState = (slug: string | undefined) => {
    if (!slug) return;
    setSmartInsightState((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug],
    }));
  };

  const startDate = getFilterValue("active_gte");
  const endDate = getFilterValue("active_lte");
  const itemsPerPage = 10;
  const currentPage =
    Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages =
    tableData && tableData.length > 0
      ? Math.ceil(tableData.length / itemsPerPage)
      : 1;

  const startingLimit = (currentPage - 1) * itemsPerPage;
  const endingLimit = startingLimit + itemsPerPage - 1;
  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationEllipsis />;

    if (totalPages && totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">{ellipsis}</PaginationItem>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">{ellipsis}</PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };
  const toggleOpenState = (slug: string | undefined) => {
    if (!slug) return;
    setOpenState((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug],
    }));
  };
  const redirectTo = (url: string, startDate: string, endDate: string) => {
    // Create a new URLSearchParams object with the entries from params
    const updatedParams = new URLSearchParams();
    params.forEach((value, key) => {
      updatedParams.set(key, value);
    });

    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndStartDate = new Date(endDate).toISOString();

    updatedParams.delete("skip");
    updatedParams.set("active_gte", formattedStartDate);
    updatedParams.set("active_lte", formattedEndStartDate);

    const queryString = updatedParams.toString();

    router.push(`${url}?${queryString}`);
  };

  // Move renderTableRow function declaration here, before any blocks
  const renderTableRow = (data: TableData, rowIndex: number) => {
    // Find corresponding comparison data
    const comparisonDate = comparisonData?.find((item) => {
      const mainStartDate = new Date(searchParams.get("active_gte") || "");
      const mainEndDate = new Date(searchParams.get("active_lte") || "");
      const currentDate = new Date(data.date.split("_")[0]); // Use start date of week for comparison
      const compareStartDate = new Date(compareFrom || "");
      const compareEndDate = new Date(compareTo || "");

      // Calculate relative position in the main range (0 to 1)
      const mainRangePosition =
        (currentDate.getTime() - mainStartDate.getTime()) /
        (mainEndDate.getTime() - mainStartDate.getTime());

      // Find the corresponding date in comparison range
      const targetCompareDate = new Date(
        compareStartDate.getTime() +
          mainRangePosition *
            (compareEndDate.getTime() - compareStartDate.getTime())
      );

      // For week view, compare the start of the week
      if (currentView === "week") {
        const itemStartDate = new Date(item.date.split("_")[0]);
        return (
          Math.abs(itemStartDate.getTime() - targetCompareDate.getTime()) <
          7 * 24 * 60 * 60 * 1000
        ); // Within a week
      }

      // For month view, compare months
      if (currentView === "month") {
        const itemDate = new Date(item.date);
        const targetMonth = targetCompareDate.getMonth();
        const targetYear = targetCompareDate.getFullYear();
        return (
          itemDate.getMonth() === targetMonth &&
          itemDate.getFullYear() === targetYear
        );
      }

      // For day view, use existing comparison logic
      return (
        Math.abs(new Date(item.date).getTime() - targetCompareDate.getTime()) <
        24 * 60 * 60 * 1000
      );
    });

    return (
      <TableRow
        key={`row-${rowIndex}`}
        className="cursor-pointer"
        onClick={() =>
          redirectTo("/internal/search/events", data["date"], data["date"])
        }
      >
        {tableColumns &&
          tableColumns.map((trends) => {
            const key = (trends.slug as keyof TableData) || "";
            if (key === "date") {
              return (
                <TableCell
                  key={key}
                  width={isMobileView ? 140 : 340}
                  className={`text-center font-semibold text-[#6750a4] flex items-center justify-center sticky left-0 z-30 bg-background max-w-[100px] md:max-w-[340px] px-1 py-1 truncate ${
                    !comparisonDate ? "h-[53px]" : ""
                  }`}
                >
                  <div className="w-full flex flex-col justify-center px-2">
                    <p className="truncate">
                      {formatDateForDisplay(data[key])}
                    </p>
                    {comparisonDate && (
                      <p className="truncate text-[#4B9EF4]">
                        {formatDateForDisplay(comparisonDate.date)}
                      </p>
                    )}
                  </div>
                </TableCell>
              );
            }

            // Rest of your existing cell rendering logic, but add comparison values
            const cellData = data[key];
            const comparisonCellData = comparisonDate?.[key];
            const isSmartInsightEnabledForColumn =
              smartInsightState[trends.slug ?? ""];
            const isOpenState = openState[trends.slug ?? ""];
            const subHeading = trends.subHeading;

            if (cellData) {
              if (!isSmartInsightEnabledForColumn && !isOpenState) {
                const currentValue = cellData["value"] ?? 0;
                const comparisonValue = comparisonCellData?.["value"] ?? 0;
                const percentageChange = calculatePercentageChange(
                  currentValue,
                  comparisonValue
                );

                return (
                  <TableCell
                    key={key}
                    width={100}
                    className={`text-center font-semibold border border-[var(--neutral-light-color)] text-[var(--primary-text-color)] relative p-0 h-[53px]`}
                  >
                    {isSmartInsightEnabledForColumn && (
                      <div
                        className={`absolute top-0 left-0 right-0 ${
                          comparisonCellData ? "h-1/2" : "h-full"
                        } ${cellData["thresholdHighlightCol"]}`}
                      />
                    )}
                    <div className="flex flex-col items-center justify-center relative h-full gap-1">
                      <div
                        className={`flex items-center gap-2 ${
                          comparisonCellData ? "min-w-[100px]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{currentValue}</span>
                          {comparisonCellData && percentageChange && (
                            <span
                              className={`text-xs ${
                                Number(percentageChange) > 0
                                  ? "text-[#398E4A]"
                                  : Number(percentageChange) < 0
                                  ? "text-[#E1313A]"
                                  : "text-gray-500"
                              }`}
                            >
                              ({percentageChange})
                            </span>
                          )}
                        </div>
                        {isSmartInsightEnabledForColumn &&
                          cellData["thresholdHighlightCol"] ===
                            "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" && (
                            <ArrowUp width={15} height={15} />
                          )}
                        {isSmartInsightEnabledForColumn &&
                          cellData["thresholdHighlightCol"] ===
                            "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" && (
                            <ArrowDown width={15} height={15} color="#E1313A" />
                          )}
                      </div>
                      {comparisonCellData && (
                        <span className="min-w-[100px] text-start">
                          {comparisonValue}
                        </span>
                      )}
                    </div>
                  </TableCell>
                );
              }

              if (isSmartInsightEnabledForColumn && !isOpenState) {
                const currentValue = cellData["value"] ?? 0;
                const comparisonValue = comparisonCellData?.["value"] ?? 0;
                const percentageChange = calculatePercentageChange(
                  currentValue,
                  comparisonValue
                );

                return (
                  <TableCell
                    key={key}
                    width={100}
                    className={`text-center font-semibold border border-[var(--neutral-light-color)] text-[var(--primary-text-color)] relative p-0 h-[53px]`}
                  >
                    {isSmartInsightEnabledForColumn && (
                      <div
                        className={`absolute top-0 left-0 right-0 ${
                          comparisonCellData ? "h-1/2" : "h-full"
                        } ${cellData["thresholdHighlightCol"]}`}
                      />
                    )}
                    <div className="flex flex-col items-center justify-center relative h-full gap-1">
                      <div
                        className={`flex items-center gap-2 ${
                          comparisonCellData ? "min-w-[100px]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{currentValue}</span>
                          {comparisonCellData && percentageChange && (
                            <span
                              className={`text-xs ${
                                Number(percentageChange) > 0
                                  ? "text-[#398E4A]"
                                  : Number(percentageChange) < 0
                                  ? "text-[#E1313A]"
                                  : "text-gray-500"
                              }`}
                            >
                              ({percentageChange})
                            </span>
                          )}
                        </div>
                        {isSmartInsightEnabledForColumn &&
                          cellData["thresholdHighlightCol"] ===
                            "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" && (
                            <ArrowUp width={15} height={15} />
                          )}
                        {isSmartInsightEnabledForColumn &&
                          cellData["thresholdHighlightCol"] ===
                            "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" && (
                            <ArrowDown width={15} height={15} color="#E1313A" />
                          )}
                      </div>
                      {comparisonCellData && <span>{comparisonValue}</span>}
                    </div>
                  </TableCell>
                );
              }

              if (
                subHeading &&
                !isSmartInsightEnabledForColumn &&
                isOpenState
              ) {
                return subHeading
                  .filter((heading) => heading.slug !== "avg")
                  .map((cell) => {
                    const currentValue =
                      cellData[cell.slug as keyof EventTypeData];
                    const comparisonValue =
                      comparisonCellData?.[cell.slug as keyof EventTypeData];
                    const percentageChange = calculatePercentageChange(
                      Number(currentValue),
                      Number(comparisonValue)
                    );

                    return (
                      <TableCell
                        key={cell.slug}
                        width={100}
                        className="p-0 h-[53px] w-32 border border-[var(--neutral-light-color)]"
                      >
                        <div className="flex flex-col items-center w-full">
                          <div
                            className={`flex text-center items-center justify-center w-full font-semibold text-[var(--primary-text-color)]`}
                          >
                            <div
                              className={`flex items-center gap-1 ${
                                comparisonCellData ? "min-w-[100px]" : ""
                              }`}
                            >
                              <span>{currentValue}</span>
                              {comparisonCellData && percentageChange && (
                                <span
                                  className={`text-xs ${
                                    Number(percentageChange) > 0
                                      ? "text-[#398E4A]"
                                      : Number(percentageChange) < 0
                                      ? "text-[#E1313A]"
                                      : "text-gray-500"
                                  }`}
                                >
                                  ({percentageChange})
                                </span>
                              )}
                            </div>
                          </div>
                          {comparisonCellData && (
                            <div className="font-semibold min-w-[100px] text-start ">
                              {comparisonValue}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    );
                  });
              }

              if (subHeading && isSmartInsightEnabledForColumn && isOpenState) {
                return subHeading
                  .filter((heading) => heading.slug !== "avg")
                  .map((cell) => {
                    const currentValue =
                      cellData[cell.slug as keyof EventTypeData];
                    const comparisonValue =
                      comparisonCellData?.[cell.slug as keyof EventTypeData];
                    const percentageChange = calculatePercentageChange(
                      Number(currentValue),
                      Number(comparisonValue)
                    );

                    return (
                      <TableCell
                        key={cell.slug}
                        width={100}
                        className={`p-0 h-[53px] w-32 border border-[var(--neutral-light-color)] relative`}
                      >
                        {isSmartInsightEnabledForColumn && (
                          <div
                            className={`absolute top-0 left-0 right-0 ${
                              comparisonCellData ? "h-1/2" : "h-full"
                            } 
                            ${
                              cell.slug === "avg"
                                ? "bg-[#DA2F35] bg-opacity-5"
                                : ""
                            }
                            ${
                              cellData["maxRow"] &&
                              cell.slug !== "avg" &&
                              cell.slug !== "value" &&
                              cellData["maxRow"] ===
                                cellData[cell.slug as keyof EventTypeData]
                                ? cellData["thresholdHighlightRow"]
                                : ""
                            }
                            ${
                              cell.slug === "value"
                                ? cellData["thresholdHighlightCol"]
                                : ""
                            }
                            ${
                              cell.slug === "value" &&
                              cellData["maxCol"] === cellData["value"]
                                ? "border-2 border-[var(--negative-color)]"
                                : ""
                            }`}
                          />
                        )}
                        <div className="flex flex-col items-center justify-center w-full h-full relative gap-1">
                          <div className="text-center w-full flex gap-2 items-center justify-center font-semibold text-[var(--primary-text-color)]">
                            <div
                              className={`flex items-center gap-1 ${
                                comparisonCellData ? "min-w-[100px]" : ""
                              }`}
                            >
                              <span>{currentValue}</span>
                              {comparisonCellData && percentageChange && (
                                <span
                                  className={`text-xs ${
                                    Number(percentageChange) > 0
                                      ? "text-[#398E4A]"
                                      : Number(percentageChange) < 0
                                      ? "text-[#E1313A]"
                                      : "text-gray-500"
                                  }`}
                                >
                                  ({percentageChange})
                                </span>
                              )}
                            </div>
                            {isSmartInsightEnabledForColumn &&
                              cellData["thresholdHighlightCol"] ===
                                "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" &&
                              cell.slug === "value" && (
                                <ArrowUp width={15} height={15} />
                              )}
                            {isSmartInsightEnabledForColumn &&
                              cellData["thresholdHighlightCol"] ===
                                "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" &&
                              cell.slug === "value" && (
                                <ArrowDown
                                  width={15}
                                  height={15}
                                  color="#E1313A"
                                />
                              )}
                          </div>
                          {comparisonCellData && (
                            <div className="font-semibold">
                              {comparisonValue}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    );
                  });
              }
            }

            return (
              <TableCell
                key={key}
                width={100}
                className="text-center font-semibold border border-[var(--neutral-light-color)] text-[var(--primary-text-color-transparent)]"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center gap-1 ${
                      comparisonCellData ? "min-w-[100px]" : ""
                    }`}
                  >
                    <span>0</span>
                  </div>
                  {comparisonCellData && <span>0</span>}
                </div>
              </TableCell>
            );
          })}
      </TableRow>
    );
  };

  const handleViewChange = (view: "day" | "week" | "month") => {
    setFilter("dateView", view);
  };

  const formatDateForDisplay = (dateString: string) => {
    try {
      if (currentView === "month") {
        return format(new Date(dateString), "MMM yyyy");
      }
      if (currentView === "week" && dateString.includes("_")) {
        const [startDate, endDate] = dateString.split("_");
        return `${format(new Date(startDate), "dd MMM")} - ${format(
          new Date(endDate),
          "dd MMM yyyy"
        )}`;
      }
      // For day view, format as "dd MMM yyyy"
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (isLoading || (compareFrom && compareTo && isComparisonLoading)) {
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

  if (tableData && tableData.length === 0) {
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
    <>
      <div
        className={`flex ${
          isMobileView ? "flex-col gap-3" : "justify-between items-center"
        } py-4`}
      >
        <div className="flex flex-col gap-2">
          <div className="font-medium text-base">
            {compareFrom && compareTo
              ? `Comparing ${renderFormattedDates(
                  startDate,
                  endDate
                )} with ${renderFormattedDates(
                  format(new Date(compareFrom), "dd MMM yyyy"),
                  format(new Date(compareTo), "dd MMM yyyy")
                )}`
              : `For the selected time period (${renderFormattedDates(
                  startDate,
                  endDate
                )})`}
          </div>
          {isTentimesUser && <div className="flex justify-start gap-2">
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
          </div>}
        </div>
        <div
          className={`px-2 py-2 md:px-3 md:py-3 border border-[var(--neutral-light-color)] rounded-sm max-w-fit ${
            isMobileView ? "text-xs" : ""
          }`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-2 cursor-pointer items-center">
                  <div className="flex items-center gap-2">
                    <Image
                      src={SmartInsights}
                      width={16}
                      height={16}
                      alt={""}
                      className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]"
                    />
                    <p className="text-primary m-0 font-normal text-xs md:text-sm">
                      Smart Insights
                    </p>
                  </div>
                  <Switch
                    checked={isSmartInsightsEnabled}
                    onCheckedChange={() =>
                      setIsSmartInsightsEnabled((prev) => !prev)
                    }
                    disabled={Object.keys(smartInsightState).length === 0}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 tooltip-content-styles ">
                <p className="font-medium text-[var(--secondary-text-color)]">
                  Identifies trends and patterns by comparing data to averages,
                  making key insights easy to spot.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="mt-4 md:mt-6 overflow-x-auto px-4 md:px-0">
        <div className="w-full overflow-x-auto">
          <Table
            className={`border border-[var(--neutral-light-color)] ${
              isMobileView ? "w-full text-xs" : "w-[98%] text-sm"
            } mx-auto relative`}
          >
            <TableHeader>
              <TableRow className={isMobileView ? "h-[40px]" : "h-[53px]"}>
                {tableColumns &&
                  tableColumns.map((trends) => {
                    const colSpan = openState[trends.slug ?? ""]
                      ? (trends.subHeading &&
                          trends.subHeading.filter(
                            (heading) => heading.slug !== "avg"
                          ).length) ||
                        1
                      : 1;
                    return (
                      <TableHead
                        key={trends.columnName}
                        colSpan={colSpan}
                        rowSpan={trends.slug === "date" ? 2 : 1}
                        style={{
                          width: trends.slug === "date" ? "340px" : "1000px",
                        }}
                        className={`text-center bg-[var(--background-secondary-color)] text-[var(--primary-text-color)] border border-[var(--neutral-light-color)] relative ${
                          trends.slug === "date"
                            ? "sticky left-0 z-30 max-w-[340px]"
                            : ""
                        }`}
                      >
                        {trends.slug === "date" &&
                          trends.columnName.toUpperCase()}
                        {trends.slug !== "date" && (
                          <div
                            className={`flex items-center justify-center mx-auto gap-2 md:gap-4 h-inherit w-32 md:w-60`}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className={`cursor-pointer text-xs md:text-sm font-medium`}
                                  >
                                    {trends.columnName.toUpperCase()}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="w-64 tooltip-content-styles">
                                  <p className="font-medium text-left text-[var(--secondary-text-color)]">
                                    {trends.tooltipDescription ||
                                      trends.columnName}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Select>
                              <SelectTrigger className="w-5 h-5 focus:outline-none z-20 top-3 right-10 bg-background p-0 border-2 rounded-sm border-[var(--neutral-light-color)]"></SelectTrigger>
                              <SelectContent>
                                <SelectGroup className="flex flex-col gap-2 md:gap-4 p-2 md:p-4">
                                  <div className="flex gap-2 md:gap-4 items-center">
                                    <p className="text-xs md:text-sm">
                                      SORT BY
                                    </p>
                                    <button
                                      className={`$${
                                        sortingColumnOrder.eventType ===
                                          trends.slug &&
                                        sortingColumnOrder.order === "asc"
                                          ? "border-[#6750A4]"
                                          : "border-[var(--neutral-light-color)]"
                                      }flex items-center w-6 h-6 border-2 rounded-sm`}
                                    >
                                      <ArrowUpNarrowWide
                                        color="currentColor"
                                        className="cursor-pointer w-4 md:w-5 text-[var(--secondary-text-color)]"
                                        onClick={() =>
                                          sortingData(
                                            trends.slug as keyof TableData,
                                            "asc"
                                          )
                                        }
                                      />
                                    </button>
                                    <button
                                      className={`$${
                                        sortingColumnOrder.eventType ===
                                          trends.slug &&
                                        sortingColumnOrder.order === "desc"
                                          ? "border-[#6750A4]"
                                          : "border-[var(--neutral-light-color)]"
                                      }flex items-center w-6 h-6 border-2 rounded-sm`}
                                    >
                                      <ArrowDownWideNarrow
                                        color="currentColor"
                                        className="cursor-pointer w-4 md:w-5 text-[var(--secondary-text-color)]"
                                        onClick={() =>
                                          sortingData(
                                            trends.slug as keyof TableData,
                                            "desc"
                                          )
                                        }
                                      />
                                    </button>
                                  </div>

                                  <div className="flex gap-2 md:gap-4 items-center">
                                    <p className="text-xs md:text-sm">
                                      {`Turn
                                    $${
                                      smartInsightState[trends.slug ?? ""]
                                        ? "off"
                                        : "on"
                                    }
                                    Insights`}
                                    </p>
                                    <Image
                                      src={
                                        smartInsightState[trends.slug ?? ""]
                                          ? DisableSmartInsights
                                          : EnableSmartInsights
                                      }
                                      className="cursor-pointer"
                                      width={24}
                                      height={24}
                                      alt={"Disable Smart Insights"}
                                      onClick={() =>
                                        toggleSmartInsightState(trends.slug)
                                      }
                                    />
                                  </div>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {trends.slug !== "date" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="absolute z-20 top-2 -right-3 bg-background"
                                  onClick={() => toggleOpenState(trends.slug)}
                                >
                                  <Image
                                    className="p-1 z-30 shadow-lg flex items-center justify-center rounded-md border border-[var(--neutral-light-color)] aspect-auto"
                                    src={
                                      openState[trends.slug ?? ""]
                                        ? CollapseIcon
                                        : ExpandIcon
                                    }
                                    alt="TableIcons"
                                    width={20}
                                    height={20}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="w-44 tooltip-content-styles ">
                                <p className="font-medium text-[var(--secondary-text-color)]">
                                  Click on it to see event type wise split
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableHead>
                    );
                  })}
              </TableRow>
              {(Object.values(openState).some((state) => state) ||
                Object.values(smartInsightState).some((state) => state)) && (
                <TableRow className={isMobileView ? "h-[40px]" : "h-[53px]"}>
                  {tableColumns &&
                    tableColumns.map((trends) => {
                      const subHeading = trends.subHeading ?? [];
                      const isSmartInsightEnabledForColumn =
                        smartInsightState[trends.slug ?? ""];
                      const isOpenState = openState[trends.slug ?? ""];

                      if (trends.subHeading && trends.subHeading.length > 0) {
                        return isOpenState && trends.slug !== "date" ? (
                          trends.subHeading
                            .filter((heading) => heading.slug !== "avg")
                            .map((cell) => (
                              <TableHead
                                key={cell.subColumnName}
                                className={`bg-[var(--background-secondary-color)] text-[var(--primary-text-color)] w-40 text-center border border-[var(--neutral-light-color)] ${
                                  cell.slug === "value" ? "py-2" : ""
                                }`}
                              >
                                <div
                                  className={`flex items-center w-20 mx-auto font-${
                                    cell.fontWeight ?? "normal"
                                  } justify-center text-[var(--primary-text-color)] gap-2`}
                                >
                                  {cell.icon && (
                                    <Image
                                      src={cell.icon}
                                      alt={cell.subColumnName}
                                      width={18}
                                      height={18}
                                    />
                                  )}
                                  <p
                                    className="truncate max-w-[80px] relative group"
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                    title={cell.subColumnName}
                                  >
                                    {cell.subColumnName.toUpperCase()}
                                  </p>
                                  <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block p-2 bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap">
                                    {cell.subColumnName}
                                  </div>
                                </div>
                                {cell.slug === "value" && (
                                  <div className="flex flex-col justify-center gap-1 text-[var(--negative-color)] font-medium items-center border-t mt-1 pt-2">
                                    <div className="flex gap-1">
                                      <p>AVG</p> {":"}
                                      <span>
                                        {tableData &&
                                          tableData.length > 0 &&
                                          safelyAccessTableData(
                                            tableData[0],
                                            trends.slug,
                                            "avg"
                                          )}
                                      </span>
                                    </div>
                                    {compareFrom &&
                                      compareTo &&
                                      comparisonData &&
                                      comparisonData.length > 0 && (
                                        <div className="flex gap-1 text-[#4B9EF4]">
                                          <p>AVG</p> {":"}
                                          <span>
                                            {safelyAccessTableData(
                                              comparisonData[0],
                                              trends.slug,
                                              "avg"
                                            )}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                )}
                              </TableHead>
                            ))
                        ) : !isOpenState && !isSmartInsightEnabledForColumn ? (
                          <TableHead
                            key={trends.slug}
                            className="bg-[var(--background-secondary-color)] text-[var(--primary-text-color)] w-40 text-center border border-[var(--neutral-light-color)]"
                          ></TableHead>
                        ) : !isOpenState && isSmartInsightEnabledForColumn ? (
                          <TableHead
                            key={trends.slug}
                            style={{ width: 1000 }}
                            className="bg-[var(--background-secondary-color)] text-[var(--primary-text-color)] text-center p-0"
                          >
                            <div className="grid grid-cols-1 w-full h-full">
                              {trends.subHeading
                                .filter((cell) => cell.slug === "avg")
                                .map((cell) => (
                                  <div
                                    key={cell.subColumnName}
                                    className={`flex flex-col items-center justify-center text-center
                    border-x border-[var(--neutral-light-color)]
                    font-${
                      cell.fontWeight ?? "normal"
                    } text-[var(--primary-text-color)] gap-2`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <p
                                        className="text-center truncate max-w-[80px] relative group text-[var(--negative-color)] font-medium"
                                        style={{
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                        title={cell.subColumnName}
                                      >
                                        {cell.subColumnName.toUpperCase()} {":"}
                                      </p>

                                      <p className="text-[var(--negative-color)] font-medium">
                                        {tableData &&
                                          tableData.length > 0 &&
                                          safelyAccessTableData(
                                            tableData[0],
                                            trends.slug,
                                            "avg"
                                          )}
                                      </p>
                                    </div>
                                    {compareFrom &&
                                      compareTo &&
                                      comparisonData &&
                                      comparisonData.length > 0 && (
                                        <div className="flex items-center gap-2 text-[#4B9EF4]">
                                          <p className="font-medium">AVG :</p>
                                          <p className="font-medium">
                                            {safelyAccessTableData(
                                              comparisonData[0],
                                              trends.slug,
                                              "avg"
                                            )}
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                ))}
                            </div>
                          </TableHead>
                        ) : null;
                      } else {
                        return (
                          trends.slug !== "date" && (
                            <TableHead key={trends.slug} />
                          )
                        );
                      }
                    })}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {tableData &&
                tableData
                  .slice(startingLimit, endingLimit + 1)
                  .map((data, rowIndex) => renderTableRow(data, rowIndex))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div
            className={`mt-2 md:mt-4 sticky bottom-0 bg-background py-2 md:py-4 ${
              isMobileView ? "overflow-x-auto" : ""
            }`}
          >
            <Pagination>
              <PaginationContent
                className={`flex-wrap justify-center ${
                  isMobileView ? "text-xs gap-1" : ""
                }`}
              >
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {isMobileView ? (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(1)}
                        isActive={1 === currentPage}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    {currentPage > 1 && currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(currentPage)}
                          isActive={true}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(totalPages)}
                          isActive={totalPages === currentPage}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </>
                ) : (
                  renderPaginationItems()
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};

export default TestPeriodicAnalytics;
