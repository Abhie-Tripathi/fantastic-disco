"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2, X, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Event } from "@/types/events";
import { differenceInDays, format } from "date-fns";
import { useEventsService } from "@/services/eventsService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { formattedDateRange } from "@/utils/date";
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerServices } from "@/services/trackerServices";
import SortDropdown from "@/components/search/sortDropdown";
import { lightenColor } from "@/lib/utils";
import { isEventeli } from "@/config";
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
  const { getFilterValue } = useFilterState();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(getFilterValue("sortBy") || "-score");
  const searchParams = useSearchParams();
  const eventService = useEventsService();
  const { getCalendarViewEvents } = useTrackerServices();
  const active = getFilterValue("eventType");

  const filteredParams = new URLSearchParams(searchParams.toString());
  filteredParams.delete("view");
  filteredParams.set("offset", String((currentPage - 1) * 20));
  filteredParams.set("active_lte", eventDate.toISOString());
  filteredParams.set("active_gte", eventDate.toISOString());
  filteredParams.set("sortBy", sortBy);
  const { data, error, isLoading } = useQuery({
    queryKey: ["events", sortBy, filteredParams.toString()],
    queryFn: () =>
      source!=="tracker"?eventService.getEventsWithSearchParams(filteredParams.toString()):getCalendarViewEvents(
        trackerId || "", 
        `active_gte=${eventDate.toISOString()}&active_lte=${eventDate.toISOString()}&limit=20&offset=${(currentPage - 1) * 20}&sortBy=${sortBy}`
        + (isEventeli ? `&type=${active}` : ''),
        true
      ),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (newSortValue: string) => {
    setSortBy(newSortValue);
  };

  function isEventResponse(data: any): data is any {
    return data && "events" in data && Array.isArray(data.events);
  }

  const events: Event[] = isEventResponse(data) ? data.events : [];
  const count = isEventResponse(data) ? data.count : 0;
  const totalPages = Math.ceil(count / 20) || 1;

  const EventCard = ({ event }: { event: Event }) => {
    const address = event.basic.eventLocation
      ? event.basic.format === "online"
        ? "Online"
        : [
            event.basic.eventLocation?.venue?.name || "TBA",
            event.basic.eventLocation?.city?.name,
            event.basic.eventLocation?.state?.name,
            event.basic.eventLocation?.country?.name,
          ]
            .filter(Boolean)
            .join(", ")
      : "Venue to be announced";

    return (
      <Link href={`/internal/event/${event.basic.id}`} target="_blank">
        <Card className="mb-3 relative hover:shadow-md transition-all duration-200 group overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              {event.basic.logoUrl ? (
                <img
                    src={event.basic.logoUrl}
                    alt={`${event.basic.name} logo`}
                    className="w-12 h-12 object-contain p-1 border rounded-md bg-white shadow-sm"
                  />
              ) : event.basic.website ? (
                <div className="w-12 h-12 relative">
                  <img
                    src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${event.basic.website}&size=64`}
                    alt={`${event.basic.name} website favicon`}
                    className="w-12 h-12 object-contain p-1 border rounded-md bg-white shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.dataset.error = "true";
                    }}
                  />
                  {/* Fallback that shows when image errors */}
                  <div
                    className="w-12 h-12 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
                    style={{ display: "none" }}
                    ref={(el) => {
                      if (el) {
                        const img = el.previousSibling as HTMLImageElement;
                        if (img && img.dataset.error === "true") {
                          el.style.display = "flex";
                        }
                      }
                    }}
                  >
                    <span className="text-[#5055A3] text-lg font-semibold">
                      {event.basic.name.charAt(0)}
                    </span>
                  </div>
                </div>
              ) : event.basic.website ? (
                <div className="w-16 h-16 relative">
                  <img
                    src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${event.basic.website}&size=64`}
                    alt={`${event.basic.name} website favicon`}
                    className="w-16 h-16 object-contain p-2 border rounded-lg bg-white shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.dataset.error = "true";
                    }}
                  />
                  <div
                    className="w-16 h-16 rounded-lg bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
                    style={{ display: "none" }}
                    ref={(el) => {
                      if (el) {
                        const img = el.previousSibling as HTMLImageElement;
                        if (img && img.dataset.error === "true") {
                          el.style.display = "flex";
                        }
                      }
                    }}
                  >
                    <span className="text-[#5055A3] text-2xl font-semibold">
                      {event.basic.name.charAt(0)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm">
                  <span className="text-[#5055A3] text-2xl font-semibold">
                    {event.basic.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 bg-pink-100 text-pink-800 hover:bg-pink-100 capitalize rounded-sm"
                    style={{
                      color:
                        eventTypeColors[event.basic.primaryEventType || ""],
                      backgroundColor: lightenColor(
                        eventTypeColors[event.basic.primaryEventType || ""],
                        0.9
                      ),
                    }}
                  >
                    <span>
                      {
                        eventTypeIcons[
                          event.basic.primaryEventType || "festivals"
                        ]
                      }
                    </span>
                    <span>{event.basic.primaryEventType}</span>
                  </Badge>
                  {event.basic.rating > 0 ? (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize rounded-sm"
                    >
                      <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                      <span>{event.basic.rating}</span>
                    </Badge>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {event.basic.name}
                  </h3>
                </div>
                <div className="text-xs text-gray-600 mb-1">{address}</div>
                <div className="text-xs font-medium text-primary">
                  {formattedDateRange(
                    event.basic.startDateTime,
                    event.basic.endDateTime
                  )}
                </div>
              </div>
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
