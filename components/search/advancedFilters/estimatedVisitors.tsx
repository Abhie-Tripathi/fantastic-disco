"use client";
import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LockClosedSmall } from "geist-icons";

interface EstimatedVisitorsSelectorProps {
  variant?: "accordion" | "popover";
}

export default function EstimatedVisitorsSelector({ variant = "popover" }: EstimatedVisitorsSelectorProps) {
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const estimatedVisitorsOptions = morphedData?.estimatedVisitors?.options;
  const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("estimatedVisitorRangeTag").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];
    setLocalFilter("estimatedVisitorRangeTag", newRanges.join(","));
  };

  const triggerContent = (
    <span className="flex items-center">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="mr-2">Estimated Visitors</span>
      {selectedRanges.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedRanges.length}
        </span>
      )}
    </span>
  );

  const content = (
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
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={!enabled}
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
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
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="estimatedVisitors" className="border rounded-md">
        <AccordionTrigger 
          disabled={!enabled}
          className={cn(buttonVariants({variant: "outline"}), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}
        >
          <div className="flex items-center justify-between w-full">
            {triggerContent}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}