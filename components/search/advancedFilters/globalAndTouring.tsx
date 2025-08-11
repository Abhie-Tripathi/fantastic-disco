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
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";
import { LockClosedSmall } from "geist-icons";
import { EventType } from "@/public/data/searchFilters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalAndTouringSelectorProps {
  variant?: "accordion" | "popover";
}

export default function GlobalAndTouringSelector({
  variant = "popover",
}: GlobalAndTouringSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setMultipleLocalFilters, getLocalFilterValue, morphedData } =
    useFilterContext();
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

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
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
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );

  const content = (
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
      <AccordionItem value="brand" className="border rounded-md">
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
