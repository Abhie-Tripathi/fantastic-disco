"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUp,
  ArrowDown,
  Check,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  ArrowDownUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useFilterState } from "@/hooks/useFilterState";
import { isEventeli } from "@/config";
import { cn } from "@/lib/utils";

interface SortOption {
  value: string;
  label: string;
}

const gtmSortOptions: SortOption[] = [
  { value: "score", label: "Popularity" },
  { value: "title", label: "Title" },
  { value: "start", label: "Start Date" },
  { value: "end", label: "End Date" },
  { value: "added", label: "Newly Added" },
  { value: "updated", label: "Last Updated" },
  { value: "visitors", label: "Estimated Visitors" },
  { value: "exhibitors", label: "Estimated Exhibitors" },
  { value: "distance", label: "Distance" },
  { value: "status", label: "Status" },
];

const geoSortOptions: SortOption[] = [
  { value: "score", label: "Popularity" },
  { value: "title", label: "Title" },
  { value: "start", label: "Start Date" },
  { value: "end", label: "End Date" },
  { value: "added", label: "Newly Added" },
  { value: "updated", label: "Last Updated" },
  { value: "visitors", label: "Estimated Visitors" },
  { value: "exhibitors", label: "Estimated Exhibitors" },
  { value: "inboundScore", label: "Inbound Score" },
  { value: "internationalScore", label: "International Score" },
  { value: "distance", label: "Distance" },
  { value: "status", label: "Status" },
];

interface SortDropdownProps {
  compact?: boolean;
  value?: string;
  onSort?: (value: string) => void;
}

const SortDropdown = ({
  compact = false,
  value,
  onSort,
}: SortDropdownProps) => {
  const { getFilterValue, setFilter } = useFilterState();
  const [open, setOpen] = useState(false);

  const sortParam = value || getFilterValue("sortBy") || "-score";
  const [sortField, setSortField] = useState(sortParam.replace("-", ""));
  const [sortOrder, setSortOrder] = useState(
    sortParam.startsWith("-") ? "desc" : "asc"
  );

  const sortOptions = isEventeli ? geoSortOptions : gtmSortOptions;

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortField);
    return option?.label || "Sort by";
  };

  const handleSortFieldChange = (field: string) => {
    setSortField(field);
    const sortValue = sortOrder === "desc" ? `-${field}` : field;
    if (onSort) {
      onSort(sortValue);
    } else {
      setFilter("sortBy", sortValue);
    }
    setOpen(false);
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    const sortValue = order === "desc" ? `-${sortField}` : sortField;
    if (onSort) {
      onSort(sortValue);
    } else {
      setFilter("sortBy", sortValue);
    }
  };

  useEffect(() => {
    const newSortParam = value || getFilterValue("sortBy") || "-score";
    setSortField(newSortParam.replace("-", ""));
    setSortOrder(newSortParam.startsWith("-") ? "desc" : "asc");
  }, [getFilterValue, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {compact ? (
          <Button
            id="sorting-dropdown-mobile"
            variant="ghost"
            size="xs"
            className="h-8 w-8 flex items-center gap-2 border"
          >
            {/* {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />} */}
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              {sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="hidden md:block">{getCurrentSortLabel()}</span>
            </span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="end">
        <div className="bg-white rounded-md shadow-sm">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium">Sort by</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 p-0",
                  sortOrder === "asc" && "bg-gray-100"
                )}
                onClick={() => handleSortOrderChange("asc")}
              >
                <ArrowUpNarrowWide className="h-4 w-4" />
                <span className="sr-only">Sort ascending</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 p-0",
                  sortOrder === "desc" && "bg-gray-100"
                )}
                onClick={() => handleSortOrderChange("desc")}
              >
                <ArrowDownNarrowWide className="h-4 w-4" />
                <span className="sr-only">Sort descending</span>
              </Button>
            </div>
          </div>
          <div className="py-1 max-h-[300px] overflow-y-auto">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 transition-colors",
                  sortField === option.value && "bg-gray-100"
                )}
                onClick={() => handleSortFieldChange(option.value)}
              >
                <div className="w-6 flex-shrink-0">
                  {sortField === option.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortDropdown;
