import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, CircleSlash } from "lucide-react";
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
import { columnsDropdown, treemapColumnsDropdown } from "@/data/trends";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { TEventColumnType, Thresholds } from "@/types";
import { cn } from "@/lib/utils";

type EventGroupType = "social" | "business";

export default function ColumnsSelector({
  activeView,
  setActiveView,
  selectedEventType,
  handleSelectChange,
}: {
  activeView: "line" | "treemap" | "table";
  setActiveView: (view: "line" | "treemap" | "table") => void;
  selectedEventType: keyof Thresholds;
  handleSelectChange: (value: TEventColumnType) => void;
}) {
  const searchParams = useSearchParams();
  const columnsParams = searchParams.get("columns");
  const columnsData = (columnsParams && columnsParams.split(",")) || [];
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const { setLocalFilter } = useFilterContext();

  const applyHandler = () => {
    setLocalFilter("columns", selectedItems.join(","));
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      applyHandler();
    }
    setIsOpen(open);
  };

  const columns =
    activeView === "treemap" ? treemapColumnsDropdown : columnsDropdown;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between py-5 w-full ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center truncate">
            <span className="mr-2">Metric</span>
            <span className="truncate text-xs text-primary">
              {selectedEventType &&
                columnsDropdown.find(
                  (column) => column.value === selectedEventType
                )?.label}
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
            if (activeView === "treemap" && value !== "eventCount") {
              setActiveView("line");
            } else {
              handleSelectChange(value as TEventColumnType);
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
                  checked={selectedEventType === value}
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
