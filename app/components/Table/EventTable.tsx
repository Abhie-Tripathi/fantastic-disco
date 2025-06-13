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
interface EventTableProps {
  trackerId?: string;
  source?: string;
  eventType?: string;
  view?: string;
  showCheckBox?: boolean;
  setShowCheckBox?: Dispatch<SetStateAction<boolean>>;
}
const EventTable = ({
  source,
  trackerId,
  eventType,
  view,
  showCheckBox,
  setShowCheckBox,
}: EventTableProps) => {
  const pathName = usePathname();
  // const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters, setFilter } =
    useFilterState();
  const { createUserEventInterest, isLoading: isSubmitting } =
    useIntent.createUserEventInterest();
  const { removeBookmark } = useTrackerServices();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [totalChecked, setTotalChecked] = useState<string[]>([]);
  const bulkOption = ["Attend", "Speak"];
  const { inTransition } = useTransition();
  const { localFilters } = useFilterContext();
  const { data, editTrue } = useTrackerContext();
  const [interest, setInterest] = useState();
  const [eventId, setEventId] = useState();
  const [action, setAction] = useState();
  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error: isConfigError,
  } = useConfiguration.interest();
  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";
  delete query.show;
  let events, totalEvents, isLoading, error, isFetching;
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>();

  const sourceModule = pathName.includes("trackers")
    ? "TRACKER"
    : pathName === "/internal/search/events"
    ? "RESEARCH"
    : "";
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
  // if(showsData.length>0){
  //   setLocalFilter("show",showsData?.join(","))
  // setFilter("show",showsData?.join(","));
  // }

  const actions = [
    ...(interestConfiguration?.interest || []),
    ...[{ label: "Bookmark", status: "BOOKMARK" }],
    ...[{ label: "Un-Bookmark", status: "UN-BOOKMARK" }],
    // ...(eventType !== "bookmarked"
    //   ? [{ label: "Bookmark", status: "BOOKMARK" }]
    //   : [{ label: "Un-Bookmark", status: "UN-BOOKMARK" }]),
  ];
  useEffect(() => {
    if (actions.length > 0 && !action) {
      setAction(actions[0]);
    }
  }, [actions]);
  const bulkSubmit = async () => {
    try {
      let filteredIds = [];
      if (action.status === "UN-BOOKMARK") {
        filteredIds =
          updatedEvents
            ?.filter(
              (event) =>
                totalChecked.includes(event.basic.id) &&
                event.interests &&
                Object.keys(event.interests).includes("bookmark")
            )
            .map(
              (filteredEvent) => filteredEvent.interests?.bookmark?.interestId
            ) || [];
        const bookmarkPromises =
          filteredIds &&
          filteredIds.length > 0 &&
          filteredIds.map((id) => {
            const response = removeBookmark(id);
            if (response?.interest && setInterest) {
              setInterest({
                [response.interest.toLowerCase()]: {
                  interestId: response.id,
                },
              });
            }
            return response;
          });
        if (bookmarkPromises && bookmarkPromises.length > 0) {
          await Promise.all(bookmarkPromises);
        }
      } else {
        filteredIds =
          updatedEvents
            ?.filter(
              (event) =>
                totalChecked.includes(event.basic.id) &&
                ((event.interests &&
                  !Object.keys(event.interests).includes(
                    action.status.toLowerCase()
                  )) ||
                  event.interests === undefined)
            )
            .map((filteredEvent) => filteredEvent.basic.id) || [];

        const interestPromises = filteredIds.map((id) =>
          createUserEventInterest(
            {
              eventId: id,
              interest: action?.status,
              sourceModule: sourceModule,
              ...(trackerId && { sourceId: trackerId }),
            },
            {
              onSuccess: (response: any) => {
                if (response?.interest) {
                  setInterest((prev) => ({
                    ...prev,
                    [response.interest.toLowerCase()]: {
                      interestId: response.id,
                    },
                  }));
                }
                if (response?.eventId && setEventId) {
                  setEventId(response?.eventId);
                }
                setSavedEventCount((prev) => prev + 1);
              },
              onError: (error) => {
                console.error("Error while submitting interest:", error);
              },
            }
          )
        );
        await Promise.all(interestPromises);
      }
      setShowCheckBox?.(false);
      setTotalChecked([]);
      // toast({ title: "Success", description: "Done!", variant: "default" });
    } catch (error) {
      console.error("Error in bulk submission:", error);
      // toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  //  try {
  //     if (eventType === "bookmarked") {
  //       const bookmarkPromises = totalChecked.map((id) => {
  //         const unBookmarkEvent = events.find((event) => event.basic.id === id);

  //         const response = removeBookmark(
  //           unBookmarkEvent?.interests?.bookmark?.interestId
  //         );
  //         if (response?.interest && setInterest) {
  //           setInterest({
  //             [response.interest.toLowerCase()]: {
  //               interestId: response.id,
  //             },
  //           });
  //         }
  //       });

  //       await Promise.all(bookmarkPromises);
  //     } else {
  //       const interestPromises = totalChecked.map((id) =>
  //         createUserEventInterest(
  //           {
  //             eventId: id,
  //             interest: action?.status,
  //             sourceModule: sourceModule,
  //             ...(trackerId && { sourceId: trackerId }),
  //           },
  //           {
  //             onSuccess: (response: any) => {
  //               if (response?.interest) {
  //                 setInterest((prev) => ({
  //                   ...prev,
  //                   [response.interest.toLowerCase()]: {
  //                     interestId: response.id,
  //                   },
  //                 }));
  //               }
  //               if (response?.eventId && setEventId) {
  //                 setEventId(response?.eventId);
  //               }
  //               setSavedEventCount((prev) => prev + 1);
  //             },
  //             onError: (error) => {
  //               console.error("Error while submitting interest:", error);
  //             },
  //           }
  //         )
  //       );

  //       await Promise.all(interestPromises);
  //     }
  //     // toast({ title: "Success", description: "Done!", variant: "default" });
  //   }

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
      // setTotalChecked([]);
      setIsChecked(false);
      setUpdatedEvents(events);
    }
  }, [events]);
  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      const resultId = events.map((event) => event.basic.id);
      setTotalChecked(resultId);
    } else {
      setTotalChecked([]);
    }
    setIsChecked(checked);
  };

  function toggleSelection(id: string) {
    setTotalChecked((prev) => {
      if (prev.includes(id)) {
        // Remove the id
        return prev.filter((eventId) => eventId !== id);
      } else {
        // Add the id
        return [...prev, id];
      }
    });
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setTotalChecked((prev) => {
        const newIds = updatedEvents?.map((event) => event.basic.id) || [];
        return [...prev, ...newIds];
      });
    } else {
      setTotalChecked((prev) => {
        return prev.filter(
          (eventId) =>
            !updatedEvents?.map((event) => event.basic.id).includes(eventId)
        );
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

  function handleCancel() {
    setIsChecked(false);
    setShowCheckBox?.(false);
    setTotalChecked([]);
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
        <NullState
          image={trackerNullState}
          title={(error as ApiError).message}
        />
      );
    } else
      return error.message == "Location is required" ? (
        <div className="p-6">
          <CustomTrackerNullState />;
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
      <div
        className="flex items-center justify-between gap-4 pl-4 pb-2"
        style={{ height: showCheckBox ? "50px" : "auto" }}
      >
        <div className="flex items-center gap-4">
          {showCheckBox && (
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={isAllChecked}
                onCheckedChange={handleSelectAll}
              />
              <div>Select events to perform action</div>
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
                disabled={isLoading || totalChecked.length === 0}
                onClick={() => bulkSubmit()}
              >
                Submit
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
              type={query.type}
              view={query.eventType}
              localFilters={localFilters}
            />
            <TableBody className="overflow-auto">
              {updatedEvents &&
                updatedEvents.map((event: Event) => (
                  <EventTableRow
                    toggleSelection={toggleSelection}
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
