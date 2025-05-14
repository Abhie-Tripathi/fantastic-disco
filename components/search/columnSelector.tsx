import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { columnsDropdown, treemapColumnsDropdown } from "@/data/trends";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import { useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";

export default function ColumnsSelector() {
  const { setLocalFilter, getLocalFilterValue, setMultipleLocalFilters } =
    useFilterContext();
  const { getFilterValue } = useFilterState();
  const activeView = getFilterValue("view");
  const metric = getLocalFilterValue("columns");
  const [isOpen, setIsOpen] = React.useState(false);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const columns =
    activeView === "treemap" ? treemapColumnsDropdown : columnsDropdown;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center truncate">
            <span className="mr-2">Metric</span>
            <span className="text-xs truncate text-primary font-medium">
              {metric &&
                columnsDropdown.find((column) => column.value === metric)
                  ?.label}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <RadioGroup
          className="flex items-center"
          onValueChange={(value) => {
            if (
              (activeView === "treemap" || activeView == "") &&
              value !== "eventCount"
            ) {
              setMultipleLocalFilters({ columns: value, view: "line" });
            } else {
              setLocalFilter("columns", value);
            }
            setIsOpen(false);
          }}
        >
          <div className="space-y-3 p-2">
            {columns.map(({ label, value, enable }) => (
              <div
                key={value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <RadioGroupItem
                  checked={metric === value}
                  value={value}
                  id={value}
                />
                <label
                  htmlFor={value}
                  className={cn("text-sm font-medium leading-none")}
                >
                  {label}
                </label>
                {!enable && (
                  <p className="font-bold text-[#0062d1] text-[10px] bg-[#ebf5ff] p-1 rounded">
                    Line Chart
                  </p>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
