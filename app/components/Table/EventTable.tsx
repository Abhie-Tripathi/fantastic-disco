import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PaginationComponent } from "@/components/pagination";
import { Event } from "@/types/events";
import { EventTableRow } from "./EventTableRow";
import { useEvents } from "@/hooks/useEvents";
import { EventTableHeader } from "./EventTableHeader";
import { useFilterState } from "@/hooks/useFilterState";
import Loading from "@/components/ui/Loading";
import ZeroState from "@/components/zerostate";
import NullState from "../trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { ApiError } from "@/types/api";
import { Show } from "@/types/events/dto/event-query.dto";

const EventTable = ({source, trackerId}) => {
  // const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters } = useFilterState();

  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  console.log(trackerId);
  
  const { events, totalEvents, isLoading, error } = useEvents.list(query, source, trackerId);
  console.log(isLoading);
  
  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
  const showValues: Show[] = getFilterValue("show")
    .split(",")
    .filter(Boolean)
    .map((show) => Show[show as keyof typeof Show]);

  const handlePageChange = (page: number) => {
    setMultipleFilters({
      skip: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      skip: "0",
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
      // buttonUrl={`/internal/trackers/${
      //   path[path.length - 2]
      // }/trackedConfiguration?type=${type}`}
    />)
    }else 
    return <ZeroState text="No events found" />;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border bg-background">
        <div className="overflow-auto max-h-[calc(100vh-264px)]">
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
        <div className="sticky bottom-0 bg-background py-4">
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
