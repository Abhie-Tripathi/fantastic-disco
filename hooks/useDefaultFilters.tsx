import { useEffect } from "react";
import { useAuthContext } from "@/context/auth";
import { useFilterState } from "@/hooks/useFilterState";
import { usePathname, useRouter } from "next/navigation";
import { endOfMonth, startOfMonth, addMonths } from "date-fns";
import { EVENT_TYPE_GROUPS } from "@/data/trends";
import { useEventsService } from "@/services/eventsService";
import { RecentSearch } from "@/types/events/recentSearches";
import { useFilterContext } from "@/context/filterContext";
import { useConfigurationService } from "@/services/configurationService";
import { isEventeli } from "@/config";
import { getLastSearchWithoutAlert } from "@/utils/recentSearch";
import { recentSearchService } from "@/services/recentSearchService";
import { useTransition } from "@/context/transition";

export function useDefaultFilters() {
  const { user } = useAuthContext();
  const now = new Date();
  const { getFilterConfiguration } = useConfigurationService();
  const { getFilterValue, searchParams } = useFilterState();
  const { setMultipleLocalFilters } = useFilterContext();
  const { setInTransition } = useTransition();
  const pathName = usePathname();
  const router = useRouter();
  const eventService = useEventsService();
  const allowedEventTypes = isEventeli
    ? [...EVENT_TYPE_GROUPS.Social, ...EVENT_TYPE_GROUPS.Business]
    : Object.values(EVENT_TYPE_GROUPS.Business);
  const defaultTrendsParams = {
    locationIds: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef", //New York, United States
    viewBound: {
      boundType: "point",
      coordinates: {
        latitude: 40.7127281,
        longitude: -74.0060152,
        radius: 20,
      },
      properties: {
        name: "New York City Hall, 260, Broadway, Lower Manhattan, Manhattan, New York County, New York, 10000, United States",
      },
    },
    active_gte: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
    )
      .toISOString()
      .split("T")[0], // Starting date of current month going on.
    active_lte: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 0, 0, 0, 0)
    )
      .toISOString()
      .split("T")[0], // Ending date of current month going on.
    eventTypes: allowedEventTypes, // Event Types according to the platform.
    categories: "technology,medical-pharma",
  };

  const mapEnabledFiltersToParams = (filters: any) => ({
    eventFormats: filters.eventFormats?.enabledValue?.join(",") ?? "",
    status:
      filters.status?.enabledValue
        ?.map((item: string) => item.toLowerCase())
        ?.join(",") ?? "",
    categories:
      filters.categories?.enabledValue
        ?.map((item: any) => item.slug)
        .join(",") ?? "",
    eventTypes:
      filters.eventTypes?.enabledValue
        ?.map((item: string) => `${item.toLowerCase()}`)
        ?.join(",") ?? "",
    locationIds:
      filters.locationIds?.enabledValue
        ?.map((item: any) => item.id)
        .join(",") ?? "",
    active_gte: filters.durations?.startDate
      ? new Date(filters.durations.startDate.split(",")[0]).toISOString()
      : startOfMonth(new Date()).toISOString(),
    active_lte: filters.durations?.endDate
      ? new Date(filters.durations.endDate.split(",")[1]).toISOString()
      : endOfMonth(addMonths(new Date(), 2)).toISOString(),
    entryType:
      filters.entryType?.enabledValue
        ?.map((item: string) => item.toLowerCase())
        ?.join(",") ?? "",

    ratings: filters.ratings?.enabledValue?.join(",") ?? "",
    maturity: filters.maturity?.enabledValue?.[0] ?? "",
    onlyBranded: filters.branded?.enabledValue?.eventBrand ? "true" : "",
    onlySeries: filters.branded?.enabledValue?.eventSeries ? "true" : "",
    frequencies: filters.frequencies?.enabledValue?.join(",") ?? "",
    includeKeywords: filters.keywords?.includeKeywords?.join(",") ?? "",
    excludeKeywords: filters.keywords?.excludeKeywords?.join(",") ?? "",
    estimatedVisitorRangeTag:
      filters.estimatedVisitorRangeTag?.enabledValue?.join(",") ?? "",
    estimatedExhibitors:
      filters.estimatedExhibitors?.enabledValue?.join(",") ?? "",
    show: generateShowParam(filters),
  });

  const mapRecentSearchToParams = (recentSearch: RecentSearch) => {
    const recentSearchParams = {
      eventIds: recentSearch.filterValues.eventIds?.join(",") ?? undefined,
      //Replaces the event format "offline" with "in_person" and other values will be untouched.
      eventFormats:
        recentSearch.filterValues.eventFormats
          ?.map((format) => (format === "offline" ? "in_person" : format))
          .join(",") ?? undefined,
      status: recentSearch.filterValues.status?.join(",") ?? undefined,
      categories: recentSearch.filterValues.categories?.join(",") ?? undefined,
      eventTypes: recentSearch.filterValues.eventTypes?.join(",") ?? undefined,
      active_gte: recentSearch.filterValues.active_gte
        ? recentSearch.filterValues.active_gte
        : undefined,
      active_lte: recentSearch.filterValues.active_lte
        ? recentSearch.filterValues.active_lte
        : undefined,
      locationIds:
        recentSearch.filterValues.locationIds?.join(",") ?? undefined,
      entryType: recentSearch.filterValues.entryType?.join(",") ?? undefined,
      ratings: recentSearch.filterValues.ratings?.join(",") ?? undefined,
      maturity: recentSearch.filterValues.maturity?.join(",") ?? undefined,
      onlyBranded: recentSearch.filterValues.onlyBranded ? "true" : undefined,
      onlySeries: recentSearch.filterValues.onlySeries ? "true" : undefined,
      frequencies:
        recentSearch.filterValues.frequencies?.join(",") ?? undefined,
      includeKeywords:
        recentSearch.filterValues.includeKeywords?.join(",") ?? undefined,
      excludeKeywords:
        recentSearch.filterValues.excludeKeywords?.join(",") ?? undefined,
      estimatedVisitorRangeTag:
        recentSearch.filterValues.estimatedVisitorRangeTag?.join(",") ??
        undefined,
      estimatedExhibitors:
        recentSearch.filterValues.estimatedExhibitors?.join(",") ?? undefined,
      impact_score_gte: recentSearch.filterValues.impact_score_gte
        ? String(recentSearch.filterValues.impact_score_gte)
        : undefined,
      impact_score_lte: recentSearch.filterValues.impact_score_lte
        ? String(recentSearch.filterValues.impact_score_lte)
        : undefined,
      inbound_score_gte: recentSearch.filterValues.inbound_score_gte
        ? String(recentSearch.filterValues.inbound_score_gte)
        : undefined,
      inbound_score_lte: recentSearch.filterValues.inbound_score_lte
        ? String(recentSearch.filterValues.inbound_score_lte)
        : undefined,
      international_score_gte: recentSearch.filterValues.international_score_gte
        ? String(recentSearch.filterValues.international_score_gte)
        : undefined,
      international_score_lte: recentSearch.filterValues.international_score_lte
        ? String(recentSearch.filterValues.international_score_lte)
        : undefined,
      audienceSpread:
        recentSearch.filterValues.audienceSpread?.join(",") ?? undefined,
      designations:
        recentSearch.filterValues.designations?.join(",") ?? undefined,
      top: recentSearch.filterValues.top
        ? String(recentSearch.filterValues.top)
        : undefined,
      show: recentSearch.filterValues.show?.join(",") ?? undefined,
      viewBound: recentSearch.filterValues.viewBound
        ? JSON.stringify(recentSearch.filterValues.viewBound)
        : undefined,
    };

    if (
      !recentSearch.filterValues.active_gte &&
      !recentSearch.filterValues.active_lte &&
      !recentSearch.filterValues.eventIds
    ) {
      recentSearchParams.active_gte = startOfMonth(new Date()).toISOString();
      recentSearchParams.active_lte = endOfMonth(
        addMonths(new Date(), 3)
      ).toISOString();
    }

    return recentSearchParams;
  };

  const generateShowParam = (filters: any): string => {
    const showItems = [];
    if (filters.ratings?.isRatingEnabled) showItems.push("rating");
    if (filters.maturity?.isMaturityEnabled) showItems.push("maturity");
    if (filters.branded?.isBrandedEnabled) showItems.push("branded,series");
    if (filters.frequencies?.isFreqEnabled) showItems.push("frequency");
    if (filters.frequencies?.isFreqEnabled) showItems.push("forecasted");
    if (filters.estimatedExhibitors?.isExhibitorsEnabled)
      showItems.push("estimatedExhibitors");
    if (filters.economicImpact?.isEconomicImpactEnabled)
      showItems.push("economicImpact");
    if (filters.analytics?.isAnalyticsEnabled) showItems.push("scores");
    if (filters.audienceZone?.isZoneEnabled) showItems.push("audienceZone");
    if (filters.eventRanking?.isRanking) showItems.push("rankings");
    return showItems.join(",");
  };

  const cleanEventTypes = (eventTypesString: string | null): string[] => {
    return eventTypesString
      ? eventTypesString
          .split(",")
          // .map((type) => type.trim())
          .filter((type) => type !== "" && type !== "alert")
      : [];
  };

  /**
   * This function generates and returns URL search parameters for event trends.
   * The parameters are set using the following priority:
   *
   * 1. **Enabled Filters:** First, it checks if the parameters exist in the provided URL and applies them.
   * 2. **Recent Search Filters:** If not found in the URL, it checks recent search filters and applies them if they exist.
   * 3. **Default Filters:** If parameters are not found in recent search filters, it falls back to default filters.
   */
  const generateTrendsParams = (
    params: URLSearchParams,
    recentFilterParams?: any
  ) => {
    const trendsParams = new URLSearchParams(params);
    const eventTypesParams = trendsParams.get("eventTypes");
    const locationIdsParams = trendsParams.get("locationIds");
    const viewBoundParams = trendsParams.get("viewBound");
    const startDateParams = trendsParams.get("active_gte");
    const endDateParams = trendsParams.get("active_lte");
    const recentSearchEventTypesArray =
      recentFilterParams &&
      recentFilterParams.eventTypes &&
      cleanEventTypes(recentFilterParams.eventTypes);

    const eventTypesParamsArray =
      eventTypesParams && cleanEventTypes(eventTypesParams);
    let startDate = "",
      endDate = "";

    if (startDateParams && endDateParams) {
      // Determine start date based on priority.
      startDate =
        startDateParams ||
        (recentFilterParams && recentFilterParams.active_gte);
      // Determine end date based on priority.
      endDate =
        endDateParams || (recentFilterParams && recentFilterParams.active_lte);
    }

    if (!startDateParams && !endDateParams) {
      // Determine start date based on priority.
      startDate = defaultTrendsParams.active_gte;
      // Determine end date based on priority.
      endDate = defaultTrendsParams.active_lte;
    }

    if (startDateParams || endDateParams) {
      if (startDateParams) {
        // Determine start date based on priority.
        startDate =
          startDateParams ||
          (recentFilterParams && recentFilterParams.active_gte);
      } else {
        // Determine end date based on priority.
        endDate =
          endDateParams ||
          (recentFilterParams && recentFilterParams.active_lte);
      }
    }

    // Determine event types based on priority: URL params > recent filters > default.
    const eventTypes =
      (eventTypesParamsArray &&
        eventTypesParamsArray.length > 0 &&
        eventTypesParamsArray) ||
      (recentSearchEventTypesArray &&
        recentSearchEventTypesArray.length > 0 &&
        recentSearchEventTypesArray) ||
      defaultTrendsParams.eventTypes;
    // Determine location IDs based on priority.
    const locationIds =
      locationIdsParams ||
      (recentFilterParams &&
        recentFilterParams.locationIds &&
        recentFilterParams.locationIds !== "" &&
        recentFilterParams.locationIds) ||
      defaultTrendsParams.locationIds;

    const viewBound =
      viewBoundParams ||
      (recentFilterParams &&
        recentFilterParams.viewBound &&
        recentFilterParams.viewBound !== "" &&
        recentFilterParams.viewBound) ||
      defaultTrendsParams.viewBound;

    // Filter event types based on allowed types.
    const filteredEventTypes =
      eventTypes &&
      eventTypes.filter((type: string) => allowedEventTypes.includes(type));

    // Check if the dates are already formatted correctly.
    const isStartDateFormatted =
      startDate && startDate.endsWith("T00:00:00.000Z");
    const isEndDateFormatted = endDate && endDate.endsWith("T00:00:00.000Z");

    // Format the start and end dates if necessary.
    const formattedStartDate = startDate
      ? isStartDateFormatted
        ? startDate
        : new Date(`${startDate.split("T")[0]}T00:00:00.000Z`).toISOString()
      : "";

    const formattedEndDate = endDate
      ? isEndDateFormatted
        ? endDate
        : new Date(`${endDate.split("T")[0]}T00:00:00.000Z`).toISOString()
      : "";

    // Remove unnecessary parameters from the URL.
    const paramsToDelete = [
      "eventFormats",
      "status",
      "categories",
      "entryType",
      "ratings",
      "maturity",
      "onlySeries",
      "frequencies",
      "includeKeywords",
      "excludeKeywords",
      "estimatedVisitorRangeTag",
      "estimatedExhibitors",
      "show",
    ];

    paramsToDelete.forEach((param) => trendsParams.delete(param));

    trendsParams.set("columns", "eventCount");

    trendsParams.set("show", "alerts,scores,economicImpact");
    if (filteredEventTypes && filteredEventTypes.length > 0) {
      trendsParams.set("eventTypes", filteredEventTypes.join(","));
    }
    if (formattedStartDate) {
      trendsParams.set("active_gte", formattedStartDate);
    }
    if (formattedEndDate) {
      trendsParams.set("active_lte", formattedEndDate);
    }
    if (viewBoundParams || locationIdsParams) {
      if (viewBoundParams) {
        trendsParams.set("viewBound", viewBound);
      }
      if (locationIdsParams) {
        trendsParams.set("locationIds", locationIds);
      }
    }
    if (!viewBoundParams && !locationIdsParams) {
      trendsParams.set("locationIds", locationIds);
    }
    trendsParams.delete("viewBound");
    trendsParams.delete("show");
    trendsParams.delete("eventIds");
    trendsParams.set("eventTypes", defaultTrendsParams.eventTypes.join(","));
    trendsParams.set("active_gte", defaultTrendsParams.active_gte);
    trendsParams.set("active_lte", defaultTrendsParams.active_lte);
    trendsParams.set("locationIds", defaultTrendsParams.locationIds);
    trendsParams.set("categories", defaultTrendsParams.categories);

    return trendsParams;
  };

  const setInitialFilters = async () => {
    // Skip if we're in the editTracker path
    if (pathName.split("/").includes("editTracker")) {
      return;
    }

    const urlparams = new URLSearchParams(searchParams.toString());
    urlparams.delete("active_lte");
    urlparams.delete("active_gte");
    const currentParams = Object.fromEntries(urlparams.entries());
    const hasOnlyViewParam =
      Object.keys(currentParams).length === 1 && "view" in currentParams;
    const isEmptySearch =
      Object.keys(currentParams).length === 0 || hasOnlyViewParam;

    // Only proceed if we have empty params or just view param
    if (!isEmptySearch) {
      return;
    }

    try {
      // Try to use enabled filters first
      const response = await getFilterConfiguration();
      const enabledFilters =
        response && "filter" in response ? response : { filter: {} };

      if (Object.keys(enabledFilters.filter).length > 0) {
        const params = new URLSearchParams(searchParams.toString());
        const enabledFilterParams = mapEnabledFiltersToParams(
          enabledFilters.filter
        );

        Object.entries(enabledFilterParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        const trendsParams = generateTrendsParams(params);

        if (
          pathName.split("/").includes("search") ||
          pathName === "/internal/trends"
        ) {
          // Use router.replace to update URL without navigation
          const newUrl = `${pathName}?${
            pathName === "/internal/trends"
              ? trendsParams.toString()
              : params.toString()
          }`;
          router.replace(newUrl);
        } else {
          setMultipleLocalFilters(enabledFilterParams);
        }
        return;
      }

      // Fall back to recent search if no enabled filters
      const recentSearchResponse = recentSearchService.getAll();
      if (
        recentSearchResponse &&
        recentSearchResponse.length > 0 &&
        recentSearchResponse[0].searchEvent.params
      ) {
        const params = new URLSearchParams(searchParams.toString());
        let recentSearch: any = {};
        if (isEventeli) {
          recentSearch = getLastSearchWithoutAlert(
            recentSearchResponse.map((search) => ({
              ...search,
              requestedAt: new Date().toISOString(),
              filterValues: {
                ...search.searchEvent.params,
                limit: 20,
                offset: 0,
                active_gte:
                  search.searchEvent.params.active_gte ||
                  startOfMonth(new Date()).toISOString(),
                active_lte:
                  search.searchEvent.params.active_lte ||
                  endOfMonth(addMonths(new Date(), 3)).toISOString(),
                view: "list",
                eventTypes: search.searchEvent.params.eventTypes?.split(","),
                categories: search.searchEvent.params.categories?.split(","),
                locationIds:
                  search.searchEvent.params.locationIds?.split(",") || [],
                status: search.searchEvent.params.status?.split(","),
                eventFormats:
                  search.searchEvent.params.eventFormats?.split(","),
                entryType: search.searchEvent.params.entryType?.split(","),
                ratings: search.searchEvent.params.ratings?.split(","),
                maturity: search.searchEvent.params.maturity?.split(","),
                frequencies: search.searchEvent.params.frequencies?.split(","),
                includeKeywords:
                  search.searchEvent.params.includeKeywords?.split(","),
                excludeKeywords:
                  search.searchEvent.params.excludeKeywords?.split(","),
                estimatedVisitorRangeTag:
                  search.searchEvent.params.estimatedVisitorRangeTag?.split(
                    ","
                  ),
                estimatedExhibitors:
                  search.searchEvent.params.estimatedExhibitors?.split(","),
                audienceSpread:
                  search.searchEvent.params.audienceSpread?.split(","),
                designations:
                  search.searchEvent.params.designations?.split(","),
                show: search.searchEvent.params.show?.split(",") || [],
                viewBound: search.searchEvent.params.viewBound
                  ? JSON.parse(search.searchEvent.params.viewBound)
                  : undefined,
                onlyBranded: search.searchEvent.params.onlyBranded === "true",
                onlySeries: search.searchEvent.params.onlySeries === "true",
                top: search.searchEvent.params.top
                  ? parseInt(search.searchEvent.params.top)
                  : undefined,
                impact_score_gte: search.searchEvent.params.impact_score_gte
                  ? parseInt(search.searchEvent.params.impact_score_gte)
                  : undefined,
                impact_score_lte: search.searchEvent.params.impact_score_lte
                  ? parseInt(search.searchEvent.params.impact_score_lte)
                  : undefined,
                inbound_score_gte: search.searchEvent.params.inbound_score_gte
                  ? parseInt(search.searchEvent.params.inbound_score_gte)
                  : undefined,
                inbound_score_lte: search.searchEvent.params.inbound_score_lte
                  ? parseInt(search.searchEvent.params.inbound_score_lte)
                  : undefined,
                international_score_gte: search.searchEvent.params
                  .international_score_gte
                  ? parseInt(search.searchEvent.params.international_score_gte)
                  : undefined,
                international_score_lte: search.searchEvent.params
                  .international_score_lte
                  ? parseInt(search.searchEvent.params.international_score_lte)
                  : undefined,
              },
            }))
          );
        } else {
          recentSearch = {
            ...recentSearchResponse[0],
            requestedAt: new Date().toISOString(),
            filterValues: {
              ...recentSearchResponse[0].searchEvent.params,
              limit: 20,
              offset: 0,
              active_gte:
                recentSearchResponse[0].searchEvent.params.active_gte ||
                startOfMonth(new Date()).toISOString(),
              active_lte:
                recentSearchResponse[0].searchEvent.params.active_lte ||
                endOfMonth(addMonths(new Date(), 3)).toISOString(),
              view: "list",
              eventTypes:
                recentSearchResponse[0].searchEvent.params.eventTypes?.split(
                  ","
                ),
              categories:
                recentSearchResponse[0].searchEvent.params.categories?.split(
                  ","
                ),
              locationIds:
                recentSearchResponse[0].searchEvent.params.locationIds?.split(
                  ","
                ) || [],
              status:
                recentSearchResponse[0].searchEvent.params.status?.split(","),
              eventFormats:
                recentSearchResponse[0].searchEvent.params.eventFormats?.split(
                  ","
                ),
              entryType:
                recentSearchResponse[0].searchEvent.params.entryType?.split(
                  ","
                ),
              ratings:
                recentSearchResponse[0].searchEvent.params.ratings?.split(","),
              maturity:
                recentSearchResponse[0].searchEvent.params.maturity?.split(","),
              frequencies:
                recentSearchResponse[0].searchEvent.params.frequencies?.split(
                  ","
                ),
              includeKeywords:
                recentSearchResponse[0].searchEvent.params.includeKeywords?.split(
                  ","
                ),
              excludeKeywords:
                recentSearchResponse[0].searchEvent.params.excludeKeywords?.split(
                  ","
                ),
              estimatedVisitorRangeTag:
                recentSearchResponse[0].searchEvent.params.estimatedVisitorRangeTag?.split(
                  ","
                ),
              estimatedExhibitors:
                recentSearchResponse[0].searchEvent.params.estimatedExhibitors?.split(
                  ","
                ),
              audienceSpread:
                recentSearchResponse[0].searchEvent.params.audienceSpread?.split(
                  ","
                ),
              designations:
                recentSearchResponse[0].searchEvent.params.designations?.split(
                  ","
                ),
              show:
                recentSearchResponse[0].searchEvent.params.show?.split(",") ||
                [],
              viewBound: recentSearchResponse[0].searchEvent.params.viewBound
                ? JSON.parse(
                    recentSearchResponse[0].searchEvent.params.viewBound
                  )
                : undefined,
              onlyBranded:
                recentSearchResponse[0].searchEvent.params.onlyBranded ===
                "true",
              onlySeries:
                recentSearchResponse[0].searchEvent.params.onlySeries ===
                "true",
              top: recentSearchResponse[0].searchEvent.params.top
                ? parseInt(recentSearchResponse[0].searchEvent.params.top)
                : undefined,
              impact_score_gte: recentSearchResponse[0].searchEvent.params
                .impact_score_gte
                ? parseInt(
                    recentSearchResponse[0].searchEvent.params.impact_score_gte
                  )
                : undefined,
              impact_score_lte: recentSearchResponse[0].searchEvent.params
                .impact_score_lte
                ? parseInt(
                    recentSearchResponse[0].searchEvent.params.impact_score_lte
                  )
                : undefined,
              inbound_score_gte: recentSearchResponse[0].searchEvent.params
                .inbound_score_gte
                ? parseInt(
                    recentSearchResponse[0].searchEvent.params.inbound_score_gte
                  )
                : undefined,
              inbound_score_lte: recentSearchResponse[0].searchEvent.params
                .inbound_score_lte
                ? parseInt(
                    recentSearchResponse[0].searchEvent.params.inbound_score_lte
                  )
                : undefined,
              international_score_gte: recentSearchResponse[0].searchEvent
                .params.international_score_gte
                ? parseInt(
                    recentSearchResponse[0].searchEvent.params
                      .international_score_gte
                  )
                : undefined,
              international_score_lte: recentSearchResponse[0].searchEvent
                .params.international_score_lte
                ? parseInt(
                    recentSearchResponse[0].searchEvent.params
                      .international_score_lte
                  )
                : undefined,
            },
          };
        }
        const recentFilterParams = mapRecentSearchToParams(recentSearch);
        Object.entries(recentFilterParams).forEach(([key, value]) => {
          if (value) params.set(key, String(value));
        });
        const trendsParams = generateTrendsParams(params, recentFilterParams);

        if (
          pathName.split("/").includes("search") ||
          pathName === "/internal/trends"
        ) {
          // Use router.replace to update URL without navigation
          const newUrl = `${pathName}?${
            pathName === "/internal/trends"
              ? trendsParams.toString()
              : params.toString()
          }`;
          router.replace(newUrl);
        } else {
          setMultipleLocalFilters(recentFilterParams);
        }
        return;
      }
    } catch (error) {
      console.error("Error setting initial filters:", error);
    }

    const defaultSearchParams = new URLSearchParams(searchParams.toString());

    if (pathName.split("/").includes("trends")) {
      defaultSearchParams.set("active_lte", defaultTrendsParams.active_lte);
      defaultSearchParams.set("active_gte", defaultTrendsParams.active_gte);
      defaultSearchParams.set("locationIds", defaultTrendsParams.locationIds);
      defaultSearchParams.set("categories", defaultTrendsParams.categories);
      defaultSearchParams.set("columns", "eventCount");
      const newUrl = `${pathName}?${defaultSearchParams.toString()}`;
      router.replace(newUrl);
    }

    if (pathName.split("/").includes("search") && !defaultSearchParams.has("eventIds")) {
      defaultSearchParams.set("active_lte", defaultTrendsParams.active_lte);
      defaultSearchParams.set("active_gte", defaultTrendsParams.active_gte);
      const newUrl = `${pathName}?${defaultSearchParams.toString()}`;
      router.replace(newUrl);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!pathName.split("/").includes("editTracker")) {
        setInTransition(true)
        await setInitialFilters();
        setTimeout(() => {
          setInTransition(false);
        }, 1000);
      }
    };
    init();
  }, []);

  return { searchParams };
}
