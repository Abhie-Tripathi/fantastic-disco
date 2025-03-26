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
  hideLastPage?: boolean;
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
  hideLastPage = false,
}: PaginationComponentProps) {
  const pathname = usePathname();
  const hideLastPage = pathname === '/internal/search/companies' || pathname === '/internal/search/people';

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
    <div className="flex justify-between items-center gap-4 px-2">
      {showEntriesCount && (
        <span className="text-sm text-muted-foreground text-nowrap">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, count)} -{" "}
          {Math.min(currentPage * itemsPerPage, count)} of {count}
        </span>
      )}

      <Pagination>
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showEntriesCount && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Results/page 
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={onItemsPerPageChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue>{itemsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {paginationItems.map(item =>
                <SelectItem value={item} key={item}>{item}</SelectItem>
              )}
              {/* <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
