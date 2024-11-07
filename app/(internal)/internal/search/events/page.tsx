"use client";

import AdvancedFilters from "@/components/search/advancedFilters";
import UserRatingSelector from "@/components/search/userRatingSelector";
import CategorySelector from "@/components/search/categorySelector";
import DateRangeSelector from "@/components/search/dateRange";
import EventCalendar from "@/components/eventCalendar";
import EventEntrySelector from "@/components/search/eventEntry";
import EventFormatSelector from "@/components/search/eventFormat";
import EventTypeSelector from "@/components/search/eventType";
import List from "@/components/search/list";
import LocationSelector from "@/components/search/location";
import SearchBar from "@/components/search/searchbar";
import StatusSelector from "@/components/search/status";
import Loading from "@/components/ui/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterContext } from "@/context/filterContext";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
import {
  CalendarEvent,
  CalendarMonthEvent,
  CalendarMonthEventsResponse,
  CalendarWeekEventsResponse,
  Event,
  EventsResponse,
  MapEventsResponse,
} from "@/types/events";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2, Filter, Cross } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, lazy, use, useCallback, useEffect, useState } from "react";
import Table from "@/app/components/Table";
import { EventsAdapter } from "@/adapters/eventsAdapter";
import { showToast } from "@/utils/showToast";
import moment from "moment";
import {
  Button as Button10x,
  Dialog as Dialog10x,
  DialogContent as DialogContent10x,
  DialogTitle as DialogTitle10x,
  Input as Input10x,
} from "10xui";
import { GAEvent } from "@/utils/GAEvent";
import { BaseURL } from "@/config";
import { myFetch } from "@/utils/myFetch";
import { toast } from "react-toastify";
import styles from "./search.module.css";
import ZeroState from "@/app/components/zerostate";
import { ApiError } from "@/types/api";
import CreateTrackerDialog from "@/components/search/createTrackerDialog";

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
  const eventService = useEventsService();
  const selectedView = getFilterValue("view") || "list";
  const { applyFilters, setMultipleLocalFilters } = useFilterContext();
  const searchParams = useSearchParams();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [trackerModalOpen, setTrackerModalOpen] = useState<boolean>(false);
  const [customTrackerName, setCustomTrackerName] = useState<string>("");
  const {
    data: eventData,
    error,
    isLoading,
    refetch,
  } = useQuery<
    | CalendarMonthEventsResponse
    | CalendarWeekEventsResponse
    | EventsResponse
    | MapEventsResponse
    | undefined
  >({
    queryKey: ["events", searchParams.toString()],
    queryFn: () =>
      eventService.getEventsWithSearchParams(searchParams.toString()),
    enabled:
      !!searchParams.toString() &&
      !(selectedView == "list" || selectedView == "") &&
      !(
        Array.from(searchParams.values()).length == 0 ||
        (Array.from(searchParams.values()).length == 1 &&
          (Array.from(searchParams.values())[0] == "list" ||
            Array.from(searchParams.values())[0] == "calendar" ||
            Array.from(searchParams.values())[0] == "map"))
      ),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  // console.log(Array.from(searchParams.values()));

  const displayData = eventData;
  const events = displayData?.events || [];
  const count = displayData?.count || 0;

  // console.log(events);

  const searchHandler = useCallback(() => {
    applyFilters();
  }, []);

  const adaptedParams = EventsAdapter.adaptRequestParams(searchParams);

  const adaptedQueryString = (function () {
    if (!searchParams.toString()) return;
    delete adaptedParams.offset;
    delete adaptedParams.max;
    delete adaptedParams.sortBy;
    delete adaptedParams.sortType;
    return new URLSearchParams(adaptedParams).toString();
  })();

  const onTabsChange = (value: string) => {
    setFilter("view", value);
  };

  const selectedInsights = {
    eventSize: true,
    eventKeywords: true,
    eventRank: adaptedParams.shows?.includes("eventRanking"),
    matchScore: adaptedParams.keywords ? true : false,
    growth: false,
    eventSeries: adaptedParams.shows?.includes("eventSeries"),
    brandedEvent: adaptedParams.shows?.includes("eventBrand"),
    global: false,
    reptSent: false,
    eventRating: adaptedParams.shows?.includes("eventRating"),
    estExhibit: adaptedParams.shows?.includes("estimatedExhibitScore"),
    repeatSent: adaptedParams.trustScore ? true : false,
    maturity: adaptedParams.shows?.includes("maturity"),
    impactScore: adaptedParams.shows?.includes("eventImpactScore"),
    inboundScore: adaptedParams.shows?.includes("inboundScore"),
    internationalScore: adaptedParams.shows?.includes("internationalScore"),
    forecasted: adaptedParams.shows?.includes("isforecasted"),
    audienceZone: adaptedParams.shows?.includes("audienceZone"),
    audienceSpread: adaptedParams.audienceSpread ? true : false,
    eventFrequency: adaptedParams.shows?.includes("eventFrequency"),
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
console.log(searchParams.toString());

  return (
    <div className="space-y-6 p-6">
      <SearchBar />
      <div className="w-full grid grid-cols-10 gap-4 border-b pb-6">
        <div className="col-span-8 grid grid-cols-4 gap-3">
          <EventTypeSelector source="search"/>
          <CategorySelector source="search"/>
          <EventFormatSelector source="search"/>
          <LocationSelector source="search"/>
          <DateRangeSelector source="search"/>
          <StatusSelector source="search"/>
          <EventEntrySelector source="search"/>
          <UserRatingSelector source="search"/>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <Button
            size="lg"
            onClick={searchHandler}
            disabled={isLoading}
            className="text-white"
          >
            {isLoading || !tableLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
          <div className="flex items-center justify-evenly">
            <Button
              variant="link"
              className="p-0 block text-wrap"
              onClick={createTrackerHandler}
            >
              Save as Tracker
            </Button>
            <Button
              variant="link"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-destructive p-0 flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvancedFilters ? "Hide" : "Advanced"}
            </Button>
          </div>
        </div>
      </div>
      {showAdvancedFilters && <AdvancedFilters />}

      <Tabs
        defaultValue="list"
        value={selectedView}
        onValueChange={onTabsChange}
      >
        <div className="grid grid-cols-3 items-center mb-6">
          {/* <div className="flex items-center gap-2">
            <Badge className="bg-primary text-white">{count}</Badge>
            <p className="text-primary font-semibold">Events Found</p>
          </div> */}
          <div></div>
          <div className="flex justify-center">
            <TabsList className="grid w-[450px] grid-cols-3 h-auto">
              <TabsTrigger value="list" className="text-base">
                List
              </TabsTrigger>
              <TabsTrigger value="map" className=" text-base">
                Map
              </TabsTrigger>
              <TabsTrigger value="calendar" className=" text-base">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled
                  variant="link"
                  className="text-primary hover:text-primary/90 hover:bg-purple-50"
                >
                  Export
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>{/* <ExportModal /> */}</DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="list" className="flex-grow overflow-hidden">
          {isLoading ? (
            <Loading />
          ) : (
            <Table
              showInsights={selectedInsights}
              queryString={adaptedQueryString}
              setRequestExhausted={() => {}}
              handleButtonLoading={() => setTableLoading}
            />
          )}
        </TabsContent>
        <TabsContent value="map">
          {/* <Suspense fallback={<Loading />}> */}
          {isLoading ? (
            <Loading />
          ) : eventData?.count == 0 ? (
            <ZeroState text="No events were found in the selected area." />
          ) : error ? (
            <ZeroState text={(error as ApiError).message} />
          ) : (
            <Map searchParams={searchParams.toString()} />
          )}
          {/* </Suspense> */}
        </TabsContent>
        <TabsContent value="calendar">
          {/* <Suspense fallback={<Loading />}> */}
          {isLoading ? (
            <Loading />
          ) : eventData?.count == 0 ? (
            <ZeroState text="No events were found in the selected area." />
          ) : error ? (
            <ZeroState text={(error as ApiError).message} />
          ) : (
            <EventCalendar
              events={events as CalendarEvent[] | CalendarMonthEvent[]}
            />
          )}
          {/* </Suspense> */}
        </TabsContent>
      </Tabs>

      {/* <Dialog10x open={trackerModalOpen}>
        <DialogContent10x>
          <DialogTitle10x style={{ width: "35vw" }}>
            <span>Create Tracker</span>
            <Cross
              onClick={() => setTrackerModalOpen(false)}
              style={{ float: "right", cursor: "pointer" }}
              color={"primary"}
              height={"15px"}
              width={"15px"}
            />
          </DialogTitle10x>
          <div>
            <Input10x
              placeholder="Enter Tracker Name"
              onChange={(e) => setCustomTrackerName(e.target.value)}
              value={customTrackerName}
            />
          </div>
          <div>
            <Button10x
              onClick={saveTrackerHandler}
              style={{ float: "right", border: "unset" }}
              color={"primary"}
              variant={"secondary"}
            >
              Save
            </Button10x>
          </div>
        </DialogContent10x>
      </Dialog10x> */}

      <CreateTrackerDialog
        open={trackerModalOpen}
        onOpenChange={setTrackerModalOpen}
      />
    </div>
  );
};

export default Search;
