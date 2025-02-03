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
    ratings: recentSearch.eventRating ?? undefined,
    maturity: recentSearch.maturity ?? undefined,
    onlyBranded: recentSearch.eventBrand ? "true" : undefined,
    onlySeries: recentSearch.eventSeries ? "true" : undefined,
    frequencies: recentSearch.eventFrequency ?? undefined,
    includeKeywords: recentSearch.includeKeywords ?? undefined,
    excludeKeywords: recentSearch.excludeKeywords ?? undefined,
    estimatedVisitorRangeTag: recentSearch.estimatedVisitorRangeTag ?? "",
    estimatedExhibitors: recentSearch.estimatedExhibitScore ?? undefined,
    impact_score_gte: recentSearch.eventImpactScore?.split("-")[0] ?? undefined,
    impact_score_lte: recentSearch.eventImpactScore?.split("-")[1] ?? undefined,
    inbound_score_gte: recentSearch.inboundScore?.split("-")[0] ?? undefined,
    inbound_score_lte: recentSearch.inboundScore?.split("-")[1] ?? undefined,
    international_score_gte:
      recentSearch.internationalScore?.split("-")[0] ?? undefined,
    international_score_lte:
      recentSearch.internationalScore?.split("-")[1] ?? undefined,
    audienceSpread: recentSearch.audienceSpread ?? undefined,
    designations: recentSearch.designation ?? undefined,
    top:
      recentSearch.eventRanking
        ?.split(",")
        .map((item) => item.split("-")[1])[0] ?? undefined,
    show: generateRecentSearchShowParam(recentSearch?.shows?.split(",") ?? []),
  });

  const generateRecentSearchShowParam = (shows: string[]) => {
    const showItems = [];
    if (shows.includes("eventRating")) showItems.push("rating");
    if (shows.includes("maturity")) showItems.push("maturity");
    if (shows.includes("eventBrand")) showItems.push("branded");
    if (shows.includes("eventSeries")) showItems.push("series");
    if (shows.includes("eventFrequency")) showItems.push("frequency");
    if (shows.includes("estimatedExhibitScore"))
      showItems.push("estimatedExhibitors");
    if (shows.includes("analytics")) showItems.push("scores");
    if (shows.includes("isforecasted")) showItems.push("forecasted");
    if (shows.includes("eventImpactScore")) showItems.push("scores");
    if (shows.includes("eventRanking")) showItems.push("rankings");
    if (shows.includes("audienceZone")) showItems.push("audienceZone");

    return showItems.join(",");
  };

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
    const hasOnlyViewParam =
      Object.keys(currentParams).length === 1 && "view" in currentParams;
    const isEmptySearch =
      Object.keys(currentParams).length === 0 || hasOnlyViewParam;

    // Checking only for trends, applying default filters in trends.
    const defaultSearchParams = new URLSearchParams(searchParams);
    const active_gte = getFilterValue("active_gte");
    const active_lte = getFilterValue("active_lte");
    const currentTags = getFilterValue("tags");
    const show = getFilterValue("show").split(",");

    if (pathName === "/internal/trends") {
      defaultSearchParams.set("eventTypes", "workshops,tradeshows,conferences");
      defaultSearchParams.set(
        "columns",
        columnsDropdown
          .filter((column) => column.value !== "impactScore")
          .map((column) => column.value)
          .join(",")
      );

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
          ["alerts", "scores", ...show].join(",").replace(/^,|,$/, "")
        );
      }

      router.push(`${pathName}?${defaultSearchParams.toString()}`, {
        scroll: false,
      });
    }

    // Only proceed if we have empty params or just view param

    try {
      // Try to use enabled filters first
      const enabledFilters = await eventService.fetchEnabledFilters("research");
      if (enabledFilters) {
        const params = new URLSearchParams(searchParams.toString());
        const enabledFilterParams = mapEnabledFiltersToParams(enabledFilters);
        Object.entries(enabledFilterParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        if (pathName.split("/").includes("search")) {
          setTimeout(() => {
            router.push(`${pathName}?${params.toString()}`, { scroll: false });
          }, 0);
        } else {
          setMultipleLocalFilters(enabledFilterParams);
        }
        return;
      }
      if (!isEmptySearch || pathName.split("/").includes("tracker")) {
        return;
      }
      // Fall back to recent search if no enabled filters
      const recentSearchResponse = await eventService.getRecentSearch();
      if (recentSearchResponse?.[0]) {
        const params = new URLSearchParams(searchParams.toString());
        const recentFilterParams = mapRecentSearchToParams(
          recentSearchResponse[0]
        );
        console.log("recentFilterParams", recentFilterParams);
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
