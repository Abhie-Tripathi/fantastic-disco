"use client";
import TemplatesModal, {
  TemplateType,
} from "@/app/components/trends/templates-modal";
import SavedTrendsList from "@/components/newTrends/savedTrendsList";
import SaveTrend from "@/components/newTrends/saveTrend";
import TestPeriodicAnalytics from "@/components/newTrends/table-view/TestPeriodicAnalytics";
import CategorySelector from "@/components/search/categorySelector";
import ColumnsSelector from "@/components/search/columnSelector";
import DateRangeSelector from "@/components/search/dateRange";
import EventTypeSelector from "@/components/search/eventType";
import LocationSelector from "@/components/search/location";
import LineChartComponent from "@/components/trends/lineChart";
import TreemapView from "@/components/trends/treemap-view";
import { ChartFilters } from "@/components/trendsChart/chart-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filters, useFilterContext } from "@/context/filterContext";
import { NewColumn } from "@/data/trendsTableColHead";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
import { useTrendsService } from "@/services/trendsService";
import {
  EventTrendsResponse,
  GetSaveTrendData,
  TableData,
} from "@/types/trends/trends";
import { HierarchyLevel } from "@/utils/chart-options";
import {
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  morphToSmartInsightsData,
  morphToTrendsTableData,
} from "@/utils/lineChart";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar1,
  ChevronLeft,
  Filter,
  FilterX,
  Info,
  LayoutGrid,
  LineChart,
  Lock,
  Save,
  Share2,
  Table,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./trends.module.css";
