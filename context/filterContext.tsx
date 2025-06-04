"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
import { useToast } from "@/hooks/use-toast";
import {
  generateSearchFilters,
  searchFilters,
} from "@/public/data/searchFilters";
import { endOfMonth } from "date-fns";
import { addMonths } from "date-fns";
import { startOfMonth } from "date-fns";
import { useConfigurationService } from "@/services/configurationService";
import { TrackerAIResponse } from "@/types/trackers";
import recentSearchService from "@/services/recentSearchService";

interface EventFilterData {
  eventFormat?: { enabledValue?: string[] };
  eventStatus?: { enabledValue?: string[] };
  eventCategory?: { enabledValue?: { slug: string }[] };
  eventType?: { enabledValue?: string[] };
  locationIds?: { enabledValue?: { id: string }[] };
  durations?: { startDate?: string; endDate?: string };
  eventEntry?: { enabledValue?: string[] };
  eventRating?: { enabledValue?: string[]; isRatingEnabled?: boolean };
  eventRanking?: {
    isRanking?: boolean;
  };
  maturity?: { enabledValue?: string[]; isMaturityEnabled?: boolean };
  branded?: {
    enabledValue?: { eventBrand?: boolean; eventSeries?: boolean };
    isBrandedEnabled?: boolean;
  };
  isForecasted?: {
    isForecastedEnabled?: boolean;
  };
  eventFrequency?: { enabledValue?: string[]; isFreqEnabled?: boolean };
  keywords?: {
    positiveKeywords?: string[];
    negativeKeywords?: string[];
  };
  eventSize?: { enabledValue?: string[] };
  estimatedExhibitScore?: {
    enabledValue?: string[];
    isExhibitorsEnabled?: boolean;
  };
  analytics?: { isAnalyticsEnabled?: boolean };
  audienceZone?: {
    isZoneEnabled?: boolean;
  };
  designation?: {
    isProfileEnabled?: boolean;
  };
  audienceSpread?: {
    isAudienceEnabled?: boolean;
  };
}
export interface Filters {
  // interest?: string;
  show?: string;
  // liked?: string;
  eventTypes?: string;
  categories?: string;
  // status?: string;
  top?: string;
  locationIds?: string;
  viewBound?: string;
  view?: string;
  calendar_type?: string;
  active_lte?: string;
  active_gte?: string;
  entryType?: string;
  eventFormats?: string;
  eventIds?: string;
  ratings?: string;
  designations?: string;
  audienceSpread?: string;
  audienceSpreadRegions?: string;
  maturity?: string;
  frequencies?: string;
  onlyBranded?: string;
  onlySeries?: string;
  columns?: string;
  activeCard?: string;
  activeCardName?: string;
  editTrend?: string;
  tags?: string;
  estimatedVisitorRangeTag?: string;
  estimatedVisitors?: string;
  estimatedExhibitors?: string;
  includeKeywords?: string;
  excludeKeywords?: string;
  trust_score_lte?: string;
  trust_score_gte?: string;
  impact_score_gte?: string;
  impact_score_lte?: string;
  inbound_score_gte?: string;
  inbound_score_lte?: string;
  international_score_gte?: string;
  international_score_lte?: string;
  economic_impact_lte?: string;
  economic_impact_gte?: string;
  total_attendance_gte?: string;
  total_attendance_lte?: string;
  eventType?: string;
  //Preset Filters
  presetCountry?: string;
  presetCategory?: string;
  // Coordinate Filters
  eventId?: string;
  type?: string;
  upvotedBy?: string;
  status?: string;

