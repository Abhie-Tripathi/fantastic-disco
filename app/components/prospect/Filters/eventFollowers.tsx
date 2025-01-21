"use client";

import React, { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

const filterData = [
    { id: "0-500", label: "0 - 500", min: 0, max: 500, isEnabled: true },
    { id: "500-1000", label: "500 - 1k", min: 500, max: 1000, isEnabled: true },
    { id: "1000-5000", label: "1k - 5k", min: 1000, max: 5000, isEnabled: true },
    { id: "5000-10000", label: "5k - 10k", min: 5000, max: 10000, isEnabled: true },
    { id: "10000-25000", label: "10k - 25k", min: 10000, max: 25000, isEnabled: true },
    { id: "25000-50000", label: "25k - 50k", min: 25000, max: 50000, isEnabled: true },
    { id: "50000-100000", label: "50k - 100k", min: 50000, max: 100000, isEnabled: true },
    { id: "100000-200000", label: "100k - 200k", min: 100000, max: 200000, isEnabled: true },
    { id: "200000", label: "200k+", min: 200000, max: Infinity, isEnabled: true },
];

export default function EventFollowers() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const estimatedVisitorsOptions = filterData;
  // const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("eventFollowers").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];

    setLocalFilter("eventFollowers", newRanges.join(","));
  };

  return (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <div className="p-4 space-y-4">
        {estimatedVisitorsOptions?.map((range: EventType) => (
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
    </div>
  );
}
