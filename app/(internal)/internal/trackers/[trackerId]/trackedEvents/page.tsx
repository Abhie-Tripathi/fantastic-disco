
"use client";
import React, { lazy, Suspense, useEffect, useState} from "react";
import Expand from "/public/expand_more.svg";
import Notes from "@/public/notes.svg"
import Image from "next/image";
import ExportModal from "@/app/components/Search/ExportModal";
import styles from "./trackedEvents.style.module.css";
import "chart.js/auto";
const Trackers = React.lazy(
  () => import("@/app/components/internal/trackers/CommonTrackerCard")
);
import Table from "@/app/components/Table";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { myFetch } from "@/utils/myFetch";
import { baseUrl} from "@/context";
import { GAEvent } from "@/utils/GAEvent";
import { Calendar, Globe, ListUnordered } from "geist-icons";
import { showToast } from "@/utils/showToast";
import Loading from "@/app/components/UI/Loading";
import Link from "next/link";
import { useTrackerServices } from "@/services/trackerServices";
import {Toggle} from "@/types/trackers"
import SideNav from "@/app/components/trackers/sideNav";
import { useTrackerContext } from "@/context/tracker";
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
const Page = ({ params }: { params: any }) => {
  console.log(params);
  const {data}=useTrackerContext();
  
  
  const pathname = usePathname();
  const {getTrackerDetail, error}=useTrackerServices();
  const [type, setType] = useState<string | undefined>();
  const [activeValue, setActiveValue] = useState();
  const [loading, setLoading] = useState(false);
  const [trackerDetail, setTrackerDetail] = useState<any>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [savedEventCount,setSavedEventCount]=useState<number>(0);
  const { trackerId } = params;
  const viewType=searchParams.get("view");
console.log(searchParams.get("view"));
  const typeOfEvent=searchParams.get("eventType");
  const [active, setActive] = useState(typeOfEvent==="savedEvent"?"Saved Events": typeOfEvent==="activeEvent"?"Active Events": typeOfEvent==="newEvent"?"New Events":typeOfEvent==="expiredEvent"?"Expired Events":"Active Events");
  // const id = pathName[pathName.length - 2];
  // console.log(active);
  // const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState("active");
  const [view, setView] = useState<string|null>(viewType==="list"? "list": viewType==="map"?"map":viewType==="calendar"?"calendar":"list");
  const [urlQueryString, setUrlQueryString] = useState<string>("");

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
    keywords:[]
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

  useEffect(() => {
    setSavedEventCount(data?.tracker?.savedEventTotalCount);
    setTrackerDetail(data?.tracker);
    // createQueryString();
    setLoading(true);
  }, [data]);
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
  useEffect(() => {
    console.log(activeValue);
  }, [active]);
  const formatCount = (count: number ) => {
    if (count >= 1000) {
      const value = count / 1000;
      const decimalPart = value - Math.floor(value);
        return `${Math.floor(value)}k`;
    }
    console.log(count);
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
  const createQueryString = () => {
    const filters = trackerDetail.filterValue;
    console.log(trackerDetail.filterValue);
    
    const queries: { [key: string]: any } = {};

    // if (filters?.eventCategory) {
    //   queries.eventCategory = filters.eventCategory?.map(
    //     (item: any) => item.id
    //   );
    // }

    // if (filters?.eventCountry) {
    //   queries.eventCountry = filters.eventCountry.map(
    //     (item: any) => Object.keys(item)[0]
    //   );
    // }

    // if (filters?.eventCity) {
    //   queries.eventCity = filters.eventCity.map(
    //     (item: any) => Object.keys(item)[0]
    //   );
    // }

    // if(filters?.eventRegion){
    //   queries.eventRegion = filters.eventRegion;
    // }

    // if (filters?.startDate) {
    //   queries.startDate = filters.startDate;
    // }

    // if (filters?.endDate) {
    //   queries.endDate = filters.endDate;
    // }

    // if (filters?.eventStatus) {
    //   queries.eventStatus = filters.eventStatus;
    // }

    // if (filters?.eventFormat) {
    //   queries.eventFormat = filters.eventFormat;
    // }

    // if (filters?.eventFrequency) {
    //   queries.eventFrequency = filters.eventFrequency;
    // }

    // if (filters?.editionRange) {
    //   queries.editionRange = filters.editionRange;
    // }

    // if(filters?.eventKeywords){
    //   queries.eventKeywords = filters.eventKeywords;
    // }

    // if (filters?.eventRank) {
    //   queries.eventRank = filters.eventRank;
    // }

    // if (filters?.localRank) {
    //   queries.localRank = filters.localRank;
    // }

    // if (filters?.trustScore) {
    //   queries.trustScore = filters.trustScore;
    // }

    // if (filters?.eventSeries) {
    //   queries.eventSeries = filters.eventSeries;
    // }

    // if (filters?.reputationScore) {
    //   queries.reputationScore = filters.reputationScore;
    // }

    // if (filters?.maturity) {
    //   queries.maturity = filters.maturity;
    // }

    // if (filters?.internationalScore) {
    //   queries.internationalScore = filters.internationalScore;
    // }

    // if (filters?.inboundScore) {
    //   queries.inboundScore = filters.inboundScore;
    // }

    // if (filters?.eventRating) {
    //   queries.eventRating = filters.eventRating;
    // }

    // if (filters?.eventSize) {
    //   queries.eventSize = filters.eventSize;
    // }
    if (trackerDetail.filterValue?.eventType) {
      queries.eventTypes = trackerDetail.filterValue.eventType.join(',');
    }
    if (trackerDetail.filterValue?.eventFormat) {
      queries.eventFormats = trackerDetail.filterValue.eventFormat;
    }
    if (trackerDetail.filterValue?.eventStatus) {
      queries.status = trackerDetail.filterValue.eventStatus;
    }
    if (trackerDetail.filterValue?.eventEntry) {
      queries.eventType = trackerDetail.filterValue.eventEntry;
    }
    if(trackerDetail.filterValue?.eventRating){
      queries.ratings = trackerDetail.filterValue.eventRating;
    }
    if(trackerDetail.filterValue?.maturity){
      queries.maturity = trackerDetail.filterValue?.maturity;
    }
    console.log(trackerDetail);
    
    let query = new URLSearchParams(queries);
    console.log(query.toString());
    
    const finalQueryString = query.toString();
    setUrlQueryString(finalQueryString);
  };
  useEffect(()=>{
    if(view==="map")
    createQueryString();
  },[view])
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
    if(toggleOpend?.rating===true){
      setShowInsights(prev=>({...prev, eventRating:true}));
    }
    if(trackerDetail?.filterValue?.eventKeywords?.length>0){
      const keywords=trackerDetail?.filterValue?.eventKeywords?.split('+');
      setShowInsights(prev=>({...prev, keywords:keywords}));
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
 console.log(data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.active
 );
 const addQueryString = (value:string) => {
  const params = new URLSearchParams(searchParams);
  params.set('eventType', value); 
  const newUrl = `${pathname}?${params.toString()}`;
  router.replace(newUrl);
};
const cityIds = trackerDetail?.filterValue?.locationIds?.city?.length > 0 
  ? trackerDetail.filterValue.locationIds.city.map(city => Object.keys(city)[0]) 
  : [];

const countryIds = trackerDetail?.filterValue?.locationIds?.country?.length > 0 
  ? trackerDetail.filterValue.locationIds.country.map(country => Object.keys(country)[0]) 
  : [];

const stateIds = trackerDetail?.filterValue?.locationIds?.state?.length > 0 
  ? trackerDetail.filterValue.locationIds.state.map(state => Object.keys(state)[0]) 
  : [];

const locationIds = [...cityIds, ...countryIds, ...stateIds];
console.log(locationIds);

 console.log(params);
 
  return (
    <div className="flex w-[calc(100vw-134px)]">
      {/* <SideNav/> */}
      <Suspense fallback={<p>Loading feed...</p>}>
        <div className="flex gap-5 mt-[54px] mb-[24px] flex-col w-[100%]">
          <div className="flex bg-[var(--heading-background-color)] width-[100%] h-[65px] rounded-[12px] items-center justify-between px-[10px] py-[5px]">
          {/* <div className={styles.new}></div> */}
            <div className="flex gap-2">
              <button
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
                  setActive("Active Events");
                  addQueryString("activeEvent");
                }}
              >
                Active Events
                {
                  <div className={styles.circle} style={{background: active==="Active Events"?"white":"", color: active==="Active Events"?"var(--primary-color)":""}}>
                    {loading ? (
                      formatCount(
                        data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.active
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
                  setActive("New Events");
                  addQueryString("newEvent");
                }}
              >
                New Events
                {
                  <div className={styles.circle}>
                    {loading ? (
                      formatCount(
                        data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.new
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
                  setActive("Expired Events");
                  addQueryString("expiredEvent");
                }}
              >
                Expired Events
                {
                  <div className={styles.circle}>
                    {loading ? (
                      formatCount(
                        data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.expired
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
                  setActive("Saved Events");
                  addQueryString("savedEvent");
                }}
              >
                Saved Events
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
              </button>
            </div>
            <Link href={`/internal/trackers/${trackerId}/notesDiscussion?type=${data?.tracker?.type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Notes and Discussion"
                )
              }}
            >
            <div className="flex text-[var(--secondary-text-color)] text-sm font-medium cursor-pointer gap-1">
            <Image src={Notes} alt="Notes"/>
            Notes and Discussion
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
            </div>
            </Link>
          </div>

          {view === "list" && (
            <div>
              <Suspense fallback={<Loading />}>
            <Table
              savedEventCount={savedEventCount}
              setSavedEventCount={setSavedEventCount}
              showInsights={showInsights}
              eventType={active}
              setActiveValue={setActiveValue}
            />
            </Suspense>
            </div>
          )}

          {view === "map" && (
            <div>
              <Suspense fallback={<Loading />}>
                <Map source="tracker" searchParams="categories=baby-kids%2Cautomotive&locationIds=226e11ef-32fc-5484-9843-7087fdfb413d%2C01ac0d6d-a090-591f-957f-66aece6b72fc&view=map&eventTypes=tradeshows%2Cconferences&eventFormats=offline%2Chybrid&active_gte=2024-11-01T00%3A00%3A00.000Z&active_lte=2025-10-31T00%3A00%3A00.000Z&status=active%2Ccancelled"
                trackerId={params.trackerId}
                locations={locationIds}
                 />
                {/* <Map/> */}
              </Suspense>
            </div>
          )}

          {view === "calendar" && (
            <div>
              <Suspense fallback={<Loading />}>
                <CalendarContainer queryString={urlQueryString} />
              </Suspense>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default Page;