import { useTrackerServices } from '@/services/trackerServices';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { usePathname } from "next/navigation";
import { Tracker } from '@/types/trackers';
import { useFilterState } from '@/hooks/useFilterState';
type trackerType = {
    
  };
  const trackerValues: any = {
  };
  interface Data {
    tracker: Tracker;
  }
export const TrackerContext = createContext<any>(
    trackerValues
  );

  export const TrackerContextProvider=({ children }: any)=>{
    const {getTrackerDetail, error, isLoading}=useTrackerServices();
    const {getFilterValue}=useFilterState();
    const [savedEventCount, setSavedEventCount]=useState(0);
    const [data,setData]=useState<Data | null>();
    const pathName = usePathname().split('/');
    const [isNewCall,setIsNewCall]=useState(false);
    const [editTrue, setEditTrue]=useState(false);
    const [trackerId,setTrackerId]=useState("");
    const [skip,setSkip]=useState(getFilterValue("skip") || 0);
    const [searchValue, setSearchValue] = useState(getFilterValue("q") || "");
    const pages=["manageAccess","editTracker","trackedEvents", "notesDiscussion","trackedConfiguration"]
    useEffect(()=>{
      if(pathName.length > 4 && pages.includes(pathName[4]) && (!data || data === null)){
        setTrackerId(pathName[3]);
        setIsNewCall(true);
      }
    },[pathName])
    
    useEffect(()=>{
      // console.log(11111);
      
        if(isNewCall){
            fetchData();
        }
    },[isNewCall])
    const fetchData = useCallback(async () => {
      try {
        console.log(trackerId);
        const data = await getTrackerDetail(trackerId);
        if (data) {
          setData(data);
          setSavedEventCount(data.savedEventsCount)
          console.log(data);
          setIsNewCall(false);
          setEditTrue(false);
        }
        if (error) {
          console.error("Error fetching data:", error);
        }
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    }, [trackerId, getTrackerDetail, error]);
    
    const value = {
        isNewCall,
        isLoading,
        savedEventCount,
        setSavedEventCount,
        setIsNewCall,
        editTrue,
        setEditTrue,
        setTrackerId,
        data,
        setData,
        skip,
        setSkip,
        searchValue,
        setSearchValue
      };
      return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
  }
  export const useTrackerContext = () => useContext(TrackerContext);