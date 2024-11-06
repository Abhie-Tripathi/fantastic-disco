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

const frequencies = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "bi-annual", label: "Bi-Annual" },
  { id: "annual", label: "Annual" },
  { id: "biennial", label: "Biennial" },
  { id: "triennial", label: "Triennial" },
  { id: "quadrennial", label: "Quadrennial" },
  { id: "quinquennial", label: "Quinquennial" },
  { id: "one-time", label: "One-Time" },
];
interface FrequencySelectorProps {
  source: string;
  selectedFrequencies?: string[];
  setSelectedFrequencies?: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function FrequencySelector({
  source,
  selectedFrequencies: parentSelectedFrequencies = [],
  setSelectedFrequencies: parentSetSelectedFrequencies,
}: FrequencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, searchParams } =
    useFilterContext();
  const [showInFilter, setShowInFilter] = useState(false);
  const [selectedFrequenciesLocal, setSelectedFrequenciesLocal] = React.useState<string[]>([]);

  const selectedFrequencies =
    source === "tracker" ? parentSelectedFrequencies : selectedFrequenciesLocal;
  const setSelectedFrequencies =
    source === "tracker"
      ? parentSetSelectedFrequencies
      : setSelectedFrequenciesLocal;
  useEffect(() => {
    if(source!=="tracker")
    setSelectedFrequencies?.(
      getLocalFilterValue("frequencies").split(",").filter(Boolean)
    );
    setShowInFilter(getLocalFilterValue("show").includes("frequency"));
  }, [searchParams]);

  const handleFrequencyToggle = (frequencyId: string) => {
    setSelectedFrequencies?.((prev) =>
      prev.includes(frequencyId)
        ? prev.filter((id) => id !== frequencyId)
        : [...prev, frequencyId]
    );
  };

  const handleApply = () => {
    setLocalFilter("frequencies", selectedFrequencies.join(","));
    setIsOpen(false);
  };

  const handleShowToggle = (checked: boolean) => {
    setShowInFilter(checked);
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "frequency"]))
      : currentShow.filter((item) => item !== "frequency");
    setLocalFilter("show", newShow.join(","));
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
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedFrequencies.length}
              </span>
            )}
          </span>
          <Switch
            checked={showInFilter}
            onCheckedChange={handleShowToggle}
            aria-label="Show Frequency in filter"
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
