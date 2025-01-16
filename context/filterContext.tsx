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
import { generateSearchFilters, searchFilters } from "@/public/data/searchFilters";
import { useToast } from "@/components/ui/use-toast";
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
interface Filters {
  interest?:string;
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
};
type FilterContextType = {
  localFilters: Filters;
  morphedData: any;
  setLocalFilter: (key: keyof Filters, value: string) => void;
  clearLocalFilters: (value:string) => void;
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
  enabledFilters: EventFilterData | null;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [morphedData,setMorphedData]=useState(searchFilters);
  const { searchParams } = useFilterState();
  const [localFilters, setLocalFilters] = useState<Filters>({});
  const eventService = useEventsService(); 
  const [enabledFilters,setEnabledFilters]=useState<any>(null);
  const pathname = usePathname()
  const filterEmptyValues = useCallback((filters: Filters): Filters => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    ) as Filters;
  }, []);

  useEffect(() => {
    const getEnabledFilters = async () => {
      try {
        const data = await eventService.fetchEnabledFilters("research");
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
      console.log("Enabled Filters:", enabledFilters);
      console.log("Updated Filters:", generateSearchFilters(enabledFilters));
      setMorphedData(generateSearchFilters(enabledFilters) as any);
    }
  }, [enabledFilters]);
  useEffect(() => {
    if(!pathname.split('/').includes("editTracker")){
   setInitialFilters();
   console.log(11111);
   
    }
  }, [searchParams, enabledFilters]);
  useEffect(() => {
   console.log(localFilters);
   
    
    // setLocalFilters(
    //   filterEmptyValues(Object.fromEntries(searchParams.entries()) as Filters)
    // );
  }, [searchParams, filterEmptyValues]);

  const setLocalFilter = useCallback((key: keyof Filters, value: string) => { 
    console.log(key);
    
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
      estimatedExhibitors:"estimatedExhibitScore"
    };
    console.log(enabledFilters);
    const selected=mapping[key as keyof Filter];
    setLocalFilters((prev) => {
      console.log(prev);
      
      if (
        enabledFilters?.[selected] &&
        (
          (selected === "maturity" && value?.length === 0) || 
          (
            selected !== "maturity" &&
            typeof prev?.[key as keyof Filter] === "string" &&
            prev[key as keyof Filter]!.split(",").length <= 1 &&
            typeof value === "string" &&
            value.split(",").length <= 1
          )
        )
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
      console.log(newFilters);
      
      return newFilters;
    });
  }, [enabledFilters]);

  const clearLocalFilters = useCallback((view:string) => {
    console.log(enabledFilters);
    router.push(`/internal/search/events?view=${view}`);
  }, []);
  const setInitialFilters=()=>{
    const temp: Record<string, string> = Object.fromEntries(searchParams.entries());
    console.log(enabledFilters);
    
    if (enabledFilters&& (Object.keys(temp).includes("view") && Object.keys(temp).length===1 &&  pathname.split('/')[2]==="search" || pathname.split('/')[3]==="create")) {
      
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
      temp.onlyBranded = enabledFilters.branded?.enabledValue?.eventBrand ? 'true' : '';
      temp.onlySeries = enabledFilters.branded?.enabledValue?.eventSeries ? 'true' : '';
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
    console.log(temp);
    console.log(localFilters);
    
    setLocalFilters(temp);
    applyFilters()
  }
  const applyFilters = useCallback(() => {
    setLocalFilters((currentFilters) => {
      console.log(currentFilters);
      
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
  console.log(localFilters);
  
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
