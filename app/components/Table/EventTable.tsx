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
import ZeroState from "@/components/zerostate";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { ApiError } from "@/types/api";
import { useIntent } from "@/hooks/useIntent";
import { useTrackerContext } from "@/context/tracker";
import { useTrackerServices } from "@/services/trackerServices";
import { Show } from "@/types/events/dto/event-query.dto";
import { useFilterContext } from "@/context/filterContext";
import BulkActionPopover from "./BulkActionPopover";
import { useConfiguration } from "@/hooks/useConfiguration";
import { Button } from "@/components/ui/button";
interface EventTableProps {
  trackerId?: string;
  source?: string;
  eventType?: string;
  view?: string;
  showCheckBox?: boolean;
}
const EventTable = ({
  source,
  trackerId,
  eventType,
  view,
  showCheckBox,
}: EventTableProps) => {
  // const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters, setFilter } =
    useFilterState();
  const { createUserEventInterest, isLoading: isSubmitting } =
  useIntent.createUserEventInterest();
  const {removeBookmark}=useTrackerServices();
  const [isChecked,setIsChecked]=useState<boolean>(false);
  const [totalChecked,setTotalChecked] =useState<string[]>([]);
  const bulkOption=["Attend","Speak"]
  const { localFilters } = useFilterContext();
  const { data, setSavedEventCount, savedEventCount } = useTrackerContext();
  const [interest, setInterest] = useState<any>();
  const [eventId, setEventId] = useState();
  const [action,setAction] = useState();
  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error: isConfigError,
  } = useConfiguration.interest();
  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  delete query.show;
  console.log(trackerId);
  let events, totalEvents, isLoading, error;
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>();
  if (source === "tracker") {
    ({ events, totalEvents, isLoading, error } = useTrackerEvents.list(
      query,
      trackerId,
      view
    ));
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
  console.log(eventType);
  
  const actions = [
    ...interestConfiguration?.interest || [],
    // ...([{ label: "Bookmark", status: "BOOKMARK" }])
    ...(eventType!=="bookmarked" ? [{ label: "Bookmark", status: "BOOKMARK" }] : [{ label: "Un-Bookmark", status: "UN-BOOKMARK" }]),
  ];
  useEffect(() => {
    if (actions.length > 0 && !action) {
      setAction(actions[0]);
    }
  }, [actions]);
  const bulkSubmit = async () => {
    try {
      if (eventType === "bookmarked") {
  
        const bookmarkPromises = totalChecked.map(id => {
          console.log(id);
          
          const unBookmarkEvent = events.find(event => event.basic.id === id);
          console.log(unBookmarkEvent);
          
          const response=removeBookmark(unBookmarkEvent?.interests?.bookmark?.interestId);
          if (response?.interest && setInterest) {
            setInterest({
              [response.interest.toLowerCase()]: {
                interestId: response.id,
              },
            });
          }
        });
  
        await Promise.all(bookmarkPromises);
      } else {
        const interestPromises = totalChecked.map(id =>
          createUserEventInterest(
            {
              eventId: id,
              interest: action?.status,
              sourceModule: "TRACKER",
              ...(trackerId && { sourceId: trackerId }),
            },
            {
              onSuccess: (response: any) => {
                if (response?.interest) {
                  setInterest(prev => ({
                    ...prev,
                    [response.interest.toLowerCase()]: {
                      interestId: response.id,
                    },
                  }));
                }
                if (response?.eventId && setEventId) {
                  setEventId(response?.eventId);
                }
                setSavedEventCount(prev => prev + 1);
              },
              onError: (error) => {
                console.error("Error while submitting interest:", error);
              },
            }
          )
        );
  
        await Promise.all(interestPromises);
      }
  
      // toast({ title: "Success", description: "Done!", variant: "default" });
    } catch (error) {
      console.error("Error in bulk submission:", error);
      // toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };
  
  
  
  
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
      setTotalChecked([]);
      setIsChecked(false);
      setUpdatedEvents(events);
    }
  }, [events]);
  const handleCheckboxChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const isChecked=event.target.checked
    setIsChecked(isChecked)
    if(isChecked){
      const resultId=events.map((event)=> event.basic.id)
      setTotalChecked(resultId);
    }else{
      setTotalChecked([]);
    }
  }
  useEffect(() => {
    if (!events) return;

    setUpdatedEvents((prevEvents) => {
      let newEvents = prevEvents ? [...prevEvents] : [...events];

      if (query.eventType === "bookmarked") {
        newEvents = newEvents.filter(
          (event: Event) => event.basic.id !== eventId
        );
        console.log(newEvents);
        
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

  console.log(events); // Now it will print correctly

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      limit: newItemsPerPage,
    });
  };

  if (isLoading) {
    return <Loading className="h-24 text-primary" />;
  }

  if (error) {
    if (source === "tracker") {
      return (
        <NullState
          image={TrackerNullState}
          title={(error as ApiError).message}
        />
      );
    } else return <ZeroState text={(error as ApiError).message} />;
  }

  if (events.length === 0) {
    if (source === "tracker") {
      if (query.eventType === "bookmarked") {
        return (
          <NullState
            image={TrackerNullState}
            title="No events bookmared yet! Start bookmarking events to easily track and revisit them here."
          />
        );
      } else
        return (
          <NullState
            image={TrackerNullState}
            title="We couldn't find any events matching your tracker criteria at the moment."
            text="Try adjusting your filters or checking back later, as new events are added frequently."
            buttonText="Manage Configurations"
            buttonUrl={`/internal/trackers/${trackerId}/editTracker?type=${query.type}`}
          />
        );
    } else return <ZeroState text="No events found" />;
  }
  
  
  
  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 pl-4 pb-2" style={{ height: showCheckBox ? "50px" : "auto" }}>
      <div className="flex items-center gap-4">
      {showCheckBox &&
      <div className="flex gap-2">
      <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
      <div>Select events to perform action</div>
      </div>
      }
      {showCheckBox &&
      <div className="flex min-w-[130px]">
      <BulkActionPopover options={actions} action={action} setAction={setAction}/>
      </div>
      }
      </div>
      <div>
      {totalChecked.length>0 &&
      <Button
      type="submit"
      className="w-30 self-center"
      disabled={isLoading}
      onClick={()=>bulkSubmit()}
      >
      Submit
      </Button>
      }
      </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-md border bg-background">
        <div className={`${view === "global" ? "h-[calc(100vh-165px)]" : "h-[calc(100vh-210px)]"} overflow-auto`}>
          <Table>
            <EventTableHeader show={showValues} type={query.type} view={query.eventType} localFilters={localFilters}/>
            <TableBody className="overflow-auto">
              {updatedEvents && updatedEvents.map((event: Event) => (
                <EventTableRow
                  totalChecked={totalChecked}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  setTotalChecked={setTotalChecked}
                  showCheckBox={showCheckBox}
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
