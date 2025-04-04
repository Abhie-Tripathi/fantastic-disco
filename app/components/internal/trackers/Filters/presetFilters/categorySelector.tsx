import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategorySelectorProps {
  source?: string;
  selectedCategory?: string[];
  setSelectedCategory?: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategorySelector = React.memo(function CategorySelector({
  source,
  selectedCategory = [],
  setSelectedCategory,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { morphedData } = useFilterContext();
  
  // Safely get categories with fallback
  const categories: Category[] = React.useMemo(() => {
    return morphedData?.categories?.options || [];
  }, [morphedData]);

  const handleStatusToggle = React.useCallback((categorySlug: string) => {
    console.log(categorySlug);
    
    if (setSelectedCategory) {
      setSelectedCategory((prev=[]) =>
        prev?.includes(categorySlug)
          ? prev.filter(slug => slug !== categorySlug)
          : [...prev, categorySlug]
      );
    }
  }, [setSelectedCategory]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          aria-expanded={isOpen}
        >
          <div className="flex items-center">
            <span className="mr-2">Category</span>
            {selectedCategory?.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedCategory.length}
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
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 space-y-2 h-[200px] overflow-scroll">
          {categories.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                className="rounded-none"
                checked={selectedCategory?.includes(item.slug) || false}
                onCheckedChange={() => handleStatusToggle(item.slug)}
              />
              <label
                htmlFor={item.slug}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

CategorySelector.displayName = "CategorySelector";

export default CategorySelector;