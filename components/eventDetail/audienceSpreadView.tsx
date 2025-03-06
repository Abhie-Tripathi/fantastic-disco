"use client";
import { Event } from "@/types/events";
import * as Flags from "country-flag-icons/react/3x2";
import { CircleSlash } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Text from "../new-ui/Text";
import { Layer, Map, Marker, Source } from "react-map-gl";
import { useTheme } from "@/context";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  audienceSpread: NonNullable<Event["audience"]>["audienceSpread"] | undefined;
}

export const AudienceSpreadMapView = ({ audienceSpread }: Props) => {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const { theme } = useTheme();
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    iso: string;
    percentage: number;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const getCountryLayers = useMemo(() => {
    if (!audienceSpread || Object.keys(audienceSpread).length === 0)
      return null;

    return Object.values(audienceSpread).map(({ iso }, index) => (
      <Layer
        key={iso}
        id={`country-layer-${iso}`}
        type="fill"
        source="country-source"
        source-layer="country_boundaries"
        filter={["==", "iso_3166_1", iso]}
        paint={{
          "fill-color": index === 0 ? "#6750a4" : "#E7D4E8",
          "fill-opacity": 0.9,
          "fill-outline-color": "#FCCDE5",
        }}
      />
    ));
  }, [audienceSpread]);

  return (
    <div className="h-96 w-full xl:h-full">
      <Map
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={{
          latitude: 0,
          longitude: 0,
          zoom: 0,
        }}
        projection={{ name: "mercator" }}
        mapStyle={
          theme === "light"
            ? "mapbox://styles/mapbox/streets-v12"
            : "mapbox://styles/mapbox/dark-v11"
        }
      >
        <Source
          id="country-source"
          type="vector"
          url="mapbox://mapbox.country-boundaries-v1"
        >
          {getCountryLayers}
        </Source>
        {/* <Source
          id="water-source"
          type="vector"
          url="mapbox://mapbox.mapbox-streets-v8"
        >
          <Layer
            id="water-layer"
            source="water-source"
            source-layer="water"
            type="fill"
            paint={{ "fill-color": "#ffffff" }} // Make water white
          />
        </Source> */}
      </Map>
    </div>
  );
};

export const AudienceSpreadListView = ({ audienceSpread }: Props) => {
  const ulRef = useRef<HTMLUListElement | null>(null);
  const [hasScrollbar, setHasScrollbar] = useState(false);
  useEffect(() => {
    const checkScrollbar = () => {
      if (ulRef.current) {
        setHasScrollbar(
          ulRef.current.scrollHeight > ulRef.current.clientHeight
        );
      }
    };
    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
  }, [audienceSpread]);
  return (
    <ul
      ref={ulRef}
      className={`h-96 overflow-y-auto ${
        hasScrollbar ? "pr-2" : "pr-0"
      } scrollbar `}
    >
      {audienceSpread && Object.keys(audienceSpread).length > 0 ? (
        Object.entries(audienceSpread).map(([key, value], index) => {
          if (value.iso == "UK") value.iso = "GB";
          const Flag = Flags[value.iso as keyof typeof Flags];
          return (
            <li
              className={`flex items-center justify-between p-3 ${
                (index + 1) % 2 !== 0
                  ? "bg-[#FAFAFA] dark:bg-[#171717] border border-[#F2F2F2] rounded-md dark:border-[#1A1A1A]"
                  : ""
              }`}
              key={key}
            >
              <div className="flex items-center gap-4">
                <Flag className="w-8 h-8" />{" "}
                <Text color="primary" variant="noMargin" size="large">
                  {value.name}
                </Text>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-[#FEECF2] dark:bg-[#3A1726] border border-[#F9D7E2] dark:border-[#551B33] text-sm font-medium text-[#df2670] py-1 px-3 rounded-full">
                  {value.percentage}%
                </span>
              </div>
            </li>
          );
        })
      ) : (
        <span className="text-[#666666] text-sm flex items-center gap-2">
          <CircleSlash width={15} height={15} />
          No data available
        </span>
      )}
    </ul>
  );
};
