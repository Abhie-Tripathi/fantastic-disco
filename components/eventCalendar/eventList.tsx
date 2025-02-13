"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Event, EventsResponse } from "@/types/events";
import { differenceInDays, format } from "date-fns";
import { useEventsService } from "@/services/eventsService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { formattedDateRange } from "@/utils/date";
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerServices } from "@/services/trackerServices";
import SortDropdown from "@/components/search/sortDropdown";

export default function EventList({
  eventDate,
  onClose,
  source,
  trackerId,
  onSort,
}: {
  eventDate: Date;
  onClose: () => void;
  source?: string;
  trackerId?: string;
  onSort?: (sortValue: string) => void;
}) {
  const { getFilterValue, setFilter } = useFilterState();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(getFilterValue("sortBy") || "start");
  const searchParams = useSearchParams();
  const eventService = useEventsService();
  const { getCalendarViewEvents } = useTrackerServices();
  const active = getFilterValue("eventType");

  const filteredParams = new URLSearchParams(searchParams.toString());
  filteredParams.delete("view");
  filteredParams.set("skip", String((currentPage - 1) * 20));
  filteredParams.set("active_lte", eventDate.toISOString());
  filteredParams.set("active_gte", eventDate.toISOString());
  filteredParams.set("sortBy", sortBy);
  const { data, error, isLoading } = useQuery({
    queryKey: ["events", sortBy, filteredParams.toString()],
    queryFn: () =>
      source !== "tracker"
        ? eventService.getEventsWithSearchParams(filteredParams.toString())
        : getCalendarViewEvents(
            trackerId || "",
            `type=${
              active === "activeEvent"
                ? "active"
                : active === "expiredEvent"
                ? "expired"
                : active === "newEvent"
                ? ""
                : active === "savedEvent"
                ? "saved"
                : "active"
            }&startDate=${eventDate.toISOString().split("T")[0]},${
              eventDate.toISOString().split("T")[0]
            }&endDate=${eventDate.toISOString().split("T")[0]},${
              eventDate.toISOString().split("T")[0]
            }&limit=20&offset=${(currentPage - 1) * 20}`,
            true
          ),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (newSortValue: string) => {
    setSortBy(newSortValue);
  };

  function isEventResponse(data: any): data is EventsResponse {
    return data && "events" in data && Array.isArray(data.events);
  }

  const events: Event[] = isEventResponse(data) ? data.events : [];
  const count = isEventResponse(data) ? data.count : 0;
  const totalPages = Math.ceil(count / 20) || 1;

  const EventCard = ({ event }: { event: Event }) => {
    const address = event.basic.eventLocation
      ? event.basic.eventLocation.city?.name === "Online"
        ? "Online"
        : [
            event.basic.eventLocation?.venue?.name,
            event.basic.eventLocation?.city?.name,
            event.basic.eventLocation?.state?.name,
            event.basic.eventLocation?.country?.name,
          ]
            .filter(Boolean)
            .join(", ")
      : "Venue to be announced";

    const formattedStartDate = format(event.basic.startDateTime, "dd MMM yyyy");
    const formattedEndDate = format(event.basic.endDateTime, "dd MMM yyyy");

    const days =
      differenceInDays(event.basic.endDateTime, event.basic.startDateTime) + 1;

    const formattedRange =
      formattedStartDate === formattedEndDate
        ? formattedStartDate
        : `${formattedStartDate} - ${formattedEndDate} (${days} ${
            days === 1 ? "day" : "days"
          })`;

    return (
      <Link href={`/internal/event/${event.basic.id}`} target="_blank">
        <Card key={event.basic.id} className="mb-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-md bg-[#5055A3]" />
          <CardContent className="p-4">
            <div className="flex items-center mb-2 pb-2 border-b">
              {eventTypeIcons[event.basic.eventTypes[0].name || "festivals"]}
              <span className="text-xs font-semibold text-primary capitalize ml-2">
                {event.basic.eventTypes[0].name}
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-sm">{event.basic.name}</h3>
            <div className="flex items-center text-xs mb-2">
              <span>{address}</span>
            </div>
            <div className="flex items-start text-xs text-[#666666]">
              {formattedDateRange(
                event.basic.startDateTime,
                event.basic.endDateTime
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;
    const ellipsis = <PaginationEllipsis />;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">{ellipsis}</PaginationItem>
        );
      }

      if (currentPage !== 1 && currentPage !== totalPages) {
        items.push(
          <PaginationItem key={currentPage}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(currentPage)}
              isActive={true}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">{ellipsis}</PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold text-destructive">
              Failed to load events
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again later
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full bg-[var(--primary-foreground)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-lg font-semibold text-primary">
              Loading events...
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="p-4 rounded-t-lg">
          <div className="flex justify-between items-center mb-4 border-b">
            <span className="font-semibold text-sm text-primary">
              {eventDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-white bg-primary">
                {count}
              </Badge>
              <span className="text-xs font-semibold text-primary">
                Events Found
              </span>
            </div>
            <SortDropdown compact={true} value={sortBy} onSort={handleSort} />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-7rem)] p-4 pt-0">
          {events.map((event: Event) => (
            <EventCard key={event.basic.id} event={event} />
          ))}
          {events.length > 0 && (
            <Pagination>
              <PaginationContent className="flex-wrap">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </ScrollArea>
      </>
    );
  };

  return (
    <div
      className={`h-[800px] w-[345px] mt-[66px] bg-[var(--primary-foreground)] rounded-l-lg border`}
    >
      {renderContent()}
    </div>
  );
}
