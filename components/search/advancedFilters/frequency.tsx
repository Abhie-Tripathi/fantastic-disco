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

interface FrequencySelectorProps {
  variant?: "accordion" | "popover";
}

export default function FrequencySelector({ variant = "popover" }: FrequencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const frequencies = morphedData.frequencies.options;
  const showToogle = morphedData.frequencies.isToogleEnabled;
  const enabled = morphedData.frequencies.isEnabled;
  
  const selectedFrequencies = useMemo(
    () => getLocalFilterValue("frequencies").split(",").filter(Boolean),
    [getLocalFilterValue]
  );

  const showInFilter = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("frequency");
  }, [getLocalFilterValue]);

  const handleFrequencyToggle = (frequencyId: string) => {
    const newFrequencies = selectedFrequencies.includes(frequencyId)
      ? selectedFrequencies.filter((id) => id !== frequencyId)
      : [...selectedFrequencies, frequencyId];
    
    setLocalFilter("frequencies", newFrequencies.join(","));
  };

  const handleShowToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "frequency"]))
      : currentShow.filter((item) => item !== "frequency");

    setLocalFilter("show", newShow.join(","));

    if (!checked) {
      setLocalFilter("frequencies", "");
    }
  };

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="flex items-center gap-2">
        Frequency
        {selectedFrequencies.length > 0 && (
          <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
            {selectedFrequencies.length}
          </span>
        )}
      </span>
      <Switch
        checked={showInFilter}
        onCheckedChange={handleShowToggle}
        aria-label="Show Frequency in filter"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );

  const content = (
    <div className="p-4 space-y-4">
      {frequencies.map((frequency: EventType) => (
        <div key={frequency.id} className="flex items-center space-x-2">
          <Checkbox
            id={frequency.id}
            checked={selectedFrequencies.includes(frequency.id)}
            onCheckedChange={() => handleFrequencyToggle(frequency.id)}
            disabled={!frequency.isEnabled}
          />
          <Label htmlFor={frequency.id}>{frequency.label}</Label>
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
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="frequency" className="border rounded-md">
        <AccordionTrigger 
          className={cn(buttonVariants({variant: "outline"}), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}
          disabled={!enabled}
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