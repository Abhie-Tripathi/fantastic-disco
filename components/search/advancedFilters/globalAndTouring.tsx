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

const globalAndTourings = [
  { id: "BRANDED", label: "Branded" },
  { id: "SERIES", label: "Series" },
];

export default function GlobalAndTouringSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setMultipleLocalFilters, setLocalFilter, getLocalFilterValue } =
    useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showInFilter, setShowInFilter] = useState(false);

  useEffect(() => {
    const onlyBranded = getLocalFilterValue("onlyBranded") === "true";
    const onlySeries = getLocalFilterValue("onlySeries") === "true";
    const showFilter = getLocalFilterValue("show");

    setSelectedStatuses([
      ...(onlyBranded ? ["BRANDED"] : []),
      ...(onlySeries ? ["SERIES"] : []),
    ]);

    setShowInFilter(
      showFilter.includes("branded") && showFilter.includes("series")
    );
  }, [getLocalFilterValue]);

  const handleStatusToggle = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleApply = () => {
    setMultipleLocalFilters({
      onlyBranded: selectedStatuses.includes("BRANDED") ? "true" : "",
      onlySeries: selectedStatuses.includes("SERIES") ? "true" : "",
    });

    const showFilter = getLocalFilterValue("show");
    setShowInFilter(
      showFilter.includes("branded") && showFilter.includes("series")
    );
  };

  const handleShowToggle = (checked: boolean) => {
    setShowInFilter(checked);
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "branded", "series"])) // {{ edit_1 }}
      : currentShow.filter((item) => !["branded", "series"].includes(item));
    setLocalFilter("show", newShow.join(","));
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
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          <span className="flex items-center gap-2">
            Brand
            {selectedStatuses.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-primary-foreground">
                {selectedStatuses.length}
              </span>
            )}
          </span>
          <Switch
            checked={showInFilter}
            onCheckedChange={handleShowToggle}
            aria-label="Show Global & Touring in filter"
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
          {globalAndTourings.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={selectedStatuses.includes(item.id)}
                onCheckedChange={() => handleStatusToggle(item.id)}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
