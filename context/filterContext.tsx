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
import { toast } from "react-toastify";
import {
  generateSearchFilters,
  searchFilters,
} from "@/public/data/searchFilters";
import { useToast } from "@/components/ui/use-toast";
import { RecentSearchItem } from "@/types/events/recentSearches";
import { endOfMonth } from "date-fns";
import { addMonths } from "date-fns";
import { startOfMonth } from "date-fns";
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
interface Filters {
  interest?: string;
  show?: string;
  liked?: string;
  eventTypes?: string;
  categories?: string;
  status?: string;
  top?: string;
  locationIds?: string;
  geoCoordinates?: string;
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
  eventType?:string;

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
  localFilters: Filters;
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
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { getFilterConfiguration } = useConfigurationService();
  const [morphedData, setMorphedData] = useState(searchFilters);
  const { searchParams } = useFilterState();
  const [localFilters, setLocalFilters] = useState<Filters>({});
  const eventService = useEventsService();
  const [enabledFilters, setEnabledFilters] = useState<any>(null);
  const pathname = usePathname();
  const filterEmptyValues = useCallback((filters: Filters): Filters => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    ) as Filters;
  }, []);

  useEffect(() => {
    // console.log(pathname.split("/").includes("create"));

    if (!pathname.split("/").includes("editTracker")) {
      setLocalFilters(
        filterEmptyValues(Object.fromEntries(searchParams.entries()) as Filters)
      );
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
      // console.log("Enabled Filters:", enabledFilters);
      setMorphedData(generateSearchFilters(enabledFilters) as any);
    }
  }, [enabledFilters]);

  const setLocalFilter = useCallback(
    (key: keyof Filters, value: string) => {
      // console.log(key);

      const mapping: Record<keyof Filter, string> = {
        eventTypes: "eventType",
        status: "eventStatus",
        categories: "eventCategory",
        eventFormats: "eventFormat",
        entryType: "eventEntry",
        ratings: "eventRating",
        maturity: "maturity",
        frequencies: "eventFrequency",
        estimatedVisitors: "eventSize",
        estimatedExhibitors: "estimatedExhibitScore",
        estimatedVisitorRangeTag: "estimatedVisitorRangeTag",
      };
      // console.log(enabledFilters);
      const selected = mapping[key as keyof Filter];
      setLocalFilters((prev) => {
        // console.log(prev);

        if (
          enabledFilters?.[selected] &&
          ((selected === "maturity" && value?.length === 0) ||
            (selected !== "maturity" &&
              typeof prev?.[key as keyof Filter] === "string" &&
              prev[key as keyof Filter]!.split(",").length <= 1 &&
              typeof value === "string" &&
              value.split(",").length <= 1))
        ) {
          toast.error("At least one filter must be selected", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
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
    const params = new URLSearchParams(window.location.search);
    const viewValue = params.get("view");
    for (const key of Array.from(params.keys())) {
      params.delete(key);
    }
    if (viewValue) {
      params.set("view", viewValue);
    }

    params.set("active_gte", startOfMonth(new Date()).toISOString());
    params.set(
      "active_lte",
      endOfMonth(addMonths(new Date(), 3)).toISOString()
    );

    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, []);

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
        router.push(`${currentPathname}?${params.toString()}`, {
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
        keys.forEach((key) => {
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
      localFilters,
      morphedData,
      enabledFilters,
      setLocalFilter,
      clearLocalFilters,
      applyFilters,
      getLocalFilterValue: (key: keyof Filters) => localFilters[key] || "",
      searchParams,
      setMultipleLocalFilters,
      deleteMultipleLocalFilters,
      replaceLocalFilter,
    }),
    [
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
