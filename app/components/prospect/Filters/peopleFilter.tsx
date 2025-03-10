"use client";

import React, { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterContext } from "@/context/filterContext";

interface PeopleFilterProps {
  filterName: "userNames" | "userSocialLink";
  variant?: "accordion" | "popover";
}

export default function PeopleFilter({ 
  filterName,
  variant = "accordion" 
}: PeopleFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { localFilters, setLocalFilter, getLocalFilterValue } = useFilterContext();

  const placeholder = filterName === "userSocialLink" ? "LinkedIn" : "Name";

  const inputValue = useMemo(() => {
    return getLocalFilterValue(filterName) ?? "";
  }, [localFilters?.[filterName]]);

  const handleInputChange = (input: string) => {
    if (input.trim()) {
      setLocalFilter(filterName, input.trim());
    } else {
      setLocalFilter(filterName, "");
    }
  };

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        {filterName === "userNames" ? "User Name" : "LinkedIn"}
        {inputValue && (
          <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
            1
          </span>
        )}
      </span>
    </div>
  );

  const content = (
    <div className="w-full max-w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0">
      <div className="relative flex-grow p-2">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={`Search by ${placeholder}`}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-8 outline-none focus-visible:ring-0"
        />
      </div>
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
      <AccordionItem value={filterName} className="border rounded-md">
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
