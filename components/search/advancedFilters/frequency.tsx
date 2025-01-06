"use client";

import React, { useMemo, useState } from "react";
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
import { LockClosedSmall } from "geist-icons";
import {EventType} from "@/public/data/searchFilters"
export default function FrequencySelector() {
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
          <div className="flex items-center">
          {!enabled && 
              <LockClosedSmall color="var(--secondary-text-color)" />
            }
          <span className="flex items-center gap-2">
            Frequency
            {selectedFrequencies.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedFrequencies.length}
              </span>
            )}
          </span>
          </div>
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
      </PopoverContent>
    </Popover>
  );
}
