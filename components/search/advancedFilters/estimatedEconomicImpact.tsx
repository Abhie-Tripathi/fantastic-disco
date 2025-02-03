"use client";

import React, { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useFilterContext } from "@/context/filterContext";
import dynamic from "next/dynamic";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

export default function EstimatedEconomicSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, setMultipleLocalFilters } =
    useFilterContext();

  // Derive show state from show filter
  const showEconomicImpact = useMemo(() => {
    const showFilter = getLocalFilterValue("show");
    return showFilter.includes("economicImpact");
  }, [getLocalFilterValue]);

  // Derive range values from filters
  const range = useMemo(() => {
    const economicImpactLte = getLocalFilterValue("economic_impact_lte");
    const economicImpactGte = getLocalFilterValue("economic_impact_gte");
    return [
      economicImpactGte ? Number(economicImpactGte) : 0,
      economicImpactLte ? Number(economicImpactLte) : 100,
    ] as [number, number];
  }, [getLocalFilterValue]);

  const handleShowEconomicImpactToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "economicImpact"]
      : currentShow.filter((item) => item !== "economicImpact");

    setLocalFilter("show", newShow.join(","));
  };

  const handleRangeChange = (newRange: [number, number]) => {
    setMultipleLocalFilters({
      economic_impact_gte: newRange[0].toString(),
      economic_impact_lte: newRange[1].toString(),
    });
  };

  const handleInputChange = (side: "min" | "max", value: string) => {
    const numValue = Math.min(Math.max(parseInt(value, 10), 0), 100);
    if (isNaN(numValue)) return;

    setMultipleLocalFilters({
      [`economic_impact_${side === "min" ? "gte" : "lte"}`]:
        numValue.toString(),
    });
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Check if the range is different from default to show count
  const isRangeModified =
    showEconomicImpact && (range[0] > 0 || range[1] < 100);

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
            Economic Impact
            {isRangeModified && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                1
              </span>
            )}
          </span>
          <DynamicSwitch
            checked={showEconomicImpact}
            onCheckedChange={handleShowEconomicImpactToggle}
            aria-label="Show Economic Impact"
            onClick={(e) => e.stopPropagation()}
          />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
}
