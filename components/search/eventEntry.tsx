import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {EventType} from "@/public/data/searchFilters"
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
// import { searchFilters } from "@/data/searchFilters";

export default function EventEntrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const eventEntries = morphedData?.eventEntries?.options;
  const enabled = morphedData?.eventEntries?.isEnabled || [];
  const selectedStatuses = getLocalFilterValue("entryType")
    .split(",")
    .filter(Boolean);
  const selectedStatus = selectedStatuses.length;

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setLocalFilter("entryType", newStatuses.join(","));
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  // console.log(EventEntries);
  
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
        disabled={!enabled}
      >
        <div className="flex items-center">
          <span className="mr-2">Event Entry</span>
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
      <div className="p-4 space-y-4">
        {eventEntries.map((eventEntry:EventType) => (
          <div
            key={eventEntry.id}
            className={`flex items-center space-x-2 ${
              !eventEntry.isEnabled ? "opacity-50" : ""
            }`}
          >
            <Checkbox
              id={eventEntry.id}
              className="rounded-none"
              checked={selectedStatuses.includes(eventEntry.id)}
              onCheckedChange={() => handleStatusToggle(eventEntry.id)}
              disabled={!eventEntry.isEnabled}
            />
            <label
              htmlFor={eventEntry.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {eventEntry.label}
            </label>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
  );
}