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
import Alerts from "./alerts";
import mapboxgl from "mapbox-gl";
import { Event, EventCount, MapEvents } from "@/types/events";
import { useEventsService } from "@/services/eventsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { circle, point } from "@turf/turf";
import { LayerProps } from "react-map-gl";
import MapPopup from "./popup";
import ZeroState from "@/components/zerostate";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocationService } from "@/services/locationService";
import { useFilterContext } from "@/context/filterContext";
import { useTrackerServices } from "@/services/trackerServices";
const MapStyle = {
  Street: "mapbox://styles/mapbox/streets-v12",
  Dark: "mapbox://styles/mapbox/dark-v11",
};

const iconUrls: Record<string, string> = {
  "performing-arts": "/eventType/map/arts.png",
  community: "/eventType/map/community.png",
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
  source?:string;
  trackerId?:string;
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

export default function MapComponent({ searchParams, source, trackerId }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const { getLocalFilterValue } = useFilterContext();
  const {getMapViewData, getEventsLatLongData}=useTrackerServices();
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 0.8,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [events, setEvents] = useState<MapEvents[]>([]);
  const { getLocationDetails, getLocationBBox } = useLocationService();
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [showEventList, setShowEventList] = useState("");
  const [currentZoomGroup, setCurrentZoomGroup] = useState<ZoomGroup>("city");
  const { getEventsCount, getEventsWithSearchParams, getEventById } =
    useEventsService();
  const [showUnattendedEvents, setShowUnattendedEvents] = useState(false);
  const [locationBBox, setLocationBBox] = useState<any | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    feature: any;
    clusteredPoints?: { name: string; count: number }[];
  } | null>(null);

  const memoizedGetEventsCount = useCallback(getEventsCount, []);
  const memoizedGetEventsWithSearchParams = useCallback(
    getEventsWithSearchParams,
    []
  );
  const isHolidaySelected = getLocalFilterValue("eventTypes")
    .split(",")
    .includes("holiday");

  const location = useMemo(() => {
    const geoCoordinates = getLocalFilterValue("geoCoordinates");
    const locationIds = source?"some random location from tracker":getLocalFilterValue("locationIds");

    if (geoCoordinates) {
      return { type: "geoCoordinates", ...JSON.parse(geoCoordinates) };
    } else if (locationIds.length) {
      return { type: "locationIds", locationIds };
    }
    return null;
  }, [searchParams]);

  const eventCountsQuery = useQuery<EventCount[], Error>({
    queryKey: source === "tracker"
      ? ["eventCounts", trackerId, currentZoomGroup, searchParams]
      : source === "tracker_global"
      ? [trackerId]
      : ["eventCounts", currentZoomGroup, searchParams],
  
    queryFn: async () => {
      if (source === "tracker" || source === "tracker_global") {
        const response = await getMapViewData(trackerId, "city", searchParams);
        console.log(response);
        
        return response || [];
      } else {
        const response = await memoizedGetEventsCount(`${searchParams}&groupBy=city`);
        return response || [];
      }
    },
  
    enabled: location !== null,
  });
  

  const handleMapClick = async (e: any) => {
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
          const singleEventDetails = await getEventById(
            clickedFeature.properties.id
          );
          console.log("Single event clicked:", clickedFeature.properties.id);
          if (singleEventDetails)
            setPopupInfo({
              events: [singleEventDetails.event],
              coordinates: {
                latitude: clickedFeature.geometry.coordinates[1],
                longitude: clickedFeature.geometry.coordinates[0],
              },
            });
          break;

        case "unclustered-events-multiple":
          const eventIds = JSON.parse(clickedFeature.properties.eventIds);
          const multipleEventDetails = await Promise.all(
            eventIds.map((id: string) =>
              getEventById(id).then((data) => data?.event)
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
          console.log("unclustered-counts-circle");
          const unclusteredFeature = e.features && e.features[0];
          console.log(unclusteredFeature);
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
          console.log("Clicked on an unexpected layer:", layerId);
          setPopupInfo(null);
      }
    } else {
      setPopupInfo(null);
    }
  };
  console.log(viewport.zoom);

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

            let eventsData: any = {}; // Define type if in TypeScript
    
            if (source === "tracker") {
              eventsData = await getEventsLatLongData(trackerId, `viewBound=${viewBoundString}`, searchParams);
            } else {
              eventsData = await memoizedGetEventsWithSearchParams(finalSearchParams);
            }
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

  const onMove = useCallback(({ viewState }: { viewState: ViewState }) => {
    
    setViewport(viewState);
  }, []);
  // useEffect(() => {
  //   setViewport({
  //     latitude: 0,
  //     longitude: 0,
  //     zoom: 3.95,
  //     bearing: 0,
  //     pitch: 0,
  //     padding: { top: 0, bottom: 0, left: 0, right: 0 },
  //   });
    
  //   // setCurrentZoomGroup(country)
  // }, [trackerId]);
  console.log(viewport);
  
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
              id: count.latitude,
              name: count.name,
              type: currentZoomGroup, // "country" or "city"
            },
          }))
        : [],
    };
  }, [eventCountsQuery.data, currentZoomGroup]);

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
      if (location?.type === "locationIds" && location.locationIds.length > 0 && source!=="tracker") {
        try {
          const details = await getLocationDetails(location.locationIds);
          if (
            details?.formattedLocations &&
            details.formattedLocations.length > 0
          ) {
            let bboxLocation = null;

            if (details.formattedLocations.length === 1) {
              bboxLocation =
                details.formattedLocations[0].displayName ||
                details.formattedLocations[0].name;
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

            if (bboxLocation) {
              const bbox = await getLocationBBox(bboxLocation);
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
  }, [location]);

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
    }
    if (locationBBox) {
      console.log("zooming in");
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
  }, [location, mapRef.current, locationBBox]);

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
          "fill-color": "rgba(138, 43, 220, 0.1)",
          "fill-outline-color": "rgba(138, 43, 220, 0.8)",
        },
      };
    }
    return null;
  }, [location]);

  const onMapLoad = useCallback(({ target: map }) => {
    for (const [key, url] of Object.entries(iconUrls)) {
      map.loadImage(url, (error, image) => {
        if (error) throw error;
        if (!map.hasImage(key)) map.addImage(key, image);
      });
    }
  }, []);

  const showEventCount = viewport.zoom < 12 && eventCountsQuery.isSuccess;
  const showEvent = viewport.zoom >= 12 && events.length;

  return (
    <div className="relative">
      {!location ? (
        <ZeroState text="Please select a country, state, or city to view events. (Multiple Allowed)" />
      ) : (
        <ReactMapGL
          style={{ width: "100%", height: "700px" }}
          onMove={onMove}
          onLoad={onMapLoad}
          onClick={handleMapClick}
          onMouseMove={(e) => {
            const features = e.target.queryRenderedFeatures(e.point, {
              layers: ["clustered-counts-circle", "unclustered-counts-circle"],
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
                      console.error("Error getting cluster leaves:", err);
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
          minZoom={0.8}
          interactiveLayerIds={[
            "clustered-counts-circle",
            "unclustered-counts-circle",
            "clustered-events-circle",
            "unclustered-events",
          ]}
          ref={mapRef}
          {...viewport}
        >
          <Button
            variant="default"
            className="absolute top-4 right-4 bg-primary hover:bg-primary text-white font-semibold py-2 px-4 flex items-center space-x-2"
            onClick={() => setShowEventList("all")}
          >
            <AlignLeft className="w-5 h-5" />
            <span>Event List</span>
          </Button>

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
          <Alerts />

          <EventList
            source={source}
            trackerId={trackerId}
            searchParam={searchParams}
            showEventType={showEventList}
            onClose={() => setShowEventList("")}
          />

          <Source
            id="event-source"
            type="geojson"
            data={eventCountsGeoJSON}
            cluster={true}
            clusterMaxZoom={13}
            clusterRadius={50}
            clusterProperties={{
              sum: ["+", ["coalesce", ["get", "count"], 0]],
            }}
          >
            <Layer
              id="clustered-counts-circle"
              type="circle"
              filter={["has", "point_count"]}
              paint={{
                "circle-color": "#6f48ad",
                "circle-radius": [
                  "step",
                  ["get", "sum"],
                  15,
                  100,
                  25,
                  1000,
                  35,
                ],
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
              }}
              layout={{ visibility: showEventCount ? "visible" : "none" }}
            />

            <Layer
              id="cluster-count"
              type="symbol"
              filter={["has", "point_count"]}
              layout={{
                "text-field": "{sum}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 14,
                visibility: showEventCount ? "visible" : "none",
              }}
              paint={{
                "text-color": "#fff",
              }}
            />

            <Layer
              id="unclustered-counts-circle"
              type="circle"
              filter={["!", ["has", "point_count"]]}
              layout={{ visibility: showEventCount ? "visible" : "none" }}
              paint={{
                "circle-color": "#6f48ad",
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "count"],
                  10,
                  20,
                  100,
                  25,
                  1000,
                  35,
                ],
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
              }}
            />

            <Layer
              id="unclustered-point-label"
              type="symbol"
              filter={["!", ["has", "point_count"]]}
              layout={{
                "text-field": [
                  "coalesce",
                  ["to-string", ["get", "count"]],
                  "0",
                ],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
                visibility: showEventCount ? "visible" : "none",
              }}
              paint={{
                "text-color": "#fff",
              }}
            />
          </Source>

          <Source
            id="events-source"
            type="geojson"
            data={eventsGeoJSON}
            cluster={true}
            clusterMaxZoom={16}
            clusterRadius={50}
          >
            <Layer
              id="clustered-events-circle"
              type="circle"
              source="events-source"
              filter={["has", "point_count"]}
              layout={{ visibility: showEvent ? "visible" : "none" }}
              paint={{
                "circle-color": "#6f48ad",
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  15,
                  15,
                  20,
                  50,
                  30,
                ],
              }}
            />

            <Layer
              id="clustered-events-count"
              type="symbol"
              source="events-source"
              filter={["has", "point_count"]}
              layout={{
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
                visibility: showEvent ? "visible" : "none",
              }}
              paint={{ "text-color": "#fff" }}
            />

            <Layer
              id="unclustered-events-single"
              type="symbol"
              filter={[
                "all",
                ["!", ["has", "point_count"]],
                ["==", ["get", "eventCount"], 1],
              ]}
              layout={{
                "icon-image": ["get", "eventType"],
                "icon-size": 0.5,
                visibility: showEvent ? "visible" : "none",
              }}
            />

            <Layer
              id="unclustered-events-multiple"
              type="symbol"
              filter={[
                "all",
                ["!", ["has", "point_count"]],
                [">", ["get", "eventCount"], 1],
              ]}
              layout={{
                "icon-image": "multiple-events",
                "icon-size": 1,
                "text-field": "{eventCount}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
                "text-offset": [-0.1, -0.4],
                visibility: showEvent ? "visible" : "none",
              }}
              paint={{
                "text-color": "#ffffff",
              }}
            />
          </Source>

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
            <MapPopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
          )}
          {hoverInfo && (
            <div
              className="absolute z-10 bg-white p-2 rounded shadow max-w-xs max-h-60 overflow-y-auto"
              style={{
                left: hoverInfo.x,
                top: hoverInfo.y - 10,
                transform: "translate(-50%, -100%)",
              }}
            >
              {hoverInfo.clusteredPoints ? (
                <>
                  {hoverInfo.clusteredPoints
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((point, index) => (
                      <div
                        key={index}
                        className="mb-1 flex justify-between items-center"
                      >
                        <span className="font-semibold">{point.name}</span>
                        <span className="ml-2">{point.count}</span>
                      </div>
                    ))}
                  {hoverInfo.clusteredPoints.length > 5 && (
                    <div className="text-xs text-gray-500 italic mt-1">
                      click to view more cities
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-1 flex justify-between items-center">
                  <span className="font-semibold">
                    {hoverInfo.feature.properties.name}
                  </span>
                  <span className="ml-2">
                    {hoverInfo.feature.properties.count}
                  </span>
                </div>
              )}
            </div>
          )}
        </ReactMapGL>
      )}
    </div>
  );
}