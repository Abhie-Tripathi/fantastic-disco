import { Layer, Source } from "react-map-gl";
import { EventCount } from "@/types/events";
import { useMemo } from "react";

interface EventCountsLayerProps {
  eventCounts: EventCount[];
  currentZoomGroup: string;
  showEventCount: boolean;
}

export default function EventCountsLayer({
  eventCounts,
  currentZoomGroup,
  showEventCount,
}: EventCountsLayerProps) {
  const eventCountsGeoJSON = useMemo(() => ({
    type: "FeatureCollection",
    features: eventCounts
      ? eventCounts.map((count: EventCount) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(count.longitude), parseFloat(count.latitude)],
          },
          properties: {
            count: count.count,
            id: count.latitude,
            name: count.name,
            type: currentZoomGroup,
          },
        }))
      : [],
  }), [eventCounts, currentZoomGroup]);

  return (
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
          "circle-radius": ["step", ["get", "sum"], 15, 100, 25, 1000, 35],
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
          "text-field": ["coalesce", ["to-string", ["get", "count"]], "0"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
          visibility: showEventCount ? "visible" : "none",
        }}
        paint={{
          "text-color": "#fff",
        }}
      />
    </Source>
  );
} 