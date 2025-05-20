import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Table from "@/app/components/Table/EventTable";
import EventCalendar from "@/components/eventCalendar";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import List from "@/components/search/list";
import { CalendarIcon, Globe, ListIcon, TableIcon, Filter, FilterX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCount from "@/components/search/eventCount";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useFilterState } from "@/hooks/useFilterState";
import { useFilterContext } from "@/context/filterContext";
import { useToast } from "@/hooks/use-toast";
import Alerts from "@/components/search/alerts";
import SortDropdown from "@/components/search/sortDropdown";
import { isEventeli } from "@/config";
import { CallBackProps, STATUS, Step } from "react-joyride";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterContent from "@/components/search/FilterContent";
const Map = lazy(() => import("@/components/map"));

const Events = () => {
  const { getFilterValue, setFilter } = useFilterState();
  const [showViewDropdown, setShowViewDropdown] = useState<boolean>(false);
  const { searchParams } = useDefaultFilters();
  const selectedView = getFilterValue("view") || "list";
  const { applyFilters, localFilters, deleteMultipleLocalFilters } = useFilterContext();
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const [view, setView] = useState<string>(searchParams.get("view") || "");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
    if (showFilters) setShowFilter(false);
  }, []);

  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState<boolean>(true);

  const saveSearchRef = useRef(null);

  const joyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (typeof window !== "undefined") {
        let walkthroughCompleted: string[] = JSON.parse(
          localStorage.getItem("walkthroughCompleted") || "[]"
        );

        if (!walkthroughCompleted.includes("research")) {
          walkthroughCompleted.push("research");

          localStorage.setItem(
            "walkthroughCompleted",
            JSON.stringify(walkthroughCompleted)
          );
        }
      }
      setRun(false);
    }
  };

  useEffect(() => {
    const newSteps: Step[] = [
      {
        target: saveSearchRef.current || "",
        title: "Save Search",
        content: "Save this search to add it as tracker",
        disableBeacon: true,
      },
    ];

    if (typeof window !== "undefined") {
      const walkthroughCompleted: string[] = JSON.parse(
        localStorage.getItem("walkthroughCompleted") || "[]"
      );
      if (!walkthroughCompleted.includes("research")) {
        setSteps(newSteps);
        setRun(true);
      }
    }
  }, []);

  const onTabsChange = (value: string) => {
    setFilter("view", value);
    setShowViewDropdown(false);
  };

  const toggleFilterHandler = () => {
    if (showFilters) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  const filtersCount = (function () {
    const excludedFilters = ["view", "sort", "offset", "limit", "active_gte", "active_lte"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  })();

  useEffect(() => {
    setView(searchParams.get("view") || "");
  }, [searchParams]);

  return (
    <div className="flex-1 relative md:w-[62%]">
      <div className={`md:px-6 transition-all duration-300`}>
        <Tabs
          defaultValue="list"
          value={selectedView}
          onValueChange={onTabsChange}
          className="mt-0"
        >
          <div
            className={`flex justify-between items-center !sticky !top-[128px] md:!top-0  bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 md:py-3 md:pt-4 px-4 pb-4 md:px-0`}
          >
            <EventCount view="events" />
            <div className="justify-center hidden md:flex">
              <TabsList className="grid w-[500px] grid-cols-4 h-auto bg-muted/50 p-1 rounded-lg">
                <TabsTrigger
                  value="table"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <TableIcon className="h-4 w-4" />
                  <span>Table</span>
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <ListIcon className="h-4 w-4" />
                  <span>List</span>
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <Globe className="h-4 w-4" />
                  <span>Map</span>
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="hidden md:flex justify-end gap-2 ">
              {/* <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled
              >
                <span className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  Export
                </span>
              </Button> */}
              {(selectedView === "list" ||
                selectedView === "table" ||
                selectedView == "") && <SortDropdown />}
            </div>

            <div className="flex md:hidden items-center justify-end gap-2">
              <Popover
                open={showViewDropdown}
                onOpenChange={setShowViewDropdown}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 border"
                  >
                    {selectedView === "list" ? (
                      <ListIcon className="w-4 h-4" />
                    ) : selectedView === "table" ? (
                      <TableIcon className="w-4 h-4" />
                    ) : selectedView === "map" ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <CalendarIcon className="w-4 h-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-2">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant={selectedView === "list" ? "secondary" : "ghost"}
                      className="justify-start flex items-center gap-2"
                      onClick={() => onTabsChange("list")}
                    >
                      <ListIcon className="h-4 w-4" />
                      <span>List View</span>
                    </Button>
                    {/* <Button
                      variant={selectedView === "table" ? "secondary" : "ghost"}
                      className="justify-start flex items-center gap-2"
                      onClick={() => onTabsChange("table")}
                    >
                      <TableIcon className="h-4 w-4" />
                      <span>Table View</span>
                    </Button> */}
                    <Button
                      variant={selectedView === "map" ? "secondary" : "ghost"}
                      className="justify-start flex items-center gap-2"
                      onClick={() => onTabsChange("map")}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Map View</span>
                    </Button>
                    <Button
                      variant={
                        selectedView === "calendar" ? "secondary" : "ghost"
                      }
                      className="justify-start flex items-center gap-2"
                      onClick={() => onTabsChange("calendar")}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span>Calendar View</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {(view == "list" || view == "table" || view == "") && <SortDropdown compact />}

              <Button
                onClick={toggleFilterHandler}
                variant={filtersCount > 0 ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 border relative"
              >
                <Filter className="w-4 h-4" />
                {filtersCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                    {filtersCount}
                  </div>
                )}
              </Button>
            </div>
          </div>
          {showFilters ? (
            <>
              <FilterContent
                type={"events"}
                filterCount={3}
                createTrackerHandler={() => {}}
                searchHandler={searchHandler}
              />
              <div className="w-full sticky bottom-0 bg-background z-10">
                <div className="p-4 pb-0 border-t bg-background/80 backdrop-blur-sm space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        deleteMultipleLocalFilters(
                          Object.keys(localFilters) as any[]
                        );
                      }}
                      disabled={filtersCount === 0}
                      className="text-xs text-[#6E6F89] hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
                    >
                      <FilterX className="w-3.5 h-3.5 mr-1" />
                      Reset all filters
                    </Button>
                    <span className="text-xs text-[#6E6F89]">
                      {filtersCount} filters applied
                    </span>
                  </div>
                  <Button onClick={searchHandler} className="w-full h-10">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <TabsContent
                value="list"
                className="flex-grow overflow-hidden mt-0"
              >
                {isEventeli && <Alerts />}
                <List />
              </TabsContent>
              <TabsContent value="table" className="flex-grow overflow-hidden">
                {isEventeli && <Alerts />}
                <Table />
              </TabsContent>
              <TabsContent value="map">
                <Map />
              </TabsContent>
              <TabsContent value="calendar">
                <Suspense fallback={<Loading />}>
                  <EventCalendar />
                </Suspense>
              </TabsContent>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
