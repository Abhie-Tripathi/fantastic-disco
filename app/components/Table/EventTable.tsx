import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PaginationComponent } from "@/components/pagination";
import { Event } from "@/types/events";
import { EventTableRow } from "./EventTableRow";
import { useEvents } from "@/hooks/useEvents";
import { useTrackerEvents } from "@/hooks/useTrackerEvents";
import { EventTableHeader } from "./EventTableHeader";
import { useFilterState } from "@/hooks/useFilterState";
import Loading from "@/components/ui/Loading";
import ZeroState from "@/app/components/zerostate";
import NullState from "@/app/components/trackers/nullState";
import trackerNullState from "@/public/trackerNullState.svg";
import { ApiError } from "@/types/api";
import { useIntent } from "@/hooks/useIntent";
import { useTrackerContext } from "@/context/tracker";
import { useTrackerServices } from "@/services/trackerServices";
import { Show } from "@/types/events/dto/event-query.dto";
import { useFilterContext } from "@/context/filterContext";
import BulkActionPopover from "./BulkActionPopover";
import { useConfiguration } from "@/hooks/useConfiguration";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import CustomTrackerNullState from "../internal/trackers/Filters/customTrackerNullState";
import { useTransition } from "@/context/transition";
import { useIntelData } from "@/hooks/useIntelData";
import { intelScore } from "@/types/trackers";
import { useBulkActions } from "@/hooks/useBulkAction";
import { useToast } from "@/hooks/use-toast";
import { useSafeFilterContext } from "@/hooks/useSafeFilterContext";
interface EventTableProps {
  trackerId?: string;
  source?: string;
  eventType?: string;
  view?: string;
  showCheckBox?: boolean;
  setShowCheckBox?: Dispatch<SetStateAction<boolean>>;
  eventsData?:{
    count: number,
    events: Event[]
  }
}
const EventTable = ({
  source,
  trackerId,
  eventType,
  view,
  showCheckBox,
  setShowCheckBox,
  eventsData
}: EventTableProps) => {
  const pathName = usePathname();
  // const { theme } = useTheme();
type InterestKey = string;

type InterestState = {
  [key in InterestKey]?: string;
};

const [selectedInterestMap, setSelectedInterestMap] = useState<Map<string, InterestState>>(new Map());

  const { searchParams, getFilterValue, setMultipleFilters, setFilter } =
    useFilterState();
  const { createUserEventInterest, isLoading: isSubmitting } = 
    source === "public"
      ? { createUserEventInterest: () => Promise.resolve(), isLoading: false }
      : useIntent.createUserEventInterest();
  const { removeBookmark } = useTrackerServices();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [totalChecked, setTotalChecked] = useState<string[]>([]);
  const bulkOption = ["Attend", "Speak"];
   const { toast } = useToast();
  const { inTransition } = useTransition();
  const { localFilters } = useSafeFilterContext();
  const { data, editTrue } = useTrackerContext();
  const [interest, setInterest] = useState();
  const [eventId, setEventId] = useState();
  const [action, setAction] = useState<{ label: string; status: string } | undefined>({status:"", label: "None"});

  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error: isConfigError,
  } = source === "public"
    ? { interestConfiguration: null, isLoading: false, error: null }
    : useConfiguration.interest();
  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  delete query.show;
  let events: Event[] | undefined; 
  let totalEvents:number | undefined; 
  let isLoading, error, isFetching;
  if(source==="public"){
    totalEvents = eventsData?.count
    events=eventsData?.events;
  }
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>();

  const sourceModule = pathName.includes("trackers")
    ? "TRACKER"
    : pathName === "/internal/search/events"
    ? "RESEARCH"
    : "";
  if (source === "tracker") {
    ({ events, totalEvents, isLoading, error, isFetching } =
      useTrackerEvents.list(query, trackerId, view));
  } else if(source !== "tracker" && source !=="public") {
    ({ events, totalEvents, isLoading, error } = useEvents.list(query));
  }
  const bulkActions = useBulkActions({
      removeBookmark,
      createUserEventInterest,
    });
    const { executeBulkAction, isLoading: isBulkActionLoading } =
      source === "public"
        ? { executeBulkAction: () => Promise.resolve(), isLoading: false }
        : bulkActions;
   const {
     intelScoreData,
     loading: intelLoading,
     error: intelError,
   } = useIntelData(
         trackerId || "",
         (events && events?.length > 0) ? events : [],
         query.eventType,
         query.type
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
    economicImpact: "economicImpact"
  };
  let showsData: string[] = [];
  Object.entries(mapping).forEach(([key, value]) => {
    if (data?.filterValues?.show?.includes(key)) {
      showsData.push(value);
    }
  });
  const trackerMaturity = data?.filterValues?.maturity
  const locationIds =  Object?.keys(data?.filterValues?.locationIds || {});

  // console.log(show.join(","));
  // if(showsData.length>0){
  //   setLocalFilter("show",showsData?.join(","))
  // setFilter("show",showsData?.join(","));
  // }

  const actions = [
    ...(interestConfiguration?.interest || []),
    ...[{ label: "Bookmark", status: "BOOKMARK" }],
    ...[{ label: "Un Bookmark", status: "UN BOOKMARK" }],
    // ...(eventType !== "bookmarked"
    //   ? [{ label: "Bookmark", status: "BOOKMARK" }]
    //   : [{ label: "Un-Bookmark", status: "UN-BOOKMARK" }]),
  ];

  useEffect(() => {
    if (actions.length > 0 && !action) {
      setAction({status:"", label: "None"}); 
    }
  }, [actions]);
