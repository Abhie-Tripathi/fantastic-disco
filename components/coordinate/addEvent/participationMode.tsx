"use client";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import { GAEvent } from "@/utils/GAEvent";

// const eventStatuses = [
//   { id: "me", label: "By me" },
//   { id: "others", label: "By others" },
// ];

const eventStatuses = [
  { label: "Attendee", id: "Attendee" },
  { label: "Speaker", id: "Speaker" },
  { label: "Exhibitor", id: "Exhibitor" },
  { label: "Organiser", id: "Organiser" },
];

export default function ParticipationMode() {
  const [isOpen, setIsOpen] = useState(false);
  const { localFilters, setLocalFilter, applyFilters } = useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // useEffect(() => {
  //   if (localFilters?.upvotedBy)
  //     GAEvent("Coordinate", "Filter", "Coordinate", "Coordinate | Upvote | Auto Applied");

  //   setSelectedStatuses(localFilters?.upvotedBy?.split(",") || []);
  // }, [localFilters.upvotedBy]);

  const selectedStatus = selectedStatuses.length;

  const handleStatusToggle = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStatuses(
      checked ? eventStatuses.map((status) => status.id) : []
    );
  };

  const handleApply = () => {
    // setLocalFilter("upvotedBy", selectedStatuses.join(","));
    setIsOpen(false);
    // applyFilters();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-4 text-[var(--tertiary-text-color)]">Choose Your Mode of Participation</span>
            {selectedStatus > 0 && (
              // <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
              //   {selectedStatus}
              // </span>
              <span className="text-xs font-semibold text-primary">{selectedStatuses[0]}</span>
            )}
          </div>
          {/* <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-3 space-y-2">
          {eventStatuses.map((status) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox
                id={status.id}
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
