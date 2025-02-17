import { useTrackerServices } from '@/services/trackerServices';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { Tracker } from '@/types/trackers';
import { useFilterState } from '@/hooks/useFilterState';
import { useQuery } from "@tanstack/react-query";

interface Data {
  tracker: Tracker;
}

const TrackerContext = createContext<any>({});

export const TrackerContextProvider = ({ children }: any) => {
  const { getTrackerDetail } = useTrackerServices();
  const { getFilterValue } = useFilterState();
  const pathName = usePathname().split('/');
  
  const [trackerId, setTrackerId] = useState("");
  const [isNewCall, setIsNewCall] = useState(false);
  const [editTrue, setEditTrue] = useState(false);
  const [skip, setSkip] = useState(getFilterValue("skip") || 0);
  const [searchValue, setSearchValue] = useState(getFilterValue("q") || "");

  const pages = ["manageAccess", "editTracker", "trackedEvents", "notesDiscussion", "trackedConfiguration"];

  useEffect(() => {
    if (pathName.length > 4 && pages.includes(pathName[4]) && !trackerId) {
      setTrackerId(pathName[3]);
      setIsNewCall(true);
    }
  }, [pathName]);

  // Fetch tracker details using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["trackerDetail", trackerId, editTrue],
    queryFn: async () => {
      if (!trackerId) return null;
      console.log(trackerId);
      return getTrackerDetail(trackerId);
    },
    enabled: !!trackerId && isNewCall,
    onSuccess: (fetchedData) => {
      setIsNewCall(false);
      setEditTrue(false);
    },
    onError: (err) => {
      console.error("Error fetching tracker data:", err);
    },
  });

  const value = {
    isNewCall,
    isLoading,
    setIsNewCall,
    editTrue,
    setEditTrue,
    setTrackerId,
    data,
    skip,
    setSkip,
    searchValue,
    setSearchValue,
  };

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
};

export const useTrackerContext = () => useContext(TrackerContext);
