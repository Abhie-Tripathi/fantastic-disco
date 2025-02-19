import type React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, getEventRating } from "@/utils/eventHelpers";
import Link from "next/link";
import { ArrowUp, ArrowDown, Star } from "lucide-react";
import styles from "./table.module.css";
import { Event } from "@/types/events";
import Image from "next/image";
import { ActionPopover } from "./ActionPopover";
import { Show } from "@/types/events/dto/event-query.dto";
import { Badge } from "@/components/ui/badge";

export function getEventRank(prop: any) {
  let rankString = "";
  if (prop.rank == 1) rankString = "st";
  else if (prop.rank == 2) rankString = "nd";
  else if (prop.rank == 3) rankString = "rd";
  else rankString = "th";
  return (
    <>
      <div style={{ textAlign: "center", fontWeight: "500" }}>
        {prop.rank}
        <sup>{rankString}</sup>
      </div>
      <span
        title={prop.name}
        className={`${styles.truncateText_1} badge_warning`}
        style={{ textTransform: "capitalize", padding: "1px 10px" }}
      >
        {prop.type}
      </span>
    </>
  );
}

interface EventTableRowProps {
  event: Event;
  show: Show[];
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

function getOrdinalSuffix(number: number): string {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export const EventTableRow: React.FC<EventTableRowProps> = ({
  event,
  show,
}) => {
  return (
    <TableRow key={event.basic.id}>
      {/* Event Name Column */}
      <TableCell
        className="sticky left-0 z-0 bg-slate-50 dark:bg-slate-900  max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
        style={{ zIndex: 0 }}
      >
        <div className="flex gap-1 mb-1">
          {show.includes(Show.branded) && event.advance?.isBranded && (
            <span className="px-2 py-0.5 rounded text-xs bg-success-background text-success-text font-medium">
              Brand
            </span>
          )}
          {show.includes(Show.series) && event.advance?.isSeries && (
            <span className="px-2 py-0.5 rounded text-xs bg-info-background text-info-text font-medium">
              Series
            </span>
          )}
        </div>
        <div className="truncate font-medium">
          <Link
            href={`/internal/event/${event.basic.id}`}
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            {event.basic.name}
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          {event.basic.organizer?.name}
        </div>
      </TableCell>

      {/* Date Column */}
      <TableCell>
        {event.basic.status === "CANCELLED" ||
        event.basic.status === "POSTPONED" ? (
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
        {event.basic.format === "HYBRID" && (
          <div className="inline-block px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-1">
            Hybrid
          </div>
        )}
        <div>
          {event.basic.eventLocation.venue?.displayName ||
            (event.basic.format === "ONLINE" ? "Online" : "TBA")}
        </div>
      </TableCell>

      {/* City Column */}
      <TableCell>
        {displayValue(event.basic.eventLocation.city?.name)}
      </TableCell>

      {/* Country Column */}
      <TableCell className="text-center">
        {displayValue(event.basic.eventLocation.country?.name)}
      </TableCell>

      {/* Keywords Column - if enabled */}
      {/* {event.insights?.keywords && (
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {event.insights.keywords[0]}
                {event.insights.keywords.length > 1 && (
                  <span className="text-xs font-bold">
                    {" "}
                    +{event.insights.keywords.length - 1}
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {event.insights.keywords.join(" | ")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      )} */}

      {/* Category Column */}
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <span className="flex items-center gap-1">
                {event.basic.categories[0]?.name}
                {event.basic.categories.length > 1 && (
                  <span className="text-xs font-bold text-muted-foreground">
                    +{event.basic.categories.length - 1}
                  </span>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {event.basic.categories.map((item) => item.name).join(" | ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      {/* Event Size Column */}
      {event.insights?.estimatedAttendance !== undefined && (
        <TableCell className="text-center">
          {displayValue(event.insights?.estimatedAttendance)}
        </TableCell>
      )}

      {/* Estimated Exhibitors Column */}
      {show.includes(Show.estimatedExhibitors) &&
        event.advance?.estimatedExhibitors !== undefined && (
          <TableCell className="text-center">
            {displayValue(event.advance?.estimatedExhibitors)}
          </TableCell>
        )}

      {/* Event Rank Column */}
      {show.includes(Show.rankings) &&
        event.insights?.rankings !== undefined && (
          <TableCell style={{ textAlign: "center" }}>
            {event.insights?.rankings ? (
              <span>
                <div>
                  {event.insights.rankings.rank}
                  <sup>{getOrdinalSuffix(event.insights.rankings.rank)}</sup>
                </div>
                <Badge variant="outline" className="capitalize font-medium">
                  {event.insights.rankings.rankType}
                </Badge>
              </span>
            ) : (
              "-"
            )}
          </TableCell>
        )}
      {/* Reputation Column */}
      {show.includes(Show.scores) &&
        event.insights?.repeatSentiment !== undefined && (
          <TableCell className="text-center">
            {event.insights?.repeatSentiment !== null &&
            (event.insights?.repeatSentiment > 1 ||
              event.insights?.repeatSentiment < -1) ? (
              event.insights?.repeatSentiment > 0 ? (
                <div className="text-success-text flex items-center gap-1">
                  {event.insights?.repeatSentiment}%
                  <ArrowUp className="w-4 h-4" />
                </div>
              ) : (
                <div className="text-danger-text flex items-center gap-1">
                  {event.insights?.repeatSentiment}%
                  <ArrowDown className="w-4 h-4" />
                </div>
              )
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {/* Event Rating Column */}
      {show.includes(Show.rating) &&
        event.insights?.reputationScore !== undefined && (
          <TableCell style={{ textAlign: "center" }}>
            {event.insights?.reputationScore > 0 ? (
              <div className="flex gap-1 items-center justify-evenly">
                {event.insights?.reputationScore > 10 && (
                  <span className="rounded-full bg-success-background p-1">
                    <ArrowUp className="w-4 h-4 text-success-text inline" />
                  </span>
                )}
                {event.insights?.reputationScore < -10 && (
                  <span className="rounded-full bg-danger-background p-1">
                    <ArrowDown className="w-3.5 h-3.5 text-danger-text inline" />
                  </span>
                )}

                {getEventRating(event.insights?.reputationScore.toString())}

                <Star className="w-4 h-4 inline" />
              </div>
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {/* Trust Column */}
      {show.includes(Show.trustScore) &&
        event.insights?.repeatSentiment !== undefined && (
          <TableCell style={{ textAlign: "center" }}>
            {event.insights?.repeatSentiment ? (
              <>
                {event.insights?.repeatSentiment > 10 && (
                  <span className="rounded-full bg-success-background p-1">
                    <ArrowUp className="w-3.5 h-3.5 text-success-text inline mb-1.5" />
                  </span>
                )}
                {event.insights?.repeatSentiment < -10 && (
                  <span className="rounded-full bg-danger-background p-1">
                    <ArrowDown className="w-3.5 h-3.5 text-danger-text inline mb-1.5" />
                  </span>
                )}
                &nbsp;
                {event.insights?.repeatSentiment}%
              </>
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
          {getForecastedStatus(event.basic.startDateTime)}
        </TableCell>
      )}

      {/* Maturity Column */}
      {show.includes(Show.maturity) &&
        event.advance?.maturity !== undefined && (
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
      {show.includes(Show.scores) &&
        event.insights?.scores?.impactScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.scores?.impactScore !== 0
              ? event.insights?.scores?.impactScore
              : "-"}
          </TableCell>
        )}

      {/* Inbound Score Column */}
      {show.includes(Show.scores) &&
        event.insights?.scores?.inboundScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.scores?.inboundScore !== 0
              ? event.insights?.scores?.inboundScore
              : "-"}
          </TableCell>
        )}

      {/* International Score Column */}
      {show.includes(Show.scores) &&
        event.insights?.scores?.internationalScore !== undefined && (
          <TableCell className="text-center">
            {event.insights?.scores?.internationalScore !== 0
              ? event.insights?.scores?.internationalScore
              : "-"}
          </TableCell>
        )}

      {/* Economic Impact Column */}
      {show.includes(Show.economicImpact) &&
        event.insights?.economicImpact !== undefined && (
          <TableCell className="text-right">
            {event.insights.economicImpact}
          </TableCell>
        )}

      {/* Audience Zone Column */}
      {show.includes(Show.audienceZone) &&
        event.audience?.audienceZone !== undefined && (
          <TableCell className="text-center">
            {event.audience?.audienceZone ? (
              <span className={styles.badge_primary}>
                {event.audience?.audienceZone}
              </span>
            ) : (
              "-"
            )}
          </TableCell>
        )}

      {/* Audience Spread Column */}
      {show.includes(Show.audienceSpread) &&
        event.audience?.audienceSpread !== undefined && (
          <TableCell className="text-center">
            <div className="flex gap-2">
              {event.audience?.audienceSpread &&
              Object.entries(event.audience?.audienceSpread).length > 0
                ? Object.entries(event.audience?.audienceSpread).map(
                    ([key, { iso, name, count, percentage }]) => (
                      <span
                        key={key}
                        className="inline-block rounded overflow-hidden"
                        title={name}
                      >
                        <Image
                          src={`https://img.10times.com/img/flag/${iso.toLowerCase()}.jpg`}
                          alt="flag"
                          width={25}
                          height={18}
                          className="object-cover"
                        />
                      </span>
                    )
                  )
                : "-"}
            </div>
          </TableCell>
        )}

      <TableCell
        className="sticky right-0 bg-background z-0"
        style={{ zIndex: 0 }}
      >
        <ActionPopover eventId={event.basic.id} interests={event.interests} />
      </TableCell>
    </TableRow>
  );
};
