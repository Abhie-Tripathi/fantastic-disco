"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterContext } from "@/context/filterContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LockClosedSmall } from "geist-icons";
import { EventType } from "@/public/data/searchFilters";

interface EditionSelectorProps {
  variant?: "accordion" | "popover";
}

export default function EditionSelector({
  variant = "popover",
}: EditionSelectorProps) {
  const { getLocalFilterValue, setLocalFilter, morphedData } = useFilterContext();
  const [isOpen, setIsOpen] = useState(false);

  const maturityLevels = morphedData.maturity.options;
  const showToogle = morphedData.maturity.isToogleEnabled;
  const enabled = morphedData.maturity.isEnabled;

  const selectedStatus = useMemo(
    () => getLocalFilterValue("maturity"),
    [getLocalFilterValue]
  );

  const showInFilter = useMemo(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    return showFilters.includes("maturity");
  }, [getLocalFilterValue]);

  const handleStatusChange = (value: string) => {
    if (value === selectedStatus) {
      setLocalFilter("maturity", "");
    } else {
      setLocalFilter("maturity", value);
    }
  };

  const handleShowToggle = (checked: boolean) => {
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "maturity"]))
      : currentShow.filter((item) => item !== "maturity");

    setLocalFilter("show", newShow.join(","));

    if (!checked) {
      setLocalFilter("maturity", "");
    }
  };

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />}
        <span className="flex items-center gap-2">
          Maturity
          {selectedStatus && (
            <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
              1
            </span>
          )}
        </span>
      </div>
      <Switch
        checked={showInFilter}
        onCheckedChange={handleShowToggle}
        aria-label="Show Maturity in filter"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );

  const content = (
    <div className="p-4">
      <RadioGroup
        value={selectedStatus}
        onValueChange={handleStatusChange}
        className="space-y-2"
      >
        {maturityLevels.map((maturityLevel: EventType) => (
          <div key={maturityLevel.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={maturityLevel.id}
              id={maturityLevel.id}
              disabled={!maturityLevel.isEnabled}
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
            disabled={!enabled}
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
      <AccordionItem value="edition" className="border rounded-md">
        <AccordionTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
          disabled={!enabled}
        >
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
