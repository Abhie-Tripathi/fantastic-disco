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
import { ArrowUpRight, Loader2, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Table from "@/app/components/Table";
import { EventsAdapter } from "@/adapters/eventsAdapter";

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
  const { navigateWithParams, getFilterValue, setFilter } = useFilterState();
  const eventService = useEventsService();
  const selectedView = getFilterValue("view") || "list";
  const { applyFilters, localFilters } = useFilterContext();
  const { searchParams } = useDefaultFilters();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
    enabled: !!searchParams.toString(),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const displayData = eventData;
  const events = displayData?.events || [];
  const count = displayData?.count || 0;

  console.log(events);

  const createTrackerHandler = useCallback(() => {
    navigateWithParams("/trackers/create");
  }, [navigateWithParams]);

  const searchHandler = useCallback(() => {
    applyFilters();
  }, []);

  const adaptedParams = EventsAdapter.adaptRequestParams(searchParams);
  
  console.log(adaptedParams)

  const adaptedQueryString = (function () {
    delete adaptedParams.offset;
    delete adaptedParams.max;
    delete adaptedParams.sortBy;
    delete adaptedParams.sortType;
    return new URLSearchParams(adaptedParams).toString();
  })();


  const selectedInsights = {
    eventSize: true,
    eventKeywords: true,
    eventRank: true,
    matchScore: true,
    growth: true,
    eventSeries: true,
    brandedEvent: true,
    global: true,
    reptSent: true,
    eventRating: true,
    estExhibit: true,
    repeatSent: true,
    maturity: true,
    impactScore: true,
    inboundScore: true,
    internationalScore: true,
    forecasted: true,
    audienceZone: false,
    audienceSpread: false,
  };

  return (
    <div className="space-y-6 p-6">
      <SearchBar />
      <div className="w-full grid grid-cols-10 gap-4 border-b pb-6">
        <div className="col-span-8 grid grid-cols-4 gap-3">
          <EventTypeSelector />
          <CategorySelector />
          <EventFormatSelector />
          <LocationSelector />
          <DateRangeSelector />
          <StatusSelector />
          <EventEntrySelector />
          <UserRatingSelector />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <Button
            size="lg"
            onClick={searchHandler}
            disabled={isLoading}
            className="text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
          <div className="flex items-center justify-evenly">
            <Button variant="link" className="p-0 block text-wrap">
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
        onValueChange={(value) => setFilter("view", value)}
      >
        <div className="grid grid-cols-3 items-center mb-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-white">{count}</Badge>
            <p className="text-primary font-semibold">Events Found</p>
          </div>
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
        {error && (
          <div className="text-red-500 mb-4" role="alert">
            {error.message}
          </div>
        )}
        <TabsContent value="list" className="flex-grow overflow-hidden">
          {isLoading ? (
            <Loading />
          ) : (
            <Table
              showInsights={selectedInsights}
              queryString={adaptedQueryString}
              setRequestExhausted={() => {}}
              handleButtonLoading={() => {}}
            />
          )}
        </TabsContent>
        <TabsContent value="map">
          <Suspense fallback={<Loading />}>
            <Map searchParams={searchParams.toString()} />
          </Suspense>
        </TabsContent>
        <TabsContent value="calendar">
          <Suspense fallback={<Loading />}>
            <EventCalendar
              events={events as CalendarEvent[] | CalendarMonthEvent[]}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
