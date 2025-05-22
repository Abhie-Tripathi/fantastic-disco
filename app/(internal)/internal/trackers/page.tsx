"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Templates from "@/app/components/Templates";
import styles from "./page.style.module.css";
import Link from "next/link";
import { Suspense, lazy } from "react";
import AccessBackground from '@/public/AccessBackground.svg'
import {EventTableType } from '@/types/ListViewTable';
import SavedEventWidget from "@/app/components/internal/trackers/SavedEventWidget";
import NotesDiscussionWidget from "@/app/components/internal/trackers/NotesDiscussionWidget";
import NotificationWidget from "@/app/components/internal/trackers/NotificationWidget";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from '@/public/trackerNullState.svg';
import MyTracker from "@/app/components/internal/trackers/MyTrackers";
import Loading from "@/app/components/UI/Loading";
import { Button } from "@/components/ui/button";
import data from '@/components/templateData'
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
    tab:string;
  }
}
const Trackers = ({ searchParams }: Search) => {
  const {tab}=searchParams;
  const {  setIsNewCall, setTrackerId, isLoading:load, skip, setSkip,setSearchValue, searchValue, trackerId } = useTrackerContext();
  const router=useRouter();
  const {getTrackers, getSavedEvents}=useTrackerServices();
  const [type, setType] = useState("");
  const [activeType, setActiveType]=useState("");
  const {setFilter, getFilterValue, deleteFilter, setMultipleFilters} = useFilterState();
  useEffect(()=>{
    if(tab==="savedEvents") setType("Saved Events")
    else if(tab==="customTrackers") setType("Custom Trackers")
    else setType("All Trackers")
  },[tab])
  const [locations, setLocations] = useState<any>();
  const [trackers, setTrackers] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const searchParam=useSearchParams();
  // WalkThrough
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(true);
  const allTrackerRef = useRef(null);
  const createTrackerRef = useState(null);
  const customTrackerRef = useRef(null);
  const savedEventRef = useRef(null);
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
  const [singleTrackerData,setSingleTrackerData]=useState<Tracker | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');
  const {getNotesFromTracker}=useNotesServices();
  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 5);
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const url = window.location.href;
        const baseUrl = url.substring(0, url.lastIndexOf('/'));
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
  const [hideTemplate, setHideTemplate] = useState<boolean>(!getFilterValue("showTemplates") || true);
  const [dataPresent, setDataPresent] = useState(false);
  // useEffect(() => {
  //   if (dataPresent) setHideTemplate(false);
  //   console.log(dataPresent);
  // }, [dataPresent]);
  const [isData, setIsData] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data= await getTrackers(`offset=0&limit=0&type=trackers`);
      
      if (data) setIsLoading(false)
      if (data?.count) {
        // setHideTemplate(false);
        setIsData(true)
      }

    }

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
  
  
  // const updateSteps = useCallback(() => {
  //   const newSteps: Step[] = [];
  //   if (allTrackerRef && allTrackerRef.current) {
  //     newSteps.push({
  //       target: allTrackerRef.current,
  //       title: "Create Tracker",
  //       content: "Discover insights on business trends filtered by geography and category, all in one glance.",
  //       disableBeacon: true,
  //     });
  //   }
  //   // if (customTrackerRef.current) {
  //   //   newSteps.push({
  //   //     target: customTrackerRef.current,
  //   //     // title: "Search Intel",
  //   //     content: "Search for relevant events happening in any location",
  //   //     disableBeacon: true,
  //   //   });
  //   // }
  //   if (savedEventRef.current) {
  //     newSteps.push({
  //       target: savedEventRef.current,
  //       // title: "Search Intel",
  //       content: "Stay informed about the latest industry events and save them to stay updated on event updates.",
  //       disableBeacon: true,
  //     });
  //   }

  //   setSteps(newSteps);
  // }, [ customTrackerRef.current, savedEventRef.current]);

  // useEffect(() => {
  //   const walkthroughCompleted: string[] = JSON.parse(
  //     localStorage.getItem("walkthroughCompleted") || "[]"
  //   );

  //   if (!walkthroughCompleted.includes("tracker")) {
  //     updateSteps();
  //     setRun(true);
  //   }
  // }, [updateSteps]);
  
  const [note,setNote]=useState<any>(null);
  const [savedEvents, setSavedEvents] = useState<{ events: EventTableType[]; count: number } | undefined>(undefined);
  useEffect(() => {
    // console.log(item?.tracker?.eventCountry);
    if(singleTrackerData===undefined){
      setNote(null);
      setSavedEvents(undefined);
    }
    else{
    // const eventCountry = singleTrackerData?.filterValue?.eventCountry?.map((countryObj:{}) => Object.keys(countryObj)[0])||[];
    // const eventState = singleTrackerData?.filterValue?.eventState?.map((stateObj:{}) => Object.keys(stateObj)[0])||[];
    // const eventCity = singleTrackerData?.filterValue?.eventCity?.map((cityObj:{}) => Object.keys(cityObj)[0])||[];
    // const eventZone=singleTrackerData?.filterValue?.eventRegion?.split(",")||[];
    if(singleTrackerData?.filterValues?.locationIds){
      const ids = Object?.keys(singleTrackerData?.filterValues?.locationIds);
      setLocations(ids);
      // setLocalFilter("locationIds", ids.join(","))
      // console.log(ids);
    }else setLocations("");
    if(singleTrackerData.id){
    fetchNote(singleTrackerData?.id)
  fetchSavedEvent(singleTrackerData?.id)
    }
    console.log(singleTrackerData.id);
    
  }
  }, [singleTrackerData]);
  const fetchNote=async(id:string)=>{
    const result= await getNotesFromTracker(id,`limit=1&offset=0`)
    
    if(result && result.comments?.length > 0){
      setNote(result?.comments);
    }else 
    setNote(null);
    
  }
  const fetchSavedEvent=async(id:string)=>{
    const result = await getSavedEvents(id, `limit=2&offset=0`) as { events: EventTableType[]; count: number }
    console.log(result);
    
    if(result && result?.count>0){
      setSavedEvents(result);
    }else setSavedEvents(undefined);
  }
  const setContextData=(id:string | undefined)=>{
    GAEvent(
      "trackers",
      "Trackers",
      "Saved Tracker | Any Filter Applied",
      "View"
    );
    setIsNewCall(true); 
    setTrackerId(id);
  }
  const hideTemplates = useCallback((val: boolean) => {
    if (!val) {
      setMultipleFilters({
        showTemplates: (!val).toString(),
        id: "",
        q: ""
      });
    } else {
      setMultipleFilters({
        skip: skip,
        q: searchValue,
        showTemplates: "",
      });
    }
  }, [isData]);
  useEffect(()=>{
    setHideTemplate(!getFilterValue("showTemplates"))
  },[searchParam])
  useEffect(()=>{ 
    if(isEventeli){
      if((singleTrackerData?.groupedEventsCount?.business?.total??0)>0) setActiveType("business");
      else setActiveType("social");
    }else{
      if((singleTrackerData?.groupedEventsCount?.active??0)>0){
        console.log(singleTrackerData?.groupedEventsCount?.active);
        
        setActiveType("active");
      }else {
        setActiveType("past");
      }
    }
  },[singleTrackerData])
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
    <>{isLoading ? <Loading /> : (
      <div>
    {isData &&
      <div className="flex flex-row">
  <div className="w-1/2 h-[calc(100vh-67px)]">
    <div className="flex flex-col gap-4 px-5 py-0">
      <div className="text-md text-[var(--secondary-text-color)] pt-5 mb-[-18px]">
        {/* Create trackers that help you keep updated to quickly view the type of events that are impacting your business around these locations. */}
        Bookmarked events and tracker lists you have created.
      </div>
      <div>
      {/* <Button className="text-white w-[100px]" onClick={()=>hideTemplates(false)}>Create</Button> */}
      </div>
      {/* <button
        className="w-[160px] text-white font-bold py-2 px-4 rounded text-sm"
        style={{ background: "var(--primary-color)" }} 
      >
        Create Tracker
      </button> */}
      <Link href={`/internal/trackers/savedevents?view=table`}>
      <div className="rounded-lg border relative hover:shadow-md transition-all duration-200 group overflow-hidden flex justify-between p-3 items-center bg-[var(--background-secondary-color)]">
        Bookmarked Events 
        <MoveUpRight width={16} height={16}/>
      </div>
      </Link>
      <hr/>
      {/* <div className="border border-[var(--border-color)] rounded px-3 py-2 flex items-center gap-2">
            <MagnifyingGlass color="#9CA3AF" width="18px" height="18px" />
            <input
              className="outline-none w-full bg-[var(--primary-foreground)]"
              placeholder="Enter tracker name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div> */}
    </div>
    <div >
          <MyTracker setDataPresent={setDataPresent} dataPresent={dataPresent} isData={isData} setSingleTrackerData={setSingleTrackerData} singleTrackerData={singleTrackerData} searchValue={searchValue} trackerId={singleTrackerData?.id || ""} hideTemplates={hideTemplates} setSearchValue={setSearchValue}/>
      </div>
  </div>
  <div className="w-1/2 p-5 h-[calc(100vh-67px)] bg-[var(--background-secondary-color)]" style={{padding:"20px 0px"}}>
    <div className="flex flex-col gap-4">
  <div className="flex items-center justify-between border border-[var(--border-color)] p-3" style={{margin:"0px 32px"}}>
          <span className="flex items-center gap-2 text-[#696B83]">
           {singleTrackerData?.name}
          </span>
          {dataPresent ? (
            <Link
            href={`/internal/trackers/${singleTrackerData?.id}/trackedEvents?type=${singleTrackerData?.type}&view=table&eventType=${isEventeli? "social" :"active"}`}
            onClick={() => setContextData(singleTrackerData?.id)}
            >
            <Button className="text-white">View Detail</Button>
            </Link>
            ) : (
            <Button disabled className="text-white">
            View Detail
            </Button>
          )}
        </div>
        <div className="flex h-[calc(100vh-175px)] overflow-y-auto flex-col px-8 gap-4">
  {/* <div className="flex w-[45%] items-stretch">
    <div className="flex flex-col w-[100%] gap-3">
    <div className="w-[100%]">
      <Image src={Calendar} alt="Calendar" style={{width:"100%"}}/>
    </div>
    <div>
      <AnalyticWidget/>
    </div>
    </div>
  </div> */}
  
  {/* <div className="relative w-full h-full flex justify-center">
    <Image 
      src={TrackerLocation} 
      alt="trackerLocation"  
    />
  </div> */}
   <div>
   {/* {load ? (
      <Loading />
    ) : ( */}
    <Suspense
  fallback={
    <div className="h-[300px] w-[100%] items-center justify-center">
      <Loading />
    </div>
  }
>
  <div className="h-[300px]">
    {(!singleTrackerData &&  searchValue.length<3) ? (
        <Loading />
    ) : !singleTrackerData?<NullState image={TrackerNullState}  title="No tracker selected."/> : (
      // <NullState image={TrackerNullState}  title="Some issue with map view."/>
      <Map
        isGlobal={true}
        source="tracker"
        eventType={activeType}
        searchParams="active"
        trackerId={singleTrackerData?.id || ""}
        trackerLoc={(locations?.length > 0 && locations?.join(",")) || ""}
        trackerType={singleTrackerData?.type || ""}
      />
    )}
  </div>

</Suspense>

    {/* )} */}

  </div>
  {/* <div className="flex flex-row gap-3">
  
 
        <div className="flex w-1/2 items-stretch flex-col gap-2 border rounded-[12px] p-4 border-[var(--border-color)] bg-[var(--primary-foreground)]">
          <div className="flex h-[100%] justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-[var(--primary-color)] font-medium">
              Predicted Attendance
            </div>
            <div className="font-semibold text-[var(--secondary-text-color)]">
              123
            </div>
          </div>
          <div className="flex items-center max-w-20">
          <Image src={PredictedAttendance} alt="predictedAttendance" />
          </div>
        </div>
        </div>
        <div className="flex w-1/2 items-stretch flex-col gap-2 border rounded-[12px] p-4 border-[var(--border-color)] bg-[var(--primary-foreground)]">
          <div className="flex h-[100%] justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-[var(--primary-color)] font-medium">
              Predicted Spend
            </div>
            <div className="font-semibold text-[var(--secondary-text-color)]">
              123
            </div>
          </div>
          <div className="flex items-center max-w-20">
          <Image src={PredictedSpend} alt="predictedSpend" />
          </div>
        </div>
        </div>
  </div> */}
  <div className="flex flex-row gap-3">
  <div className="flex w-1/2 items-stretch" onClick={()=>setContextData(singleTrackerData?.id)}>
    <SavedEventWidget savedEvents={savedEvents} redirectUrl={singleTrackerData 
    ?`${currentUrl}/${singleTrackerData?.id}/trackedEvents?type=${singleTrackerData?.type}&view=table&eventType=bookmarked`:""}/>
  </div>
  <div className="flex w-1/2 items-stretch" onClick={()=>setContextData(singleTrackerData?.id)}>
  <NotesDiscussionWidget 
  note={note} 
  redirectUrl={singleTrackerData 
    ? `${currentUrl}/${singleTrackerData.id}/notesDiscussion?type=${singleTrackerData.type}` 
    : ''} 
  />
  </div>
        </div>
        <div className="flex flex-row gap-3 mb-6">
          <div className="flex w-1/2 items-stretch">
            <NotificationWidget/>
          </div>
          <div className="flex w-1/2 items-stretch" onClick={()=>setContextData(singleTrackerData?.id)}>
          <CardWidgitConfig heading={"Manage Access"} content={"Manage access to your event tracker with customizable permissions and controls to view and edit."} imgUrl={AccessBackground} redirectUrl={singleTrackerData?`${currentUrl}/${singleTrackerData?.id}/manageAccess?type=${singleTrackerData?.type}`:""}/>
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 border border-[#EBEBEB] bg-[var(--primary-foreground)] p-4 mb-8">
        <Text>Want to know more about your location insights?</Text>
        <span className="flex items-center gap-2">
          <InformationFill width="14px" height="14px" />
          <Text color="secondary" variant="noMargin">
            Check out the event trends or search for events happening in your
            location to know more
          </Text>
        </span>
        <span className="flex gap-2">
        <Link 
         href={`/internal/trackers/${singleTrackerData?.id}/trackedEvents?type=${singleTrackerData?.type}&view=table&eventType=${isEventeli ? "social" : "active"}`}
          onClick={() => setContextData(singleTrackerData?.id)}
        >
        <Button variant="secondary">
          View Detail
        </Button>
        </Link>
        <Link 
         href={`/internal/trends`}
          >
          <Button
            variant="secondary"
            // href={genLocationQuery(location, "/trends")}
          >
            Explore Trends
          </Button>
          </Link>
          
        </span>
      </div> */}
        </div>
       

        {/* <div className="flex gap-4">
        <div className="flex w-1/2 items-stretch">
        <CardWidgitNote heading={"Saved Event"} content={"136 Events"} updatedDate={"3 Sep 2024 5:30 pm IST"} imgUrl={BookmarkBackground} redirectUrl={`${currentUrl}/${singleTrackerData?.id}/savedEvents?type=${singleTrackerData?.type}`}/>
        </div>
        <div className="flex w-1/2 items-stretch">
        <CardWidgitNote heading={"Notes & Discussions"} content={"9 New Messages"} updatedDate={"3 Sep 2024 5:30 pm IST"} imgUrl={NotesBackground}/>
        </div>
   
  </div>
  <div className="flex gap-4">
        <div className="flex w-1/2 items-stretch">
        <CardWidgitConfig heading={"Configurations"} content={"Manage your tracker configurations using our configurable filters, tailored to your specific needs."} imgUrl={ConfigBackground}/>
        </div>
        <div className="flex w-1/2 items-stretch">
        <CardWidgitConfig heading={"Manage Access"} content={"Manage access to your event tracker with customizable permissions and controls to view and edit."} imgUrl={AccessBackground}/>
        </div>
        </div> */}
  </div>
 
  </div>
</div>}
{(!hideTemplate || !isData)&& (
        <div className="absolute sm:left-[63px] left-[0px] top-[67px] bg-[var(--primary-foreground)] flex right-0 h-[calc(100vh-67px)]" style={{zIndex:"11"}}>
        <Templates isData={isData} hideTemplates={hideTemplates}/>
        </div>
      )
    }
      </div>
    )}</>

  );
};

export default Trackers;
