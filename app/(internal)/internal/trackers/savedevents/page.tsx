"use client"
import EventTable from "@/app/components/internal/trackers/EventTable/EventTable";
import React, {useState} from "react";
import styles from './savedevent.style.module.css'  
import { useQuery } from "@/hooks/useQuery";
import Table from "@/app/components/Table/EventTable";
import NavBar from "@/app/components/trackers/sideNav";
import List from "@/components/search/list";
import {useSearchParams} from "next/navigation";
import Loading from "@/app/components/UI/Loading";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from '@/public/trackerNullState.svg';
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerServices } from "@/services/trackerServices";

const SavedEvents = () => {
  // const pathName = usePathname();
  const {getFilterValue, setFilter} = useFilterState();
  const searchParams = useSearchParams();
  const skip= getFilterValue("skip") || "0";
  const take = getFilterValue("take") || "20";
  const viewType=searchParams.get("view");
  const {globalSavedEvents} = useTrackerServices();
  // const {
  //   data: eventData,
  //   error,
  //   isLoading,
  //   refetch,
  // } = useQuery<
  //    EventsResponse | undefined
  // >({
  //   queryKey: ["events", searchParams.toString()],
  //   queryFn: async () => {
  //     if(viewType==="list"){
  //       const trackerEventsResponse = await globalSavedEvents(
  //         `limit=${take}&offset=${skip}`
  //       ) ;
  //       return trackerEventsResponse  as EventsResponse | undefined;
  //     }else return undefined;
  //   },
  //   refetchOnWindowFocus: false,
  //   staleTime: 0,
  // });
  // const displayData = eventData;
  // const events = displayData?.events || [];
  // const count = displayData?.count || 0;
  
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
    includeKeywords: '',
    excludeKeywords: '',
  });
  
  return (
    <div className="flex-grow overflow-hidden w-[calc(100vw-134px)]">
      <NavBar/>
      <div className="flex gap-5 mt-[54px] flex-col w-[100%] pt-5">
      {viewType==="table" && 
      <div className="flex-grow overflow-hidden">
      <Table source="tracker" view="global"/>
      </div>
      }
      {viewType === "list" && (
        <List source="tracker" view="global"/>
      )}
      {/* {viewType === "list" && (
  isLoading ? (
    <div className="px-10 py-10">
      <Loading />
    </div>
  ) : error ? (
    <div className="px-10 py-10">
      <NullState 
        image={TrackerNullState} 
        title={(error).message} 
      />
    </div>
  ) : count === 0 ? (
    <div className="px-10 py-10">
      <NullState 
        image={TrackerNullState} 
        title="No events saved yet! Start saving events to easily track and revisit them here." 
      />
      </div>
    )  : (
    <List events={events as Event[]} count={count} />
  )
)} */}

      </div>
    </div>
  );
};

export default SavedEvents;