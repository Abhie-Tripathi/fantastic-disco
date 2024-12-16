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

type FilterContextType = {
  localFilters: Record<string, string>;
  setLocalFilter: (key: string, value: string) => void;
  clearLocalFilters: () => void;
  applyFilters: () => void;
  getLocalFilterValue: (key: string) => string;
  searchParams: URLSearchParams;
  setMultipleLocalFilters: (filters: Record<string, string>) => void;
  deleteMultipleLocalFilters: (keys: string[]) => void;
  replaceLocalFilter: (
    oldKey: string,
    newKey: string,
    newValue: string
  ) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { searchParams } = useFilterState();
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  const filterEmptyValues = useCallback((filters: Record<string, string>) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
  }, []);

  useEffect(() => {
    setLocalFilters(
      filterEmptyValues(Object.fromEntries(searchParams.entries()))
    );
  }, [searchParams, filterEmptyValues]);

  const setLocalFilter = useCallback((key: string, value: string) => {
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

  const applyFilters = () => {
    setLocalFilters((currentFilters) => {
      const filteredFilters = filterEmptyValues(currentFilters);
      const params = new URLSearchParams();
      Object.entries(filteredFilters).forEach(([key, value]) => {
        if (key !== "skip") {
          params.set(key, value);
        }
      });
      const currentPathname = window.location.pathname;
      router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
      return filteredFilters;
    });
  };

  const setMultipleLocalFilters = useCallback(
    (filters: Record<string, string>) => {
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
    (keys: string[]) => {
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
    (oldKey: string, newKey: string, newValue: string) => {
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
      getLocalFilterValue: (key: string) => localFilters[key] || "",
      searchParams,
      setMultipleLocalFilters,
      deleteMultipleLocalFilters,
      replaceLocalFilter,
    }),
    [
      localFilters,
      setLocalFilter,
      clearLocalFilters,
      setMultipleLocalFilters,
      deleteMultipleLocalFilters,
      replaceLocalFilter,
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