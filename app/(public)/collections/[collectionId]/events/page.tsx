// app/collections/[collectionId]/page.tsx
"use client"
// import Table from "@/app/components/Table/EventTable";
import { EventTableHeader } from "@/app/components/Table/EventTableHeader";
import { EventTableRow } from "@/app/components/Table/EventTableRow";
import NotFound from '@/app/not-found';
import styles from "@/app/(internal)/internal/trackers/[trackerId]/trackedEvents/trackedEvents.style.module.css";
import trackerNullState from "@/public/trackerNullState.svg";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { useTrackerServices } from '@/services/trackerServices';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import SideNav from "@/app/components/trackers/sideNav";
import { isEventeli } from "@/config";
import { useFilterState } from "@/hooks/useFilterState";
import Link from "next/link";
import { NotebookPen, Share2 } from "lucide-react";
import SortDropdown from "@/components/search/sortDropdown";
import BulkImport from "@/components/bulk-import";
import { PaginationComponent } from "@/components/pagination";
import NullState from "@/app/components/trackers/nullState";
import PublicEventTable from "@/app/components/Table/PublicEventTable";
export default function CollectionPage() {
  const params = useParams();
    const { setFilter } = useFilterState();
   const searchParams = useSearchParams();
  const typeOfEvent = searchParams.get("eventType");
  const [payload,setPayload]= useState();
  const [eventsData,setEventsData] = useState();
  const collectionId = params.collectionId;
  const [active, setActive] = useState(typeOfEvent);
  const [totalEvents,setTotalEvents] = useState(0)
  const [eventCount, setEventCount] = useState();
  const {getFilterValue, setMultipleFilters} =
      useFilterState();
  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
     const { presetData, createTracker, publicEvents } = useTrackerServices();
      const [isLoading, setIsLoading] = useState(true);
      const [presetTemplateData, setPresetTemplateData] = useState<PresetData>();
      const [fetchError,setFetchError] = useState(false);
      const fetchPresetJson = useCallback(async () => {
        // if (isLoading) return;
    
        setIsLoading(true);
    
        try {
          const data = {
            presetId: collectionId
          };
    
          const result = await presetData(data);
          
          if (result) {
            setPresetTemplateData(result?.trackers[0]);
          }
          else {
            return (
          <NotFound />
        );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setFetchError(true);
        } finally {
          // setIsLoading(false);
        }
      }, [presetData, isLoading]);
      useEffect(()=>{
        fetchPresetJson();
      },[])
  useEffect(() => {
      // setSavedEventCount(data?.tracker?.savedEventTotalCount);
      // console.log(data);
      const CountValues = {
        geo: ["social", "business", "unattended"],
        gtm: ["active", "past", "new"],
      };
      // createQueryString();
      if (isEventeli) {
        const transformedData = CountValues.geo.map((key) => {
          return {
            type: key.charAt(0).toUpperCase() + key.slice(1),
            totalCount: 10,
            newCount: 1,
          };
        });
  
        transformedData.push({
          type: "Bookmarked",
          totalCount:  0,
          newCount: 0,
        });
  
        setEventCount(transformedData);
      } else {
        // const groupedEventsCount =
        //   (data?.groupedEventsCount as Record<string, number>) || {};
  
        const transformedData = CountValues.gtm.map((key) => {
          return {
            type: key.charAt(0).toUpperCase() + key.slice(1),
            totalCount:  0,
            newCount:  0,
          };
        });
  
        transformedData.push({
          type: "Bookmarked",
          totalCount: 0,
          newCount: 0,
        });
        setEventCount(transformedData);
      }
  
    }, []);
    const addQueryString = (value: string) => {
    setFilter("eventType", value.toLowerCase());
  };
  const formatCount = (count: number) => {
    if (count >= 1000) {
      const value = count / 1000;
      const decimalPart = value - Math.floor(value);
      return `${Math.floor(value)}k`;
    }
    return count;
  };
  
  return (
    <div className="flex flex-col gap-3 md:gap-6 w-full">
     <SideNav name={presetTemplateData?.name} isPublic={true}/>
      
    <div className="px-8 flex flex-col gap-3 md:gap-6">
    {/* Collection ID: {collectionId} */}
    <div className="hidden md:flex bg-[var(--heading-background-color)] width-[100%] h-[65px] rounded-[12px] items-center justify-between px-[10px] py-[5px]">
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
                  {eventCount?.map((item, index) => (
                    <button
                      key={index}
                      className={`${styles.eventStatusBtn} ${
                        item.type.toLowerCase() === active ? styles.active : ""
                      }`}
                      onClick={() => {
                        // GAEvent("trackers", "Tracker Detail", "View", `${item.type} Events`);
                        // deleteFilter("skip")
                        setActive(item.type.toLowerCase());
                        addQueryString(item.type);
                      }}
                    >
                      {item.type} Events
                      {
                        <div className={styles.circle}>
                          
                           { formatCount(item.totalCount)}
                          
                        </div>
                      }
                    </button>
                  ))}
                </div>
                <div className="flex gap-2" >
                  <Button
                    variant="outline"
                    className="flex gap-1"
                    // onClick={() => setShare(!share)}
                    // ref={!isMobile?refs.shareRef:null}
                  >
                    <Share2 width={16} height={16} />
                    Share
                  </Button>
                  <Link
                    href={`#`}
                    onClick={() => {
                      // GAEvent(
                      //   "trackers",
                      //   "Tracker Detail",
                      //   "View",
                      //   "Notes and Discussion"
                      // );
                    }}
                    className="flex items-center"
                  >
                    <Button variant="outline" className="flex gap-1">
                      <NotebookPen width={16} height={16} />
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
                  <div>
                  <SortDropdown />
                  </div>
                  {/* {(view === "table" || view === "list")&&
                  <BulkImport
                    bulkActions={["Bulk Action", "Export"]}
                    setShowCheckBox={setShowCheckBox}
                    setShowExport={setShowExport}
                  />} */}
                </div>
              </div>
   
    <PublicEventTable  presetTemplateData={presetTemplateData} active={active}/>
    </div>
     </div>
  )
  
}