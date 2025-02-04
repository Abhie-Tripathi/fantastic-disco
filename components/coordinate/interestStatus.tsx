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

const eventStatuses = [
  { id: "PENDING", label: "Pending" },
  { id: "SHORTLISTED", label: "Shortlisted" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "REJECTED", label: "Rejected" },
];

interface Props {
  pipelineConfig: any;
}

export default function InterestStatusSelector( {pipelineConfig} : Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { localFilters, setLocalFilter, applyFilters } =
    useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (localFilters?.status)
      GAEvent("Coordinate", "Filter", "Coordinate", "Coordinate | Status | Auto Applied");

    setSelectedStatuses(localFilters?.status?.split(",") || []);
  }, [localFilters.status]);

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
    setLocalFilter("status", selectedStatuses.join(","));
    setIsOpen(false);
    applyFilters();
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
            <span className="mr-2">Status</span>
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
        <div className="p-2 space-y-2">
          {pipelineConfig.map((item: any) => (
            <div key={item.status} className="flex items-center space-x-2">
              <Checkbox
                id={item.status}
                className="rounded-none"
                checked={selectedStatuses.includes(item.status)}
                onCheckedChange={() => handleStatusToggle(item.status)}
              />
              <label
                htmlFor={item.status}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
