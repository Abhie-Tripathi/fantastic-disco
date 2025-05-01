"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

const eventStatuses = [
  { id: "tradeshow", label: "Tradeshow" },
  { id: "conference", label: "Conference" },
  { id: "workshop", label: "Workshop" },
];

export default function EventType() {
  const [isOpen, setIsOpen] = useState(false);
  const { localFilters, setLocalFilter, applyFilters } = useFilterContext();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const selectedStatus = selectedStatuses.length;

  const handleStatusToggle = (statusId: string) => {
    setSelectedStatuses([statusId]);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-4 text-[var(--tertiary-text-color)]">
              Choose Your Event Type
            </span>
            {selectedStatus > 0 && (
              <span className="text-xs font-semibold text-primary">
                {selectedStatuses[0]}
              </span>
            )}
          </div>
          {/* <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 space-y-2">
          <RadioGroup
            value={selectedStatuses[0]}
            onValueChange={handleStatusToggle}
            className="space-y-2"
          >
            {eventStatuses.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={item.id}
                  id={item.id}
                  onClick={(e) => {
                    if (selectedStatus === item.id) {
                      e.preventDefault();
                      handleStatusToggle(item.id);
                    }
                  }}
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