const handleBulkSubmit = async () => {
  try {
    await executeBulkAction(
      {
        action,
        selectedInterestMap,
        updatedEvents,
        totalChecked,
        sourceModule,
        trackerId
      },
      {
        setInterest,
        setUpdatedEvents: setUpdatedEvents as (value: Event[] | ((prev: Event[]) => Event[])) => void,
        setSelectedInterestMap,
        setShowCheckBox,
        setTotalChecked,
        onSuccess: () => {
          // Optional success handling
          toast({ title: "Success", description: "Bulk action completed" })
          setSelectedInterestMap(new Map());
        },
        onError: (error) => {
          console.error("Bulk action failed:", error);
        }
      }
    );
  } catch (error) {
    console.error("Error in bulk submission:", error);
  }
};


  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil((totalEvents || 0) / itemsPerPage);
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
    if (events && events?.length > 0) {
      // setTotalChecked([]);
      setIsChecked(false);
      setUpdatedEvents(events);
    }
  }, [events]);
  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      const resultId = events?.map((event) => event.basic.id);
      if(resultId)
      setTotalChecked(resultId);
    } else {
      setTotalChecked([]);
    }
    setIsChecked(checked);
  };
function mapInterestsToInterestIds(
  interests?: Record<string, { interestId?: string }>
): Record<string, string | undefined> {
  // Create initial result object with all possible interest keys from actions
  const result = actions.reduce((acc, action) => {
    const key = action.status.toLowerCase();
    acc[key] = undefined;
    return acc;
  }, {} as Record<string, string | undefined>);

  if (!interests) return result;

  // Map existing interests to the result
  Object.keys(interests).forEach((key) => {
    const normalizedKey = key.toLowerCase();
    if (normalizedKey in result) {
      result[normalizedKey] = interests[key]?.interestId;
    }
  });

  return result;
}


  function toggleSelection(id: string, event:any) {
    setTotalChecked((prev) => {
      if (prev.includes(id)) {
        // Remove the id
        return prev.filter((eventId) => eventId !== id);
      } else {
        // Add the id
        return [...prev, id];
      }
    });
    setSelectedInterestMap(prev => {
    const newMap = new Map(prev);

    if (newMap.has(id)) {
      newMap.delete(id); // unchecking
    } else {
      const interestBooleans = mapInterestsToInterestIds(event.interests);
      newMap.set(id, interestBooleans); // checking
    }

    return newMap;
  });
  }

 function handleSelectAll(checked: boolean) {
  const newIds = updatedEvents?.map((event) => event.basic.id) || [];

  if (checked) {
    setTotalChecked((prev) => [...prev, ...newIds]);

    setSelectedInterestMap((prev) => {
      const newMap = new Map(prev);

      updatedEvents?.forEach((event) => {
        const id = event.basic.id;
        const interestState = mapInterestsToInterestIds(event.interests);
        newMap.set(id, interestState);
      });

      return newMap;
    });
  } else {
    setTotalChecked((prev) =>
      prev.filter((eventId) => !newIds.includes(eventId))
    );

    setSelectedInterestMap((prev) => {
      const newMap = new Map(prev);
      newIds.forEach((id) => newMap.delete(id));
      return newMap;
    });
  }
}


  const isAllChecked = useMemo(() => {
    return (
      updatedEvents &&
      updatedEvents.length > 0 &&
      updatedEvents.every((event) => totalChecked.includes(event.basic.id))
    );
  }, [totalChecked, updatedEvents]);

  useEffect(() => {
    if(source!=="public"){
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
    }
  }, [eventId, interest]);

  function handleCancel() {
    setIsChecked(false);
    setShowCheckBox?.(false);
    setTotalChecked([]);
    setSelectedInterestMap(new Map());
  }

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
        <ZeroState
        text={(error as ApiError).message}
        errorStatusCode={(error as ApiError)?.statusCode}
      />
      );
    } else
      return error.message == "Location is required" ? (
        <div className="p-6">
          <CustomTrackerNullState />
        </div>
      ) : (
        <ZeroState
          text={(error as ApiError).message}
          errorStatusCode={(error as ApiError)?.statusCode}
        />
      );
  }
  
  if (
    searchParams.size === 0 ||
    (searchParams.size == 1 && searchParams.has("view") && source!=="tracker")
  ) {
    return (
      <div className="p-6">
        <CustomTrackerNullState />
      </div>
    );
  }

  if (events?.length === 0) {
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
      <div
        className="flex items-center justify-between gap-4 pl-4 pb-2"
        style={{ height: showCheckBox ? "50px" : "auto" }}
      >
        <div className="flex items-center gap-2">
          {showCheckBox && (
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={isAllChecked}
                onCheckedChange={handleSelectAll}
              />
              <div>Select events to perform action</div>
              <span className="-ml-[5px] pt-[2px] text-[var(--secondary-text-color)] text-[12px]">{selectedInterestMap.size>0 && `(${selectedInterestMap.size} Selected)`}</span>
            </div>
          )}
          {showCheckBox && (
            <div className="flex min-w-[130px]">
              <BulkActionPopover
                options={actions}
                action={action}
                setAction={setAction}
              />
            </div>
          )}
        </div>
        <div>
          {showCheckBox && (
            <div className="flex gap-4">
              <Button
                type="submit"
                className="w-30 self-center"
                disabled={isBulkActionLoading || totalChecked.length === 0}
                onClick={handleBulkSubmit}
              >
                {isBulkActionLoading ? (
                  <>
                    Processing...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
              <Button
                variant={"outline"}
                type="button"
                className="w-30 self-center text-destructive"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
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
              locationIds = {locationIds}
              type={query.type}
              view={query.eventType}
              localFilters={localFilters || {}}
              trackerMaturity={trackerMaturity}
              source={source}
            />
            <TableBody className="overflow-auto">
              {updatedEvents &&
                updatedEvents.map((event: Event) => (
                  <EventTableRow
                  source={source}
                    toggleSelection={toggleSelection}
                    totalChecked={totalChecked}
                    isChecked={isChecked}
                    setIsChecked={setIsChecked}
                    setTotalChecked={setTotalChecked}
                    showCheckBox={showCheckBox}
                    global={view}
                    locationIds = {locationIds}
                    view={query.eventType}
                    trackerMaturity={trackerMaturity}
                    setEventId={setEventId}
                    setInterest={setInterest}
                    type={query.type}
                    key={event.basic.id}
                    event={event}
                    show={showValues}
                    localFilters={localFilters || {}}
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

      {totalPages > 0 && (
        <div className="sticky bottom-0 bg-background py-3 border-t">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            count={totalEvents || 0}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default EventTable;