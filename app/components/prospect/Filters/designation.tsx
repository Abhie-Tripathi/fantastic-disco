"use client";

import React, { useState, useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useFilterContext } from "@/context/filterContext";
import { useMiscService } from "@/services/miscService";
import { useQuery } from "@tanstack/react-query";

// const designationsData = [];

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

export default function Designation() {
  const [search, setSearch] = useState("");
  const { localFilters, setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

//   const categories = morphedData.categories.options;
  const { designations } = useDesignationsAutocomplete(search);

  const selectedLabels = useMemo(() => {
    const filterDesignations =
      getLocalFilterValue("userJobTitle")?.split(",").filter(Boolean) || [];
    return designations.filter((d: any) =>
      filterDesignations.includes(d.id)
    );
  }, [localFilters.userJobTitle, designations]);

  const handleSelect = (label: any) => {
    const currentDesignations =
      localFilters.userJobTitle?.split(",").filter(Boolean) || [];
    const isSelected = currentDesignations.includes(label.id);

    const newDesignations = isSelected
      ? currentDesignations.filter((id) => id !== label.id)
      : [...currentDesignations, label.id];

    setLocalFilter("userJobTitle", newDesignations.join(","));
  };

  const handleRemoveLabel = (labelId: string) => {
    const currentDesignations = localFilters.userJobTitle
      ?.split(",")
      .filter((id) => id !== labelId);
    if (currentDesignations)
      setLocalFilter("userJobTitle", currentDesignations.join(","));
  };

  return (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search Industry"
          onValueChange={(search) => setSearch(search)}
        />
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup>
          <CommandList className="max-h-48">
            {designations?.map((label: any) => (
              <CommandItem key={label.id} onSelect={() => handleSelect(label)}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLabels.some((l: any) => l.id === label.id)
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
            {selectedLabels.map((label: any) => (
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
    </div>
  );
}
