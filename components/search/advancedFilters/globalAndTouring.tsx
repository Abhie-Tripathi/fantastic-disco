"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";

const globalAndTourings = [
  { id: "BRANDED", label: "Branded" },
  { id: "SERIES", label: "Series" },
];
interface brandInterface{
  isBrandedEnabled:boolean,
  selectedValue:boolean[],
  enabledValue:{
    isBranded:boolean;
    isSeries:boolean;
  },
}
interface BrandedProps{
  source:string;
  enabledBrandData:brandInterface;
  selectedBrandedEvent?:boolean;
  setSelectedBrandedEvent?:React.Dispatch<React.SetStateAction<boolean>>;
  selectedEventSeries?:boolean;
  setSelectedEventSeries?:React.Dispatch<React.SetStateAction<boolean>>;
  isEnabled?: boolean;
  setIsEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function GlobalAndTouringSelector({source,         selectedBrandedEvent, setSelectedBrandedEvent, 
  enabledBrandData,
  selectedEventSeries, setSelectedEventSeries,
  isEnabled: parentIsEnabled = false,
  setIsEnabled: parentSetIsEnabled,
}:BrandedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setMultipleLocalFilters, setLocalFilter, getLocalFilterValue } =
    useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [localIsEnabled, setLocalIsEnabled] = useState(false);
  const showInFilter = source === "tracker" ? parentIsEnabled : localIsEnabled;
  const setShowInFilter = source === "tracker" ? parentSetIsEnabled : setLocalIsEnabled;
  useEffect(() => {
    const initialStatuses: string[] = [];
  
    if (selectedBrandedEvent) {
      initialStatuses.push("BRANDED");
    }
    if (selectedEventSeries) {
      initialStatuses.push("SERIES");
    }
    
    setSelectedStatuses(initialStatuses);
  }, [selectedBrandedEvent, selectedEventSeries]);
  // const [showInFilter, setShowInFilter] = useState(false);

  useEffect(() => {
    const onlyBranded = getLocalFilterValue("onlyBranded") === "true";
    const onlySeries = getLocalFilterValue("onlySeries") === "true";
    const showFilter = getLocalFilterValue("show");
    if(source!=="tracker"){
    setSelectedStatuses([
      ...(onlyBranded ? ["BRANDED"] : []),
      ...(onlySeries ? ["SERIES"] : []),
    ]);

    setShowInFilter?.(
      showFilter.includes("branded") && showFilter.includes("series")
    );
  }
  }, [getLocalFilterValue]);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
  ? selectedStatuses.filter((id) => id !== statusId)
  : [...selectedStatuses, statusId];
    setSelectedStatuses(newStatuses);
    
    if(statusId==="BRANDED") {
      if(newStatuses.includes("BRANDED")){
      setSelectedBrandedEvent?.(true);
      }
      else setSelectedBrandedEvent?.(false);
    }
    if(statusId==="SERIES") {
      if(newStatuses.includes("SERIES"))
        setSelectedEventSeries?.(true);
      else  setSelectedEventSeries?.(false);
      }
  };

  const handleApply = () => {
    setMultipleLocalFilters({
      onlyBranded: selectedStatuses.includes("BRANDED") ? "true" : "",
      onlySeries: selectedStatuses.includes("SERIES") ? "true" : "",
    });

    const showFilter = getLocalFilterValue("show");
    setShowInFilter?.(
      showFilter.includes("branded") && showFilter.includes("series")
    );
  };

  const handleShowToggle = (checked: boolean) => {
    setShowInFilter?.(checked);
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "branded", "series"])) // {{ edit_1 }}
      : currentShow.filter((item) => !["branded", "series"].includes(item));
    setLocalFilter("show", newShow.join(","));
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
    }
    setIsOpen(open);
  };
  console.log(enabledBrandData);
  
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={enabledBrandData && !enabledBrandData?.isBrandedEnabled}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          <span className="flex items-center gap-2">
            Brand
            {selectedStatuses.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedStatuses.length}
              </span>
            )}
          </span>
          <Switch
            checked={showInFilter}
            disabled={enabledBrandData &&!enabledBrandData?.isBrandedEnabled}
            onCheckedChange={handleShowToggle}
            aria-label="Show Global & Touring in filter"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.stopPropagation()
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-4 space-y-4">
          {globalAndTourings.map((item,index) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                disabled={ enabledBrandData &&
                 ( item.id === "SERIES"
                    ? !enabledBrandData?.enabledValue?.eventSeries 
                    : item.id === "BRANDED"
                    ? !enabledBrandData?.enabledValue?.eventBrand
                    : false)
                }
                checked={selectedStatuses.includes(item.id)}
                onCheckedChange={() => handleStatusToggle(item.id)}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
