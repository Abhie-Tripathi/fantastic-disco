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
import { EventDetailMapSkeleton } from "./skeletons";

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
  const { id: eventId, primaryEventType, eventLocation } = event;
  const { theme } = useTheme();
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

  const latitude = eventLocation?.latitude;
  const longitude = eventLocation?.longitude;

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
        limit: 20,
        ...(startDate && { active_gte: new Date(startDate).toISOString() }),
        ...(endDate && { active_lte: new Date(endDate).toISOString() }),
        ...(latitude && longitude && { viewBound: JSON.stringify(viewBound) }),
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && eventsData) {
      setEvents((eventsData.events as unknown as MapEvents[]) || []);
    }
  }, [eventsData, isLoading]);

  const handleMarkerClick = async (id: string) => {
    try {
      const eventDetails = await getEventDetailById(id);
      const { eventLocation } = (eventDetails && eventDetails.basic) || {};
      const result = {
        coordinates: {
          latitude: parseFloat(eventLocation?.latitude || "0").toString(),
          longitude: parseFloat(eventLocation?.longitude || "0").toString(),
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
      {isLoading ? (
        <EventDetailMapSkeleton
          className={isEventeli ? "h-[430px]" : "h-[308px]"}
        />
      ) : error ? (
        <div
          className={`w-full flex justify-center items-center ${
            isEventeli ? "h-[430px]" : "h-[308px]"
          }`}
        >
          Failed to fetch nearby events
        </div>
      ) : (
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
            {events.length &&
              events
                .filter((event) => event.id !== eventId)
                .map((event) => {
                  return (
                    <Marker
                      key={event.id}
                      onClick={() => handleMarkerClick(event.id)}
                      longitude={
                        event.longitude ? parseFloat(event.longitude) : 0
                      }
                      latitude={event.latitude ? parseFloat(event.latitude) : 0}
                      anchor="bottom"
                    >
                      <div className="marker">
                        {primaryEventType && (
                          <img
                            src={iconUrls[primaryEventType]}
                            alt={primaryEventType}
                            className={"w-6 h-6"}
                          />
                        )}
                      </div>
                    </Marker>
                  );
                })}
            <Marker
              key={eventId}
              longitude={parseFloat(longitude || "0")}
              latitude={parseFloat(latitude || "0")}
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
      )}
    </div>
  );
};

export default EventsMapView;
