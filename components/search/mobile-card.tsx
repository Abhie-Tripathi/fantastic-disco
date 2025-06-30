import React from "react";
import { Event } from "@/types/events/events";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Shield,
  Trophy,
} from "lucide-react";
import { formatEstimatedSpend } from "@/utils/formater";
import { formatLocationParts } from "@/utils/locationFormat";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { lightenColor } from "@/lib/utils";
import { formattedDateRange } from "@/utils/date";
import { ActionPopover } from "@/app/components/Table/ActionPopover";
import { Show } from "@/types/events/dto/event-query.dto";
import { intelScore } from "@/types/trackers";
import trustScore from "@/public/trust-score.svg"
import primeTrophy from "@/public/prime_trophy.svg"
import Image from "next/image";

// Local CircularProgress for mobile card
const CircularProgress = ({
  value = 0,
  label,
}: {
  value: number | null;
  label?: string;
}) => {
  const radius = 18;
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
        <svg className="w-[40px] h-[40px]" aria-hidden="true">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
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
            cx="20"
            cy="20"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-semibold"
          aria-hidden="true"
        >
          {value ? value : "-"}
        </span>
      </div>
      {label && (
        <p className="text-xs border-[#EBEBEB] border bg-white dark:bg-[#171717] rounded p-1 mt-1">
          {label}
        </p>
      )}
    </div>
  );
};

const MobileEventCard = ({
  isMobile,
  global,
  view,
  trackerId,
  setEventId,
  setInterest,
  event,
  showValues,
  showMatchKeywords,
  showaudienceSpread,
  showMaturity,
  initialIntelScoreData,
  intelLoading,
}: {
  isMobile: boolean;
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
  initialIntelScoreData?: intelScore;
  intelLoading?: boolean;
}) => {
  // Helper for stats
  const stat = (
    label: string,
    value: React.ReactNode
  ) => (
    <div className="flex items-center justify-between py-1">
      <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
        {label}
      </span>
      <span className="font-semibold text-primary text-sm">{value}</span>
    </div>
  );

  // Category badges
  const categories = [
    event.basic.primaryEventType && (
      <Badge
        key={event.basic.primaryEventType}
        className="bg-pink-100 text-pink-800 rounded-sm px-2 py-0.5 text-xs font-medium capitalize"
        style={{
          color: eventTypeColors[event.basic.primaryEventType] || undefined,
          backgroundColor: lightenColor(
            eventTypeColors[event.basic.primaryEventType] || "#E5E7EB",
            0.9
          ),
        }}
      >
        <span className="mr-1 capitalize">
          {eventTypeIcons[event.basic.primaryEventType] || null}
        </span>
        {event.basic.primaryEventType}
      </Badge>
    ),
    ...(event.basic.categories?.slice(0, 1).map((cat) => (
      <Badge
        key={cat.id}
        variant="outline"
        className="text-gray-700 rounded-sm px-2 py-0.5 text-xs font-medium"
      >
        {cat.name}
      </Badge>
    )) || []),
  ];

  // Date & location
  const date = formattedDateRange(
    event.basic.startDateTime,
    event.basic.endDateTime
  );
  const location = event.basic.eventLocation
    ? formatLocationParts(event.basic.eventLocation)
    : "Venue to be announced";

  // Insights & Scores
  const inbound = event.insights?.scores?.inboundScore ?? null;
  const international = event.insights?.scores?.internationalScore ?? null;

  // Rankings: support both Ranking and DetailRanking
  let rankDisplay = "-";
  if (event.insights?.rankings && typeof event.insights.rankings === "object") {
    if (
      "rank" in event.insights.rankings &&
      typeof event.insights.rankings.rank === "number"
    ) {
      rankDisplay = `${event.insights.rankings.rank}th Country Rank`;
    } else if (
      "country" in event.insights.rankings &&
      event.insights.rankings.country &&
      typeof event.insights.rankings.country.rank === "number"
    ) {
      rankDisplay = `${event.insights.rankings.country.rank}th Country Rank`;
    }
  }

  return (
    <div className="bg-white rounded-xl shadow border p-4 flex flex-col gap-3 w-full">
      {/* Top: Logo & Name */}
      <div className="flex items-center gap-3">
        <img
          src={event.basic.logoUrl || "/placeholder.svg"}
          alt={event.basic.name}
          className="w-12 h-12 rounded-md object-cover border bg-white"
        />
        <div className="flex-1">
          <div className="font-semibold text-base leading-tight text-gray-900">
            {event.basic.name}
          </div>
        </div>
        <div onClick={(e) => e.preventDefault()}>
          <ActionPopover
            eventId={event.basic.id}
            interests={event.interests}
            trackerId={trackerId}
            setInterest={setInterest}
            setEventId={setEventId}
            view={view}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-1">{categories}</div>
      {/* Date & Location */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <span>{date}</span>
        <span className="text-black">{location}</span>
      </div>
      {/* Ratings, Rank, Trust Score */}
      <div className="flex items-center gap-3 mt-1">
        <span className="flex items-center gap-1 text-xs text-gray-700">
          <Star className="w-4 h-4 text-primary" fill="#6751A4" />
          {event.basic.rating || "-"}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-700">
          <Trophy className="w-4 h-4 text-amber-500" />
          <Image alt="primetrophy" src={primeTrophy}/>
          {rankDisplay}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-700">
          <Image alt="trustscore" src={trustScore} className="w-5 h-5"/>
          Trust Score : {event.insights?.trustScore ?? "-"}
        </span>
      </div>
      {/* Stats */}
      <div className="mt-2 flex flex-col gap-1">
        {stat(
          "Estimated Visitors",
          event.insights?.estimatedAttendance?.toLocaleString() ?? "-"
        )}
        {stat(
          "Estimated Exhibitors",
          event.insights?.estimatedExhibitors?.toLocaleString() ?? "-"
        )}
        {stat(
          "Economic Impact",
          event.insights?.economicImpact
            ? formatEstimatedSpend(event.insights.economicImpact)
            : "-"
        )}
      </div>
      {/* Insights & Scores */}
      <div className="flex justify-between">
        <div className="text-xs text-gray-500 font-medium">Insights & Scores</div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex flex-col items-center flex-1">
            <div className="text-[11px] mb-1 border px-1">Inbound</div>
            <CircularProgress value={inbound} />
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="text-[11px] mb-1 border px-1">International</div>
            <CircularProgress value={international} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileEventCard;
