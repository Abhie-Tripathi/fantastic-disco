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
import { ChevronDown } from "lucide-react";
import { newCategories as categories } from "@/data/categories";
import { useFilterContext } from "@/context/filterContext";
import {toast} from 'react-toastify';
interface categoryInterface{
  selectedValue?: string[] | undefined;
  enabledValue?: any;
}
interface categoryProps {
  source: string;
  selectedCategories?: string[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>; 
  enabledCategories?:categoryInterface;
}
export default function CategorySelector({
  source,
  enabledCategories,
  selectedCategories: parentSelectedCategories = [],
  setSelectedCategories: parentSetSelectedCategories,
}: categoryProps) {
  const { getLocalFilterValue, setLocalFilter } = useFilterContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoriesLocal, setSelectedCategoriesLocal] = useState<string[]>([]);
const selectedCategories = source === 'tracker' ? parentSelectedCategories : selectedCategoriesLocal;
const setSelectedCategories = source === 'tracker' ? parentSetSelectedCategories : setSelectedCategoriesLocal;
  useEffect(() => {
    if(source !== 'tracker') {
      const eventTypes = getLocalFilterValue("categories")
        .split(",")
        .filter(Boolean);
        
      setSelectedCategories?.(eventTypes);
    }
  }, [getLocalFilterValue]);

  const handleCategoryToggle = useCallback((categorySlug: string) => {

    setSelectedCategories?.((prev) => {
      if(enabledCategories?.enabledValue && prev.length === 1 && prev.includes(categorySlug)) {
        toast.error("At least one filter must be selected", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
        return prev;
      }
      return prev.includes(categorySlug)
        ? prev.filter((slug) => slug !== categorySlug) 
        : [...prev, categorySlug];
    });
    
    
  }, [enabledCategories]);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    setSelectedCategories?.(isSelected ? categories.map((cat) => cat.slug) : []);
  }, []);

  const isAllSelected = useMemo(
    () => categories.every((cat) => selectedCategories.includes(cat.slug)),
    [selectedCategories]
  );

  const handleApply = useCallback(() => {
    setLocalFilter("categories", selectedCategories.join(","));
    setIsOpen(false);
  }, [selectedCategories, setLocalFilter]);

  const renderCategories = useCallback(() => {
    const columnCount = 3;
    const allCategories = [
      { id: "all", name: "Select All", slug: "all" },
      ...categories,
    ];
    const itemsPerColumn = Math.ceil(allCategories.length / columnCount);

    return (
      <div className="grid grid-cols-3 gap-x-4">
        {Array.from({ length: columnCount }).map((_, columnIndex) => (
          <div key={columnIndex} className="space-y-2">
            {allCategories
              .slice(
                columnIndex * itemsPerColumn,
                (columnIndex + 1) * itemsPerColumn
              )
              .map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    className="rounded-none"
                    id={category.slug}
                    disabled={enabledCategories && !enabledCategories?.enabledValue?.some((item:any) => item.id === category.id)}
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
                  />
                  <label
                    htmlFor={category.slug}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
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
  ]);

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