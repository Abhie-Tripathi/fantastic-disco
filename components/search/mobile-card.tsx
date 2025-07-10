import React from "react";
import { Event } from "@/types/events/events";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Trophy } from "lucide-react";
import { formatEstimatedSpend } from "@/utils/formater";
import { formatLocationParts } from "@/utils/locationFormat";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { lightenColor } from "@/lib/utils";
import { formattedDateRange } from "@/utils/date";
import { ActionPopover } from "@/app/components/Table/ActionPopover";
import { Show } from "@/types/events/dto/event-query.dto";
import { intelScore } from "@/types/trackers";
import trustScore from "@/public/trust-score.svg";
import primeTrophy from "@/public/prime_trophy.svg";
import Image from "next/image";
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerContext } from "@/context/tracker";
import Link from "next/link";

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
  const stat = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between py-1">
      <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
        {label}
      </span>
      <span className="font-semibold text-primary">{value}</span>
    </div>
  );

  // Helper for ordinal suffix
  function getOrdinalSuffix(number: number): string {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }

  // Helper for exhibitor count
  function formatExhibitorCount(value: string | number | null): string {
    if (value === null || value === undefined) return "--";
    const stringValue = String(value);
    const values = stringValue.split("-");
    if (values.length === 2 && values[0] === values[1]) {
      return Number(values[0]).toLocaleString();
    }
    return stringValue.toLocaleString();
  }

  // Helper for match keywords color
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

  // Category badges (primary event type and first category)
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
        className="text-gray-600 rounded-sm px-2 py-0.5 text-xs font-medium"
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
    ? formatLocationParts(event.basic.eventLocation, true)
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
      rankDisplay = `${event.insights.rankings.rank}${getOrdinalSuffix(
        event.insights.rankings.rank
      )} ${(event.insights.rankings as any).rankType || "Country"} Rank`;
    } else if (
      "country" in event.insights.rankings &&
      event.insights.rankings.country &&
      typeof event.insights.rankings.country.rank === "number"
    ) {
      rankDisplay = `${event.insights.rankings.country.rank}${getOrdinalSuffix(
        event.insights.rankings.country.rank
      )} Country Rank`;
    }
  }

  // Entry type badges
  let entryTypeBadges = null;
  if (showValues.includes(Show.entryType)) {
    if (event.basic.entryType === "free_and_paid") {
      entryTypeBadges = (
        <>
          <Badge
            variant="outline"
            className="text-gray-600 capitalize rounded-sm text-xs font-medium mr-1"
          >
            Free
          </Badge>
          <Badge
            variant="outline"
            className="text-gray-600 capitalize rounded-sm text-xs font-medium"
          >
            Paid
          </Badge>
        </>
      );
    } else if (event.basic.entryType === "paid") {
      entryTypeBadges = (
        <Badge
          variant="outline"
          className="text-gray-600 capitalize rounded-sm text-xs font-medium"
        >
          Paid
        </Badge>
      );
    }
  }

  // Maturity, frequency, branded, series, forecasted
  const extraBadges = [
    showMaturity && event.advance?.maturity && (
      <Badge
        key="maturity"
        variant="outline"
        className="text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        {event.advance?.maturity}
      </Badge>
    ),
    showValues.includes(Show.frequency) && event.advance?.frequency && (
      <Badge
        key="frequency"
        variant="outline"
        className="text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        {event.advance?.frequency}
      </Badge>
    ),
    showValues.includes(Show.branded) && event.advance?.isBranded && (
      <Badge
        key="branded"
        variant="outline"
        className="text-[#DF2670] border-[#F9D7E2] bg-[#FEECF2] capitalize rounded-sm text-xs font-medium"
      >
        Branded
      </Badge>
    ),
    showValues.includes(Show.series) && event.advance?.isSeries && (
      <Badge
        key="series"
        variant="outline"
        className="text-[#0D8C7D] border-[#BEF4EB] bg-[#E5FAF6] capitalize rounded-sm text-xs font-medium"
      >
        Series
      </Badge>
    ),
    showValues.includes(Show.forecasted) && event.advance?.rehostDate && (
      <Badge
        key="forecasted"
        variant="outline"
        className="text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        Forecasted:{" "}
        {event.advance?.rehostDate
          ? new Date(event.advance?.rehostDate).toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          : ""}
      </Badge>
    ),
  ].filter(Boolean);

  // Rankings, trust score, reputation score
  const rankingBadge = showValues.includes(Show.rankings) &&
    event.insights?.rankings &&
    rankDisplay !== "-" && (
      <Badge
        variant="outline"
        className="text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        {rankDisplay}
      </Badge>
    );
  const trustScoreBadge =
    showValues.includes(Show.rankings) &&
    event.insights?.trustScore &&
    event.insights?.trustScore > 0 ? (
      <Badge
        variant="outline"
        className="text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        Trust Score: {event.insights?.trustScore}
      </Badge>
    ) : (
      ""
    );

  const reputationScoreBadge = showValues.includes(Show.rating) &&
    event.insights?.reputationScore && (
      <Badge
        variant="outline"
        className="text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        Reputation Score: {event.insights?.reputationScore}
      </Badge>
    );

  // Match keywords
  const matchKeywordsBadge = showMatchKeywords &&
    event.basic.matchedKeywords &&
    event.basic.matchedKeywords.length > 0 && (
      <Badge
        variant="outline"
        className="flex items-center gap-2 text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        Match Keyword: {event.basic.matchedKeywords?.join(" | ")}
      </Badge>
    );
  const matchKeywordsScoreBadge = showMatchKeywords && (
    <Badge
      variant="outline"
      className={`flex items-center gap-2 text-gray-600 capitalize rounded-sm text-xs font-medium ${getMatchKeywordsColor(
        event.basic.matchedKeywordsPercentage ?? null
      )}`}
    >
      {(() => {
        const percentage = event.basic.matchedKeywordsPercentage ?? null;
        if (percentage === null) return "-";
        if (percentage > 20) return <span>High</span>;
        if (percentage >= 10 && percentage <= 20) return <span>Medium</span>;
        if (percentage > 0 && percentage < 10) return <span>Low</span>;
        return "-";
      })()}
    </Badge>
  );

  const audienceZone = showValues.includes(Show.audienceZone) &&
    event.audience?.audienceZone && (
      <Badge variant="outline" className="text-gray-600 capitalize">
        {event.audience.audienceZone} Audience
      </Badge>
    );

  const ratingBadge = showValues.includes(Show.rating) &&
  event.basic.rating &&
  event.basic.rating > 0 ? (
    <Badge
      variant="outline"
      className="text-gray-600 capitalize rounded-sm"
    >
      <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
      <span>{event.basic.rating}</span>
    </Badge>
  ) : (
    ""
  )

  // Audience spread
  const audienceSpreadBadge = showaudienceSpread &&
    event.audience?.audienceSpread && (
      <Badge
        variant="outline"
        className="flex items-center gap-2 text-gray-600 capitalize rounded-sm text-xs font-medium"
      >
        <div className="flex gap-1">
          {Object.entries(event.audience.audienceSpread)
            .slice(0, 5)
            .map(([key, { iso, name }]) => {
              const countryIso = iso === "UK" ? "GB" : iso;
              const Flag = (require("country-flag-icons/react/3x2") as any)[
                countryIso
              ];
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
    );

  if (event.basic.primaryEventType == "holiday") {
    return <UnplannedCard event={event} />;
  }

  return (
      <Link href={`/internal/event/${event.basic.id}`} className="block">
    <div className="bg-background rounded-lg shadow border border-border dark:border-[#232323] p-4 flex flex-col gap-3 w-full">
      <div className="text-sm text-gray-600">{date}</div>
      {/* Top: Logo & Name */}
      <div className="flex items-center gap-3">
        {/* Logo logic with fallback */}
        {event.basic.logoUrl ? (
          <img
            src={event.basic.logoUrl || "/placeholder.svg"}
            alt={event.basic.name}
            className="w-16 h-16 rounded-md object-contain border border-border dark:border-[#232323] bg-background dark:bg-[#232323]"
          />
        ) : event.basic.website ? (
          <div className="w-16 h-16 relative">
            <img
              src={`https://logo.clearbit.com/${event.basic.website}&size=64`}
              alt={`${event.basic.name} website favicon`}
              className="w-16 h-16 object-contain border border-border dark:border-[#232323] rounded-md bg-background dark:bg-[#232323]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.dataset.error = "true";
              }}
            />
            {/* Fallback that shows when image errors */}
            <div
              className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0 dark:bg-[#232323] dark:border-[#232323]"
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
          <div className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center dark:bg-[#232323] dark:border-[#232323]">
            <span className="text-[#5055A3] text-lg font-semibold">
              {event.basic.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-xl leading-tight text-gray-900 dark:text-gray-100">
            {event.basic.name}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300">{location}</div>

      <div className="flex gap-2 mt-1 flex-wrap">
        {categories}
        {ratingBadge}
        {entryTypeBadges}
        {extraBadges}
        {rankingBadge}
        {audienceZone}
        {trustScoreBadge}
        {reputationScoreBadge}
        {matchKeywordsBadge}
        {matchKeywordsScoreBadge}
        {audienceSpreadBadge}
      </div>
      {/* Date & Location */}
      {/* Stats */}
      <div className="flex flex-col gap-1">
        {showValues.includes(Show.estimatedExhibitors) &&
          stat(
            "Estimated Exhibitors",
            event.insights?.estimatedExhibitors !== undefined &&
              event.insights?.estimatedExhibitors !== null &&
              event.insights?.estimatedExhibitors !== ""
              ? formatExhibitorCount(event.insights?.estimatedExhibitors)
              : "-"
          )}
        {stat(
          "Estimated Visitors",
          event.insights?.estimatedAttendance?.toLocaleString() ?? "-"
        )}
        {showValues.includes(Show.economicImpact) &&
          stat(
            "Economic Impact",
            event.insights?.economicImpact
              ? formatEstimatedSpend(event.insights.economicImpact)
              : "-"
          )}
      </div>
      {/* Insights & Scores */}
      {showValues.includes(Show.scores) && (
        <div className="flex justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Insights & Scores
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-col items-center flex-1">
              <div className="text-[11px] mb-1 border border-border dark:border-[#232323] px-1 bg-white dark:bg-[#171717]">Inbound</div>
              <CircularProgress value={inbound} />
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="text-[11px] mb-1 border border-border dark:border-[#232323] px-1 bg-white dark:bg-[#171717]">International</div>
              <CircularProgress value={international} />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end">
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
    </div>
      </Link>
  );
};

const UnplannedCard = ({ event }: { event: Event }) => {
  const { getFilterValue } = useFilterState();
  const { data, setIsNewCall } = useTrackerContext();

  const trackerLocationIds = Object?.keys(
    data?.filterValues?.locationIds || {}
  );

  const date = formattedDateRange(
    event.basic.startDateTime,
    event.basic.endDateTime
  );
  const location = event.basic.eventLocation
    ? formatLocationParts(event.basic.eventLocation, true)
    : "Venue to be announced";

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

  const showHolidayScore =
    getFilterValue("locationIds").split(",").filter(Boolean).length == 1 ||
    trackerLocationIds.length == 1;

  const business = (event.basic?.eventLocation as any)[0]?.businessScore;
  const social = (event.basic?.eventLocation as any)[0]?.socialScore;

  return (
    <div className="bg-background dark:bg-[#171717] rounded-lg shadow border border-border dark:border-[#232323] p-4 flex flex-col gap-3 w-full">
      <div className="text-sm text-gray-500 dark:text-gray-400">{date}</div>
      {/* Top: Logo & Name */}
      <div className="flex items-center gap-3">
        {/* Logo logic with fallback */}
        {event.basic.logoUrl ? (
          <img
            src={event.basic.logoUrl || "/placeholder.svg"}
            alt={event.basic.name}
            className="w-16 h-16 rounded-md object-contain border border-border dark:border-[#232323] bg-background dark:bg-[#232323]"
          />
        ) : event.basic.website ? (
          <div className="w-16 h-16 relative">
            <img
              src={`https://logo.clearbit.com/${event.basic.website}&size=64`}
              alt={`${event.basic.name} website favicon`}
              className="w-16 h-16 object-contain border border-border dark:border-[#232323] rounded-md bg-background dark:bg-[#232323]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.dataset.error = "true";
              }}
            />
            {/* Fallback that shows when image errors */}
            <div
              className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0 dark:bg-[#232323] dark:border-[#232323]"
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
          <div className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center dark:bg-[#232323] dark:border-[#232323]">
            <span className="text-[#5055A3] text-lg font-semibold">
              {event.basic.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-xl leading-tight text-gray-900 dark:text-gray-100">
            {event.basic.name}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-1 flex-wrap">{categories}</div>
      {/* Date & Location */}
      <div className="text-sm text-gray-700 dark:text-gray-300">{location}</div>
      {/* Stats */}
      {/* Insights & Scores */}
      {showHolidayScore && (
        <div className="flex justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Insights & Scores
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-col items-center flex-1">
              <div className="text-[11px] mb-1 border border-border dark:border-[#232323] px-1 bg-white dark:bg-[#171717]">Social</div>
              <CircularProgress value={social} />
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="text-[11px] mb-1 border border-border dark:border-[#232323] px-1 bg-white dark:bg-[#171717]">Business</div>
              <CircularProgress value={business} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileEventCard;
