"use client";
import React, { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const DynamicSwitch = dynamic(() => Promise.resolve(Switch), { ssr: false });

interface RankCategory {
  name: string;
  range: [number, number];
}

interface EventAnalyticsSelectorProps {
  variant?: "accordion" | "popover";
}

export default function EventAnalyticsSelector({
  variant = "popover",
}: EventAnalyticsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    localFilters,
    setMultipleLocalFilters,
    getLocalFilterValue,
    morphedData,
  } = useFilterContext();

  const enabled = morphedData.eventAnalytics.isEnabled;
  const showToogle = morphedData.eventAnalytics.isToogleEnabled;

  const showScores = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("scores");
  }, [getLocalFilterValue]);

  const categories = useMemo(
    () => [
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
        filters.inbound_score_gte = newRange[0].toString();
        filters.inbound_score_lte = newRange[1].toString();
        break;
      case 1:
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
    if (value === "") {
      const filters: Record<string, string> = {};
      switch (index) {
        case 0:
          filters[`inbound_score_${side === "min" ? "gte" : "lte"}`] = "";
          break;
        case 1:
          filters[`international_score_${side === "min" ? "gte" : "lte"}`] = "";
          break;
      }
      setMultipleLocalFilters(filters);
      return;
    }

    const numValue = Math.min(Math.max(parseInt(value, 10), 0), 100);
    if (isNaN(numValue)) return;

    const filters: Record<string, string> = {};
    switch (index) {
      case 0:
        filters[`inbound_score_${side === "min" ? "gte" : "lte"}`] =
          numValue.toString();
        break;
      case 1:
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

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
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
    </div>
  );

  const content = (
    <>
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
    </>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
            disabled={!enabled}
          >
            <div className="flex items-center justify-between w-full">
              {triggerContent}
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="eventAnalytics" className="border rounded-md">
        <AccordionTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
          disabled={!enabled}
        >
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
