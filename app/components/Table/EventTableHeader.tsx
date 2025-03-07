import type React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Show } from "@/types/events/dto/event-query.dto";
import { Filters } from "@/context/filterContext";
interface EventTableHeaderProps {
  show: Show[];
  type?: string;
  view?:string;
  localFilters: Filters;
  trackerId?:string;
}

export const EventTableHeader: React.FC<EventTableHeaderProps> = ({ show, type, view, localFilters, trackerId }) => {
  console.log(view);
  
  return (
    <TableHeader>
      <TableRow className="bg-[var(--heading-background-color)] hover:bg-muted/50">
        <TableHead
          className="sticky left-0 bg-[var(--heading-background-color)] max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-10 after:absolute after:inset-0 after:bg-[var(--heading-background-color)] "
          style={{ zIndex: 0 }}
        >
          <div className="font-medium text-md text-foreground relative z-[999]">
            Event
          </div>
        </TableHead>
        <TableHead className="min-w-[120px] h-10">
          <div className="font-medium text-foreground ">Date</div>
        </TableHead>
        <TableHead className="min-w-[150px] h-10">
          <div className="font-medium text-foreground ">Venue</div>
        </TableHead>
        <TableHead className="min-w-[120px] h-10">
          <div className="font-medium text-foreground ">City</div>
        </TableHead>
        <TableHead className="min-w-[120px] h-10">
          <div className="font-medium text-foreground ">Country</div>
        </TableHead>
        <TableHead className="min-w-[120px] h-10">
          <div className="font-medium text-foreground ">Keywords</div>
        </TableHead>
        <TableHead className="min-w-[150px] h-10">
          <div className="font-medium text-foreground ">Category</div>
        </TableHead>

        <TableHead className="min-w-[120px] h-10">
          <div className="font-medium text-foreground ">Est. Visitors</div>
        </TableHead>
    {view!=="bookmarked" &&
    <>
        {show.includes(Show.estimatedExhibitors) &&  (
          <TableHead className="min-w-[130px] h-10">
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
        {show.includes(Show.rankings) && (
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

        {localFilters.includeKeywords && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Matched</div>
          </TableHead>
        )}

        {localFilters.includeKeywords && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Match Score</div>
          </TableHead>
        )}

        {show.includes(Show.maturity) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Maturity</div>
          </TableHead>
        )}
        {/* {show.includes(Show.scores) && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Impact</div>
          </TableHead>
        )} */}
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
        {localFilters.audienceSpread && (
          <TableHead className="min-w-[150px] text-center">
            <div className="font-medium text-foreground ">Audience Spread</div>
          </TableHead>
        )}
    </>
    }
    {trackerId &&
    <TableHead className="sticky right-[68px] bg-[var(--heading-background-color)] z-40 h-12"
          style={{ zIndex: 0 }}>
           <div className="font-medium text-foreground text-center">Matched</div>
    </TableHead>
    }
    {(type && type!=="T_CUSTOM" && view!=="bookmarked") &&
        <>
         <TableHead className="sticky right-[200px] z-40 h-12 bg-[var(--heading-background-color)]" style={{ zIndex: 0}}>
           <div className="font-medium text-foreground text-center">Matched</div>
          </TableHead>

        <TableHead className="sticky right-[68px] z-40 h-12 w-[150px] bg-[var(--heading-background-color)]" style={{ zIndex: 0 }}>
        <div className="font-medium text-foreground text-center">Score</div>
        </TableHead>
        <TableHead
          className="sticky right-0 bg-[var(--heading-background-color)]/50 z-40 h-12"
          style={{ zIndex: 0 }}
        >
          {/* Actions */}
        </TableHead>
        </>
          }
      </TableRow>
    </TableHeader>
  );
};
