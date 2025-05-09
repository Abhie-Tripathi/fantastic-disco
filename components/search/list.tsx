"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Star, Radio, TicketPercent, Loader2 } from "lucide-react";
import { useTrackerServices } from "@/services/trackerServices";
import { useIntent } from "@/hooks/useIntent";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Event } from "@/types/events/events";
import { format } from "date-fns";
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerEvents } from "@/hooks/useTrackerEvents";
import { useEventsService } from "@/services/eventsService";
import NullState from "@/app/components/trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { cn, lightenColor } from "@/lib/utils";
import {
  alertIcons,
  eventTypeColors,
  eventTypeIcons,
  getAlertLevelBorderColor,
} from "@/constants/eventTypes";
import { PaginationComponent } from "../pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Show } from "@/types/events/dto/event-query.dto";
import { formatEstimatedSpend } from "@/utils/formater";
import { ActionPopover } from "@/app/components/Table/ActionPopover";
import { formattedDateRange } from "@/utils/date";
import { useEvents } from "@/hooks/useEvents";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "@/app/components/UI/Loading";
import ZeroState from "@/app/components/zerostate";
import { ApiError } from "@/types/api";
import Image from "next/image";
import holiday from "/public/eventType/holiday.svg";
import { useTrackerContext } from "@/context/tracker";
import { isEventeli } from "@/config";
import { Button } from "../ui/button";
import * as Flags from "country-flag-icons/react/3x2";
import { groupedEventTypes } from "@/constants";
import BulkActionPopover from "@/app/components/Table/BulkActionPopover";
import { useConfiguration } from "@/hooks/useConfiguration";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
interface CircularProgressProps {
  value: number | null;
  label: string;
}
interface rankTag {
  rank: number;
  type: string;
  name: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  label,
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  const getColorByValue = (value: number | null): string => {
    if (value == null) return "text-[#398e4a]";
    if (value <= 25) return "text-[#398e4a]";
    if (value <= 50) return "text-[#FFD70A]";
    if (value <= 75) return "text-[#FF990A]";
    return "text-[#DA2F35]";
  };

  const className = getColorByValue(value);

  return (
    <div className="text-center">
      <div className="relative inline-flex">
        <svg className="w-[52px] h-[52px]" aria-hidden="true">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="26"
            cy="26"
          />
          <circle
            className={className}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (value ? (value / 100) * circumference : 0)
            }
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="26"
            cy="26"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
          aria-hidden="true"
        >
          {value ? value : "-"}
        </span>
      </div>
      <p className="text-xs border-[#EBEBEB] border bg-white dark:bg-[#171717] rounded p-1">
        {label}
      </p>
    </div>
  );
};

interface EventListProps {
  eventType?: string;
  trackerId?: string;
  source?: string;
  view?: string;
  showCheckBox?: boolean;
  setShowCheckBox?: Dispatch<SetStateAction<boolean>>;
}

