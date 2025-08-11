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
  action?: Options;
  setAction: any;
}
interface Options {
  status?: string;
  label?: string;
};
export default function BulkActionPopover({
  variant = "popover",
  filterName,
  action,
  setAction,
  options,
}: AudienceDesAndDepSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const handleSelect = (option: Options) => {
    setAction(option);
    setIsOpen(!isOpen);
  };
  
  const labels: Record<string, string> = {
    userJobTitle: "Job Title",
  };

  const triggerContent = (
    <div className="flex items-center">
      <span className="mr-2">{action?.label}</span>
    </div>
  );

  const content = (
    <>
      <Command shouldFilter={false}>
        <CommandGroup>
          <CommandList className="max-h-48">
            {options?.map((option: Options, ind: number) => (
              <CommandItem key={ind} onSelect={() => handleSelect(option)}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    option?.status === action?.status
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
                <span className="hidden">{ind}</span>
              </CommandItem>
            ))}
          </CommandList>
        </CommandGroup>
      </Command>
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
      <PopoverContent className="w-40 p-0" align="center">
        {content}
      </PopoverContent>
    </Popover>
  );
}
