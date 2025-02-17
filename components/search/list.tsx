"use client";

import React, { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  DollarSign,
  List,
  ListCheck,
  ListPlus,
  Plus,
  Star,
  Tag,
  TicketPercent,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Event, Ranking } from "@/types/events/events";
import { differenceInDays, format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { Button } from "../ui/button";
import { useEventsService } from "@/services/eventsService";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { cn, lightenColor } from "@/lib/utils";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { isEventeli } from "@/config";
import { formatDateRange } from "@/utils/dateFormat";
import { PaginationComponent } from "../pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { formatEstimatedSpend } from "@/utils/formater";

interface CircularProgressProps {
  value: number | null;
  label: string;
}

interface CategoryRank {
  [key: string]: number;
}

interface RankingResponse {
  countryRank?: number | undefined;
  categoryRank?: any;
  globalRank?: number | undefined;
  countryCategoryRank?: any;
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

export default function EventAccordion({
  events,
  count = 0,
}: {
  events: Event[];
  count: number | undefined;
}) {
  const [openItem, setOpenItem] = useState<string | undefined>();
  const { setFilter, getFilterValue } = useFilterState();
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    Number(getFilterValue("take")) || 20
  );
  const currentPage =
    Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage);

  const handleToggle = (id: string) => {
    if (openItem == id) setOpenItem(undefined);
    else setOpenItem(id);
  };

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);

    setFilter("take", newItemsPerPage.toString());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pb-6">
        <ul className="w-full space-y-6 list-none">
          {events?.map((event) => (
            <EventListItem
              key={event.basic.id}
              event={event}
              handleToggle={handleToggle}
            />
          ))}
        </ul>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 sticky bottom-0 bg-background py-4 border-t">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            count={count}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
}