export default function EventAccordion({
  source,
  eventType,
  trackerId,
  view,
  showCheckBox,
  setShowCheckBox,
}: EventListProps) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [totalChecked, setTotalChecked] = useState<string[]>([]);
  const [action, setAction] = useState();
  const {
    interestConfiguration,
    isLoading: isConfigLoading,
    error: isConfigError,
  } = useConfiguration.interest();
  const { createUserEventInterest, isLoading: isSubmitting } =
    useIntent.createUserEventInterest();
  const { removeBookmark } = useTrackerServices();
  const { data: trackerData, setIsNewCall } = useTrackerContext();
  const { getFilterValue, setMultipleFilters } = useFilterState();
  const showMaturity = !!getFilterValue("maturity");
  const includeKeywords = getFilterValue("includeKeywords")
    .trim()
    .split(",")
    .filter(Boolean);
  const excludeKeywords = getFilterValue("excludeKeywords")
    .trim()
    .split(",")
    .filter(Boolean);
  const audienceSpread = getFilterValue("audienceSpread")
    .split(",")
    .filter(Boolean);
  const showMatchKeywords =
    includeKeywords.length + excludeKeywords.length >= 5;
  const query = Object.fromEntries(searchParams.entries());
  delete query.show;
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>();
  const [interest, setInterest] = useState();
  const [eventId, setEventId] = useState();
  let events, totalEvents, isLoading, error;
  const { data } = useTrackerContext();
  const sourceModule = pathName.includes("trackers")
    ? "TRACKER"
    : pathName === "/internal/search/events"
    ? "RESEARCH"
    : "";

  if (source === "tracker") {
    ({ events, totalEvents, isLoading, error } = useTrackerEvents.list(
      query,
      trackerId,
      view
    ));
  } else {
    ({ events, totalEvents, isLoading, error } = useEvents.list(query));
  }
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
    if ((data?.filterValues as any)?.show?.includes(key)) {
      showsData.push(value);
    }
  });
  const bulkSubmit = async () => {
    
    try {
      if (eventType === "bookmarked") {
        const bookmarkPromises = totalChecked.map((id) => {
          const unBookmarkEvent = events.find((event) => event.basic.id === id);
          const response = removeBookmark(
            unBookmarkEvent?.interests?.bookmark?.interestId
          );
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
        const interestPromises = totalChecked.map((id) =>
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
  useEffect(() => {
    if (events?.length > 0) {
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
  const actions = [
    ...(interestConfiguration?.interest || []),
    ...[{ label: "Bookmark", status: "BOOKMARK" }],
    // ...(eventType!=="bookmarked" ? [{ label: "Bookmark", status: "BOOKMARK" }] : [{ label: "Un-Bookmark", status: "UN-BOOKMARK" }]),
  ];
  useEffect(() => {
    if (actions.length > 0 && !action) {
      setAction(actions[0]);
    }
  }, [actions]);
  useEffect(() => {
    if (!events) return;

    setUpdatedEvents((prevEvents) => {
      let newEvents = prevEvents ? [...prevEvents] : [...events];

      if (query.eventType === "bookmarked") {
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
  const handlePageChange = (page: number) => {
    setMultipleFilters({
      offset: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };

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
            title="No events bookmarked yet! Start bookmarking events to easily track and revisit them here."
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
    } else
      return (
        <ZeroState text="No events found. Try expanding your preferences by selecting more categories, products, or topics." />
      );
  }
  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between gap-4 pl-4 pb-2"
        style={{ height: showCheckBox ? "50px" : "auto" }}
      >
        <div className="flex items-center gap-4">
          {showCheckBox && (
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
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
      <div className="flex-grow overflow-y-auto">
        <ul className="w-full space-y-6 list-none">
          {updatedEvents?.map((event: Event) => (
            <EventListItem
              totalChecked={totalChecked}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              setTotalChecked={setTotalChecked}
              showCheckBox={showCheckBox}
              itemsPerPage={itemsPerPage}
              global={view}
              trackerId={trackerId}
              view={query.eventType}
              setEventId={setEventId}
              setInterest={setInterest}
              key={event.basic.id}
              event={event}
              showValues={showValues}
              showMaturity={showMaturity}
              showMatchKeywords={showMatchKeywords}
              showaudienceSpread={audienceSpread.length > 0 ? true : false}
            />
          ))}
        </ul>
      </div>
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
    </div>
  );
}

const EventListItem = ({
  global,
  view,
  trackerId,
  setEventId,
  setInterest,
  event,
  showValues,
  showMatchKeywords,
  showaudienceSpread,
  showCheckBox,
  totalChecked,
  isChecked,
  setIsChecked,
  setTotalChecked,
  itemsPerPage,
  showMaturity,
}: {
  trackerId?: string;
  view?: string;
  setEventId: any;
  setInterest: any;
  event: Event;
  showValues: Show[];
  showMatchKeywords: boolean;
  showaudienceSpread: boolean;
  showMaturity: boolean;
  global?: string;
  showCheckBox?: boolean;
  totalChecked: string[];
  setTotalChecked?: React.Dispatch<React.SetStateAction<string[]>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  itemsPerPage: number;
}) => {
  const address = event.basic.eventLocation ? (
    event.basic.format === "online" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" /> Online
      </span>
    ) : event.basic.format === "hybrid" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" />
        <span>Hybrid&nbsp;-&nbsp;</span>
        {[
          event.basic.eventLocation?.venue?.name || "TBA",
          event.basic.eventLocation?.city?.name,
          event.basic.eventLocation?.state?.name !==
          event.basic.eventLocation?.city?.name
            ? event.basic.eventLocation?.state?.name
            : null,
          event.basic.eventLocation?.country?.name !==
          event.basic.eventLocation?.city?.name
            ? event.basic.eventLocation?.country?.name
            : null,
        ]
          .filter(Boolean)
          .join(", ")}
      </span>
    ) : (
      [
        event.basic.eventLocation?.venue?.name || "TBA",
        event.basic.eventLocation?.city?.name,
        event.basic.eventLocation?.state?.name !==
        event.basic.eventLocation?.city?.name
          ? event.basic.eventLocation?.state?.name
          : null,
        event.basic.eventLocation?.country?.name !==
        event.basic.eventLocation?.city?.name
          ? event.basic.eventLocation?.country?.name
          : null,
      ]
        .filter(Boolean)
        .join(", ")
    )
  ) : (
    "Venue to be announced"
  );

  const isCancelled = event.basic.status === "cancelled";
  const isPostponed = event.basic.status === "postponed";

  function getOrdinalSuffix(number: number): string {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }

  function formatExhibitorCount(value: string | number | null): string {
    if (value === null || value === undefined) return "--";

    const stringValue = String(value);
    const values = stringValue.split("-");

    if (values.length === 2 && values[0] === values[1]) {
      return Number(values[0]).toLocaleString();
    }

    return stringValue.toLocaleString();
  }

  const getMatchKeywordsColor = (percentage: number | null) => {
    if (percentage === null) return "text-gray-500";
    if (percentage > 20)
      return "text-green-500 bg-[var(--success-background-color)] ";
    if (percentage >= 10 && percentage <= 20)
      return "text-blue-500 bg-[#eeeaf9]";
    if (percentage > 0 && percentage < 10)
      return "text-red-500 bg-[var(--danger-background-color)]";
    return "text-gray-500";
  };

  if (event.basic.primaryEventType == "holiday") {
    return <UnplannedCard event={event} />;
  }
  const handleCheckboxChange = (checked: CheckedState, id: string) => {
    if (checked) {
      if (totalChecked.length === itemsPerPage - 1) setIsChecked(!isChecked);
      setTotalChecked?.((prev) => [...prev, id]);
    } else {
      if (isChecked) setIsChecked(!isChecked);
      setTotalChecked?.((prev) => prev.filter((item) => item !== id));
    }
  };
  return (
    <div className="flex gap-4 items-center w-full">
      {showCheckBox && (
        <div className="flex pl-4">
          <Checkbox
            checked={totalChecked.includes(event.basic.id)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(checked, event.basic.id)
            }
          />
        </div>
      )}
      <div className="bg-background rounded-lg border shadow-sm relative flex w-full">
        <Link href={`/internal/event/${event.basic.id}`} className="block">
          <div className="absolute left-0 top-6 h-auto w-[140px] flex items-start justify-center">
            {event.basic.logoUrl ? (
              <img
                src={event.basic.logoUrl}
                alt={`${event.basic.name} logo`}
                className="w-24 h-24 object-contain p-2 border rounded-md bg-white shadow-sm"
              />
            ) : event.basic.website ? (
              <div className="w-24 h-24 relative">
                <img
                  src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${event.basic.website}&size=64`}
                  alt={`${event.basic.name} website favicon`}
                  className="w-24 h-24 object-contain p-2 border rounded-md bg-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    // This will trigger the fallback div to show
                    e.currentTarget.dataset.error = "true";
                  }}
                />
                {/* Fallback that shows when image errors */}
                <div
                  className="w-24 h-24 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
                  style={{ display: "none" }}
                  ref={(el) => {
                    if (el) {
                      const img = el.previousSibling as HTMLImageElement;
                      if (img && img.dataset.error === "true") {
                        el.style.display = "flex";
                      }
                    }
                  }}
                >
                  <span className="text-[#5055A3] text-2xl font-semibold">
                    {event.basic.name.charAt(0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center">
                <span className="text-[#5055A3] text-2xl font-semibold">
                  {event.basic.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="pl-[136px] p-6 pr-3">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 flex flex-col justify-between gap-3">
                <h2 className="text-2xl font-semibold ">{event.basic.name}</h2>
                <div>
                  <p className="text-sm capitalize">{address}</p>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm text-gray-600 mt-2",
                        isCancelled || isPostponed ? "line-through" : ""
                      )}
                    >
                      {formattedDateRange(
                        event.basic.startDateTime,
                        event.basic.endDateTime
                      )}
                    </p>
                    {isCancelled && (
                      <Badge
                        variant="outline"
                        className="border-destructive text-destructive mt-2"
                      >
                        Cancelled
                      </Badge>
                    )}
                    {isPostponed && (
                      <Badge
                        variant="outline"
                        className="border-[#FF990A] text-[#FF990A] mt-2"
                      >
                        Postponed
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {event.basic.primaryEventType && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className={
                                "flex items-center gap-2 bg-pink-100 text-pink-800 hover:bg-pink-100 uppercase rounded-sm"
                              }
                              style={{
                                color:
                                  eventTypeColors[
                                    event.basic.primaryEventType || ""
                                  ],
                                backgroundColor: lightenColor(
                                  eventTypeColors[
                                    event.basic.primaryEventType || ""
                                  ],
                                  0.9
                                ),
                              }}
                            >
                              <span>
                                {
                                  eventTypeIcons[
                                    event.basic.primaryEventType || "festivals"
                                  ]
                                }
                              </span>
                              <span>{event.basic.primaryEventType}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Event Type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {!(
                      isEventeli &&
                      groupedEventTypes.social.includes(
                        event.basic.primaryEventType
                      )
                    ) &&
                      event.basic.categories?.map((tag, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize rounded-sm"
                              >
                                {tag.name}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Category</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    {showValues.includes(Show.rating) &&
                    event.basic.rating &&
                    event.basic.rating > 0 ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-gray-600 capitalize rounded-sm"
                            >
                              <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                              <span>{event.basic.rating}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Rating</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      ""
                    )}
                    {showValues.includes(Show.entryType) &&
                    event.basic.entryType == "free_and_paid" ? (
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize rounded-sm"
                              >
                                <TicketPercent className="w-3 h-3 mr-1" />
                                <span>Free</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Entry Type</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize rounded-sm"
                              >
                                <TicketPercent className="w-3 h-3 mr-1" />
                                <span>Paid</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Entry Type</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : event.basic.entryType == "paid" ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-gray-600 capitalize rounded-sm"
                            >
                              <TicketPercent className="w-3 h-3 mr-1" />
                              <span>Paid</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Entry Type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {showMaturity && event.advance?.maturity && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-gray-600 capitalize rounded-sm"
                            >
                              {event.advance?.maturity}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Maturity</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {showValues.includes(Show.frequency) &&
                      event.advance?.frequency && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize rounded-sm"
                              >
                                {event.advance?.frequency}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Frequency</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    {showValues.includes(Show.branded) &&
                      event.advance?.isBranded && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-[#DF2670] border-[#F9D7E2] bg-[#FEECF2] capitalize rounded-sm"
                              >
                                Branded
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Brand</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    {showValues.includes(Show.series) &&
                      event.advance?.isSeries && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-[#0D8C7D] border-[#BEF4EB] bg-[#E5FAF6]  capitalize rounded-sm"
                              >
                                Series
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Brand</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    {showValues.includes(Show.forecasted) &&
                      event.advance?.rehostDate && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize rounded-sm"
                              >
                                Forecasted Next Edition :{" "}
                                {format(event.advance?.rehostDate, "MMM yyyy")}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Forecasted Status</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    {showValues.includes(Show.rankings) &&
                      event.insights?.rankings && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize rounded-sm"
                              >
                                {(event.insights?.rankings as any).rank}
                                <sup className="mr-1">
                                  {getOrdinalSuffix(
                                    (event.insights?.rankings as any).rank
                                  )}
                                </sup>
                                {(event.insights?.rankings as any).rankType}{" "}
                                Rank
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Event Ranking</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                    {showValues.includes(Show.audienceZone) &&
                      event.audience?.audienceZone && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize"
                              >
                                {event.audience.audienceZone} Audience
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Audience Zone</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                    {showValues.includes(Show.rankings) &&
                    event.insights?.trustScore &&
                    event.insights?.trustScore > 0 ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-gray-600 capitalize"
                            >
                              Trust Score: {event.insights?.trustScore}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Trust Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      ""
                    )}

                    {showValues.includes(Show.rating) &&
                      event.insights?.reputationScore && (
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Badge
                                variant="outline"
                                className="text-gray-600 capitalize"
                              >
                                Reputation Score :{" "}
                                {event.insights?.reputationScore}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                              <p>Reputation Score</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                    {showMatchKeywords && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-2 text-gray-600 capitalize rounded-sm"
                            >
                              Match Keyword :{" "}
                              {event.basic.matchedKeywords?.join(" | ")}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100 text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Matched Keywords</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {showMatchKeywords && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className={cn(
                                "flex items-center gap-2 text-gray-600 capitalize rounded-sm",
                                getMatchKeywordsColor(
                                  event.basic.matchedKeywordsPercentage
                                )
                              )}
                            >
                              {(() => {
                                const percentage =
                                  event.basic.matchedKeywordsPercentage ?? null;
                                if (percentage === null) return "-";
                                if (percentage > 20) return <span>High</span>;
                                if (percentage >= 10 && percentage <= 20)
                                  return <span>Medium</span>;
                                if (percentage > 0 && percentage < 10)
                                  return <span>Low</span>;
                                return "-";
                              })()}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100 text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {showaudienceSpread && event.audience?.audienceSpread && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-2 text-gray-600 capitalize rounded-sm"
                            >
                              <div className="flex gap-1">
                                {Object.entries(event.audience.audienceSpread)
                                  .slice(0, 5)
                                  .map(([key, { iso, name }]) => {
                                    const countryIso =
                                      iso === "UK" ? "GB" : iso;
                                    const Flag =
                                      Flags[countryIso as keyof typeof Flags];
                                    return Flag ? (
                                      <span
                                        key={key}
                                        className="inline-block rounded overflow-hidden"
                                        title={name}
                                      >
                                        <Flag className="w-4 h-3 border" />
                                      </span>
                                    ) : null;
                                  })}
                              </div>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100 text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Audience Spread</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-5 flex flex-col gap-2 justify-between">
                {isEventeli && event.alerts && event.alerts?.length > 0 && (
                  <div className="flex items-center justify-end gap-2">
                    {event.alerts?.map((alert) => (
                      <Badge
                        key={alert.id}
                        variant="outline"
                        className={cn(
                          "capitalize text-sm border-2",
                          getAlertLevelBorderColor(alert.level)
                        )}
                      >
                        <span>{alertIcons[alert.type]}</span>
                        <span className="ml-1 font-medium">
                          {alert.name.toLowerCase()}
                        </span>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-start justify-end h-full">
                  {showValues.includes(Show.scores) &&
                  event.insights?.scores &&
                  (event.insights?.scores.inboundScore !== null ||
                    event.insights?.scores.internationalScore !== null) ? (
                    <div className="flex justify-end gap-6 w-full">
                      <div className="flex flex-col gap-4">
                        {showValues.includes(Show.estimatedExhibitors) &&
                          event.insights?.estimatedExhibitors !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 font-medium">
                                Estimated Exhibitors
                              </p>
                              <p className="text-lg font-semibold text-primary">
                                {formatExhibitorCount(
                                  event.insights?.estimatedExhibitors
                                )}
                              </p>
                            </div>
                          )}
                        {event.insights?.estimatedAttendance !== undefined && (
                          <div>
                            <p className="text-xs text-gray-600 font-medium">
                              Estimated Visitors
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              {event.insights?.estimatedAttendance == "0"
                                ? "--"
                                : event.insights?.estimatedAttendance}
                            </p>
                          </div>
                        )}
                        {isEventeli &&
                          event.insights?.economicImpact !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 font-medium">
                                Economic Impact
                              </p>
                              <p className="text-lg font-semibold text-primary">
                                {formatEstimatedSpend(
                                  event.insights?.economicImpact
                                )}
                              </p>
                            </div>
                          )}
                      </div>

                      <div className="space-y-4">
                        {isEventeli &&
                          showValues.includes(Show.scores) &&
                          event.insights?.scores && (
                            <div className="grid grid-rows-2 gap-2 border border-[#EBEBEB] bg-[#FAFAFA] p-2 rounded">
                              <CircularProgress
                                value={event.insights?.scores.inboundScore}
                                label="Inbound"
                              />
                              <CircularProgress
                                value={
                                  event.insights?.scores.internationalScore
                                }
                                label="International"
                              />
                            </div>
                          )}
                      </div>
                      {global !== "global" && (
                        <div
                          className="flex items-start justify-end"
                          onClick={(e) => e.preventDefault()}
                        >
                          <ActionPopover
                            eventId={event.basic.id}
                            interests={event.interests}
                            trackerId={trackerId}
                            setInterest={setInterest}
                            setEventId={setEventId}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end w-full gap-6">
                      <div className="grid grid-row-2 items-end gap-4">
                        {showValues.includes(Show.estimatedExhibitors) &&
                          event.insights?.estimatedExhibitors !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 font-medium">
                                Estimated Exhibitors
                              </p>
                              <p className="text-lg font-semibold text-primary">
                                {event.insights?.estimatedExhibitors == "" ||
                                event.insights?.estimatedExhibitors == null
                                  ? "--"
                                  : formatExhibitorCount(
                                      event.insights?.estimatedExhibitors
                                    )}
                              </p>
                            </div>
                          )}
                        {event.insights?.estimatedAttendance !== undefined && (
                          <div>
                            <p className="text-xs text-gray-600 font-medium">
                              Estimated Visitors
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              {event.insights?.estimatedAttendance == "0" ||
                              event.insights?.estimatedAttendance == null
                                ? "--"
                                : event.insights?.estimatedAttendance}
                            </p>
                          </div>
                        )}
                        {isEventeli &&
                          showValues.includes(Show.economicImpact) &&
                          event.insights?.economicImpact !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 font-medium">
                                Economic Impact
                              </p>
                              <p className="text-lg font-semibold text-primary">
                                {formatEstimatedSpend(
                                  event.insights?.economicImpact
                                )}
                              </p>
                            </div>
                          )}
                      </div>
                      {global !== "global" && (
                        <div
                          className="flex items-start justify-end"
                          onClick={(e) => e.preventDefault()}
                        >
                          <ActionPopover
                            eventId={event.basic.id}
                            interests={event.interests}
                            trackerId={trackerId}
                            setInterest={setInterest}
                            setEventId={setEventId}
                            view={view}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const UnplannedCard = ({ event }: { event: Event }) => {
  function formatAddress(eventLocation: any): string {
    const addressParts: string[] = [];
    if (Array.isArray(eventLocation?.city)) {
      const cities = eventLocation.city.map((s: any) => s.name).join(", ");
      addressParts.push(cities);
    } else if (eventLocation?.city) {
      addressParts.push(eventLocation.city.name);
    }

    if (Array.isArray(eventLocation?.state)) {
      const states = eventLocation.state.map((s: any) => s.name).join(", ");
      addressParts.push(states);
    } else if (eventLocation?.state) {
      addressParts.push(eventLocation.state.name);
    }

    if (Array.isArray(eventLocation?.country)) {
      const countries = eventLocation.country
        .map((s: any) => s.name)
        .join(", ");
      addressParts.push(countries);
    } else if (eventLocation?.country) {
      addressParts.push(eventLocation.country.name);
    }
    return addressParts.join(", ");
  }

  const eventTypes = event.basic.eventTypes
    .filter((eventType) => {
      return (
        eventType.slug !== "general-holiday" && eventType.slug !== "holiday"
      );
    })
    .map((eventType) => eventType.name);

  function formatExhibitorCount(value: string | number | null): string {
    if (value === null || value === undefined) return "-";

    const stringValue = String(value);
    const values = stringValue.split("-");

    if (values.length === 2 && values[0] === values[1]) {
      return Number(values[0]).toLocaleString();
    }

    return stringValue.toLocaleString();
  }

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm relative">
      <div
        className="absolute w-[6px] h-full left-0 top-0 rounded-lg"
        style={{
          backgroundColor: eventTypeColors.holiday,
        }}
      ></div>
      <div className="p-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 flex flex-col justify-between gap-3">
            <h2 className="text-2xl font-semibold text-gray-900 ">
              {event.basic.name}
            </h2>

            <div>
              <p className="text-sm capitalize">
                {formatAddress(event.basic.eventLocation)}
              </p>
              <p className={cn("text-sm text-gray-600 mt-2")}>
                {formattedDateRange(
                  event.basic.startDateTime,
                  event.basic.endDateTime
                )}
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                <Image
                  src={holiday || "/placeholder.svg"}
                  alt="holiday"
                  className="w-4 h-4"
                />
                <Badge
                  variant="outline"
                  className="text-gray-600 capitalize rounded-sm bg-gray-100"
                >
                  <span className="ml-1 uppercase">
                    {event.basic.primaryEventType}
                  </span>
                </Badge>
                {eventTypes.map((eventType) => (
                  <Badge
                    variant="outline"
                    className="text-gray-600 capitalize rounded-sm"
                    key={eventType}
                  >
                    <span className="ml-1">{eventType}</span>
                  </Badge>
                ))}
              </div>
              {/* <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="text-gray-600 capitalize rounded-sm"
                  key="National"
                >
                  <span className="ml-1">Regional Holiday</span>
                </Badge>
              </div> */}
            </div>
          </div>
          <div className="col-span-5 flex flex-col justify-between">
            <div className="flex items-center justify-end gap-2">
              {/* {event.basic.alerts?.map((alert) => (
                <Badge
                  key={alert.id}
                  variant="outline"
                  className={cn(
                    "capitalize text-sm border-2",
                    getAlertLevelBorderColor(alert.level)
                  )}
                >
                  <span>{alertIcons[alert.type]}</span>
                  <span className="ml-1 font-medium">
                    {alert.name.toLowerCase()}
                  </span>
                </Badge>
              ))} */}
            </div>
            <div className="flex items-center justify-end">
              {/* {event.insights?.scores ? (
                  <div className="flex items-center justify-end w-full">
                    <div className="space-y-4">
                      {event.insights?.scores && (
                        <div className="grid grid-cols-2 gap-2 border border-[#EBEBEB] bg-[#FAFAFA] p-2 rounded">
                          <CircularProgress
                            value={-39}
                            label="Business Score"
                          />
                          <CircularProgress value={80} label="Social Score" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : ( */}
              <div className="grid grid-row-2 items-end gap-4">
                {/* {event.insights?.estimatedAttendance !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Estimated Visitors
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {event.insights?.estimatedAttendance == "0"
                            ? "--"
                            : event.insights?.estimatedAttendance}
                        </p>
                      </div>
                    )} */}
                {/* {event.economicImpact !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Economic Impact
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {formatEstimatedSpend(event.economicImpact)}
                        </p>
                      </div>
                    )} */}
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
