"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.style.module.css";
import Link from "next/link";
import { Suspense, lazy } from "react";
import MoreIcon from "/public/dots.svg";
import Back from "/public/back.svg";
import BookmarkBackground from '@/public/BookmarkBackground.svg'
import NotesBackground from "@/public/NotesBackground.svg"
import AccessBackground from '@/public/AccessBackground.svg'
import ConfigBackground from '@/public/ConfigBackground.svg'
import {
  InformationFill,
  Location,
  MagnifyingGlass,
  PencilEdit,
} from "geist-icons";
import {EventTableType } from '@/types/ListViewTable';
import SavedEventWidget from "@/app/components/internal/trackers/SavedEventWidget";
import NotesDiscussionWidget from "@/app/components/internal/trackers/NotesDiscussionWidget";
import NotificationWidget from "@/app/components/internal/trackers/NotificationWidget";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from '@/public/trackerNullState.svg';
import Calendar from '@/public/internal/calendar.svg'
import TrackerLocation from '@/public/internal/location.svg'
import Table from "@/app/components/Table";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
import { baseUrl } from "@/constants";
import Add from "/public/add.svg";
import { myFetch } from "@/utils/myFetch";
import Image from "next/image";
import Expand from "/public/expand_more.svg";
import Template from "/public/template.svg";
import People from "/public/ionPeople.svg";
import PeopleFinder from "/public/peopleFinder.svg";
import Competitor from "/public/competitor.svg";
import Speaking from "/public/speaking.svg";
import Audience from "/public/audience.svg";
import Customer from "/public/customer.svg";
import Keywords from "/public/keywords.svg";
import SocialCause from "/public/socialCause.svg";
import Brand from "/public/brand.svg";
import Vector1 from "/public/vectorTemplate.svg";
import MyTracker from "@/app/components/internal/trackers/MyTrackers";
import Loading from "@/app/components/UI/Loading";
import { Button } from "@/components/ui/button";
import data from '@/components/templateData'
const Map = lazy(() => import("@/components/map"));
function AllTrackers({ fillColor }: { fillColor: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="11"
      viewBox="0 0 18 11"
      fill={fillColor}
    >
      <path
        d="M3 6.5H15C15.55 6.5 16 6.05 16 5.5C16 4.95 15.55 4.5 15 4.5H3C2.45 4.5 2 4.95 2 5.5C2 6.05 2.45 6.5 3 6.5ZM1 10.5H13C13.55 10.5 14 10.05 14 9.5C14 8.95 13.55 8.5 13 8.5H1C0.45 8.5 0 8.95 0 9.5C0 10.05 0.45 10.5 1 10.5ZM4 1.5C4 2.05 4.45 2.5 5 2.5H17C17.55 2.5 18 2.05 18 1.5C18 0.95 17.55 0.5 17 0.5H5C4.45 0.5 4 0.95 4 1.5Z"
        fill={fillColor}
      />
    </svg>
  );
}
function CustomeTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.4668 4.5C4.4668 3.94188 4.57673 3.38923 4.79031 2.87359C5.00389 2.35796 5.31694 1.88945 5.71159 1.4948C6.10624 1.10015 6.57476 0.787094 7.09039 0.573512C7.60603 0.359929 8.15868 0.25 8.7168 0.25C9.27491 0.25 9.82757 0.359929 10.3432 0.573512C10.8588 0.787094 11.3274 1.10015 11.722 1.4948C12.1166 1.88945 12.4297 2.35796 12.6433 2.87359C12.8569 3.38923 12.9668 3.94188 12.9668 4.5C12.9668 5.62717 12.519 6.70817 11.722 7.5052C10.925 8.30223 9.84397 8.75 8.7168 8.75C7.58963 8.75 6.50862 8.30223 5.71159 7.5052C4.91456 6.70817 4.4668 5.62717 4.4668 4.5ZM8.7168 1.75C7.98745 1.75 7.28798 2.03973 6.77225 2.55546C6.25653 3.07118 5.9668 3.77065 5.9668 4.5C5.9668 5.22934 6.25653 5.92882 6.77225 6.44454C7.28798 6.96027 7.98745 7.25 8.7168 7.25C9.44614 7.25 10.1456 6.96027 10.6613 6.44454C11.1771 5.92882 11.4668 5.22934 11.4668 4.5C11.4668 3.77065 11.1771 3.07118 10.6613 2.55546C10.1456 2.03973 9.44614 1.75 8.7168 1.75ZM4.7168 11.75C4.12006 11.75 3.54776 11.9871 3.12581 12.409C2.70385 12.831 2.4668 13.4033 2.4668 14V15.188C2.4668 15.206 2.4798 15.222 2.4978 15.225C6.6168 15.897 10.8178 15.897 14.9358 15.225C14.9445 15.2236 14.9525 15.219 14.9582 15.2122C14.9639 15.2055 14.9669 15.1969 14.9668 15.188V14C14.9668 13.4033 14.7297 12.831 14.3078 12.409C13.8858 11.9871 13.3135 11.75 12.7168 11.75H12.3768C12.35 11.7498 12.3233 11.7538 12.2978 11.762L11.4328 12.045C9.66797 12.6212 7.76562 12.6212 6.0008 12.045L5.1348 11.762C5.10991 11.754 5.08393 11.75 5.0578 11.75H4.7168ZM0.966797 14C0.966797 13.0054 1.36189 12.0516 2.06515 11.3483C2.76841 10.6451 3.72223 10.25 4.7168 10.25H5.0568C5.2418 10.25 5.4258 10.28 5.6008 10.336L6.4668 10.619C7.92884 11.0962 9.50476 11.0962 10.9668 10.619L11.8328 10.336C12.0078 10.279 12.1918 10.25 12.3758 10.25H12.7168C13.7114 10.25 14.6652 10.6451 15.3684 11.3483C16.0717 12.0516 16.4668 13.0054 16.4668 14V15.188C16.4668 15.942 15.9208 16.584 15.1768 16.705C10.8984 17.4034 6.53515 17.4034 2.2568 16.705C1.89672 16.6464 1.56924 16.4616 1.33291 16.1837C1.09657 15.9057 0.966802 15.5528 0.966797 15.188V14Z"
        fill={fillColor}
      />
    </svg>
  );
}
function PremiumTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.16948 11.3996L7.03194 8.54316L4.7623 6.87691H7.5988L8.4668 3.99059L9.3359 6.87691H12.1713L9.89501 8.54206L10.7586 11.3996L8.4668 9.62595L6.16948 11.3996ZM2.93108 20.4616V13.1655C2.22989 12.4754 1.68555 11.6672 1.29805 10.7408C0.910547 9.81675 0.716797 8.82696 0.716797 7.77148C0.716797 5.61108 1.46818 3.7795 2.97094 2.27674C4.4737 0.773973 6.30565 0.022223 8.4668 0.0214849C10.6279 0.0207468 12.4599 0.772127 13.9627 2.27563C15.4654 3.77913 16.2168 5.61108 16.2168 7.77148C16.2168 8.82622 16.023 9.81638 15.6355 10.7419C15.248 11.6675 14.7037 12.4746 14.0025 13.1633V20.4593L8.4668 18.7986L2.93108 20.4616ZM8.4668 14.4143C10.312 14.4143 11.8805 13.7685 13.1722 12.4768C14.4638 11.1852 15.1097 9.61672 15.1097 7.77148C15.1097 5.92625 14.4638 4.35779 13.1722 3.06613C11.8805 1.77446 10.312 1.12863 8.4668 1.12863C6.62156 1.12863 5.05311 1.77446 3.76144 3.06613C2.46977 4.35779 1.82394 5.92625 1.82394 7.77148C1.82394 9.61672 2.46977 11.1852 3.76144 12.4768C5.05311 13.7685 6.62156 14.4143 8.4668 14.4143ZM4.03823 18.8916L8.4668 17.6505L12.8954 18.8916V14.0977C12.2783 14.5516 11.5923 14.9022 10.8372 15.1495C10.0836 15.3975 9.29346 15.5215 8.4668 15.5215C7.64013 15.5215 6.85 15.3979 6.0964 15.1506C5.34281 14.9033 4.65675 14.5524 4.03823 14.0977V18.8916Z"
        fill={fillColor}
      />
    </svg>
  );
}

