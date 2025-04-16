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
import { Filters, useFilterContext } from "@/context/filterContext";
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
  Building,
  UserSearch,
  Lock,
  Info,
  X,
  RotateCcw,
  PenLine,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TemplatesModal, { TemplateType } from "@/app/components/trends/templates-modal";
import { ActiveTemplateBadge } from "@/app/components/trends/active-template-badge";
import { TemplateHistory } from "@/app/components/trends/template-history";

const ViewTemplates = [
  {
    id: "treemap",
    title: "Treemap",
    description: "Visualize hierarchical data with nested rectangles",
    icon: <LayoutGrid className="w-6 h-6" />,
  },
  {
    id: "line",
    title: "Line Chart",
    description: "Track over time with interactive line graphs",
    icon: <LineChart className="w-6 h-6" />,
    disabledFor: ["inbound-traffic"],
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
    "treemap"
  );
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([
    { id: "location", label: "Location", value: "location" },
    { id: "category", label: "Category", value: "category" },
  ]);
  const [showSavedTrends, setShowSavedTrends] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(null);
  const [templateHistory, setTemplateHistory] = useState<TemplateType[]>([]);
  const [hasModifiedFilters, setHasModifiedFilters] = useState(false);
  const categories = getLocalFilterValue("categories");
  type FilterKey = 'location' | 'eventTypes' | 'dateRange' | 'categories' | 'metrics';
  
  const [visibleFilters, setVisibleFilters] = useState<Record<FilterKey, boolean>>({
    location: true,
    eventTypes: true,
    dateRange: true,
    categories: true,
    metrics: true
  });

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
    params.delete("categories");
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

  const handleViewChange = (view: "line" | "treemap" | "table") => {
    if (activeTemplate && !activeTemplate.visualization.includes(view)) {
      return; // Don't change view if not supported by template
    }
    setActiveView(view);
    if (view === "treemap" && categories.length === 0) {
      const defaultCategories = "technology,medical-pharma";
      setLocalFilter("categories", defaultCategories);
      applyFilters({ resetPage: true });
    }
  };

  const handleTemplateSelect = (template: TemplateType) => {
    // Set visualization type - use first available visualization
    const defaultView = template.visualization[0] as "line" | "treemap" | "table";
    handleViewChange(defaultView);
    
    // Update visible filters - ensure all properties are set
    const newVisibleFilters: Record<FilterKey, boolean> = {
      location: template.visibleFilters.location ?? true,
      eventTypes: template.visibleFilters.eventTypes ?? true,
      dateRange: template.visibleFilters.dateRange ?? true,
      categories: template.visibleFilters.categories ?? true,
      metrics: template.visibleFilters.metrics ?? true
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
      metrics: true
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

  return (
    <div
      className={`flex h-[calc(100vh-60px)] ${
        isFiltersCollapsed ? "pl-6" : "pl-0"
      }`}
    >
      {/* Enhanced Filters Sidebar */}
      <div
        className={`relative transition-all duration-300 ${
          isFiltersCollapsed ? "w-0" : "w-[370px]"
        }`}
      >
        <div
          className={`h-full bg-background  flex flex-col ${
            isFiltersCollapsed ? "" : "border-r"
          }`}
        >
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid grid-cols-3 w-full h-auto bg-muted p-1 rounded-lg">
                  <TabsTrigger
                    value="events"
                    className="text-sm flex gap-2 items-center p-2 w-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Calendar1 className="w-4 h-4" />
                    Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="companies"
                    className="text-sm flex gap-2 items-center p-2 w-full data-[state=active]:bg-background data-[state=active]:shadow-sm relative"
                    disabled
                  >
                    <Lock className="w-4 h-4" />
                    Companies
                  </TabsTrigger>
                  <TabsTrigger
                    value="people"
                    className="text-sm flex gap-2 items-center p-2 w-full data-[state=active]:bg-background data-[state=active]:shadow-sm relative"
                    disabled
                  >
                    <Lock className="w-4 h-4" />
                    People
                  </TabsTrigger>
                </TabsList>
                <div className="mt-3 p-3 bg-[var(--background-secondary-color)] h-full">
                  <TabsContent value="events" className="mt-4 space-y-4">
                    {visibleFilters.eventTypes && <EventTypeSelector variant="popover" />}
                    {visibleFilters.location && <LocationSelector />}
                    {visibleFilters.dateRange && <DateRangeSelector />}
                    {activeView === "treemap" && visibleFilters.categories && (
                      <CategorySelector maxCategories={5} variant="accordion" />
                    )}
                    {visibleFilters.metrics && <ColumnsSelector
                      activeView={activeView}
                      setActiveView={setActiveView}
                      selectedEventType={selectedEventType}
                      handleSelectChange={handleSelectChange}
                    />}
                    {activeView === "treemap" && (
                      <ChartFilters
                        type="visitor-flow"
                        hierarchyLevels={hierarchyLevels}
                        setHierarchyLevels={setHierarchyLevels}
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="companies" className="mt-4">
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      <div className="text-center">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Company filters coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="people" className="mt-4">
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      <div className="text-center">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">People filters coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
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
                  onClick={() => {
                    deleteMultipleLocalFilters(
                      Object.keys(localFilters) as any[]
                    );
                  }}
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

              <SaveTrend
                searchParams={searchParams}
                isLoading={isLoading}
                setShowNotificationForm={setShowNotificationForm}
              />
            </div>
          </div>
        </div>
        {!isFiltersCollapsed && (
          <button
            onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            className="group absolute -right-4 top-[52px] z-20 bg-background hover:bg-muted border border-border shadow-sm rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
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
              <h1 className="text-xl font-semibold">
                {showTemplates ? "Trend Templates" : "Trend Explorations"}
              </h1>
              {!showTemplates && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary"
                    onClick={() => setShowSavedTrends(!showSavedTrends)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {showSavedTrends ? "Hide Saved Trends" : "Show Saved Trends"}
                  </Button>
                  {!activeTemplate && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary"
                      onClick={() => setShowTemplatesModal(true)}
                    >
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                  )}
                </div>
              )}
            </div>

            {!showTemplates && activeTemplate && (
              <div className="relative">
                <div className="flex items-center justify-between bg-card border shadow-sm rounded-lg p-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {activeTemplate.icon}
                    </div>
                    <div>
                      <div className="font-medium mb-0.5">{activeTemplate.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {activeTemplate.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary/20"
                      onClick={() => setShowTemplatesModal(true)}
                    >
                      <PenLine className="w-4 h-4 mr-1.5" />
                      Change Template
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={handleTemplateRemove}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showSavedTrends && !showTemplates && savedTrendsList && (
              <div className="mt-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Saved Trends
                  </h3>
                  {savedTrendsList?.trackers.length > 0 ? (
                    <SavedTrendsList savedTrendsList={savedTrendsList?.trackers} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <div className="text-center space-y-2">
                        <Save className="w-10 h-10 mx-auto text-primary/50" />
                        <p className="text-sm font-medium">No saved trends yet</p>
                        <p className="text-xs text-muted-foreground/70">
                          Save your favorite trend configurations to access them later
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* View Templates */}
          {showTemplates ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ViewTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-6 cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                  onClick={() => {
                    handleViewChange(template.id as "line" | "treemap" | "table");
                    setShowTemplates(false);
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {ViewTemplates.map((template) => {
                const isDisabled = activeTemplate && !activeTemplate.visualization.includes(template.id);
                return (
                  <Card
                    key={template.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeView === template.id ? "border-primary" : ""
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"}`}
                    onClick={() => {
                      if (!isDisabled) {
                        handleViewChange(template.id as "line" | "treemap" | "table");
                      }
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${isDisabled ? "text-muted-foreground" : "text-primary"}`}>
                            {template.icon}
                          </div>
                          <h3 className={`font-medium ${isDisabled ? "text-muted-foreground" : ""}`}>
                            {template.title}
                          </h3>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className={`w-4 h-4 ${
                                isDisabled ? "text-muted-foreground" : "text-muted-foreground hover:text-primary"
                              }`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {isDisabled
                                  ? "This visualization is not available for the current template"
                                  : template.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Content Area */}
          {!showTemplates && (
            <>
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
                <Card className="p-4 min-h-[600px]">
                  <TreemapView hierarchyLevels={hierarchyLevels} />
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <TemplatesModal
        open={showTemplatesModal}
        onOpenChange={setShowTemplatesModal}
        onSelectTemplate={handleTemplateSelect}
        activeTemplate={activeTemplate}
      />
    </div>
  );
};

export default EventTrends;
