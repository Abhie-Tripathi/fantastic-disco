import type React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { EventTableType } from "@/types/ListViewTable"
import {
  formatDate,
  getEventSize,
  getEstimatedExhibitors,
  getLeastRank,
  getEventRating,
  getEventStatus,
} from "@/utils/eventHelpers"
import Link from "next/link"
import { ArrowUp, ArrowDown } from "lucide-react"

interface EventTableRowProps {
  event: EventTableType
  showInsights: {
    eventKeywords: boolean
    eventSize: boolean
    estExhibit: boolean
    eventRank: boolean
    reptSent: boolean
    eventRating: boolean
    repeatSent: boolean
    eventFrequency: boolean
    forecasted: boolean
    brandedEvent: boolean
    eventSeries: boolean
    audienceZone: boolean
    audienceSpread: boolean
  }
  onSaveEvent: (eventId: string) => void
  onDeleteEvent: (eventId: string) => void
}

export const EventTableRow: React.FC<EventTableRowProps> = ({ event, showInsights, onSaveEvent, onDeleteEvent }) => (
  <TableRow>
    <TableCell>
      <div>
        {showInsights.brandedEvent && event.eventBrand && <Badge variant="success">Brand</Badge>}
        {showInsights.eventSeries && event.isEventSeries && <Badge variant="info">Series</Badge>}
        <Badge variant={getEventStatus(event) === "HYBRID" ? "secondary" : "default"}>{getEventStatus(event)}</Badge>
      </div>
      <Link href={`/internal/event/${event.id}`}>{event.name}</Link>
      <div>{event.organizer?.name}</div>
    </TableCell>
    <TableCell>
      {event.status === "CANCELLED" || event.status === "POSTPONED" ? (
        <del title={event.status}>{formatDate(event.startDate, event.endDate)}</del>
      ) : (
        formatDate(event.startDate, event.endDate)
      )}
    </TableCell>
    <TableCell>
      {event.format === "HYBRID" && <Badge>Hybrid</Badge>}
      {event.location.venueName || (event.format === "ONLINE" ? "Online" : "TBA")}
    </TableCell>
    <TableCell>{event.location.cityName}</TableCell>
    <TableCell>{event.location.countryName}</TableCell>
    {showInsights.eventKeywords && <TableCell>{event.eventKeywords?.join(", ") || "-"}</TableCell>}
    <TableCell>{event.categories?.find((cat) => cat.isGroup)?.name || "-"}</TableCell>
    {showInsights.eventSize && <TableCell>{getEventSize(event) || "-"}</TableCell>}
    {showInsights.estExhibit && <TableCell>{getEstimatedExhibitors(event) || "-"}</TableCell>}
    {showInsights.eventRank && <TableCell>{getLeastRank(event.ranking) || "-"}</TableCell>}
    {showInsights.reptSent && (
      <TableCell>
        {event.reputationSentiment ? (
          <span className={event.reputationSentiment > 0 ? "text-green-500" : "text-red-500"}>
            {event.reputationSentiment}%
            {event.reputationSentiment > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </span>
        ) : (
          "-"
        )}
      </TableCell>
    )}
    {showInsights.eventRating && <TableCell>{getEventRating(event.stats.rating) || "-"}</TableCell>}
    {showInsights.repeatSent && <TableCell>{event.repeatSentiment ? `${event.repeatSentiment}%` : "-"}</TableCell>}
    {showInsights.eventFrequency && (
      <TableCell>{event.frequency ? <Badge variant="primary">{event.frequency}</Badge> : "-"}</TableCell>
    )}
    {showInsights.forecasted && <TableCell>{event.futureExpectedStartDate || "-"}</TableCell>}
    {showInsights.audienceZone && (
      <TableCell>{event.audienceZone ? <Badge variant="primary">{event.audienceZone}</Badge> : "-"}</TableCell>
    )}
    {showInsights.audienceSpread && (
      <TableCell>
        {event.audienceSpread ? (
          <div className="flex gap-2">
            {Object.entries(event.audienceSpread).map(([key, { iso, name, percentage }]) => (
              <Tooltip key={key}>
                <TooltipTrigger>
                  <img
                    src={`https://img.10times.com/img/flag/${iso.toLowerCase()}.jpg`}
                    alt={name}
                    width={25}
                    height={18}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {name}: {Math.round(percentage * 10) / 10}%
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ) : (
          "-"
        )}
      </TableCell>
    )}
    <TableCell>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (event.isSaved ? onDeleteEvent(event.id) : onSaveEvent(event.id))}
            >
              {event.isSaved ? "🔖" : "📌"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{event.isSaved ? "Remove from saved events" : "Save event"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  </TableRow>
)

