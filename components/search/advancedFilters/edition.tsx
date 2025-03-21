"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterState } from "@/hooks/useFilterState";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const maturityLevels = [
  { id: "new", label: "New" },
  { id: "growing", label: "Growing" },
  { id: "established", label: "Established" },
  { id: "flagship", label: "Flagship" },
];

interface EditionProps {
  source?: string;
  selectedStatus?: string;
  setSelectedStatus?: React.Dispatch<React.SetStateAction<string>>;
}

interface EditionSelectorProps extends EditionProps {
  variant?: "accordion" | "popover";
}

export default function EditionSelector({
  source,
  selectedStatus: parentSelectedFormats = "",
  setSelectedStatus: parentSetSelectedFormats,
  variant = "accordion"
}: EditionSelectorProps) {
  const { setFilter, getFilterValue, searchParams } = useFilterState();
  const [selectedFormatsLocal, setSelectedFormatsLocal] =
    React.useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedStatus =
    source === "tracker" ? parentSelectedFormats : selectedFormatsLocal;
  const setSelectedStatus =
    source === "tracker" ? parentSetSelectedFormats : setSelectedFormatsLocal;

  useEffect(() => {
    if (source !== "tracker") setSelectedStatus?.(getFilterValue("maturity"));
  }, [searchParams]);

  const handleStatusChange = (value: string) => {
    if (value === selectedStatus) {
      setSelectedStatus?.("");
      if (source !== "tracker") setFilter("maturity", "");
    } else {
      setSelectedStatus?.(value);
      if (source !== "tracker") setFilter("maturity", value);
    }
  };

  const triggerContent = (
    <span className="flex items-center gap-2">
      Maturity
      {selectedStatus && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          1
        </span>
      )}
    </span>
  );

  const content = (
    <div className="p-4">
      <RadioGroup
        value={selectedStatus}
        onValueChange={handleStatusChange}
        className="space-y-2"
      >
        {maturityLevels.map((maturityLevel) => (
          <div
            key={maturityLevel.id}
            className="flex items-center space-x-2"
          >
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
            <Label htmlFor={maturityLevel.id}>
              {maturityLevel.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
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
            <div className="flex items-center justify-between w-full">
              {triggerContent}
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
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
      <AccordionItem value="edition" className="border rounded-md">
        <AccordionTrigger 
          className={cn(buttonVariants({variant: "outline"}), "no-underline border-none justify-between px-3 py-5 text-base font-normal")}
        >
          <div className="flex items-center justify-between w-full">
            {triggerContent}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
