"use client";

import React, { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

const filterData = [
  { id: "0-1990", label: "<1991", min: 0, max: 1990, isEnabled: true },
  { id: "1991-2000", label: "1991 - 2000", min: 1991, max: 2000, isEnabled: true },
  { id: "2001-2010", label: "2001 - 2010", min: 2001, max: 2010, isEnabled: true },
  { id: "2011-2020", label: "2011 - 2020", min: 2011, max: 2020, isEnabled: true },
  { id: "2021-2030", label: "2021 - 2030", min: 2021, max: 2030, isEnabled: true },
  { id: "10001", label: "10001+", min: 10001, max: Infinity, isEnabled: true },
];

export default function EstablishedYear() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const estimatedVisitorsOptions = filterData;
  // const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("establishedYear").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];

    setLocalFilter("establishedYear", newRanges.join(","));
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
