"use client";
import Text from "@/components/new-ui/Text";
import SavedTrendsList from "@/components/newTrends/savedTrendsList";
import SaveTrend from "@/components/newTrends/saveTrend";
import TestPeriodicAnalytics from "@/components/newTrends/table-view/TestPeriodicAnalytics";
import ColumnsSelector from "@/components/search/columnSelector";
import DateRangeSelector from "@/components/search/dateRange";
import EventTypeSelector from "@/components/search/eventType";
import LocationSelector from "@/components/search/location";
import LineChartComponent from "@/components/trends/lineChart";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { isEventeli } from "@/config";
import { useFilterContext } from "@/context/filterContext";
import { columnsDropdown } from "@/data/trends";
import { NewColumn } from "@/data/trendsTableColHead";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useEventsService } from "@/services/eventsService";
import { useTrendsService } from "@/services/trendsService";
import { EventResponse } from "@/types/events";
import {
  EventTrendsResponse,
  GetSaveTrendData,
  TableData,
  TableGroupedHoliday,
  TEventColumnType,
} from "@/types/trends/trends";
import {
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  morphToSmartInsightsData,
  morphToTrendsTableData,
} from "@/utils/lineChart";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LineChart,
  Table,
  Filter,
  Calendar1,
  MapPin,
  BarChart3,
  Plus,
  ChevronDown,
  Search,
  Save,
  History,
  Settings,
  FilterX,
  Download,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import styles from "./trends.module.css";
import ZeroStateIcon from "/public/zero_state.svg";
import ZeroStateDataIcon from "/public/zero_state_data.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChartFilters } from "@/components/trendsChart/chart-filters";
import { getChartOptions, HierarchyLevel } from "@/utils/chart-options";
import TreemapView from "@/components/trends/treemap-view";
import CategorySelector from "@/components/search/categorySelector";

const ViewTemplates = [
  {
    id: "line",
    title: "Line Chart",
    description: "Track over time with interactive line graphs",
    icon: <LineChart className="w-6 h-6" />,
  },
  {
    id: "treemap",
    title: "Treemap",
    description: "Visualize hierarchical data with nested rectangles",
    icon: <LayoutGrid className="w-6 h-6" />,
  },
  {
    id: "table",
    title: "Table View",
    description: "Analyze detailed data in a structured format",
    icon: <Table className="w-6 h-6" />,
  },
];

