"use client";

import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterContext } from "@/context/filterContext";
import { Filters } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

const filterData = [
    { id: "0-500", label: "0 - 500", min: 0, max: 500, isEnabled: true },
    { id: "500-1000", label: "500 - 1k", min: 500, max: 1000, isEnabled: true },
    { id: "1000-5000", label: "1k - 5k", min: 1000, max: 5000, isEnabled: true },
    { id: "5000-10000", label: "5k - 10k", min: 5000, max: 10000, isEnabled: true },
    { id: "10000-25000", label: "10k - 25k", min: 10000, max: 25000, isEnabled: true },
    { id: "25000-50000", label: "25k - 50k", min: 25000, max: 50000, isEnabled: true },
    { id: "50000-100000", label: "50k - 100k", min: 50000, max: 100000, isEnabled: true },
    { id: "100000-200000", label: "100k - 200k", min: 100000, max: 200000, isEnabled: true },
    { id: "200000", label: "200k+", min: 200000, max: Infinity, isEnabled: true },
];

interface EventFollowersProps {
  variant?: "accordion" | "popover";
  filterName?: string;
}

export default function EventFollowers({ variant = "accordion", filterName = "eventFollowers" }: EventFollowersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();

  const selectedRanges = useMemo(
    () => getLocalFilterValue(filterName as keyof Filters).split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];
    setLocalFilter(filterName as keyof Filters, newRanges.join(","));
  };

  const labels: Record<string, string> = {
    eventFollowers: "Event Followers",
    communitySize: "Followers",
  };

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        {labels[filterName as keyof typeof labels] || "Event Followers"}
        {selectedRanges.length > 0 && (
          <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
            {selectedRanges.length}
          </span>
        )}
      </span>
    </div>
  );

  const content = (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <div className="p-4 space-y-4">
        {filterData.map((range: EventType) => (
          <div key={range.id} className="flex items-center space-x-2">
            <Checkbox
              id={range.id}
              disabled={!range.isEnabled}
              checked={selectedRanges.includes(range.id)}
              onCheckedChange={() => handleRangeToggle(range.id)}
            />
            <Label htmlFor={range.id}>{range.label}</Label>
          </div>
        ))}
      </div>
    </div>
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
          >
            {triggerContent}
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="eventFollowers" className="border rounded-md">
        <AccordionTrigger 
          className={cn(buttonVariants({ variant: "outline" }), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}
        >
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
