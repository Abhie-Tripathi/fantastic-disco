
"use client";
import React, { lazy, Suspense, useEffect, useState} from "react";
import Expand from "/public/expand_more.svg";
import Notes from "@/public/notes.svg"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ExportModal from "@/app/components/Search/ExportModal";
import styles from "./trackedEvents.style.module.css";
import modalstyles from "@/app/components/internal/trackers/AllTrackers/allTrackers.style.module.css";
import "chart.js/auto";
import BulkImport from "@/components/bulk-import";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from '@/public/trackerNullState.svg';
const Trackers = React.lazy(
  () => import("@/app/components/internal/trackers/CommonTrackerCard")
);
import { TrackersAdapter } from "@/adapters/trackerAdapter";
import { useQuery } from "@tanstack/react-query";
import List from "@/components/search/list";
import Table from "@/app/components/Table/EventTable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { myFetch } from "@/utils/myFetch";
import { baseUrl} from "@/context";
import { GAEvent } from "@/utils/GAEvent";
import { Calendar, Globe, ListUnordered } from "geist-icons";
import { showToast } from "@/utils/showToast";
import Loading from "@/app/components/UI/Loading";
import {
  CalendarMonthEventsResponse,
  CalendarWeekEventsResponse,
  Event,
  // EventsResponse,
  MapEventsResponse,
} from "@/types/events";
import ShareModal from '@/app/components/internal/trackers/shareModal'
import Link from "next/link";
import { useTrackerServices } from "@/services/trackerServices";
import {Toggle} from "@/types/trackers"
import SideNav from "@/app/components/trackers/sideNav";
import { useTrackerContext } from "@/context/tracker";
import ZeroState from "@/components/zerostate";
import { ApiError } from "@/types/api";
import { useFilterState } from "@/hooks/useFilterState";
import EventCalendar from "@/components/eventCalendar";
import { isEventeli } from "@/config";
import SortDropdown from "@/components/search/sortDropdown";
import {NotebookPen, Share2} from "lucide-react";
const CalendarContainer = lazy(
  () => import("@/app/components/employee/calendarcontainer/CalendarContainer")
);
const Map = lazy(() => import("@/components/map"));
// interface Toggle{
//   rating?:boolean;
//   exhibit?:boolean;
//   trust?:boolean;
//   maturity?: boolean;
//   brandedEvent?: boolean;
//   eventSeries?: boolean;
//   forecastedStatus?: boolean;
//   impactScore?: boolean;
//   inboundScore?: boolean;
//   internationalScore?: boolean;
//   eventRank?: boolean;
//   audienceZone?: boolean;
//   audienceSpread?: boolean;
//   globalToggle?:boolean;
//   brandSeries?:boolean;
// }
interface LocationObject  { [id: string]: string };
const Page = ({ params }: { params: any }) => {
  const {data, savedEventCount, setIsNewCall, editTrue}=useTrackerContext();
  // console.log(data);
  const [share,setShare]=useState(false);
  const pathname = usePathname();
  const {getCalendarViewEvents,getTrackerEvents, getSavedEvents} = useTrackerServices();
  const {adaptParams}=TrackersAdapter;
  const {getFilterValue, setFilter} = useFilterState();
  const [type, setType] = useState<string | undefined>();
  const [activeValue, setActiveValue] = useState();
  const [loading, setLoading] = useState(false);
  const [trackerDetail, setTrackerDetail] = useState<any>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = Object.fromEntries(searchParams.entries());
  const token = searchParams.get("token");
  const [bulkActions,setBulkActions]=useState(["Take Action"])
  // const [savedEventCount,setSavedEventCount]=useState<number>(0);
  const { trackerId } = params;
  const viewType=searchParams.get("view");
  const skip= getFilterValue("skip") || "0";
  const take = getFilterValue("take") || "20";
  const typeOfEvent=searchParams.get("eventType");
  // const [active, setActive] = useState(typeOfEvent==="savedEvent"?"Saved Events": typeOfEvent==="activeEvent"?"Active Events": typeOfEvent==="newEvent"?"New Events":typeOfEvent==="expiredEvent"?"Expired Events":"Active Events");
  const [active, setActive] = useState(typeOfEvent);
  // const id = pathName[pathName.length - 2];
  // console.log(active);
  // const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState("active");
  const [view, setView] = useState<string | null>(
    ["table", "list", "map", "calendar"].includes(viewType || "") ? viewType : "table"
  );
  const [activeCount,setActiveCount]=useState<number>(0);
  useEffect(() => {
    if (editTrue)
      setIsNewCall(true);
  }, [editTrue])
  const [eventCount, setEventCount] = useState<{ type: string; totalCount: number; newCount: number }[]>([]);
  const [showCheckBox,setShowCheckBox]=useState<boolean>(false);
  const [urlQueryString, setUrlQueryString] = useState<string>("");
  const trackerType: string = searchParams.get("type") || "";
  const [sendInvite,setSendInvite]=useState(false);
  const [geoCoordinate,setGeoCoordinate]=useState<any>();
  const [showInsights,setShowInsights] = useState({
    eventSize: true,
    eventKeywords: true,
    global: false,
    reptSent: false,
    eventRank: false,
    matchScore: false,
    estExhibit: false,
    growth: false,
    repeatSent: false,
    trackerKeywords: true,
    eventRating:false, 
    eventFrequency:false,
    economicImpact:false,
    includeKeywords: '',
    excludeKeywords: '',
  });
  const lineData = {
    labels: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
    ],
    datasets: [
      {
        label: "First dataset",
        data: [33, 65, 44, 85, 44, 65, 78, 50, 60, 35, 28, 96, 54],
        fill: true,
        backgroundColor: "rgba(250, 117, 157, 0.15)",
        borderColor: "#FA759D",
        tension: 0.3,
      },
    ],
  };
  
  // useEffect(() => {
  //   const fetchTrackerDetail = async () => {
      
  //     try{
  //         const data= await getTrackerDetail(trackerId);
  //         console.log(data);
          
  //         if (data) {
  //           console.log(data);
            
  //           setTrackerDetail(data.tracker);
  //           setLoading(true);
  //         }
  //         if (error) {
  //           console.log(error);
  //           showToast("error", error.message);
  //           if (typeof window !== 'undefined') {
  //             router.push('/internal/trackers');
  //           } 
  //         }
  //     }catch(error){
  //         console.log(error); 
  //     }
  //   };
  //   fetchTrackerDetail();
  // }, [trackerId]);
  // useEffect(()=>{
  //     setFilter("skip","0")
  //     setFilter("take","10")
  // }, [active])
  // const {
  //   data: eventData,
  //   error,
  //   isLoading,
  //   refetch,const [sendInvite,setSendInvite]=useState(false);
  // } = useQuery<
  //   | CalendarMonthEventsResponse
  //   | CalendarWeekEventsResponse
  //   | Event
  //   | MapEventsResponse
  //   | undefined
  // >({
  //   queryKey: ["events", params, searchParams.toString()],
  //   queryFn: async () => {
  //      if(active==="Saved Events"){
  //       const savedEventsResponse = await getSavedEvents(
  //         trackerId, 
  //         `offset=${skip}&max=${take}`
  //       );
      
  //       return savedEventsResponse as Event | undefined;
  //       }
  //     else if (viewType === "list") {
  //       const trackerEventsResponse = await getTrackerEvents(
  //         query, trackerId
  //       ) ;
  //       return trackerEventsResponse  as Event | undefined;
  //     }
      
  //     return undefined; 
  //   },
  //   refetchOnWindowFocus: false,
  //   staleTime: 0,
  // });
  // const displayData = eventData;
  // console.log(displayData);

  // const events = (displayData?.events as Event[]) ?? [];
  // const count = (displayData?.count as number) ?? 0;
  useEffect(() => {
    // setSavedEventCount(data?.tracker?.savedEventTotalCount);
    setTrackerDetail(data?.tracker);
    // console.log(data);
    const CountValues = {
      geo : ['social','business','unattended'],
      gtm : ['active','past', 'new']
    }
    // createQueryString();
    if (isEventeli) {
      const transformedData =  CountValues.geo.map((key)=>{
        return {
          type: key.charAt(0).toUpperCase() + key.slice(1),
          totalCount :  data?.groupedEventsCount[key].total || 0,
          newCount : data?.groupedEventsCount[key].new || 0
        }
      })
    
      transformedData.push({
        type: "Bookmarked",
        totalCount: (savedEventCount as number) || 0,
        newCount: 0,
      });
    
      setEventCount(transformedData);
    } else {
      const groupedEventsCount = data?.groupedEventsCount as Record<string, number> || {};
    
      const transformedData =  CountValues.gtm.map((key)=>{
        return {
          type: key.charAt(0).toUpperCase() + key.slice(1),
          totalCount :  data?.groupedEventsCount[key] || 0,
          newCount : data?.groupedEventsCount[key]?.new || 0
        }
      })
    
      transformedData.push({
        type: "Bookmarked",
        totalCount: (savedEventCount as number) || 0,
        newCount: 0,
      });
    
      setEventCount(transformedData);
    }
    
    setLoading(true);
  }, [data, savedEventCount]);
  useEffect(()=>{
    if(editTrue) setLoading(false);
    else setLoading(true);
  },[editTrue])
  useEffect(()=>{
    const res = eventCount.find((count) => count.type.toLowerCase() === active);
    
    setActiveCount(res?.totalCount || 0);
    
  },[active, eventCount])
  // useEffect(()=>{
  //   if(typeOfEvent==="savedEvent") setActive("Saved Events");
  // },[typeOfEvent])
  useEffect(()=>{
    setView(searchParams.get("view"))
  },[searchParams.get("view")])
  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#45445994",
          font: {
            size: 8,
          },
        },
      },
      y: {
        beginAtZero: true,
        stepSize: 10,
        display: false,
      },
    },

    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  useEffect(() => {
    setOpen(true);
  }, []);
  // console.log(data);
  
  const [exp, setExp] = useState(false);
  const exportData = async () => {
    let dataToSend = {};
    if (active === "Active Events") {
      dataToSend = {
        type: "ACTIVE",
      };
    } else if (active === "New Events") {
      dataToSend = {
        type: "NEW",
      };
    } else {
      dataToSend = {
        type: "EXPIRED",
      };
    }
    try {
      const { data, error } = await myFetch(
        `${baseUrl}/tracker/${trackerId}/export`,
        {
          method: "POST",
          body: JSON.stringify(dataToSend),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data) {
        console.log(data);
      } else {
        console.log(error);
      }
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {
      // setIsSaving(false);
    }
  };
  useEffect(() => {
    if (active === "Active Events") setType("ACTIVE");
    if (active === "New Events") setType("NEW");
    if (active === "Expired Events") setType("EXPIRED");
  }, [active]);
  const formatCount = (count: number ) => {
    if (count >= 1000) {
      const value = count / 1000;
      const decimalPart = value - Math.floor(value);
        return `${Math.floor(value)}k`;
    }
    return count;
  };
  const saveTracker = async () => {
    const selectedEventCat = [
      "671b1a45-d40f-4559-959f-cd7a9b1617de",
      "4612db12-9084-4d61-901d-ab7bd3120ade",
    ];
    const formData = {
      name: "one",
      filterValue: {
        eventCategory: selectedEventCat.join(","),
      },
    };
    const { data, error } = await myFetch(`${baseUrl}/tracker`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      console.log(data);

      router.replace("/internal/trackers");
    }
  };
 useEffect(()=>{
  let toggleOpend:Toggle ={};
  if(trackerDetail?.filterValue?.userType)
  toggleOpend=JSON.parse(trackerDetail?.filterValue?.userType);
    if(trackerDetail?.filterValue?.internationalScore){
      setShowInsights(prev=>({...prev, global:true}));
    }
    if(trackerDetail?.filterValue?.reputationScore){
      setShowInsights(prev=>({...prev, reptSent:true}));
    }
    if(toggleOpend?.trust===true){
      setShowInsights(prev=>({...prev, repeatSent:true}));
    }
    if(toggleOpend?.exhibit===true){
      setShowInsights(prev=>({...prev, estExhibit:true}));
    }
    if(toggleOpend?.economicImpact===true){
      setShowInsights(prev=>({...prev, economicImpact:true}));
    }
    if(toggleOpend?.rating===true){
      setShowInsights(prev=>({...prev, eventRating:true}));
    }
    if(trackerDetail?.filterValue?.includeKeywords) {
      setShowInsights(prev=>({...prev, includeKeywords: trackerDetail?.filterValue?.includeKeywords}));
    }
    if(trackerDetail?.filterValue?.excludeKeywords) {
      setShowInsights(prev=>({...prev, excludeKeywords: trackerDetail?.filterValue?.excludeKeywords}));
    }
    if(trackerDetail?.filterValue) {
      const toggleObj = {
        maturity: (toggleOpend?.maturity ? true : false),
        brandedEvent: (toggleOpend?.brandSeries ? true : false),
        eventSeries: (toggleOpend?.brandSeries ? true : false),
        forecasted: (toggleOpend?.forecastedStatus ? true : false),
        impactScore: (toggleOpend?.globalToggle ? true : false),
        inboundScore: (toggleOpend?.globalToggle ? true : false),
        internationalScore: (toggleOpend?.globalToggle ? true : false),
        eventRank: (toggleOpend?.eventRank ? true : false),
        audienceZone: (toggleOpend?.audienceZone ? true : false),
        audienceSpread: (toggleOpend?.audienceSpread ? true : false),
        eventFrequency: (toggleOpend?.eventFrequency ? true : false),
      };
      setShowInsights(prev=>({...prev, ...toggleObj}));
    }
 },[trackerDetail])
 const addQueryString = (value:string) => {
  setFilter('eventType', value.toLowerCase());
};
  let trackerLoc: string[]=[];
  
  if(data?.filterValues?.locationIds){
    const ids = Object?.keys(data?.filterValues?.locationIds);
    // console.log(ids);
    
    trackerLoc=ids;
  }
  useEffect(() => {
    if(data?.filterValues?.viewBound){
      const ids = data?.filterValues?.viewBound;
      // console.log(ids);
      
      setGeoCoordinate(ids);
      // setLocalFilter("locationIds", ids.join(","))
      // console.log(ids);
    }else setGeoCoordinate({});
  },[data])
 
  useEffect(() => {
    const handlePopState = (event: any) => {
        if (event.state && event.state.shareOpen) {
            closeShareModal();
        } else if (share) {
            closeShareModal();
        }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
}, [share, sendInvite]);
const closeShareModal = () => {
if(share===true)
  setShare(false);

else if(sendInvite) setSendInvite(false);
  document.body.style.height = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
};
const closeModal = (e: any) => {
const targetElement = e.target;
if (targetElement.classList.contains(styles.shareModal)) {
    closeShareModal();
}
};
const shareFunction = () => {
if (!share) {
  window.history.pushState({ shareOpen: true }, '');
  setShare(true);
  document.body.style.height = '100vh';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
} else {
  closeShareModal();
}
};
// console.log(activeCount);

  return (
    <div className="flex w-[calc(100vw-134px)]">
    {/* <SideNav/> */}
    {/* {(isLoading && view==="list") && <Loading/>} */}
    <Suspense fallback={<p>Loading feed...</p>}>
      <div className="flex gap-2 mt-[54px] mb-[24px] flex-col w-[100%]">
        <div className="flex bg-[var(--heading-background-color)] width-[100%] h-[65px] rounded-[12px] items-center justify-between px-[10px] py-[5px]">
        {/* <div className={styles.new}></div> */}
          <div className="flex gap-2">
            {/* <button
               className={`${styles.eventStatusBtn} ${
                active === "Active Events" ? styles.active : ""
              }`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Active Events"
                );
                setFilter("skip","0");
                setActive("Active Events");
                addQueryString("activeEvent");
              }}
            >
              Active Events
              {
                <div className={styles.circle} style={{background: active==="Active Events"?"white":"", color: active==="Active Events"?"var(--primary-color)":""}}>
                  {loading ? (
                    formatCount(
                      data?.groupedEventsCount?.active
                    )
                  ) : (
                    <div className={styles.loader}></div>
                  )}
                </div>
              }
            </button>
            <button
             className={`${styles.eventStatusBtn} ${
              active === "New Events" ? styles.active : ""
            }`}
              onClick={() => {
                GAEvent("trackers", "Tracker Detail", "View", "New Events");
                // deleteFilter("skip")
                setActive("New Events");
                addQueryString("newEvent");
              }}
            >
              New Events
              {
                <div className={styles.circle}>
                  {loading ? (
                    formatCount(
                      data?.groupedEventsCount?.new
                    )
                  ) : (
                    <div className={styles.loader}></div>
                  )}
                </div>
              }
            </button>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "Expired Events" ? styles.active : ""
              }`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Expired Events"
                );
                // deleteFilter("skip")
                setActive("Expired Events");
                addQueryString("expiredEvent");
              }}
            >
              Past Events
              {
                <div className={styles.circle}>
                  {loading ? (
                    formatCount(
                      data?.groupedEventsCount?.past
                    )
                  ) : (
                    <div className={styles.loader}></div>
                  )}
                </div>
              }
            </button>
            <button
               className={`${styles.eventStatusBtn} ${
                active === "Saved Events" ? styles.active : ""
              }`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Active Events"
                );
                // deleteFilter("skip")
                setActive("Saved Events");
                addQueryString("savedEvent");
              }}
            >
              Bookmarked Events
              {
                <div className={styles.circle} style={{background: active==="Saved Events"?"white":"", color: active==="Saved Events"?"var(--primary-color)":""}}>
                  {loading ? (
                    formatCount(
                     savedEventCount                     
                    )
                  ) : (
                    <div className={styles.loader}></div>
                  )}
                </div>
              }
            </button> */}
            {eventCount?.map((item,index)=>(
               <button
               key={index}
               className={`${styles.eventStatusBtn} ${
                item.type.toLowerCase()===active ? styles.active : ""
              }`}
                onClick={() => {
                  GAEvent("trackers", "Tracker Detail", "View", "New Events");
                  // deleteFilter("skip")
                  setActive(item.type.toLowerCase());
                  addQueryString(item.type);
                }}
              >
               {item.type} Events
                {
                  <div className={styles.circle}>
                    {loading ? (
                      formatCount(
                        item.totalCount
                      )
                    ) : (
                      <div className={styles.loader}></div>
                    )}
                  </div>
                }
              </button>
            ))}
          </div>
          <div className="flex gap-2">
          <Button variant="outline" className="flex gap-1" onClick={()=>setShare(!share)}>
          <Share2 width={16} height={16}/>
          Share 
          </Button>
          <Link href={`/internal/trackers/${trackerId}/notesDiscussion?type=${data?.type}`}
            onClick={() => {
              GAEvent(
                "trackers",
                "Tracker Detail",
                "View",
                "Notes and Discussion"
              )
            }}
            className="flex items-center"
          >
          <Button variant="outline" className="flex gap-1">
          <NotebookPen width={16} height={16}/>
          Notes 
            {/* <ListUnordered
              height="16px"
              width="16px"
              color={
                view === "list" ? "#6750a4" : "var(--primary-text-color)"
              }
              onClick={() => setView("list")}
            />
            <Globe
            height="16px"
            width="16px"
              color={view === "map" ? "#6750a4" : "var(--primary-text-color)"}
              onClick={() => setView("map")}
            />
            <Calendar
            height="16px"
            width="16px"
              color={
                view === "calendar" ? "#6750a4" : "var(--primary-text-color)"
              }
              onClick={() => setView("calendar")}
            /> */}
          </Button>
          </Link>
          <SortDropdown />
          <BulkImport bulkActions={bulkActions} setShowCheckBox={setShowCheckBox}/>
          
          </div>
        </div>

        {(view === "table") && (
          <div className="flex-grow overflow-hidden">
            <Suspense fallback={<Loading />}>
          {/* <Table
            savedEventCount={savedEventCount}
            setSavedEventCount={setSavedEventCount}
            showInsights={showInsights}
            eventType={active}
            setActiveValue={setActiveValue}
            source="trackers"
          /> */}
          <Table source="tracker" trackerId={trackerId} eventType={active || ""} showCheckBox={showCheckBox}/>
          </Suspense>
          </div>
        )}
        {view === "list" && (
  <div className="flex-grow overflow-hidden">
    {/* {isLoading ? (
      <div className="px-10 py-5">
      <Loading />
      </div>
    ) : error ? (
      <div className="px-10 py-5">
      <NullState 
          image={TrackerNullState}  title={(error as ApiError).message} />
          </div>
    ) : count === 0 ? (
      active === "Saved Events" ? (
        <NullState 
          image={TrackerNullState} 
          title="No events saved yet! Start saving events to easily track and revisit them here." 
        />
      ) : (
        <NullState 
          image={TrackerNullState}
          title="We couldn’t find any events matching your tracker criteria at the moment."
          text="Try adjusting your filters or checking back later, as new events are added frequently."
          buttonText="Manage Configuration"
          buttonUrl={`/internal/trackers/${trackerId}/trackedConfiguration?type=${trackerType}`}
        />
      )
    ) : ( */}
      <>
        {/* <Alerts /> */}
        <List source="tracker" trackerId={params.trackerId} showCheckBox={showCheckBox} eventType={active || ""}/>
      </>
    {/* )} */}
  </div>
)}

        {(view === "map") && (
            <div>
              <Suspense fallback={<Loading />}>
              {(Number(activeCount)===0 && active==="bookmarked")?
              <div className="px-10 py-5">
                <NullState image={TrackerNullState} title="No events saved yet! Start saving events to easily track and revisit them here."/>
              </div>
               : 
                <Map source="tracker" 
                searchParams={`${active==="Active Events"? "active": active==="Expired Events"?"past":active==="New Events"?"":active==="Saved Events"?"saved":"active"}`}
                trackerId={params.trackerId}
                trackerGeoCordinates={geoCoordinate}
                trackerLoc={trackerLoc.join(",")}
                trackerType={trackerType}
                eventType={active || ""}
                 />
                } 
                {/* <Map/> */}
              </Suspense>
            </div>
          )}
        {/* {(view === "calendar" ) && (
            <div>
              <Suspense fallback={<Loading />}>
              {isLoading ? (
            <Loading />
          ) : eventData?.count == 0 ? (
            <NullState image={TrackerNullState} title="We couldn’t find any events matching your tracker criteria at the moment." text="Try adjusting your filters or checking back later, as new events are added frequently." buttonText="Manage Congfigurations" buttonUrl={`/internal/trackers/${params.trackerId}/trackedConfiguration?type=${trackerDetail?.type}`}/>
          ) : error ? (
            <ZeroState text={(error as ApiError).message} />
          ) : (
            <EventCalendar
              type={`${active==="Active Events"? "active": active==="Expired Events"?"expired":active==="New Events"?"":active==="Saved Events"?"saved":"active"}`}
              source="tracker"
              trackerId={params.trackerId}
              events={events as CalendarEvent[] | CalendarMonthEvent[]}
            />
          )}
              </Suspense>
            </div>
          )} */}
        {view === "calendar" && (
          <div>
            <Suspense fallback={<Loading />}>
              <EventCalendar source={"tracker"} trackerId={trackerId} date={data?.tracker?.filterValue?.startDate} activeVal={activeCount}/>
            </Suspense>
          </div>
        )}
      </div>
      
    </Suspense>
    {share && (
                <div className={modalstyles.shareModal} onClick={closeModal}>
                    {share && 
        <div className={modalstyles.shareModal} onClick={closeModal}>
          <ShareModal closeShareModal={closeShareModal} share={share} setShare={setShare} shareFunction={shareFunction}/>
        </div>
        }
                </div>
            )}
  </div>
  );
};

export default Page;