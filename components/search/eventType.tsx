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
import {toast} from 'react-toastify'
type EventGroupType = "social" | "business";

const groupedEventTypes: Record<EventGroupType, string[]> = {
  social: ["festival", "concert", "sport", "performing-arts", "community"],
  business: ["tradeshows", "conferences", "workshops"],
};
interface typeInterface{
  enabledValue?: string[];
  selectedValue?: string[]; 
}
interface EventTypeProps{
  source: string;
  enabledTypeData?:typeInterface;
  selectedCategories?: Record<EventGroupType, string[]>;
  setSelectedCategories?: React.Dispatch<React.SetStateAction<Record<EventGroupType, string[]>>>;
}
export default function EventTypeSelector({
  source,
  enabledTypeData,
  selectedCategories: parentSelectedCategories = { social: [], business: [] },
  setSelectedCategories: parentSetSelectedCategories,
}:EventTypeProps) {
  const { getLocalFilterValue, setLocalFilter } = useFilterContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoriesLocal, setSelectedCategoriesLocal] = useState<
    Record<EventGroupType, string[]>
  >({
    social: [],
    business: [],
  });
  const selectedCategories =
    source === "tracker" ? parentSelectedCategories : selectedCategoriesLocal;
  const setSelectedCategories =
    source === "tracker" ? parentSetSelectedCategories : setSelectedCategoriesLocal;
  useEffect(() => {
    if(source!=="tracker"){
    const eventTypes = getLocalFilterValue("eventTypes")
      .split(",")
      .filter(Boolean);
    const initialSelectedCategories = Object.fromEntries(
      Object.entries(groupedEventTypes).map(([key, values]) => [
        key,
        values.filter((type) => eventTypes.includes(type)),
      ])
    ) as Record<EventGroupType, string[]>;
    setSelectedCategories?.(initialSelectedCategories);
  }
  }, [getLocalFilterValue]);

  const selectedCategoriesCount = useMemo(
    () => getLocalFilterValue("eventTypes").split(",").filter(Boolean).length,
    [getLocalFilterValue]
  );

  const handleCategoryToggle = useCallback(
    (eventGroupType: EventGroupType, categoryId: string) => {
      setSelectedCategories?.((prev) => {
        if (
          enabledTypeData?.enabledValue &&
          prev[eventGroupType].length === 1 &&
          prev[eventGroupType].includes(categoryId)
        ) {
          toast.error("At least one filter must be selected", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
          });
          return prev; 
        }
      
        return {
          ...prev,
          [eventGroupType]: prev[eventGroupType].includes(categoryId)
            ? prev[eventGroupType].filter((slug) => slug !== categoryId)
            : [...prev[eventGroupType], categoryId],
        };
      });
      
    },
    [enabledTypeData]
  );

  const handleSelectAll = useCallback(
    (eventGroupType: EventGroupType, isSelected: boolean) => {
      setSelectedCategories?.((prev) => ({
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
    setIsOpen(false);
  }, [selectedCategories, setLocalFilter]);
  console.log(selectedCategories);
  
  const renderCategoryGroup = useCallback(
    (type: EventGroupType) => (
      <div key={type}>
        <h3 className="text-xs font-medium mb-2">{type.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              className="rounded-[2.5px]"
              disabled={
                !(enabledTypeData?.enabledValue?.length ===
                (groupedEventTypes?.business?.length || 0))
              }
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
          {groupedEventTypes[type].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                className="rounded-[2.5px]"
                id={category}
                disabled={enabledTypeData &&
                  enabledTypeData.enabledValue && !enabledTypeData?.enabledValue?.includes(category.charAt(0).toUpperCase() + category.slice(1).replace(/s$/, ''))}
                checked={selectedCategories[type].includes(category)}
                onCheckedChange={() => handleCategoryToggle(type, category)}
              />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
            </div>
          ))}
        </div>
      </div>
    ),
    [handleCategoryToggle, handleSelectAll, isAllSelected, selectedCategories]
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
            {(selectedCategories.social.length > 0 || selectedCategories.business.length > 0) && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedCategories.social.length + selectedCategories.business.length}
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
          {/* {renderCategoryGroup("social")} */}
          {renderCategoryGroup("business")}
        </div>
      </PopoverContent>
    </Popover>
  );
}