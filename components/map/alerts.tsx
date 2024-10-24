import { useFilterState } from "@/hooks/useFilterState";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

interface GDACSEvent {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    eventtype: string;
    eventid: number;
    episodeid: number;
    name: string;
    alertlevel: string;
    fromdate: string;
    todate: string;
    country: string;
    htmldescription: string;
  };
}

const Alerts = () => {
  const { getFilterValue } = useFilterState();
  const [gdacsEvents, setGdacsEvents] = useState<GDACSEvent[]>([]);
  const [filteredGdacsEvents, setFilteredGdacsEvents] = useState<{
    alertName: string;
    alertLevel: string;
  }>();
  const [isGdacsLoading, setIsGdacsLoading] = useState(true);
  const [gdacsError, setGdacsError] = useState<string | null>(null);
  const geoCoordinate = JSON.parse(getFilterValue("geoCoordinates") || "null");
  const lng = geoCoordinate?.longitude || 0;
  const lat = geoCoordinate?.latitude || 0;
  const radius = geoCoordinate?.radius || 0;

  const getAlertLevelColor = (alertLevel: string | undefined) => {
    switch (alertLevel?.toLowerCase() || "") {
      case "red":
        return "bg-red-200 border-red-300";
      case "orange":
        return "bg-orange-200 border-orange-300";
      case "green":
        return "bg-green-200 border-green-300";
      default:
        return "bg-gray-200 border-gray-300";
    }
  };

  const getAlertTextColor = (alertLevel: string | undefined) => {
    switch (alertLevel?.toLowerCase() || "") {
      case "red":
        return "text-red-800";
      case "orange":
        return "text-orange-800";
      case "green":
        return "text-green-800";
      default:
        return "text-gray-800";
    }
  };

  const getAlertName = (alertName: string) => {
    switch (alertName) {
      case "EQ":
        return "Earthquakes";
      case "TS":
        return "Tsunami";
      case "TC":
        return "Tropical Cyclone";
      case "FL":
        return "Flood";
      case "VO":
        return "Volcano";
      case "DR":
        return "Drought";
      case "WF":
        return "Wildfire";
      default:
        return "Heavy Rainfall";
    }
  };

  useEffect(() => {
    const fetchGdacsEvents = async () => {
      setIsGdacsLoading(true);
      setGdacsError(null);
      try {
        const fromDate = new Date();
        const toDate = new Date();
        toDate.setFullYear(toDate.getFullYear() + 1);

        const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate=${
          fromDate.toISOString().split("T")[0]
        }&toDate=${
          toDate.toISOString().split("T")[0]
        }&alertlevel=Green;Orange;Red&eventlist=EQ;TS,TC,FL,VO,DR,WF`;
        const response = await fetch(url);
        const data = await response.json();
        setGdacsEvents(data.features);
      } catch (err) {
        setGdacsError("Failed to fetch GDACS events");
      } finally {
        setIsGdacsLoading(false);
      }
    };

    fetchGdacsEvents();
  }, []);

  useEffect(() => {
    const filterGdacsEventsByBoundingBox = () => {
      const center = turf.point([lng, lat]);
      const options = { units: "kilometers" as const };
      const circle = turf.circle(center, radius, 50, "kilometers");
      const bbox = turf.bbox(circle);
      const bboxPolygon = turf.bboxPolygon(bbox);

      const filtered = gdacsEvents.filter((event) => {
        const eventPoint = turf.point(event.geometry.coordinates);
        return booleanPointInPolygon(eventPoint, bboxPolygon);
      });

      setFilteredGdacsEvents({
        alertName: filtered[0]?.properties.eventtype,
        alertLevel: filtered[0]?.properties.alertlevel,
      });
    };

    filterGdacsEventsByBoundingBox();
  }, [gdacsEvents, lat, lng, radius]);

  if (!filteredGdacsEvents?.alertName) return null;

  return (
    <div className="absolute z-10 top-4 right-1/2 translate-x-1/2 p-1 bg-white rounded">
      <div
        className={cn(
          "w-full p-2 flex items-center text-sm border rounded justify-center",
          getAlertLevelColor(filteredGdacsEvents?.alertLevel)
        )}
      >
        <AlertTriangle
          className={cn(
            "w-4 h-4 mr-2",
            getAlertTextColor(filteredGdacsEvents?.alertLevel)
          )}
        />
        Possibility of
        <span
          className={cn(
            "mx-1 font-semibold",
            getAlertTextColor(filteredGdacsEvents?.alertLevel)
          )}
        >
          {getAlertName(filteredGdacsEvents?.alertName)}
        </span>
        on this day
      </div>
    </div>
  );
};

export default Alerts;
