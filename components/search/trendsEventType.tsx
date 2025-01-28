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
import { columnsDropdown } from "@/data/trends";

type EventGroupType = "social" | "business";

const groupedEventTypes: Record<EventGroupType, string[]> = {
  social: ["festival", "concert", "sport", "performing-arts", "community"],
  business: ["tradeshows", "conferences", "workshops"],
};

export default function TrendsEventTypeSelector() {
  const { getLocalFilterValue, setLocalFilter } = useFilterContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    Record<EventGroupType, string[]>
  >({
    social: [],
    business: [],
  });

  useEffect(() => {
    const eventTypes = getLocalFilterValue("eventTypes")
      .split(",")
      .filter(Boolean);
    const initialSelectedCategories = Object.fromEntries(
      Object.entries(groupedEventTypes).map(([key, values]) => [
        key,
        values.filter((type) => eventTypes.includes(type)),
      ])
    ) as Record<EventGroupType, string[]>;
    setSelectedCategories(initialSelectedCategories);
  }, [getLocalFilterValue]);

  const selectedCategoriesCount = useMemo(
    () => getLocalFilterValue("eventTypes").split(",").filter(Boolean).length,
    [getLocalFilterValue]
  );

  const handleCategoryToggle = useCallback((eventGroupType: EventGroupType) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [eventGroupType]:
        prev[eventGroupType].length === groupedEventTypes[eventGroupType].length
          ? []
          : [...groupedEventTypes[eventGroupType]],
    }));
  }, []);

  const isCategorySelected = useCallback(
    (eventGroupType: EventGroupType) => {
      return (
        selectedCategories[eventGroupType].length ===
        groupedEventTypes[eventGroupType].length
      );
    },
    [selectedCategories]
  );

  const handleSelectAll = useCallback(
    (eventGroupType: EventGroupType, isSelected: boolean) => {
      setSelectedCategories((prev) => ({
        ...prev,
        [eventGroupType]: isSelected ? groupedEventTypes[eventGroupType] : [],
      }));
    },
    []
  );

  const isAllSelected = useCallback(
    (eventGroupType: EventGroupType) => {
      const allCategories = groupedEventTypes[eventGroupType];
      return (
        allCategories.length > 0 &&
        allCategories.every((cat) =>
          selectedCategories[eventGroupType].includes(cat)
        )
      );
    },
    [selectedCategories]
  );

  const handleApply = useCallback(() => {
    const allSelected = Object.values(selectedCategories).flat();
    setLocalFilter("eventTypes", allSelected.join(","));
    setLocalFilter(
      "columns",
      columnsDropdown
        .filter((dropdown) => dropdown.value !== "impactScore")
        .map((filteredValue) => filteredValue.value)
        .join(",")
    );
    setLocalFilter("show", "alerts,scores,economicImpact");
    setIsOpen(false);
  }, [selectedCategories, setLocalFilter]);

  const renderCategoryGroup = useCallback(
    (type: EventGroupType) => (
      <div key={type}>
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            className="rounded-[2.5px]"
            id={`select-all-${type}`}
            checked={isCategorySelected(type)}
            onCheckedChange={() => handleCategoryToggle(type)}
          />
          <label htmlFor={`select-all-${type}`} className="text-xs font-medium">
            {type.toUpperCase()}
          </label>
        </div>
        <ul className="space-y-3">
          {groupedEventTypes[type].map((category) => (
            <li
              key={category}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </li>
          ))}
        </ul>
      </div>
    ),
    [handleCategoryToggle, isCategorySelected]
  );

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
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center">
            <span className="mr-2">Event Type</span>
            {selectedCategoriesCount > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedCategoriesCount}
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
        <div className="p-4 grid grid-cols-2 gap-4">
          {renderCategoryGroup("business")}
        </div>
      </PopoverContent>
    </Popover>
  );
}
