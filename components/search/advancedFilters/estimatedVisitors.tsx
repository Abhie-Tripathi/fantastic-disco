"use client";

import React, { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import {EventType} from "@/public/data/searchFilters"
// import { searchFilters } from "@/data/searchFilters";

export default function EstimatedVisitorsSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();

  const estimatedVisitorsOptions = morphedData?.estimatedVisitors?.options;
  const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("estimatedVisitors").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];

    setLocalFilter("estimatedVisitors", newRanges.join(","));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between px-3 py-5 text-base font-normal"
      >
        <span className="flex items-center gap-2">
          Estimated Visitors
          {selectedRanges.length > 0 && (
            <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
              {selectedRanges.length}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      className="w-[var(--radix-popover-trigger-width)] p-0"
      align="start"
    >
      <div className="p-4 space-y-4">
        {estimatedVisitorsOptions?.map((range:EventType) => (
          <div key={range.id} className="flex items-center space-x-2">
            <Checkbox
              id={range.id}
              disabled={!range.isEnabled}
              checked={selectedRanges.includes(range.id)}
              onCheckedChange={() => handleRangeToggle(range.id)}
            />
            <Label htmlFor={range.id}>{range.label}</Label>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
  );
}