const EventListItem = ({
  event,
  handleToggle,
}: {
  event: Event;
  handleToggle: (id: string) => void;
}) => {
  const { saveEvent } = useEventsService();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(Boolean(event.insights?.rankings));
  function getLeastRank(response: Ranking) {
    let minRank = {
      rank: Infinity,

      name: "",

      type: "",
    };

    if (response?.global !== null && response?.global !== undefined) {
      minRank.rank = response.global;
      minRank.name = "";
      minRank.type = "Global";
    } else if (response?.country !== null && response?.country !== undefined) {
      minRank.rank = response.country.rank;
      minRank.name = "";
      minRank.type = "Country";
    } else if (response?.categories) {
      const c_ranks = response.categories;
      for (const category in c_ranks) {
        if (c_ranks[category].rank < minRank.rank) {
          minRank.rank = c_ranks[category].rank;
          minRank.name = category;
          minRank.type = "Category";
        }
      }
    } else if (response?.category_country) {
      const c_ranks = response.category_country;
      for (const category in c_ranks) {
        if (c_ranks[category].rank < minRank.rank) {
          minRank.rank = c_ranks[category].rank;
          minRank.name = category;
          minRank.type = "Country Category";
        }
      }
    }

    if (minRank.type === "") {
      return "";
    }

    return getEventRank(minRank);
  }
  function getEventRank(prop: rankTag) {
    let rankString = "";
    if (prop.rank == 1) rankString = "st";
    else if (prop.rank == 2) rankString = "nd";
    else if (prop.rank == 3) rankString = "rd";
    else rankString = "th";

    return (
      <>
        {prop.rank}
        <sup>{rankString}</sup>
        <span className="pl-1">{` ${prop.type}`}</span>
      </>
    );
  }
  const address = event.basic.eventLocation ? (
    event.basic.eventLocation.venue?.name === "Online" ||
    event.basic.format === "online" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" /> Online
      </span>
    ) : event.basic.format === "hybrid" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" />
        <span>Hybrid&nbsp;-&nbsp;</span>
        {[
          event.basic.eventLocation.venue?.name || "TBA",
          event.basic.eventLocation.city?.name,
          event.basic.eventLocation.state?.name,
          event.basic.eventLocation.country?.name,
        ]
          .filter(Boolean)
          .join(", ")}
      </span>
    ) : (
      [
        event.basic.eventLocation.venue?.name,
        event.basic.eventLocation.city?.name,
        event.basic.eventLocation.state?.name,
        event.basic.eventLocation.country?.name,
      ]
        .filter(Boolean)

        .join(", ")
    )
  ) : (
    "Venue to be announced"
  );

  const isCancelled = event.basic.status === "cancelled";
  const isPostponed = event.basic.status === "postponed";

  const handleSaveEvent = async (eventId: string) => {
    try {
      await saveEvent(eventId);
      setIsSaved(true);
      toast({
        title: "Event saved",
        description: "Event has been added to your saved events",
      });
    } catch (error: any) {
      toast({
        title: "Error saving event",
        description: error.message,
        variant: "destructive",
        action: (
          <ToastAction
            onClick={() => handleSaveEvent(eventId)}
            altText="Try again"
          >
            Try again
          </ToastAction>
        ),
      });
    }
  };

  return (
    <div className="bg-background rounded-lg border shadow-sm relative">
      <Link href={`/internal/event/${event.basic.id}`} className="block">
        <div className="absolute left-0 top-0 h-full w-[60px] flex items-center justify-center border-r bg-[#5055A3]/5">
          {event.basic.logoUrl ? (
            <img 
              src={event.basic.logoUrl} 
              alt={`${event.basic.name} logo`}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#5055A3]/10 flex items-center justify-center">
              <span className="text-[#5055A3] text-lg font-semibold">
                {event.basic.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="pl-[76px] p-6">
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
                    {formatDateRange(
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
                    <div className="flex items-center gap-2">
                      <span>
                        {
                          eventTypeIcons[
                            event.basic.primaryEventType || "festivals"
                          ]
                        }
                      </span>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className={
                                "bg-pink-100 text-pink-800 hover:bg-pink-100 uppercase rounded-sm"
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
                              <span>{event.basic.primaryEventType}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                            <p>Event Type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  {event.basic.categories?.slice(0, 1).map((tag, index) => (
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
                  {event.basic.rating && event.basic.rating > 0 ? (
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
                  {event.basic.entryType == "free_and_paid" ? (
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
                  {event.advance?.maturity && (
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
                  {event.advance?.frequency && (
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
                  {event.advance?.isBranded && (
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
                  {event.advance?.isSeries && (
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
                  {event.advance?.rehostDate && (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="text-gray-600 capitalize rounded-sm"
                          >
                            Forecasted for{" "}
                            {format(event.advance?.rehostDate, "MMM yyyy")}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                          <p>Forecasted Status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {event.insights?.rankings && (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="text-gray-600 capitalize rounded-sm"
                          >
                            {getLeastRank(event.insights?.rankings)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                          <p>Event Ranking</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {event.audience?.audienceZone && (
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
                </div>
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between">
              {isEventeli && (
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    disabled={Boolean(event.interests?.bookmark?.interestId)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveEvent(event.basic.id);
                    }}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-primary" />
                    )}
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-end">
                {event.insights?.scores ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col justify-end gap-4">
                      {event.insights?.exhibitorsCount !== undefined && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Estimated Exhibitors
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {event.insights?.exhibitorsCount === 0 ? "--" : event.insights?.exhibitorsCount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {event.insights?.estimatedAttendance && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Estimated Visitors
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {event.insights?.estimatedAttendance || "--"}
                          </p>
                        </div>
                      )}
                      {event.insights?.economicImpact && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Est. Economic Impact
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {formatEstimatedSpend(
                              event.insights?.economicImpact || "--"
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {event.insights?.scores && (
                        <div className="grid grid-cols-3 gap-2 border border-[#EBEBEB] bg-[#FAFAFA] dark:bg-[#171717] p-2 rounded">
                          <CircularProgress
                            value={event.insights?.scores.impactScore}
                            label="EIS"
                          />
                          <CircularProgress
                            value={event.insights?.scores.inboundScore}
                            label="Inbound"
                          />
                          <CircularProgress
                            value={event.insights?.scores.internationalScore}
                            label="International"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-row-2 items-end gap-4">
                    {event.insights?.exhibitorsCount !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Estimated Exhibitors
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {event.insights?.exhibitorsCount === 0 ? "--" : event.insights?.exhibitorsCount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {event.insights?.estimatedAttendance && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Estimated Visitors
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {event.insights?.estimatedAttendance || "--"}
                        </p>
                      </div>
                    )}
                    {event.insights?.economicImpact && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Economic Impact
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {formatEstimatedSpend(
                            event.insights?.economicImpact || "--"
                          )}
                        </p>
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
  );
};
