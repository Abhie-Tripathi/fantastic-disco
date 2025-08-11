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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LockClosedSmall } from "geist-icons";

interface FlexibleComponentProps {
  variant?: "accordion" | "popover";
}

export default function StatusSelector({
  variant = "popover",
}: FlexibleComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const eventStatuses = morphedData.eventStatus.options;
  const enabled = morphedData.eventStatus.isEnabled;
  const selectedStatuses = getLocalFilterValue("status")
    .split(",")
    .map((status) => status.toLowerCase())
    .filter(Boolean);

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setLocalFilter("status", newStatuses.join(","));
  };

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

  const triggerContent = (
    <span className="flex items-center">
      {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
      <span className="mr-2">Event Status</span>
      {selectedStatuses.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedStatuses.length}
        </span>
      )}
    </span>
  );

  const content = (
    <div className="p-4 space-y-4">
      {eventStatuses?.map((status: EventType) => (
        <div key={status.id} className="flex items-center space-x-2">
          <Checkbox
            id={status.id}
            disabled={!status.isEnabled}
            className="rounded-none"
            checked={selectedStatuses.includes(status.id)}
            onCheckedChange={() => handleStatusToggle(status.id)}
          />
          <label htmlFor={status.id}>{status.label}</label>
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
      <AccordionItem value="status" className="border rounded-md">
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
