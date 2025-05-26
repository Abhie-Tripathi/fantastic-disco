import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { columnsDropdown, treemapColumnsDropdown } from "@/data/trends";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { isEventeli } from "@/config";

export default function ColumnsSelector() {
  const { setLocalFilter, getLocalFilterValue, setMultipleLocalFilters } =
    useFilterContext();
  const { getFilterValue } = useFilterState();
  const activeView = getFilterValue("view");
  const metrics = (getLocalFilterValue("columns") as string)?.split(",") || [];
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!metrics.length) {
      setLocalFilter("columns", "eventCount");
    }
  }, [metrics, setLocalFilter]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const columns =
    activeView === "treemap" || (!isEventeli && activeView == "")
      ? treemapColumnsDropdown
      : columnsDropdown;

  const handleMetricChange = (value: string, checked: boolean) => {
    let newMetrics: string[];

    if (checked) {
      newMetrics = [...metrics, value];
    } else {
      // Remove the metric if unchecked
      newMetrics = metrics.filter((m) => m !== value);
    }

    // If no metrics selected, default to eventCount
    if (newMetrics.length === 0) {
      newMetrics = ["eventCount"];
    }

    if (
      (activeView === "treemap" || activeView === "") &&
      !newMetrics.includes("eventCount")
    ) {
      setMultipleLocalFilters({ columns: newMetrics.join(","), view: "line" });
    } else {
      setLocalFilter("columns", newMetrics.join(","));
    }
  };

  const removeMetric = (metricToRemove: string) => {
    const newMetrics = metrics.filter((m) => m !== metricToRemove);
    if (newMetrics.length === 0) {
      setLocalFilter("columns", "eventCount");
    } else {
      setLocalFilter("columns", newMetrics.join(","));
    }
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
        >
          <div className="flex items-center truncate">
            <span className="mr-2">Metric</span>
            {metrics.length > 0 && (
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                {metrics.length}
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
        <div className="space-y-3 p-2">
          {columns.map(({ label, value, enable }) => (
            <div
              key={value}
              className={cn(
                "flex items-center space-x-2",
                !enable && "opacity-50 cursor-not-allowed"
              )}
            >
              <Checkbox
                id={value}
                checked={metrics.includes(value)}
                onCheckedChange={(checked) =>
                  enable && handleMetricChange(value, checked as boolean)
                }
                disabled={!enable}
              />
              <label
                htmlFor={value}
                className={cn(
                  "text-sm font-medium leading-none",
                  !enable && "cursor-not-allowed"
                )}
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
      </PopoverContent>
    </Popover>
  );
}
