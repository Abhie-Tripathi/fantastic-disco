"use client";

import React, { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

const filterData = [
    { id: "organiser", label: "Organiser", isEnabled: true },
    { id: "exhibitor", label: "Exhibitor", isEnabled: true },
    { id: "sponsor", label: "Sponsor", isEnabled: true },
    { id: "speaker", label: "Speaker", isEnabled: true },
  ];

export default function ParticipationType() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const estimatedVisitorsOptions = filterData;
  // const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("eventParticipationType").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];

    setLocalFilter("eventParticipationType", newRanges.join(","));
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
