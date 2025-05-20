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
    activeView === "treemap" ? treemapColumnsDropdown : columnsDropdown;

  const handleMetricChange = (value: string, checked: boolean) => {
    let newMetrics: string[];
    
    if (checked) {
      // If already have 2 metrics, replace the second one
      if (metrics.length >= 2) {
        newMetrics = [metrics[0], value];
      } else {
        newMetrics = [...metrics, value];
      }
    } else {
      // Remove the metric if unchecked
      newMetrics = metrics.filter(m => m !== value);
    }

    // If no metrics selected, default to eventCount
    if (newMetrics.length === 0) {
      newMetrics = ["eventCount"];
    }

    if ((activeView === "treemap" || activeView === "") && !newMetrics.includes("eventCount")) {
      setMultipleLocalFilters({ columns: newMetrics.join(","), view: "line" });
    } else {
      setLocalFilter("columns", newMetrics.join(","));
    }
  };

  const removeMetric = (metricToRemove: string) => {
    const newMetrics = metrics.filter(m => m !== metricToRemove);
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
            <span className="mr-2">{metrics.length > 1 ? "Metrics" : "Metric"}</span>
            <div className="flex gap-2">
              {metrics.map((metric) => (
                <span
                  key={metric}
                  className="text-xs truncate text-primary font-medium flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded"
                >
                  {columnsDropdown.find((column) => column.value === metric)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-primary/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMetric(metric);
                    }}
                  />
                </span>
              ))}
            </div>
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
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={value}
                checked={metrics.includes(value)}
                onCheckedChange={(checked) => handleMetricChange(value, checked as boolean)}
                disabled={!metrics.includes(value) && metrics.length >= 2}
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
      </PopoverContent>
    </Popover>
  );
}
