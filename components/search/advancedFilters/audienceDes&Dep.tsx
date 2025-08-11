"use client";
import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LockClosedSmall } from "geist-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useMiscService } from "@/services/miscService";
import { useQuery } from "@/hooks/useQuery";
import { Filters, useFilterContext } from "@/context/filterContext";
import { Designations } from "@/types/misc";

interface AudienceDesAndDepSelectorProps {
  variant?: "accordion" | "popover";
  filterName?: string;
}

const useDesignationsAutocomplete = (input: string) => {
  const miscService = useMiscService();
  const { data, error, isLoading } = useQuery({
    queryKey: ["designations", input],
    queryFn: () => miscService.getDesginationAutocomplete(input),
  });

  return {
    designations: (data as any)?.designations ?? [],
    isLoading,
    isError: !!error,
  };
};

export default function AudienceDesAndDepSelector({
  variant = "popover",
  filterName,
}: AudienceDesAndDepSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { localFilters, setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const { designations } = useDesignationsAutocomplete(search);
  const enabled = morphedData.audienceProfile?.isEnabled;
  // Keep track of all selected designations separately from search results
  const [selectedDesignationsCache, setSelectedDesignationsCache] = useState<
    Designations[]
  >([]);

  const selectedLabels = useMemo(() => {
    const filterDesignations =
      getLocalFilterValue((filterName as keyof Filters) || "designations")
        ?.split(",")
        .filter(Boolean) || [];

    // Get selected items from current designations
    const currentSelected = designations.filter((d: Designations) =>
      filterDesignations.includes(d.slug)
    );

    // Get selected items from cache that might not be in current search results
    const cachedSelected = selectedDesignationsCache.filter(
      (d: Designations) =>
        filterDesignations.includes(d.slug) &&
        !currentSelected.some((current: any) => current.slug === d.slug)
    );

    return [...currentSelected, ...cachedSelected];
  }, [
    localFilters[(filterName as keyof Filters) || "designations"],
    designations,
    selectedDesignationsCache,
  ]);

  // Merge search results with selected items to ensure selected items are always visible
  const displayDesignations = useMemo(() => {
    const selectedSlugs = selectedLabels.map((label) => label.slug);
    const searchResults = designations || [];

    // Create a map to avoid duplicates
    const designationMap = new Map();

    // Add selected items first
    selectedLabels.forEach((label) => {
      designationMap.set(label.slug, label);
    });

    // Add search results
    searchResults.forEach((designation: Designations) => {
      designationMap.set(designation.slug, designation);
    });

    return Array.from(designationMap.values());
  }, [designations, selectedLabels]);

  // Handle open/close state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Reset search when closing
    if (!open) {
      setSearch("");
    }
  };

  const handleSelect = (label: Designations) => {
    const currentDesignations =
      localFilters[(filterName as keyof Filters) || "designations"]
        ?.split(",")
        .filter(Boolean) || [];
    const isSelected = currentDesignations.includes(label.slug);

    const newDesignations = isSelected
      ? currentDesignations.filter((id) => id !== label.slug)
      : [...currentDesignations, label.slug];

    setLocalFilter(
      (filterName as keyof Filters) || "designations",
      newDesignations.join(",")
    );

    // Update cache with selected designations
    if (!isSelected) {
      // Add to cache if not already there
      setSelectedDesignationsCache((prev) => {
        const exists = prev.some((item) => item.slug === label.slug);
        return exists ? prev : [...prev, label];
      });
    } else {
      // Remove from cache when deselected
      setSelectedDesignationsCache((prev) =>
        prev.filter((item) => item.slug !== label.slug)
      );
    }
  };

  const handleRemoveLabel = (labelId: string) => {
    const currentDesignations = localFilters[
      (filterName as keyof Filters) || "designations"
    ]
      ?.split(",")
      .filter((id) => id !== labelId);
    if (currentDesignations)
      setLocalFilter(
        (filterName as keyof Filters) || "designations",
        currentDesignations.join(",")
      );

    // Remove from cache as well
    setSelectedDesignationsCache((prev) =>
      prev.filter((item) => item.slug !== labelId)
    );
  };

  const labels: Record<string, string> = {
    userJobTitle: "Job Title",
  };

  const triggerContent = (
    <div className="flex items-center">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="mr-2">
        {labels[filterName as keyof typeof labels] || "Audience Profile"}
      </span>
      {selectedLabels.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedLabels.length}
        </span>
      )}
    </div>
  );

  const content = (
    <>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search Audience Profile"
          value={search}
          onValueChange={(search) => setSearch(search)}
        />
        <CommandEmpty>No label found.</CommandEmpty>
        <CommandGroup>
          <CommandList className="max-h-48">
            {displayDesignations?.map((label: Designations) => (
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
                  onClick={() => handleRemoveLabel(label.slug)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
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
    <Accordion
      type="single"
      collapsible
      onValueChange={(value) => {
        const isOpen = Boolean(value);
        setIsOpen(isOpen);
        // Reset search when closing accordion
        if (!isOpen) {
          setSearch("");
        }
      }}
    >
      <AccordionItem value="audienceProfile" className="border rounded-md">
        <AccordionTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
          disabled={!enabled}
        >
          <div className="flex items-center justify-between w-full">
            {triggerContent}
          </div>
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
