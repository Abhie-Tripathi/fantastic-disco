"use client";
import { Event } from "@/types/events";
import * as Flags from "country-flag-icons/react/3x2";
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

//   const getCountryFillColor = useMemo(() => {
//     return [
//       "match",
//       ["get", "iso_3166_1"],
//       ...Object.values(audienceSpread || {}).flatMap(({ iso, count }) => [
//         iso,
//         count > 500
//           ? "#6a0dad"
//           : count > 200
//           ? "#9370db"
//           : count > 100
//           ? "#c4a4fc"
//           : "#e5e7eb",
//       ]),
//       "#ccc",
//     ];
//   }, [audienceSpread]);

//   return (
//     <div className="h-96 w-full xl:h-full">
//       {audienceSpread && Object.keys(audienceSpread).length > 0 ? (
//         <Map
//           style={{ width: "100%", height: "100%" }}
//           mapboxAccessToken={mapboxAccessToken}
//           initialViewState={{
//             latitude: 0,
//             longitude: 0,
//             zoom: 0,
//           }}
//           projection={{ name: "mercator" }}
//           mapStyle={
//             theme === "light"
//               ? "mapbox://styles/mapbox/streets-v12"
//               : "mapbox://styles/mapbox/dark-v11"
//           }
//         >
//           <Source
//             id="country-source"
//             type="vector"
//             url="mapbox://mapbox.country-boundaries-v1"
//           >
//             <Layer
//               id="country-layer"
//               type="fill"
//               source="country-source"
//               source-layer="country_boundaries"
//               paint={{
//                 "fill-color": getCountryFillColor,
//                 "fill-opacity": 0.7,
//               }}
//             />
//           </Source>
//         </Map>
//       ) : (
//         <span className="text-[#666666] text-sm flex items-center gap-2">
//           <CircleSlash width={15} height={15} />
//           No data available
//         </span>
//       )}
//     </div>
//   );
// };

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
