// app/collections/[collectionId]/page.tsx
"use client"
import TableView from "@/app/components/Table/EventTable";
import { PresetData } from '@/types/trackers';
import NotFound from '@/app/not-found';
import { Event } from "@/types/events";
import NullState from "@/app/components/trackers/nullState";
import styles from "@/app/(internal)/internal/trackers/[trackerId]/trackedEvents/trackedEvents.style.module.css";
import TrackerNullState from "@/public/trackerNullState.svg";
import { Button } from "@/components/ui/button";
import List from "@/components/search/list";
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
import { PublicEvents } from "@/types/trackers";
interface EventsData{
  count:number;
  events: Event[];
}
export default function CollectionPage() {
  const params = useParams();
    const { setFilter } = useFilterState();
   const searchParams = useSearchParams();
  const typeOfEvent = searchParams.get("eventType");
  const [payload,setPayload]= useState();
  const [eventsData, setEventsData] = useState<EventsData | null | undefined>(null);
  const collectionId = params.collectionId;
  const [active, setActive] = useState(typeOfEvent);
  const [totalEvents,setTotalEvents] = useState(0)
  const [eventCount, setEventCount] = useState<{ type: string; totalCount: number; newCount: number }[]>([]);
  const viewType = searchParams.get("view");
  const {getFilterValue, setMultipleFilters} =
      useFilterState();
  const [view, setView] = useState<string | null>(
          ["table", "list", "map", "calendar"].includes(viewType || "")
            ? viewType
            : "table"
        );
  useEffect(() => {
      setIsLoading(true);
      setView(searchParams.get("view"));
    }, [searchParams.get("view")]);
  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
     const { presetData, createTracker, publicEvents } = useTrackerServices();
      const [isLoading, setIsLoading] = useState(true);
      const [presetTemplateData, setPresetTemplateData] = useState<PresetData | null>(null);
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
  
        // transformedData.push({
        //   type: "Bookmarked",
        //   totalCount:  0,
        //   newCount: 0,
        // });
  
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
  
        // transformedData.push({
        //   type: "Bookmarked",
        //   totalCount: 0,
        //   newCount: 0,
        // });
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
  useEffect(()=>{
        setIsLoading(true);
        const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const orgName: string[] = [];
  const orgWebsite: string[] = [];

  presetTemplateData?.data?.organizations?.forEach((item:string) => {
    const value = item?.trim();
    if (!value) return;

    if (regex.test(value)) {
      orgWebsite.push(value);
    } else {
      orgName.push(value);
    }
  });
  const formData: PublicEvents = {};

// formData.name = presetTemplateData?.name;
if(presetTemplateData){
  
if (presetTemplateData?.trackerType?.includes("T_COMPETITOR")) {
  formData.searchByEntity = "company";
}
if(presetTemplateData?.trackerType?.includes("T_PRODUCT_KEYWORDS")){
  formData.searchByEntity = "keywords";
}
if(presetTemplateData?.trackerType?.includes("T_PEOPLE_FINDER")){
  formData.searchByEntity = "user";
}
if(presetTemplateData?.trackerType?.includes("T_SPEAKING_OPPORTUNITY")){
  formData.searchByEntity = "speaker"
}
formData.view = "list";
formData.trackerEventStatus = active || "active";
// Include conditional filter values
if (presetTemplateData?.data?.includeKeywords?.length > 0) {
  const updatedPositiveKeywords =presetTemplateData.data.includeKeywords.map((item:string)=>item.replaceAll(" ","_"))
  formData.includeKeywords = updatedPositiveKeywords.slice(0,100).join(",");
}

if (presetTemplateData?.data?.excludeKeywords?.length > 0) {
  const updatedNegativeKeywords =presetTemplateData.data.excludeKeywords.map((item:string)=>item.replaceAll(" ","_"))
  formData.excludeKeywords = updatedNegativeKeywords.slice(0,100).join(",");
}

if (presetTemplateData?.data?.userName?.length > 0) {
  formData.userName = presetTemplateData.data.userName.slice(0,100).join(",");
}

if (presetTemplateData?.data?.userOrgWebsite?.length > 0) {
  formData.userOrgWebsite = presetTemplateData.data.userOrgWebsite.slice(0,100).join(",");
}
if(active==="past"){
  const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const formatted = yesterday.toISOString().split('T')[0];
  formData.active_lte = formatted;
}
if(active==="active"){
  const today = new Date();
  const formatted = today.toISOString().split('T')[0];
  formData.active_gte = formatted;
}
if(active === "new"){
  const today = new Date();
  const formatted = today.toISOString().split('T')[0];
  formData.createdAt = formatted;
}
if (orgWebsite.length > 0) {
  formData.orgWebsite = orgWebsite.slice(0,100).join(",");
}
if (orgName.length > 0) {
  formData.orgName = orgName.slice(0,100).join(",");
}
formData.limit = searchParams.get("limit") || "10";
formData.offset = searchParams.get("offset") || "0";
// setPayload(formData);
getData(formData);
}
      },[presetTemplateData, active, currentPage, view])
    // useEffect(()=>{
    //     setIsLoading(true)
    //     getData(formData);
    // },[active, currentPage])
    const getData=async(formData: PublicEvents)=>{
    try{
      const response: EventsData | undefined = await publicEvents(formData)
    //  if(response){
    //   setIsLoading(false);
    //  }
     setTotalEvents(response?.count || 0);
     setEventsData(response);
     console.log(response);
    }catch(error){
        
    }finally{
      setIsLoading(false)
    }
     
     
  }
  return (
    <div className="flex flex-col gap-3 md:gap-6 w-full">
     <SideNav name={presetTemplateData?.name} isPublic={true}/>
      
    <div className="px-0 md:px-8 flex flex-col gap-3 md:gap-6">
    {/* Collection ID: {collectionId} */}
    <div className="hidden md:flex bg-[var(--heading-background-color)] width-[100%] h-[65px] rounded-[12px] items-center justify-between px-[10px] py-[5px]">
                {/* <div className={styles.new}></div> */}
                <div className="flex gap-2">
                  {eventCount?.map((item, index) => (
                    <button
                      key={index}
                      className={`${styles.eventStatusBtn} h-10 ${
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
                      {/* {
                        <div className={styles.circle}>
                          
                           { formatCount(item.totalCount)}
                          
                        </div>
                      } */}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2" >
                  <Link href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}>
                  <Button
                    variant="outline"
                    className="flex gap-1"
                    // onClick={() => setShare(!share)}
                    // ref={!isMobile?refs.shareRef:null}
                  >
                    <Share2 width={16} height={16} />
                    Share
                  </Button>
                  </Link>
                  <Link
                    href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
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
                  <Link href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}>
                  <SortDropdown />
                  </Link>
                  </div>
                  {/* {(view === "table" || view === "list")&&
                  <BulkImport
                    bulkActions={["Bulk Action", "Export"]}
                    setShowCheckBox={setShowCheckBox}
                    setShowExport={setShowExport}
                  />} */}
                </div>
              </div>
   
    {/* <PublicEventTable  presetTemplateData={presetTemplateData} active={active}/> */}
    {isLoading?<Loading/>:
    eventsData?.events.length===0?
    <NullState
                image={TrackerNullState}
                // title="We couldn't find any events matching your tracker criteria at the moment."
                text="No events found. Sign up to get personalized recommendations."
                buttonText="Sign Up"
                buttonUrl={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
              />
    :
    <>
    {(eventsData && view === "table") &&
      <TableView source="public" eventsData={eventsData}/>
    }
    {(eventsData && view === "list")&&
    <List source="public" eventsData={eventsData}/>}
    </>}
    </div>
     </div>
  )
  
}