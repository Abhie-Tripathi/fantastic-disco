"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2, Focus } from "lucide-react";
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
import { useEventsService } from "@/services/eventsService";
import { useQuery } from "@tanstack/react-query";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import Link from "next/link";
import { formattedDateRange } from "@/utils/date";
import { MapRef } from "react-map-gl";
import MapPopup from "@/components/map/popup";
import { getEventLatLong } from "@/utils/formater";
import * as turf from "@turf/turf";
import { useTrackerServices } from "@/services/trackerServices";
const EventCard = memo(
  ({
    event,
    mapRef,
    onHover,
    onLeave,
  }: {
    event: Event;
    mapRef: React.RefObject<MapRef>;
    onHover: () => void;
    onLeave: () => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mapZoom, setMapZoom] = useState(0);

    useEffect(() => {
      if (mapRef.current) {
        setMapZoom(mapRef.current.getZoom());
        mapRef.current.on("zoom", () => {
          setMapZoom(mapRef.current?.getZoom() || 0);
        });
      }
    }, [mapRef]);

    const address = event.venueLocation
      ? event.venueLocation.city?.name === "Online"
        ? "Online"
        : [
            event.venueLocation?.venue?.name,
            event.venueLocation?.city?.name,
            event.venueLocation?.state?.name,
            event.venueLocation?.country?.name,
          ]
            .filter(Boolean)
            .join(", ")
      : "Venue to be announced";

    const handleZoomToLocation = (e: React.MouseEvent) => {
      e.preventDefault();
      if (mapRef.current && event.venueLocation) {
        const { lat, lon } = getEventLatLong(event);
        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 16,
          duration: 2000,
          essential: true,
        });
      }
    };

    const handleMouseEnter = () => {
      if (mapZoom >= 16) {
        setIsHovered(true);
        onHover();
      }
    };

    const handleMouseLeave = () => {
      if (mapZoom >= 16) {
        setIsHovered(false);
        onLeave();
      }
    };

    return (
      <Link href={`/internal/event/${event.id}`}>
        <Card
          className="mb-4 relative hover:shadow-md transition-shadow"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-md"
            style={{
              backgroundColor: eventTypeColors[event.primaryEventType || ""],
            }}
          />
          <CardContent className="p-4">
            <div className="flex items-center mb-2 pb-2 border-b">
              {eventTypeIcons[event.primaryEventType || "festivals"]}
              <span className="text-xs font-semibold text-primary capitalize ml-2">
                {event.primaryEventType}
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-sm">{event.name}</h3>
            <div className="flex items-center text-xs mb-2">
              <span>{address}</span>
            </div>
            <div className="flex items-start justify-between mt-2 pt-2 border-t">
              <div className="text-xs text-[#666666]">
                {formattedDateRange(event.startDateTime, event.endDateTime)}
              </div>
              {/* Show button always if zoom is less than 16 */}
              {mapZoom < 16 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-primary hover:text-primary/80"
                  onClick={handleZoomToLocation}
                >
                  <Focus className="w-3 h-3 mr-1" />
                  Zoom to location
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
);
EventCard.displayName = "EventCard";

const UnplannedCard = memo(
  ({
    event,
    mapRef,
    onHover,
    onLeave,
  }: {
    event: Event;
    mapRef: React.RefObject<MapRef>;
    onHover: () => void;
    onLeave: () => void;
  }) => {
    function formatAddress(eventLocation: any): string {
      const addressParts: string[] = [];
      if (eventLocation.city) addressParts.push(eventLocation.city);
      if (eventLocation.state && eventLocation.state.length > 0) {
        const states = eventLocation.state.map((s: any) => s.name).join(", ");
        addressParts.push(states);
      }
      if (eventLocation.country) addressParts.push(eventLocation.country.name);
      return addressParts.join(", ");
    }

    return (
      <div>
        <Card className="mb-4 relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-md"
            style={{
              backgroundColor: eventTypeColors.holiday,
            }}
          />
          <CardContent className="p-4">
            <div className="flex items-center mb-2 pb-2 border-b">
              {eventTypeIcons[event.primaryEventType || "festivals"]}
              <span
                className="text-xs font-semibold text-primary capitalize ml-2"
                style={{ color: eventTypeColors[event.primaryEventType || ""] }}
              >
                {event.primaryEventType}
              </span>
            </div>
            <h3 className="font-semibold mb-2 text-sm">{event.name}</h3>
            <div className="flex items-center text-xs mb-2">
              <span>{formatAddress(event.venueLocation)}</span>
            </div>
            <div className="flex items-start justify-between mt-2 pt-2 border-t">
              <div className="text-xs text-[#666666]">
                {formattedDateRange(event.startDateTime, event.endDateTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);
UnplannedCard.displayName = "UnplannedCard";

function EventList({
  showEventType,
  onClose,
  source,
  trackerId,
  mapRef,
  onEventHover,
  onEventLeave,
  searchParam,
}: {
  showEventType: string;
  onClose: () => void;
  mapRef: React.RefObject<MapRef>;
  source?: string;
  trackerId?: string | undefined;
  onEventHover: (event: Event) => void;
  onEventLeave: () => void;
  searchParam?: string | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [mapCenter, setMapCenter] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [mapRadius, setMapRadius] = useState<number | undefined>();
  const { getTrackerMapEvents } = useTrackerServices();
  const searchParams = useSearchParams();
  const eventService = useEventsService();
  const [hoveredPopupInfo, setHoveredPopupInfo] = useState<any | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    let timeoutId: NodeJS.Timeout;

    const updateViewBound = () => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      if (!bounds) return;
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const radius = turf.distance(
        turf.point([center.lng, center.lat]),
        turf.point([ne.lng, ne.lat]),
        { units: "kilometers" }
      );

      setMapCenter({ lat: center.lat, lng: center.lng });
      setMapRadius(radius);
      setCurrentPage(1);
    };

    const handleMoveEnd = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewBound, 300);
    };

    updateViewBound();

    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mapRef]);

  const filteredParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    params.set("skip", String((currentPage - 1) * 20));
    params.set("stats", "list");
    if (showEventType == "unAttended") params.set("eventTypes", "holiday");

    if (mapCenter && mapRadius) {
      const viewBound = {
        boundType: "point",
        coordinates: JSON.stringify({
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          radius: mapRadius,
        }),
      };
      if (source === "tracker") return JSON.stringify(viewBound).toString();
      params.set("viewBound", JSON.stringify(viewBound));
    }

    return params;
  }, [searchParams, currentPage, showEventType, mapCenter, mapRadius]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["events", filteredParams.toString(), currentPage],
    queryFn: () =>
      source === "tracker"
        ? getTrackerMapEvents(
            trackerId ?? "",
            `max=20&offset=${(currentPage - 1) * 20}`,
            `type=${searchParam}&viewBound=${filteredParams}&stats=list&limit=20&offset=${
              (currentPage - 1) * 20
            }`
          )
        : eventService.getEventsWithSearchParams(filteredParams.toString()),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function isEventResponse(data: any): data is EventsResponse {
    return data && "events" in data && Array.isArray(data.events);
  }

  const events: Event[] = isEventResponse(data) ? data.events : [];
  const count = isEventResponse(data) ? data.count : 0;
  const totalPages = Math.ceil(count / 20) || 1;

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

  const handleEventHover = (event: Event) => {
    onEventHover(event);
    if (event.venueLocation) {
      const { lat, lon } = getEventLatLong(event);
      setHoveredPopupInfo({
        events: [event],
        coordinates: {
          latitude: lat,
          longitude: lon,
        },
      });
    }
  };

  const handleEventLeave = () => {
    onEventLeave();
    setHoveredPopupInfo(null);
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
        <div className="flex items-center justify-center h-full">
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
          <div className="flex justify-between items-center border-b">
            <div className="flex space-x-2 my-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-white bg-primary">
                  {count}
                </Badge>
                <span className="text-xs font-semibold text-primary">
                  Events Found
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-lg"
              onClick={onClose}
            >
              &times;
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-7rem)] p-4 pt-0">
          {events.map((event: Event) => {
            if (event.primaryEventType == "holiday")
              return (
                <UnplannedCard
                  event={event}
                  key={event.id}
                  mapRef={mapRef}
                  onHover={() => handleEventHover(event)}
                  onLeave={handleEventLeave}
                />
              );
            return (
              <EventCard
                key={event.id}
                event={event}
                mapRef={mapRef}
                onHover={() => handleEventHover(event)}
                onLeave={handleEventLeave}
              />
            );
          })}
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
      className={`absolute z-10 top-0 right-0 h-full w-[345px] bg-white rounded-l-lg shadow-lg transition-transform duration-300 ease-in-out transform border ${
        showEventType ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {renderContent()}
      {hoveredPopupInfo && (
        <MapPopup
          popupInfo={hoveredPopupInfo}
          setPopupInfo={() => setHoveredPopupInfo(null)}
        />
      )}
    </div>
  );
}

export default memo(EventList);
