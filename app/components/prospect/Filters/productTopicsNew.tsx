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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Filters, useFilterContext } from "@/context/filterContext";
import designationsData2 from "@/public/data/productsTopics.json";

const designationsData = [
  {
    id: "Owner",
    isEnabled: true,
  },
  {
    id: "Partner",
    isEnabled: true,
  },
  {
    id: "CEO",
    isEnabled: true,
  },
  {
    id: "Vice President",
    isEnabled: true,
  },
  {
    id: "Director",
    isEnabled: true,
  },
  {
    id: "Manager",
    isEnabled: true,
  },
  {
    id: "Individual",
    isEnabled: true,
  },
  {
    id: "Training",
    isEnabled: true,
  },
];

interface Props {
  filterName: keyof Filters;
  variant?: "accordion" | "popover";
}

export default function ProductTopicsNew({ filterName, variant = "accordion" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { localFilters, setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();

  const categories = designationsData2.filter((country: any) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabels = useMemo(() => {
    const filterDesignations =
      getLocalFilterValue(filterName)?.split(",").filter(Boolean) || [];
    return categories.filter((d: any) =>
      filterDesignations.includes(d.id)
    );
  }, [localFilters[filterName], categories]);

  const handleSelect = (label: any) => {
    const currentDesignations =
      localFilters[filterName]?.split(",").filter(Boolean) || [];
    const isSelected = currentDesignations.includes(label.id);

    const newDesignations = isSelected
      ? currentDesignations.filter((id) => id !== label.id)
      : [...currentDesignations, label.id];

    setLocalFilter(filterName, newDesignations.join(","));
  };

  const handleRemoveLabel = (labelId: string) => {
    const currentDesignations = localFilters[filterName]
      ?.split(",")
      .filter((id) => id !== labelId);
    if (currentDesignations)
      setLocalFilter(filterName, currentDesignations.join(","));
  };

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        Product & Topics
        {selectedLabels.length > 0 && (
          <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
            {selectedLabels.length}
          </span>
        )}
      </span>
    </div>
  );

  const content = (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search Role"
          onValueChange={(search) => setSearch(search)}
        />
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup>
          <CommandList className="max-h-48">
            {categories?.map((label: any) => (
              <CommandItem key={label.id} onSelect={() => handleSelect(label)} >
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

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
          >
            {triggerContent}
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
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
      <AccordionItem value="industry" className="border rounded-md">
        <AccordionTrigger 
          className={cn(buttonVariants({ variant: "outline" }), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}
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
