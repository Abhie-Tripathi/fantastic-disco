"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { baseUrl } from "@/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
// import { categories } from "@/public/data/categories";
// import { newCategories as categories } from "@/data/categories";
interface categoryProps {
    source: string;
    selectedCategories?: string[];
    setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>; 
  }
  export default function CategorySelector({
    source,
    selectedCategories: parentSelectedCategories = [],
    setSelectedCategories: parentSetSelectedCategories,
  }: categoryProps) {
//   const { getFilterValue, setFilter } = useFilterState();
const [categories, setCategories] = useState<any[]>([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoriesLocal, setSelectedCategoriesLocal] = useState<string[]>([]);
  const selectedCategories = source === 'tracker' ? parentSelectedCategories : selectedCategoriesLocal;
  const setSelectedCategories = source === 'tracker' ? parentSetSelectedCategories : setSelectedCategoriesLocal;
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/category/all?take=30&skip=0`);
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        console.log(data);
        setCategories(data);
      }
    };
    fetchData();
  }, []);
  console.log(categories);
  
//   useEffect(() => {
//     const eventTypes = getFilterValue("categories").split(",").filter(Boolean);
//     setSelectedCategories(eventTypes);
//   }, [getFilterValue]);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    if (setSelectedCategories) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
}
  }, []);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (setSelectedCategories) {
    setSelectedCategories(isSelected ? categories.map((cat) => cat.slug) : []);
    }
  }, []);

  const isAllSelected = useMemo(
    () => categories.every((cat) => selectedCategories.includes(cat.slug)),
    [selectedCategories]
  );

  // const handleApply = useCallback(() => {
  //   setFilter("categories", selectedCategories.join(","));
  //   setIsOpen(false);
  // }, [selectedCategories, setFilter]);

  const renderCategories = useCallback(() => {
    const columnCount = 3;
    const allCategories = [
      { id: "all", name: "Select All", slug: "all" },
      ...categories
    ];
    console.log(allCategories);
    
    const itemsPerColumn = Math.ceil(allCategories.length / columnCount);
console.log(isAllSelected);

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
                    checked={
                      category.slug === "all"
                        ? isAllSelected
                        : selectedCategories.includes(category.id)
                     }
                    onCheckedChange={() =>
                      category.slug === "all"
                        ? handleSelectAll(!isAllSelected)
                        : handleCategoryToggle(category.id)
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
    categories,
    isAllSelected,
    handleSelectAll,
  ]);

  const onOpenChange = (open: boolean) => {
    if(!open){
    //   handleApply();
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