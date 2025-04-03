"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";
import { useFilterState } from "@/hooks/useFilterState";

const maturityLevels = [
  { id: "new", label: "New" },
  { id: "growing", label: "Growing" },
  { id: "established", label: "Established" },
  { id: "flagship", label: "Flagship" },
];
interface EditionProps{
  source?:string,
  selectedStatus?: string;
  setSelectedStatus?: React.Dispatch<React.SetStateAction<string>>;
}
export default function EditionSelector({
  source,
  selectedStatus: parentSelectedFormats = "",
  setSelectedStatus: parentSetSelectedFormats,
}: EditionProps) {
  const { setFilter, getFilterValue, searchParams } = useFilterState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFormatsLocal, setSelectedFormatsLocal] = React.useState<string>("");

  const selectedStatus =
    source === "tracker" ? parentSelectedFormats : selectedFormatsLocal;
  const setSelectedStatus =
    source === "tracker" ? parentSetSelectedFormats : setSelectedFormatsLocal;

  useEffect(() => {
    if(source!=="tracker")
    setSelectedStatus?.(getFilterValue("maturity"));
  }, [searchParams]);

  const handleStatusChange = (value: string) => {
    if (value === selectedStatus) {
      setSelectedStatus?.("");
      if(source!=="tracker")
      setFilter("maturity", "");
    } else {
      setSelectedStatus?.(value);
      if(source!=="tracker")
      setFilter("maturity", value);
    }
    setIsOpen(false);
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
            <span className="mr-2">Maturity</span>
            {selectedStatus && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                1
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
        className="w-[var(--radix-popover-trigger-width)] p-4"
        align="start"
      >
        <RadioGroup
          value={selectedStatus}
          onValueChange={handleStatusChange}
          className="space-y-2"
        >
          {maturityLevels.map((maturityLevel) => (
            <div key={maturityLevel.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={maturityLevel.id}
                id={maturityLevel.id}
                onClick={(e) => {
                  if (selectedStatus === maturityLevel.id) {
                    e.preventDefault();
                    handleStatusChange(maturityLevel.id);
                  }
                }}
              />
              <Label htmlFor={maturityLevel.id}>{maturityLevel.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}