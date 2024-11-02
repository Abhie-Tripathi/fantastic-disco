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
import { useFilterState } from "@/hooks/useFilterState";

const eventStatuses = [
  { id: "ACTIVE", label: "Active" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "POSTPONED", label: "Postponed" },
  { id: "PREDICTED", label: "Predicted" },
];
interface StatusSelectorProps{
  source: string;
  selectedStatuses?: string[];
  setSelectedStatuses?: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function StatusSelector({
  source,
  selectedStatuses: parentSelectedFormats = [],
  setSelectedStatuses: parentSetSelectedFormats,
}: StatusSelectorProps) {
  const { setFilter, getFilterValue, searchParams } = useFilterState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFormatsLocal, setSelectedFormatsLocal] = React.useState<string[]>(
    []
  );

  const selectedStatuses =
    source === "tracker" ? parentSelectedFormats : selectedFormatsLocal;
  const setSelectedStatuses =
    source === "tracker" ? parentSetSelectedFormats : setSelectedFormatsLocal;

    useEffect(() => {
      if(source!=="tracker" && setSelectedStatuses){
      const currentFilter = getFilterValue("status");
      setSelectedStatuses(currentFilter ? currentFilter.split(",") : []);
      }
    }, [searchParams, getFilterValue]);
  
    const selectedStatus = selectedStatuses.length;
  
    const handleStatusToggle = (statusId: string) => {
      if(setSelectedStatuses)
      setSelectedStatuses((prev) =>
        prev.includes(statusId)
          ? prev.filter((id) => id !== statusId)
          : [...prev, statusId]
      );
    };
  
    // const handleSelectAll = (checked: boolean) => {
    //   setSelectedStatuses(
    //     checked ? eventStatuses.map((status) => status.id) : []
    //   );
    // };
  
    // const isAllSelected = selectedStatuses.length === eventStatuses.length;
  
    const handleApply = () => {
      if(source!=="tracker")
      setFilter("status", selectedStatuses.join(","));
      setIsOpen(false);
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

        <div className="p-2 space-y-2">
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