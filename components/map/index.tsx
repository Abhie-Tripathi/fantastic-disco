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
  type MapRef,
  Source,
  Layer,
  type ViewState,
} from "react-map-gl";
import { isEventeli, MapboxToken } from "@/config";
import { Button } from "@/components/ui/button";
import { AlignLeft } from "lucide-react";
import EventList from "./event-list";
import Alerts from "./alerts";
import mapboxgl from "mapbox-gl";
import type { Event, EventCount, MapEvents } from "@/types/events";
import { useEventsService } from "@/services/eventsService";
import { useQuery } from "@/hooks/useQuery";
import { circle, point } from "@turf/turf";
import type { LayerProps } from "react-map-gl";
import MapPopup from "./popup";
import ZeroState from "@/app/components/zerostate";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocationService } from "@/services/locationService";
import EventCountsLayer from "./layers/EventCountsLayer";
import EventsLayer from "./layers/EventsLayer";
import HoverTooltip from "./hoverTooltip";
import AlertPolygonLayer from "./layers/AlertLayer";
import { useTrackerContext } from "@/context/tracker";
import Loading from "../ui/Loading";
import { useTrackerServices } from "@/services/trackerServices";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { useSearchParams } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Skeleton } from "@/components/ui/skeleton";
import styles from '@/app/components/internal/trackers/MyTrackers/myTrackers.style.module.css'
import CustomTrackerNullState from "@/app/components/internal/trackers/Filters/customTrackerNullState";
import { debounce } from "lodash";
const MapStyle = {
  Street: "mapbox://styles/mapbox/streets-v12",
  Dark: "mapbox://styles/mapbox/dark-v11",
};

const iconUrls: Record<string, string> = {
  "stage-performance": "/eventType/map/arts.png",
  "community-group": "/eventType/map/community.png",
  concert: "/eventType/map/concerts.png",
  conferences: "/eventType/map/conferences.png",
  festival: "/eventType/map/festivals.png",
  sport: "/eventType/map/sports.png",
  workshops: "/eventType/map/workshops.png",
  tradeshows: "/eventType/map/expos.png",
  "multiple-events": "/eventType/map/union.png",
};

interface MapProps {
  searchParams?: string;
  source?: string;
  trackerId?: string;
  isGlobal?: boolean;
  trackerLoc?: string;
  trackerType?: string;
  eventType?: string;
  trackerGeoCordinates?: any;
}

interface Coordinates {
  latitude: string;
  longitude: string;
}

interface PopupInfo {
  events: Event[];
  coordinates: Coordinates;
}

type ZoomGroup = "country" | "state" | "city" | "event" | null;

