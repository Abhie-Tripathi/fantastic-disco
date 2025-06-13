import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { intelScore } from "@/types/trackers";
import { isEventeli } from "@/config";
import IntelScore from "./IntelScore";
import { groupedEventTypes } from "@/constants";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { Filters, useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { lightenColor } from "@/lib/utils";
import { Event } from "@/types/events";
import { Show } from "@/types/events/dto/event-query.dto";
import { formatDate } from "@/utils/eventHelpers";
import { formatEstimatedSpend } from "@/utils/formater";
import { CheckedState } from "@radix-ui/react-checkbox";
import * as Flags from "country-flag-icons/react/3x2";
import { ArrowDown, ArrowUp, Star } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { ActionPopover } from "./ActionPopover";

interface EventTableRowProps {
  toggleSelection: (id: string) => void;
  event: Event;
  trackerId?: string;
  show: Show[];
  type?: string;
  setEventId?: any;
  setInterest?: any;
  global?: string;
  view?: string;
  localFilters: Filters;
  showCheckBox?: boolean;
  totalChecked: string[];
  setTotalChecked?: React.Dispatch<React.SetStateAction<string[]>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  initialIntelScoreData?: intelScore;
  intelLoading?: boolean;
}

function getForecastedStatus(data: any) {
  if (!data && data === "") return "-";

  const forecastDate = new Date(data);
  const today = new Date();

  if (forecastDate >= today) {
    return forecastDate.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } else return "-";
}

function displayValue(value: any) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value;
}
function getTrackerAssociation(trackerMatchInfo: any, info: string) {
  if (info === "peopleFinderPersonAssociationPercentage") {
    return [trackerMatchInfo?.peopleFinderPersonAssociationPercentage];
  }
  if (info === "competitorPercentage") {
    if (trackerMatchInfo?.[info] === "") return "-";
    else return [trackerMatchInfo?.[info]];
  }
  if (info === "speakerPersonAssociationPercentage")
    if (trackerMatchInfo?.[info] === "") return "-";
    else return [trackerMatchInfo?.[info]];
  const result = trackerMatchInfo?.[info]?.map((item: string) =>
    item
      .split("_")
      .map((i) => `${i.charAt(0).toUpperCase()}${i.slice(1)}`)
      .join("_")
  );

  console.log(result);
  return result;
}

