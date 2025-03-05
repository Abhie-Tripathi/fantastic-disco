"use client";

import Table from "@/app/components/Table/EventTable";
import EventCalendar from "@/components/eventCalendar";
import AdvancedFilters from "@/components/search/advancedFilters";
import UserRatingSelector from "@/components/search/userRatingSelector";
import CategorySelector from "@/components/search/categorySelector";
import CreateTrackerDialog from "@/components/search/createTrackerDialog";
import DateRangeSelector from "@/components/search/dateRange";
import EventEntrySelector from "@/components/search/eventEntry";
import EventFormatSelector from "@/components/search/eventFormat";
import EventTypeSelector from "@/components/search/eventType";
import LocationSelector from "@/components/search/location";
import SearchBar from "@/components/search/searchbar";
import StatusSelector from "@/components/search/status";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import List from "@/components/search/list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { GAEvent } from "@/utils/GAEvent";
import {
  ArrowUpRight,
  CalendarIcon,
  Filter,
  FilterX,
  Globe,
  ListIcon,
  Loader2,
  Plus,
  TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Tooltip from "@/app/components/internal/walkthrough/Tooltip";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import SortDropdown from "@/components/search/sortDropdown";
import EventCount from "@/components/search/eventCount";
import { isEventeli } from "@/config";
import Alerts from "@/components/search/alerts";
import Filters from "@/components/search/Filters";
const Map = lazy(() => import("@/components/map"));
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const { getFilterValue, setFilter } = useFilterState();
  const { searchParams } = useDefaultFilters();
  const selectedView = getFilterValue("view") || "list";
  const { applyFilters, localFilters, clearLocalFilters, enabledFilters } =
    useFilterContext();
  const [view, setView] = useState<string>(searchParams.get("view") || "");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(true);

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
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
  };

  const createTrackerHandler = async () => {
    GAEvent("research", "Filters", "Saved Filter | Viewed", "Saved Filter");

    if (!getFilterValue("locationIds")) {
      toast({
        title: "Please select location",
        variant: "destructive",
      });
    } else {
      setTrackerModalOpen(true);
    }
  };

  const filtersCount = (function () {
    let count = 0;
    if (
      localFilters.onlyBranded === "true" ||
      localFilters.onlySeries === "true"
    )
      count++;
    if (localFilters.frequencies) count++;
    if (localFilters.includeKeywords || localFilters.excludeKeywords) count++;
    if (localFilters.maturity) count++;
    if (localFilters.estimatedVisitors) count++;
    if (localFilters.impact_score_gte) count++;
    if (localFilters.top) count++;
    return count;
  })();
  useEffect(() => {
    setView(searchParams.get("view") || "");
  }, [searchParams]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
      console.log("Scroll position:", window.scrollY, "isScrolled:", scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoading = false;

  return (
    <div className="flex relative">
      <div
        className={`transition-all duration-300 sticky top-0 h-screen overflow-hidden ${
          isFiltersPanelOpen ? "w-[342px]" : "w-0"
        }`}
      >
        <div
          className={`h-full w-[342px] ${
            isFiltersPanelOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <Filters />
        </div>
      </div>
      <div className="flex-1 relative">
        <div className={`px-6 transition-all duration-300`}>
          <Tabs
            defaultValue="list"
            value={selectedView}
            onValueChange={onTabsChange}
            className="mt-0"
          >
            <div
              className={`flex justify-between items-center sticky top-0 bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 py-3`}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters</span>
                  {isFiltersPanelOpen ? (
                    <ChevronLeft className="h-4 w-4 text-muted-foreground ml-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" />
                  )}
                </Button>
                <EventCount />
              </div>
              <div className="flex justify-center">
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
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled
                >
                  <span className="flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" />
                    Export
                  </span>
                </Button>
                {(selectedView === "list" ||
                  selectedView === "table" ||
                  selectedView == "") && <SortDropdown />}
              </div>
            </div>

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
          </Tabs>

          <CreateTrackerDialog
            open={trackerModalOpen}
            onOpenChange={setTrackerModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
