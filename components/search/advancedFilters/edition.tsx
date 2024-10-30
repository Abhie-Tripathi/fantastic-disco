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
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";

const maturityLevels = [
  { id: "new", label: "New" },
  { id: "growing", label: "Growing" },
  { id: "established", label: "Established" },
  { id: "flagship", label: "Flagship" },
];

export default function EditionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, searchParams } =
    useFilterContext();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showInFilter, setShowInFilter] = useState(false);

  useEffect(() => {
    setSelectedStatus(getLocalFilterValue("maturity"));
    setShowInFilter(getLocalFilterValue("show").includes("maturity"));
  }, [searchParams]);

  const handleStatusChange = (value: string) => {
    if (value === selectedStatus) {
      setSelectedStatus("");
      setLocalFilter("maturity", "");
    } else {
      setSelectedStatus(value);
      setLocalFilter("maturity", value);
    }
    setIsOpen(false);
  };

  const handleShowToggle = (checked: boolean) => {
    setShowInFilter(checked);
    const currentShow = getLocalFilterValue("show").split(",").filter(Boolean);
    const newShow = checked
      ? Array.from(new Set([...currentShow, "maturity"]))
      : currentShow.filter((item: string) => item !== "maturity");
    setLocalFilter("show", newShow.join(","));
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
          <Switch
            checked={showInFilter}
            onCheckedChange={handleShowToggle}
            aria-label="Show Maturity in filter"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.stopPropagation()
            }
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
