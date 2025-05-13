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
import { set, setWeek } from "date-fns";

const trackerValues: any = {
  isNewCall: false,
  isLoading: false,
  savedEventCount: 0,
  suggestion: 0,
  setSuggestion: () => {},
  comp:{},
  setComp: () => {},
  keywordsTracker: {},
  setKeywordsTracker: () => {},
  peopleTracker: {},
  setPeopleTracker: () => {},
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
  const [suggestion , setSuggestion] = useState(0);
  const [isNewCall, setIsNewCall] = useState(false);
  const [editTrue, setEditTrue] = useState(false);
  const [trackerId, setTrackerId] = useState("");
  const [skip, setSkip] = useState(Number(getFilterValue("skip")) || 0);
  const [searchValue, setSearchValue] = useState(getFilterValue("q") || "");
  const [comp,setComp] = useState({
    competitors:[],
    name:"",
  });
  const [keywordsTracker, setKeywordsTracker] = useState({
    keywords: [],
    name:"",
  });
  const [peopleTracker, setPeopleTracker] = useState({
    people: [],
    name:"",
  });
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
    // console.log(11111);

    if (isNewCall) {
      fetchData();
    }
  }, [isNewCall]);
  const fetchData = useCallback(async () => {
    try {
      console.log(trackerId);
      const data = editTrue?await getTrackerDetail(trackerId, "refresh=true"):await getTrackerDetail(trackerId);
      if (data) {
        console.log(data);

        setData(data);
        setSavedEventCount(data.savedEventsCount || 0);
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
    setSearchValue,
    comp,
    setComp,
    keywordsTracker,
    setKeywordsTracker,
    peopleTracker,
    setPeopleTracker,
    suggestion,
    setSuggestion,
  };
  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
};
export const useTrackerContext = () => useContext(TrackerContext);
