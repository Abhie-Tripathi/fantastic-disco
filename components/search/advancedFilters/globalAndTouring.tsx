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

const globalAndTourings = [
  { id: "BRANDED", label: "Branded" },
  { id: "SERIES", label: "Series" },
];

export default function GlobalAndTouringSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setMultipleLocalFilters, getLocalFilterValue } = useFilterContext();

  // Derive selected statuses from filters
  const selectedStatuses = useMemo(() => {
    const onlyBranded = getLocalFilterValue("onlyBranded") === "true";
    const onlySeries = getLocalFilterValue("onlySeries") === "true";
    return [
      ...(onlyBranded ? ["BRANDED"] : []),
      ...(onlySeries ? ["SERIES"] : []),
    ];
  }, [getLocalFilterValue]);

  // Derive show state from show filter
  const showInFilter = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("branded") && showFilters.includes("series");
  }, [getLocalFilterValue]);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];

    setMultipleLocalFilters({
      onlyBranded: newStatuses.includes("BRANDED") ? "true" : "",
      onlySeries: newStatuses.includes("SERIES") ? "true" : "",
    });
  };

  const handleShowToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "branded", "series"]))
      : currentShow.filter((item) => !["branded", "series"].includes(item));

    const filters: Record<string, string> = {
      show: newShow.join(","),
    };

    if (!checked) {
      filters.onlyBranded = "";
      filters.onlySeries = "";
    }

    setMultipleLocalFilters(filters);
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
            Brand
            {selectedStatuses.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
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
                disabled={!showInFilter}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
