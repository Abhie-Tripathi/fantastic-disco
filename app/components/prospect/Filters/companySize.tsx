"use client";

import React, { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

const filterData = [
  { id: "0-500", label: "1 - 10", min: 0, max: 500, isEnabled: true },
  { id: "11-20", label: "11 - 20", min: 11, max: 20, isEnabled: true },
  { id: "21-50", label: "21 - 50", min: 21, max: 50, isEnabled: true },
  { id: "51-100", label: "51 - 100", min: 51, max: 100, isEnabled: true },
  { id: "101-200", label: "101 - 200", min: 101, max: 200, isEnabled: true },
  { id: "201-500", label: "201 - 500", min: 201, max: 500, isEnabled: true },
  { id: "501-1000", label: "501 - 1000", min: 501, max: 1000, isEnabled: true },
  { id: "1001-2000", label: "1001 - 2000", min: 1001, max: 2000, isEnabled: true },
  { id: "2001-5000", label: "2001 - 5000", min: 2001, max: 5000, isEnabled: true },
  { id: "5001-10000", label: "5001 - 10000", min: 5001, max: 10000, isEnabled: true },
  { id: "10001", label: "10001+", min: 10001, max: Infinity, isEnabled: true },
];

export default function CompanySize() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const estimatedVisitorsOptions = filterData;
  // const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("companySize").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];

    setLocalFilter("companySize", newRanges.join(","));
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
