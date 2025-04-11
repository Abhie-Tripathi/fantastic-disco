import { Layer, Source } from "react-map-gl";
import { AlertPolygonResponse } from "@/types/events";
import { useEffect, useState, useMemo } from "react";
import { useEventsService } from "@/services/eventsService";
import type { MapRef } from "react-map-gl";

interface AlertPolygonLayerProps {
  eventId?: string;
  mapRef?: React.RefObject<MapRef>;
}

type AlertLevel = "Orange" | "Green" | "Red";

const getAlertColors = (alertLevel: AlertLevel) => {
  switch (alertLevel) {
    case "Red":
      return {
        fill: "rgba(255, 0, 0, 0.2)",
        stroke: "#ff0000",
      };
    case "Orange":
      return {
        fill: "rgba(255, 165, 0, 0.2)",
        stroke: "#ffa500",
      };
    case "Green":
      return {
        fill: "rgba(0, 128, 0, 0.2)",
        stroke: "#008000",
      };
    default:
      return {
        fill: "rgba(128, 128, 128, 0.2)",
        stroke: "#808080",
      };
  }
};

export default function AlertPolygonLayer({
  eventId,
  mapRef,
}: AlertPolygonLayerProps) {
  const [alertData, setAlertData] = useState<AlertPolygonResponse | null>(null);
  const { getAlertPolygon } = useEventsService();

  useEffect(() => {
    const fetchAlertPolygon = async () => {
      if (!eventId) {
        setAlertData(null);
        return;
      }

      try {
        const data = await getAlertPolygon(eventId);
        setAlertData(data || null);

        if (data?.features?.[0]?.bbox && mapRef?.current) {
          const [minLng, minLat, maxLng, maxLat] = data.features[0].bbox;
          mapRef.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            {
              padding: 50,
              duration: 2000,
              essential: true,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching alert polygon:", error);
        setAlertData(null);
      }
    };

    fetchAlertPolygon();
  }, [eventId, mapRef]);

  const layerStyle = useMemo(() => {
    if (!alertData?.features?.[0]) return null;

    const alertLevel = alertData.features[0].properties
      .alertlevel as AlertLevel;
    return getAlertColors(alertLevel);
  }, [alertData]);

  if (!alertData || !eventId || !layerStyle) return null;

  return (
    <Source id="alert-polygon-source" type="geojson" data={alertData}>
      {/* Polygon Fill Layer */}
      <Layer
        id="alert-polygon-fill"
        type="fill"
        paint={{
          "fill-color": layerStyle.fill,
          "fill-opacity": 0.6,
        }}
      />

      {/* Polygon Outline Layer */}
      <Layer
        id="alert-polygon-outline"
        type="line"
        paint={{
          "line-color": layerStyle.stroke,
          "line-width": 2,
        }}
      />
    </Source>
  );
}
