"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
import { EventType } from "@/public/data/searchFilters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlexibleComponentProps {
  variant?: "accordion" | "popover";
}

export default function EventEntrySelector({ variant = "accordion" }: FlexibleComponentProps) {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const eventEntries = morphedData?.eventEntries?.options;
  const enabled = morphedData?.eventEntries?.isEnabled || [];
  const selectedStatuses = getLocalFilterValue("entryType")
    ?.split(",")
    ?.filter(Boolean);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setLocalFilter("entryType", newStatuses.join(","));
  };

  const renderTriggerContent = (content: React.ReactNode, isOpen?: boolean, variant?: string) => (
    <div className="flex items-center justify-between w-full">
      {content}
      {variant === "popover" && (
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      )}
    </div>
  );

  const triggerContent = (
    <span className="flex items-center gap-2">
      Event Entry
      {selectedStatuses.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedStatuses.length}
        </span>
      )}
    </span>
  );

  const content = (
    <div className="p-4 space-y-4">
      {eventEntries.map((eventEntry: EventType) => (
        <div
          key={eventEntry.id}
          className={`flex items-center space-x-2 ${
            !eventEntry.isEnabled ? "opacity-50" : ""
          }`}
        >
          <Checkbox
            id={eventEntry.id}
            className="rounded-none"
            checked={selectedStatuses.includes(eventEntry.id)}
            onCheckedChange={() => handleStatusToggle(eventEntry.id)}
            disabled={!eventEntry.isEnabled}
          />
          <label htmlFor={eventEntry.id}>
            {eventEntry.label}
          </label>
        </div>
      ))}
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
            {renderTriggerContent(triggerContent, isOpen, variant)}
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
      <AccordionItem value="eventEntry" className="border rounded-md">
        <AccordionTrigger className={cn(buttonVariants({variant : "outline"}), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}>
          {renderTriggerContent(triggerContent)}
        </AccordionTrigger>
        <AccordionContent>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