function getOrdinalSuffix(number: number): string {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

function formatExhibitorCount(value: string | number | null): string {
  if (value === "0-0" || value === null || value === undefined) return "-";

  const stringValue = String(value);
  const values = stringValue.split("-");

  if (values.length === 2 && values[0] === values[1]) {
    return Number(values[0]).toLocaleString();
  }

  return stringValue.toLocaleString();
}

function getAssociationColor(value: string) {
  switch (value?.toLowerCase()) {
    case "high":
      return "flex items-center justify-center text-green-500 bg-[var(--success-background-color)] px-6 py-2 rounded-[var(--border-radius-lg)]";
    case "medium":
      return "flex items-center justify-center text-blue-500 bg-[#eeeaf9] px-6 py-2 rounded-[var(--border-radius-lg)]";
    case "low":
      return "flex items-center justify-center text-red-500 bg-[var(--danger-background-color)] px-6 py-2 rounded-[var(--border-radius-lg)]";
    default:
      return "text-gray-500";
  }
}

export const EventTableRow: React.FC<EventTableRowProps> = ({
  toggleSelection,
  event,
  show,
  localFilters,
  trackerId,
  type,
  setEventId,
  setInterest,
  view,
  global,
  showCheckBox,
  totalChecked,
  isChecked,
  setIsChecked,
  setTotalChecked,
  initialIntelScoreData,
  intelLoading
}) => {
 
  const {isTentimesUser} = useFilterContext();
  const { getFilterValue } = useFilterState();
  const maturity = getFilterValue("maturity");
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
  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const showMatchKeywords =
    includeKeywords.length + excludeKeywords.length >= 5;
  const handleCheckboxChange = (checked: CheckedState, id: string) => {
    if (checked) {
      if (totalChecked.length === itemsPerPage - 1) setIsChecked(!isChecked);
      setTotalChecked?.((prev) => [...prev, id]);
    } else {
      if (isChecked) setIsChecked(!isChecked);
      setTotalChecked?.((prev) => prev.filter((item) => item !== id));
    }
  };
  const intelScoreData = [
    {
      name: "Total",
      value: initialIntelScoreData?.alltrackers_score || 0,
      fill: type === "T_PEOPLE_FINDER" || type === "T_SPEAKER_OPPORTUINTY" ? "#646BDC" : (type === "T_PRODUCT_KEYWORDS") ? "#E99CD4" : "#9B86D4",
    }
  ];


  const isCancelled = event.basic.status === "cancelled";
  const isPostponed = event.basic.status === "postponed";
  return (
    <TableRow key={event.basic.id}>
      {/* Event Name Column */}
      <TableCell
        className="sticky left-0 z-0 bg-[var(--heading-background-color)] max-w-[300px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] group-hover:bg-[var(--heading-background-color)]"
        style={{ zIndex: 0 }}
      >
        <div className="flex gap-4 items-center">
          {showCheckBox && (
            <Checkbox
              className=""
              checked={totalChecked.includes(event.basic.id)}
              onCheckedChange={() => toggleSelection(event.basic.id)}
            />
          )}
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {event.basic.logoUrl ? (
              <img
                src={event.basic.logoUrl}
                alt={`${event.basic.name} logo`}
                className="w-12 h-12 object-contain p-1 border rounded-md bg-white shadow-sm"
              />
            ) : event.basic.website ? (
              <div className="w-12 h-12 relative">
                <img
                  src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${event.basic.website}&size=64`}
                  alt={`${event.basic.name} website favicon`}
                  className="w-12 h-12 object-contain p-1 border rounded-md bg-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.dataset.error = "true";
                  }}
                />
                {/* Fallback that shows when image errors */}
                <div
                  className="w-12 h-12 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
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
                  <span className="text-[#5055A3] text-lg font-semibold">
                    {event.basic.name.charAt(0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center">
                <span className="text-[#5055A3] text-lg font-semibold">
                  {event.basic.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-grow min-w-0">
            <div className="flex gap-1 mb-1">
              {event.basic.primaryEventType && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 uppercase rounded-sm"
                        style={{
                          color:
                            eventTypeColors[event.basic.primaryEventType || ""],
                          backgroundColor: lightenColor(
                            eventTypeColors[event.basic.primaryEventType || ""],
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
                        <span className="capitalize">
                          {event.basic.primaryEventType}
                        </span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Event Type</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {show.includes(Show.branded) && event.advance?.isBranded && (
                <Badge
                  variant="outline"
                  className="text-[#DF2670] border-[#F9D7E2] bg-[#FEECF2] capitalize rounded-sm"
                >
                  Brand
                </Badge>
              )}
              {show.includes(Show.series) && event.advance?.isSeries && (
                <Badge
                  variant="outline"
                  className="text-[#0D8C7D] border-[#BEF4EB] bg-[#E5FAF6]  capitalize rounded-sm"
                >
                  Series
                </Badge>
              )}
            </div>
            <div className="truncate font-medium">
              {event.basic.primaryEventType === "holiday" ? (
                <span title={event.basic.name}>{event.basic.name}</span>
              ) : (
                <Link
                  href={`/internal/event/${event.basic.id}`}
                  className="hover:text-primary transition-colors"
                  title={event.basic.name}
                >
                  {event.basic.name}
                </Link>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {event.basic.organizer?.name}
            </div>
          </div>
        </div>
      </TableCell>

      {/* Date Column */}
      <TableCell>
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
        {event.basic.status === "cancelled" ||
        event.basic.status === "postponed" ? (
          <del className="text-muted-foreground" title={event.basic.status}>
            {formatDate(event.basic.startDateTime)}
            <br />
            {formatDate(event.basic.startDateTime) !==
              formatDate(event.basic.endDateTime) &&
              formatDate(event.basic.endDateTime)}
          </del>
        ) : (
          <span className="whitespace-nowrap">
            {formatDate(event.basic.startDateTime)}
            <br />
            {formatDate(event.basic.startDateTime) !==
              formatDate(event.basic.endDateTime) &&
              formatDate(event.basic.endDateTime)}
          </span>
        )}
      </TableCell>

      {/* Venue Column */}
      <TableCell>
        {event.basic.format === "hybrid" && (
          <div className="inline-block px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-1">
            Hybrid
          </div>
        )}
        <div>
          {event.basic.primaryEventType === "holiday"
            ? Array.isArray(event.basic.eventLocation)
              ? event.basic.eventLocation.map((loc) => loc.name).join(", ")
              : event.basic.eventLocation?.name || "-"
            : event.basic.format === "online"
            ? "Online"
            : Array.isArray(event.basic.eventLocation)
            ? "-"
            : event.basic.eventLocation?.locationType === "VENUE"
            ? event.basic.eventLocation.name
            : "TBA"}
        </div>
      </TableCell>

      {/* City Column */}
      <TableCell>
        {event.basic.primaryEventType === "holiday"
          ? Array.isArray(event.basic.eventLocation)
            ? event.basic.eventLocation
                .map((loc) => loc.cityName)
                .filter(Boolean)
                .join(", ")
            : displayValue(event.basic.eventLocation?.cityName)
          : displayValue(
              event.basic.eventLocation?.locationType === "CITY"
                ? event.basic.eventLocation.name
                : event.basic.eventLocation?.cityName
            )}
      </TableCell>

      {/* Country Column */}
      <TableCell>
        {event.basic.primaryEventType === "holiday"
          ? Array.isArray(event.basic.eventLocation)
            ? event.basic.eventLocation
                .map((loc) => loc.countryName)
                .filter(Boolean)
                .join(", ")
            : displayValue(event.basic.eventLocation?.countryName)
          : displayValue(
              Array.isArray(event.basic.eventLocation)
                ? "-"
                : event.basic.eventLocation?.countryName
            )}
      </TableCell>

      {/* Keywords Column - if enabled */}
      {event.basic.tags && (
        <TableCell>
          {event.basic.tags?.[0]?.name}
          {event.basic.tags.length > 1 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs text-primary font-medium ml-1">
                    +{event.basic.tags.length - 1}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {event.basic.tags.map((tag) => tag.name).join(" | ")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </TableCell>
      )}

      {/* Category Column */}
      <TableCell className="text-center">
        {!(
          isEventeli &&
          groupedEventTypes.social.includes(event.basic.primaryEventType)
        ) ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="flex items-center gap-1">
                  {event.basic.primaryEventType === "holiday"
                    ? event.basic.eventTypes[0]?.name
                    : event.basic.categories[0]?.name}
                  {event.basic.primaryEventType === "holiday"
                    ? event.basic.eventTypes.length > 1 && (
                        <span className="text-xs font-bold text-muted-foreground">
                          +{event.basic.eventTypes.length - 1}
                        </span>
                      )
                    : event.basic.categories.length > 1 && (
                        <span className="text-xs font-bold text-muted-foreground">
                          +{event.basic.categories.length - 1}
                        </span>
                      )}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {event.basic.primaryEventType === "holiday"
                  ? event.basic.eventTypes.map((item) => item.name).join(" | ")
                  : event.basic.categories.map((item) => item.name).join(" | ")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          "-"
        )}
      </TableCell>

      {/* Event Size Column */}
      {event.insights?.estimatedAttendance !== undefined && (
        <TableCell className="text-center">
          {displayValue(event.insights?.estimatedAttendance)}
        </TableCell>
      )}

      {/* Estimated Exhibitors Column */}
      {show.includes(Show.estimatedExhibitors) &&
        event.insights?.estimatedExhibitors !== undefined && (
          <TableCell className="text-center">
            {formatExhibitorCount(event.insights?.estimatedExhibitors)}
          </TableCell>
        )}

      {/* Event Rank Column */}
      {show.includes(Show.rankings) &&
        event.insights?.rankings !== undefined && (
          <TableCell style={{ textAlign: "center" }}>
            {event.insights?.rankings ? (
              <span>
                <div>
                  {(event.insights.rankings as any).rank}
                  <sup>
                    {getOrdinalSuffix((event.insights.rankings as any).rank)}
                  </sup>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize font-medium badge_warning`}
                >
                  {(event.insights.rankings as any).rankType ===
                  "category_country"
                    ? "Category Country"
                    : (event.insights.rankings as any).rankType}
                </Badge>
              </span>
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {/* Event Rating Column */}
      {show.includes(Show.rating) && event.basic.rating !== undefined && (
        <TableCell style={{ textAlign: "center" }}>
          {event.basic.rating !== null && event.basic.rating > 0 ? (
            <div className="grid grid-cols-3 px-4 items-center justify-items-center">
              {event.insights?.reputationChangePercentage !== undefined &&
                event.insights?.reputationChangePercentage > 10 && (
                  <span className="text-green-500 bg-green-100 rounded-full p-1">
                    <ArrowUp className="w-4 h-4 inline" />
                  </span>
                )}
              {event.insights?.reputationChangePercentage !== undefined &&
                event.insights?.reputationChangePercentage < -10 && (
                  <span className="text-red-500 bg-red-100 rounded-full p-1">
                    <ArrowDown className="w-4 h-4  inline" />
                  </span>
                )}
              <span className="col-start-2">
                {event.basic.rating.toFixed(1)}
              </span>
              <Star className="inline w-4 h-4 text-primary fill-primary mr-2" />
            </div>
          ) : (
            "-"
          )}
        </TableCell>
      )}

      {/* Reputation Column */}
      {show.includes(Show.rankings) &&
        event.insights?.trustScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.trustScore !== null &&
            event.insights?.trustScore !== 0 ? (
              event.insights?.trustChangePercentage > 0 ? (
                <div className="text-success-text flex items-center justify-center gap-1">
                  {event.insights?.trustScore}%
                  <span className="text-green-500 bg-green-100 rounded-full p-1">
                    <ArrowUp className="w-4 h-4 inline" />
                  </span>
                </div>
              ) : event.insights?.trustChangePercentage < 0 ? (
                <div className="text-danger-text flex items-center justify-center gap-1">
                  {event.insights?.trustScore}%
                  <span className="text-red-500 bg-red-100 rounded-full p-1">
                    <ArrowDown className="w-4 h-4  inline" />
                  </span>
                </div>
              ) : (
                <div>{event.insights?.trustScore}%</div>
              )
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {/* Frequency Column */}
      {show.includes(Show.frequency) &&
        event.advance?.frequency !== undefined && (
          <TableCell className="text-center">
            {event.advance?.frequency ? (
              <span className="badge_primary capitalize">
                {event.advance?.frequency}
              </span>
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {/* Forecasted Column */}
      {show.includes(Show.forecasted) && (
        <TableCell className="text-center">
          {getForecastedStatus(event.advance?.rehostDate)}
        </TableCell>
      )}

      {/* Match Column */}
      {showMatchKeywords && (
        <TableCell className="text-center">
          {event.basic.matchedKeywords ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex items-center justify-center gap-1">
                    {event.basic.matchedKeywords?.[0]}
                    {event.basic.matchedKeywords?.length > 1 && (
                      <span className="text-xs font-bold text-muted-foreground">
                        +{event.basic.matchedKeywords?.length - 1}
                      </span>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {event.basic.matchedKeywords?.join(" | ")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            "-"
          )}
        </TableCell>
      )}

      {showMatchKeywords && (
        <TableCell className="text-center">
          {(() => {
            const percentage = event.basic.matchedKeywordsPercentage ?? null;
            if (percentage === null) return "-";
            if (percentage > 20)
              return <span className={getAssociationColor("high")}>High</span>;
            if (percentage >= 10 && percentage <= 20)
              return (
                <span className={getAssociationColor("medium")}>Medium</span>
              );
            if (percentage > 0 && percentage < 10)
              return <span className={getAssociationColor("low")}>Low</span>;
            return "-";
          })()}
        </TableCell>
      )}

      {/* Maturity Column */}
      {maturity && event.advance?.maturity !== undefined && (
        <TableCell className="text-center">
          {event.advance?.maturity ? (
            <span className="badge_primary capitalize">
              {event.advance?.maturity}
            </span>
          ) : (
            "-"
          )}
        </TableCell>
      )}

      {/* Impact Score Column */}
      {/* {show.includes(Show.scores) &&
        event.insights?.scores?.impactScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.scores?.impactScore !== 0 &&
            event.insights?.scores?.impactScore !== null
              ? event.insights?.scores?.impactScore
              : "-"}
          </TableCell>
        )} */}

      {/* Inbound Score Column */}
      {isEventeli &&
        show.includes(Show.scores) &&
        event.insights?.scores?.inboundScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.scores?.inboundScore !== 0 &&
            event.insights?.scores?.inboundScore !== null
              ? event.insights?.scores?.inboundScore
              : "-"}
          </TableCell>
        )}

      {/* International Score Column */}
      {isEventeli &&
        show.includes(Show.scores) &&
        event.insights?.scores?.internationalScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.scores?.internationalScore !== 0 &&
            event.insights?.scores?.internationalScore !== null
              ? event.insights?.scores?.internationalScore
              : "-"}
          </TableCell>
        )}

      {/* Economic Impact Column */}
      {isEventeli &&
        show.includes(Show.economicImpact) &&
        event.insights?.economicImpact !== undefined && (
          <TableCell className="text-right">
            {formatEstimatedSpend(event.insights.economicImpact)}
          </TableCell>
        )}

      {/* Audience Zone Column */}
      {show.includes(Show.audienceZone) &&
        event.audience?.audienceZone !== undefined && (
          <TableCell className="text-center">
            {event.audience?.audienceZone ? (
              <span className="badge_primary capitalize">
                {event.audience?.audienceZone}
              </span>
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {audienceSpread.length > 0 &&
        event.audience?.audienceSpread !== undefined && (
          <TableCell className="text-center">
            <div className="flex gap-2">
              {event.audience?.audienceSpread &&
              Object.entries(event.audience?.audienceSpread).length > 0
                ? Object.entries(event.audience?.audienceSpread)
                    .slice(0, 5)
                    .map(([key, { iso, name, count, percentage }]) => {
                      if (iso === "UK") iso = "GB";
                      const Flag = Flags[iso as keyof typeof Flags];
                      return (
                        <span
                          key={key}
                          className="inline-block rounded overflow-hidden"
                          title={name}
                        >
                          {Flag && (
                            <Flag className="w-[25px] h-[18px] border" />
                          )}
                        </span>
                      );
                    })
                : "-"}
            </div>
          </TableCell>
        )}
      {!isEventeli && (
        <>
          {type === "T_PEOPLE_FINDER" && view !== "bookmarked" && (
            <>
              <TableCell
                className="sticky right-[200px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "100px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {
                        getTrackerAssociation(
                          event.trackerMatchInfo,
                          "peopleFinderPersonAssociation"
                        )[0]?.split("_")?.[0]
                      }
                      <span className="text-xs font-bold text-muted-foreground ml-1">
                       {getTrackerAssociation(
                          event.trackerMatchInfo,
                          "peopleFinderPersonAssociation"
                        )?.length>1 &&`+${ getTrackerAssociation(
                          event.trackerMatchInfo,
                          "peopleFinderPersonAssociation"
                        )?.length-1}`}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {getTrackerAssociation(
                        event.trackerMatchInfo,
                        "peopleFinderPersonAssociation"
                      )[0]
                        ?.split("_")
                        ?.join(" ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              {isTentimesUser ?
              <TableCell
                className="sticky right-[68px] bg-background z-0 text-[var(--secondary-text-color)]"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                {intelLoading ? <Skeleton className="h-16 w-full rounded-md" />
                :
                (intelScoreData[0]?.value > 0 ?(<IntelScore width="100%" height="70px" intelScore={intelScoreData}/>):"-")}
                {/* <Skeleton className="h-16 w-full rounded-md" /> */}
              </TableCell>:
               <TableCell
                className="sticky right-[68px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <span
                  className={getAssociationColor(
                    getTrackerAssociation(
                      event.trackerMatchInfo,
                      "peopleFinderPersonAssociationPercentage"
                    )[0]
                  )}
                >
                  {
                    getTrackerAssociation(
                      event.trackerMatchInfo,
                      "peopleFinderPersonAssociationPercentage"
                    )[0]
                  }
                </span>
              </TableCell>
              }
            </>
          )}
          {type === "T_SPEAKING_OPPORTUNITY" && view !== "bookmarked" && (
            <>
              <TableCell
                className="sticky right-[200px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "100px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {
                        getTrackerAssociation(
                          event.trackerMatchInfo,
                          "speakerPersonAssociation"
                        )[0].split("_")[0]
                      }
                      <span className="text-xs font-bold text-muted-foreground ml-1">
                       {getTrackerAssociation(
                          event.trackerMatchInfo,
                          "speakerPersonAssociation"
                        )?.length>1 &&`+${ getTrackerAssociation(
                          event.trackerMatchInfo,
                          "speakerPersonAssociation"
                        )?.length-1}`}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {getTrackerAssociation(
                        event.trackerMatchInfo,
                        "speakerPersonAssociation"
                      )[0]
                        .split("_")
                        .join(" ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              {isTentimesUser?
             <TableCell
                className="sticky right-[68px] bg-background z-0 text-[var(--secondary-text-color)]"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                {intelLoading ? <Skeleton className="h-16 w-full rounded-md" />
                :
                (intelScoreData[0]?.value > 0 ?(<IntelScore width="100%" height="70px" intelScore={intelScoreData}/>):"-")}
                {/* <Skeleton className="h-16 w-full rounded-md" /> */}
              </TableCell>:  
              <TableCell
                className="sticky right-[68px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <span
                  className={getAssociationColor(
                    getTrackerAssociation(
                      event.trackerMatchInfo,
                      "speakerPersonAssociationPercentage"
                    )[0]
                  )}
                >
                  {getTrackerAssociation(
                    event.trackerMatchInfo,
                    "speakerPersonAssociationPercentage"
                  )[0] ?? "-"}
                </span>
              </TableCell>}
            </>
          )}
          {type === "T_COMPETITOR" && view !== "bookmarked" && (
            <>
              <TableCell
                className="sticky right-[200px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "100px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {
                        getTrackerAssociation(
                          event.trackerMatchInfo,
                          "competitorDomainOrName"
                        )?.[0].split("_")[0]
                      }
                      <span className="text-xs font-bold text-muted-foreground ml-1">
                       {getTrackerAssociation(
                          event.trackerMatchInfo,
                          "competitorDomainOrName"
                        )?.length>1 &&`+${ getTrackerAssociation(
                          event.trackerMatchInfo,
                          "competitorDomainOrName"
                        )?.length-1}`}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {getTrackerAssociation(
                        event.trackerMatchInfo,
                        "competitorDomainOrName"
                      )?.map((item: string, index: number) => (
                        <div key={index}>
                          {item.split("_")[1].toLowerCase()} (
                          {item.split("_")[0]})
                        </div>
                      ))}
                      {/* {getTrackerAssociation(event.trackerMatchInfo, "competitorDomainOrName")[0].split("_")[1].toLowerCase()} */}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              {isTentimesUser?
              <TableCell
                className="sticky right-[68px] bg-background z-0 text-[var(--secondary-text-color)]"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                {intelLoading ? <Skeleton className="h-16 w-25 rounded-md" />
                :
                (intelScoreData[0]?.value > 0 ?(<IntelScore width="100%" height="70px" intelScore={intelScoreData}/>):"-")}
                {/* <Skeleton className="h-16 w-full rounded-md" /> */}
              </TableCell>:    
              <TableCell
                className="sticky right-[68px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <span
                  className={getAssociationColor(
                    getTrackerAssociation(
                      event.trackerMatchInfo,
                      "competitorPercentage"
                    )[0]
                  )}
                >
                  {getTrackerAssociation(
                    event.trackerMatchInfo,
                    "competitorPercentage"
                  )[0] ?? "-"}
                </span>
              </TableCell>}
            </>
          )}
          {type === "T_PRODUCT_KEYWORDS" && view !== "bookmarked" && (
            <>
              <TableCell
                className="sticky right-[200px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "100px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {event?.basic?.matchedKeywords?.[0]}{" "}
                      <span className="text-xs font-bold text-muted-foreground">
                      {event?.basic?.matchedKeywords?.length && event.basic.matchedKeywords.length > 1 && `+${event.basic.matchedKeywords.length - 1}`}
                      </span>
                      {/* Fixed variable name */}
                    </TooltipTrigger>
                    <TooltipContent>
                      {event?.basic?.matchedKeywords
                        ?.map((item) => item)
                        .join(" | ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            {isTentimesUser?
            <TableCell
                className="sticky right-[68px] bg-background z-0 text-[var(--secondary-text-color)]"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                {intelLoading ? <Skeleton className="h-16 w-full rounded-md" />
                :
                (intelScoreData[0]?.value > 0 ?(<IntelScore width="100%" height="70px" intelScore={intelScoreData}/>):"-")}
                {/* <Skeleton className="h-16 w-full rounded-md" /> */}
              </TableCell>
            : <TableCell
                className="sticky right-[68px] bg-background z-0"
                style={{
                  zIndex: 0,
                  minWidth: "132px",
                  textAlign: "center",
                  background: "var(--heading-background-color)",
                }}
              >
                {(() => {
                  const percentage =
                    event.basic.matchedKeywordsPercentage ?? null;

                  if (percentage === null) return "-";
                  if (percentage > 20)
                    return (
                      <span className={getAssociationColor("high")}>High</span>
                    );
                  if (percentage >= 10 && percentage <= 20)
                    return (
                      <span className={getAssociationColor("medium")}>
                        Medium
                      </span>
                    );
                  if (percentage > 0 && percentage < 10)
                    return (
                      <span className={getAssociationColor("low")}>Low</span>
                    );

                  return "-";
                })()}
              </TableCell>}
            
            </>
          )}
        </>
      )}
      {global !== "global" && (
        <TableCell
          className="sticky right-0 bg-background z-0 w-[68px]"
          style={{ zIndex: 0, background: "var(--heading-background-color)" }}
        >
          {event.basic.primaryEventType !== "holiday" && (
            <ActionPopover
              view={view}
              setEventId={setEventId}
              setInterest={setInterest}
              trackerId={trackerId}
              eventId={event.basic.id}
              interests={event.interests}
            />
          )}
        </TableCell>
      )}
    </TableRow>
  );
};