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
import { useQuery } from "@tanstack/react-query";
import { Filters, useFilterContext } from "@/context/filterContext";
import { Designations } from "@/types/misc";

interface AudienceDesAndDepSelectorProps {
  variant?: "accordion" | "popover";
  filterName?: string;
  options: any;
}
interface Options{
  status?:string;
  label?:string;
}
export default function BulkActionPopover({
  variant = "popover",
  filterName,
  options
}: AudienceDesAndDepSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [action,setAction] = useState(options[0]);
//   const { localFilters, setLocalFilter, getLocalFilterValue, morphedData } =
//     useFilterContext();
//     console.log(options);
//   const enabled = morphedData.audienceProfile?.isEnabled;
//   const selectedLabels = useMemo(() => {
//     const filterDesignations =
//       getLocalFilterValue(filterName as keyof Filters || "designations")
//         ?.split(",")
//         .filter(Boolean) || [];
//     return designations.filter((d: Designations) =>
//       filterDesignations.includes(d.slug)
//     );
//   }, [localFilters[filterName as keyof Filters || "designations"], designations]);

//   console.log("selectedLabels", selectedLabels);

//   const handleSelect = (label: Designations) => {
//     const currentDesignations =
//       localFilters[filterName as keyof Filters || "designations"]?.split(",").filter(Boolean) || [];
//     const isSelected = currentDesignations.includes(label.slug);

//     const newDesignations = isSelected
//       ? currentDesignations.filter((id) => id !== label.slug)
//       : [...currentDesignations, label.slug];

//     setLocalFilter(filterName as keyof Filters || "designations", newDesignations.join(","));
//   };
  const handleSelect=(option: Options)=>{
    setAction(option)
    setIsOpen(!isOpen)
  }
//   const handleRemoveLabel = (labelId: string) => {
//     const currentDesignations = localFilters[filterName as keyof Filters || "designations"]
//       ?.split(",")
//       .filter((id) => id !== labelId);
//     if (currentDesignations)
//       setLocalFilter(
//         filterName as keyof Filters || "designations",
//         currentDesignations.join(",")
//       );
//   };

  const labels: Record<string, string> = {
    userJobTitle: "Job Title",
  };
  console.log(options);
  
  const triggerContent = (
    <div className="flex items-center">
      <span className="mr-2">
        {action?.label}
      </span>
      {/* {selectedLabels.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedLabels.length}
        </span>
      )} */}
    </div>
  );

  const content = (
    <>
      <Command shouldFilter={false}>
        <CommandGroup>
          <CommandList className="max-h-48">
            {options?.map((option: Options,ind: number) => (
              <CommandItem key={ind} onSelect={() => handleSelect(option)}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    option.status === action.status
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </CommandGroup>
      </Command>
      {/* {selectedLabels.length > 0 && (
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
      )} */}
    </>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-3 text-base font-normal"
            // disabled={!enabled}
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
