"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./map.module.css";
import { Map, Marker } from "react-map-gl";
import MapPointer from "/public/Marker.svg";
import Image from "next/image";
import { Event, EventsResponse, GTMEventDetail } from "@/types/events/events";
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import Text from "../new-ui/Text";
import { MapEvents } from "@/types/events";
import { Loader2 } from "lucide-react";
import { useMiscService } from "@/services/miscService";
import MapPopup from "../map/popup";

interface MapProps {
  startDate: string;
  endDate: string;
  style: React.CSSProperties;
  event: GTMEventDetail;
  zoom?: number;
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
    venueLocation,
  } = event;
  const [selectedPlace, setSelectedPlace] = useState<any | null>();
  const [eventDateRange, setEventDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: startDateTime, endDate: endDateTime });
  const { getEventsWithSearchParams, getEventById } = useEventsService();
  const [events, setEvents] = useState<MapEvents[]>([]);
  const [popupInfo, setPopupInfo] = useState<Event | null>(null);

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
    event.venueLocation?.venue?.latitude ??
    event.venueLocation?.city?.latitude ??
    event.venueLocation?.state?.latitude;
  const longitude =
    event.venueLocation?.venue?.longitude ??
    event.venueLocation?.city?.longitude ??
    event.venueLocation?.state?.longitude;

  const viewBound = {
    boundType: "point",
    coordinates: JSON.stringify({
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: 10,
    }),
  };
  const viewBoundString = encodeURIComponent(JSON.stringify(viewBound));

  const params = `status=active%2Ccancelled%2Cpostponed%2Cpredicted&eventTypes=community%2Cconcert%2Cperforming-arts%2Csport%2Cfestival%2Cworkshops%2Ctradeshows%2Cconferences&active_gte=${new Date(
    startDate
  ).toISOString()}&active_lte=${new Date(endDate).toISOString()}&view=map${
    !latitude && !longitude ? `&locationIds=${venueLocation?.city.id}` : ""
  }&viewBound=${viewBoundString}`;

  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eventDetail", startDate, endDate],
    queryFn: async () => await getEventsWithSearchParams(params.toString()),
  });

  useEffect(() => {
    if (eventsData) {
      setEvents((eventsData?.events as MapEvents[]) || []);
    }
  }, [eventsData]);

  // useEffect(() => {
  //   if (activeDate !== "" && activeDate !== null) {
  //     setEventDateRange((prev) => ({
  //       ...prev,
  //       startDate: activeDate,
  //       endDate: activeDate,
  //     }));
  //   }
  // }, [activeDate]);

  const handleMarkerClick = async (eventData: MapEvents) => {
    try {
      const eventDetails = await getEventById(eventData.id);
      console.log(eventDetails);
      setPopupInfo(eventDetails?.event as Event | null);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };
  return (
    <div className="relative">
      <Map
        style={style}
        mapStyle="mapbox://styles/mapbox/streets-v12"
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