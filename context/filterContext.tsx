"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { useEventsService } from "@/services/eventsService";
interface EventFilterData {
  eventFormat?: { enabledValue?: string[] };
  eventStatus?: { enabledValue?: string[] };
  eventCategory?: { enabledValue?: { slug: string }[] };
  eventType?: { enabledValue?: string[] };
  locationIds?: { enabledValue?: { id: string }[] };
  durations?: { startDate?: string; endDate?: string };
  eventEntry?: { enabledValue?: string[] };
  eventRating?: { enabledValue?: string[]; isRatingEnabled?: boolean };
  eventRanking?:{
    isRanking?:boolean;
  };
  maturity?: { enabledValue?: string[]; isMaturityEnabled?: boolean };
  branded?: {
    enabledValue?: { eventBrand?: boolean; eventSeries?: boolean };
    isBrandedEnabled?: boolean;
  };
  isForecasted?:{
    isForecastedEnabled?: boolean;
  };
  eventFrequency?: { enabledValue?: string[]; isFreqEnabled?: boolean };
  keywords?: {
    positiveKeywords?: string[];
    negativeKeywords?: string[];
  };
  eventSize?: { enabledValue?: string[] };
  estimatedExhibitScore?: { enabledValue?: string[]; isExhibitorsEnabled?: boolean };
  analytics?: { isAnalyticsEnabled?: boolean };
  audienceZone?:{
    isZoneEnabled?:boolean;
  };
  designation?:{
    isProfileEnabled?:boolean;
  };
  audienceSpread?:{
    isAudienceEnabled?:boolean;
  }
}
type FilterContextType = {
  localFilters: Record<string, string>;
  clearLocalFilters: (value:string) => void;
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
  enabledFilters: EventFilterData | null;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { searchParams } = useFilterState();
  const eventService = useEventsService(); 
  const [enabledFilters,setEnabledFilters]=useState<any>(null);
  const pathname = usePathname()
  
  useEffect(() => {
    const getEnabledFilters = async () => {
      
      try {
        const data = await eventService.fetchEnabledFilters("research");
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
  
  useEffect(() => {
   setInitialFilters();
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
  const setInitialFilters=()=>{
    const temp: Record<string, string> = Object.fromEntries(searchParams.entries());
    
    if (enabledFilters && Object.keys(temp).includes("view") && Object.keys(temp).length===1 &&  pathname.split('/')[2]==="search"  ) {
      
      temp.eventFormats = enabledFilters.eventFormat?.enabledValue?.join(',') ?? '';
      temp.status = enabledFilters.eventStatus?.enabledValue?.map((item:string)=>item.toLowerCase())?.join(',') ?? '';
      temp.categories = enabledFilters.eventCategory?.enabledValue
        ?.map((item: any) => item.slug)
        .join(',') ?? '';
      temp.eventTypes = enabledFilters.eventType?.enabledValue?.map((item:string)=>`${item.toLowerCase()}s`)?.join(',') ?? '';
      temp.locationIds = enabledFilters.locationIds?.enabledValue
        ?.map((item: any) => item.id)
        .join(',') ?? '';
      temp.active_gte = enabledFilters.durations?.startDate
        ? new Date(enabledFilters.durations.startDate.split(',')[0]).toISOString()
        : '';
      temp.active_lte = enabledFilters.durations?.endDate
        ? new Date(enabledFilters.durations.endDate.split(',')[1]).toISOString()
        : '';
      temp.entryType = enabledFilters.eventEntry?.enabledValue?.map((item:string)=>item.toLowerCase())?.join(',') ?? '';
      temp.ratings = enabledFilters.eventRating?.enabledValue?.join(',') ?? '';
      temp.maturity = enabledFilters.maturity?.enabledValue?.[0] ?? '';
      if (enabledFilters.branded?.isBrandedEnabled) 
        temp.onlyBranded = enabledFilters.branded?.enabledValue?.eventBrand ? 'true' : 'false';
     if(enabledFilters.branded?.enabledValue?.
      isBrandedEnabled )
      temp.onlySeries = enabledFilters.branded?.enabledValue?.eventSeries ? 'true' : 'false';
      temp.frequencies = enabledFilters.eventFrequency?.enabledValue?.join(',') ?? '';
      temp.includeKeywords = enabledFilters.keywords?.positiveKeywords?.join(',') ?? '';
      temp.excludeKeywords = enabledFilters.keywords?.negativeKeywords?.join(',') ?? '';
      temp.estimatedVisitors = enabledFilters.eventSize?.enabledValue?.join(',') ?? '';
      temp.estimatedExhibitors = enabledFilters.estimatedExhibitScore?.enabledValue?.join(',') ?? '';
  
      let dataToShow: string[] = [];
      if (enabledFilters.eventRating?.isRatingEnabled) dataToShow.push('rating');
      if (enabledFilters.maturity?.isMaturityEnabled) dataToShow.push('maturity');
      if (enabledFilters.branded?.isBrandedEnabled) dataToShow.push('branded,series');
      if (enabledFilters.eventFrequency?.isFreqEnabled) dataToShow.push('frequency');
      if (enabledFilters.estimatedExhibitScore?.isExhibitorsEnabled) dataToShow.push('estimatedExhibitors');
      if (enabledFilters.analytics?.isAnalyticsEnabled) dataToShow.push('scores');
  
      temp.show = dataToShow.join(',');
    }
  
    setLocalFilters(temp);
  }
  const clearLocalFilters = useCallback((view:string) => {
    router.push(`/internal/search/events?view=${view}`);
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
      clearLocalFilters,
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
      enabledFilters,
      clearLocalFilters,
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