const EventTrends = () => {
  const { searchParams } = useDefaultFilters();
  const { getEventTrends, getSavedTrends } = useTrendsService();
  const {
    applyFilters,
    setLocalFilter,
    getLocalFilterValue,
    deleteMultipleLocalFilters,
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
  const [tableData, setTableData] = useState<TableData[] | []>();
  const [tableColumns, setTableColumns] = useState<NewColumn[]>();
  const { getEventsWithSearchParams, getEventCountByCity, getEventsCount } =
    useEventsService();
  const [selectedEventType, setSelectedEventType] = useState<TEventColumnType>(
    () => {
      return columnsData[0] as TEventColumnType;
    }
  );
  const [showNotificationForm, setShowNotificationForm] =
    useState<boolean>(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<"line" | "treemap" | "table">(
    "line"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState([
    "Last 30 days events",
    "High impact events",
    "Popular venues",
  ]);
  const [filterCount, setFilterCount] = useState(0);
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([
    { id: "location", label: "Location", value: "location" },
    { id: "category", label: "Category", value: "category" },
  ]);
  const categories = getLocalFilterValue("categories");

  const stringParams = `groupBy=date&dateView=day&${searchParams.toString()}`;

  const apiParams = useMemo(() => {
    const params = new URLSearchParams({
      groupBy: "date",
      dateView: "day",
    });
    console.log(searchParams.toString());
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

  const holidaysByDate =
    (groupedData &&
      Object.values(groupedData).length > 0 &&
      Object.values(groupedData)) ||
    [];

  useEffect(() => {
    if (trendsData !== undefined) {
      setEventTrendsData(trendsData);
      setSelectedEventType(() => {
        return columnsData[0] as TEventColumnType;
      });
    }
  }, [trendsData]);

  useEffect(() => {
    const skip = searchParams.get("skip");

    if (!skip) {
      setIsSmartInsightsEnabled(false);

      setSelectedEventType(() => {
        return columnsData[0] as TEventColumnType;
      });

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

      const graphData = morphToGraphData(
        eventTrendsData.groupedData,
        selectedEventType
      );

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
  }, [eventTrendsData, selectedEventType]);

  useEffect(() => {
    if (trendsData === undefined) {
      setGraphData(undefined);
    }
  }, [trendsData]);

  useEffect(() => {
    const count = searchParams.toString().split("&").length;
    setFilterCount(count);
  }, [searchParams]);

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

  const handleSelectChange = (value: TEventColumnType) => {
    setSelectedEventType(value);
  };

  const handleClearFilters = () => {
    applyFilters({ resetPage: true });
  };

  const handleViewChange = (view: "line" | "treemap" | "table") => {
    setActiveView(view);
    if (view === "treemap") {
      const defaultCategories =
        "animals-pets,apparel-fashion,arts-crafts,automotive,baby-kids";
      setLocalFilter("categories", defaultCategories);
      applyFilters({ resetPage: true });
    }
  };

  return (
    <div
      className={`flex h-[calc(100vh-60px)] ${
        isFiltersCollapsed ? "pl-6" : "pl-0"
      }`}
    >
      {/* Enhanced Filters Sidebar */}
      <div
        className={`relative transition-all duration-300 ${
          isFiltersCollapsed ? "w-0" : "w-80"
        }`}
      >
        <div
          className={`h-full bg-background  flex flex-col ${
            isFiltersCollapsed ? "" : "border-r"
          }`}
        >
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold">Filters</h2>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <EventTypeSelector variant="popover" />
              <LocationSelector />
              <DateRangeSelector />
              {activeView === "treemap" && (
                <CategorySelector maxCategories={5} variant="accordion" />
              )}
              <ColumnsSelector
                view={activeView}
                selectedEventType={selectedEventType}
                handleSelectChange={handleSelectChange}
              />
              {activeView === "treemap" && (
                <ChartFilters
                  type="visitor-flow"
                  hierarchyLevels={hierarchyLevels}
                  setHierarchyLevels={setHierarchyLevels}
                />
              )}
            </div>
          </ScrollArea>

          <div
            className={`w-full bg-background z-10 transition-all duration-300 ${
              isFiltersCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="p-4 border-t bg-background/80 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  disabled={filterCount === 0}
                  className="text-xs text-[#6E6F89] hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
                >
                  <FilterX className="w-3.5 h-3.5 mr-1" />
                  Reset all filters
                </Button>
                <span className="text-xs text-[#6E6F89]">
                  {filterCount} filters applied
                </span>
              </div>
              {activeView === "treemap" && categories.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-2">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-destructive"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      Category Required
                    </p>
                    <p className="text-xs text-destructive/80">
                      Please select at least one category to view the treemap
                      visualization
                    </p>
                  </div>
                </div>
              )}
              <Button
                onClick={applyHandler}
                className="w-full h-10"
                disabled={
                  isLoading ||
                  (activeView === "treemap" && categories.length === 0)
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Apply Filters"
                )}
              </Button>

              {activeView !== "treemap" && (
                <SaveTrend
                  searchParams={searchParams}
                  isLoading={isLoading}
                  setShowNotificationForm={setShowNotificationForm}
                />
              )}
            </div>
          </div>
        </div>
        {!isFiltersCollapsed && (
          <button
            onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            className="group absolute -right-4 top-8 z-20 bg-background hover:bg-muted border border-border shadow-sm rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
          </button>
        )}

        {isFiltersCollapsed && (
          <div className="fixed left-[81px] top-[90px] z-30">
            <button
              onClick={() => setIsFiltersCollapsed(false)}
              className="group relative bg-white hover:bg-[#F8F8FA] border border-[#E6E6E6] shadow-sm rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
            >
              <Filter className="w-4 h-4 text-[#6E6F89] group-hover:text-primary transition-colors" />
              {filterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-[10px] font-medium text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 border-2 border-white">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto ${isFiltersCollapsed ? "pl-6" : ""}`}
      >
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold mb-1">
                  Trend Explorations
                </h1>
                <p className="text-sm text-muted-foreground">
                  Analyze and visualize event trends with different views
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* <Button variant="outline" size="sm" className="text-primary">
                  Template gallery
                </Button> */}
              </div>
            </div>

            {/* View Templates */}
            <div className="grid grid-cols-3 gap-4">
              {ViewTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer hover:border-primary/50 transition-colors ${
                    activeView === template.id ? "border-primary" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      template.id as "line" | "treemap" | "table"
                    )
                  }
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-primary">{template.icon}</div>
                      <h3 className="font-medium">{template.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Saved Trends List */}
          {savedTrendsList &&
            activeView !== "treemap" &&
            savedTrendsList?.trackers.length > 0 && (
              <div className="mb-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Saved Trends
                  </h3>
                  <SavedTrendsList
                    savedTrendsList={savedTrendsList?.trackers || []}
                  />
                </Card>
              </div>
            )}

          {/* Content Area */}

          {(activeView === "line" || activeView === "table") && (
            <div>
              {isLoading ? (
                <Loading />
              ) : error ? (
                <div className={styles.zeroState_container}>
                  <Image
                    src={ZeroStateIcon}
                    alt="zerostate"
                    width={150}
                    height={150}
                  />
                  <div>
                    Explore global trends across event types over the past
                    decade.
                  </div>
                </div>
              ) : graphData && graphData.length > 0 ? (
                <>
                  {activeView === "line" && (
                    <Card className="p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium absolute top-6 left-6">
                          Trend Analysis
                        </h2>
                      </div>
                      <div className={styles.predictedAttendence_container}>
                        <LineChartComponent
                          predictedData={graphData}
                          selectedEventType={selectedEventType}
                          holidayByDates={holidaysByDate}
                          threshold={
                            (eventTrendsData &&
                              eventTrendsData.thresholds[selectedEventType]) ??
                            0
                          }
                          showLegend
                        />
                      </div>
                    </Card>
                  )}

                  {activeView === "table" && (
                    <Card className="p-6">
                      <TestPeriodicAnalytics
                        isSmartInsightsEnabled={isSmartInsightsEnabled}
                        smartInsightState={smartInsightState}
                        setIsSmartInsightsEnabled={setIsSmartInsightsEnabled}
                        setSmartInsightState={setSmartInsightState}
                        data={
                          tableData && tableData.length > 0 ? tableData : []
                        }
                        tableColumns={tableColumns || []}
                        holidayByDates={holidaysByDate}
                      />
                    </Card>
                  )}
                </>
              ) : (
                <div className={styles.zeroState_container}>
                  <Image
                    src={ZeroStateDataIcon}
                    alt="zerostateData"
                    width={150}
                    height={150}
                  />
                  <p>No Events Found</p>
                  <Text
                    variant="noMargin"
                    color="secondary"
                    className="w-80 text-center"
                  >
                    Try selecting a different date range or broaden the location
                    to view events.
                  </Text>
                </div>
              )}
            </div>
          )}

          {activeView === "treemap" && (
            <Card className="p-6 min-h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Hierarchical View</h2>
              </div>
              <TreemapView hierarchyLevels={hierarchyLevels} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventTrends;
