import type React from "react";
import styles from "./table.module.css";
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
    <TableHeader className={styles.table_head}>
      <TableRow className={styles.table_head_row}>
        <TableHead
          className={`${styles.table_firstColumn} ${styles.table_actionColumn}`}
        >
          Event
        </TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Venue</TableHead>
        <TableHead>City</TableHead>
        <TableHead>Country</TableHead>
        {/* {hasField("insights.keywords") && <TableHead>Keywords</TableHead>} */}
        <TableHead>Category</TableHead>
        {hasField("insights.estimatedAttendance") && (
          <TableHead>Event Size</TableHead>
        )}
        {hasField("advance.estimatedExhibitors") && (
          <TableHead>Est. Exhibitors</TableHead>
        )}
        {hasField("insights.rankings") && <TableHead>Rank</TableHead>}
        {hasField("insights.repeatSentiment") && (
          <TableHead>Reputation</TableHead>
        )}
        {hasField("insights.reputationScore") && (
          <TableHead>Event Rating</TableHead>
        )}
        {hasField("insights.trustScore") && <TableHead>Trust</TableHead>}
        {hasField("advance.frequency") && <TableHead>Frequency</TableHead>}
        <TableHead>Forecasted</TableHead>
        {hasField("advance.maturity") && <TableHead>Maturity</TableHead>}
        {hasField("insights.scores.impactScore") && <TableHead>Impact</TableHead>}
        {hasField("insights.scores.inboundScore") && <TableHead>Inbound</TableHead>}
        {hasField("insights.scores.internationalScore") && (
          <TableHead>International</TableHead>
        )}
        {hasField("insights.economicImpact") && (
          <TableHead>Economic Impact</TableHead>
        )}
        {hasField("audience.audienceZone") && <TableHead>Audience Zone</TableHead>}
        {hasField("audience.audienceSpread") && (
          <TableHead>Audience Spread</TableHead>
        )}
        <TableHead
          className={`${styles.table_actionColumn} ${styles.bookmarkColumn}`}
        >
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
