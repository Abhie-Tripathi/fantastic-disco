"use client";
import { TemplateType } from "@/app/components/trends/templates-modal";
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
import { Filters, useFilterContext } from "@/context/filterContext";
import { columnsDropdown } from "@/data/trends";
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
} from "@/types";
import { EventResponse } from "@/types/events";
import { GetSaveTrendData } from "@/types/trends/trends";
import { HierarchyLevel } from "@/utils/chart-options";
import { renderFormattedDates } from "@/utils/dateFormat";
import {
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  morphToSmartInsightsData,
  morphToTrendsTableData,
  sortingTableData,
} from "@/utils/lineChart";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWide,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { useEffect, useMemo, useState } from "react";
import styles from "./TableAnalytics.module.css";
import CollapseIcon from "/public/collapse.svg";
import HolidayIcon from "/public/eventType/holiday.svg";
import ExpandIcon from "/public/expandColumn.svg";
import SmartInsights from "/public/smartInsights.svg";
import DisableSmartInsights from "/public/smartInsightsColored.svg";
import EnableSmartInsights from "/public/smartInsightsDisable.svg";

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

const TestPeriodicAnalytics = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({});
  const [tableData, setTableData] = useState<TableData[] | []>();
  const { setFilter, getFilterValue } = useFilterState();
  const [sortingColumnOrder, setSortingColumnOrder] = useState<{
    order: "asc" | "desc";
    eventType: keyof TableData | null;
  }>({ order: "asc", eventType: null });
  const { searchParams } = useDefaultFilters();
  const { getEventTrends, getSavedTrends } = useTrendsService();
  const {
    applyFilters,
    setLocalFilter,
    getLocalFilterValue,
    setMultipleLocalFilters,
    deleteMultipleLocalFilters,
    localFilters,
  } = useFilterContext();
  const columns = searchParams.get("columns");
  const editTrend = searchParams.get("editTrend");
  const eventTypes = searchParams.get("eventTypes");
  const eventTypesArray = eventTypes ? eventTypes.split(",") : [];
  const hasHoliday =
    eventTypesArray.length > 0 ? eventTypesArray.includes("holiday") : false;
  const enableEditTrend = editTrend ? Boolean(editTrend) : false;
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
  const [graphData, setGraphData] = useState<any>();
  const [tableColumns, setTableColumns] = useState<ExtendedNewColumn[]>();
  const { getEventsWithSearchParams } = useEventsService();
  const metric = getFilterValue("columns") as
    | "eventCount"
    | "predictedAttendance"
    | "inboundEstimate"
    | "internationalEstimate";
  const activeView = (getFilterValue("view") as "line" | "treemap" | "table")
    ? (getFilterValue("view") as "line" | "treemap" | "table")
    : "treemap";
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([
    { id: "location", label: "Location", value: "location" },
    { id: "category", label: "Category", value: "category" },
  ]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(
    null
  );
  const [templateHistory, setTemplateHistory] = useState<TemplateType[]>([]);
  const [hasModifiedFilters, setHasModifiedFilters] = useState(false);
  const categories = getLocalFilterValue("categories");
  type FilterKey =
    | "location"
    | "eventTypes"
    | "dateRange"
    | "categories"
    | "metrics";

  const [visibleFilters, setVisibleFilters] = useState<
    Record<FilterKey, boolean>
  >({
    location: true,
    eventTypes: true,
    dateRange: true,
    categories: true,
    metrics: true,
  });

  const stringParams = `groupBy=date&dateView=day&${searchParams.toString()}`;

  const apiParams = useMemo(() => {
    const params = new URLSearchParams({
      groupBy: "date",
      dateView: "day",
    });

    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    return params.toString();
  }, [stringParams]);

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

  const { data: holdiayData } = useQuery({
    queryKey: ["holiday", updatedParams],
    queryFn: async () => await getEventsWithSearchParams(updatedParams),
    enabled: isEventeli && hasHoliday,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const { data: savedTrendsList } = useQuery<GetSaveTrendData>({
    queryKey: ["getSavedTrends"],
    queryFn: async () => {
      const result = await getSavedTrends();
      if (!result) throw new Error("Failed to fetch saved trends");
      return result;
    },
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

  const filterCount = useMemo(() => {
    const excludedFilters = ["active_gte", "active_lte"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  }, [localFilters]);

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

  useEffect(() => {
    const eventTypes = searchParams.get("eventTypes")?.split(",") || [];
    const columns = searchParams.get("columns")?.split(",") || [];
    if (eventTrendsData && eventTrendsData.groupedData) {
      const tableColumns = generateTrendsTableColumnHeaders(
        eventTypes,
        columns
      );

      const graphData = morphToGraphData(eventTrendsData.groupedData, metric);

      const tableData = morphToTrendsTableData(
        eventTrendsData.thresholds,
        eventTrendsData.groupedData,
        eventTypes
      );

      const smartInsightsData = morphToSmartInsightsData(tableData);

      setGraphData(graphData);
      setTableData(smartInsightsData);
      setTableColumns(tableColumns);
    }
  }, [eventTrendsData, metric]);

  useEffect(() => {
    if (trendsData === undefined) {
      setGraphData(undefined);
    }
  }, [trendsData]);

  const applyHandler = () => {
    const columnsValue = columnsDropdown
      .filter(
        (dropdown) =>
          dropdown.value !== "impactScore" &&
          dropdown.value !== "economicImpact"
      )
      .map((filteredValue) => filteredValue.value)
      .join(",");
    if (getLocalFilterValue("eventTypes").length > 0) {
      setLocalFilter("columns", columnsValue);
      setLocalFilter("status", "active,cancelled,postponed");
      setLocalFilter("show", "alerts,scores,economicImpact");
    }
    applyFilters({ resetPage: true });
  };

  const handleViewChange = (view: "line" | "treemap" | "table") => {
    if (activeTemplate && !activeTemplate.visualization.includes(view)) {
      return; // Don't change view if not supported by template
    }
    if (view === "treemap") {
      if (categories.length === 0) {
        const defaultCategories = "technology,medical-pharma";
        setMultipleLocalFilters({ categories: defaultCategories, view: view });
      }
      setMultipleLocalFilters({ columns: "eventCount", view: view });
    }
    setLocalFilter("view", view);
    applyFilters({ resetPage: true });
  };

  const handleTemplateSelect = (template: TemplateType) => {
    // Set visualization type - use first available visualization
    const defaultView = template.visualization[0] as
      | "line"
      | "treemap"
      | "table";
    handleViewChange(defaultView);

    // Update visible filters - ensure all properties are set
    const newVisibleFilters: Record<FilterKey, boolean> = {
      location: template.visibleFilters.location ?? true,
      eventTypes: template.visibleFilters.eventTypes ?? true,
      dateRange: template.visibleFilters.dateRange ?? true,
      categories: template.visibleFilters.categories ?? true,
      metrics: template.visibleFilters.metrics ?? true,
    };
    setVisibleFilters(newVisibleFilters);

    // Set hierarchy levels if provided in template
    if (template.hierarchy) {
      setHierarchyLevels(template.hierarchy);
    } else {
      // Set default hierarchy levels
      setHierarchyLevels([
        { id: "location", label: "Location", value: "location" },
        { id: "category", label: "Category", value: "category" },
      ]);
    }

    // Set active template and update history
    setActiveTemplate(template);
    setTemplateHistory((prev) => {
      const filtered = prev.filter((t) => t.id !== template.id);
      return [template, ...filtered].slice(0, 10); // Keep last 10 templates
    });
    setHasModifiedFilters(false);

    // Close modal and templates view
    setShowTemplatesModal(false);
    setShowTemplates(false);

    // Apply filters
    applyFilters({ resetPage: true });
  };

  const handleTemplateRemove = () => {
    setActiveTemplate(null);
    // Reset visible filters to show all
    const defaultFilters: Record<FilterKey, boolean> = {
      location: true,
      eventTypes: true,
      dateRange: true,
      categories: true,
      metrics: true,
    };
    setVisibleFilters(defaultFilters);
    applyFilters({ resetPage: true });
    setHasModifiedFilters(false);
  };

  // Track filter changes
  useEffect(() => {
    if (!activeTemplate) return;

    // Track filter changes by comparing current filter values with template's visible filters
    const hasChanged = Object.entries(visibleFilters).some(
      ([key, isVisible]) => {
        if (!isVisible) return false;
        // Only check filters that are visible
        const filterKey = key as keyof typeof visibleFilters;
        if (!activeTemplate.visibleFilters[filterKey]) return false;

        // Check if the filter has a value
        const currentValue = getLocalFilterValue(filterKey as keyof Filters);
        return currentValue && currentValue.length > 0;
      }
    );

    setHasModifiedFilters(hasChanged);
  }, [localFilters, activeTemplate, visibleFilters]);

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

  const startDate =
    (tableData && tableData[0] && convertToLongDate(tableData[0].date ?? "")) ||
    "";
  // const startDate = data && data[0] && formatDate(new Date(data[0]), "dd MMM yyyy");
  const endDate =
    (tableData &&
      tableData[tableData.length - 1] &&
      convertToLongDate(tableData[tableData.length - 1].date ?? "")) ||
    "";
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

  if (isLoading) {
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
      <div className={styles.analytics_header}>
        <div className={styles.analytics_header_title}>
          {`FOR THE SELECTED TIME PERIODS (${renderFormattedDates(
            startDate,
            endDate
          )})`}
        </div>
        <div className="flex gap-2 items-center px-3 py-3 border border-[var(--neutral-light-color)] rounded-sm">
          {/* <Image src={SmartInsights} width={18} height={18} alt={""} /> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-2 cursor-pointer">
                  <Image src={SmartInsights} width={18} height={18} alt={""} />
                  <p className="text-primary m-0 font-normal">Smart Insights</p>
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
          <Switch
            checked={isSmartInsightsEnabled}
            onCheckedChange={() => setIsSmartInsightsEnabled((prev) => !prev)}
            disabled={Object.keys(smartInsightState).length === 0}
          ></Switch>
        </div>
      </div>
      <div className={styles.table_container}>
        <div className="w-full">
          <Table className="border border-[var(--neutral-light-color) w-[98%] mx-auto relative">
            <TableHeader>
              <TableRow>
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
                        style={{ width: 1000 }}
                        className={`text-center bg-[rgb(250,250,250)] text-[#171717] border border-[var(--neutral-light-color)] relative ${
                          trends.slug === "date" ? "sticky left-0 z-30" : ""
                        }`}
                      >
                        {trends.slug === "date" &&
                          trends.columnName.toUpperCase()}
                        {trends.slug !== "date" && (
                          <div className="flex items-center justify-center mx-auto gap-4 h-inherit w-60">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className={`cursor-pointer text-sm font-medium`}
                                  >
                                    {trends.columnName.toUpperCase()}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="w-64 tooltip-content-styles ">
                                  <p className="font-medium text-left text-[var(--secondary-text-color)]">
                                    {trends.tooltipDescription ||
                                      trends.columnName}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Select>
                              <SelectTrigger className="w-5 h-5 focus:outline-none z-20 top-3 right-10 bg-white p-0 border-2 rounded-sm border-[#EBEBEBBB]"></SelectTrigger>
                              <SelectContent>
                                <SelectGroup className="flex flex-col gap-4 p-4">
                                  <div className="flex gap-4 items-center">
                                    <p className="text-sm">SORT BY</p>
                                    <button
                                      className={`${
                                        sortingColumnOrder.eventType ===
                                          trends.slug &&
                                        sortingColumnOrder.order === "asc"
                                          ? "border-[#6750A4]"
                                          : "border-[#EBEBEBBB]"
                                      }flex items-center w-6 h-6 border-2 rounded-sm`}
                                    >
                                      <ArrowUpNarrowWide
                                        color="#7D7D7D"
                                        className="cursor-pointer w-5"
                                        onClick={() =>
                                          sortingData(
                                            trends.slug as keyof TableData,
                                            "asc"
                                          )
                                        }
                                      />
                                    </button>
                                    <button
                                      className={`${
                                        sortingColumnOrder.eventType ===
                                          trends.slug &&
                                        sortingColumnOrder.order === "desc"
                                          ? "border-[#6750A4]"
                                          : "border-[#EBEBEBBB]"
                                      }flex items-center w-6 h-6 border-2 rounded-sm`}
                                    >
                                      <ArrowDownWideNarrow
                                        color="#7D7D7D"
                                        className="cursor-pointer w-5"
                                        onClick={() =>
                                          sortingData(
                                            trends.slug as keyof TableData,
                                            "desc"
                                          )
                                        }
                                      />
                                    </button>
                                  </div>

                                  <div className="flex gap-4 items-center">
                                    <p className="text-sm">
                                      {`Turn
                                    ${
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
                                      width={30}
                                      height={30}
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
                                  className="absolute z-20 top-2 -right-3 bg-white"
                                  onClick={() => toggleOpenState(trends.slug)}
                                >
                                  <Image
                                    className="p-1 z-30 shadow-lg flex items-center justify-center rounded-md border border-[#EBEBEB] aspect-auto"
                                    src={
                                      openState[trends.slug ?? ""]
                                        ? CollapseIcon
                                        : ExpandIcon
                                    }
                                    alt="TableIcons"
                                    width={25}
                                    height={25}
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
                <TableRow>
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
                                className={`bg-[rgb(250,250,250)] text-[#171717] w-40 text-center border border-[var(--neutral-light-color)] ${
                                  cell.slug === "value" ? "py-2" : ""
                                }`}
                              >
                                <div
                                  className={`flex items-center w-20 mx-auto font-${
                                    cell.fontWeight ?? "normal"
                                  } justify-center text-[var(${
                                    cell.color
                                  })] gap-2`}
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
                                  <div className="flex justify-center gap-1 text-[var(--negative-color)] font-medium items-center border-t mt-1 pt-2">
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
                                )}
                              </TableHead>
                            ))
                        ) : !isOpenState && !isSmartInsightEnabledForColumn ? (
                          <TableHead
                            key={trends.slug}
                            className="bg-[rgb(250,250,250)] text-[#171717] w-40 text-center border border-[var(--neutral-light-color)]"
                          ></TableHead>
                        ) : !isOpenState && isSmartInsightEnabledForColumn ? (
                          <TableHead
                            key={trends.slug}
                            style={{ width: 1000 }}
                            className="bg-[rgb(250,250,250)] text-[#171717] text-center p-0"
                          >
                            <div className="grid grid-cols-1 w-full h-full">
                              {trends.subHeading
                                .filter((cell) => cell.slug === "avg")
                                .map((cell) => (
                                  <div
                                    key={cell.subColumnName}
                                    className={`flex items-center justify-center text-center
                    border-x border-[var(--neutral-light-color)]
                    font-${cell.fontWeight ?? "normal"} text-[var(${
                                      cell.color
                                    })] gap-2`}
                                  >
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
                  .map((data, rowIndex) => {
                    return (
                      <TableRow
                        key={`row-${rowIndex}`}
                        className="cursor-pointer"
                        onClick={() =>
                          redirectTo(
                            "/internal/search/events",
                            data["date"],
                            data["date"]
                          )
                        }
                      >
                        {tableColumns &&
                          tableColumns.map((trends) => {
                            const key = (trends.slug as keyof TableData) || "";
                            if (key === "date") {
                              const isHoliday =
                                holidaysByDate &&
                                holidaysByDate.length > 0 &&
                                holidaysByDate.some(
                                  (holiday) => holiday.date === data[key]
                                );
                              const holidayMatch = holidaysByDate?.find(
                                (holiday) => holiday.date === data[key]
                              );
                              const count = holidayMatch?.count || 0;
                              const holidays = holidayMatch?.holidays || [];

                              return (
                                <TableCell
                                  key={key}
                                  width={100}
                                  className={`text-center font-semibold text-[#6750a4] flex items-center justify-center w-full sticky left-0 z-30 bg-white`}
                                >
                                  {isEventeli ? (
                                    isHoliday ? (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex">
                                              <Image
                                                width={20}
                                                height={20}
                                                className="cursor-pointer"
                                                src={HolidayIcon}
                                                alt="Holiday Icon"
                                              />
                                              {count && count > 1 && (
                                                <sup className="w-2 h-2">
                                                  {count}
                                                </sup>
                                              )}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent
                                            asChild
                                            className="w-fit tooltip-content-styles"
                                            side="right"
                                          >
                                            <ul
                                              className={`flex flex-col gap-2 ${
                                                holidays && holidays.length > 1
                                                  ? "list-disc pl-6"
                                                  : "list-none pl-4"
                                              } pt-2 pr-4`}
                                            >
                                              {holidays &&
                                                holidays.length > 0 &&
                                                holidays.map((holidayName) => (
                                                  <li
                                                    className="font-medium"
                                                    key={`holiday-${holidayName}`}
                                                  >
                                                    {holidayName}
                                                  </li>
                                                ))}
                                            </ul>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ) : (
                                      <div className="flex items-center opacity-0">
                                        <Image
                                          width={20}
                                          height={20}
                                          src={HolidayIcon}
                                          alt="Holiday Icon"
                                        />
                                        <sup className="w-2 h-2">{count}</sup>
                                      </div>
                                    )
                                  ) : null}
                                  <div className="w-40 flex justify-center">
                                    <p>
                                      {key !== undefined &&
                                        format(
                                          new Date(data[key]),
                                          "dd MMM yyyy"
                                        )}
                                    </p>
                                  </div>
                                </TableCell>
                              );
                            }
                            const cellData = data[key];
                            const isSmartInsightEnabledForColumn =
                              smartInsightState[trends.slug ?? ""];
                            const isOpenState = openState[trends.slug ?? ""];
                            const subHeading = trends.subHeading;
                            if (cellData) {
                              return subHeading &&
                                isSmartInsightEnabledForColumn &&
                                isOpenState ? (
                                subHeading
                                  .filter((heading) => heading.slug !== "avg")
                                  .map((subCol) => (
                                    <TableCell
                                      key={subCol.slug}
                                      width={100}
                                      className={`p-0 h-[53px] w-32 border border-[var(--neutral-light-color)]`}
                                    >
                                      <div
                                        className={`text-center w-full h-full flex gap-2 items-center justify-center font-semibold text-[#000]
                                ${
                                  subCol.slug === "avg" &&
                                  isSmartInsightEnabledForColumn
                                    ? "bg-[#DA2F35] bg-opacity-5 text-[#DF2670]"
                                    : ""
                                }
                                ${
                                  isSmartInsightEnabledForColumn &&
                                  cellData["maxRow"] &&
                                  subCol.slug !== "avg" &&
                                  subCol.slug !== "value" &&
                                  cellData["maxRow"] ===
                                    cellData[subCol.slug as keyof EventTypeData]
                                    ? cellData["thresholdHighlightRow"]
                                    : ""
                                }
                                ${
                                  isSmartInsightEnabledForColumn &&
                                  subCol.slug === "value"
                                    ? cellData["thresholdHighlightCol"]
                                    : ""
                                }
                                  ${
                                    isSmartInsightEnabledForColumn &&
                                    subCol.slug === "value" &&
                                    cellData["maxCol"] === cellData["value"]
                                      ? "border-2 border-[var(--negative-color)]"
                                      : ""
                                  }`}
                                      >
                                        {
                                          cellData[
                                            subCol.slug as keyof EventTypeData
                                          ]
                                        }
                                        {cellData["thresholdHighlightCol"] ===
                                          "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" &&
                                          subCol.slug === "value" && (
                                            <ArrowUp width={15} height={15} />
                                          )}
                                        {cellData["thresholdHighlightCol"] ===
                                          "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" &&
                                          subCol.slug === "value" && (
                                            <ArrowDown
                                              width={15}
                                              height={15}
                                              color="#E1313A"
                                            />
                                          )}
                                      </div>
                                    </TableCell>
                                  ))
                              ) : !isSmartInsightEnabledForColumn &&
                                !isOpenState ? (
                                <TableCell
                                  key={key}
                                  width={100}
                                  className={`text-center font-semibold border border-[var(--neutral-light-color)] text-[#000] ${
                                    isSmartInsightEnabledForColumn
                                      ? `${cellData["thresholdHighlightCol"]} ${
                                          cellData["maxCol"] ===
                                            cellData["value"] &&
                                          "border-2 border-[var(--negative-color)]"
                                        }`
                                      : ""
                                  }`}
                                >
                                  {cellData["value"] ?? 0}
                                </TableCell>
                              ) : subHeading &&
                                isSmartInsightEnabledForColumn &&
                                !isOpenState ? (
                                <TableCell
                                  key={key}
                                  width={1000}
                                  className={`w-[1000px] h-[52px] p-0 ${
                                    cellData["maxCol"] === cellData["value"]
                                      ? "border-2 border-[var(--negative-color)]"
                                      : "border-[#EBEBEB]"
                                  }`}
                                >
                                  <div className="grid grid-cols-1 w-full h-full">
                                    {subHeading
                                      .filter(
                                        (subCol) => subCol.slug === "value"
                                      )
                                      .map((subCol, index) => {
                                        return (
                                          <div
                                            key={subCol.slug}
                                            className={`h-full text-center gap-2 justify-center font-semibold text-[#000] flex items-center ${
                                              subCol.slug === "avg" &&
                                              isSmartInsightEnabledForColumn &&
                                              "bg-[#DA2F35] bg-opacity-5 text-[#DF2670]"
                                            }   ${
                                              isSmartInsightEnabledForColumn &&
                                              subCol.slug === "value" &&
                                              cellData["thresholdHighlightCol"]
                                            }`}
                                          >
                                            <p>
                                              {subCol.slug === "avg"
                                                ? cellData["avg"]
                                                : subCol.slug === "value"
                                                ? cellData["value"]
                                                : null}
                                            </p>

                                            {cellData[
                                              "thresholdHighlightCol"
                                            ] ===
                                              "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" &&
                                              subCol.slug === "value" && (
                                                <ArrowUp
                                                  width={15}
                                                  height={15}
                                                />
                                              )}
                                            {cellData[
                                              "thresholdHighlightCol"
                                            ] ===
                                              "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" &&
                                              subCol.slug === "value" && (
                                                <ArrowDown
                                                  width={15}
                                                  height={15}
                                                  color="#E1313A"
                                                />
                                              )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </TableCell>
                              ) : subHeading &&
                                !isSmartInsightEnabledForColumn &&
                                isOpenState ? (
                                subHeading
                                  .filter((heading) => heading.slug !== "avg")
                                  .map((subCol) => (
                                    <TableCell
                                      key={subCol.slug}
                                      width={100}
                                      className="p-0 h-[52px] w-32 border border-[var(--neutral-light-color)]"
                                    >
                                      <div
                                        className={`flex text-center items-center justify-center w-full h-full font-semibold text-[#000]`}
                                      >
                                        {
                                          cellData[
                                            subCol.slug as keyof EventTypeData
                                          ]
                                        }
                                      </div>
                                    </TableCell>
                                  ))
                              ) : null;
                            } else {
                              return (
                                <TableCell
                                  key={key}
                                  width={100}
                                  className="text-center font-semibold border border-[var(--neutral-light-color)] text-[#0000]"
                                >
                                  0
                                </TableCell>
                              );
                            }
                          })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-4 sticky bottom-0 bg-white py-4">
              <Pagination>
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
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
      </div>
    </>
  );
};

export default TestPeriodicAnalytics;
