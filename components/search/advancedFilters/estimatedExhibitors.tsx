"use client";

import React, { useState, useEffect } from "react";
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

const exhibitorRanges = [
  { id: "0-100", label: "0-100", min: 0, max: 100 },
  { id: "100-500", label: "100-500", min: 100, max: 500 },
  { id: "500-1000", label: "500-1000", min: 500, max: 1000 },
  { id: "1000+", label: "1000+", min: 1000, max: Infinity },
];

export default function EstimatedExhibitorsSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [showInFilter, setShowInFilter] = useState(false);

  useEffect(() => {
    const estimatedExhibitors = getLocalFilterValue("estimatedExhibitors");
    if (estimatedExhibitors) {
      const ranges = estimatedExhibitors.split(",");
      const selected = exhibitorRanges.filter((range) =>
        ranges.some((r) => {
          const [min, max] = r.split("-").map(Number);
          return (
            range.min === min &&
            (range.max === max || (max === undefined && range.max === Infinity))
          );
        })
      );
      setSelectedRanges(selected.map((range) => range.id));
    } else {
      setSelectedRanges([]);
    }
    setShowInFilter(
      getLocalFilterValue("show").includes("estimatedExhibitors")
    );
  }, [getLocalFilterValue]);

  const handleRangeToggle = (rangeId: string) => {
    setSelectedRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleApply = () => {
    if (selectedRanges.length > 0) {
      const selectedRangesData = exhibitorRanges.filter((range) =>
        selectedRanges.includes(range.id)
      );
      const rangeStrings = selectedRangesData.map((range) =>
        range.max === Infinity ? `${range.min}` : `${range.min}-${range.max}`
      );
      setLocalFilter("estimatedExhibitors", rangeStrings.join(","));
    } else {
      setLocalFilter("estimatedExhibitors", "");
    }
    setIsOpen(false);
  };

  const handleShowToggle = (checked: boolean) => {
    setShowInFilter(checked);
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "estimatedExhibitors"]))
      : currentShow.filter((item: string) => item !== "estimatedExhibitors");
    setLocalFilter("show", newShow.join(","));
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleApply();
        setIsOpen(open);
      }}
    >
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.stopPropagation()
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-4 space-y-4">
          {exhibitorRanges.map((range) => (
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
