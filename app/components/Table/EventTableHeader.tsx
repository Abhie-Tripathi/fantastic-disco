import type React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Show } from "@/types/events/dto/event-query.dto";
interface EventTableHeaderProps {
  show: Show[];
}

export const EventTableHeader: React.FC<EventTableHeaderProps> = ({ show }) => {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50 hover:bg-muted/50">
        <TableHead
          className="sticky left-0 bg-slate-50 dark:bg-slate-900  max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-20 after:absolute after:inset-0 after:bg-slate-50 dark:after:bg-slate-900"
          style={{ zIndex: 0 }}
        >
          <div className="font-medium text-md text-foreground relative z-[999]">
            Event
          </div>
        </TableHead>
        <TableHead className="min-w-[120px] h-20">
          <div className="font-medium text-foreground ">Date</div>
        </TableHead>
        <TableHead className="min-w-[150px] h-20">
          <div className="font-medium text-foreground ">Venue</div>
        </TableHead>
        <TableHead className="min-w-[120px] h-20">
          <div className="font-medium text-foreground ">City</div>
        </TableHead>
        <TableHead className="min-w-[120px] h-20">
          <div className="font-medium text-foreground ">Country</div>
        </TableHead>
        {/* {hasField("insights.keywords") && <TableHead>Keywords</TableHead>} */}
        <TableHead className="min-w-[150px] h-20">
          <div className="font-medium text-foreground ">Category</div>
        </TableHead>

        <TableHead className="min-w-[120px] h-20">
          <div className="font-medium text-foreground ">Est. Visitors</div>
        </TableHead>

        {show.includes(Show.estimatedExhibitors) && (
          <TableHead className="min-w-[130px] h-20">
            <div className="font-medium text-foreground ">Est. Exhibitors</div>
          </TableHead>
        )}
        {show.includes(Show.rankings) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Rank</div>
          </TableHead>
        )}
        {show.includes(Show.rating) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Event Rating</div>
          </TableHead>
        )}
        {show.includes(Show.trustScore) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Trust</div>
          </TableHead>
        )}
        {show.includes(Show.frequency) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Frequency</div>
          </TableHead>
        )}
        {show.includes(Show.forecasted) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Forecasted</div>
          </TableHead>
        )}
        {show.includes(Show.maturity) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Maturity</div>
          </TableHead>
        )}
        {show.includes(Show.scores) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Impact</div>
          </TableHead>
        )}
        {show.includes(Show.scores) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Inbound</div>
          </TableHead>
        )}
        {show.includes(Show.scores) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">International</div>
          </TableHead>
        )}
        {show.includes(Show.economicImpact) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Est. Impact ($)</div>
          </TableHead>
        )}
        {show.includes(Show.audienceZone) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Audience Zone</div>
          </TableHead>
        )}
        {show.includes(Show.audienceSpread) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Audience Spread</div>
          </TableHead>
        )}
        <TableHead
          className="sticky right-0 bg-muted/50 z-40 h-12"
          style={{ zIndex: 0 }}
        >
          {/* Actions */}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
