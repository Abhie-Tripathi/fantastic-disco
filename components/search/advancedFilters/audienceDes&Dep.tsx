"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LockClosedSmall } from "geist-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useMiscService } from "@/services/miscService";
import { useQuery } from "@tanstack/react-query";
import { useFilterContext } from "@/context/filterContext";
import { Designations } from "@/types/misc";

const useDesignationsAutocomplete = (input: string) => {
  const miscService = useMiscService();
  const { data, error, isLoading } = useQuery({
    queryKey: ["designations", input],
    queryFn: () => miscService.getDesginationAutocomplete(input),
  });

  return {
    designations: data?.designations ?? [],
    isLoading,
    isError: !!error,
  };
};

export default function AudienceDesAndDepSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { localFilters, setLocalFilter, getLocalFilterValue, morphedData} = useFilterContext();
  const { designations } = useDesignationsAutocomplete(search);
  const enabled = morphedData.audienceProfile.isEnabled;
  const selectedLabels = useMemo(() => {
    const filterDesignations =
      getLocalFilterValue("designations")?.split(",").filter(Boolean) || [];
    return designations.filter((d: Designations) =>
      filterDesignations.includes(d.id)
    );
  }, [localFilters.designations, designations]);

  const handleSelect = (label: Designations) => {
    const currentDesignations =
      localFilters.designations?.split(",").filter(Boolean) || [];
    const isSelected = currentDesignations.includes(label.id);

    const newDesignations = isSelected
      ? currentDesignations.filter((id) => id !== label.id)
      : [...currentDesignations, label.id];

    setLocalFilter("designations", newDesignations.join(","));
  };

  const handleRemoveLabel = (labelId: string) => {
    const currentDesignations = localFilters.designations
      ?.split(",")
      .filter((id) => id !== labelId);
    if (currentDesignations)
      setLocalFilter("designations", currentDesignations.join(","));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={!enabled}
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            open ? "border-primary" : "border-input"
          }`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <div className="flex items-center">
          {!enabled && 
            <LockClosedSmall color="var(--secondary-text-color)" />
          }
            <span className="mr-2">Audience Profile</span>
            {selectedLabels.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedLabels.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search Audience Profile"
            onValueChange={(search) => setSearch(search)}
          />
          <CommandEmpty>No label found.</CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-48">
              {designations?.map((label: Designations) => (
                <CommandItem
                  key={label.id}
                  onSelect={() => handleSelect(label)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLabels.some((l) => l.id === label.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {label.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
        {selectedLabels.length > 0 && (
          <div className="p-2 border-t max-h-[60px] overflow-auto">
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((label) => (
                <Badge key={label.id} variant="secondary" className="mr-1 mb-1">
                  {label.name}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleRemoveLabel(label.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
