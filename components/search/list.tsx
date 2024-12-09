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
import { Event } from "@/types/events";
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
import { cn } from "@/lib/utils";
import { eventTypeColors } from "@/constants/eventTypes";
import { isEventeli } from "@/config";

interface CircularProgressProps {
  value: number;
  label: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  label,
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  const getColorByValue = (value: number): string => {
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
            strokeDashoffset={circumference - (value / 100) * circumference}
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
  count,
}: {
  events: Event[];
  count: number;
}) {
  const [openItem, setOpenItem] = useState<string | undefined>();
  const { setFilter, getFilterValue } = useFilterState();
  const itemsPerPage = 10;
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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationEllipsis />;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">{ellipsis}</PaginationItem>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">{ellipsis}</PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pb-6">
        <ul className="w-full space-y-6 list-none">
          {events?.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              handleToggle={handleToggle}
            />
          ))}
        </ul>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 sticky bottom-0 bg-background py-4 border-t">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
  const [isSaved, setIsSaved] = useState(event.isSaved);

  const address = event.venueLocation ? (
    event.venueLocation.city?.name === "Online" || event.format === "online" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" /> Online
      </span>
    ) : event.format === "hybrid" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" />
        <span>Hybrid&nbsp;-&nbsp;</span>
        {[
          event.venueLocation?.venue?.name,
          event.venueLocation?.city?.name,
          event.venueLocation?.state?.name,
          event.venueLocation?.country?.name,
        ]
          .filter(Boolean)
          .join(", ")}
      </span>
    ) : (
      [
        event.venueLocation?.venue?.name,
        event.venueLocation?.city?.name,
        event.venueLocation?.state?.name,
        event.venueLocation?.country?.name,
      ]
        .filter(Boolean)
        .join(", ")
    )
  ) : (
    "Venue to be announced"
  );

  const formattedRange = (() => {
    if (!event.startDateTime || !event.endDateTime) {
      return "Date to be announced";
    }

    const formattedStartDate = format(event.startDateTime, "dd MMM yyyy");
    const formattedEndDate = format(event.endDateTime, "dd MMM yyyy");
    const days = differenceInDays(event.endDateTime, event.startDateTime) + 1;

    return formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedEndDate} (${days} ${
          days === 1 ? "day" : "days"
        })`;
  })();

  const isCancelled = event.status === "cancelled";
  const isPostponed = event.status === "postponed";

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

  const formatEstimatedSpend = (spend: string) => {
    const spendNumber = parseFloat(spend.slice(1).replace(/,/g, ""));
    if (spendNumber >= 100000) {
      return `$${(spendNumber / 1000).toFixed(0)}k`;
    }
    return spend;
  };

  return (
    <div className="bg-background rounded-lg border shadow-sm relative">
      <Link href={`/internal/event/${event.id}`} className="block">
        <div className="absolute w-[6px] h-full left-0 top-0 rounded-lg bg-[#5055A3]"></div>
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 flex flex-col justify-between gap-3">
              <h2 className="text-2xl font-semibold ">
                {event.name}
              </h2>

              <div>
                <p className="text-sm capitalize">{address}</p>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm text-gray-600 mt-2",
                      isCancelled || isPostponed ? "line-through" : ""
                    )}
                  >
                    {formattedRange}
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
                  {event.primaryEventType && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          "bg-[#E0EAF5] text-[#5055A3] hover:bg-[#E0EAF5] uppercase"
                        }
                      >
                        {event.primaryEventType}
                      </Badge>
                    </div>
                  )}
                  {event.categories?.slice(0, 1).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {event.rating && event.rating > 0 ? (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                      <span>{event.rating}</span>
                    </Badge>
                  ) : (
                    ""
                  )}
                  {event.entryType == "free_and_paid" ? (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-gray-600 capitalize"
                      >
                        <TicketPercent className="w-3 h-3 mr-1" />
                        <span>Free</span>
                      </Badge>

                      <Badge
                        variant="outline"
                        className="text-gray-600 capitalize"
                      >
                        <TicketPercent className="w-3 h-3 mr-1" />
                        <span>Paid</span>
                      </Badge>
                    </div>
                  ) : event.entryType == "paid" ? (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      <TicketPercent className="w-3 h-3 mr-1" />
                      <span>Paid</span>
                    </Badge>
                  ) : (
                    ""
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {event.maturity && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      {event.maturity}
                    </Badge>
                  )}
                  {event.frequency && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      {event.frequency}
                    </Badge>
                  )}
                  {event.isBranded && (
                    <Badge
                      variant="outline"
                      className="text-[#DF2670] border-[#F9D7E2] bg-[#FEECF2] capitalize"
                    >
                      Branded
                    </Badge>
                  )}
                  {event.isSeries && (
                    <Badge
                      variant="outline"
                      className="text-[#0D8C7D] border-[#BEF4EB] bg-[#E5FAF6]  capitalize"
                    >
                      Series
                    </Badge>
                  )}
                  {event.rehostDate && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      Forecasted for {format(event.rehostDate, "MMM yyyy")}
                    </Badge>
                  )}
                  {event.rankings && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      Top {event.rankings.rankRange}
                    </Badge>
                  )}

                  {event.audienceZone && (
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize"
                    >
                      {event.audienceZone} Audience
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between">
              {isEventeli && <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  disabled={isSaved}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSaveEvent(event.id);
                  }}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5 text-primary" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-primary" />
                  )}
                </Button>
              </div>}
              <div className="flex items-center justify-end">
                {event.scores ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col justify-end gap-4">
                      {event.exhibitorsCount && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Estimated Exhibitors
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {(event.exhibitorsCount || "0").toLocaleString()}
                          </p>
                        </div>
                      )}
                      {event.estimatedAttendance && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Estimated Visitors
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {event.estimatedAttendance || "--"}
                          </p>
                        </div>
                      )}
                      {event.economicImpact && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Economic Impact
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {formatEstimatedSpend(event.economicImpact || "$0")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {event.scores && (
                        <div className="grid grid-cols-3 gap-2 border border-[#EBEBEB] bg-[#FAFAFA] dark:bg-[#171717] p-2 rounded">
                          <CircularProgress
                            value={event.scores.impactScore}
                            label="EIS"
                          />
                          <CircularProgress
                            value={event.scores.inboundScore}
                            label="Inbound"
                          />
                          <CircularProgress
                            value={event.scores.internationalScore}
                            label="International"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-row-2 items-end gap-4">
                    {event.exhibitorsCount && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Estimated Exhibitors
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {(event.exhibitorsCount || "0").toLocaleString()}
                        </p>
                      </div>
                    )}
                    {event.estimatedAttendance && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Estimated Visitors
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {event.estimatedAttendance || "--"}
                        </p>
                      </div>
                    )}
                    {event.economicImpact && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Economic Impact
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {formatEstimatedSpend(event.economicImpact || "$0")}
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
