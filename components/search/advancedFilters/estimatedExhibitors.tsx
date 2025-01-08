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
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";
import {EventType} from "@/public/data/searchFilters"
const exhibitorRanges = [
  { id: "0-100", label: "0-100", min: 0, max: 100 },
  { id: "100-500", label: "100-500", min: 100, max: 500 },
  { id: "500-1000", label: "500-1000", min: 500, max: 1000 },
  { id: "1000+", label: "1000+", min: 1000, max: Infinity },
];

export default function EstimatedExhibitorsSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const exhibitorOptions = morphedData.estimatedExhibitor.options;
  const enabled = morphedData.estimatedExhibitor.isEnabled;
  const showToogle = morphedData.estimatedExhibitor.isToogleEnabled;
  const selectedRanges = useMemo(
    () => getLocalFilterValue("estimatedExhibitors").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const showInFilter = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("estimatedExhibitors");
  }, [getLocalFilterValue]);

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];

    setLocalFilter("estimatedExhibitors", newRanges.join(","));
  };

  const handleShowToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "estimatedExhibitors"]))
      : currentShow.filter((item) => item !== "estimatedExhibitors");

    setLocalFilter("show", newShow.join(","));
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
            Estimated Exhibitors
            {selectedRanges.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedRanges.length}
              </span>
            )}
          </span>
          <Switch
            checked={showInFilter}
            onCheckedChange={handleShowToggle}
            aria-label="Show Estimated Exhibitors in filter"
            onClick={(e) => e.stopPropagation()}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-4 space-y-4">
          {exhibitorOptions.map((range: EventType) => (
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
