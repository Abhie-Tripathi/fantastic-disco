import { useTrackerServices } from "@/services/trackerServices";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { Tracker } from "@/types/trackers";
import { useFilterState } from "@/hooks/useFilterState";

const trackerValues: any = {
  isNewCall: false,
  isLoading: false,
  savedEventCount: 0,
  // suggestion: 0,
  // setSuggestion: () => {},
  setSavedEventCount: () => {},
  setIsNewCall: () => {},
  editTrue: false,
  setEditTrue: () => {},
  setTrackerId: () => {},
  data: null,
  setData: () => {},
  skip: 0,
  setSkip: () => {},
  searchValue: "",
  setSearchValue: () => {},
};

export const TrackerContext = createContext(trackerValues);

export const TrackerContextProvider = ({ children }: any) => {
  const { getTrackerDetail, error, isLoading } = useTrackerServices();
  const { getFilterValue } = useFilterState();
  const [savedEventCount, setSavedEventCount] = useState(0);
  const [data, setData] = useState<Tracker | null>(null);
  const pathName = usePathname().split("/");
  // const [suggestion , setSuggestion] = useState(0);
  const [isNewCall, setIsNewCall] = useState(false);
  const [editTrue, setEditTrue] = useState(false);
  const [trackerId, setTrackerId] = useState("");
  const [skip, setSkip] = useState(Number(getFilterValue("skip")) || 0);
  const [searchValue, setSearchValue] = useState(getFilterValue("q") || "");
  const pages = [
    "manageAccess",
    "editTracker",
    "trackedEvents",
    "notesDiscussion",
    "trackedConfiguration",
  ];
  useEffect(() => {
    console.log(pathName);

    if (
      pathName.length > 4 &&
      pages.includes(pathName[4]) &&
      (!data || data === null)
    ) {
      setTrackerId(pathName[3]);
      setIsNewCall(true);
    }
  }, [pathName]);

  useEffect(() => {

    if (isNewCall) {
      fetchData();
    }
  }, [isNewCall]);
  const fetchData = useCallback(async () => {
    try {
      const data = editTrue?await getTrackerDetail(trackerId, "refresh=true"):await getTrackerDetail(trackerId);
      if (data) {

        setData(data);
        setSavedEventCount(data.savedEventsCount || 0);
        setEditTrue(false);
      }
      if (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    }
    setIsNewCall(false);
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
    setSearchValue,
    // suggestion,
    // setSuggestion,
  };
  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
};
export const useTrackerContext = () => useContext(TrackerContext);
