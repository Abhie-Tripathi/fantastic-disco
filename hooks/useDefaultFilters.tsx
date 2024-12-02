import { useEffect } from "react";
import { useFilterState } from "@/hooks/useFilterState";
import { sessionService } from "@/services/sessionService";

export function useDefaultFilters() {
  const { getFilterValue, setMultipleFilters, searchParams } = useFilterState();
  const { getLastSearchedLocation } = sessionService();

  useEffect(() => {
    const eventIds = getFilterValue("eventIds");
    if (!eventIds) {
      const currentLocationId = getFilterValue("locationIds");

      const defaultFilters: Record<string, string> = {};

      if (!currentLocationId) {
        const location = getLastSearchedLocation();
        if (Array.isArray(location)) {
          defaultFilters.locationIds = location[0].id;
        }
      }

      if (Object.keys(defaultFilters).length > 0) {
        setMultipleFilters(defaultFilters);
      }
    }
  }, []);

  return { searchParams };
}
