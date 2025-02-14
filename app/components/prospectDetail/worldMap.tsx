import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  Source,
  Layer,
  ViewState,
  LayerProps,
} from "react-map-gl";
// import Loading from "@/app/components/UI/Loading";
import { useCompanyService } from "@/services/companyService";
import { MapboxToken } from "@/config";


const WorldMap = ({ companyId }: { companyId: string }) => {
  const [fullView, setFullView] = useState(true);
  // const [zonePerPage, setZonePerPage] = useState<any[]>([]);
  const [countryPerPage, setCountryPerPage] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // const [isListLoaded, setIsListLoaded] = useState<boolean>(true);

  const [totalAttentCount, setTotalAttentCount] = useState<number>(0);

  const [viewport, setViewport] = useState<any>({
    latitude: countryPerPage?.[0]?.geoCordinates?.latitude ?? 22.1991660760527,
    longitude: countryPerPage?.[0]?.geoCordinates?.longitude ?? 78.476681027237,
    width: fullView ? "calc(100vw - 85px)" : "",
    height: fullView ? "90vh" : "350px",
    zoom: 2.5,
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
        const sortedData = countryData.sort((a: any, b: any) => b.eventCount - a.eventCount);
        setViewport((prevViewport: any) => ({
          ...prevViewport,
          latitude: sortedData?.[0]?.geoCordinates?.latitude,
          longitude: sortedData?.[0]?.geoCordinates?.longitude,
        }));
        const countryEventCountsObj: any = {};
        let totalAttentCount = 0;
        sortedData.forEach((country: any) => {
          if (country.countryCode === "WW") {
            country.name = "Virtually";
          }
          countryEventCountsObj[country.countryCode] = country.eventCount;
          totalAttentCount += country.eventCount;
        });
        setCountryPerPage(sortedData);
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

  const layers = Object.keys(countryEventCounts).map((country, index) => {
    const layerStyle: LayerProps = {
      id: `country-layer-${country}`,
      type: "fill",
      source: "country-source",
      "source-layer": "country_boundaries",
      // maxzoom: 8,
      filter: ["==", "iso_3166_1", country],
      paint: {
        "fill-color": index == 0 ? "#6750a4" : "#E7D4E8",
        "fill-opacity": index == 0 ? 0.9 : getOpacityValue(country),
        "fill-outline-color": "#FCCDE5",
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
                  <span className="bg-white text-[#666666] px-1 py-0.5 rounded border border-[#EEEEF0] font-bold">
                    {event.eventCount}
                  </span>
                  {/* <Badge variant="default" className="opacity-90 px-1">{event.eventCount}</Badge> */}
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
          <span className="text-[#6E6F89] text-xs">Other Countries</span>
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
