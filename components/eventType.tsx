"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react"
import { useFilterState } from "@/hooks/useFilterState";

type EventGroupType = "social" | "business";

const groupedEventTypes: Record<EventGroupType, string[]> = {
  social: ["festival", "concert", "sport", "performing-arts", "community"],
  business: ["tradeshows", "conferences", "workshops"],
};
interface EventTypeProps{
  source: string;
  selectedCategories?: string[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function EventTypeSelector({
  source,
  selectedCategories: parentSelectedCategories = [],
  setSelectedCategories: parentSetSelectedCategories,
}:EventTypeProps) {
  const { getFilterValue, setFilter } = useFilterState();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoriesLocal, setSelectedCategoriesLocal] = React.useState<string[]>(
    []
  );

  const selectedCategories =
    source === "tracker" ? parentSelectedCategories : selectedCategoriesLocal;
  const setSelectedCategories =
    source === "tracker" ? parentSetSelectedCategories : setSelectedCategoriesLocal;
    const selectedCategoriesCount = selectedCategories.length;
  // const [selectedCategories, setSelectedCategories] = useState<
  //   Record<EventGroupType, string[]>
  // >({
  //   business: [],
  // });

  // useEffect(() => {
  //   const eventTypes = getFilterValue("eventTypes").split(",").filter(Boolean);
  //   const initialSelectedCategories = Object.fromEntries(
  //     Object.entries(groupedEventTypes).map(([key, values]) => [
  //       key,
  //       values.filter((type) => eventTypes.includes(type)),
  //     ])
  //   ) as Record<EventGroupType, string[]>;
  //   setSelectedCategories(initialSelectedCategories);
  // }, [getFilterValue]);

  // const selectedCategoriesCount = useMemo(
  //   () => getFilterValue("eventTypes").split(",").filter(Boolean).length,
  //   [getFilterValue]
  // );

  const handleCategoryToggle = useCallback(
    (eventGroupType: EventGroupType, categoryId: string) => {
      // setSelectedCategories((prev) => ({
      //   ...prev,
      //   [eventGroupType]: prev[eventGroupType]?.includes(categoryId)
      //     ? prev[eventGroupType].filter((slug) => slug !== categoryId)
      //     : [...prev[eventGroupType], categoryId],
      // }));
      // console.log(categoryId);
      setSelectedCategories?.((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]);
    },
    []
  );

  // const handleSelectAll = useCallback(
  //   (eventGroupType: EventGroupType, isSelected: boolean) => {
  //     setSelectedCategories?.((prev) => ({
  //       ...prev,
  //       [eventGroupType]: isSelected ? groupedEventTypes[eventGroupType] : [],
  //     }));
  //   },
  //   []
  // );

  // const isAllSelected = useCallback(
  //   (eventGroupType: EventGroupType) => {
  //     const allCategories = groupedEventTypes[eventGroupType];
  //     return (
  //       allCategories.length > 0 &&
  //       allCategories.every((cat) =>
  //         selectedCategories[eventGroupType].includes(cat)
  //       )
  //     );
  //   },
  //   [selectedCategories]
  // );

  const handleApply = useCallback(() => {
    if(source!=="tracker"){
    const allSelected = Object.values(selectedCategories).flat();
    setFilter("eventTypes", allSelected.join(","));
    }
    setIsOpen(false);
  }, [selectedCategories, setFilter]);

  const renderCategoryGroup = useCallback(
    (type: EventGroupType) => (
      <>
        {groupedEventTypes[type].map((category) => (
          <div key={category} className="flex w-[210px] items-center space-x-2">
            <Checkbox
              className="rounded-[2.5px]"
              id={category}
              checked={selectedCategories?.includes(category)}
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
      </>
    ),
    [handleCategoryToggle, selectedCategories]
  );
  
  const onOpenChange = (open: boolean) => {
    handleApply();
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
            <span className="mr-2">Event Types</span>
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
        {/* <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Category</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div> */}
        <div className="p-2 space-y-2 ">
          {/* {renderCategoryGroup("business")} */}
          {renderCategoryGroup("business")}
        </div>
      </PopoverContent>
    </Popover>
  );
}