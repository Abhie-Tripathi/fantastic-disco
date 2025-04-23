"use client";
import worldGeoJson from "@/data/world.json";
import { Event } from "@/types/events";
import {
  getCountryName,
  getUpdatedCountryISOCode,
} from "@/utils/convertCountryName";
import * as Flags from "country-flag-icons/react/3x2";
import * as echarts from "echarts";
import { CircleSlash } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import Text from "../new-ui/Text";

interface Props {
  audienceSpread: NonNullable<Event["audience"]>["audienceSpread"] | undefined;
}

// export const AudienceSpreadMapView = ({ audienceSpread }: Props) => {
//   const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
//   const { theme } = useTheme();
//   const [hoveredCountry, setHoveredCountry] = useState<{
//     name: string;
//     iso: string;
//     percentage: number;
//     coordinates: { lat: number; lng: number };
//   } | null>(null);

//   const getCountryLayers = useMemo(() => {
//     if (!audienceSpread || Object.keys(audienceSpread).length === 0)
//       return null;

//     return Object.values(audienceSpread).map(({ iso }, index) => (
//       <Layer
//         key={iso}
//         id={`country-layer-${iso}`}
//         type="fill"
//         source="country-source"
//         source-layer="country_boundaries"
//         filter={["==", "iso_3166_1", iso]}
//         paint={{
//           "fill-color": index === 0 ? "#6750a4" : "#E7D4E8",
//           "fill-opacity": 0.9,
//           "fill-outline-color": "#FCCDE5",
//         }}
//       />
//     ));
//   }, [audienceSpread]);

//   return (
//     <div className="h-96 w-full xl:h-full">
//       <Map
//         style={{ width: "100%", height: "100%" }}
//         mapboxAccessToken={mapboxAccessToken}
//         initialViewState={{
//           latitude: 0,
//           longitude: 0,
//           zoom: 0,
//         }}
//         projection={{ name: "mercator" }}
//         mapStyle={
//           theme === "light"
//             ? "mapbox://styles/mapbox/streets-v12"
//             : "mapbox://styles/mapbox/dark-v11"
//         }
//       >
//         <Source
//           id="country-source"
//           type="vector"
//           url="mapbox://mapbox.country-boundaries-v1"
//         >
//           {getCountryLayers}
//         </Source>
//         {/* <Source
//           id="water-source"
//           type="vector"
//           url="mapbox://mapbox.mapbox-streets-v8"
//         >
//           <Layer
//             id="water-layer"
//             source="water-source"
//             source-layer="water"
//             type="fill"
//             paint={{ "fill-color": "#ffffff" }} // Make water white
//           />
//         </Source> */}
//       </Map>
//     </div>
//   );
// };

function getFlagComponent(iso: string) {
  const FlagComponent = Flags[iso as keyof typeof Flags];
  return FlagComponent ? (
    <FlagComponent className="w-8 h-8" />
  ) : (
    <div className="text-sm text-blue-600 bg-card w-8 h-6 border text-center">
      ?
    </div>
  );
}

export const AudienceSpreadMapView = ({ audienceSpread }: Props) => {
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  echarts.registerMap("world", worldGeoJson as any);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    const data = audienceSpread
      ? Object.entries(audienceSpread)
          .filter(
            ([_, value]) =>
              value.name.toLowerCase() !== "Online" &&
              value.name.toLowerCase() !== "Hybrid" &&
              value.name.toLowerCase() !== "Offline"
          )
          .map(([_, value]) => ({
            name: getCountryName(value.iso),
            value: value.percentage,
            iso: getUpdatedCountryISOCode(value.iso),
            itemStyle: {
              borderColor: "#6750a4",
              borderWidth: 0.6,
              opacity: 1,
            },
          }))
      : [];

    const maxPercentage = Math.max(...data.map((d) => d.value));

    const option = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: {
          color: "#333",
          fontSize: 14,
        },
        formatter: ({
          data,
        }: {
          data: { value: number; name: string; iso: string };
        }) => {
          if (!data) return null;
          const { value, name, iso } = data;

          if (!iso) return null;
          return `
            <div style="display: flex; align-items: center; gap: 8px; width: 160px;">
              <img src="https://flagcdn.com/w20/${iso.toLowerCase()}.png" alt="${name} flag"
              <strong>${name}</strong>
            </div>
            <div style="margin-top: 5px; margin-left: auto; display: flex; justify-content: space-between">
              <p>Visitors</p>
              <span style="color: #6750a4;font-weight: bold;">${
                value ? value.toFixed(2) + "%" : "No data"
              }</span>
            </div>
          `;
        },
      },
      visualMap: {
        min: 0,
        max: maxPercentage,
        inRange: {
          color: ["#E7D4E8", "#6750a4"],
        },
        show: false,
      },
      series: [
        {
          type: "map",
          map: "world",
          roam: true,
          zoom: 1.3,
          center: [0, 30],
          scaleLimit: {
            min: 1.3,
            max: 50,
          },
          emphasis: {
            label: {
              show: false,
              color: "#000",
            },
            itemStyle: {
              areaColor: "#6750a4",
              borderColor: "#6750a4",
              borderWidth: 1,
            },
          },
          selectedMode: false,
          itemStyle: {
            borderWidth: 0.3,
            opacity: 0.4,
          },
          data,
          // markPoint: {
          //   symbol: "circle",
          //   symbolSize: 50, // Marker size
          //   label: {
          //     show: true,
          //     color: "#000",
          //     formatter: ({ data }) => `${data.value}%`,
          //     position: "top",
          //   },
          //   data: data.map(({ coordinates, value }) => ({
          //     name: "",
          //     coord: coordinates,
          //     value: value.toFixed(2),
          //     itemStyle: {
          //       color: "#6750a4",
          //       borderColor: "#fff",
          //       borderWidth: 1,
          //     },
          //   })),
          // },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [audienceSpread]);
  return <div ref={chartRef} className="w-full h-96" />;
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
        Object.entries(audienceSpread)
          .filter(
            ([_, value]) =>
              value.name.toLowerCase() !== "Online" &&
              value.name.toLowerCase() !== "Hybrid" &&
              value.name.toLowerCase() !== "Offline"
          )
          .map(([key, value], index) => {
            if (value.iso == "UK") value.iso = "GB";
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
                  {getFlagComponent(value.iso)}{" "}
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
