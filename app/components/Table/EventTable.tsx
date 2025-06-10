import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PaginationComponent } from "@/components/pagination";
import { Event } from "@/types/events";
import { EventTableRow } from "./EventTableRow";
import { useEvents } from "@/hooks/useEvents";
import { useTrackerEvents } from "@/hooks/useTrackerEvents";
import { EventTableHeader } from "./EventTableHeader";
import { useFilterState } from "@/hooks/useFilterState";
import Loading from "@/components/ui/Loading";
import ZeroState from "@/app/components/zerostate"
import NullState from "@/app/components/trackers/nullState";
import trackerNullState from "@/public/trackerNullState.svg";
import { ApiError } from "@/types/api";
import { Show } from "@/types/events/dto/event-query.dto";
import { useTrackerContext } from "@/context/tracker";
import { useFilterContext } from "@/context/filterContext";
import CustomTrackerNullState from "../internal/trackers/Filters/customTrackerNullState";
import { useTransition } from "@/context/transition";
import { useTrackerServices } from "@/services/trackerServices";
import { useIntelData } from "@/hooks/useIntelData";
import { intelScore } from "@/types/trackers";
interface EventTableProps {
  trackerId?: string;
  source?: string;
  eventType?: string;
  view?: string;
}
const EventTable = ({
  source,
  trackerId,
  eventType,
  view,
}: EventTableProps) => {
  // const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters, setFilter } =
    useFilterState();
  const {inTransition} = useTransition()
  const { localFilters } = useFilterContext();
  const { data, editTrue } = useTrackerContext();
  const [interest, setInterest] = useState();
  const [eventId, setEventId] = useState();
  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  delete query.show;
  console.log(trackerId);
  let events, totalEvents, isLoading, error, isFetching;
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>();
  if (source === "tracker") {
    ({ events, totalEvents, isLoading, error, isFetching } =
      useTrackerEvents.list(query, trackerId, view));
  } else {
    ({ events, totalEvents, isLoading, error } = useEvents.list(query));
  }
  const {
      intelScoreData,
      loading: intelLoading,
      error: intelError,
    } = useIntelData(
      trackerId || "",
      events?.length > 0 ? events : [],
      eventType || ""
    );
  const mapping = {
    rating: "rating",
    maturity: "maturity",
    branded: "branded",
    series: "series",
    forecasted: "forecasted",
    frequency: "frequency",
    estimatedExhibitors: "estimatedExhibitors",
    scores: "scores",
    audienceZone: "audienceZone",
    rankings: "rankings",
  };
  let showsData: string[] = [];
  Object.entries(mapping).forEach(([key, value]) => {
    if (data?.filterValues?.show?.includes(key)) {
      showsData.push(value);
    }
  });
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
  let showValues: Show[] = getFilterValue("show")
    .split(",")
    .filter(Boolean)
    .map((show) => Show[show as keyof typeof Show]);
  if (source === "tracker") {
    showValues = showsData
      .filter(Boolean)
      .map((show) => Show[show as keyof typeof Show]);
  }
  const handlePageChange = (page: number) => {
    setMultipleFilters({
      offset: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };
  useEffect(() => {
    if (events?.length > 0) {
      setUpdatedEvents(events);
    }
  }, [events]);

  
  
  useEffect(() => {
    if (!events) return;

    setUpdatedEvents((prevEvents) => {
      let newEvents = prevEvents ? [...prevEvents] : [...events];

      if (
        query.eventType === "bookmarked" &&
        interest &&
        "bookmark" in interest
      ) {
        newEvents = newEvents.filter(
          (event: Event) => event.basic.id !== eventId
        );
      } else {
        newEvents = newEvents.map((event: Event) => {
          if (event.basic.id === eventId) {
            return {
              ...event,
              interests: interest
                ? (
                    Object.keys(interest) as Array<keyof typeof event.interests>
                  ).reduce(
                    (acc, key) => {
                      if (event.interests?.[key]) {
                        delete acc[key];
                      } else {
                        acc[key] = interest[key];
                      }
                      return acc;
                    },
                    { ...event.interests }
                  )
                : {},
            };
          }
          return event;
        });
      }

      return newEvents;
    });
  }, [eventId, interest]);

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      limit: newItemsPerPage,
    });
  };

  if (isLoading || isFetching || inTransition) {
    return <Loading className="h-24 text-primary" />;
  }

  if (error) {
    if (source === "tracker") {
      return (
        <NullState
          image={trackerNullState}
          title={(error as ApiError).message}
        />
      );
    } else return <ZeroState text={(error as ApiError).message} errorStatusCode={(error as ApiError)?.statusCode} />;
  }

  if (
    searchParams.size === 0 ||
    (searchParams.size == 1 && searchParams.has("view"))
  ) {
    return (
      <div className="p-6">
        <CustomTrackerNullState />;
      </div>
    );
  }

  if (events.length === 0) {
    if (source === "tracker") {
      if (query.eventType === "bookmarked") {
        return (
          <NullState
            image={trackerNullState}
            title="No events bookmared yet! Start bookmarking events to easily track and revisit them here."
          />
        );
      } else
        return (
          <NullState
            image={trackerNullState}
            title="We couldn't find any events matching your tracker criteria at the moment."
            text="Try adjusting your filters or checking back later, as new events are added frequently."
            buttonText="Manage Configurations"
            buttonUrl={`/internal/trackers/${trackerId}/editTracker?type=${query.type}`}
          />
        );
    } else
      return (
        <ZeroState text="No events found. Try expanding your preferences by selecting more categories, products, or topics." />
      );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex-1 overflow-hidden rounded-md border bg-background">
        <div
          className={`${
            view === "global"
              ? "h-[calc(100vh-165px)]"
              : "h-[calc(100vh-210px)]"
          } overflow-auto`}
        >
          <Table>
            <EventTableHeader
              show={showValues}
              type={query.type}
              view={query.eventType}
              localFilters={localFilters}
            />
            <TableBody className="overflow-auto">
              {updatedEvents && updatedEvents.map((event: Event) => (
                <EventTableRow
                  global={view}
                  view={query.eventType}
                  setEventId={setEventId}
                  setInterest={setInterest}
                  type={query.type}
                  key={event.basic.id}
                  event={event}
                  show={showValues}
                  localFilters={localFilters}
                  trackerId={trackerId}
                  intelLoading={intelLoading}
                  initialIntelScoreData={
                    intelScoreData?.trackerEventsIntelScore?.find(
                      (item: intelScore) => item?.event === event.basic.id
                    ) || null
                  }
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-background py-3 border-t">
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
