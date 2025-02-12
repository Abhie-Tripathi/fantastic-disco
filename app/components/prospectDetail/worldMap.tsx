import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  Source,
  Layer,
  ViewState,
  LayerProps,
} from "react-map-gl";
import { EventTableType } from "@/types/ListViewTable";
// import Loading from "@/app/components/UI/Loading";
import { useCompanyService } from "@/services/companyService";
import { MapboxToken } from "@/config";

interface MapProps {
  queryString?: string;
}

const zones = {
  Antarctica: { lat: -82.5, lng: 0 },
  "East Asia": { lat: 35, lng: 120 },
  "Eastern Europe": { lat: 52.5, lng: 25 },
  "India Subcontinent": { lat: 22.5, lng: 82.5 },
  "Latin America": { lat: -10, lng: -60 },
  "Middle East": { lat: 25, lng: 45 },
  "North America": { lat: 40, lng: -100 },
  "Northern Africa": { lat: 20, lng: 10 },
  "Northern Europe": { lat: 55, lng: 10 },
  Oceania: { lat: -20, lng: 150 },
  "SouthEast Asia": { lat: 10, lng: 110 },
  "Southern Africa": { lat: -25, lng: 25 },
  UK: { lat: 55, lng: -2 },
  "Western Europe": { lat: 45, lng: 5 },
};

const WorldMap = ({ companyId }: { companyId: string }) => {
  const [fullView, setFullView] = useState(true);
  const [eventPerPage, setEventPerPage] = useState<EventTableType[]>([]);
  // const [zonePerPage, setZonePerPage] = useState<any[]>([]);
  const [countryPerPage, setCountryPerPage] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // const [isListLoaded, setIsListLoaded] = useState<boolean>(true);

  const [totalAttentCount, setTotalAttentCount] = useState<number>(0);
  const [mostAttendedCountry, setMostAttendedCountry] = useState<string>();

  const [viewport, setViewport] = useState<any>({
    latitude: 22.1991660760527,
    longitude: 78.476681027237,
    width: fullView ? "calc(100vw - 85px)" : "",
    height: fullView ? "90vh" : "350px",
    zoom: 1,
    maxZoom: 20,
  });

  interface countryEventCounts {
    [id: string]: number;
  }
  const [countryEventCounts, setCountryEventCounts] =
    useState<countryEventCounts>({});

  const getOpacityValue = (countryId: string) => {
    if (countryId) {
      let totalCount =
        countryEventCounts["eventCount"] &&
        countryEventCounts["eventCount"] !== 0
          ? countryEventCounts["eventCount"]
          : 1;
      let val = Math.round((countryEventCounts[countryId] / totalCount) * 100);
      if (val == 0) return 0.1;
      else if (val < 20) return 0.2;
      else if (val > 80) return 0.8;
      else return val / 100;
    } else return 0.1;
  };

  const { getEventCountByCountry } = useCompanyService();

  const fetchEventsData = async () => {
    setIsLoaded(false);
    try {
      const countryData = await getEventCountByCountry(companyId);
      if (countryData) {
        setCountryPerPage(
          countryData.sort((a: any, b: any) => b.eventCount - a.eventCount)
        );
        setEventPerPage([]);
        const countryEventCountsObj: any = {};
        let totalAttentCount = 0;
        countryData.forEach((country: any) => {
          countryEventCountsObj[country.countryCode] = country.eventCount;
          totalAttentCount += country.eventCount;
        });
        setTotalAttentCount(totalAttentCount);
        setCountryEventCounts(countryEventCountsObj);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  let worldviewFilter = ["in", "iso_3166_1", "IN", "CN", "US"];

  const layerStyle = {
    id: "country-layer",
    type: "fill",
    source: "country-source",
    "source-layer": "country_boundaries",
    filter: worldviewFilter,
    paint: {
      "fill-color": "#6750a4",
      "fill-opacity": 0.4,
    },
  };

  const layers = Object.keys(countryEventCounts).map((country, index) => {
    const layerStyle: LayerProps = {
      id: `country-layer-${country}`,
      type: "fill",
      source: "country-source",
      "source-layer": "country_boundaries",
      maxzoom: 8,
      filter: ["==", "iso_3166_1", country],
      paint: {
        "fill-color": "#E7D4E8",
        "fill-opacity": getOpacityValue(country),
        "fill-outline-color": "#6750a4",
      },
    };
    return <Layer {...layerStyle} key={country} />;
  });

  const onMove = useCallback(({ viewState }: { viewState: ViewState }) => {
    setViewport(viewState);
  }, []);

  return (
    <div className="">
      <ReactMapGL
        style={{
          width: "100%",
          height: "280px",
        }}
        onMove={onMove}
        {...viewport}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
        projection={{ name: "mercator" }}
        mapboxAccessToken={MapboxToken}
      >
        {countryPerPage && countryPerPage.length > 0 && (
          <>
            <Source
              id="country-source"
              type="vector"
              url="mapbox://mapbox.country-boundaries-v1"
            >
              {layers}
            </Source>
            {countryPerPage.map((event) => (
              <div key={event.countryId}>
                <Marker
                  key={event.countryId}
                  latitude={
                    event.geoCordinates.latitude
                      ? parseFloat(event.geoCordinates.latitude)
                      : 0
                  }
                  longitude={
                    event.geoCordinates.longitude
                      ? parseFloat(event.geoCordinates.longitude)
                      : 0
                  }
                >
                  <span className="bg-white px-1 py-0.5 rounded-sm border">
                    {event.eventCount}
                  </span>
                </Marker>
              </div>
            ))}
          </>
        )}
      </ReactMapGL>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] shadow-md border border-[var(--neutral-light-color)] p-2 rounded-md gap-2 w-auto h-full">
          <span className="text-[#6E6F89] text-xs">Events Attended</span>
          <span className="text-base font-bold">{totalAttentCount}</span>
        </div>

        <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] shadow-md border border-[var(--neutral-light-color)] p-2 rounded-md gap-2 w-auto h-full">
          <span className="text-[#6E6F89] text-xs">Most Attended in</span>
          <span className="text-base font-bold">{countryPerPage[0]?.name}</span>
        </div>

        <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] shadow-md border border-[var(--neutral-light-color)] p-2 rounded-md gap-2 w-auto h-full">
          <span className="text-[#6E6F89] text-xs">Other Countries..</span>
          <span
            className="text-base font-bold line-clamp-1"
            title={countryPerPage.map((item) => item.name).join(", ")}
          >
            {countryPerPage
              .slice(1, 5)
              .map((item) => item.name)
              .join(", ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
