import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";

const eventFormats = [
  { id: "online", label: "Online/Virtual" },
  { id: "offline", label: "Offline" },
  { id: "hybrid", label: "Hybrid" },
];

export default function EventFormatSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();

  const selectedFormats = getLocalFilterValue("eventFormats")
    .split(",")
    .filter(Boolean);
  const selectedCount = selectedFormats.length;

  const handleFormatToggle = (formatId: string) => {
    const newFormats = selectedFormats.includes(formatId)
      ? selectedFormats.filter((id) => id !== formatId)
      : [...selectedFormats, formatId];
    setLocalFilter("eventFormats", newFormats.join(","));
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

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
          <div className="flex items-center">
            <span className="mr-2">Event Format</span>
            {selectedCount > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedCount}
              </span>
            )}
          </div>
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
        <div className="p-4 space-y-4">
          {eventFormats.map((eventFormat) => (
            <div key={eventFormat.id} className="flex items-center space-x-2">
              <Checkbox
                id={eventFormat.id}
                className="rounded-none"
                checked={selectedFormats.includes(eventFormat.id)}
                onCheckedChange={() => handleFormatToggle(eventFormat.id)}
              />
              <label
                htmlFor={eventFormat.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {eventFormat.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
