import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PaginationComponent } from "@/components/pagination";
import { Event, Ranking } from "@/types/events";
import styles from "./table.module.css";
import { EventTableRow } from "./EventTableRow";
import { useEvents } from "@/hooks/useEvents";
import { useTheme } from "@/context";
import { EventTableHeader } from "./EventTableHeader";
import { useFilterState } from "@/hooks/useFilterState";
import Loading from "@/components/ui/Loading";
import ZeroState from "@/components/zerostate";
import { ApiError } from "@/types/api";

const EventTable = () => {
  const { theme } = useTheme();
  const { searchParams, getFilterValue, setMultipleFilters } = useFilterState();

  const query = Object.fromEntries(searchParams.entries());
  query.view = "list";

  const { events, totalEvents, isLoading, error } = useEvents.list(query);

  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  const handlePageChange = (page: number) => {
    setMultipleFilters({
      skip: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      skip: "0",
      limit: newItemsPerPage,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ZeroState text={(error as ApiError).message} />;
  }

  if (events.length === 0) {
    return <ZeroState text="No events found" />;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border bg-background">
        <div className="overflow-auto max-h-[calc(100vh-264px)]">
          <Table>
            <EventTableHeader events={events} />
            <TableBody>
              {events.map((event: Event) => (
                <EventTableRow key={event.basic.id} event={event} />
              ))}
            </TableBody>
          </Table>
        </div>
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
