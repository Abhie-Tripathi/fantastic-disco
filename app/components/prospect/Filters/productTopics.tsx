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

const designationsData: Designations[] = [
  {
    id: "1",
    name: "Education & Training",
    slug: "Education & Training",
  },
  {
    id: "2",
    name: "Science & Research",
    slug: "Science & Research",
  },
  {
    id: "3",
    name: "Business Services",
    slug: "Business Services",
  },
  {
    id: "4",
    name: "Banking & Finance",
    slug: "Banking & Finance",
  },
  {
    id: "5",
    name: "IT & Technology",
    slug: "IT & Technology",
  },
];

export default function ProductTopics() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { localFilters, setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const designations: Designations[] = designationsData.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );
  const enabled = morphedData.audienceProfile.isEnabled;
  const selectedLabels = useMemo(() => {
    const filterDesignations =
      getLocalFilterValue("companyProductIds")?.split(",").filter(Boolean) || [];
    return designations.filter((d: Designations) =>
      filterDesignations.includes(d.id)
    );
  }, [localFilters.companyProductIds, designations]);

  const handleSelect = (label: Designations) => {
    const currentDesignations =
      localFilters.companyProductIds?.split(",").filter(Boolean) || [];
    const isSelected = currentDesignations.includes(label.id);

    const newDesignations = isSelected
      ? currentDesignations.filter((id) => id !== label.id)
      : [...currentDesignations, label.id];

    setLocalFilter("companyProductIds", newDesignations.join(","));
  };

  const handleRemoveLabel = (labelId: string) => {
    const currentDesignations = localFilters.companyProductIds
      ?.split(",")
      .filter((id) => id !== labelId);
    if (currentDesignations)
      setLocalFilter("companyProductIds", currentDesignations.join(","));
  };

  return (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search Products"
          onValueChange={(search) => setSearch(search)}
        />
        <CommandEmpty>No label found.</CommandEmpty>
        <CommandGroup>
          <CommandList className="max-h-48">
            {designations?.map((label: Designations) => (
              <CommandItem key={label.id} onSelect={() => handleSelect(label)}>
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
    </div>
  );
}
