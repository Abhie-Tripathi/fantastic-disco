import type React from "react"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EventTableHeaderProps {
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
    audienceZone: boolean
    audienceSpread: boolean
  }
}

export const EventTableHeader: React.FC<EventTableHeaderProps> = ({ showInsights }) => (
  <TableHeader>
    <TableRow>
      <TableHead>Event</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Venue</TableHead>
      <TableHead>City</TableHead>
      <TableHead>Country</TableHead>
      {showInsights.eventKeywords && <TableHead>Keywords</TableHead>}
      <TableHead>Category</TableHead>
      {showInsights.eventSize && <TableHead>Event Size</TableHead>}
      {showInsights.estExhibit && <TableHead>Est. Exhibitor</TableHead>}
      {showInsights.eventRank && <TableHead>Rank</TableHead>}
      {showInsights.reptSent && <TableHead>Reputation</TableHead>}
      {showInsights.eventRating && <TableHead>Rating</TableHead>}
      {showInsights.repeatSent && <TableHead>Trust</TableHead>}
      {showInsights.eventFrequency && <TableHead>Frequency</TableHead>}
      {showInsights.forecasted && <TableHead>Forecasted</TableHead>}
      {showInsights.audienceZone && <TableHead>Audience Zone</TableHead>}
      {showInsights.audienceSpread && <TableHead>Audience Spread</TableHead>}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
)

