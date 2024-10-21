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
import { useFilterState } from "@/hooks/useFilterState";

const globalAndTourings = [
  { id: "BRANDED", label: "Branded" },
  { id: "SERIES", label: "Series" },
];
interface BrandedProps{
  source:string;
  selectedBrandedEvent?:boolean;
  setSelectedBrandedEvent?:React.Dispatch<React.SetStateAction<boolean>>;
  selectedEventSeries?:boolean;
  setSelectedEventSeries?:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function GlobalAndTouringSelector({source, selectedBrandedEvent, setSelectedBrandedEvent, selectedEventSeries, setSelectedEventSeries}:BrandedProps) {
  
  
  const [isOpen, setIsOpen] = useState(false);
  const { setMultipleFilters, setFilter, getFilterValue } = useFilterState();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
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
  const [showInFilter, setShowInFilter] = useState(false);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
  ? selectedStatuses.filter((id) => id !== statusId)
  : [...selectedStatuses, statusId];
    setSelectedStatuses(newStatuses);
    console.log(newStatuses);
    
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
    if(source!=="tracker"){
    setMultipleFilters({
      onlyBranded: selectedStatuses.includes("BRANDED") ? "true" : "",
      onlySeries: selectedStatuses.includes("SERIES") ? "true" : "",
    });

    const showFilter = getFilterValue("show");
    setShowInFilter(
      showFilter.includes("branded") && showFilter.includes("series")
    );
  }
  };

  const handleShowToggle = (checked: boolean) => {
    setShowInFilter(checked);
    const currentShow = getFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "branded", "series"])) // {{ edit_1 }}
      : currentShow.filter((item) => !["branded", "series"].includes(item));
    setFilter("show", newShow.join(","));
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
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
          {/* <Switch
            checked={showInFilter}
            onCheckedChange={handleShowToggle}
            aria-label="Show Global & Touring in filter"
            onClick={(e) => e.stopPropagation()}
          /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-4 space-y-4">
          {globalAndTourings.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
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