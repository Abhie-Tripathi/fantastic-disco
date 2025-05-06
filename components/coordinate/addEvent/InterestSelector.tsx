"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { InterestConfiguration } from "@/types/configuration";

interface Props {
  options: InterestConfiguration[] | undefined;
  selectedHeader: InterestConfiguration;
  changeSelectedHeader: any;
}

export default function InterestSelector({
  options,
  selectedHeader,
  changeSelectedHeader,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusToggle = (item: InterestConfiguration) => {
    changeSelectedHeader(item);
    setIsOpen(false);
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
          className={`w-1/3 justify-between px-3 py-0 text-sm h-8 font-medium rounded-sm border-input`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">
              {selectedHeader?.label !== ""
                ? selectedHeader.label
                : "Select Action"}
            </span>
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
          <h3 className="text-xs font-medium ml-2 mb-0">Actions</h3>
          {options &&
            options.map((item) => (
              <div
                key={item.status}
                className="flex items-center space-x-2 p-2 hover:bg-accent"
                onClick={() => handleStatusToggle(item)}
              >
                <label
                  htmlFor={item.status}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
