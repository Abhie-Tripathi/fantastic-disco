import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/auth";
import { useFilterState } from "@/hooks/useFilterState";
import { usePathname, useRouter } from "next/navigation";
import { endOfMonth, startOfMonth, addMonths } from "date-fns";
import { columnsDropdown } from "@/data/trends";
import { sessionService } from "@/services/sessionService";
import { GEO_JSON, UserResponse } from "@/types/auth/user";

export function useDefaultFilters() {
  const { user } = useAuthContext();
  const { getFilterValue, searchParams } = useFilterState();
  const pathName = usePathname();
  const router = useRouter();
  const { getLastSearchedLocation } = sessionService();

  useEffect(() => {
    const eventIds = getFilterValue("eventIds");
    if (!eventIds && user) {
      const currentLocationId = getFilterValue("locationIds");
      const currentEventTypes = getFilterValue("eventTypes");
      const currentStatus = getFilterValue("status");
      const currentGeoCoordinates = getFilterValue("geoCoordinates");
      const active_gte = getFilterValue("active_gte");
      const active_lte = getFilterValue("active_lte");
      const currentTags = getFilterValue("tags");
      const show = getFilterValue("show").split(",");

      const defaultSearchParams = new URLSearchParams(searchParams);
      const { primaryLocation } = user as any;

      if (!currentLocationId && !currentGeoCoordinates) {
        const location = getLastSearchedLocation();
        if (!location) {
          if (primaryLocation?.locationType === "LOCATION_ID") {
            defaultSearchParams.set("locationIds", primaryLocation?.locationId);
          } else if (primaryLocation?.locationType === "GEO_JSON") {
            const viewBound = {
              latitude: Number(
                (
                  primaryLocation as GEO_JSON
                ).geoJson?.geometry?.coordinates[0].toString()
              ),
              longitude: Number(
                (
                  primaryLocation as GEO_JSON
                ).geoJson?.geometry?.coordinates[1].toString()
              ),
              radius: (primaryLocation as GEO_JSON).geoJson?.properties?.radius,
            };
            defaultSearchParams.set(
              "geoCoordinates",
              JSON.stringify(viewBound)
            );
          }
        } else {
          if (Array.isArray(location)) {
            defaultSearchParams.set("locationIds", location[0].id);
          } else {
            const viewBound = {
              latitude: location.lat,
              longitude: location.lng,
              radius: location.radius,
            };
            defaultSearchParams.set(
              "geoCoordinates",
              JSON.stringify(viewBound)
            );
          }
        }
      }
      if (!currentStatus)
        defaultSearchParams.set("status", "active,cancelled,postponed");

      if (!currentEventTypes)
        defaultSearchParams.set(
          "eventTypes",
          "community,concert,performing-arts,sport,festival,workshops,tradeshows,conferences,holiday"
        );

      if (pathName === "/trends") {
        defaultSearchParams.set(
          "eventTypes",
          "community,concert,performing-arts,sport,festival,workshops,tradeshows,conferences,holiday"
        );
        defaultSearchParams.set(
          "columns",
          columnsDropdown
            .filter(
              (column) =>
                // column.value !== "economicImpact" &&
                column.value !== "impactScore"
            )
            .map((column) => column.value)
            .join(",")
        );
      }
      if (!(active_gte && active_lte)) {
        const today = new Date();
        const startOfToday = startOfMonth(today);
        startOfToday.setHours(5, 30, 0, 0);

        defaultSearchParams.set("active_gte", startOfToday.toISOString());

        const endOfToday = endOfMonth(addMonths(today, 2));
        endOfToday.setHours(5, 30, 0, 0);

        defaultSearchParams.set("active_lte", endOfToday.toISOString());
      }

      if (currentTags) defaultSearchParams.set("tags", "");

      if (
        !show.includes("alerts") ||
        !show.includes("scores") ||
        !show.includes("economicImpact")
      ) {
        defaultSearchParams.set(
          "show",
          ["alerts", "scores", "economicImpact", ...show]
            .join(",")
            .replace(/^,|,$/, "")
        );
      }

      router.push(`${pathName}?${defaultSearchParams.toString()}`, {
        scroll: false,
      });
    }
  }, [user]);

  return { searchParams };
}
