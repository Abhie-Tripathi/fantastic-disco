"use client";
import React, { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Filters, useFilterContext } from "@/context/filterContext";
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
import { convertISOToOriginalFormat } from "@/utils/date";
import { LockClosedSmall } from "geist-icons";

interface FlexibleComponentProps {
  source?: string;
  variant?: "accordion" | "popover";
  filterName?: string;
  disabled?: boolean;
  maxCategories?: number;
}

export default function CategorySelector({
  variant = "accordion",
  filterName,
  disabled,
  maxCategories,
  source,
}: FlexibleComponentProps) {
  const { setLocalFilter, getLocalFilterValue, morphedData } =
    useFilterContext();
  const categories = morphedData?.categories?.options || [];
  const isEnabled = morphedData.categories.isEnabled;
  const selectedCategories =
    source === "preset"
      ? getLocalFilterValue("presetCategory").split(",").filter(Boolean)
      : getLocalFilterValue((filterName as keyof Filters) || "categories")
          ?.split(",")
          ?.filter(Boolean) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAnyDisabled = useMemo(() => {
    return categories?.some((cat: any) => !cat.isEnabled) || false;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery || !categories) return categories || [];
    return categories.filter((cat: any) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleCategoryToggle = useCallback(
    (categorySlug: string) => {
      if (!categorySlug) return;

      const newCategories = selectedCategories.includes(categorySlug)
        ? selectedCategories.filter((slug) => slug !== categorySlug)
        : [...selectedCategories, categorySlug];

      if (
        maxCategories &&
        !selectedCategories.includes(categorySlug) &&
        newCategories.length > maxCategories
      ) {
        return;
      }

      const filterValue =
        newCategories.length > 0 ? newCategories.join(",") : "";
      if (source === "preset") {
        setLocalFilter("presetCategory", newCategories.join(","));
      } else
        setLocalFilter(
          (filterName as keyof Filters) || "categories",
          filterValue
        );
    },
    [selectedCategories, setLocalFilter, filterName, maxCategories]
  );

  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      const enabledCategories = categories.filter((cat: any) => cat.isEnabled);
      if (
        maxCategories &&
        isSelected &&
        enabledCategories.length > maxCategories
      ) {
        return;
      }

      setLocalFilter(
        (filterName as keyof Filters) || "categories",
        isSelected
          ? enabledCategories
              .slice(0, maxCategories || enabledCategories.length)
              .map((cat: any) => cat.slug)
              .join(",")
          : ""
      );
    },
    [setLocalFilter, categories, filterName, maxCategories]
  );

  const isAllSelected = useMemo(
    () =>
      categories.every(
        (cat: any) => cat.isEnabled && selectedCategories.includes(cat.slug)
      ),
    [selectedCategories, categories]
  );

  const renderCategories = useCallback(() => {
    if (!categories) return null;

    const columnCount = 3;
    const allCategories = [
      source !== "preset" && {
        id: "all",
        name: "Select All",
        slug: "all",
        isEnabled: true,
      },
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
                      disabled ||
                      (maxCategories &&
                        !selectedCategories.includes(category.slug) &&
                        selectedCategories.length >= maxCategories)
                    }
                  />
                  <label
                    htmlFor={`${category.slug}-${variant}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap ${
                      (category.slug === "all" && isAnyDisabled) ||
                      (!category.isEnabled && category.slug !== "all") ||
                      (maxCategories &&
                        !selectedCategories.includes(category.slug) &&
                        selectedCategories.length >= maxCategories)
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
        {maxCategories && selectedCategories.length >= maxCategories && (
          <div className="col-span-3 text-sm text-muted-foreground mt-4">
            Maximum of {maxCategories} categories can be selected
          </div>
        )}
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
    maxCategories,
  ]);

  const triggerContent = (
    <div className="flex items-center">
      {!isEnabled && <LockClosedSmall color="var(--secondary-text-color)" />}
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
            disabled={!isEnabled}
          >
            <span className="flex items-center gap-2">{triggerContent}</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
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
          disabled={!isEnabled}
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
            className="border-none focus:ring-0"
          />
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto p-2">
            {source !== "preset" && (
              <CommandItem
                key="select-all"
                onSelect={() => handleSelectAll(!isAllSelected)}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={Boolean(isAllSelected)}
                  disabled={Boolean(isAnyDisabled || disabled)}
                  className="rounded-none"
                />
                <span>Select All</span>
              </CommandItem>
            )}
            {filteredCategories.map((category: any) => (
              <CommandItem
                key={category.slug}
                onSelect={() => handleCategoryToggle(category.slug)}
                className={cn(
                  "flex items-center gap-2",
                  !category.isEnabled && "opacity-50"
                )}
              >
                <Checkbox
                  checked={Boolean(selectedCategories.includes(category.slug))}
                  disabled={Boolean(
                    !category.isEnabled ||
                      disabled ||
                      (maxCategories &&
                        !selectedCategories.includes(category.slug) &&
                        selectedCategories.length >= maxCategories)
                  )}
                  className="rounded-none"
                />
                <span>{category.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          {maxCategories && selectedCategories.length >= maxCategories && (
            <div className="text-sm text-muted-foreground p-2 border-t">
              Maximum of {maxCategories} categories can be selected
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
