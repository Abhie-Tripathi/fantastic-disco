"use client";
import React, { useCallback, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";

export default function CategorySelector() {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
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
        isSelected
          ? categories
              .filter((cat: any) => cat.isEnabled)
              .map((cat: any) => cat.slug)
              .join(",")
          : ""
      );
    },
    [setLocalFilter, categories]
  );

  const isAllSelected = useMemo(
    () =>
      categories.every(
        (cat: any) => cat.isEnabled && selectedCategories.includes(cat.slug)
      ),
    [selectedCategories, categories]
  );

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
                <div
                  key={category.id}
                  className={`flex items-center space-x-2 ${
                    !category.isEnabled ? "opacity-50" : ""
                  }`}
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
                    disabled={
                      (category.slug === "all" && isAnyDisabled) ||
                      (!category.isEnabled && category.slug !== "all")
                    }
                  />
                  <label
                    htmlFor={category.slug}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap ${
                      (category.slug === "all" && isAnyDisabled) ||
                      (!category.isEnabled && category.slug !== "all")
                        ? "opacity-50"
                        : ""
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
    isAnyDisabled,
  ]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="eventType" className="border no-underline">
        <AccordionTrigger className="p-2 no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="mr-2">Category</span>
              {selectedCategories.length > 0 && (
                <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                  {selectedCategories.length}
                </span>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4">{renderCategories()}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