export default function MapComponent({
  source,
  trackerId,
  isGlobal,
  trackerLoc,
  trackerType,
  eventType,
  trackerGeoCordinates,
}: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { getFilterValue } = useFilterState();
  const { getMapViewData, getEventsLatLongData } = useTrackerServices();
  const id = getFilterValue("id");

  const { data } = useTrackerContext();
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 0.8,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [events, setEvents] = useState<MapEvents[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<string>();
  const { getLocationDetails, getLocationBBox } = useLocationService();
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [showEventList, setShowEventList] = useState("");
  const [currentZoomGroup, setCurrentZoomGroup] = useState<ZoomGroup>("city");
  const {
    getEventsCount,
    getEvents,
    getEventsWithSearchParams,
    getRawEventsWithSearchParams,
  } = useEventsService();
  const [showUnattendedEvents, setShowUnattendedEvents] = useState(false);
  const [locationBBox, setLocationBBox] = useState<any | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    feature: any;
    clusteredPoints?: { name: string; count: number }[];
  } | null>(null);
  //   const cityIds = data?.tracker?.filterValue?.locationIds?.city?.length > 0
  //   ? data?.tracker?.filterValue.locationIds.city.map((city:LocationObject) => Object.keys(city)[0])
  //   : [];

  // const countryIds = data?.tracker?.filterValue?.locationIds?.country?.length > 0
  //   ? data?.tracker?.filterValue.locationIds.country.map((country:LocationObject) => Object.keys(country)[0])
  //   : [];

  // const stateIds = data?.tracker?.filterValue?.locationIds?.state?.length > 0
  //   ? data?.tracker?.filterValue.locationIds.state.map((state:LocationObject) => Object.keys(state)[0])
  //   : [];
  //   const trackerLoc=[...countryIds, ...stateIds, ...cityIds];

  const isHolidaySelected = getFilterValue("eventTypes")
    .split(",")
    .includes("holiday");
  const [highlightedEvent, setHighlightedEvent] = useState<Event | null>(null);
  const [isMapMoving, setIsMapMoving] = useState(false);

  const location = useMemo(() => {
    const geoCoordinates = getFilterValue("viewBound");
    const locationIds =
      source === "tracker"
        ? trackerLoc?.length > 0
          ? trackerLoc
          : "defaultLoc"
        : getFilterValue("locationIds").length === 0
        ? "defaultLoc"
        : getFilterValue("locationIds");

    if (
      geoCoordinates ||
      Object?.keys(trackerGeoCordinates || {}).length != 0
    ) {
      if (source === "tracker")
        return { type: "geoCoordinates", trackerGeoCordinates };
      return { type: "geoCoordinates", ...JSON.parse(geoCoordinates) };
    } else if (locationIds.length) {
      return { type: "locationIds", locationIds };
    }
    return null;
  }, [searchParams, trackerLoc]);

  const shouldFetchEventsDirectly = location?.type === "geoCoordinates";

  const eventCountsQuery = useQuery<EventCount[], Error>({
    queryKey:
      source === "tracker"
        ? ["eventCounts", trackerId, currentZoomGroup, eventType]
        : source === "tracker_global"
        ? ["eventCounts", searchParams.toString()]
        : ["eventCounts", currentZoomGroup, searchParams.toString(), location],
    queryFn: async () => {
      if (shouldFetchEventsDirectly) return [];
      if (source === "tracker" || source === "tracker_global") {
        const response = await getMapViewData(trackerId, "city", eventType, isGlobal?trackerType:searchParams.get("type"));
        return response || [];
      } else {
        const response = await getEventsCount({
          ...Object.fromEntries(searchParams.entries()),
          groupBy: "city",
        });
        console.log(Object.fromEntries(searchParams.entries()));
        return response || [];
      }
    },
    retry:true,
    enabled: !shouldFetchEventsDirectly,
  });

  const directEventsQuery = useQuery<MapEvents[], Error>({
    queryKey: [
      "directEvents",
      source === "tracker" ? trackerId : searchParams.toString(),
      location,
      eventType,
      trackerType,
    ],
    queryFn: async () => {
      if (!shouldFetchEventsDirectly) return [];
  
      const { coordinates } = source === "tracker" ? location.trackerGeoCordinates : location;
      const viewBound = {
        boundType: "point",
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          radius: coordinates.radius,
        },
      };
  
      try {
        let eventsData: any = {};
        if (source === "tracker") {
          eventsData = await getEventsLatLongData(
            trackerId,
            `viewBound=${encodeURIComponent(JSON.stringify(viewBound))}`,
            searchParams,
            trackerType,
          );
        } else {
          const modifiedSearchParams = searchParams
            ?.toString()
            .replace(/locationIds=[^&]*&?/, "")
            .replace(/viewBound=[^&]*&?/, "");
          const viewBoundString = encodeURIComponent(JSON.stringify(viewBound));
          const finalSearchParams = `${modifiedSearchParams}&viewBound=${viewBoundString}`;
          eventsData = await getEventsWithSearchParams(finalSearchParams);
        }
  
        return (eventsData?.events as MapEvents[]) || [];
      } catch (error) {
        console.error("Error fetching direct events:", error);
        return [];
      }
    },
    retry: true,
    enabled: shouldFetchEventsDirectly,
  });

  useEffect(() => {
    if (shouldFetchEventsDirectly && directEventsQuery.data) {
      setEvents(directEventsQuery.data);
    }
  }, [shouldFetchEventsDirectly, directEventsQuery.data]);

  const handleMapClick = async (e: any) => {
    setHoverInfo(null);

    const features = e.target.queryRenderedFeatures(e.point, {
      layers: [
        "unclustered-events-single",
        "unclustered-events-multiple",
        "clustered-counts-circle",
        "unclustered-counts-circle",
        "clustered-events-circle",
      ],
    });

    if (features && features.length > 0) {
      const clickedFeature = features[0];
      const layerId = clickedFeature.layer.id;

      switch (layerId) {
        case "unclustered-events-single":
          const singleEventDetails = await getEvents({
            eventIds: clickedFeature.properties.id,
          });
          if (singleEventDetails)
            setPopupInfo({
              events: [singleEventDetails.events[0]],
              coordinates: {
                latitude: clickedFeature.geometry.coordinates[1],
                longitude: clickedFeature.geometry.coordinates[0],
              },
            });
          break;

        case "unclustered-events-multiple":
          const eventIds = JSON.parse(clickedFeature.properties.eventIds);
          const multipleEventDetails = await Promise.all(
            eventIds.map((id: any) =>
              getEvents({
                eventIds: id,
              }).then((data) => data?.events[0])
            )
          );
          setPopupInfo({
            events: multipleEventDetails.filter((event) => event !== null),
            coordinates: {
              latitude: clickedFeature.geometry.coordinates[1],
              longitude: clickedFeature.geometry.coordinates[0],
            },
          });
          break;

        case "clustered-counts-circle":
          const feature = e.features && e.features[0];
          if (feature) {
            if (feature.properties.cluster) {
              const clusterId = feature.properties.cluster_id;
              const mapboxSource = mapRef.current?.getSource(
                "event-source"
              ) as mapboxgl.GeoJSONSource;

              mapboxSource.getClusterExpansionZoom(
                clusterId,
                (err: any, zoom: number) => {
                  if (err) return;

                  mapRef.current?.easeTo({
                    center: feature.geometry.coordinates as [number, number],
                    zoom: zoom + 4,
                    duration: 500,
                    essential: true,
                  });
                }
              );
            }
          }
          break;

        case "unclustered-counts-circle":
          const unclusteredFeature = e.features && e.features[0];
          if (unclusteredFeature) {
            mapRef.current?.easeTo({
              center: unclusteredFeature.geometry.coordinates as [
                number,
                number
              ],
              zoom: 12,
              duration: 500,
              essential: true,
            });
          }
          break;

        case "clustered-events-circle":
          const clusteredFeature = e.features && e.features[0];
          if (clusteredFeature) {
            if (clusteredFeature.properties.cluster) {
              const clusterId = clusteredFeature.properties.cluster_id;
              const mapboxSource = mapRef.current?.getSource(
                "events-source"
              ) as mapboxgl.GeoJSONSource;

              mapboxSource.getClusterExpansionZoom(
                clusterId,
                (err: any, zoom: number) => {
                  if (err) return;

                  mapRef.current?.easeTo({
                    center: clusteredFeature.geometry.coordinates as [
                      number,
                      number
                    ],
                    zoom: zoom * 1.2,
                    duration: 500,
                    essential: true,
                  });
                }
              );
            }
          }
          break;

        default:
          setPopupInfo(null);
      }
    } else {
      setPopupInfo(null);
    }
  };

  const lastFetchCenter = useRef<{ lat: number; lng: number } | null>(null);
  const isCurrentlyFetching = useRef(false);
  const currentZoomGroupRef = useRef(currentZoomGroup);
  const searchParamsRef = useRef(searchParams);
  const sourceRef = useRef(source);
  const trackerIdRef = useRef(trackerId);
  const trackerTypeRef = useRef(trackerType);
  const hasInitiallyFetchedForGeoCoordinates = useRef(false);

  useEffect(() => {
    currentZoomGroupRef.current = currentZoomGroup;
  }, [currentZoomGroup]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    sourceRef.current = source;
    trackerIdRef.current = trackerId;
    trackerTypeRef.current = trackerType;
  }, [source, trackerId, trackerType]);

  const fetchEventsOnMove = useCallback(async () => {
    const isGeoCoordinates = location?.type === "geoCoordinates";
    const shouldSkipForGeoCoordinates = isGeoCoordinates && hasInitiallyFetchedForGeoCoordinates.current;

    if (
      currentZoomGroupRef.current !== "event" ||
      !mapRef.current ||
      isCurrentlyFetching.current ||
      shouldSkipForGeoCoordinates
    ) {
      return;
    }

    const map = mapRef.current.getMap();
    if (!map) return;

    const center = map.getCenter();
    const bounds = map.getBounds();
    if (!bounds) return;

    if (!isGeoCoordinates && lastFetchCenter.current) {
      const distance = Math.sqrt(
        Math.pow(center.lat - lastFetchCenter.current.lat, 2) +
          Math.pow(center.lng - lastFetchCenter.current.lng, 2)
      );
      if (distance < 0.02) {
        return;
      }
    }

    isCurrentlyFetching.current = true;
    lastFetchCenter.current = { lat: center.lat, lng: center.lng };

    let viewBound;

    if (location?.type === "geoCoordinates") {
      const { coordinates } = source === "tracker" ? location.trackerGeoCordinates : location;
      viewBound = {
        boundType: "point",
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          radius: coordinates.radius,
        },
      };
    } else {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const radius =
        (Math.max(Math.abs(ne.lng - sw.lng), Math.abs(ne.lat - sw.lat)) * 111) /
        2;

      viewBound = {
        boundType: "point",
        coordinates: {
          latitude: center.lat,
          longitude: center.lng,
          radius: radius,
        },
      };
    }

    try {
      let eventsData: any = {};
      if (sourceRef.current === "tracker") {
        eventsData = await getEventsLatLongData(
          trackerIdRef.current,
          `viewBound=${encodeURIComponent(JSON.stringify(viewBound))}`,
          searchParamsRef.current,
          trackerTypeRef.current
        );
      } else {
        const modifiedSearchParams = searchParamsRef.current
          ?.toString()
          .replace(/locationIds=[^&]*&?/, "")
          .replace(/viewBound=[^&]*&?/, "");
        const viewBoundString = encodeURIComponent(JSON.stringify(viewBound));
        const finalSearchParams = `${modifiedSearchParams}&viewBound=${viewBoundString}`;
        eventsData = await getEventsWithSearchParams(finalSearchParams);
      }

      console.log("Events fetched on move:", eventsData?.events?.length);
      setEvents((eventsData?.events as MapEvents[]) || []);

      if (isGeoCoordinates) {
        hasInitiallyFetchedForGeoCoordinates.current = true;
      }
    } catch (error) {
      console.error("Error fetching events on map move:", error);
    } finally {
      isCurrentlyFetching.current = false;
      setIsMapMoving(false);
    }
  }, [location]);

  const debouncedFetchEventsOnMove = useMemo(() => {
    return debounce(fetchEventsOnMove, 500);
  }, [fetchEventsOnMove]);

  const lastCallTime = useRef(0);
  const COOLDOWN_PERIOD = 800;

  const onMove = useCallback(
    ({ viewState }: { viewState: ViewState }) => {
      setViewport(viewState);

      const isGeoCoordinates = location?.type === "geoCoordinates";
      const shouldSkipForGeoCoordinates = isGeoCoordinates && hasInitiallyFetchedForGeoCoordinates.current;

      if (currentZoomGroup === "event" && !isCurrentlyFetching.current && !shouldSkipForGeoCoordinates) {
        const now = Date.now();
        if (now - lastCallTime.current > COOLDOWN_PERIOD) {
          console.log("Map moved in event zoom group - triggering fetch");
          lastCallTime.current = now;
          setIsMapMoving(true);
          debouncedFetchEventsOnMove();
        }
      }
    },
    [currentZoomGroup, debouncedFetchEventsOnMove, location]
  );
  useEffect(() => {
    if (
      currentZoomGroup === "event" &&
      mapRef.current &&
      !isCurrentlyFetching.current
    ) {
      console.log("Zoom group changed to event");
      lastFetchCenter.current = null;
      lastCallTime.current = 0;

      const timeoutId = setTimeout(() => {
        if (currentZoomGroupRef.current === "event") {
          fetchEventsOnMove();
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [currentZoomGroup, fetchEventsOnMove, location]);

  useEffect(() => {
    return () => {
      debouncedFetchEventsOnMove.cancel();
    };
  }, [debouncedFetchEventsOnMove]);

  useEffect(() => {
    hasInitiallyFetchedForGeoCoordinates.current = false;
  }, [location]);

  const eventCountsGeoJSON = React.useMemo(() => {
    return {
      type: "FeatureCollection",
      features: eventCountsQuery.data
        ? eventCountsQuery?.data?.map((count: EventCount) => ({
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
              id: count.cityId,
              name: count.name,
              type: currentZoomGroup, // "country" or "city"
            },
          }))
        : [],
    };
  }, [eventCountsQuery.data, currentZoomGroup, location]);

  const eventsGeoJSON = React.useMemo(() => {
    const locationInfo: { [key: string]: any } = {};
    events.forEach((event) => {
      const coordKey = `${event.longitude},${event.latitude}`;
      if (!locationInfo[coordKey]) {
        locationInfo[coordKey] = { count: 0, ids: [] };
      }
      locationInfo[coordKey].count += 1;
      locationInfo[coordKey].ids.push(event.id);
    });

    return {
      type: "FeatureCollection",
      features: events.length
        ? events.map((event: MapEvents) => {
            const coordKey = `${event.longitude},${event.latitude}`;
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  parseFloat(event.longitude),
                  parseFloat(event.latitude),
                ],
              },
              properties: {
                id: event.id,
                eventType: event.eventType,
                eventImpactScore: event.eventImpactScore,
                eventCount: locationInfo[coordKey].count,
                eventIds: locationInfo[coordKey].ids,
              },
            };
          })
        : [],
    };
  }, [events]);

  const determineZoomGroup = useCallback((zoomLevel: number): ZoomGroup => {
    if (shouldFetchEventsDirectly) return "event";
    if (zoomLevel >= 11.5) {
      return "event";
    } else {
      return "city";
    }
  }, []);

  useEffect(() => {
    const newZoomGroup = determineZoomGroup(viewport.zoom);
    if (newZoomGroup !== currentZoomGroup) {
      setCurrentZoomGroup(newZoomGroup);
    }
  }, [viewport.zoom, currentZoomGroup, determineZoomGroup]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (
        location?.type === "locationIds" &&
        location.locationIds.length > 0 &&
        location.locationIds !== "defaultLoc"
      ) {
        try {
          const details = await getLocationDetails(location.locationIds);
          if (
            details?.formattedLocations &&
            details.formattedLocations.length > 0
          ) {
            let bboxLocation = null;

            if (details.formattedLocations.length === 1) {
              const location = details.formattedLocations[0];
              bboxLocation = [
                location.name,
                location.city?.name,
                location.state?.name,
                location.country?.iso,
              ]
                .filter(Boolean)
                .join(",");
            } else {
              const locations = details.formattedLocations;

              const firstState = locations[0].state?.name;
              const allSameState =
                firstState &&
                locations.every((loc) => loc.state?.name === firstState);

              const firstCountry = locations[0].country?.name;
              const allSameCountry =
                firstCountry &&
                locations.every((loc) => loc.country?.name === firstCountry);

              if (allSameState) {
                bboxLocation = firstState;
              } else if (allSameCountry) {
                bboxLocation = firstCountry;
              }
            }

            const locationType = details.formattedLocations[0].locationType;
            if (bboxLocation) {
              const bbox = await getLocationBBox(bboxLocation, locationType);
              setLocationBBox(bbox);
            } else {
              setLocationBBox(null);
            }
          }
        } catch (error) {
          console.error("Error fetching location details or bbox:", error);
        }
      }
    };
    fetchLocationDetails();
  }, [location, trackerId, trackerLoc]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (
      Object?.keys(trackerGeoCordinates || {}).length == 0 &&
      location.locationIds == "defaultLoc"
    ) {
      mapRef.current.flyTo({
        center: [35.2433, 38.9637],
        zoom: 0.8,
        duration: 3000,
        essential: true,
      });
    }

    if (location?.type === "geoCoordinates") {
      const { coordinates } =
        source === "tracker" ? location.trackerGeoCordinates : location;
      const zoom = Math.log2(360 / (coordinates.radius / 1000)) - 4.6;
      setCurrentZoomGroup("event");
      mapRef.current.flyTo({
        center: [Number(coordinates.longitude), Number(coordinates.latitude)],
        zoom: zoom,
        duration: 3000,
        essential: true,
      });
    }
    if (
      Object?.keys(trackerGeoCordinates || {}).length === 0 &&
      locationBBox &&
      location.locationIds != "defaultLoc"
    ) {
      const [minLng, minLat, maxLng, maxLat] = locationBBox;
      const bounds = new mapboxgl.LngLatBounds(
        [minLng, minLat],
        [maxLng, maxLat]
      );
      mapRef.current.fitBounds(bounds, {
        duration: 2000,
        essential: true,
      });
    }
  }, [location, mapRef.current, locationBBox, trackerId]);

  const circleLayer: LayerProps | null = useMemo(() => {
    if (location?.type === "geoCoordinates") {
      const { coordinates } =
        source === "tracker" ? location.trackerGeoCordinates : location;

      const center = point([
        Number(coordinates.longitude),
        Number(coordinates.latitude),
      ]);
      const circleGeoJSON = circle(
        center,
        coordinates.radius,
        50,
        "kilometers"
      );

      return {
        id: "circle-layer",
        type: "fill" as const,
        source: {
          type: "geojson",
          data: circleGeoJSON,
        },
        paint: {
          "fill-color": "rgba(138, 43, 220, 0.1)",
          "fill-outline-color": "rgba(138, 43, 220, 0.8)",
        },
      };
    }
    return null;
  }, [location]);

  const onMapLoad = useCallback(
    ({ target: map }) => {
      for (const [key, url] of Object.entries(iconUrls)) {
        map.loadImage(url, (error, image) => {
          if (error) throw error;
          if (!map.hasImage(key)) map.addImage(key, image);
        });
      }
      const center = map.getCenter();
      const zoom = map.getZoom();
      const bearing = map.getBearing();
      const pitch = map.getPitch();

      onMove({
        viewState: {
          latitude: center.lat,
          longitude: center.lng,
          zoom,
          bearing,
          pitch,
          transitionDuration: 0,
        },
      });
    },
    [iconUrls, onMove]
  );

