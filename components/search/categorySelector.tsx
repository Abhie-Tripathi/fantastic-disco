"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import enabledFilters from "@/public/data/enabledFilters"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from 'lucide-react';
import { newCategories as categories } from "@/data/categories";
import { useFilterContext } from "@/context/filterContext";

export default function CategorySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue, morphedData } = useFilterContext();
  const categories = morphedData.categories.options;
  const selectedCategories = getLocalFilterValue("categories")
    .split(",")
    .filter(Boolean);

  const isAnyDisabled = useMemo(() => {
    return categories.some((cat: any) => !cat.isEnabled);
  }, [categories]);

  const handleCategoryToggle = useCallback(
    (categorySlug: string) => {
      const newCategories = selectedCategories.includes(categorySlug)
        ? selectedCategories.filter((slug) => slug !== categorySlug)
        : [...selectedCategories, categorySlug];
      setLocalFilter("categories", newCategories.join(","));
    },
    [selectedCategories, setLocalFilter]
  );

  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      setLocalFilter(
        "categories",
        isSelected ? categories.filter((cat: any) => cat.isEnabled).map((cat: any) => cat.slug).join(",") : ""
      );
    },
    [setLocalFilter, categories]
  );

  const isAllSelected = useMemo(
    () => categories.every((cat: any) => cat.isEnabled && selectedCategories.includes(cat.slug)),
    [selectedCategories, categories]
  );

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const renderCategories = useCallback(() => {
    const columnCount = 3;
    const allCategories = [
      { id: "all", name: "Select All", slug: "all", isEnabled: true },
      ...categories,
    ];
    const itemsPerColumn = Math.ceil(allCategories.length / columnCount);

    return (
      <div className="grid grid-cols-3 gap-x-4">
        {Array.from({ length: columnCount }).map((_, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {allCategories
              .slice(
                columnIndex * itemsPerColumn,
                (columnIndex + 1) * itemsPerColumn
              )
              .map((category) => (
                <div key={category.id} 
                className={`flex items-center space-x-2 ${!category.isEnabled ? 'opacity-50' : ''}`}
                >
                  <Checkbox
                    className="rounded-none"
                    id={category.slug}
                    checked={
                      category.slug === "all"
                        ? isAllSelected
                        : selectedCategories.includes(category.slug)
                    }
                    onCheckedChange={() =>
                      category.slug === "all"
                        ? handleSelectAll(!isAllSelected)
                        : handleCategoryToggle(category.slug)
                    }
                    disabled={(category.slug === "all" && isAnyDisabled) || (!category.isEnabled && category.slug !== "all")}
                  />
                  <label
                    htmlFor={category.slug}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap ${
                      (category.slug === "all" && isAnyDisabled) || (!category.isEnabled && category.slug !== "all") ? 'opacity-50' : ''
                    }`}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }, [
    handleCategoryToggle,
    selectedCategories,
    isAllSelected,
    handleSelectAll,
    categories,
    isAnyDisabled
  ]);

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
            <span className="mr-2">Category</span>
            {selectedCategories.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedCategories.length}
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
        className="w-full max-w-2xl border rounded-md shadow-sm p-0"
        align="start"
      >
        <div className="p-4">{renderCategories()}</div>
      </PopoverContent>
    </Popover>
  );
}
