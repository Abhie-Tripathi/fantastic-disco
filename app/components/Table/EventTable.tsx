import React from "react";
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
import NullState from "../trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { ApiError } from "@/types/api";
import { Show } from "@/types/events/dto/event-query.dto";
import { useTrackerContext } from "@/context/tracker";
import { useFilterContext } from "@/context/filterContext";
interface EventTableProps {
  trackerId?: string;
  source?: string;
  eventType?:string;
}
const EventTable = ({source, trackerId, eventType}:EventTableProps) => {
  // const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters, setFilter } = useFilterState();
  const {setLocalFilter} = useFilterContext();
  const {data} = useTrackerContext();
  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  console.log(trackerId);
  let events, totalEvents, isLoading, error;

  if (source === "tracker") {
  ({ events, totalEvents, isLoading, error } = useTrackerEvents.list(query, trackerId,eventType));
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
    rankings: "rankings,trustScore",
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

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      limit: newItemsPerPage,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ZeroState text={(error as ApiError).message} />;
  }

  if (events.length === 0) { 
    if(source==="tracker"){
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
console.log(isLoading);

  return (
    <div className="w-full">
      <div className="rounded-md border bg-background">
        <div className="overflow-auto max-h-[calc(100vh-198px)]">
          <Table>
            <EventTableHeader show={showValues} />
            <TableBody>
              {events.map((event: Event) => (
                <EventTableRow
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
