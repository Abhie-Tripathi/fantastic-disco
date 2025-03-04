import React,{useEffect, useState} from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PaginationComponent } from "@/components/pagination";
import { Event } from "@/types/events";
import { EventTableRow } from "./EventTableRow";
import { useEvents } from "@/hooks/useEvents";
import {useTrackerEvents} from "@/hooks/useTrackerEvents";
import { EventTableHeader } from "./EventTableHeader";
import { useFilterState } from "@/hooks/useFilterState";
import Loading from "@/components/ui/Loading";
import ZeroState from "@/components/zerostate";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { ApiError } from "@/types/api";
import { Show } from "@/types/events/dto/event-query.dto";
import { useTrackerContext } from "@/context/tracker";
import { useFilterContext } from "@/context/filterContext";
interface EventTableProps {
  trackerId?: string;
  source?: string;
  eventType?:string;
  view?:string;
}
const EventTable = ({source, trackerId, eventType, view}:EventTableProps) => {
  // const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters, setFilter } = useFilterState();
  const {setLocalFilter} = useFilterContext();
  const {data} = useTrackerContext();
  const [interest, setInterest]=useState();
  const [eventId, setEventId] = useState();
  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  console.log(trackerId);
  let events, totalEvents, isLoading, error;

  if (source === "tracker") {
  ({ events, totalEvents, isLoading, error } = useTrackerEvents.list(query, trackerId, view));
  } else {
  ({ events, totalEvents, isLoading, error } = useEvents.list(query));
  }
  // console.log(isLoading);
  const mapping = {
    rating: "rating",
    maturity: "maturity",
    branded: "branded,series",
    forecasted: "forecasted",
    frequency: "frequency",
    estimatedExhibitors: "estimatedExhibitors",
    scores: "scores",
    audienceZone: "audienceZone",
    rankings: "rankings",
  }
  let showsData:string[] =[];
  Object.entries(mapping).forEach(([key,value])=>{
    if(data?.filterValues?.show?.includes(key)){
      showsData.push(value);
      
    }
  })
  // console.log(show.join(","));
  // if(showsData.length>0){
  //   setLocalFilter("show",showsData?.join(","))
  // setFilter("show",showsData?.join(","));
  // }
  // console.log(data.filterValues.show);
  
  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
  let  showValues: Show[] = getFilterValue("show")
    .split(",")
    .filter(Boolean)
    .map((show) => Show[show as keyof typeof Show]);
  if(source==="tracker"){
    showValues = showsData.filter(Boolean)
    .map((show) => Show[show as keyof typeof Show]);
  }
  const handlePageChange = (page: number) => {
    setMultipleFilters({
      offset: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>(events);
console.log(eventType);

useEffect(() => {
  if (!events) return;

  let newEvents = events;

  if (query.eventType === "bookmarked") {
    newEvents = events.filter((event: Event) => event.basic.id !== eventId);
  } else {
    newEvents = events.map((event: Event) => {
      if (event.basic.id === eventId) {
        return {
          ...event,
          interests: {
            ...event.interests,
            ...(interest
              ? Object.keys(interest).reduce((acc, key) => {
                  if (!event.interests?.hasOwnProperty(key)) {
                    acc[key] = interest[key];
                  }
                  return acc;
                }, {} as Record<string, any>)
              : {}),
          },
        };
      }
      return event;
    });
  }

  setUpdatedEvents(newEvents);
}, [eventId, interest, events]);
  
  console.log(updatedEvents); // Now it will print correctly
  
  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      limit: newItemsPerPage,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    if(source==="tracker"){
      return( <NullState
        image={TrackerNullState}
        title={(error as ApiError).message}
      />)
    }else 
    return <ZeroState text={(error as ApiError).message} />;
  }

  if (events.length === 0) { 
    if(source==="tracker"){
      if(query.eventType==="bookmarked"){
        return( <NullState
          image={TrackerNullState}
          title="No events saved yet! Start saving events to easily track and revisit them here."
        />)
      }else
      return( <NullState
      image={TrackerNullState}
      title="We couldn't find any events matching your tracker criteria at the moment."
      text="Try adjusting your filters or checking back later, as new events are added frequently."
      buttonText="Manage Configurations"
      buttonUrl={`/internal/trackers/${
        trackerId
      }/editTracker?type=${query.type}`}
    />)
    }else 
    return <ZeroState text="No events found" />;
  }
console.log(events);

  return (
    <div className="w-full">
      <div className="rounded-md border bg-background">
      <div className={`overflow-auto ${view === "global" ? "h-[calc(100vh-165px)]" : "max-h-[calc(100vh-264px)]"}`}>

          <Table>
            <EventTableHeader show={showValues} type={query.type} view={query.eventType}/>
            <TableBody>
              {updatedEvents.map((event: Event) => (
                <EventTableRow
                  view={query.eventType}
                  setEventId={setEventId}
                  setInterest={setInterest}
                  type={query.type}
                  key={event.basic.id}
                  event={event}
                  show={showValues}
                trackerId={trackerId} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-background py-3">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            count={totalEvents}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default EventTable;