import { useToast } from "@/hooks/use-toast";

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
  const { getSavedTrends } = useTrendsService();
  const { toast } = useToast();
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
  const [tableData, setTableData] = useState<TableData[] | []>();
  const [tableColumns, setTableColumns] = useState<NewColumn[]>();
  const { getEventsWithSearchParams } = useEventsService();
  const { getFilterValue } = useFilterState();
  const [setShowNotificationForm] = useState<boolean>(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
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
  const [showSavedTrends, setShowSavedTrends] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(
    null
  );
  const [templateHistory, setTemplateHistory] = useState<TemplateType[]>([]);
  const [hasModifiedFilters, setHasModifiedFilters] = useState(false);
  const [showCategoryWarning, setShowCategoryWarning] = useState(false);
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

  const { data: savedTrendsList, isLoading: isLoading } =
    useQuery<GetSaveTrendData>({
      queryKey: ["getSavedTrends"],
      queryFn: async () => {
        const result = await getSavedTrends();
        if (!result) throw new Error("Failed to fetch saved trends");
        return result;
      },
    });

  const filterCount = useMemo(() => {
    const excludedFilters = ["active_gte", "active_lte"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  }, [localFilters]);

  const [isMobileView, setIsMobileView] = useState(false);

  // Make sure the filter state works correctly for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      // Only auto-collapse when resizing from desktop to mobile
      if (window.innerWidth < 768) {
        setIsFiltersCollapsed(true);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  }, [searchParams]);

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

  const applyHandler = () => {
    if (getLocalFilterValue("eventTypes").length > 0) {
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

  // Add delay for showing category warning
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeView === "treemap" && categories.length === 0) {
      timeoutId = setTimeout(() => {
        setShowCategoryWarning(true);
      }, 1000); // 1 second delay
    } else {
      setShowCategoryWarning(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeView, categories]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    const url = currentUrl.replace('/internal/', 'redirect=');

    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Link copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div
      className={`${isMobileView ? "relative" : "flex h-[calc(100vh-60px)]"} ${
        !isMobileView && isFiltersCollapsed ? "pl-6" : "pl-0"
      }`}
    >
      {/* Mobile Filters Overlay */}
      {isMobileView && !isFiltersCollapsed && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFiltersCollapsed(true)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
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
                      {visibleFilters.eventTypes && (
                        <EventTypeSelector variant="popover" />
                      )}
                      {visibleFilters.location && <LocationSelector />}
                      {visibleFilters.dateRange && <DateRangeSelector />}
                      {activeView === "treemap" &&
                        visibleFilters.categories && (
                          <CategorySelector
                            maxCategories={5}
                            variant="accordion"
                          />
                        )}
                      {visibleFilters.metrics && <ColumnsSelector />}
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

            <div className="sticky bottom-0 w-full bg-background/80 backdrop-blur-sm py-4 space-y-3 border-t mt-4">
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
              {activeView === "treemap" &&
                categories.length === 0 &&
                showCategoryWarning && (
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
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsFiltersCollapsed(true)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    applyHandler();
                    setIsFiltersCollapsed(true);
                  }}
                  className="w-full"
                  disabled={activeView === "treemap" && categories.length === 0}
                >
                  Apply
                </Button>
              </div>
              <SaveTrend searchParams={searchParams} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filters Sidebar for desktop */}
      {!isMobileView && (
        <div
          className={`relative transition-all duration-300 ${
            isFiltersCollapsed ? "w-0" : "w-[370px]"
          }`}
        >
          <div
            className={`h-full bg-background flex flex-col ${
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
                      {visibleFilters.eventTypes && (
                        <EventTypeSelector variant="popover" />
                      )}
                      {visibleFilters.location && <LocationSelector />}
                      {visibleFilters.dateRange && <DateRangeSelector />}
                      {activeView === "treemap" &&
                        visibleFilters.categories && (
                          <CategorySelector
                            maxCategories={5}
                            variant="accordion"
                          />
                        )}
                      {visibleFilters.metrics && <ColumnsSelector />}
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
                {activeView === "treemap" &&
                  categories.length === 0 &&
                  showCategoryWarning && (
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
                          Please select at least one category to view the
                          treemap visualization
                        </p>
                      </div>
                    </div>
                  )}
                <Button
                  onClick={applyHandler}
                  className="w-full h-10"
                  disabled={activeView === "treemap" && categories.length === 0}
                >
                  Apply Filters
                </Button>

                <SaveTrend searchParams={searchParams} isLoading={isLoading} />
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
      )}

      {/* Main Content */}
      <div
        className={`${isMobileView ? "w-full" : "flex-1 overflow-auto"} ${
          isFiltersCollapsed && !isMobileView ? "pl-6" : ""
        }`}
      >
        {/* Mobile Filter Button - Always visible at the top on mobile */}
        {isMobileView && (
          <div className="sticky top-0 z-40 bg-background p-3 border-b mb-2">
            <Button
              variant="outline"
              size="default"
              className="w-full bg-muted/30 border border-border hover:bg-muted flex items-center justify-center h-10"
              onClick={() => setIsFiltersCollapsed(false)}
            >
              <Filter className="w-4 h-4 mr-2 text-primary" />
              <span>Filter Results</span>
              {filterCount > 0 && (
                <span className="ml-2 bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 font-medium">
                  {filterCount}
                </span>
              )}
            </Button>
          </div>
        )}

        <div className={`${isMobileView ? "px-2 py-2" : "px-6 py-4"}`}>
          <div className="mb-4">
            <div
              className={`flex ${
                isMobileView ? "flex-col gap-2" : "items-center justify-between"
              } mb-4`}
            >
              <h1 className="text-xl font-semibold">
                {showTemplates ? "Trend Templates" : "Trend Explorations"}
              </h1>
              <div
                className={`flex ${
                  isMobileView ? "flex-wrap justify-between" : ""
                } items-center gap-2`}
              >
                {!showTemplates && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary"
                      onClick={() => setShowSavedTrends(!showSavedTrends)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {showSavedTrends
                        ? "Hide Saved Trends"
                        : "Show Saved Trends"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary"
                      onClick={() => setShowTemplatesModal(true)}
                    >
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary"
                            onClick={handleShare}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy URL to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </div>
            </div>

            {showSavedTrends && !showTemplates && savedTrendsList && (
              <div className="mt-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Saved Trends
                  </h3>
                  {savedTrendsList?.trackers.length > 0 ? (
                    <SavedTrendsList
                      savedTrendsList={savedTrendsList?.trackers}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <div className="text-center space-y-2">
                        <Save className="w-10 h-10 mx-auto text-primary/50" />
                        <p className="text-sm font-medium">
                          No saved trends yet
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          Save your favorite trend configurations to access them
                          later
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
                    handleViewChange(
                      template.id as "line" | "treemap" | "table"
                    );
                    setShowTemplates(false);
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {template.title}
                        </h3>
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
            <div
              className={`grid ${
                isMobileView ? "grid-cols-1 gap-2" : "grid-cols-3 gap-4"
              } mb-4`}
            >
              {ViewTemplates.map((template) => {
                return (
                  <Card
                    key={template.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeView === template.id ? "border-primary" : ""
                    } `}
                    onClick={() => {
                      handleViewChange(
                        template.id as "line" | "treemap" | "table"
                      );
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-primary">{template.icon}</div>
                          <h3 className={`font-medium`}>{template.title}</h3>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info
                                className={`w-4 h-4 text-muted-foreground hover:text-primary`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{template.description}</p>
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
                  <>
                    {activeView === "line" && (
                      <Card
                        className={`${
                          isMobileView ? "p-2 pb-4" : "p-6"
                        } relative`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2
                            className={`text-lg font-medium ${
                              isMobileView
                                ? "px-2 py-1"
                                : "absolute top-6 left-6"
                            }`}
                          >
                            Trend Analysis
                          </h2>
                        </div>
                        <div
                          className={`${styles.predictedAttendence_container} ${
                            isMobileView ? "h-[350px]" : ""
                          } overflow-x-auto`}
                        >
                          <LineChartComponent showLegend />
                        </div>
                      </Card>
                    )}

                    {activeView === "table" && (
                      <Card
                        className={`${
                          isMobileView ? "p-0 overflow-hidden" : "p-6"
                        }`}
                      >
                        <div
                          className={`overflow-x-auto ${
                            isMobileView ? "max-w-[100vw] pb-4" : ""
                          }`}
                        >
                          <TestPeriodicAnalytics />
                        </div>
                      </Card>
                    )}
                  </>
                </div>
              )}

              {activeView === "treemap" && (
                <Card
                  className={`${
                    isMobileView ? "p-2 min-h-[400px]" : "p-4 min-h-[600px]"
                  }`}
                >
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
      />
    </div>
  );
};

export default EventTrends;
