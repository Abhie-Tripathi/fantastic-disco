"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const eventStatuses = [
  { id: "Event Name", label: "Event Name" },
  { id: "Location", label: "Location" },
  { id: "Type", label: "Type" },
  { id: "Duration", label: "Duration" },
  { id: "Participation", label: "Participation" },
];

interface Props {
  options: string[];
  selectedHeader: string;
}

export default function ColSelector({ options, selectedHeader }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([selectedHeader]);

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
          variant="outline"
          className={`w-full justify-between px-3 py-0 text-sm h-8 font-medium rounded-sm border-input`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">{selectedStatuses[0]}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-sm"
        align="start"
      >
        <div className="py-2">
          {options.map((status) => (
            <div
              key={status}
              className="flex items-center space-x-2 p-2 hover:bg-accent"
              onClick={() => handleStatusToggle(status)}
            >
              <label
                htmlFor={status}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
