"use client";

import { isEventeli } from "@/config";
import { useTheme } from "@/context";
import { useEventsService } from "@/services/eventsService";
import { MapEvents } from "@/types/events";
import { Event } from "@/types/events/events";
import { useQuery } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import { Map, Marker } from "react-map-gl";
import MapPopup from "../map/popup";

interface MapProps {
  startDate: string;
  endDate: string;
  style: React.CSSProperties;
  event: Event["basic"];
  zoom?: number;
}
interface updatedEvent {
  coordinates: {
    latitude: string;
    longitude: string;
  };
  events: Event[];
}

const EventsMapView: React.FC<MapProps> = ({
  startDate,
  endDate,
  style,
  event,
  zoom = 0,
}) => {
  const {
    id: eventId,
    startDateTime,
    endDateTime,
    primaryEventType,
    eventLocation,
  } = event;
  const { theme } = useTheme();
  const [selectedPlace, setSelectedPlace] = useState<any | null>();
  const [eventDateRange, setEventDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: startDateTime, endDate: endDateTime });
  const { getEvents, getEventDetailById } = useEventsService();
  const [events, setEvents] = useState<MapEvents[]>([]);
  const [popupInfo, setPopupInfo] = useState<updatedEvent | null>(null);

  const iconUrls: Record<string, string> = {
    "performing-arts": "/eventType/arts.png",
    community: "/eventType/community.png",
    concert: "/eventType/concert.png",
    conferences: "/eventType/conference.png",
    festival: "/eventType/festival.png",
    sport: "/eventType/sport.png",
    workshops: "/eventType/workshop.png",
    tradeshows: "/eventType/expo.png",
  };

  const latitude =
    eventLocation?.venue?.latitude ??
    eventLocation?.city?.latitude ??
    eventLocation?.state?.latitude;
  const longitude =
    eventLocation?.venue?.longitude ??
    eventLocation?.city?.longitude ??
    eventLocation?.state?.longitude;

  const viewBound = {
    boundType: "point",
    coordinates: {
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: 10,
    },
  };

  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eventDetail", startDate, endDate],
    queryFn: async () =>
      await getEvents({
        status: "active,cancelled,postponed",
        ...(isEventeli
          ? {
              eventTypes:
                "community,concert,performing-arts,sport,festival,workshops,tradeshows,conferences",
            }
          : { eventTypes: "workshops,tradeshows,conferences" }),
        view: "map",
        ...(startDate && { active_gte: new Date(startDate).toISOString() }),
        ...(endDate && { active_lte: new Date(endDate).toISOString() }),
        ...(eventLocation?.city?.id && {
          locationIds: eventLocation?.city?.id || "",
        }),
        ...(latitude && longitude && { viewBound: JSON.stringify(viewBound) }),
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (eventsData) {
      setEvents((eventsData.events as unknown as MapEvents[]) || []);
    }
  }, [eventsData]);

  const handleMarkerClick = async (eventData: MapEvents) => {
    try {
      const eventDetails = await getEventDetailById(eventData.id);
      const { eventLocation } = (eventDetails && eventDetails.basic) || {};
      const result = {
        coordinates: {
          latitude: parseFloat(
            eventLocation?.venue?.latitude ||
              eventLocation?.city?.latitude ||
              eventLocation?.state?.latitude ||
              "0"
          ).toString(),
          longitude: parseFloat(
            eventLocation?.venue?.longitude ||
              eventLocation?.city?.longitude ||
              eventLocation?.state?.longitude ||
              "0"
          ).toString(),
        },
        events: [eventDetails],
      };
      setPopupInfo(result as updatedEvent | null);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };
  return (
    <div className="relative">
      <Map
        style={style}
        mapStyle={
          theme === "light"
            ? "mapbox://styles/mapbox/streets-v12"
            : "mapbox://styles/mapbox/dark-v11"
        }
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: Number(longitude),
          latitude: Number(latitude),
          zoom: zoom,
        }}
      >
        <div key={event.id}>
          {events &&
            events.length > 0 &&
            events
              .filter((event: MapEvents) => event.id !== eventId)
              .map((event: MapEvents) => {
                const { id, longitude, latitude, eventType } = event;
                return (
                  <Marker
                    key={id}
                    onClick={() => handleMarkerClick(event)}
                    longitude={parseFloat(longitude)}
                    latitude={parseFloat(latitude)}
                    anchor="bottom"
                  >
                    <div className="marker">
                      {eventType && (
                        <img
                          src={iconUrls[eventType]}
                          alt={eventType}
                          className={"w-6 h-6"}
                        />
                      )}
                    </div>
                  </Marker>
                );
              })}
          <Marker
            key={eventId}
            // onClick={() => handleMarkerClick(event)}
            longitude={parseFloat(longitude || "")}
            latitude={parseFloat(latitude || "")}
            anchor="bottom"
          >
            <div className="marker">
              {primaryEventType && (
                <img
                  src={iconUrls[primaryEventType]}
                  alt={primaryEventType}
                  className="w-10 h-10"
                />
              )}
            </div>
          </Marker>
        </div>
        {popupInfo && (
          <MapPopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        )}
      </Map>
    </div>
  );
};

export default EventsMapView;
