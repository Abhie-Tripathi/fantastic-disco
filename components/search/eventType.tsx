"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
import { isEventeli } from "@/config";
import { EventType } from "@/public/data/searchFilters";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type EventGroupType = "social" | "business" | "unAttended";

interface EventTypeSelectorProps {
  variant?: "accordion" | "popover";
}

export default function EventTypeSelector({
  variant = "accordion",
}: EventTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();

  const groupedEventTypes = morphedData.eventTypes.options;
  const enabled = morphedData.eventTypes.isEnabled;

  const selectedCategories = useMemo(() => {
    const eventTypes = getLocalFilterValue("eventTypes")
      .split(",")
      .filter(Boolean);
    return {
      social: eventTypes.filter((type) =>
        groupedEventTypes.social.some((event: EventType) => event.id === type)
      ),
      business: eventTypes.filter((type) =>
        groupedEventTypes.business.some((event: EventType) => event.id === type)
      ),
      unAttended: eventTypes.filter((type) =>
        groupedEventTypes.unAttended.some(
          (event: EventType) => event.id === type
        )
      ),
    };
  }, [getLocalFilterValue, groupedEventTypes]);

  const handleCategoryToggle = useCallback(
    (eventGroupType: EventGroupType, categoryId: string) => {
      const allSelected = Object.values(selectedCategories).flat();
      const newCategories = allSelected.includes(categoryId)
        ? allSelected.filter((id) => id !== categoryId)
        : [...allSelected, categoryId];
      setLocalFilter("eventTypes", newCategories.join(","));
    },
    [selectedCategories, setLocalFilter]
  );

  const isAnyDisabled = useCallback(
    (eventGroupType: EventGroupType) => {
      return groupedEventTypes[eventGroupType].some(
        (event: EventType) => !event.isEnabled
      );
    },
    [groupedEventTypes]
  );

  const handleSelectAll = useCallback(
    (eventGroupType: EventGroupType, isSelected: boolean) => {
      const currentSelected = Object.values(selectedCategories).flat();
      const groupCategories = groupedEventTypes[eventGroupType]
        .filter((event: EventType) => event.isEnabled)
        .map((event: EventType) => event.id);

      const newCategories = isSelected
        ? Array.from(new Set([...currentSelected, ...groupCategories]))
        : currentSelected.filter((cat) => !groupCategories.includes(cat));

      setLocalFilter("eventTypes", newCategories.join(","));
    },
    [selectedCategories, setLocalFilter, groupedEventTypes]
  );

  const isAllSelected = useCallback(
    (eventGroupType: EventGroupType) => {
      const enabledCategories = groupedEventTypes[eventGroupType]
        .filter((cat: EventType) => cat.isEnabled)
        .map((cat: EventType) => cat.id);

      return (
        enabledCategories.length > 0 &&
        enabledCategories.every((catId: string) =>
          selectedCategories[eventGroupType].includes(catId)
        ) &&
        !isAnyDisabled(eventGroupType)
      );
    },
    [selectedCategories, groupedEventTypes, isAnyDisabled]
  );

  const renderCategoryGroup = useCallback(
    (type: EventGroupType) => (
      <div key={type}>
        <h3 className="text-xs font-medium mb-2">{type.toUpperCase()}</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              className="rounded-[2.5px]"
              id={`select-all-${type}`}
              checked={isAllSelected(type)}
              onCheckedChange={(checked) =>
                handleSelectAll(type, checked as boolean)
              }
              disabled={isAnyDisabled(type)}
            />
            <label
              htmlFor={`select-all-${type}`}
              className={`italic text-sm font-medium leading-none text-nowrap peer-disabled:cursor-not-allowed ${
                isAnyDisabled(type) ? "opacity-70" : ""
              }`}
            >
              Select All
            </label>
          </div>
          {groupedEventTypes[type].map((category: EventType) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                className="rounded-[2.5px]"
                id={category.id}
                checked={selectedCategories[type].includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(type, category.id)}
                disabled={!category.isEnabled}
              />
              <label
                htmlFor={category.id}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                  !category.isEnabled ? "opacity-70" : ""
                }`}
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    ),
    [
      handleCategoryToggle,
      handleSelectAll,
      isAllSelected,
      selectedCategories,
      groupedEventTypes,
      isAnyDisabled,
    ]
  );

  const triggerContent = (
    <div className="flex items-center">
      <span className="mr-2">Event Type</span>
      {(selectedCategories.social.length > 0 ||
        selectedCategories.business.length > 0 ||
        selectedCategories.unAttended.length > 0) && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedCategories.social.length +
            selectedCategories.business.length +
            selectedCategories.unAttended.length}
        </span>
      )}
    </div>
  );

  const content = (
    <div className="p-4 grid grid-cols-3 gap-4">
      {isEventeli && renderCategoryGroup("social")}
      {renderCategoryGroup("business")}
      {isEventeli && renderCategoryGroup("unAttended")}
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