function Bookmark({ fillColor }: { fillColor: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
    >
      <path
        d="M120-40v-640q0-33 23.5-56.5T200-760h400q33 0 56.5 23.5T680-680v640L400-160 120-40Zm80-122 200-86 200 86v-518H200v518Zm560 2v-680H240v-80h520q33 0 56.5 23.5T840-840v680h-80ZM200-680h400-400Z"
        fill={fillColor}
      />
    </svg>
  );
}
import { GAEvent } from "@/utils/GAEvent";
import { useTheme } from "@/context";
import { Step } from "react-joyride";
import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ShareWidget from "@/app/components/internal/trackers/ShareWidget";
import AnalyticWidget from "@/app/components/internal/trackers/AnalyticWidget";
import ShareModal from "@/app/components/internal/trackers/shareModal";
import CardWidgitConfig from "@/app/components/internal/trackers/CardWidgitConfig";
import { useTrackerServices } from "@/services/trackerServices";
import { useNotesServices } from "@/services/notesServices";
import { Tracker } from "@/types/trackers";
import { useTrackerContext } from "@/context/tracker";

interface Search {
  searchParams: {
    tab:string;
  }
}
const Trackers = ({ searchParams }: Search) => {
  const {tab}=searchParams;
  const {  setIsNewCall, setTrackerId, isLoading:load } = useTrackerContext();
  const router=useRouter();
  const [type, setType] = useState("");
  useEffect(()=>{
    if(tab==="savedEvents") setType("Saved Events")
    else if(tab==="customTrackers") setType("Custom Trackers")
    else setType("All Trackers")
  },[tab])
  const [locations, setLocations] = useState<any>();
  const [trackers, setTrackers] = useState<any[]>([]);
  const [searchValue,setSearchValue]=useState("");
  const [offset, setOffset] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const { data, error } = await myFetch(
  //       `${baseUrl}/tracker?limit=5&offset=${offset}`
  //     );
  //     console.log(data);
  //     if (error) {
  //       console.log(error);
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (data) {
  //       setTrackers((prevTrackers) => [...prevTrackers, ...data.trackerData]);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [offset]);
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
  const {getSavedEvents}=useTrackerServices();
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
  const [hideTemplate, setHideTemplate] = useState(true);
  const [dataPresent, setDataPresent] = useState(true);
  // useEffect(() => {
  //   if (dataPresent) setHideTemplate(false);
  //   console.log(dataPresent);
  // }, [dataPresent]);
  const [isData, setIsData] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(
        `${baseUrl}/tracker/exist`
      );
      if (data) setIsLoading(false)
      if (data.trackerExists) {
        // setHideTemplate(false);
        setIsData(true)
      }

    }

    fetchData();
  }, []);
  useEffect(() => {
    if(type){
    if(type==="All Trackers")
    router.push(`/internal/trackers?tab=allTrackers`);
    else if(type==="Custom Trackers")
      router.push(`/internal/trackers?tab=customTrackers`);
    else if(type==="Saved Events")
      router.push(`/internal/trackers?tab=savedEvents`)
    }
  }, [type]);
  
  
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
  const [savedEvents, setSavedEvents] = useState<{ result: EventTableType[]; count: number } | undefined>(undefined);

  console.log(singleTrackerData);
  useEffect(() => {
    // console.log(item?.tracker?.eventCountry);
    if(singleTrackerData===undefined){
      setNote(null);
      setSavedEvents(undefined);
    }
    else{
    const eventCountry = singleTrackerData?.filterValue?.eventCountry?.map((countryObj:{}) => Object.keys(countryObj)[0])||[];
    const eventState = singleTrackerData?.filterValue?.eventState?.map((stateObj:{}) => Object.keys(stateObj)[0])||[];
    const eventCity = singleTrackerData?.filterValue?.eventCity?.map((cityObj:{}) => Object.keys(cityObj)[0])||[];
    const eventZone=singleTrackerData?.filterValue?.eventRegion?.split(",")||[];
    const flattenedLocations = [...eventCountry, ...eventCity, ...eventZone, ...eventState];
    setLocations(flattenedLocations);
    if(singleTrackerData.id){
    fetchNote(singleTrackerData?.id)
  fetchSavedEvent(singleTrackerData?.id)
    }
    console.log(singleTrackerData.id);
    
  }
  }, [singleTrackerData]);
  console.log(hideTemplate);
  const fetchNote=async(id:string)=>{
    // const url =
    // `${baseUrl}/comment?stage=INTERNAL&entityType=TRACKER&entityId=${id}&offset=0&limit=1`;
    // const { data, error } = await myFetch(url);
    // if (data) {
    //   // setNotes([]);
    //   console.log(data);
    //   // setNotes(data.comments.reverse());
    //   if (data.comments?.length > 0){
    //     console.log(data);
        
    //     setNote(data.comments);
    //   }else setNote("");
    // }
    const result= await getNotesFromTracker(id,`limit=1&offset=0`)
    console.log(result);
    
    if(result && result.comments?.length > 0){
      setNote(result?.comments);
    }else 
    setNote(null);
    
  }
  const fetchSavedEvent=async(id:string)=>{
    // const url=`${baseUrl}/tracker/${id}/saved-events?limit=2&offset=0`
    // const { data, error } = await myFetch(url);
    // if (data) {
    //   // setNotes([]);
    //   console.log(data);
    //   // setNotes(data.comments.reverse());
    //   if (data?.count > 0){
    //     console.log(data);
        
    //     setSavedEvents(data);
    //   }else setSavedEvents("");
    // }
    const result:{result: EventTableType[], count: number} | undefined = await getSavedEvents(id, `limit=2&offset=0`);
    console.log(result);
    
    if(result && result?.count>0){
      setSavedEvents(result);
    }else setSavedEvents(undefined);
  }
  console.log(savedEvents);
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
  // console.log(searchValue);
  
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
  <div className="w-1/2 h-[calc(100vh-65px)]">
    <div className="flex flex-col gap-4 px-5 py-0">
      <div className="text-sm text-[var(--secondary-text-color)] pt-5">
        Create trackers that help you keep updated to quickly view the type of events that are impacting your business around these locations.
      </div>
      <div>
      <Button className="text-white" onClick={()=>setHideTemplate(false)}>Create Tracker</Button>
      </div>
      {/* <button
        className="w-[160px] text-white font-bold py-2 px-4 rounded text-sm"
        style={{ background: "var(--primary-color)" }} 
      >
        Create Tracker
      </button> */}
      {/* <hr/> */}
      <div className="border border-[var(--border-color)] rounded px-3 py-2 flex items-center gap-2">
            <MagnifyingGlass color="#9CA3AF" width="18px" height="18px" />
            <input
              className="outline-none w-full bg-[var(--primary-foreground)]"
              placeholder="Enter tracker name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
    </div>
    <div >
          <MyTracker setDataPresent={setDataPresent} dataPresent={dataPresent} isData={isData} setSingleTrackerData={setSingleTrackerData} singleTrackerData={singleTrackerData} searchValue={searchValue}/>
      </div>
  </div>
  <div className="w-1/2 p-5 h-[calc(100vh-65px)] bg-[var(--background-secondary-color)]" style={{padding:"20px 0px"}}>
    <div className="flex flex-col gap-4">
  <div className="flex items-center justify-between border border-[var(--border-color)] p-3" style={{margin:"0px 32px"}}>
          <span className="flex items-center gap-2 text-[#696B83]">
           {singleTrackerData?.name}
          </span>
          {dataPresent ? (
            <Link
            href={`/internal/trackers/${singleTrackerData?.id}/trackedEvents?type=${singleTrackerData?.type}&view=list&eventType=activeEvent`}
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
        <div className="flex h-[calc(100vh-168px)] overflow-y-auto flex-col px-8 gap-4">
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
    ) : Number(singleTrackerData?.groupedEventsCountByStatus?.groupedEventsByStatus?.active || 0) === 0 ? (
      <div className="px-10 py-5 h-[100%]" onClick={() => setContextData(singleTrackerData?.id)}>
        {!singleTrackerData?<NullState image={TrackerNullState}  title="No tracker selected."/>:
        <NullState image={TrackerNullState}  title="We couldn’t find any events matching your tracker criteria at the moment." text="Try adjusting your filters or checking back later, as new events are added frequently." buttonText="Manage Configuration" buttonUrl={`/internal/trackers/${singleTrackerData && singleTrackerData.id}/trackedConfiguration?type=${singleTrackerData &&  singleTrackerData.type}`}/>
        }
         
      </div>
    ) : (
      <Map
        isGlobal={true}
        source="tracker"
        searchParams="active"
        trackerId={singleTrackerData?.id || ""}
        trackerLoc={(locations?.length > 0 && locations?.join(",")) || ""}
      />
    )}
  </div>
