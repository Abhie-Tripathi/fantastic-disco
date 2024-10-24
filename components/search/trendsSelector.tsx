import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterContext } from "@/context/filterContext";
import { useSearchParams } from "next/navigation";
import { CheckedState } from "@radix-ui/react-checkbox";
import { columnsDropdown } from "@/data/trends";

export default function TrendsSelector() {
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const { getLocalFilterValue, setLocalFilter } = useFilterContext();

  const applyHandler = () => {
    setLocalFilter("columns", selectedItems.join(","));
    setIsOpen(false);
  };

  const handleApply = useCallback(() => {
    setSelectedItems(selectedItems);
    applyHandler();
  }, [selectedItems]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      applyHandler();
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (getLocalFilterValue("columns")) {
      setSelectedItems(getLocalFilterValue("columns").split(","));
    }
  }, [searchParams]);

  const handleCheckedChange = (checked: CheckedState, value: string) => {
    setSelectedItems((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between w-full ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <span className="mr-2">Columns</span>
            {selectedItems.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {selectedItems.length}
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
      <PopoverContent className="w-auto" align="start">
        {/* <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Columns</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div> */}
        <div className="space-y-4 p-2">
          {columnsDropdown &&
            columnsDropdown.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  disabled={
                    option.value === "economicImpact" ||
                    option.value === "impactScore"
                  }
                  className="rounded-[2.5px]"
                  checked={selectedItems.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(checked, option.value)
                  }
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
                {(option.value === "economicImpact" ||
                  option.value === "impactScore") && (
                  <p className="font-bold text-[#0062d1] text-[10px] bg-[#ebf5ff] p-1 rounded">
                    Coming Soon
                  </p>
                )}
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