const showEventCount = !shouldFetchEventsDirectly && viewport.zoom < 12 && eventCountsQuery.isSuccess;
const showEvent = shouldFetchEventsDirectly || viewport.zoom >= 12;

  const handleEventHover = (event: Event) => {
    setHighlightedEvent(event);
  };

  const handleEventLeave = () => {
    setHighlightedEvent(null);
  };

  if (
    isEventeli &&
    source !== "tracker" &&
    !searchParams.get("viewBound") &&
    !searchParams.get("locationIds") &&
    !searchParams.get("eventIds")
  ) {
    return (
      <div className="p-6">
        <CustomTrackerNullState />
      </div>
    );
  }
  return (
    <div className="relative px-4 md:px-0 w-full">
      {(shouldFetchEventsDirectly ? directEventsQuery.isLoading : (eventCountsQuery.isLoading && currentZoomGroup === "city")) ? (
  (isGlobal?<Skeleton className="w-full h-full"/>:<Loading />)
) : (shouldFetchEventsDirectly ? directEventsQuery.error : eventCountsQuery.error) ? (
  <ZeroState text={(shouldFetchEventsDirectly ? directEventsQuery.error : eventCountsQuery.error).message} isGlobal={isGlobal}/>
) : (
        <>
          {source === "tracker" && (shouldFetchEventsDirectly ? directEventsQuery?.data?.length === 0 : eventCountsQuery?.data?.length === 0) ? (
            <NullState
              image={TrackerNullState}
              global={isGlobal}
              title={`${!isGlobal?"We couldn’t find any events matching your tracker criteria at the moment.":""}`}
              text={`${!isGlobal?"Try adjusting your filters or checking back later, as new events are added frequently.":"We couldn’t find any events matching your tracker criteria at the moment."}`}
              buttonText="Manage Configuration"
              buttonUrl={`/internal/trackers/${trackerId}/editTracker?type=${trackerType}`}
            />
          ) : (
            <>
              {false ? (
                <ZeroState text="Please select a country, state, or city to view events. (Multiple Allowed)" />
              ) : (
                <ReactMapGL
                  style={{
                    width: "100%",
                    height: !isGlobal ? isMobile ? "calc(100dvh - 264px)" : "calc(100dvh - 136px)" : "180px",
                  }}
                  onMove={onMove}
                  onLoad={onMapLoad}
                  onClick={handleMapClick}
                  onMouseMove={(e) => {
                    const features = e.target.queryRenderedFeatures(e.point, {
                      layers: [
                        "clustered-counts-circle",
                        "unclustered-counts-circle",
                      ],
                    });
                    if (features.length > 0) {
                      const feature = features[0];
                      if (feature.properties.cluster) {
                        const clusterId = feature.properties.cluster_id;
                        const mapboxSource = mapRef.current?.getSource(
                          "event-source"
                        ) as mapboxgl.GeoJSONSource;
                        mapboxSource.getClusterLeaves(
                          clusterId,
                          100,
                          0,
                          (err, leaves) => {
                            if (err) {
                              console.error(
                                "Error getting cluster leaves:",
                                err
                              );
                              return;
                            }
                            const clusteredPoints = leaves.map((leaf) => ({
                              name: leaf.properties.name,
                              count: leaf.properties.count,
                            }));
                            setHoverInfo({
                              x: e.point.x,
                              y: e.point.y,
                              feature: feature,
                              clusteredPoints: clusteredPoints,
                            });
                          }
                        );
                      } else {
                        setHoverInfo({
                          x: e.point.x,
                          y: e.point.y,
                          feature: feature,
                        });
                      }
                    } else {
                      setHoverInfo(null);
                    }
                  }}
                  onMouseLeave={() => setHoverInfo(null)}
                  projection={{ name: "mercator" }}
                  mapStyle={MapStyle.Street}
                  mapboxAccessToken={MapboxToken}
                  minZoom={1.25}
                  interactiveLayerIds={[
                    "clustered-counts-circle",
                    "unclustered-counts-circle",
                    "clustered-events-circle",
                    "unclustered-events",
                  ]}
                  ref={mapRef}
                  {...viewport}
                >
                  {!isGlobal && (
                    <Button
                      variant="default"
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:transform-none md:left-auto md:top-4 md:right-4 bg-primary hover:bg-primary text-white font-semibold py-2 px-4 flex items-center space-x-2"
                      onClick={() => setShowEventList("all")}
                    >
                      <AlignLeft className="w-5 h-5" />
                      <span>Event List</span>
                    </Button>
                  )}

                  {isHolidaySelected && (
                    <div className="absolute top-4 left-4 bg-white rounded-sm shadow-sm flex items-center gap-2 p-2">
                      <Checkbox
                        id="showUnattendedEvents"
                        checked={showEventList == "unAttended"}
                        onCheckedChange={() => setShowEventList("unAttended")}
                      />
                      <Label htmlFor="showUnattendedEvents">
                        Show Unattended events
                      </Label>
                    </div>
                  )}
                  {isEventeli && source !== "tracker" && (
                    <Alerts
                      selectedAlert={selectedAlert}
                      setSelectedAlert={setSelectedAlert}
                    />
                  )}

                  {showEventList && (
                    <EventList
                      eventType={eventType}
                      source={source}
                      trackerId={trackerId}
                      searchParam={searchParams}
                      showEventType={showEventList}
                      onClose={() => setShowEventList("")}
                      mapRef={mapRef}
                      onEventHover={handleEventHover}
                      onEventLeave={handleEventLeave}
                    />
                  )}

                  <EventCountsLayer
                    eventCounts={eventCountsQuery.data || []}
                    currentZoomGroup={currentZoomGroup}
                    showEventCount={showEventCount}
                  />

                  {events && (
                    <EventsLayer
                      events={events}
                      showEvent={showEvent}
                      highlightedEventId={highlightedEvent?.id}
                    />
                  )}

                  {isEventeli && (
                    <AlertPolygonLayer
                      eventId={selectedAlert}
                      mapRef={mapRef}
                    />
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

                  {popupInfo && (
                    <MapPopup
                      popupInfo={popupInfo}
                      setPopupInfo={setPopupInfo}
                    />
                  )}

                  {hoverInfo && <HoverTooltip hoverInfo={hoverInfo} />}
                </ReactMapGL>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
