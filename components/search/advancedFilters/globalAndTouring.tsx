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
import { LockClosedSmall } from "geist-icons";
import { EventType } from "@/public/data/searchFilters";

export default function GlobalAndTouringSelector() {
  const { setMultipleLocalFilters, getLocalFilterValue, morphedData } = useFilterContext();
  const globalAndTourings = morphedData.globalAndTourings.options;
  const enabled = morphedData.globalAndTourings.isEnabled;
  const showToogle = morphedData.globalAndTourings.isToogleEnabled;

  const selectedStatuses = useMemo(() => {
    const onlyBranded = getLocalFilterValue("onlyBranded") === "true";
    const onlySeries = getLocalFilterValue("onlySeries") === "true";
    return [
      ...(onlyBranded ? ["BRANDED"] : []),
      ...(onlySeries ? ["SERIES"] : []),
    ];
  }, [getLocalFilterValue]);

  const showInFilter = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("branded") && showFilters.includes("series");
  }, [getLocalFilterValue]);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];

    setMultipleLocalFilters({
      onlyBranded: newStatuses.includes("BRANDED") ? "true" : "",
      onlySeries: newStatuses.includes("SERIES") ? "true" : "",
    });
  };

  const handleShowToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "branded", "series"]))
      : currentShow.filter((item) => !["branded", "series"].includes(item));

    const filters: Record<string, string> = {
      show: newShow.join(","),
    };

    if (!checked) {
      filters.onlyBranded = "";
      filters.onlySeries = "";
    }

    setMultipleLocalFilters(filters);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="brand" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline" disabled={!enabled}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {!enabled && 
                <LockClosedSmall color="var(--secondary-text-color)" />
              }
              <span className="flex items-center gap-2">
                Brand
                {selectedStatuses.length > 0 && (
                  <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                    {selectedStatuses.length}
                  </span>
                )}
              </span>
            </div>
            <Switch
              checked={showInFilter}
              onCheckedChange={handleShowToggle}
              aria-label="Show Global & Touring in filter"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                e.stopPropagation()
              }
            />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 space-y-4">
            {globalAndTourings.map((item: EventType) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedStatuses.includes(item.id)}
                  onCheckedChange={() => handleStatusToggle(item.id)}
                  disabled={!item.isEnabled}
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}