"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";
import { isEventeli } from "@/config";
import {EventType} from "@/public/data/searchFilters"
type EventGroupType = "social" | "business" | "unAttended";

export default function EventTypeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();

  const groupedEventTypes = morphedData.eventTypes.options;
  const enabled = morphedData.eventTypes.isEnabled;

  const selectedCategories = useMemo(() => {
    const eventTypes = getLocalFilterValue("eventTypes")
      .split(",")
      .filter(Boolean);
    return {
      social: eventTypes.filter((type) =>
        groupedEventTypes.social.some((event:EventType) => event.id === type)
      ),
      business: eventTypes.filter((type) =>
        groupedEventTypes.business.some((event:EventType) => event.id === type)
      ),
      unAttended: eventTypes.filter((type) =>
        groupedEventTypes.unAttended.some((event:EventType) => event.id === type)
      ),
    };
  }, [getLocalFilterValue]);

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

  const handleSelectAll = useCallback(
    (eventGroupType: EventGroupType, isSelected: boolean) => {
      const currentSelected = Object.values(selectedCategories).flat();
      const groupCategories = groupedEventTypes[eventGroupType]
        .filter((event:EventType) => event.isEnabled)
        .map((event:EventType) => event.id);

      const newCategories = isSelected
        ? Array.from(new Set([...currentSelected, ...groupCategories]))
        : currentSelected.filter((cat) => !groupCategories.includes(cat));

      setLocalFilter("eventTypes", newCategories.join(","));
    },
    [selectedCategories, setLocalFilter]
  );

  const isAllSelected = useCallback(
    (eventGroupType: EventGroupType) => {
      const enabledCategories = groupedEventTypes[eventGroupType]
        .filter((cat:EventType) => cat.isEnabled)
        .map((cat:EventType) => cat.id);

      return (
        enabledCategories.length > 0 &&
        enabledCategories.every((catId:string) =>
          selectedCategories[eventGroupType].includes(catId)
        )
      );
    },
    [selectedCategories]
  );

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

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
            />
            <label
              htmlFor={`select-all-${type}`}
              className="italic text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    ),
    [handleCategoryToggle, handleSelectAll, isAllSelected, selectedCategories]
  );

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
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full max-w-lg border rounded-md shadow-sm p-0"
        align="start"
      >
        <div className="p-4 grid grid-cols-3 gap-4">
          {isEventeli && renderCategoryGroup("social")}
          {renderCategoryGroup("business")}
          {isEventeli && renderCategoryGroup("unAttended")}
        </div>
      </PopoverContent>
    </Popover>
  );
}