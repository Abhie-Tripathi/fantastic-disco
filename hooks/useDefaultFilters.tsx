import { useEffect, useRef, useState } from "react";
// import { useAuth } from "@/contexts/authContext";
import { useFilterState } from "@/hooks/useFilterState";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { endOfMonth, startOfMonth } from "date-fns";
// import { columnsDropdown } from "@/data/trends";

export function useDefaultFilters() {
  // const { user } = useAuth();
  const { getFilterValue, setMultipleFilters, searchParams } = useFilterState();
  const currentDate = new Date();
  const pathName = usePathname();

  useEffect(() => {
    const eventIds = getFilterValue("eventIds");
    if (!eventIds) {
      const currentLocationId = getFilterValue("locationIds");
      const currentEventTypes = getFilterValue("eventTypes");
      const currentStatus = getFilterValue("status");
      const currentGeoCoordinates = getFilterValue("geoCoordinates");
      const currentSelectedDate = getFilterValue("active_gte");
      const currentTags = getFilterValue("tags");

      const defaultFilters: Record<string, string> = {};

      if (!currentLocationId && !currentGeoCoordinates)
        defaultFilters.locationIds = "226e11ef-32fc-5484-9843-7087fdfb413d";

      if (!currentStatus)
        defaultFilters.status = "active,cancelled,postponed,predicted";

      if (!currentEventTypes)
        defaultFilters.eventTypes =
          "workshops,tradeshows,conferences";

      if (!currentSelectedDate) {
        defaultFilters.active_gte = new Date(
          startOfMonth(currentDate).setHours(5, 30, 0, 0)
        ).toISOString();
        defaultFilters.active_lte = new Date(
          endOfMonth(currentDate).setHours(5, 30, 0, 0)
        ).toISOString();
      }
      // if (pathName === "/trends") {
      //   defaultFilters.columns = columnsDropdown
      //     .filter(
      //       (column) =>
      //         column.value !== "economicImpact" &&
      //         column.value !== "impactScore"
      //     )
      //     .map((column) => column.value)
      //     .join(",");
      // }

      if (currentTags) defaultFilters.tags = "";

      if (Object.keys(defaultFilters).length > 0) {
        setMultipleFilters(defaultFilters);
      }
    }
  }, []);

  return { searchParams };
}
