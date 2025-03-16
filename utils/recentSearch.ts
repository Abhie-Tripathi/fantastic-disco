import { RecentSearch } from "@/types/events/recentSearches";

export function getLastSearchWithoutAlert(recentSearches: RecentSearch[]) {
  return recentSearches.find(
    (search) => {
      const eventTypes = search.filterValues.eventTypes || [];
      // Return false if eventTypes only contains "alert"
      return !(eventTypes.length === 1 && eventTypes[0] === "alert");
    }
  );
}
