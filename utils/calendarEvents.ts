import {
  CalendarYearEventsResponse,
  CalendarMonthEventsResponse,
  WeekEvent,
  YearEventCount,
  MonthEventCount,
} from "@/types/events";

import {
  CalendarEventType,
  CalendarMonthEventWithHeatmap,
} from "@/components/eventCalendar";
import { Views } from "@/components/eventCalendar/constants";
import { Alert, Event } from "@/types/events";

export const procesEvents = (
  view: string,
  unattendedEvents: { holidays: Event[]; alerts: Alert[] },
  eventsData: any,
  filter: any
) => {
  if (!eventsData?.events) return [];

  if (view === Views.WEEK) {
    const holidayEvents = unattendedEvents?.holidays?.map(
      (unAttendedEvent: Event) => ({
        id: unAttendedEvent.basic.id,
        name: unAttendedEvent.basic.name,
        startDateTime: unAttendedEvent.basic.startDateTime,
        endDateTime: unAttendedEvent.basic.endDateTime,
        eventType: unAttendedEvent.basic.primaryEventType || "holiday",
        impactScore: 0,
      })
    );

    const alerts = unattendedEvents?.alerts?.map((alert: Alert) => ({
      id: alert.id,
      name: alert.name,
      startDateTime: alert.startDate,
      endDateTime: alert.endDate,
      eventType: alert.type,
      level: alert.level,
      impactScore: 0,
    }));

    const filteredEvents = ((eventsData.events as WeekEvent[]) || []).filter(
      (event) => event.eventType !== "holiday"
    );

    const events = [...(holidayEvents || []), ...filteredEvents];

    return events.map((event) => {
      const processedEvent: CalendarEventType = {
        id: event.id,
        title: event.name,
        start: new Date(event.startDateTime),
        end: new Date(event.endDateTime),
        eventType: event.eventType,
        alertLevel: "level" in event ? event.level : undefined,
      };

      if (processedEvent.start.getTime() === processedEvent.end.getTime()) {
        const endDate = new Date(processedEvent.end);
        endDate.setHours(24, 0, 0);
        processedEvent.end = endDate;
      }

      return processedEvent;
    });
  }

  const eventsData_ = eventsData as
    | CalendarMonthEventsResponse
    | CalendarYearEventsResponse;
  if (!eventsData_.events) return [];

  let filteredEvents: CalendarMonthEventWithHeatmap[] = [];
  const maxTotal = Math.max(
    ...Object.values(eventsData_.events).map((e) => e.total)
  );

  const getHeatmapCategory = (total: number) => {
    const percentage = (total / maxTotal) * 100;
    if (percentage <= 25) return "low";
    if (percentage <= 50) return "medium";
    if (percentage <= 75) return "high";
    return "critical";
  };

  if (view === Views.YEAR) {
    Object.entries(eventsData_.events).forEach(([date, eventData]) => {
      const heatmapCategory = getHeatmapCategory(eventData.total);
      const monthKey = date.substring(0, 7);
      // const monthCount =
      //   (eventsData_ as CalendarYearEventsResponse).countByMonth[monthKey] || 0;

      ["business", "social"].forEach((eventType) => {
        if (eventData[eventType as keyof YearEventCount] > 0) {
          filteredEvents.push({
            id: `${date}-${eventType}`,
            title: `${eventType}: ${
              eventData[eventType as keyof YearEventCount]
            }`,
            start: new Date(date),
            end: new Date(date),
            eventType,
            impactScore: eventData.averageImpactScore,
            count: eventData[eventType as keyof YearEventCount] as number,
            heatmapCategory,
            // monthCount,
          });
        }
      });
    });
  } else {
    Object.entries(eventsData_.events).forEach(([date, eventData]) => {
      const heatmapCategory = getHeatmapCategory(eventData.total);

      ["business", "social"].forEach((eventType) => {
        if (eventData[eventType as keyof MonthEventCount] > 0) {
          filteredEvents.push({
            id: `${date}-${eventType}`,
            title: `${eventType}: ${
              eventData[eventType as keyof MonthEventCount]
            }`,
            start: new Date(date),
            end: new Date(date),
            eventType,
            impactScore: eventData.averageImpactScore,
            count: eventData[eventType as keyof MonthEventCount] as number,
            heatmapCategory,
          });
        }
      });
    });
  }

  if (filter !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.eventType.toLowerCase() === filter.toLowerCase()
    );
  }

  return filteredEvents;
};
