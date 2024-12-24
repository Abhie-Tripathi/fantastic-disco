"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const ranks = [
  { id: "100", label: "Top 100" },
  { id: "500", label: "Top 500" },
  { id: "1000", label: "Top 1000" },
];

export default function EventRankingSelector() {
  const [open, setOpen] = useState(false);
  const { localFilters, setMultipleLocalFilters, getLocalFilterValue } =
    useFilterContext();

  const showRankings = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("rankings");
  }, [getLocalFilterValue]);

  const selectedRank = useMemo(
    () => getLocalFilterValue("top"),
    [getLocalFilterValue]
  );

  const trustScoreRange = useMemo(
    () =>
      [
        Number(localFilters.trust_score_gte || 0),
        Number(localFilters.trust_score_lte || 100),
      ] as [number, number],
    [localFilters]
  );

  const handleStatusChange = (value: string) => {
    const newValue = value === selectedRank ? "" : value;
    setMultipleLocalFilters({
      top: newValue,
    });
  };

  const handleRangeChange = (newRange: [number, number]) => {
    setMultipleLocalFilters({
      trust_score_gte: newRange[0].toString(),
      trust_score_lte: newRange[1].toString(),
    });
  };

  const handleInputChange = (side: "min" | "max", value: string) => {
    const numValue = Math.min(Math.max(parseInt(value, 10), 0), 100);
    if (isNaN(numValue)) return;

    setMultipleLocalFilters({
      [`trust_score_${side === "min" ? "gte" : "lte"}`]: numValue.toString(),
    });
  };

  const handleShowRankToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "rankings"]
      : currentShow.filter((item) => item !== "rankings");

    const filters: Record<string, string> = {
      show: newShow.join(","),
    };

    if (!checked) {
      filters.top = "";
      filters.trust_score_gte = "";
      filters.trust_score_lte = "";
    }

    setMultipleLocalFilters(filters);
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (selectedRank) count++;
    if (trustScoreRange[0] > 0 || trustScoreRange[1] < 100) count++;
    return count;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            open ? "border-primary" : "border-input"
          }`}
        >
          <div className="flex items-center truncate">
            <span className="mr-2">Event Ranking</span>
            {showRankings && getAppliedFiltersCount() > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white mr-1">
                {getAppliedFiltersCount()}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 pt-2">
        <div className="flex items-center justify-between px-4 py-2">
          <Label htmlFor="show-rank" className="text-sm font-medium">
            Rank
          </Label>
          <Switch
            id="show-rank"
            checked={showRankings}
            onCheckedChange={handleShowRankToggle}
          />
        </div>

        <RadioGroup
          value={selectedRank}
          onValueChange={handleStatusChange}
          className="space-y-2 px-4 py-2"
          disabled={!showRankings}
        >
          {ranks.map((rank) => (
            <div key={rank.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={rank.id}
                id={rank.id}
                onClick={(e) => {
                  if (selectedRank === rank.id) {
                    e.preventDefault();
                    handleStatusChange(rank.id);
                  }
                }}
              />
              <Label htmlFor={rank.id}>{rank.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <Separator className="my-1" />

        <div className="py-2 px-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Trust Score</Label>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={trustScoreRange}
            onValueChange={(newRange) =>
              handleRangeChange(newRange as [number, number])
            }
            className="mb-2"
            disabled={!showRankings}
          />
          <div className="flex justify-between">
            <Input
              type="number"
              min={0}
              max={100}
              value={trustScoreRange[0]}
              onChange={(e) => handleInputChange("min", e.target.value)}
              className="w-16 text-center"
              disabled={!showRankings}
            />
            <span className="mx-2 self-center">-</span>
            <Input
              type="number"
              min={0}
              max={100}
              value={trustScoreRange[1]}
              onChange={(e) => handleInputChange("max", e.target.value)}
              className="w-16 text-center"
              disabled={!showRankings}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
