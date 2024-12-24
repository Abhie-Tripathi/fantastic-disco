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

const visitorRanges = [
  { id: "0-500", label: "0 - 500", min: 0, max: 500 },
  { id: "500-1k", label: "500 - 1k", min: 500, max: 1000 },
  { id: "1k-5k", label: "1k - 5k", min: 1000, max: 5000 },
  { id: "5k-10k", label: "5k - 10k", min: 5000, max: 10000 },
  { id: "10k-25k", label: "10k - 25k", min: 10000, max: 25000 },
  { id: "25k-50k", label: "25k - 50k", min: 25000, max: 50000 },
  { id: "50k-100k", label: "50k - 100k", min: 50000, max: 100000 },
  { id: "100k-200k", label: "100k - 200k", min: 100000, max: 200000 },
  { id: "200k+", label: "200k+", min: 200000, max: Infinity },
];

export default function EstimatedVisitorsSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();

  // Derive selected ranges from estimatedVisitors filter
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
          {visitorRanges.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <Checkbox
                id={range.id}
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
