"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2, Focus, X, Star, Radio } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Event, HolidayEventLocation } from "@/types/events";
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
import SortDropdown from "@/components/search/sortDropdown";
import { lightenColor } from "@/lib/utils";
import { viewBound } from "@/types/events/dto/event-query.dto";

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
    const [mapZoom, setMapZoom] = useState(0);

    useEffect(() => {
      if (mapRef.current) {
        setMapZoom(mapRef.current.getZoom());
        mapRef.current.on("zoom", () => {
          setMapZoom(mapRef.current?.getZoom() || 0);
        });
      }
    }, [mapRef]);

    const address = event.basic.eventLocation ? (
      event.basic.format === "online" ? (
        <span className="flex items-center">
          <Radio className="w-4 h-4 mr-1" /> Online
        </span>
      ) : event.basic.format === "hybrid" ? (
        <span className="flex items-center">
          <Radio className="w-4 h-4 mr-1" />
          <span>Hybrid&nbsp;-&nbsp;</span>
          {[
            event.basic.eventLocation.locationType === "VENUE"
              ? event.basic.eventLocation.name
              : "TBA",
            event.basic.eventLocation.locationType !== "VENUE"
              ? event.basic.eventLocation.name
              : null,
            event.basic.eventLocation?.cityName,
            event.basic.eventLocation?.stateName !==
            event.basic.eventLocation?.cityName
              ? event.basic.eventLocation?.stateName
              : null,
            event.basic.eventLocation?.countryName !==
            event.basic.eventLocation?.cityName
              ? event.basic.eventLocation?.countryName
              : null,
          ]
            .filter(Boolean)
            .join(", ")}
        </span>
      ) : (
        [
          event.basic.eventLocation.locationType === "VENUE"
            ? event.basic.eventLocation.name
            : "TBA",
          event.basic.eventLocation.locationType !== "VENUE"
            ? event.basic.eventLocation.name
            : null,
          event.basic.eventLocation?.cityName,
          event.basic.eventLocation?.stateName !==
          event.basic.eventLocation?.cityName
            ? event.basic.eventLocation?.stateName
            : null,
          event.basic.eventLocation?.countryName !==
          event.basic.eventLocation?.cityName
            ? event.basic.eventLocation?.countryName
            : null,
        ]
          .filter(Boolean)
          .join(", ")
      )
    ) : (
      "Venue to be announced"
    );

    const handleZoomToLocation = (e: React.MouseEvent) => {
      e.preventDefault();
      if (mapRef.current && event.basic.eventLocation) {
        const { lat, lon } = getEventLatLong(event);
        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 18,
          duration: 2000,
          essential: true,
        });
      }
      onHover();
    };

    return (
      <Link href={`/internal/event/${event.basic.id}`}>
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
                    className={
                      "flex items-center gap-2 bg-pink-100 text-pink-800 hover:bg-pink-100 capitalize rounded-sm"
                    }
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
                  {event.basic.rating > 0 && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize rounded-sm"
                    >
                      <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                      <span>{event.basic.rating}</span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {event.basic.name}
                  </h3>
                </div>
                <div className="text-xs text-gray-600 mb-1">{address}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-primary">
                    {formattedDateRange(
                      event.basic.startDateTime,
                      event.basic.endDateTime
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-primary"
                    onClick={handleZoomToLocation}
                  >
                    <Focus className="w-3 h-3 mr-1" />
                    Zoom
                  </Button>
                </div>
              </div>
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
    function formatAddress(eventLocation: HolidayEventLocation[]): string {
      const addressParts: string[] = [];

      if (Array.isArray(eventLocation)) {
        const locations = eventLocation.map((loc) => {
          const parts: string[] = [];
          if (loc.displayName) parts.push(loc.displayName);

          return parts.join(", ");
        });
        return locations.join("; ");
      }
      return addressParts.join(", ");
    }

    return (
      <Link href={`/internal/event/${event.basic.id}`}>
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
              ) : (
                <div className="w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm">
                  <span className="text-[#5055A3] text-lg font-semibold">
                    {event.basic.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 capitalize rounded-sm"
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
                  {event.basic.rating > 0 && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize rounded-sm"
                    >
                      <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                      <span>{event.basic.rating}</span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {event.basic.name}
                  </h3>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {formatAddress(
                    event.basic
                      .eventLocation as unknown as HolidayEventLocation[]
                  )}
                </div>
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
  }
);
UnplannedCard.displayName = "UnplannedCard";

function EventList({
  eventType,
  showEventType,
  onClose,
  source,
  trackerId,
  mapRef,
  onEventHover,
  onEventLeave,
  searchParam,
}: {
  eventType?: string;
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
  const [sortBy, setSortBy] = useState("-score");

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
      const radius =
        Math.max(
          turf.distance(
            turf.point([center.lng, center.lat]),
            turf.point([ne.lng, center.lat]), // East point
            { units: "kilometers" }
          ),
          turf.distance(
            turf.point([center.lng, center.lat]),
            turf.point([center.lng, ne.lat]), // North point
            { units: "kilometers" }
          )
        ) * Math.sqrt(2);

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

    if (showEventType == "unAttended") {
      params.set("eventTypes", "holiday");
      params.delete("viewBound");
    }

    if (mapCenter && mapRadius && showEventType != "unAttended") {
      const viewBound = {
        boundType: "point",
        coordinates: {
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          radius: mapRadius,
        },
      };
      if (source === "tracker") return JSON.stringify(viewBound).toString();
      if (params.get("locationIds"))
        params.set("viewBound", JSON.stringify(viewBound));
      params.set("sortBy", sortBy);
    }

    return params;
  }, [searchParams, currentPage, showEventType, mapCenter, mapRadius, sortBy]);

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "events",
      filteredParams.toString(),
      currentPage,
      sortBy,
      eventType,
    ],
    queryFn: () =>
      source === "tracker"
        ? getTrackerMapEvents(
            trackerId ?? "",
            `${eventType}`,
            `viewBound=${filteredParams}&stats=list&limit=20&offset=${
              (currentPage - 1) * 20
            }&sortBy=${sortBy}`
          )
        : eventService.getEventsWithSearchParams(filteredParams.toString()),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function isEventResponse(data: any): data is any {
    return data && "events" in data && Array.isArray(data.events);
  }

  const events: Event[] = isEventResponse(data) ? data.events : [];
  const count = isEventResponse(data) ? data.count : 0;
  const totalPages = Math.ceil(count / 20) || 1;

  const handleSort = (newSortValue: string) => {
    setSortBy(newSortValue);
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

  const handleEventHover = (event: Event) => {
    onEventHover(event);
    if (event.basic.eventLocation) {
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 my-2">
              <Badge variant="secondary" className="text-white bg-primary">
                {count}
              </Badge>
              <span className="text-xs font-semibold text-primary">
                Events Found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SortDropdown compact={true} value={sortBy} onSort={handleSort} />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-7rem)] p-4 pt-0">
          {events.map((event: Event) => {
            if (event.basic.primaryEventType == "holiday")
              return (
                <UnplannedCard
                  event={event}
                  key={event.basic.id}
                  mapRef={mapRef}
                  onHover={() => handleEventHover(event)}
                  onLeave={handleEventLeave}
                />
              );
            return (
              <EventCard
                key={event.basic.id}
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
