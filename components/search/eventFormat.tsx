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
import { LockClosedSmall } from "geist-icons";

interface FlexibleComponentProps {
  variant?: "accordion" | "popover";
}

export default function EventFormatSelector({
  variant = "popover",
}: FlexibleComponentProps) {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const eventFormats = morphedData?.eventFormats?.options;
  const enabled = morphedData?.eventFormats?.isEnabled;
  const selectedFormats = getLocalFilterValue("eventFormats")
    .split(",")
    .filter(Boolean)
    .map((format) => (format === "offline" ? "in_person" : format));
  const [isOpen, setIsOpen] = useState(false);

  const handleFormatToggle = (formatId: string) => {
    const newFormats = selectedFormats.includes(formatId)
      ? selectedFormats.filter((id) => id !== formatId)
      : [...selectedFormats, formatId];
    setLocalFilter("eventFormats", newFormats.join(","));
  };

  const triggerContent = (
    <span className="flex items-center">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="mr-2">Event Format</span>
      {selectedFormats.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedFormats.length}
        </span>
      )}
    </span>
  );

  const renderTriggerContent = (
    content: React.ReactNode,
    isOpen?: boolean,
    variant?: string
  ) => (
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

  const content = (
    <div className="p-4 space-y-4">
      {eventFormats?.map((eventFormat: EventType) => (
        <div key={eventFormat.id} className="flex items-center space-x-2">
          <Checkbox
            id={eventFormat.id}
            className="rounded-none"
            checked={selectedFormats.includes(eventFormat.id)}
            onCheckedChange={() => handleFormatToggle(eventFormat.id)}
            disabled={!eventFormat.isEnabled}
          />
          <label htmlFor={eventFormat.id}>{eventFormat.label}</label>
        </div>
      ))}
    </div>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={!enabled}
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between px-3 py-5 text-base font-normal"
          >
            {renderTriggerContent(triggerContent, isOpen, variant)}
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
    <Accordion type="single" collapsible>
      <AccordionItem value="eventFormat" className="border rounded-md">
        <AccordionTrigger
          disabled={!enabled}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
        >
          {renderTriggerContent(triggerContent)}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
