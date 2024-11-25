"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
import { CalendarEvent, CalendarMonthEvent } from "@/types/events";
import EventList from "./eventList";
import ZeroState from "@/app/components/zerostate";
import { useSearchParams } from "next/navigation";

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
}

interface ApiEventData {
  total: number;
  business: number;
  social: number;
  averageImpactScore: number;
}

export default function EventCalendar({
  events,
  source,
  trackerId,
  type
}: {
  events: CalendarEvent[] | CalendarMonthEvent[];
  source: string;
  trackerId?: string;
  type?:string
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const searchParams = useSearchParams();
  const {
    getFilterValue,
    setFilter: setGlobalFilter,
    setMultipleFilters,
  } = useFilterState();
  const [showEventList, setShowEventList] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log(events);
  
  const view = getFilterValue("calendar_type") || ("month" as CustomView);
  const setView = (newView: CustomView) => {
    setGlobalFilter("calendar_type", newView);
  };

  const processedEvents = useMemo(() => {
    if (view === Views.WEEK) {
      if (!Array.isArray(events)) return [];
      return (events as CalendarMonthEvent[])?.map((event) => ({
        id: event.id,
        title: event.name,
        start: new Date(event.startDateTime),
        end: new Date(event.endDateTime),
        eventType: event.eventType,
      }));
    }

    if (!events) return [];

    let filteredEvents: CalendarMonthEventWithHeatmap[] = [];
    const maxTotal = Math.max(...Object.values(events).map((e) => e.total));

    const getHeatmapCategory = (total: number) => {
      const percentage = (total / maxTotal) * 100;
      if (percentage <= 25) return "low";
      if (percentage <= 50) return "medium";
      if (percentage <= 75) return "high";
      return "critical";
    };

    Object.entries(events).forEach(([date, eventData]) => {
      const heatmapCategory = getHeatmapCategory(eventData.total);

      ["business", "social"].forEach((eventType) => {
        if (eventData[eventType as keyof ApiEventData] > 0) {
          filteredEvents.push({
            id: `${date}-${eventType}`,
            title: `${eventType}: ${
              eventData[eventType as keyof ApiEventData]
            }`,
            start: new Date(date),
            end: new Date(date),
            eventType,
            impactScore: eventData.averageImpactScore,
            count: eventData[eventType as keyof ApiEventData] as number,
            heatmapCategory,
          });
        }
      });
    });

    if (filter !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.eventType.toLowerCase() === filter.toLowerCase()
      );
    }

    return filteredEvents;
  }, [events, filter, view]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleDateClick = useCallback((date: Date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(5, 30);

    setSelectedDate(updatedDate);
    setShowEventList(true);
  }, []);

  const shouldShowZeroState = useMemo(() => {
    const filterKeys = Array.from(searchParams.keys());
    const allowedParams = new Set(["view", "calendar_type"]);

    // Check if all filter keys are either 'view' or 'calendar_type'
    return (
      filterKeys.length === 0 ||
      filterKeys.every((key) => allowedParams.has(key))
    );
  }, [searchParams]);
console.log(Views);

  return (
    <>
      {shouldShowZeroState ? (
        <div className="flex justify-center items-center">
          <ZeroState text="Discover insights on business trends filtered by geography and category, all in one glance." />
        </div>
      ) : (
        <div className="flex">
          <div
            className={`custom-calendar ${
              showEventList ? "w-[calc(100%-345px)]" : "w-full"
            }`}
          >
            {view === Views.YEAR ? (
              <div>
                <CustomToolbar
                  date={currentDate}
                  view={view}
                  setView={setView as any}
                  onNavigate={(action) => {
                    const newDate = new Date(currentDate);
                    if (action === "PREV")
                      newDate.setFullYear(currentDate.getFullYear() - 1);
                    if (action === "NEXT")
                      newDate.setFullYear(currentDate.getFullYear() + 1);
                    setCurrentDate(newDate);
                  }}
                  filter={filter}
                  onFilterChange={handleFilterChange}
                />
                <YearView
                  date={currentDate}
                  events={processedEvents as CalendarMonthEventWithHeatmap[]}
                />
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={processedEvents}
                startAccessor="start"
                endAccessor="end"
                defaultView={Views.MONTH as any}
                view={view as any}
                onView={setView as any}
                components={{
                  toolbar: (props) => (
                    <CustomToolbar
                      {...props}
                      view={view}
                      setView={setView as any}
                      filter={filter}
                      onFilterChange={handleFilterChange}
                    />
                  ),
                  event: (props) => {
                    return view === Views.WEEK ? (
                      <CustomEvent event={props.event as any} />
                    ) : (
                      <CustomMonthEvent event={props.event as any} />
                    );
                  },
                  week: { header: CustomDayHeader },
                  month: {
                    header: CustomMonthHeader,
                    dateHeader: (props) => (
                      <CustomDateHeader
                        {...props}
                        monthEvents={processedEvents as any}
                        onDateClick={handleDateClick}
                      />
                    ),
                  },
                }}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                className={`h-[850px] ${showEventList ? "pr-4" : ""}`}
              />
            )}
          </div>

          {showEventList && (
            <EventList
              type={type}
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
