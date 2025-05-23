"use client";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import { GAEvent } from "@/utils/GAEvent";
import { cn } from "@/lib/utils";

const eventStatuses = [
  { id: "me", label: "By me" },
  { id: "others", label: "By others" },
];

interface Props {
  variant?: "accordion" | "popover";
}

export default function UpvoteSelector( {variant = "popover"}: Props ) {
  const [isOpen, setIsOpen] = useState(false);
  const { localFilters, setLocalFilter, applyFilters } = useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (localFilters?.upvotedBy)
      GAEvent("Coordinate", "Filter", "Coordinate", "Coordinate | Upvote | Auto Applied");

    setSelectedStatuses(localFilters?.upvotedBy?.split(",") || []);
  }, [localFilters.upvotedBy]);

  const selectedStatus = selectedStatuses.length;

  const handleStatusToggle = (statusId: string) => {
    const newValues = selectedStatuses.includes(statusId)
        ? selectedStatuses.filter((id) => id !== statusId)
        : [...selectedStatuses, statusId];

    setSelectedStatuses(newValues);

    if (variant === "accordion") {      
      setLocalFilter("upvotedBy", newValues.join(","));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStatuses(
      checked ? eventStatuses.map((status) => status.id) : []
    );
  };

  const handleApply = () => {
    setLocalFilter("upvotedBy", selectedStatuses.join(","));
    setIsOpen(false);
    applyFilters();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
    }
    setIsOpen(open);
  };

  const triggerContent = (
    <div className="flex items-center">
      <span className="mr-2">Upvote</span>
      {selectedStatus > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedStatus}
        </span>
      )}
    </div>
  );
  
  const content = (
    <div className={cn(
      "p-4",
      variant === "accordion" ? "grid grid-cols-1 gap-4" : "grid gap-4"
    )}>
      <div className="space-y-4">
        {eventStatuses.map((item: any) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              className="rounded-none"
              checked={selectedStatuses.includes(item.id)}
              onCheckedChange={() => handleStatusToggle(item.id)}
            />
            <label
              htmlFor={item.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between px-3 py-5 text-base font-normal ${
              isOpen ? "border-primary" : "border-input"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {triggerContent}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180 transform" : ""
              }`}
            />
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
      <AccordionItem value="eventType" className="border rounded-md">
        <AccordionTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
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
