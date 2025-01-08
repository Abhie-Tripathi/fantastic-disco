"use client";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import enabledFilters from "@/public/data/enabledFilters";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import { isEventeli } from "@/config";
import {EventType} from "@/public/data/searchFilters"
// const eventStatuses = isEventeli
//   ? [
//       { id: "active", label: "Active", disabled:  },
//       { id: "cancelled", label: "Cancelled" },
//       { id: "postponed", label: "Postponed" },
//       { id: "predicted", label: "Predicted" },
//     ]
//   : [
//       { id: "active", label: "Active" },
//       { id: "cancelled", label: "Cancelled" },
//       { id: "postponed", label: "Postponed" },
//     ];
export default function StatusSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const eventStatuses = morphedData.eventStatus.options;
  const enabled = morphedData.eventStatus.isEnabled;
  const selectedStatuses = getLocalFilterValue("status")
    .split(",")
    .filter(Boolean);
  const selectedStatus = selectedStatuses.length;

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setLocalFilter("status", newStatuses.join(","));
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">Event Status</span>
            {selectedStatus > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedStatus}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        {/* <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Location</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div> */}

        <div className="p-4 space-y-4">
          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              className="rounded-none"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </label>
          </div> */}
          {eventStatuses?.map((status:EventType) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox
                id={status.id}
                disabled={!status.isEnabled}
                className="rounded-none"
                checked={selectedStatuses.includes(status.id)}
                onCheckedChange={() => handleStatusToggle(status.id)}
              />
              <label
                htmlFor={status.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {status.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
