"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import YearView from "./yearView";
import CustomToolbar from "./customToolbar";
import { CustomEvent, CustomMonthEvent } from "./customEvent";
import {
  CustomDayHeader,
  CustomMonthHeader,
  CustomDateHeader,
} from "./customHeaders";
import { CustomView, Views } from "./constants";
import { useFilterState } from "@/hooks/useFilterState";
import {
  Alert,
  Event,
  CalendarWeekEventsResponse,
  CalendarMonthEventsResponse,
  CalendarYearEventsResponse,
  WeekEvent,
} from "@/types/events";
import EventList from "./eventList";
import ZeroState from "@/app/components/zerostate";
import { useRouter, useSearchParams } from "next/navigation";
import { useEventsService } from "@/services/eventsService";
import { useFilterContext } from "@/context/filterContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/Loading";
import { procesEvents } from "@/utils/calendarEvents";
import { useTrackerServices } from "@/services/trackerServices";
import { TrackersAdapter } from "@/adapters/trackerAdapter";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { isEventeli } from "@/config";
import { useIsMobile, useMediaQuery } from "@/hooks/useMediaQuery";
const localizer = momentLocalizer(moment);
export interface CalendarMonthEventWithHeatmap {
  id: string;
  title: string;
  start: Date;
  end: Date;
  eventType: string;
  impactScore: number;
  count?: number;
  heatmapCategory?: string;
  alertLevel?: string;
  monthCount?: number;
}

