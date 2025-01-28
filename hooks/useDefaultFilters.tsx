import { useEffect, useCallback } from "react";
import { useAuthContext } from "@/context/auth";
import { useFilterState } from "@/hooks/useFilterState";
import { usePathname, useRouter } from "next/navigation";
import { endOfMonth, startOfMonth, addMonths } from "date-fns";
import { columnsDropdown } from "@/data/trends";
import { sessionService } from "@/services/sessionService";
import { GEO_JSON } from "@/types/auth/user";
import { useEventsService } from "@/services/eventsService";
import { RecentSearchItem } from "@/types/events/recentSearches";
import { useFilterContext } from "@/context/filterContext";
import { newCategories } from "@/data/categories";

export function useDefaultFilters() {
  const { user } = useAuthContext();
  const { getFilterValue, searchParams } = useFilterState();
  const { setMultipleLocalFilters } = useFilterContext();
  const pathName = usePathname();
  const router = useRouter();
  const { getLastSearchedLocation } = sessionService();
  const eventService = useEventsService();

  const mapEnabledFiltersToParams = (filters: any) => ({
    eventFormats: filters.eventFormat?.enabledValue?.join(",") ?? "",
    status:
      filters.eventStatus?.enabledValue
        ?.map((item: string) => item.toLowerCase())
        ?.join(",") ?? "",
    categories:
      filters.eventCategory?.enabledValue
        ?.map((item: any) => item.slug)
        .join(",") ?? "",
    eventTypes:
      filters.eventType?.enabledValue
        ?.map((item: string) => `${item.toLowerCase()}s`)
        ?.join(",") ?? "",
    locationIds:
      filters.locationIds?.enabledValue
        ?.map((item: any) => item.id)
        .join(",") ?? "",
    active_gte: filters.durations?.startDate
      ? new Date(filters.durations.startDate.split(",")[0]).toISOString()
      : "",
    active_lte: filters.durations?.endDate
      ? new Date(filters.durations.endDate.split(",")[1]).toISOString()
      : "",
    entryType:
      filters.eventEntry?.enabledValue
        ?.map((item: string) => item.toLowerCase())
        ?.join(",") ?? "",
    ratings: filters.eventRating?.enabledValue?.join(",") ?? "",
    maturity: filters.maturity?.enabledValue?.[0] ?? "",
    onlyBranded: filters.branded?.enabledValue?.eventBrand ? "true" : "",
    onlySeries: filters.branded?.enabledValue?.eventSeries ? "true" : "",
    frequencies: filters.eventFrequency?.enabledValue?.join(",") ?? "",
    includeKeywords: filters.keywords?.positiveKeywords?.join(",") ?? "",
    excludeKeywords: filters.keywords?.negativeKeywords?.join(",") ?? "",
    estimatedVisitorRangeTag:
      filters.estimatedVisitorRangeTag?.enabledValue?.join(",") ?? "",
    estimatedExhibitors:
      filters.estimatedExhibitScore?.enabledValue?.join(",") ?? "",
    show: generateShowParam(filters),
  });

  const mapRecentSearchToParams = (recentSearch: RecentSearchItem) => ({
    eventFormats: recentSearch.eventFormat ?? "",
    status: recentSearch.eventStatus?.toLowerCase() ?? "",
    categories:
      recentSearch.eventCategory
        ?.map((item) => {
          const category = newCategories.find((cat) => cat.name === item.name);
          return category?.slug || "";
        })
        .filter(Boolean)
        .join(",") ?? "",
    eventTypes:
      recentSearch.eventType
        ?.map((item: string) => `${item.toLowerCase()}s`)
        ?.join(",") ?? "",
    active_gte: recentSearch.startDate?.split(",")[0] ?? "",
    active_lte: recentSearch.endDate?.split(",")[1] ?? "",
    locationIds:
      recentSearch.locationIds?.city
        ?.map((city: any) => Object.keys(city)[0])
        .join(",") ||
      recentSearch.locationIds?.state
        ?.map((state: any) => Object.keys(state)[0])
        .join(",") ||
      recentSearch.locationIds?.country
        ?.map((country: any) => Object.keys(country)[0])
        .join(",") ||
      "",
    entryType:
      recentSearch.eventEntry
        ?.split(",")
        .map((item: string) => item.toLowerCase())
        ?.join(",") ?? "",
    ratings: recentSearch.ratings ?? "",
    maturity: recentSearch.maturity ?? "",
    onlyBranded: recentSearch.onlyBranded ? "true" : undefined,
    onlySeries: recentSearch.onlySeries ? "true" : undefined,
    frequencies: recentSearch.frequencies?.join(",") ?? "",
    includeKeywords: recentSearch.includeKeywords?.join(",") ?? undefined,
    excludeKeywords: recentSearch.excludeKeywords?.join(",") ?? undefined,
    estimatedVisitorRangeTag: recentSearch.estimatedVisitorRangeTag ?? "",
    estimatedExhibitors: String(recentSearch.estimatedExhibitors) ?? undefined,
    shows: generateShowParam(recentSearch.shows),
  });

  const generateShowParam = (filters: any): string => {
    const showItems = [];
    if (filters.eventRating?.isRatingEnabled) showItems.push("rating");
    if (filters.maturity?.isMaturityEnabled) showItems.push("maturity");
    if (filters.branded?.isBrandedEnabled) showItems.push("branded,series");
    if (filters.eventFrequency?.isFreqEnabled) showItems.push("frequency");
    if (filters.estimatedExhibitScore?.isExhibitorsEnabled)
      showItems.push("estimatedExhibitors");
    if (filters.analytics?.isAnalyticsEnabled) showItems.push("scores");
    return showItems.join(",");
  };

  const setInitialFilters = async () => {
    // Skip if we're in the editTracker path
    if (pathName.split("/").includes("editTracker")) {
      return;
    }

    const currentParams = Object.fromEntries(searchParams.entries());
    const isEmptySearch =
      Object.keys(currentParams).length === 0 ||
      (Object.keys(currentParams).length === 1 && "view" in currentParams);

    // Only proceed if we're in search path with empty params or in create path
    if (
      !isEmptySearch &&
      pathName.split("/")[2] !== "search" &&
      pathName.split("/")[3] !== "create"
    ) {
      return;
    }

    try {
      // Try to use enabled filters first
      const enabledFilters = await eventService.fetchEnabledFilters("research");
      if (enabledFilters) {
        const params = new URLSearchParams(searchParams);
        const enabledFilterParams = mapEnabledFiltersToParams(enabledFilters);
        Object.entries(enabledFilterParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        setTimeout(() => {
          router.push(`${pathName}?${params.toString()}`, { scroll: false });
        }, 0);
        return;
      }

      // Fall back to recent search if no enabled filters
      const recentSearchResponse = await eventService.getRecentSearch();
      if (recentSearchResponse?.[0]) {
        const params = new URLSearchParams(searchParams);
        const recentFilterParams = mapRecentSearchToParams(
          recentSearchResponse[0]
        );
        Object.entries(recentFilterParams).forEach(([key, value]) => {
          if (value) params.set(key, String(value));
        });

        if (pathName.split("/").includes("search")) {
          setTimeout(() => {
            router.push(`${pathName}?${params.toString()}`, { scroll: false });
          }, 0);
        } else {
          // Set local filters using the context
          setMultipleLocalFilters(recentFilterParams);
        }
      }
    } catch (error) {
      console.error("Error setting initial filters:", error);
    }
  };

  useEffect(() => {
    if (!pathName.split("/").includes("editTracker")) {
      setInitialFilters();
    }
  }, []);

  return { searchParams };
}
