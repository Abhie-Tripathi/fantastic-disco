"use client";

import React, { useState, useEffect } from "react";
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
import { useFilterState } from "@/hooks/useFilterState";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";

interface RankCategory {
  name: string;
  enabled: boolean;
  range: any;
}

const ranks = [
  { id: "100", label: "Top 100" },
  { id: "500", label: "Top 500" },
  { id: "1000", label: "Top 1000" },
];
interface EvenetRankingProps{
  source:string;
  selectedTrustScore?:any;
  setSelectedTrustScore?:any;
  rankToggles?:any;
  setRankToggles?:any;
  selectedRank?:string;
  setSelectedRank?:React.Dispatch<React.SetStateAction<string>>;
}
export default function EventRankingSelector({source, selectedTrustScore, setSelectedTrustScore, rankToggles, setRankToggles, selectedRank, setSelectedRank}: EvenetRankingProps) {
  
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(selectedRank && selectedRank.length>0?selectedRank.substring(2):"");
  const [categories, setCategories] = useState<RankCategory[]>([
    { name: "Trust Score", enabled: rankToggles.isTrustScore?rankToggles.isTrustScore:false,  range: selectedTrustScore && Array.isArray(selectedTrustScore) ? selectedTrustScore : [0, 100] },
  ]);
  // useEffect(()=>{
  //   setCategories((prevCategories) =>
  //     prevCategories.map((category) =>
  //       category.name === "Trust Score"
  //         ? { ...category, enabled: rankToggles.isTrustScore }
  //         : category
  //     )
  //   );
  // },[rankToggles])
  const { setFilter, getFilterValue, setMultipleFilters, searchParams } =
    useFilterState();

  useEffect(() => {
    if(source!=="tracker"){
    const topParam = searchParams.get("top");
    if (topParam) {
      const matchingRank = ranks.find(
        (rank) => rank.id === topParam.toLowerCase()
      );
      if (matchingRank) {
        setSelectedStatus(matchingRank.id);
      }
    }

    const trustScoreLte = getFilterValue("trust_score_lte");
    const trustScoreGte = getFilterValue("trust_score_gte");
    if (trustScoreLte && trustScoreGte) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === "Trust Score"
            ? {
                ...cat,
                enabled: true,
                range: [parseInt(trustScoreGte), parseInt(trustScoreLte)],
              }
            : cat
        )
      );
    }
  }
  }, []);

  const handleToggle = (index: number) => {
    setCategories((prev) =>
      prev.map((category, i) =>
        i === index ? { ...category, enabled: !category.enabled } : category
      )
    );
    setRankToggles((prev:any) => ({
      ...prev,
      isTrustScore: !prev.isTrustScore,
    }));
    // console.log(index);
    
  };

  const handleRangeChange = (index: number, newRange: [number, number]) => {
    setCategories((prev) =>
      prev.map((category, i) =>
        i === index ? { ...category, range: newRange } : category
      )
    );
    setSelectedTrustScore?.(newRange);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus((prevStatus) => (prevStatus === value ? "" : value));
    setSelectedRank?.(`0-${value}`);
  };

  const handleApply = () => {
    const trustScoreCategory = categories.find(
      (cat) => cat.name === "Trust Score"
    );

    // setMultipleFilters({
    //   top: selectedStatus || "",
    //   trust_score_gte: trustScoreCategory?.enabled
    //     ? trustScoreCategory.range[0].toString()
    //     : "",
    //   trust_score_lte: trustScoreCategory?.enabled
    //     ? trustScoreCategory.range[1].toString()
    //     : "",
    // });
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

  const onOpenChange = (open: boolean) => {
    console.log(open);
    
    handleApply();
    setOpen(open);
  };

  const getAppliedFiltersCount = () => {
    const trustScoreEnabled = categories.find(
      (cat) => cat.name === "Trust Score"
    )?.enabled
      ? 1
      : 0;
    const selectedRank = selectedStatus ? 1 : 0;
    return selectedRank + trustScoreEnabled;
  };
console.log(categories);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            open ? "border-primary" : "border-input"
          }`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <div className="flex items-center truncate">
            <span className="mr-2">Event Ranking</span>
            {getAppliedFiltersCount() > 0 && (
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
        {/* <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Event Ranking</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={applyHandler}
          >
            Apply
          </Button>
        </div> */}

        <Label htmlFor="rank" className="text-sm font-medium pl-4 ">
          Rank
        </Label>

        <RadioGroup
          value={selectedStatus}
          onValueChange={handleStatusChange}
          className="space-y-2 px-4 py-2"
        >
          {ranks.map((rank) => (
            <div key={rank.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={rank.id}
                id={rank.id}
                onClick={(e) => {
                  if (selectedStatus === rank.id) {
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

        {categories.map((category, index) => (
          <div key={category.name} className="py-2 px-4">
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor={`toggle-${index}`}
                className="text-sm font-medium"
              >
                {category.name}
              </Label>
              <Switch
                id={`toggle-${index}`}
                checked={category.enabled}
                onCheckedChange={() => handleToggle(index)}
              />
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={category.range}
              onValueChange={(newRange) =>
                handleRangeChange(index, newRange as [number, number])
              }
              className="mb-2"
              disabled={!category.enabled}
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
                disabled={!category.enabled}
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
                disabled={!category.enabled}
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