export type CalendarEventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  eventType: string;
  alertLevel?: any;
};
interface EventCalendarProps {
  source?: string;
  trackerId?: string;
  date?: any;
  activeVal?: number;
}
export default function EventCalendar({
  source,
  trackerId,
  date: trackerDate,
  activeVal,
}: EventCalendarProps) {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { getLocalFilterValue } = useFilterContext();
  const { getEventsWithSearchParams, getEvents } = useEventsService();
  const { getCalendarViewEvents } = useTrackerServices();
  const [weekDateCounts, setWeekDateCounts] = useState<any>();
  const initialDate = () => {
    const activeGte =
      source !== "tracker"
        ? searchParams.get("active_gte")
        : trackerDate?.split(",")[0]?.split("T")[0];
    const activeLte =
      source !== "tracker"
        ? searchParams.get("active_lte")
        : trackerDate?.split(",")[0]?.split("T")[1];

    if (activeGte && activeLte) return new Date(activeGte);
    if (activeGte) return new Date(activeGte);
    if (activeLte) return new Date(activeLte);
    return new Date();
  };
  const [currentDate, setCurrentDate] = useState(initialDate());
  const [filter, setFilter] = useState("all");

  const {
    getFilterValue,
    setFilter: setGlobalFilter,
    setMultipleFilters,
  } = useFilterState();
  const [showEventList, setShowEventList] = useState(false);
  const [lastEventIds, setLastEventIds] = useState<Map<string, WeekEvent>>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const filteredParams = new URLSearchParams(searchParams.toString());

  const view =
    getFilterValue("calendar_type") ||
    (isMobile ? "year" : ("month" as CustomView));
  const setView = (newView: string) => {
    setGlobalFilter("calendar_type", newView);
  };
  const active = getLocalFilterValue("eventType");

  const {
    data: eventsData,
    error,
    isLoading: isEventsLoading,
  } = useQuery<
    | CalendarWeekEventsResponse
    | CalendarMonthEventsResponse
    | CalendarYearEventsResponse
  >({
    queryKey:
      source !== "tracker"
        ? ["events", view, currentDate, searchParams.toString()]
        : ["events", currentDate, active, view],
    queryFn: async () => {
      setShowEventList(false);
      const { start, end } = getVisibleDateRange(view, currentDate);
      const updatedParams = new URLSearchParams(searchParams.toString());
      updatedParams.set("active_gte", moment(start).format("YYYY-MM-DD"));
      updatedParams.set("active_lte", moment(end).format("YYYY-MM-DD"));
      // updatedParams.set("view", view);
      // console.log(moment(start).toISOString(), trackerDate);
      const trackerStartDate = `${moment(start).format("YYYY-MM-DD")}`;
      const trackerEndDate = `${moment(end).format("YYYY-MM-DD")}`;
      const response =
        source !== "tracker"
          ? await getEventsWithSearchParams(updatedParams.toString())
          : await getCalendarViewEvents(
              trackerId || "",
              `type=${active}&active_gte=${trackerStartDate}&active_lte=${trackerEndDate}&view=calendar&calendar_type=${view}`,
              false,
              view
            );

      return response as any;
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    setCurrentDate(initialDate());
  }, [searchParams]);

  const { data: unAttendedEvents = { holidays: [], alerts: [] } } = useQuery({
    queryKey: ["unattended-events", searchParams.toString()],
    queryFn: async () => {
      const alertSearchParams = new URLSearchParams(searchParams.toString());
      alertSearchParams.set("eventTypes", "alert");
      alertSearchParams.set("limit", "50");
      const query = Object.fromEntries(alertSearchParams.entries());
      const alerts = await getEvents(query);

      let holidays: Event[] = [];
      if (filteredParams.get("eventTypes")?.split(",").includes("holiday")) {
        filteredParams.set("eventTypes", "holiday");
        filteredParams.delete("view");
        const query = Object.fromEntries(filteredParams.entries());
        const holidayResponse = await getEvents(query);
        holidays = (holidayResponse?.events as Event[]) || [];
      }

      return {
        holidays,
        alerts: (alerts?.events as Alert[]) || [],
      };
    },
    enabled: !!isEventeli,
  });

  const processedEvents = procesEvents(
    view,
    unAttendedEvents,
    eventsData,
    filter
  );

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleDateClick = useCallback((date: Date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(5, 30);

    setSelectedDate(updatedDate);
    setShowEventList(true);
  }, []);

  function getLastEventIdsByDate(events: WeekEvent[] | undefined) {
    const dateEventsMap = new Map<string, WeekEvent>();
    events?.forEach((event) => {
      const dateKey = new Date(event.startDateTime).toISOString().split("T")[0];
      dateEventsMap.set(dateKey, event);
    });
    return dateEventsMap;
  }

  // const fetchEventCount = async () => {
  //   if (view == "week") {
  //     const LastEventIds = getLastEventIdsByDate(
  //       eventsData?.events as WeekEvent[]
  //     );
  //     setLastEventIds(LastEventIds);
  //     try {
  //       const { start, end } = getVisibleDateRange(view, currentDate);
  //       const eventCountParams = new URLSearchParams(searchParams);
  //       eventCountParams.set("columns", "eventCount");
  //       eventCountParams.set("groupBy", "date");
  //       eventCountParams.set("dateView", "day");
  //       eventCountParams.set("active_gte", moment(start).toISOString());
  //       eventCountParams.set("active_lte", moment(end).toISOString());

  //       const response = await getEventTrends(eventCountParams.toString());
  //       if (response?.groupedData && eventsData?.events.length) {
  //         const dateCounts = Object.keys(response?.groupedData).reduce<{
  //           [key: string]: number;
  //         }>((acc, date) => {
  //           const isoDate = new Date(date);
  //           const alreadyShownCount = (
  //             eventsData?.events as WeekEvent[]
  //           ).filter(
  //             (event: WeekEvent) =>
  //               new Date(event.startDateTime).getTime() ==
  //               new Date(date).getTime()
  //           ).length;
  //           acc[isoDate.toISOString().split("T")[0]] =
  //             Number(response.groupedData[date].eventCount?.total) -
  //             Number(alreadyShownCount);
  //           return acc;
  //         }, {});
  //         setWeekDateCounts(dateCounts);
  //       }
  //     } catch (error) {
  //       console.log("Fetch Event Count Error", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchEventCount();
  // }, [view, eventsData]);

  const shouldShowZeroState = useMemo(() => {
    const filterKeys = Array.from(searchParams.keys());
    const allowedParams = new Set(["view", "calendar_type"]);

    return (
      filterKeys.length === 0 ||
      filterKeys.every((key) => allowedParams.has(key))
    );
  }, [searchParams]);

  const getVisibleDateRange = useCallback(
    (view: string, date: Date) => {
      let start = moment(date);
      let end = moment(date);

      console.log(start.toDate(), end.toDate());
      switch (view) {
        case Views.WEEK:
          start.startOf("week").add(1, "day");
          end.endOf("week");
          break;
        case Views.MONTH:
          start.startOf("month");
          end.endOf("month");
          console.log(start.startOf("month"), end.endOf("month"));
          break;
        case Views.YEAR:
          start.startOf("year");
          end.endOf("year");
          break;
      }
      const searchStart =
        source !== "tracker"
          ? moment(searchParams.get("active_gte"))
          : moment(trackerDate ? trackerDate?.split(",")[0] : null);
      const searchEnd =
        source !== "tracker"
          ? moment(searchParams.get("active_lte"))
          : moment(trackerDate ? trackerDate?.split(",")[1] : null);

      if (searchStart.isValid() && start.isBefore(searchStart)) {
        start = searchStart.clone();
      }
      if (searchEnd.isValid() && end.isAfter(searchEnd)) {
        end = searchEnd.clone();
      }

      return { start: start.toDate(), end: end.toDate() };
    },
    [getLocalFilterValue, trackerDate]
  );
  const handleNavigate = (date: Date) => {
    setShowEventList(false);
    setCurrentDate(date);
  };

  const handleViewChange = (newView: string) => {
    setShowEventList(false);
    setView(newView);
  };

  const handleDrillDown = (date: Date, view: View) => {
    if (view == "day") {
      setMultipleFilters({
        view: "list",
        active_gte: date.toISOString(),
        active_lte: date.toISOString(),
      });
    }
  };

  if (
    isEventeli &&
    !searchParams.get("viewBound") &&
    !searchParams.get("locationIds") &&
    source !== "tracker" &&
    !searchParams.get("eventIds")
  ) {
    return <ZeroState text="Location is Mandatory" />;
  }

  const renderCalendarContent = () => {
    if (isEventsLoading) {
      return <Loading />;
    }

    if (view === Views.YEAR) {
      return (
        <YearView
          unattendedEvents={unAttendedEvents}
          date={currentDate}
          events={processedEvents as CalendarMonthEventWithHeatmap[]}
        />
      );
    }

    return (
      <Calendar
        localizer={localizer}
        events={view === Views.WEEK ? processedEvents : undefined}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH as any}
        view={view as any}
        onView={handleViewChange}
        onDrillDown={handleDrillDown}
        components={{
          toolbar: () => null,
          event: (props) => {
            return view === Views.WEEK ? (
              <CustomEvent
                event={props.event as any}
                counts={weekDateCounts}
                lastEventIds={lastEventIds}
              />
            ) : (
              <CustomMonthEvent event={props.event as any} />
            );
          },
          week: {
            header: (props) => (
              <CustomDayHeader {...props} alerts={unAttendedEvents.alerts} />
            ),
          },
          month: {
            header: CustomMonthHeader,
            dateHeader: (props) => (
              <CustomDateHeader
                {...props}
                monthEvents={processedEvents as any}
                unAttended={unAttendedEvents}
                onDateClick={handleDateClick}
              />
            ),
          },
        }}
        date={currentDate}
        onNavigate={handleNavigate}
        className={`${showEventList ? "pr-4" : ""}`}
      />
    );
  };

  return (
    <>
      {shouldShowZeroState ? (
        <div className="flex justify-center items-center">
          <ZeroState title="Discover insights on business trends filtered by geography and category, all in one glance." />
        </div>
      ) : error ? (
        <div className="px-10 py-5">
          {source === "tracker" ? (
            <NullState image={TrackerNullState} title={error?.message} />
          ) : (
            <ZeroState text={error?.message} />
          )}
        </div>
      ) : source === "tracker" && activeVal === 0 ? (
        active === "bookmarked" ? (
          <div className="px-10 py-5">
            <NullState
              image={TrackerNullState}
              title="No events bookmarked yet! Start bookmarking events to easily track and revisit them here."
            />
          </div>
        ) : (
          <div className="px-10 py-5">
            <NullState
              image={TrackerNullState}
              title="We couldn't find any events matching your tracker criteria at the moment."
              text="Try adjusting your filters or checking back later, as new events are added frequently."
              buttonText="Manage Configuration"
              buttonUrl={`/internal/trackers/${trackerId}/trackedConfiguration`}
            />
          </div>
        )
      ) : (
        <div className="flex custom-calendar overflow-y-scroll">
          <div
            className={`flex flex-col  ${
              showEventList ? "w-[calc(100%-345px)]" : "w-full"
            }`}
          >
            <CustomToolbar
              date={currentDate}
              view={view}
              setView={handleViewChange}
              onNavigate={(action) => {
                const newDate = new Date(currentDate);
                if (action === "PREV") {
                  if (view === Views.YEAR) {
                    newDate.setFullYear(currentDate.getFullYear() - 1);
                  } else if (view === Views.MONTH) {
                    newDate.setMonth(currentDate.getMonth() - 1);
                  } else {
                    newDate.setDate(currentDate.getDate() - 7);
                  }
                }
                if (action === "NEXT") {
                  if (view === Views.YEAR) {
                    newDate.setFullYear(currentDate.getFullYear() + 1);
                  } else if (view === Views.MONTH) {
                    newDate.setMonth(currentDate.getMonth() + 1);
                  } else {
                    newDate.setDate(currentDate.getDate() + 7);
                  }
                }
                handleNavigate(newDate);
              }}
              filter={filter}
              onFilterChange={handleFilterChange}
            />

            {renderCalendarContent()}
          </div>
          {showEventList && (
            <EventList
              source={source}
              trackerId={trackerId}
              eventDate={selectedDate || currentDate}
              onClose={() => setShowEventList(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
