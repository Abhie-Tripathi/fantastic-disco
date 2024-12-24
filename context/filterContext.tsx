"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";

interface Filters {
  show?: string;
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
  tags?: string;
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
}

type FilterContextType = {
  localFilters: Filters;
  setLocalFilter: (key: keyof Filters, value: string) => void;
  clearLocalFilters: () => void;
  applyFilters: () => void;
  getLocalFilterValue: (key: keyof Filters) => string;
  searchParams: URLSearchParams;
  setMultipleLocalFilters: (filters: Partial<Filters>) => void;
  deleteMultipleLocalFilters: (keys: Array<keyof Filters>) => void;
  replaceLocalFilter: (
    oldKey: keyof Filters,
    newKey: keyof Filters,
    newValue: string
  ) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { searchParams } = useFilterState();
  const [localFilters, setLocalFilters] = useState<Filters>({});

  const filterEmptyValues = useCallback((filters: Filters): Filters => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    ) as Filters;
  }, []);

  useEffect(() => {
    setLocalFilters(
      filterEmptyValues(Object.fromEntries(searchParams.entries()) as Filters)
    );
  }, [searchParams, filterEmptyValues]);

  const setLocalFilter = useCallback((key: keyof Filters, value: string) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  }, []);

  const clearLocalFilters = useCallback(() => {
    setLocalFilters({});
  }, []);

  const applyFilters = useCallback(() => {
    setLocalFilters((currentFilters) => {
      const filteredFilters = filterEmptyValues(currentFilters);
      const params = new URLSearchParams();
      Object.entries(filteredFilters).forEach(([key, value]) => {
        if (key !== "skip" && value !== undefined) {
          params.set(key, value);
        }
      });
      const currentPathname = window.location.pathname;
      router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
      return filteredFilters;
    });
  }, [filterEmptyValues, router]);

  const setMultipleLocalFilters = useCallback(
    (filters: Partial<Filters>) => {
      setLocalFilters((prev) =>
        filterEmptyValues({
          ...prev,
          ...filters,
        })
      );
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
