//@ts-nocheck
"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ReactMapGL, {
  MapRef,
  Marker,
  Source,
  Layer,
  ViewState,
  MapLayerMouseEvent,
} from "react-map-gl";
import { MapboxToken } from "@/config";
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import EventList from "./event-list";
import Link from "next/link";
import Alerts from "./alerts";
import { Event, EventCount, MapEvents } from "@/types/events";
import { useEventsService } from "@/services/eventsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFilterState } from "@/hooks/useFilterState";
import { circle, point } from "@turf/turf";
import { LayerProps } from "react-map-gl";
import { format } from "date-fns";
import MapPopup from "./popup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ZeroState from "@/app/components/zerostate";

const MapStyle = {
  Street: "mapbox://styles/mapbox/streets-v12",
};

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

const ZOOM_LEVELS = {
  INITIAL: 0.8,
  COUNTRY_MIN: 0,
  COUNTRY_MAX: 4,
  STATE_MIN: 4,
  STATE_MAX: 6,
  CITY_MIN: 6,
  CITY_MAX: 12,
  EVENT_MIN: 12,
  COUNTRY_ZOOM: 4,
  STATE_ZOOM: 6,
  CITY_ZOOM: 12,
};

interface MapProps {
  searchParams: string;
}

type ZoomGroup = "country" | "state" | "city" | "event";

