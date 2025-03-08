"use client";
import React, { useMemo } from "react";
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

export default function EstimatedVisitorsSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const estimatedVisitorsOptions = morphedData?.estimatedVisitors?.options;
  const enabled = morphedData?.estimatedVisitors?.isEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("estimatedVisitorRangeTag").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];
    setLocalFilter("estimatedVisitorRangeTag", newRanges.join(","));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="estimatedVisitors" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Estimated Visitors
              {selectedRanges.length > 0 && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  {selectedRanges.length}
                </span>
              )}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}