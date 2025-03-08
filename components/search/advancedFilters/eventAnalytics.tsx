"use client";
import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";
import { LockClosedSmall } from "geist-icons";
import dynamic from "next/dynamic";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

interface RankCategory {
  name: string;
  range: [number, number];
}

export default function EventAnalyticsSelector() {
  const { localFilters, setMultipleLocalFilters, getLocalFilterValue, morphedData } =
    useFilterContext();

  const enabled = morphedData.eventAnalytics.isEnabled;
  const showToogle = morphedData.eventAnalytics.isToogleEnabled;
  
  const showScores = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("scores");
  }, [getLocalFilterValue]);

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
        filters[`impact_score_${side === "min" ? "gte" : "lte"}`] = numValue.toString();
        break;
      case 1:
        filters[`inbound_score_${side === "min" ? "gte" : "lte"}`] = numValue.toString();
        break;
      case 2:
        filters[`international_score_${side === "min" ? "gte" : "lte"}`] = numValue.toString();
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
    <Accordion type="single" collapsible>
      <AccordionItem value="eventAnalytics" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline" disabled={!enabled}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {!enabled && 
                <LockClosedSmall color="var(--secondary-text-color)" />
              }
              <span className="mr-2">Event Analytics</span>
              {showScores && getAppliedFiltersCount() > 0 && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white mr-1">
                  {getAppliedFiltersCount()}
                </span>
              )}
            </div>
            <DynamicSwitch
              checked={showScores}
              onCheckedChange={handleShowScoresToggle}
              aria-label="Show scores"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </AccordionTrigger>
        <AccordionContent>
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
                  onChange={(e) => handleInputChange(index, "min", e.target.value)}
                  className="w-16 text-center"
                  disabled={!showScores}
                />
                <span className="mx-2 self-center">-</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={category.range[1]}
                  onChange={(e) => handleInputChange(index, "max", e.target.value)}
                  className="w-16 text-center"
                  disabled={!showScores}
                />
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}