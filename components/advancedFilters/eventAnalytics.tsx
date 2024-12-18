"use client";

import React, { useState, useEffect } from "react";
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
import { useFilterState } from "@/hooks/useFilterState";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

interface RankCategory {
  name: string;
  range: [number, number];
}
interface analyticsInterface{
  isAnalyticsEnabled:boolean;
  toggleOpend:boolean;
}
interface EventAnalyticsProps{
  source:string;
  enabledAnalyticsData?:analyticsInterface;
  selectedEventRank?: [number, number];
  setSelectedEventRank?: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectedLocalRank?: [number, number];
  setSelectedLocalRank?: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectedAviationRank?:[number, number];
  setSelectedAviationRank?: React.Dispatch<React.SetStateAction<[number, number]>>;
  rankToggles?:any;
  setRankToggles?:any;
}
export default function EventAnalyticsSelector({source,enabledAnalyticsData, selectedEventRank,setSelectedEventRank, selectedLocalRank,setSelectedLocalRank, selectedAviationRank, setSelectedAviationRank, rankToggles, setRankToggles}:EventAnalyticsProps) {
  console.log(rankToggles);
  
  const [open, setOpen] = useState(false);
  const [showScores, setShowScores] = useState(false);
  useEffect(() => {
    if (rankToggles && typeof rankToggles.globalToggle !== "undefined") {
      console.log("showScore", rankToggles.globalToggle);
      
      setShowScores(rankToggles.globalToggle);
    }
  }, [rankToggles.globalToggle]);
  const [categories, setCategories] = useState<RankCategory[]>([
    { name: "Impact Score", range: selectedEventRank && Array.isArray(selectedEventRank) ? selectedEventRank : [0, 100]},
    { name: "Inbound Score", range: selectedLocalRank && Array.isArray(selectedLocalRank) ? selectedLocalRank : [0, 100] },
    { name: "International Score", range: selectedAviationRank && Array.isArray(selectedAviationRank) ? selectedAviationRank : [0, 100] },
  ]);

  const {
    setFilter,
    getFilterValue,
    setMultipleFilters,
    deleteMultipleFilters,
    searchParams,
  } = useFilterState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const show = getFilterValue("show").split(",").filter(Boolean);
    setShowScores(show.includes("scores"));
  }, [getFilterValue]);

  const handleRangeChange = (index: number, newRange: [number, number]) => {
    setCategories((prev) =>
      prev.map((category, i) =>
        i === index ? { ...category, range: newRange } : category
      )
    );
    if(index===0){
      console.log(newRange);
      
      setSelectedEventRank?.(newRange);
    }else if(index===1){
      setSelectedLocalRank?.(newRange);
    }else if(index===2){
      setSelectedAviationRank?.(newRange);
    }
  };

  const handleInputChange = (
    index: number,
    side: "min" | "max",
    value: string
  ) => {
    const numValue = Math.min(Math.max(parseInt(value, 10), 0), 100);
    if (isNaN(numValue)) return;

    setCategories((prev) =>
      prev.map((category, i) => {
        if (i !== index) return category;
        const newRange: [number, number] = [...category.range];
        newRange[side === "min" ? 0 : 1] = numValue;
        return { ...category, range: newRange };
      })
    );
  };

  const applyFilters = () => {
    const filters: Record<string, string> = {};
    if (showScores) {
      categories.forEach((category) => {
        const [min, max] = category.range;

        switch (category.name) {
          case "Impact Score":
            filters.impact_score_gte = min.toString();
            filters.impact_score_lte = max.toString();
            break;
          case "Inbound Score":
            filters.inbound_score_gte = min.toString();
            filters.inbound_score_lte = max.toString();
            break;
          case "International Score":
            filters.international_score_gte = min.toString();
            filters.international_score_lte = max.toString();
            break;
        }
      });
    }
    return filters;
  };

  const handleShowScoresToggle = (checked: boolean) => {
    setShowScores(checked);
    setRankToggles?.((prevState: any) => ({
      ...prevState,
      globalToggle: checked, 
    }));
    if(source!=="tracker"){
    const currentShow = getFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? [...currentShow, "scores"]
      : currentShow.filter((item) => item !== "scores");

    const params = new URLSearchParams(searchParams);

    // Update the 'show' parameter
    if (newShow.length > 0) {
      params.set("show", newShow.join(","));
    } else {
      params.delete("show");
    }

    // Remove score-related filters if unchecked, or apply them if checked
    const scoreFilters = [
      "impact_score_gte",
      "impact_score_lte",
      "inbound_score_gte",
      "inbound_score_lte",
      "international_score_gte",
      "international_score_lte",
    ];

    if (!checked) {
      scoreFilters.forEach((key) => params.delete(key));
    } else {
      const newFilters = applyFilters();
      Object.entries(newFilters).forEach(([key, value]) => {
        params.set(key, value);
      });
    }

    // Update the URL with all changes at once
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }
  };

  const onOpenChange = (open: boolean) => {
    if (!open && source!=="tracker") {
      const newFilters = applyFilters();
      setMultipleFilters(newFilters);
    }
    setOpen(open);
  };

  const getAppliedFiltersCount = () => {
    console.log(categories);
    
    return categories.filter(
      (category) => category.range[0] > 0 || category.range[1] < 100
    ).length;
  };
  useEffect(()=>{
    console.log(showScores, rankToggles)
  },[rankToggles])
 
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full sm:w-auto justify-between px-3 py-5 text-base font-normal ${
            open ? "border-primary" : "border-input"
          }`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="mr-2">Event Analytics</span>
          {(showScores || rankToggles.globalToggle) && getAppliedFiltersCount() > 0 && (
            <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white mr-1">
              {getAppliedFiltersCount()}
            </span>
          )}
          <DynamicSwitch
            checked={showScores || rankToggles.globalToggle}
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
              disabled={!showScores && !rankToggles.globalToggle}
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
                disabled={!showScores && !rankToggles.globalToggle}
                onBlur={(e) => {
                  const value = Math.min(
                    Math.max(parseInt(e.target.value, 10), 0),
                    100
                  );
                  if (!isNaN(value)) {
                    e.target.value = value.toString();
                    handleInputChange(index, "min", value.toString());
                  }
                }}
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
                disabled={!showScores && !rankToggles.globalToggle}
                onBlur={(e) => {
                  const value = Math.min(
                    Math.max(parseInt(e.target.value, 10), 0),
                    100
                  );
                  if (!isNaN(value)) {
                    e.target.value = value.toString();
                    handleInputChange(index, "max", value.toString());
                  }
                }}
              />
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}