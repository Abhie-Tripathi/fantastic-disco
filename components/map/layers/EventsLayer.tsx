// @ts-nocheck

import { Layer, Source } from "react-map-gl";
import { MapEvents } from "@/types/events";
import { useMemo } from "react";


interface EventsLayerProps {
  events: MapEvents[];
  showEvent: boolean;
}

export default function EventsLayer({ events, showEvent }: EventsLayerProps) {
  const eventsGeoJSON = useMemo(() => {
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
                eventIds: JSON.stringify(locationInfo[coordKey].ids),
              },
            };
          })
        : [],
    };
  }, [events]);

  return (
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
        filter={["has", "point_count"]}
        layout={{ visibility: showEvent ? "visible" : "none" }}
        paint={{
          "circle-color": "#6f48ad",
          "circle-radius": ["step", ["get", "point_count"], 15, 15, 20, 50, 30],
        }}
      />
      <Layer
        id="clustered-events-count"
        type="symbol"
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
  );
} 