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
import { useQuery } from "@/hooks/useQuery";
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
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./trends.module.css";
import { useToast } from "@/hooks/use-toast";
import { isEventeli } from "@/config";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const gtmViewTemplates = [
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

const geoViewTemplates = [
  {
    id: "line",
    title: "Line Chart",
    description: "Track over time with interactive line graphs",
    icon: <LineChart className="w-6 h-6" />,
    disabledFor: ["inbound-traffic"],
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
  const { getFilterValue } = useFilterState();
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const metric = getFilterValue("columns").split(",");
  const ViewTemplates = isEventeli ? geoViewTemplates : gtmViewTemplates;

  const activeView = (getFilterValue("view") as "line" | "treemap" | "table")
    ? (getFilterValue("view") as "line" | "treemap" | "table")
    : ViewTemplates[0].id;

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
  const [showMandatoryFieldsWarning, setShowMandatoryFieldsWarning] =
    useState(false);
  const categories = getLocalFilterValue("categories");
  const locations = getLocalFilterValue("locationIds");
  const dateRange =
    getLocalFilterValue("active_gte") && getLocalFilterValue("active_lte");
  const metrics = getLocalFilterValue("columns");
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
    const lineExcludedFilters = [
      "active_gte",
      "view",
      "show",
      "categories",
      "status",
      "compare_to",
      "compare_from",
      "activeCard",
      "activeCardName",
      "editTrend",
    ];
    const treemapExcludedFilters = [
      "active_gte",
      "view",
      "show",
      "status",
      "compare_to",
      "compare_from",
      "activeCard",
      "activeCardName",
      "editTrend",
    ];
    const excludedFilters =
      activeView == "treemap" ? treemapExcludedFilters : lineExcludedFilters;
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
    } else if (
      (view === "line" || view === "table") &&
      (!locations || locations.length === 0)
    ) {
      // Set default location ID for line chart and table view if no location is selected
      setMultipleLocalFilters({
        locationIds: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
        view: view,
      });
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

  // Add effect for mandatory fields warning
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (
      (activeView === "line" || activeView === "table") &&
      (!locations ||
        locations.length === 0 ||
        !dateRange ||
        !metrics ||
        metrics.length === 0)
    ) {
      timeoutId = setTimeout(() => {
        setShowMandatoryFieldsWarning(true);
      }, 1000); // 1 second delay
    } else {
      setShowMandatoryFieldsWarning(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeView, locations, dateRange, metrics]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: "URL Copied",
      description: "Link copied to clipboard",
      duration: 2000,
    });
  };

  const handleToggleSavedTrends = () => {
    if (showFilters) setShowFilters(false);
    setShowSavedTrends(!showSavedTrends);
  };

  return (
    <div
      className={`${isMobileView ? "relative" : "flex h-[calc(100vh-60px)]"} ${
        !isMobileView && isFiltersCollapsed ? "pl-6" : "pl-0"
      }`}
    >
      {/* Mobile Filters Overlay */}
      {/* {isMobileView && !isFiltersCollapsed && (
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
                    const filtersToDelete = Object.keys(localFilters).filter(
                      (key) => key !== "view"
                    );
                    deleteMultipleLocalFilters(filtersToDelete as any[]);
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
              {(activeView === "line" || activeView === "table") &&
                showMandatoryFieldsWarning && (
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
                        Required Fields Missing
                      </p>
                      <p className="text-xs text-destructive/80">
                        Please select location, date range, and at least one
                        metric to view the{" "}
                        {activeView === "line" ? "line chart" : "table"}{" "}
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
                  disabled={
                    (activeView === "treemap" && categories.length === 0) ||
                    ((activeView === "line" || activeView === "table") &&
                      (!locations ||
                        locations.length === 0 ||
                        !dateRange ||
                        !metrics ||
                        metrics.length === 0))
                  }
                >
                  Apply
                </Button>
              </div>
              <SaveTrend searchParams={searchParams} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )} */}

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
            <div className="flex-1 overflow-auto">
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
            </div>

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
                      const filtersToDelete = Object.keys(localFilters).filter(
                        (key) => key !== "view"
                      );
                      deleteMultipleLocalFilters(filtersToDelete as any[]);
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
                {(activeView === "line" || activeView === "table") &&
                  showMandatoryFieldsWarning && (
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
                          Required Fields Missing
                        </p>
                        <p className="text-xs text-destructive/80">
                          Please select location, date range, and at least one
                          metric to view the{" "}
                          {activeView === "line" ? "line chart" : "table"}{" "}
                          visualization
                        </p>
                      </div>
                    </div>
                  )}
                <Button
                  onClick={applyHandler}
                  className="w-full h-10"
                  disabled={
                    (activeView === "treemap" && categories.length === 0) ||
                    ((activeView === "line" || activeView === "table") &&
                      (!locations ||
                        locations.length === 0 ||
                        !dateRange ||
                        !metrics ||
                        metrics.length === 0))
                  }
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
            <div className="fixed left-[16px] lg:left-[81px] top-[90px] z-30">
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
        className={`${
          isMobileView
            ? "w-full min-h-screen flex flex-col bg-[#fafbfc]"
            : "flex-1 overflow-auto"
        } ${isFiltersCollapsed && !isMobileView ? "pl-6" : ""}`}
      >
        {/* MOBILE LAYOUT */}
        {isMobileView ? (
          <>
            {/* Tabs */}
            <div className="w-full px-2 pt-2">
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
              </Tabs>
            </div>

            {/* Trends Visualisations & Templates */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-medium">
                  Trends Visualisations
                </span>
                <Badge
                  variant="default"
                  className="text-xs font-medium px-2 py-0.5 h-5"
                >
                  Beta
                </Badge>
              </div>
              <button
                className="text-primary text-xs font-medium"
                onClick={() => setShowTemplatesModal(true)}
              >
                Templates &rarr;
              </button>
            </div>

            {/* Dropdown for Tree Map - custom trigger with icon+label */}
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2">
                <Select
                  value={activeView}
                  onValueChange={(val) => {
                    handleViewChange(val as "line" | "treemap" | "table");
                  }}
                >
                  <SelectTrigger className="flex-1 bg-white rounded-xl shadow px-4 py-2 h-auto min-h-[44px] border-none focus:ring-0">
                    <span className="!flex items-center">
                      {activeView === "line" && (
                        <LineChart className="w-5 h-5 text-gray-500 mr-2" />
                      )}
                      {activeView === "table" && (
                        <Table className="w-5 h-5 text-gray-500 mr-2" />
                      )}
                      {activeView === "treemap" && (
                        <LayoutGrid className="w-5 h-5 text-gray-500 mr-2" />
                      )}
                      <span className="font-medium text-base text-gray-800">
                        {activeView === "line"
                          ? "Line Chart"
                          : activeView === "table"
                          ? "Table View"
                          : "Tree Map"}
                      </span>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treemap">
                      <span className="flex items-center">
                        <LayoutGrid className="w-5 h-5 text-gray-500 mr-2" />
                        Tree Map
                      </span>
                    </SelectItem>
                    <SelectItem value="line">
                      <span className="flex items-center">
                        <LineChart className="w-5 h-5 text-gray-500 mr-2" />
                        Line Chart
                      </span>
                    </SelectItem>
                    <SelectItem value="table">
                      <span className="flex items-center">
                        <Table className="w-5 h-5 text-gray-500 mr-2" />
                        Table View
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {/* Bookmark Button */}
                <button
                  onClick={handleToggleSavedTrends}
                  className="relative bg-white rounded-lg border border-gray-200 shadow px-2 py-2 flex items-center justify-center"
                >
                  <Bookmark className="w-5 h-5 text-primary" />
                </button>
                {/* Filter Button with Badge */}
                <button
                  className="relative bg-white rounded-lg border border-gray-200 shadow px-2 py-2 flex items-center justify-center"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-5 h-5 text-primary" />
                  {filterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                      {filterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Content Area for mobile */}

            {showFilters ? (
              <div className="p-3 bg-[var(--background-secondary-color)]">
                <div className="space-y-4">
                  {visibleFilters.eventTypes && (
                    <EventTypeSelector variant="popover" />
                  )}
                  {visibleFilters.location && <LocationSelector />}
                  {visibleFilters.dateRange && <DateRangeSelector />}
                  {activeView === "treemap" && visibleFilters.categories && (
                    <CategorySelector maxCategories={5} variant="accordion" />
                  )}
                  {visibleFilters.metrics && <ColumnsSelector />}
                  {activeView === "treemap" && (
                    <ChartFilters
                      type="visitor-flow"
                      hierarchyLevels={hierarchyLevels}
                      setHierarchyLevels={setHierarchyLevels}
                    />
                  )}
                </div>
              </div>
            ) : (
              <>
                {showSavedTrends && !showTemplates && savedTrendsList && (
                  <Card className="p-3 md:p-4 border-none md:border rounded-none md:rounded">
                    <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                      <Save className="w-4 h-4 md:w-5 md:h-5" />
                      Saved Trends
                    </h3>
                    {savedTrendsList?.trackers.length > 0 ? (
                      <SavedTrendsList
                        savedTrendsList={savedTrendsList?.trackers}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 md:h-40 text-muted-foreground">
                        <div className="text-center space-y-1.5 md:space-y-2">
                          <Save className="w-8 h-8 md:w-10 md:h-10 mx-auto text-primary/50" />
                          <p className="text-xs md:text-sm font-medium">
                            No saved trends yet
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground/70 max-w-[200px] md:max-w-none">
                            Save your favorite trend configurations to access
                            them later
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                )}
                {activeView === "line" && (
                  <Card className="p-2 pb-36 md:pb-4 relative rounded-none md:rounded border-none md:border">
                    <div className=" hidden md:flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium px-2 py-1">
                        Trend Analysis
                      </h2>
                    </div>

                    <LineChartComponent showLegend />
                  </Card>
                )}
                {activeView === "table" && (
                  <Card className="p-0 pb-36 md:pb-0 overflow-hidden border-none md:border rounded-none md:rounded">
                    <div className="overflow-x-auto max-w-[100vw] pb-4">
                      <TestPeriodicAnalytics />
                    </div>
                  </Card>
                )}
                {activeView === "treemap" && (
                  <Card className="p-2 pb-36 md:pb-0 min-h-[400px] border-none md:border rounded-none md:rounded">
                    <TreemapView hierarchyLevels={hierarchyLevels} />
                  </Card>
                )}
              </>
            )}

            {/* Footer for mobile, matching the provided design */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 z-50">
              <div className="flex items-center justify-between mb-3">
                <button
                  className="text-red-500 flex items-center text-xs font-medium"
                  onClick={() => {
                    const filtersToDelete = Object.keys(localFilters).filter(
                      (key) => key !== "view"
                    );
                    deleteMultipleLocalFilters(filtersToDelete as any[]);
                  }}
                  disabled={filterCount === 0}
                >
                  <FilterX className="w-4 h-4 mr-1" />
                  Reset Filters
                </button>
                <span className="text-xs text-primary font-medium">
                  {filterCount} Filters applied
                </span>
              </div>
              {showFilters && (
                <button
                  className="w-full bg-primary text-white rounded-md py-2 mb-2 font-semibold text-base disabled:opacity-50"
                  onClick={() => {
                    applyHandler();
                    setShowFilters(false);
                  }}
                  disabled={
                    (activeView === "treemap" && categories.length === 0) ||
                    ((activeView === "line" || activeView === "table") &&
                      (!locations ||
                        locations.length === 0 ||
                        !dateRange ||
                        !metrics ||
                        metrics.length === 0))
                  }
                >
                  Apply Filters
                </button>
              )}
              <div className="flex gap-2 flex-col">
                {!showFilters && (
                  <SaveTrend
                    searchParams={searchParams}
                    isLoading={isLoading}
                  />
                )}
                <Button
                  variant="outline"
                  className="w-full h-10"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Trend
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile Filter Button - Always visible at the top on mobile */}
            {isMobileView && (
              <div className="sticky top-0 z-40 bg-background p-3 border-b mb-2">
                <Button
                  variant="outline"
                  size="default"
                  className={`w-full flex items-center justify-between h-12 rounded-lg transition-all duration-200 ${
                    filterCount > 0
                      ? "bg-primary/5 border-primary/30 hover:bg-primary/10"
                      : "bg-muted/30 border-border hover:bg-muted"
                  }`}
                  onClick={() => setIsFiltersCollapsed(false)}
                >
                  <div className="flex items-center">
                    <Filter
                      className={`w-4 h-4 mr-2 ${
                        filterCount > 0
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        filterCount > 0 ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {filterCount > 0
                        ? `${filterCount} Active Filter${
                            filterCount > 1 ? "s" : ""
                          }`
                        : "Filter Results"}
                    </span>
                  </div>
                  {filterCount > 0 && (
                    <div className="flex items-center">
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 font-medium">
                        {filterCount}
                      </span>
                      <ChevronLeft className="w-4 h-4 ml-2 text-primary rotate-180" />
                    </div>
                  )}
                </Button>
              </div>
            )}

            <div className={`${isMobileView ? "px-2 py-2" : "px-6 py-4"}`}>
              <div className="mb-4">
                <div
                  className={`flex ${
                    isMobileView
                      ? "flex-col gap-2"
                      : "items-center justify-between"
                  } mb-4`}
                >
                  <h1 className="text-xl font-semibold">
                    {showTemplates ? "Trend Templates" : "Trend Explorations"}
                  </h1>
                  <div
                    className={`flex ${
                      isMobileView ? "justify-start" : ""
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
                              Save your favorite trend configurations to access
                              them later
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
                              <div className="text-primary">
                                {template.icon}
                              </div>
                              <h3 className={`font-medium`}>
                                {template.title}
                              </h3>
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
                          <Card className="p-2 pb-4 md:p-6 relative">
                            <div className="hidden md:flex items-center justify-between mb-4">
                              <h2 className="text-lg font-medium absolute top-6 left-6">
                                Trend Analysis
                              </h2>
                            </div>
                            <div
                              className={`${
                                styles.predictedAttendence_container
                              } ${isMobileView ? "" : ""} overflow-x-auto`}
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
          </>
        )}
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
