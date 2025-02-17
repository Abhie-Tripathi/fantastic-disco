import type React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/types/events";

interface EventTableHeaderProps {
  events: Event[];
}

export const EventTableHeader: React.FC<EventTableHeaderProps> = ({
  events,
}) => {
  const hasField = (path: string) => {
    return events.some((event) => {
      const parts = path.split(".");
      let value: any = event;
      for (const part of parts) {
        value = value?.[part];
      }
      return value !== undefined && value !== null;
    });
  };

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
        {hasField("insights.estimatedAttendance") && (
          <TableHead className="min-w-[120px] h-20">
            <div className="font-medium text-foreground ">Event Size</div>
          </TableHead>
        )}
        {hasField("advance.estimatedExhibitors") && (
          <TableHead className="min-w-[130px] h-20">
            <div className="font-medium text-foreground ">Est. Exhibitors</div>
          </TableHead>
        )}
        {hasField("insights.rankings") && (
          <TableHead>
            <div className="font-medium text-foreground ">Rank</div>
          </TableHead>
        )}
        {hasField("insights.repeatSentiment") && (
          <TableHead>
            <div className="font-medium text-foreground ">Reputation</div>
          </TableHead>
        )}
        {hasField("insights.reputationScore") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Event Rating</div>
          </TableHead>
        )}
        {hasField("insights.trustScore") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Trust</div>
          </TableHead>
        )}
        {hasField("advance.frequency") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Frequency</div>
          </TableHead>
        )}
        <TableHead className="min-w-[150px] text-center">
          <div className="font-medium text-foreground ">Forecasted</div>
        </TableHead>
        {hasField("advance.maturity") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Maturity</div>
          </TableHead>
        )}
        {hasField("insights.scores.impactScore") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Impact</div>
          </TableHead>
        )}
        {hasField("insights.scores.inboundScore") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Inbound</div>
          </TableHead>
        )}
        {hasField("insights.scores.internationalScore") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">International</div>
          </TableHead>
        )}
        {hasField("insights.economicImpact") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Economic Impact</div>
          </TableHead>
        )}
        {hasField("audience.audienceZone") && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Audience Zone</div>
          </TableHead>
        )}
        {hasField("audience.audienceSpread") && (
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
