"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  count: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (value: string) => void;
  showEntriesCount?: boolean;
  paginationItems?: string[];
}

export function PaginationComponent({
  currentPage,
  totalPages,
  itemsPerPage,
  count,
  onPageChange,
  onItemsPerPageChange,
  showEntriesCount = true,
  paginationItems = ["10", "20"],
}: PaginationComponentProps) {
  const pathname = usePathname();

  const hideLastPage =
    pathname === "/internal/search/companies" ||
    pathname === "/internal/search/people" ||
    pathname === "/internal/search/events" ||
    pathname.includes("/internal/trackers");

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationEllipsis />;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => onPageChange(1)}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">{ellipsis}</PaginationItem>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">{ellipsis}</PaginationItem>
        );
      }

      if (!hideLastPage) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(totalPages)}
              isActive={totalPages === currentPage}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
      {showEntriesCount && (
        <span className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left order-2 sm:order-1">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, count)} -{" "}
          {Math.min(currentPage * itemsPerPage, count)} of {count}
        </span>
      )}

      <Pagination className="order-1 sm:order-2 w-full sm:w-auto">
        <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-0">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={`${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              } text-xs sm:text-sm`}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={`${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              } text-xs sm:text-sm`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showEntriesCount && (
        <div className="flex items-center space-x-2 order-3">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Results/page</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={onItemsPerPageChange}
          >
            <SelectTrigger className="w-[60px] sm:w-[70px] h-8 sm:h-10">
              <SelectValue>{itemsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {paginationItems.map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
