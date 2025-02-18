"use client";

import Table from "@/app/components/Table/EventTable";
import ZeroState from "@/app/components/zerostate";
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
import { useEventsService } from "@/services/eventsService";
import { ApiError } from "@/types/api";
import {
  CalendarYearEventsResponse,
  CalendarMonthEventsResponse,
  CalendarWeekEventsResponse,
  Event,
  MapEventsResponse,
} from "@/types/events";
import { GAEvent } from "@/utils/GAEvent";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Tooltip from "@/app/components/internal/walkthrough/Tooltip";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import SortDropdown from "@/components/search/sortDropdown";
import EventCount from "@/components/search/eventCount";

const Map = lazy(() => import("@/components/map"));

interface GeoCoordinate {
  type: "geoCoordinate";
  lat: number;
  lng: number;
  radius: number;
}

interface LocationIds {
  type: "locationIds";
  id: string;
}

type LocationState = GeoCoordinate | LocationIds | null;

const Search = () => {
  const router = useRouter();
  const { navigateWithParams, getFilterValue, setFilter, setMultipleFilters } =
    useFilterState();

  const { getLocalFilterValue } = useFilterContext();
  const { searchParams } = useDefaultFilters();
  const eventService = useEventsService();
  const selectedView = getFilterValue("view") || "list";
  const { applyFilters, localFilters, clearLocalFilters, enabledFilters } =
    useFilterContext();
  const [view, setView] = useState<string>(searchParams.get("view") || "");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [trackerModalOpen, setTrackerModalOpen] = useState<boolean>(false);
  const [customTrackerName, setCustomTrackerName] = useState<string>("");
  const modifiedSearchParams = new URLSearchParams(searchParams.toString());
  const {
    data: eventData,
    error,
    isLoading,
    refetch,
  } = useQuery<
    | CalendarMonthEventsResponse
    | CalendarWeekEventsResponse
    | MapEventsResponse
    | undefined
  >({
    queryKey: ["events", searchParams.toString()],
    queryFn: () =>
      eventService.getEvents(
        Object.fromEntries(modifiedSearchParams.entries())
      ),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const displayData = eventData;

  const events = displayData?.events || [];
  const count = displayData?.count;

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

  // console.log(adaptedQueryString);

  const createTrackerHandler = async () => {
    GAEvent("research", "Filters", "Saved Filter | Viewed", "Saved Filter");

    if (!getFilterValue("locationIds")) {
      toast.error("Please select location", {
        position: "bottom-right",
        autoClose: 2000,
        // closeButton: false,
        hideProgressBar: true,
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
      console.log('Scroll position:', window.scrollY, 'isScrolled:', scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log(isScrolled);

  return (
    <div className="p-6">
      {steps.length > 0 && (
        <Joyride
          tooltipComponent={(props) => (
            <Tooltip {...props} totalSteps={steps.length} />
          )}
          steps={steps}
          run={run}
          callback={joyrideCallback}
          continuous
          spotlightPadding={0}
          showProgress
          showSkipButton
          disableScrolling
          disableOverlayClose
        />
      )}
      <SearchBar />
      <div className="w-full grid grid-cols-10 gap-4 border-b pb-6 mt-6">
        <div className="col-span-8 grid lg:grid-cols-4 grid-cols-3 gap-3">
          <EventTypeSelector />
          <CategorySelector />
          <EventFormatSelector />
          <LocationSelector />
          <DateRangeSelector />
          <StatusSelector />
          <EventEntrySelector />
          <UserRatingSelector />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-2">
          <div className="row-span-2 flex flex-col gap-3">
            <Button onClick={searchHandler} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
            <Button
              ref={saveSearchRef}
              variant="link"
              onClick={() => createTrackerHandler()}
              disabled={Object.keys(localFilters).length === 0}
            >
              <Plus
                width="15"
                height="15"
                className="w-4 h-w-4"
                color="#6750a4"
              />
              Save Search
            </Button>
          </div>
          <div className="row-span-2 flex flex-col gap-3">
            <Button
              disabled={Object.keys(localFilters).length == 0}
              variant="link"
              className="text-primary"
              onClick={() => clearLocalFilters()}
            >
              <FilterX className="w-4 h-4 hidden lg:block" />
              <span className="ml-1">Reset</span>
            </Button>

            <Button
              variant="link"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-destructive p-0 flex items-center"
            >
              <Filter className="h-4 w-4" />
              <span className="ml-1">
                {showAdvancedFilters ? (
                  <span className="hidden lg:block">Hide</span>
                ) : (
                  <>
                    <span className="hidden lg:block">Advanced</span>
                    <span className="lg:hidden">Adv</span>
                  </>
                )}{" "}
              </span>
              {filtersCount ? `(${filtersCount})` : ""}
            </Button>
          </div>
        </div>
      </div>
      {showAdvancedFilters && (
        <AdvancedFilters enabledFilters={enabledFilters} />
      )}

      <Tabs
        defaultValue="list"
        value={selectedView}
        onValueChange={onTabsChange}
        className="mt-0"
      >
        <div className={`flex justify-between items-center sticky top-0 bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 ${isScrolled ? 'py-2' : 'py-6'}`}>
          <EventCount />
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
            <SortDropdown />
          </div>
        </div>

        <TabsContent value="list" className="flex-grow overflow-hidden mt-0">
          {/* {isLoading ? (
            <Loading />
          ) : error ? (
            <ZeroState text={(error as ApiError).message} />
          ) : count == 0 ? (
            <ZeroState text="No events were found in the selected area." />
          ) : count == undefined ? (
            <div className="flex justify-center items-center">
              <ZeroState text="Discover insights on business trends filtered by geography and category, all in one glance." />
            </div>
          ) : (
            <> */}
          {/* <Alerts /> */}
          <List events={events as Event[]} count={count} />
          {/* </> */}
          {/* )} */}
        </TabsContent>

        <TabsContent value="table" className="flex-grow overflow-hidden">
          <Table />
        </TabsContent>
        <TabsContent value="map">
          {/* {isLoading ? (
            <Loading />
          ) : eventData?.count == 0 ? (
            <ZeroState text="No events were found in the selected area." />
          ) : error ? (
            <ZeroState text={(error as ApiError).message} />
          ) : ( */}
          <Map searchParams={searchParams.toString()} />
          {/* )} */}
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
  );
};

export default Search;