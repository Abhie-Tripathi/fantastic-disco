"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterContext } from "@/context/filterContext";
import dynamic from "next/dynamic";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

interface RankCategory {
  name: string;
  range: [number, number];
}

export default function EventAnalyticsSelector() {
  const [open, setOpen] = useState(false);
  const { localFilters, setMultipleLocalFilters, getLocalFilterValue } =
    useFilterContext();

  // Derive show scores from show filter
  const showScores = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("scores");
  }, [getLocalFilterValue]);

  // Derive categories from filters
  const categories = useMemo(
    () => [
      {
        name: "Impact Score",
        range: [
          Number(localFilters.impact_score_gte || 0),
          Number(localFilters.impact_score_lte || 100),
        ] as [number, number],
      },
      {
        name: "Inbound Score",
        range: [
          Number(localFilters.inbound_score_gte || 0),
          Number(localFilters.inbound_score_lte || 100),
        ] as [number, number],
      },
      {
        name: "International Score",
        range: [
          Number(localFilters.international_score_gte || 0),
          Number(localFilters.international_score_lte || 100),
        ] as [number, number],
      },
    ],
    [localFilters]
  );

  const handleRangeChange = (index: number, newRange: [number, number]) => {
    const filters: Record<string, string> = {};

    switch (index) {
      case 0:
        filters.impact_score_gte = newRange[0].toString();
        filters.impact_score_lte = newRange[1].toString();
        break;
      case 1:
        filters.inbound_score_gte = newRange[0].toString();
        filters.inbound_score_lte = newRange[1].toString();
        break;
      case 2:
        filters.international_score_gte = newRange[0].toString();
        filters.international_score_lte = newRange[1].toString();
        break;
    }

    setMultipleLocalFilters(filters);
  };

  const handleInputChange = (
    index: number,
    side: "min" | "max",
    value: string
  ) => {
    const numValue = Math.min(Math.max(parseInt(value, 10), 0), 100);
    if (isNaN(numValue)) return;

    const filters: Record<string, string> = {};
    switch (index) {
      case 0:
        filters[`impact_score_${side === "min" ? "gte" : "lte"}`] =
          numValue.toString();
        break;
      case 1:
        filters[`inbound_score_${side === "min" ? "gte" : "lte"}`] =
          numValue.toString();
        break;
      case 2:
        filters[`international_score_${side === "min" ? "gte" : "lte"}`] =
          numValue.toString();
        break;
    }

    setMultipleLocalFilters(filters);
  };

  const handleShowScoresToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "scores"]
      : currentShow.filter((item) => item !== "scores");

    const filters: Record<string, string> = {
      show: newShow.join(","),
    };

    if (!checked) {
      // Clear all score filters when toggling off
      filters.impact_score_gte = "";
      filters.impact_score_lte = "";
      filters.inbound_score_gte = "";
      filters.inbound_score_lte = "";
      filters.international_score_gte = "";
      filters.international_score_lte = "";
    }

    setMultipleLocalFilters(filters);
  };

  const getAppliedFiltersCount = () => {
    return categories.filter(
      (category) => category.range[0] > 0 || category.range[1] < 100
    ).length;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full sm:w-auto justify-between px-3 py-5 text-base font-normal ${
            open ? "border-primary" : "border-input"
          }`}
          aria-expanded={open}
          disabled={enabledAnalyticsData && !enabledAnalyticsData?.isAnalyticsEnabled}
          aria-haspopup="true"
        >
          <span className="mr-2">Event Analytics</span>
          {showScores && getAppliedFiltersCount() > 0 && (
            <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white mr-1">
              {getAppliedFiltersCount()}
            </span>
          )}
          <DynamicSwitch
            checked={showScores}
            onCheckedChange={handleShowScoresToggle}
            aria-label="Show scores"
            onClick={(e) => e.stopPropagation()}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        {categories.map((category, index) => (
          <div key={category.name} className="p-4">
            <Label className="text-sm font-medium mb-2">{category.name}</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={category.range}
              onValueChange={(newRange) =>
                handleRangeChange(index, newRange as [number, number])
              }
              className="mb-2"
              disabled={!showScores}
            />
            <div className="flex justify-between">
              <Input
                type="number"
                min={0}
                max={100}
                value={category.range[0]}
                onChange={(e) =>
                  handleInputChange(index, "min", e.target.value)
                }
                className="w-16 text-center"
                disabled={!showScores}
              />
              <span className="mx-2 self-center">-</span>
              <Input
                type="number"
                min={0}
                max={100}
                value={category.range[1]}
                onChange={(e) =>
                  handleInputChange(index, "max", e.target.value)
                }
                className="w-16 text-center"
                disabled={!showScores}
              />
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
