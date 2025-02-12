import type React from "react";
import styles from "./table.module.css";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EventTableHeaderProps {}

export const EventTableHeader: React.FC<EventTableHeaderProps> = () => (
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
      <TableHead>Keywords</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Event Size</TableHead>
      <TableHead>Est. Exhibitor</TableHead>
      <TableHead>Rank</TableHead>
      <TableHead>Reputation</TableHead>
      <TableHead style={{ textAlign: "center" }}>Rating</TableHead>
      <TableHead style={{ textAlign: "center" }}>Trust</TableHead>
      <TableHead className="text-center">Frequency</TableHead>
      <TableHead>Forecasted</TableHead>
      <TableHead>Matched</TableHead>
      <TableHead>Score</TableHead>

      {/* {(type === "T_SPEAKING_OPPORTUNITY" ||
        type === "T_COMPETITOR" ||
        type === "T_PEOPLE_FINDER" ||
        type === "T_CUSTOMER_ICP" ||
        type === "T_RECRUITMENT") &&
        path[path.length - 1] !== "savedEvents" && (
          <>
            <TableHead
              className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
              style={{ right: "150px", minWidth: "60px" }}
            >
              Matched
            </TableHead>
            <TableHead
              className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
              style={{
                right: "50px",
                minWidth: "100px",
                textAlign: "center",
              }}
            >
              Score
            </TableHead>
          </>
        )} */}

      {/* {type === "T_PRODUCT_KEYWORDS" &&
        path[path.length - 1] !== "savedEvents" && (
          <>
            <TableHead
              className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
              style={{
                right: appliedKeywords?.length >= 5 ? "150px" : "50px",
                minWidth: "60px",
              }}
            >
              Matched
            </TableHead>
            {appliedKeywords?.length >= 5 && (
              <TableHead
                className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
                style={{
                  right: "50px",
                  minWidth: "100px",
                  textAlign: "center",
                }}
              >
                Score
              </TableHead>
            )}
          </>
        )} */}
      <TableHead>Maturity</TableHead>
      <TableHead>Impact Score</TableHead>
      <TableHead>Inbound Score</TableHead>
      <TableHead>International Score</TableHead>
      <TableHead>Audience Zone</TableHead>
      <TableHead>Audience Spread</TableHead>
      <TableHead
        className={`${styles.table_actionColumn} ${styles.bookmarkColumn}`}
        style={{ display: "flex" }}
      >
        {/* Actions */}
      </TableHead>
    </TableRow>
  </TableHeader>
);
