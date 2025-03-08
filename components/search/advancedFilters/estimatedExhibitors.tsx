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
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";

export default function EstimatedExhibitorsSelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const exhibitorOptions = morphedData.estimatedExhibitor.options;
  const enabled = morphedData.estimatedExhibitor.isEnabled;
  const showToogle = morphedData.estimatedExhibitor.isToogleEnabled;

  const selectedRanges = useMemo(
    () => getLocalFilterValue("estimatedExhibitors").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const showInFilter = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("estimatedExhibitors");
  }, [getLocalFilterValue]);

  const handleRangeToggle = (rangeId: string) => {
    const newRanges = selectedRanges.includes(rangeId)
      ? selectedRanges.filter((id) => id !== rangeId)
      : [...selectedRanges, rangeId];
    setLocalFilter("estimatedExhibitors", newRanges.join(","));
  };

  const handleShowToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "estimatedExhibitors"]))
      : currentShow.filter((item) => item !== "estimatedExhibitors");
    setLocalFilter("show", newShow.join(","));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="estimatedExhibitors" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              Estimated Exhibitors
              {selectedRanges.length > 0 && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  {selectedRanges.length}
                </span>
              )}
            </span>
            <Switch
              checked={showInFilter}
              onCheckedChange={handleShowToggle}
              aria-label="Show Estimated Exhibitors in filter"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 space-y-4">
            {exhibitorOptions.map((range: EventType) => (
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