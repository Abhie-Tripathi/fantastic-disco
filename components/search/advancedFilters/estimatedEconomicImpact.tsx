"use client";

import React, { useState, useEffect } from "react";
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
import { useFilterState } from "@/hooks/useFilterState";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

interface RankCategory {
  name: string;
  enabled: boolean;
  range: [number, number];
}

export default function EstimatedEconomicSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setFilter, getFilterValue, setMultipleFilters, searchParams } =
    useFilterState();
  const [category, setCategory] = useState<RankCategory>({
    name: "Economic Impact",
    enabled: false,
    range: [0, 100],
  });
  const [showEconomicImpact, setShowEconomicImpact] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleShowEconomicImpactToggle = (checked: boolean) => {
    setShowEconomicImpact(checked);
    const currentShow = getFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "economicImpact"]
      : currentShow.filter((item) => item !== "economicImpact");

    const params = new URLSearchParams(searchParams.toString());

    // Update the 'show' parameter
    if (newShow.length > 0) {
      params.set("show", newShow.join(","));
    } else {
      params.delete("show");
    }

    // Remove score-related filters if unchecked, or apply them if checked
    const scoreFilters = ["economic_impact_gte", "economic_impact_lte"];

    if (!checked) {
      scoreFilters.forEach((key) => params.delete(key));
    } else {
      const newFilters = {
        economic_impact_gte: category.range[0].toString(),
        economic_impact_lte: category.range[1].toString(),
      };
      Object.entries(newFilters).forEach(([key, value]) => {
        params.set(key, value);
      });
    }

    // Update the URL with all changes at once
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const economicImpactLte = getFilterValue("economic_impact_lte");
    const economicImpactGte = getFilterValue("economic_impact_gte");
    const showFilter = getFilterValue("show");
    if (economicImpactLte && economicImpactGte) {
      setCategory({
        name: "Economic Impact",
        enabled: true,
        range: [Number(economicImpactGte), Number(economicImpactLte)],
      });
    }
    setShowEconomicImpact(showFilter.includes("economicImpact"));
  }, [getFilterValue]);

  const handleRangeChange = (newRange: [number, number]) => {
    setCategory((prev) => ({ ...prev, range: newRange }));
  };

  const handleInputChange = (side: "min" | "max", value: string) => {
    const numValue = Math.min(Math.max(parseInt(value, 10), 0), 100);
    if (isNaN(numValue)) return;

    setCategory((prev) => {
      const newRange: [number, number] = [...prev.range];
      newRange[side === "min" ? 0 : 1] = numValue;
      return { ...prev, range: newRange };
    });
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      const newFilters = {
        economic_impact_gte: category.range[0].toString(),
        economic_impact_lte: category.range[1].toString(),
      };
      setMultipleFilters(newFilters);
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          disabled
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          <span className="flex items-center gap-2">
            Economic Impact
            {category.enabled && showEconomicImpact && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-primary-foreground">
                ✓
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
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <Label
            htmlFor="economic-impact-toggle"
            className="text-sm font-medium"
          >
            {category.name}
          </Label>
          <Slider
            id="economic-impact-slider"
            min={0}
            max={100}
            step={1}
            value={category.range}
            onValueChange={(newRange) =>
              handleRangeChange(newRange as [number, number])
            }
            className="mb-2"
            disabled={!showEconomicImpact || !category.enabled}
          />
          <div className="flex justify-between">
            <Input
              type="number"
              min={0}
              max={100}
              value={category.range[0]}
              onChange={(e) => handleInputChange("min", e.target.value)}
              className="w-16 text-center"
              disabled={!showEconomicImpact || !category.enabled}
            />
            <span className="mx-2 self-center">-</span>
            <Input
              type="number"
              min={0}
              max={100}
              value={category.range[1]}
              onChange={(e) => handleInputChange("max", e.target.value)}
              className="w-16 text-center"
              disabled={!showEconomicImpact || !category.enabled}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}