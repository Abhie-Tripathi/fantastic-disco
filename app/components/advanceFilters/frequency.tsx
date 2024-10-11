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
import { ChevronDown } from "lucide-react";
// import { useFilterState } from "@/hooks/useFilterState";

const frequencies = [
  { id: "annual", label: "Annual" },
  { id: "bi-annual", label: "Bi-Annual" },
  { id: "quarterly", label: "Quarterly" },
];

export default function FrequencySelector({selectedFrequencies, setSelectedFrequencies}) {
  const [isOpen, setIsOpen] = useState(false);
//   const { setFilter, getFilterValue, searchParams } = useFilterState();
  // const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);

//   useEffect(() => {
//     setSelectedFrequencies(
//       getFilterValue("frequencies").split(",").filter(Boolean)
//     );
//   }, [searchParams]);

  const handleFrequencyToggle = (frequencyId: string) => {
    setSelectedFrequencies((prev) =>
      prev.includes(frequencyId)
        ? prev.filter((id) => id !== frequencyId)
        : [...prev, frequencyId]
    );
  };

  const handleApply = () => {
    // setFilter("frequencies", selectedFrequencies.join(","));
    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleApply();
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          <span className="flex items-center gap-2">
            Frequency
            {selectedFrequencies.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-primary-foreground">
                {selectedFrequencies.length}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-4 space-y-4">
          {frequencies.map((frequency) => (
            <div key={frequency.id} className="flex items-center space-x-2">
              <Checkbox
                id={frequency.id}
                checked={selectedFrequencies.includes(frequency.id)}
                onCheckedChange={() => handleFrequencyToggle(frequency.id)}
              />
              <Label htmlFor={frequency.id}>{frequency.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}