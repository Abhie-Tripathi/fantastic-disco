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
import { EventType } from "@/public/data/searchFilters";

const filterData = [
  { id: "0-1990", label: "<1991", min: 0, max: 1990, isEnabled: true },
  { id: "1991-2000", label: "1991 - 2000", min: 1991, max: 2000, isEnabled: true },
  { id: "2001-2010", label: "2001 - 2010", min: 2001, max: 2010, isEnabled: true },
  { id: "2011-2020", label: "2011 - 2020", min: 2011, max: 2020, isEnabled: true },
  { id: "2021-2030", label: "2021 - 2030", min: 2021, max: 2030, isEnabled: true },
  { id: "10001", label: "10001+", min: 10001, max: Infinity, isEnabled: true },
];

interface EstablishedYearProps {
  variant?: "accordion" | "popover";
}

export default function EstablishedYear({ variant = "accordion" }: EstablishedYearProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();

  const estimatedVisitorsOptions = filterData;
  // const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("establishedYear").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];
    setLocalFilter("establishedYear", newRanges.join(","));
  };

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        Established Year
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
        {estimatedVisitorsOptions?.map((range: EventType) => (
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
      <AccordionItem value="establishedYear" className="border rounded-md">
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
