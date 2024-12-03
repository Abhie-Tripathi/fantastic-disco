"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import enabledValues from "@/public/data/enabledFilters";
import { useRouter, usePathname } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
type FilterContextType = {
  localFilters: Record<string, string>;
  setLocalFilter: (key: string, value: string) => void;
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
  const eventService = useEventsService();
  const [enabledFilters,setEnabledFilters]=useState();
  const [inetialRender,setInetialRender]=useState(true);
  useEffect(() => {
    const getEnabledFilters = async () => {
      
      try {
        const data = await eventService.fetchEnabledFilters("research");
        console.log(data);
        if(data){
        setEnabledFilters(data);
        }else{
          setEnabledFilters(null);
        }
      } catch (e) {
        console.log(e);
      }
    };
  
    getEnabledFilters();
  }, []);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
  console.log(localFilters);
  
  useEffect(() => {
    const temp = Object.fromEntries(searchParams.entries());
    console.log(enabledFilters);
    if(enabledFilters && inetialRender){

    temp.eventFormats = enabledFilters?.eventFormat?.enabledValue?.join(',');
    temp.status = enabledFilters?.eventStatus?.enabledValue?.join(',');
    temp.categories = enabledFilters?.eventCategory?.enabledValue?.map((item)=>item.slug).join(',');
    temp.eventTypes = enabledFilters?.eventType?.enabledValue?.join(',');
    temp.locationIds = enabledFilters?.locationIds?.enabledValue?.map((item)=>item.id).join(",");
    temp.active_gte = new Date(enabledFilters?.durations?.startDate?.split(',')[0])?.toISOString();
    temp.active_lte = new Date(enabledFilters.durations.startDate.split(',')[1])?.toISOString();
    temp.entryType = enabledFilters?.eventEntry?.enabledValue?.join(',');
    temp.ratings = enabledFilters?.eventRating?.enabledValue?.join(',');
    temp.maturity = enabledFilters?.maturity?.enabledValue[0];
    temp.onlyBranded = enabledFilters?.branded?.
    enabledValue?.eventBrand?"true":"false";
    temp.onlySeries = enabledFilters?.branded?.enabledValue?.eventSeries?"true":"false";
    temp.frequencies = enabledFilters?.eventFrequency?.enabledValue?.join(",");
    temp.includeKeywords = enabledFilters?.keywords?.positiveKeywords?.join(',');
    temp.excludeKeywords = enabledFilters?.keywords?.negativeKeywords?.join(',');
    temp.estimatedVisitors = enabledFilters?.eventSize?.enabledValue?.join(',');
    temp.estimatedExhibitors = enabledFilters?.estimatedExhibitScore?.enabledValue?.join(',');
    let dataToShow=[];
    if(enabledFilters?.eventRating?.isRatingEnabled) dataToShow.push("rating");
    if(enabledFilters?.maturity?.isMaturityEnabled) dataToShow.push("maturity");
    if(enabledFilters?.branded?.isBrandedEnabled) dataToShow.push("branded,series");
    if(enabledFilters?.eventFrequency?.isFreqEnabled) dataToShow.push("frequency");
    if(enabledFilters?.estimatedExhibitScore?.isExhibitorsEnabled) dataToShow.push("estimatedExhibitors");
    if(enabledFilters?.analytics?.isAnalyticsEnabled) dataToShow.push("scores");
    temp.show=dataToShow.join(',');
    
    // if(enabledFilters?.isRatingEnabled)
    // const show = "maturity"
    // temp.show = show;
    console.log(temp);
    setInetialRender(false);
    }
    setLocalFilters(temp);
  }, [searchParams, enabledFilters]);

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

  const applyFilters = () => {
    setLocalFilters((currentFilters) => {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && key !== "skip") {
          params.set(key, value);
        }
      });
      const currentPathname = window.location.pathname;
      router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
      return currentFilters;
    });
  };

  const setMultipleLocalFilters = useCallback(
    (filters: Record<string, string>) => {
      setLocalFilters((prev) => ({
        ...prev,
        ...filters,
      }));
    },
    []
  );

  const deleteMultipleLocalFilters = useCallback((keys: string[]) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev };
      keys.forEach((key) => {
        delete newFilters[key];
      });
      return newFilters;
    });
  }, []);

  const replaceLocalFilter = useCallback(
    (oldKey: string, newKey: string, newValue: string) => {
      setLocalFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[oldKey];
        newFilters[newKey] = newValue;
        return newFilters;
      });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      localFilters,
      enabledFilters,
      setLocalFilter,
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