export default function MapComponent({ searchParams }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const { getFilterValue } = useFilterState();
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: ZOOM_LEVELS.INITIAL,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [events, setEvents] = useState<MapEvents[]>([]);
  const [popupInfo, setPopupInfo] = useState<Event | null>(null);
  const [showEventList, setShowEventList] = useState(false);
  const [currentZoomGroup, setCurrentZoomGroup] =
    useState<ZoomGroup>("country");

  const queryClient = useQueryClient();
  const { getEventsCount, getEventsWithSearchParams, getEventById } =
    useEventsService();

  const memoizedGetEventsCount = useCallback(getEventsCount, []);
  const memoizedGetEventsWithSearchParams = useCallback(
    getEventsWithSearchParams,
    []
  );

  const location = useMemo(() => {
    const geoCoordinates = getFilterValue("geoCoordinates");
    const locationIds = getFilterValue("locationIds");

    if (geoCoordinates) {
      return { type: "geoCoordinates", ...JSON.parse(geoCoordinates) };
    } else if (locationIds) {
      return { type: "locationId", locationIds };
    }
    return null;
  }, [searchParams]);

  const determineZoomGroup = useCallback((zoomLevel: number): ZoomGroup => {
    if (zoomLevel < ZOOM_LEVELS.COUNTRY_MAX) {
      return "country";
    } else if (
      zoomLevel >= ZOOM_LEVELS.STATE_MIN &&
      zoomLevel < ZOOM_LEVELS.STATE_MAX
    ) {
      return "state";
    } else if (
      zoomLevel >= ZOOM_LEVELS.CITY_MIN &&
      zoomLevel < ZOOM_LEVELS.EVENT_MIN
    ) {
      return "city";
    } else {
      return "event";
    }
  }, []);

  const saveTrackerHandler = async () => {
    const userType = {
      ...(selectedInsights.eventRating && { rating: true }),
      ...(selectedInsights.estExhibit && { exhibit: true }),
      ...(selectedInsights.repeatSent && { trust: true }),
      ...(selectedMaturity !== "" &&
        selectedMaturity !== "none" && { maturity: true }),
      ...(selectedBrandedEvent && { brandedEvent: true }),
      ...(selectedEventSeries && { eventSeries: true }),
      ...(forecastedStatus && { forecastedStatus: true }),
      ...(analyticsToggles.impactScore && { impactScore: true }),
      ...(analyticsToggles.inboundScore && { inboundScore: true }),
      ...(analyticsToggles.internationalScore && { internationalScore: true }),
      ...(selectedRank !== "" &&
        selectedRank !== "none" && { eventRank: true }),
      ...(audienceZone && { audienceZone: true }),
      ...(audienceSpread && { audienceSpread: true }),
    };
    if (customTrackerName != "") {
      const formData = {
        name: customTrackerName,
        filterValue: adaptedParams,
      };

      try {
        const { data, error } = await myFetch(`${baseUrl}/tracker`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(data);

        if (error) {
          console.log(error);
          return;
        }
        if (data) {
          toast.success(
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              Tracker created successfully!{" "}
              <span
                className={styles["seeTracker-btn"]}
                onClick={() => router.replace("/internal/trackers")}
              >
                See Tracker
              </span>
            </div>,
            {
              position: "bottom-right",
              autoClose: 2000,
              // closeButton: false,
              hideProgressBar: true,
            }
          );
        }
      } catch (error) {
        console.error("Error saving tracker:", error);
      } finally {
        setTrackerModalOpen(false);
      }
    }
  };

  useEffect(() => {
    const newZoomGroup = determineZoomGroup(viewport.zoom);
    if (newZoomGroup !== currentZoomGroup) {
      setCurrentZoomGroup(newZoomGroup);
    }
  }, [viewport.zoom, currentZoomGroup, determineZoomGroup]);

  const eventCountsQuery = useQuery<EventCount[], Error>({
    queryKey: ["eventCounts", currentZoomGroup, searchParams],
    queryFn: async () => {
      const response = await memoizedGetEventsCount(
        `${searchParams}&groupBy=${currentZoomGroup}`
      );
      return response || [];
    },
    staleTime: 60 * 1000,
    enabled: currentZoomGroup !== "event" && location !== null,
  });

  useEffect(() => {
    const nextZoomGroup =
      currentZoomGroup === "country"
        ? "state"
        : currentZoomGroup === "state"
        ? "city"
        : currentZoomGroup === "city"
        ? "event"
        : null;

    if (nextZoomGroup && nextZoomGroup !== "event") {
      queryClient.prefetchQuery({
        queryKey: ["eventCounts", nextZoomGroup, searchParams],
        queryFn: async () => {
          const response = await memoizedGetEventsCount(
            `${searchParams}&groupBy=${nextZoomGroup}`
          );
          return response || [];
        },
        staleTime: 60 * 1000,
      });
    }
  }, [currentZoomGroup, searchParams, queryClient, memoizedGetEventsCount]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (currentZoomGroup === "event" && mapRef.current) {
        const map = mapRef.current.getMap();
        const center = map.getCenter();
        const bounds = map.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const radius =
            (Math.max(Math.abs(ne.lng - sw.lng), Math.abs(ne.lat - sw.lat)) *
              111) /
            2;

          const viewBound = {
            boundType: "point",
            coordinates: JSON.stringify({
              latitude: center.lat,
              longitude: center.lng,
              radius: radius,
            }),
          };

          try {
            const modifiedSearchParams = searchParams.replace(
              /locationIds=[^&]*&?/,
              ""
            );

            const viewBoundString = encodeURIComponent(
              JSON.stringify(viewBound)
            );

            const finalSearchParams = `${modifiedSearchParams}&viewBound=${viewBoundString}`;

            const eventsData = await memoizedGetEventsWithSearchParams(
              `${finalSearchParams}`
            );
            setEvents((eventsData?.events as MapEvents[]) || []);
          } catch (error) {
            console.error("Error fetching events:", error);
          }
        } else {
          console.error("Map bounds are not available");
        }
      } else {
        setEvents([]);
      }
    };

    fetchEvents();
  }, [
    currentZoomGroup,
    searchParams,
    memoizedGetEventsWithSearchParams,
    location,
  ]);

  // Handle map movement
  const onMove = useCallback(({ viewState }: { viewState: ViewState }) => {
    setViewport(viewState);
  }, []);

  // Prepare GeoJSON data for event counts
  const eventCountsGeoJSON = React.useMemo(() => {
    return {
      type: "FeatureCollection",
      features: eventCountsQuery.data
        ? eventCountsQuery.data.map((count: EventCount) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                parseFloat(count.longitude),
                parseFloat(count.latitude),
              ],
            },
            properties: {
              count: count.count,
              id: count.id,
              name: count.name,
              type: currentZoomGroup, // "country" or "city"
            },
          }))
        : [],
    };
  }, [eventCountsQuery.data, currentZoomGroup]);

  // Handle clicks on the map features
  // Inside your MapComponent
  const handleMapClick = useCallback(async (event: MapLayerMouseEvent) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0];
      const { type } = feature.properties;

      if (type === "country") {
        // Zoom into the country
        const countryCenter: [number, number] = [
          parseFloat(feature.geometry.coordinates[0]),
          parseFloat(feature.geometry.coordinates[1]),
        ];
        mapRef.current?.flyTo({
          center: countryCenter,
          zoom: ZOOM_LEVELS.COUNTRY_ZOOM,
          duration: 1000,
          essential: true,
        });
      } else if (type === "state") {
        // Zoom into the state
        const stateCenter: [number, number] = [
          parseFloat(feature.geometry.coordinates[0]),
          parseFloat(feature.geometry.coordinates[1]),
        ];
        mapRef.current?.flyTo({
          center: stateCenter,
          zoom: ZOOM_LEVELS.STATE_ZOOM,
          duration: 1000,
          essential: true,
        });
      } else if (type === "city") {
        // Zoom into the city
        const cityCenter: [number, number] = [
          parseFloat(feature.geometry.coordinates[0]),
          parseFloat(feature.geometry.coordinates[1]),
        ];
        mapRef.current?.flyTo({
          center: cityCenter,
          zoom: ZOOM_LEVELS.CITY_ZOOM,
          duration: 1000,
          essential: true,
        });
      }
    }
  }, []);

  const handleMarkerClick = async (eventData: MapEvents) => {
    try {
      const eventDetails = await getEventById(eventData.id);
      setPopupInfo(eventDetails?.event as Event | null);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (location?.type === "geoCoordinates") {
      const { latitude, longitude, radius } = location;
      const zoom = Math.log2(360 / (radius / 1000)) - 4.6;
      setCurrentZoomGroup("event");
      mapRef.current.flyTo({
        center: [Number(longitude), Number(latitude)],
        zoom: zoom,
        duration: 3000,
        essential: true,
      });
    } else {
      mapRef.current.flyTo({
        center: [0, 0],
        zoom: 1,
        duration: 3000,
        essential: true,
      });
    }
  }, [location, mapRef.current]);

  const circleLayer: LayerProps | null = useMemo(() => {
    if (location?.type === "geoCoordinates") {
      const { latitude, longitude, radius } = location;
      console.log(latitude, longitude, radius);
      const center = point([Number(longitude), Number(latitude)]);
      const circleGeoJSON = circle(center, radius, 50, "kilometers");

      return {
        id: "circle-layer",
        type: "fill" as const,
        source: {
          type: "geojson",
          data: circleGeoJSON,
        },
        paint: {
          "fill-color": "rgba(138, 43, 226, 0.1)",
          "fill-outline-color": "rgba(138, 43, 226, 0.8)",
        },
      };
    }
    return null;
  }, [location]);

  return (
    <div className="relative">
      {!location ? (
        <ZeroState
          text="Please select a country, state, or city to view events. (Multiple Allowed)"
        />
      ) : (
        <ReactMapGL
          style={{ width: "100%", height: "78vh" }}
          onMove={onMove}
          onClick={handleMapClick}
          projection={{ name: "mercator" }}
          mapStyle={MapStyle.Street}
          mapboxAccessToken={MapboxToken}
          minZoom={ZOOM_LEVELS.INITIAL}
          interactiveLayerIds={["event-counts"]}
          ref={mapRef}
          {...viewport}
        >
          <Button
            variant="default"
            className="absolute top-4 right-4 bg-primary hover:bg-primary text-white font-semibold py-2 px-4 flex items-center space-x-2"
            onClick={() => setShowEventList(!showEventList)}
          >
            <AlignLeft className="w-5 h-5" />
            <span>Event List</span>
          </Button>

          <EventList
            isVisible={showEventList}
            onClose={() => setShowEventList(false)}
          />

          {eventCountsQuery.isSuccess && currentZoomGroup !== "event" && (
            <Source
              id="event-counts-source"
              type="geojson"
              data={eventCountsGeoJSON}
            >
              <Layer
                id="event-counts"
                type="circle"
                paint={{
                  "circle-color": "#6F48AD",
                  "circle-radius": 20,
                  "circle-stroke-width": 1,
                  "circle-stroke-color": "#fff",
                }}
              />
              <Layer
                id="event-counts-label"
                type="symbol"
                layout={{
                  "text-field": "{count}",
                  "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                  "text-size": 12,
                }}
                paint={{
                  "text-color": "#ffffff",
                }}
              />
            </Source>
          )}

          {circleLayer && (
            <Source
              id="circle-source"
              type="geojson"
              data={circleLayer.source?.data}
            >
              <Layer {...circleLayer} />
            </Source>
          )}

          {circleLayer && <Alerts />}

          {(currentZoomGroup === "event" || circleLayer) &&
            events.map((event: MapEvents) => {
              return (
                <Marker
                  onClick={() => handleMarkerClick(event)}
                  key={event.id}
                  longitude={parseFloat(event.longitude)}
                  latitude={parseFloat(event.latitude)}
                  anchor="bottom"
                >
                  <div className="marker">
                    {event.eventType && (
                      <img
                        src={iconUrls[event.eventType]}
                        alt={event.eventType}
                        className="w-6 h-6"
                      />
                    )}
                  </div>
                </Marker>
              );
            })}

          {popupInfo && (
            <MapPopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
          )}
        </ReactMapGL>
      )}
    </div>
  );
}