  // Prospect Filters
  viewBy?: string;
  companyCategoryIds?: string;
  companyLocationIds?: string;
  eventProductIds?: string;
  communitySize?: string;
  companyType?: string;
  establishedYear?: string;
  eventLocationIds?: string;
  eventCategoryIds?: string;
  eventFollowers?: string;
  eventParticipationType?: string;
  userNames?: string;
  userJobTitle?: string;
  userSocialLink?: string;
  filter?: string;
  compare_from?: string;
  compare_to?: string;
}
type Filter = {
  eventTypes: string;
  status: string;
  categories: string;
  eventFormats: string;
  entryType: string;
  ratings: string;
  maturity: string;
  frequencies: string;
  estimatedVisitors: string;
  estimatedExhibitors: string;
  estimatedVisitorRangeTag: string;
};
type FilterContextType = {
  suggestion: number;
  setSuggestion: React.Dispatch<React.SetStateAction<number>>;
  localFilters: Filters;
  loadingState: {
    isKeywordsLoading: boolean;
    isCompetitorsLoading: boolean;
    isPeopleLoading: boolean;
  };
  setLoadingState: React.Dispatch<
    React.SetStateAction<{
      isKeywordsLoading: boolean;
      isCompetitorsLoading: boolean;
      isPeopleLoading: boolean;
    }>
  >;
  templateView: boolean;
  setTemplateView: React.Dispatch<React.SetStateAction<boolean>>;
  morphedData: any;
  setLocalFilter: (key: keyof Filters, value: string) => void;
  clearLocalFilters: () => void;
  applyFilters: (options?: {
    removeParams?: string[];
    preserveParams?: string[];
    resetPage?: boolean;
  }) => void;
  getLocalFilterValue: (key: keyof Filters) => string;
  searchParams: URLSearchParams;
  setMultipleLocalFilters: (filters: Partial<Filters>) => void;
  deleteMultipleLocalFilters: (keys: Array<keyof Filters>) => void;
  replaceLocalFilter: (
    oldKey: keyof Filters,
    newKey: keyof Filters,
    newValue: string
  ) => void;
  enabledFilters: EventFilterData | null;
  showFetchedData: any;
  setShowFetchedData: (val: boolean) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { getFilterConfiguration } = useConfigurationService();
  const [morphedData, setMorphedData] = useState(searchFilters);
  const [showFetchedData, setShowFetchedData] = useState(false);
  const { searchParams } = useFilterState();
  const [suggestion, setSuggestion] = useState<number>(0);
  const [localFilters, setLocalFilters] = useState<Filters>({});
  const eventService = useEventsService();
  const [enabledFilters, setEnabledFilters] = useState<any>(null);
  const pathname = usePathname();
  const getCompanySuggestion = () => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const item = localStorage.getItem("companySuggestion");
      return item ? JSON.parse(item) : {};
    } catch (error) {
      console.error("Error parsing companySuggestion", error);
      return {};
    }
  };
  const aiStatus = getCompanySuggestion();
  const filterEmptyValues = useCallback((filters: Filters): Filters => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    ) as Filters;
  }, []);
  const [loadingState, setLoadingState] = useState({
    isKeywordsLoading: aiStatus?.keywordData?.status === 1 || false,
    isCompetitorsLoading: aiStatus?.competitorData?.status === 1 || false,
    isPeopleLoading: aiStatus?.companyData?.status === 1 || false,
  });
  const [templateView, setTemplateView] = useState(false);
  useEffect(() => {
    if (!pathname.split("/").includes("editTracker")) {
      const params = {
        ...Object.fromEntries(searchParams.entries()),
      } as Filters;
      // Set default date range if not present
      if (
        pathname === "/internal/search/events" &&
        !params.active_gte &&
        !params.active_lte &&
        !params.eventIds
      ) {
        params.active_gte = startOfMonth(new Date())
          .toISOString()
          .split("T")[0];
        params.active_lte = endOfMonth(addMonths(new Date(), 3))
          .toISOString()
          .split("T")[0];
      }

      setLocalFilters(filterEmptyValues(params));
    }
  }, [filterEmptyValues, searchParams]);

  useEffect(() => {
    const getEnabledFilters = async () => {
      try {
        const data = await getFilterConfiguration();
        setEnabledFilters(data || {});
      } catch (e) {
        console.error("Error fetching filters:", e);
        setEnabledFilters({});
      }
    };
    getEnabledFilters();
  }, []);

  useEffect(() => {
    if (enabledFilters) {
      setMorphedData(generateSearchFilters(enabledFilters) as any);
    }
  }, [enabledFilters]);

  const setLocalFilter = useCallback(
    (key: keyof Filters, value: string) => {
      console.log(key);

      const mapping: Record<keyof Filter, string> = {
        eventTypes: "eventTypes",
        status: "status",
        categories: "categories",
        eventFormats: "eventFormats",
        entryType: "entryType",
        ratings: "ratings",
        maturity: "maturity",
        frequencies: "frequencies",
        estimatedVisitors: "estimatedVisitors",
        estimatedExhibitors: "estimatedExhibitors",
        estimatedVisitorRangeTag: "estimatedVisitorRangeTag",
      };
      console.log(enabledFilters);
      const selected = mapping[key as keyof Filter];
      setLocalFilters((prev) => {
        // console.log(prev);

        if (
          enabledFilters?.filter?.[selected] &&
          ((selected === "maturity" && value?.length === 0) ||
            (selected !== "maturity" &&
              typeof prev?.[key as keyof Filter] === "string" &&
              prev[key as keyof Filter]!.split(",").length <= 1 &&
              typeof value === "string" &&
              value.split(",").length <= 1))
        ) {
          console.log(value);

          toast({
            title: "Error",
            description: "At least one filter must be selected",
            variant: "destructive",
          });
          return prev;
        }

        const newFilters = { ...prev };
        if (value === "") {
          delete newFilters[key];
        } else {
          newFilters[key] = value;
        }

        return newFilters;
      });
    },
    [enabledFilters]
  );

  const clearLocalFilters = useCallback(() => {
    const params = new URLSearchParams();

    params.set(
      "active_gte",
      startOfMonth(new Date()).toISOString().split("T")[0]
    );
    params.set(
      "active_lte",
      endOfMonth(addMonths(new Date(), 3)).toISOString().split("T")[0]
    );

    // Preserve view if it exists
    const viewValue = searchParams.get("view");
    if (viewValue) {
      params.set("view", viewValue);
    }

    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, [searchParams]);

  const applyFilters = useCallback(
    (
      options: {
        removeParams?: string[];
        preserveParams?: string[];
        resetPage?: boolean;
      } = {}
    ) => {
      setLocalFilters((currentFilters) => {
        const filteredFilters = filterEmptyValues(currentFilters);
        const params = new URLSearchParams();

        if (options.preserveParams?.length) {
          const currentParams = new URLSearchParams(window.location.search);
          options.preserveParams.forEach((param) => {
            const value = currentParams.get(param);
            if (value) params.set(param, value);
          });
        }

        Object.entries(filteredFilters).forEach(([key, value]) => {
          if (value !== undefined && !options.removeParams?.includes(key)) {
            params.set(key, value);
          }
        });

        if (options.resetPage) {
          params.delete("offset");
          params.delete("page");
        }

        const currentPathname = window.location.pathname;
        const searchString = params.toString();

        // Save to recent searches
        const searchEvent = {
          date: new Date().toISOString(),
          fullPath: `${currentPathname}?${searchString}`,
          path: currentPathname,
          params: Object.fromEntries(params.entries()),
        };

        const isTrends = currentPathname.includes("/internal/trends");

        if (isTrends) {
          recentSearchService.addToTrendsHistory(
            searchString,
            searchEvent,
            filteredFilters
          );
        } else {
          recentSearchService.addToSearchHistory(
            searchString,
            searchEvent,
            filteredFilters
          );
        }

        router.push(`${currentPathname}?${searchString}`, {
          scroll: false,
        });
        return filteredFilters;
      });
    },
    [filterEmptyValues, router]
  );

  const setMultipleLocalFilters = useCallback(
    (filters: Partial<Filters>) => {
      setLocalFilters((prev) => {
        return filterEmptyValues({
          ...prev,
          ...filters,
        });
      });
    },
    [filterEmptyValues]
  );

  const deleteMultipleLocalFilters = useCallback(
    (keys: Array<keyof Filters>) => {
      setLocalFilters((prev) => {
        const newFilters = { ...prev };
        // Filter out date range filters to prevent them from being deleted
        const filteredKeys = keys.filter(
          (key) => key !== "active_gte" && key !== "active_lte"
        );
        filteredKeys.forEach((key) => {
          delete newFilters[key];
        });
        return filterEmptyValues(newFilters);
      });
    },
    [filterEmptyValues]
  );

  const replaceLocalFilter = useCallback(
    (oldKey: keyof Filters, newKey: keyof Filters, newValue: string) => {
      setLocalFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[oldKey];
        if (newValue !== "") {
          newFilters[newKey] = newValue;
        }
        return filterEmptyValues(newFilters);
      });
    },
    [filterEmptyValues]
  );

  const contextValue = useMemo(
    () => ({
      suggestion,
      setSuggestion,
      showFetchedData,
      setShowFetchedData,
      localFilters,
      loadingState,
      setLoadingState,
      templateView,
      setTemplateView,
      morphedData,
      enabledFilters,
      setLocalFilter,
      clearLocalFilters,
      applyFilters,
      getLocalFilterValue: (key: keyof Filters) => localFilters[key] || "",
      searchParams: new URLSearchParams(searchParams.toString()),
      setMultipleLocalFilters,
      deleteMultipleLocalFilters,
      replaceLocalFilter,
    }),
    [
      suggestion,
      showFetchedData,
      templateView,
      loadingState,
      localFilters,
      morphedData,
      enabledFilters,
      setLocalFilter,
      clearLocalFilters,
      applyFilters,
      setMultipleLocalFilters,
      deleteMultipleLocalFilters,
      replaceLocalFilter,
      searchParams,
    ]
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