</Suspense>

    {/* )} */}

  </div>
  <div className="flex flex-row gap-3">
  <div className="flex w-1/2 items-stretch" onClick={()=>setContextData(singleTrackerData?.id)}>
    <SavedEventWidget savedEvents={savedEvents} redirectUrl={singleTrackerData 
    ?`${currentUrl}/${singleTrackerData?.id}/trackedEvents?type=${singleTrackerData?.type}&view=list&eventType=savedEvent`:""}/>
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
        <div className="flex flex-row gap-3 mb-8">
          <div className="flex w-1/2 items-stretch">
            <NotificationWidget/>
          </div>
          <div className="flex w-1/2 items-stretch" onClick={()=>setContextData(singleTrackerData?.id)}>
          <CardWidgitConfig heading={"Manage Access"} content={"Manage access to your event tracker with customizable permissions and controls to view and edit."} imgUrl={AccessBackground} redirectUrl={singleTrackerData?`${currentUrl}/${singleTrackerData?.id}/manageAccess?type=${singleTrackerData?.type}`:""}/>
          </div>
        </div>
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
          <div className="absolute left-[63px] top-[65px] bg-[var(--primary-foreground)] flex right-0 h-[calc(100vh-65px)]" style={{zIndex:"11"}}>
            <div  style={{padding:"24px 14px",width:"100%", overflowY:"auto"}}>
          {!isData && <div className="flex items-center pb-6 !pl-14 text-lg text-[var(--secondary-text-color)] font-semibold">Explore trackers or create custom ones using advanced filters, enabling real-time monitoring of key events and informed decisions.</div>}
        {isData && 
            <button className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center"
        style={{ color: "var(--primary-color)" }} onClick={()=>setHideTemplate(true)}>
          <Image src={Back} alt="close" height={22} width={22} />
            Back
          </button>
        }
          <div className={`${styles.container}`}>
              {data.map((item, ind) => (
                <Link
                  href={`/internal/trackers/create?type=${item?.url}`}
                  key={ind}
                >
                  <div className="w-full p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px]">
                    <div className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                      <div className={styles.account}>
                        <Image src={item.img} alt="people" width={31} height={31} />
                      </div>
                      <div>
                        <Image src={Template} alt="template" />
                      </div>
                    </div>
                    <div className="w-full h-[60%] flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                      {item?.domain &&
                        <div
                      className="badge_primary"
                      style={{fontSize:"var(--font-size-label)", padding:"6px"}}
                    >
                      {item?.domain}
                    </div>
                      }
                      </div>
                      <div className="text-[16px] font-bold text-[var(--primary-color)]">
                        {item?.trackerName}
                      </div>
                      <div className="font-medium text-[var(--tertiary-text-color)]">
                        {item?.content}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className={styles.innerContainerOne}>
                <Image src={Add} alt="add" />
                <Link
                  href="/internal/trackers/create?type=CUSTOM"
                  className={styles.createUrl}
                >
                  <Button
                    // onClick={() => modalOpen()}
                    className="text-white"
                  >
                    Create Custom
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }
      </div>
    )}</>

  );
};

export default Trackers;
