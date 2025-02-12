import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PaginationComponent } from "@/components/pagination";
import { Event, Ranking } from "@/types/events";
import styles from "./table.module.css";
import { EventTableRow } from "./EventTableRow";
import { useEvents } from "@/hooks/useEvents";
import { useTheme } from "@/context";
import { EventTableHeader } from "./EventTableHeader";

const EventTable = () => {
  const { theme } = useTheme();
  const { events, totalEvents, isLoading, error } = useEvents.list();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: string) => {
    setItemsPerPage(parseInt(itemsPerPage));
  };

  return (
    <div className={styles.table_container}>
      <div
        className={`${styles.table_wrapper} ${
          theme === "light" ? styles.table_wrapper_light : ""
        }`}
      >
        <Table className={styles.table}>
          <EventTableHeader />
          <TableBody className={styles.table_body}>
            {events.map((event: Event) => (
              <EventTableRow event={event} />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-background py-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            count={totalEvents}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default EventTable;
