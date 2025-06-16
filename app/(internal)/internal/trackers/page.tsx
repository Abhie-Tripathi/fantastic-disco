"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Templates = dynamic(()=>import('@/app/components/Templates'),{
   loading: () => <Loading/>,
})
// import Templates from "@/app/components/Templates";
import styles from "./page.style.module.css";
import Link from "next/link";
import { Suspense, lazy } from "react";
import AccessBackground from "@/public/AccessBackground.svg";
import { EventTableType } from "@/types/ListViewTable";
import SavedEventWidget from "@/app/components/internal/trackers/SavedEventWidget";
import NotesDiscussionWidget from "@/app/components/internal/trackers/NotesDiscussionWidget";
import NotificationWidget from "@/app/components/internal/trackers/NotificationWidget";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import MyTracker from "@/app/components/internal/trackers/MyTrackers";
import Loading from "@/app/components/UI/Loading";
import { Button } from "@/components/ui/button";
import data from "@/components/templateData";
const Map = lazy(() => import("@/components/map"));
import { GAEvent } from "@/utils/GAEvent";
import { useTheme } from "@/context";
import { Step } from "react-joyride";
import { useRouter, useSearchParams } from "next/navigation";
import CardWidgitConfig from "@/app/components/internal/trackers/CardWidgitConfig";
import { useTrackerServices } from "@/services/trackerServices";
import { useNotesServices } from "@/services/notesServices";
import { Tracker } from "@/types/trackers";
import { useTrackerContext } from "@/context/tracker";
import { useFilterState } from "@/hooks/useFilterState";
import { isEventeli } from "@/config";
import { MoveUpRight } from "lucide-react";
interface Search {
  searchParams: {
    tab: string;
  };
}
const Trackers = ({ searchParams }: Search) => {
  const { tab } = searchParams;
  const {
    setIsNewCall,
    setTrackerId,
    isLoading: load,
    skip,
    setSkip,
    setSearchValue,
    searchValue,
    trackerId,
  } = useTrackerContext();
  const router = useRouter();
  const { getTrackers, getSavedEvents } = useTrackerServices();
  const [type, setType] = useState("");
  const [activeType, setActiveType] = useState("");
  const { setFilter, getFilterValue, deleteFilter, setMultipleFilters } =
    useFilterState();
  useEffect(() => {
    if (tab === "savedEvents") setType("Saved Events");
    else if (tab === "customTrackers") setType("Custom Trackers");
    else setType("All Trackers");
  }, [tab]);
  const [locations, setLocations] = useState<any>();
  const [trackers, setTrackers] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const searchParam = useSearchParams();
  const [run, setRun] = useState(true);
  const { theme } = useTheme();
  useEffect(() => {
    //  if(document.body.classList.contains(styles.bodyOverflowHidden))
    //   document.body.classList.remove(styles.bodyOverflowHidden);
    if (document.body.style.height === "100vh") {
      document.body.style.height = "";
    }
  }, []);
  const showInsights = {
    eventSize: true,
    eventKeywords: true,
    global: true,
    reptSent: true,
    eventRank: true,
    matchScore: true,
    estExhibit: true,
    growth: true,
    repeatSent: true,
  };
  const [hide, setHide] = useState(false);
  const [singleTrackerData, setSingleTrackerData] = useState<
    Tracker | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const { getNotesFromTracker } = useNotesServices();
  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 5);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const baseUrl = url.substring(0, url.lastIndexOf("/"));
      setCurrentUrl(`${baseUrl}/trackers`);
    }
  }, []);

  const modalOpen = () => {
    setShowModal(true);
    console.log(document.body.style);

    document.body.style.height = "100vh";

    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  };

  const closeModal = (e: any) => {
    const targetElement = e.target;
    if (
      targetElement.classList.contains(styles.modalContainer) ||
      targetElement.classList.contains(styles.modalInnerContainer)
    ) {
      setShowModal(false);
      document.body.style.overflow = "auto";
    }
  };
  const [showTracker, setShowTracker] = useState(false);
  // const viewTracker = () => {
  //   setShowTracker(true);
  //   setHideTemplate(!hideTemplate);
  // };
  const [hideTemplate, setHideTemplate] = useState<boolean>(
    !getFilterValue("showTemplates") || true
  );
  const [dataPresent, setDataPresent] = useState(false);
  // useEffect(() => {
  //   if (dataPresent) setHideTemplate(false);
  //   console.log(dataPresent);
  // }, [dataPresent]);
  const [isData, setIsData] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrackers(`offset=0&limit=0&type=trackers`);

      if (data) setIsLoading(false);
      if (data?.count) {
        // setHideTemplate(false);
        setIsData(true);
      }
    };

    fetchData();
  }, []);
  // useEffect(() => {
  //   if(type){
  //   if(type==="All Trackers")
  //   router.push(`/internal/trackers?tab=allTrackers`);
  //   else if(type==="Custom Trackers")
  //     router.push(`/internal/trackers?tab=customTrackers`);
  //   else if(type==="Saved Events")
  //     router.push(`/internal/trackers?tab=savedEvents`)
  //   }
  // }, [type]);

  const [note, setNote] = useState<any>(null);
  const [savedEvents, setSavedEvents] = useState<
    { events: EventTableType[]; count: number } | undefined
  >(undefined);
  useEffect(() => {
    // console.log(item?.tracker?.eventCountry);
    if (singleTrackerData === undefined) {
      setNote(null);
      setSavedEvents(undefined);
    } else {
      // const eventCountry = singleTrackerData?.filterValue?.eventCountry?.map((countryObj:{}) => Object.keys(countryObj)[0])||[];
      // const eventState = singleTrackerData?.filterValue?.eventState?.map((stateObj:{}) => Object.keys(stateObj)[0])||[];
      // const eventCity = singleTrackerData?.filterValue?.eventCity?.map((cityObj:{}) => Object.keys(cityObj)[0])||[];
      // const eventZone=singleTrackerData?.filterValue?.eventRegion?.split(",")||[];
      if (singleTrackerData?.filterValues?.locationIds) {
        const ids = Object?.keys(singleTrackerData?.filterValues?.locationIds);
        setLocations(ids);
        // setLocalFilter("locationIds", ids.join(","))
        // console.log(ids);
      } else setLocations("");
      if (singleTrackerData.id) {
        fetchNote(singleTrackerData?.id);
        fetchSavedEvent(singleTrackerData?.id);
      }
      console.log(singleTrackerData.id);
    }
  }, [skip]);
  const fetchNote = async (id: string) => {
    const result = await getNotesFromTracker(id, `limit=1&offset=0`);

    if (result && result.comments?.length > 0) {
      setNote(result?.comments);
    } else setNote(null);
  };
  const fetchSavedEvent = async (id: string) => {
    const result = (await getSavedEvents(id, `limit=2&offset=0`)) as {
      events: EventTableType[];
      count: number;
    };
    console.log(result);

    if (result && result?.count > 0) {
      setSavedEvents(result);
    } else setSavedEvents(undefined);
  };
  const setContextData = (id: string | undefined) => {
    GAEvent(
      "trackers",
      "Trackers",
      "Saved Tracker | Any Filter Applied",
      "View"
    );
    setIsNewCall(true);
    setTrackerId(id);
  };
  const hideTemplates = useCallback(
    (val: boolean) => {
      console.log("val",val);
      
      if (!val) {
        setMultipleFilters({
          showTemplates: (!val).toString(),
          // id: "",
          q: "",
        });
      } else {
        setMultipleFilters({
          skip: skip,
          q: searchValue,
          showTemplates: "",
        });
      }
    },
    [isData]
  );
  useEffect(() => {
    setHideTemplate(!getFilterValue("showTemplates"));
  }, [searchParam]);
  useEffect(() => {
    if (isEventeli) {
      if ((singleTrackerData?.groupedEventsCount?.business?.total ?? 0) > 0)
        setActiveType("business");
      else setActiveType("social");
    } else {
      if ((singleTrackerData?.groupedEventsCount?.active ?? 0) > 0) {
        console.log(singleTrackerData?.groupedEventsCount?.active);

        setActiveType("active");
      } else {
        setActiveType("past");
      }
    }
  }, [singleTrackerData]);
  console.log(singleTrackerData);

  return (
    // <div className={styles.body}>
    //   <div className={styles.trackers_card_container}>
    //     {trackers.length > 0 ? (
    //       trackers.map((tracker) => <TrackerCard key={tracker.id} trackerData={tracker} />)
    //     ) : (
    //       isLoading ? (
    //         <Loading />
    //       ) : (
    //         <div>No data available</div>
    //       )
    //     )}
    //     {trackers.length > 0 && (
    //       <div className={styles.btn_showMore} onClick={handleShowMore}>
    //         Show More
    //       </div>
    //     )}
    //   </div>
    // </div>
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full">
          {isData && (
            <div className="flex flex-row">
              <div className="w-full h-[calc(100vh-67px)]">
                <div>
                  <MyTracker
                    setDataPresent={setDataPresent}
                    dataPresent={dataPresent}
                    isData={isData}
                    setSingleTrackerData={setSingleTrackerData}
                    singleTrackerData={singleTrackerData}
                    searchValue={searchValue}
                    trackerId={singleTrackerData?.id || ""}
                    hideTemplates={hideTemplates}
                    setSearchValue={setSearchValue}
                    eventType={activeType}
                    trackerLoc={(locations?.length > 0 &&
                                  locations?.join(",")) ||
                                ""}
                  />
                </div>
              </div>
              
            </div>
          )}
          {(!hideTemplate || !isData) && (
            <div
              className="absolute  lg:left-[63px] left-0 top-[67px] bg-[var(--primary-foreground)] flex right-0 h-[calc(100vh-67px)]"
              style={{ zIndex: "11" }}
            >
              <Templates isData={isData} hideTemplates={hideTemplates} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Trackers;
