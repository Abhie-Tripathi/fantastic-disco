"use client";
import React, { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CollectionTypeSelectorProps {
  presetType: string[];
  setPresetType: (types: string[]) => void;
  maxTypes?: number;
}

export default function CollectionTypeSelector({
  presetType,
  setPresetType,
  maxTypes,
}: CollectionTypeSelectorProps) {
  // Fixed options
  const collectionTypes = [
    { slug: "purpose", name: "Purpose" },
    { slug: "people", name: "People" },
    { slug: "prospect", name: "Prospect" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(
    (slug: string) => {
      const newTypes = presetType.includes(slug)
        ? presetType.filter((s) => s !== slug)
        : [...presetType, slug];

      if (maxTypes && !presetType.includes(slug) && newTypes.length > maxTypes) {
        return;
      }

      setPresetType(newTypes);
    },
    [presetType, setPresetType, maxTypes]
  );

  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      setPresetType(isSelected ? collectionTypes.map((t) => t.slug) : []);
    },
    [setPresetType, collectionTypes]
  );

  const isAllSelected = useMemo(
    () => collectionTypes.every((t) => presetType.includes(t.slug)),
    [presetType, collectionTypes]
  );

  const triggerContent = (
    <div className="flex items-center">
      <span className="mr-2">Type</span>
      {presetType.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {presetType.length}
        </span>
      )}
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-3 py-5 text-base font-normal"
        >
          {triggerContent}
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={() => handleSelectAll(!isAllSelected)}
              className="rounded-none"
            />
            <span>All</span>
          </div>
          {collectionTypes.map((type) => (
            <div key={type.slug} className="flex items-center gap-2">
              <Checkbox
                checked={presetType.includes(type.slug)}
                onCheckedChange={() => handleToggle(type.slug)}
                className="rounded-none"
              />
              <span>{type.name}</span>
            </div>
          ))}
          {maxTypes && presetType.length >= maxTypes && (
            <div className="text-sm text-muted-foreground">
              Maximum of {maxTypes} collection types can be selected
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
