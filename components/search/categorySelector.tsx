"use client";
import React, { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface FlexibleComponentProps {
  variant?: "accordion" | "popover";
  filterName?: string;
  disabled?: boolean;
}

export default function CategorySelector({
  variant = "accordion",
  filterName,
  disabled,
}: FlexibleComponentProps) {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const categories = morphedData.categories.options;
  const selectedCategories = getLocalFilterValue(filterName || "categories")
    .split(",")
    .filter(Boolean);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAnyDisabled = useMemo(() => {
    return categories.some((cat: any) => !cat.isEnabled);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((cat: any) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleCategoryToggle = useCallback(
    (categorySlug: string) => {
      const newCategories = selectedCategories.includes(categorySlug)
        ? selectedCategories.filter((slug) => slug !== categorySlug)
        : [...selectedCategories, categorySlug];
      setLocalFilter(filterName || "categories", newCategories.join(","));
    },
    [selectedCategories, setLocalFilter, filterName]
  );

  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      setLocalFilter(
        filterName || "categories",
        isSelected
          ? categories
              .filter((cat: any) => cat.isEnabled)
              .map((cat: any) => cat.slug)
              .join(",")
          : ""
      );
    },
    [setLocalFilter, categories, filterName]
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
                    id={`${category.slug}-${variant}`}
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
                      (!category.isEnabled && category.slug !== "all") ||
                      disabled
                    }
                  />
                  <label
                    htmlFor={`${category.slug}-${variant}`}
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
    variant,
    disabled,
  ]);

  const triggerContent = (
    <div className="flex items-center">
      <span className="mr-2">Category</span>
      {selectedCategories.length > 0 && (
        <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
          {selectedCategories.length}
        </span>
      )}
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
            disabled={disabled}
          >
            <span className="flex items-center gap-2">{triggerContent}</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <div className="p-4">{renderCategories()}</div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between px-3 py-5 text-base font-normal"
          disabled={disabled}
        >
          <span className="flex items-center gap-2">{triggerContent}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search categories..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            <CommandItem
              onSelect={() => handleSelectAll(!isAllSelected)}
              className="flex items-center gap-2 px-2 py-1.5"
            >
              <Checkbox checked={isAllSelected} className="rounded-none" />
              <span>Select All</span>
            </CommandItem>
            {filteredCategories.map((category: any) => (
              <CommandItem
                key={category.slug}
                onSelect={() => handleCategoryToggle(category.slug)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5",
                  !category.isEnabled && "opacity-50"
                )}
                disabled={!category.isEnabled || disabled}
              >
                <Checkbox
                  checked={selectedCategories.includes(category.slug)}
                  className="rounded-none"
                  disabled={!category.isEnabled || disabled}
                />
                <span>{category.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
