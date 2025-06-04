import { useTrackerServices } from "@/services/trackerServices";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useWalkthrough } from "@/hooks/useWalkthrough";
import { usePathname } from "next/navigation";
import { Tracker } from "@/types/trackers";
import { useFilterState } from "@/hooks/useFilterState";
import { Step } from "react-joyride";
import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";
import { isEventeli } from "@/config";
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
  steps: [],       
  run: true,         
  setRun: () => {},  
  refs: {} 
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
  const refs = {
    viewsRef: useRef<HTMLDivElement>(null),
    eventTypeRef: useRef<HTMLButtonElement>(null),
    popularityRef: useRef<HTMLDivElement>(null),
    configRef: useRef<HTMLDivElement>(null),
    shareRef: useRef<HTMLDivElement>(null),
    notesRef: useRef<HTMLDivElement>(null),
  };
  
  const stepsConfig = [
    {
      key: "viewsRef",
      content: "Switch between list, table, map, or calendar views to see your tracker data from any angle.",
    },
    {
      key: "eventTypeRef",
      content: isEventeli?
        "Social, Business, Unattended and Bookmarked—to quickly switch between event categories.":"Active, Past, New and Bookmarked—to quickly switch between event categories.",
    },
    {
      key: "popularityRef",
      content: "Sort by date or advanced intel and insights scores to surface your top priorities.",
    },
    {
      key: "configRef",
      content: "Customize and fine-tune your tracker settings here.",
    },
    {
      key: "shareRef",
      content: "Share your tracker with your team for seamless collaboration.",
    },
    {
      key: "notesRef",
      content: "Add notes and discussions to keep your team aligned.",
    },
  ] as const;
  const currentPath =
  pathName.length > 4 && pages.includes(pathName[4])
    ? `tracker/trackedEvent`
    : "";
  const { steps, run, setRun } = useWalkthrough({
    refs,
    stepsConfig,
    deps: [isNewCall],
    storageKey: "walkthroughCompleted",
    currentPath: currentPath, 
  });
  // console.log("refs",refs);
  
  
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
    steps,
    run,
    setRun,
    refs,
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
    <TrackerContext.Provider value={value}>
      {steps?.length > 0 && (
                  <JoyRideCustom
                  steps={steps}
                  run={run}
                  onFinish={() => setRun(false)}
                  pathName="tracker/trackedEvent"
                />
                )}
    {children}
    </TrackerContext.Provider>
  );
};
export const useTrackerContext = () => useContext(TrackerContext);
