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
import ZeroState from "@/components/zerostate";
import { useRouter, useSearchParams } from "next/navigation";
import { useEventsService } from "@/services/eventsService";
import { useFilterContext } from "@/context/filterContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/Loading";
import { procesEvents } from "@/utils/calendarEvents";
import { useTrackerServices } from "@/services/trackerServices";
import { TrackersAdapter}  from "@/adapters/trackerAdapter";
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
  alertLevel?: string;
};
interface EventCalendarProps{
  source?:string;
  trackerId?:string;
  date?:any;
}
export default function EventCalendar({source, trackerId, date}:EventCalendarProps) {
  const searchParams = useSearchParams();
  const { getLocalFilterValue } = useFilterContext();
  const { getEventsWithSearchParams } = useEventsService();
  const { getCalendarViewEvents } = useTrackerServices();
  const [weekDateCounts, setWeekDateCounts] = useState<any>();
  const {adaptParams}=TrackersAdapter;
  const initialDate = (() => {
    const activeGte = source!=="tracker"?getLocalFilterValue("active_gte"):date?.split(",")[0]?.split("T")[0];
    const activeLte = source!=="tracker"?getLocalFilterValue("active_lte"):date?.split(",")[0]?.split("T")[1];
    if (activeGte && activeLte) return activeGte;
    if (activeGte) return activeGte;
    if (activeLte) return activeLte;
    return new Date();
  })();
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const [filter, setFilter] = useState("all");
  const {
    getFilterValue,
    setFilter: setGlobalFilter,
    setMultipleFilters,
  } = useFilterState();
  const [showEventList, setShowEventList] = useState(false);
  const [lastEventIds, setLastEventIds] = useState<Map<string, WeekEvent>>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const filteredParams = new URLSearchParams(searchParams);

  const view = getFilterValue("calendar_type") || ("month" as CustomView);
  const setView = (newView: string) => {
    setGlobalFilter("calendar_type", newView);
  };
  const active=getLocalFilterValue("eventType");
  console.log(currentDate);
  
  const { data: eventsData, isLoading: isEventsLoading } = useQuery<
    | CalendarWeekEventsResponse
    | CalendarMonthEventsResponse
    | CalendarYearEventsResponse
  >({
    queryKey: ["events", view, currentDate, searchParams.toString(), active],
    queryFn: async () => {
      const { start, end } = getVisibleDateRange(view, currentDate);
      const updatedParams = new URLSearchParams(searchParams);
      // updatedParams.set("active_gte", moment(start).toISOString());
      // updatedParams.set("active_lte", moment(end).toISOString());
      // updatedParams.set("view", view);

      const response = source!=="tracker"?await getEventsWithSearchParams(
        updatedParams.toString()
      ): await getCalendarViewEvents(trackerId || "", `type=${
        active === "activeEvent"
          ? "active"
          : active === "expiredEvent"
          ? "expired"
          : active === "newEvent"
          ? "" : active === "savedEvent" ? "saved":
           "active"
      }&groupBy=${date?date:adaptParams(searchParams)}`, false, view);

      return response as any;
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  // const { data: unAttendedEvents = { holidays: [], alerts: [] } } = useQuery({
  //   queryKey: ["unattended-events", searchParams.toString()],
  //   queryFn: async () => {
  //     const alertSearchParams = new URLSearchParams(searchParams);
  //     alertSearchParams.set("eventTypes", "alert");
  //     const alerts = await getEventsWithSearchParams(
  //       alertSearchParams.toString()
  //     );

  //     let holidays: Event[] = [];
  //     if (filteredParams.get("eventTypes")?.split(",").includes("holiday")) {
  //       filteredParams.set("eventTypes", "holiday");
  //       filteredParams.delete("view");
  //       const holidayResponse = await getEventsWithSearchParams(
  //         filteredParams.toString()
  //       );
  //       holidays = (holidayResponse?.events as Event[]) || [];
  //     }

  //     return {
  //       holidays,
  //       alerts: (alerts?.events as any[]) || [],
  //     };
  //   },
  // });

  const unAttendedEvents = { holidays: [], alerts: [] };

  const processedEvents = procesEvents(
    view,
    unAttendedEvents,
    eventsData,
    filter,
  );

  console.log("eventsData", eventsData)

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

      switch (view) {
        case Views.WEEK:
          start.startOf("week").add(1, "day");
          end.endOf("week");
          break;
        case Views.MONTH:
          start.startOf("month");
          end.endOf("month");
          break;
        case Views.YEAR:
          start.startOf("year");
          end.endOf("year");
          break;
      }

      const searchStart = moment(searchParams.get("active_gte"));
      const searchEnd = moment(searchParams.get("active_lte"));

      if (searchStart.isValid() && start.isBefore(searchStart)) {
        start = searchStart.clone();
      }
      if (searchEnd.isValid() && end.isAfter(searchEnd)) {
        end = searchEnd.clone();
      }

      return { start: start.toDate(), end: end.toDate() };
    },
    [getLocalFilterValue]
  );

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (newView: string) => {
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
      ) : (
        <div className="flex custom-calendar">
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
              source={"tracker"}
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
