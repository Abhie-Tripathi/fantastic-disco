"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isBefore,
  addMonths,
  parseISO,
  formatISO,
} from "date-fns";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useFilterState } from "@/hooks/useFilterState";
import { usePathname } from "next/navigation";

const presets = [
  { label: "Custom", value: "custom" },
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "3 months", value: "3-months" },
  { label: "6 months", value: "6-months" },
  { label: "9 Months", value: "9-months" },
  { label: "12 months", value: "12-months" },
];

const comparisonOptions = [
  "Preceding Period (match day of the week)",
  "Same period last year (match day of the week)",
  "Preceding Period",
  "Same Period Last year",
];

interface DateRangeProps {
  source: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange?: React.Dispatch<React.SetStateAction<{
    from: Date | undefined;
    to: Date | undefined;
  }>>;
}

export default function DateRangeSelector({
  source,
  dateRange: parentDateRange,
  setDateRange: setParentDateRange
}: DateRangeProps) {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [localDateRange, setLocalDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const dateRange = source === "tracker" && parentDateRange ? parentDateRange : localDateRange;
  const setDateRange = source === "tracker" && setParentDateRange ? setParentDateRange : setLocalDateRange;
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());
  const [selectedPreset, setSelectedPreset] = React.useState("this-month");
  const [compareEnabled, setCompareEnabled] = React.useState(false);
  const { getFilterValue, setMultipleFilters, searchParams } = useFilterState();
  const [selectedComparison, setSelectedComparison] = React.useState(
    comparisonOptions[0]
  );
  const enableCompareOptions = pathName === "/trends";

  React.useEffect(() => {
    const active_gte = getFilterValue("active_gte");
    const active_lte = getFilterValue("active_lte");
    if (active_gte && active_lte) {
      setDateRange({ from: parseISO(active_gte), to: parseISO(active_lte) });
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  }, [searchParams]);

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const currentDate = new Date();
    let from: Date, to: Date;
    switch (preset) {
      case "this-week":
        from = startOfWeek(currentDate);
        to = endOfWeek(currentDate);
        break;
      case "this-month":
        from = startOfMonth(currentDate);
        to = endOfMonth(currentDate);
        break;
      case "3-months":
        from = startOfMonth(currentDate);
        to = endOfMonth(addMonths(currentDate, 2));
        break;
      case "6-months":
        from = startOfMonth(currentDate);
        to = endOfMonth(addMonths(currentDate, 5));
        break;
      case "9-months":
        from = startOfMonth(currentDate);
        to = endOfMonth(addMonths(currentDate, 8));
        break;
      case "12-months":
        from = startOfMonth(currentDate);
        to = endOfMonth(addMonths(currentDate, 11));
        break;
      default:
        return;
    }
    setDateRange({ from, to });
    setCalendarDate(from);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelectedPreset("custom");
      if (!dateRange.from || (dateRange.from && dateRange.to)) {
        setDateRange({ from: selectedDate, to: undefined });
      } else if (
        dateRange.from &&
        !dateRange.to &&
        isBefore(selectedDate, dateRange.from)
      ) {
        setDateRange({ from: selectedDate, to: dateRange.from });
      } else {
        setDateRange((prev) => ({ ...prev, to: selectedDate }));
      }
    }
  };

  const applyHandler = () => {
    if(source!=="tracker")
    setMultipleFilters({
      active_gte:
        new Date(dateRange.from!.setHours(5, 30, 0, 0)).toISOString() || "",
      active_lte:
        new Date(dateRange.to!.setHours(5, 30, 0, 0)).toISOString() || "",
    });
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      applyHandler();
    }
    setIsOpen(open);
  };
console.log(dateRange);

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
            <span className="mr-2">Dates</span>
            {dateRange.from && dateRange.to && (
              <span className="text-xs text-primary truncate">
                {dateRange.from.getFullYear() == dateRange.to.getFullYear() ? (
                  <span>
                    {format(dateRange.from, "MMM d")} -
                    {format(dateRange.to, "MMM d")}
                  </span>
                ) : (
                  <span>
                    {format(dateRange.from, "MMM d yyyy")} -
                    {format(dateRange.to, "MMM d yyyy")}
                  </span>
                )}
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
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col space-y-4 p-4">
          {/* <div className="flex justify-between items-center">
            <h2 className="font-semibold">Date Range</h2>
            <Button
              variant="link"
              className="text-primary pr-0"
              onClick={applyHandler}
            >
              APPLY
            </Button>
          </div> */}
          <div className="flex space-x-4 border rounded-md p-4">
            <div className="space-y-2 flex flex-col justify-between min-w-36">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  variant="outline"
                  className={cn(
                    "w-full font-normal",
                    selectedPreset === preset.value && "bg-[#F2F2F2]"
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="border-l" />
            <div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from) handleDateSelect(range.from);
                  if (range?.to) handleDateSelect(range.to);
                }}
                month={calendarDate}
                onMonthChange={setCalendarDate}
                numberOfMonths={1}
              />
            </div>
          </div>
          {enableCompareOptions && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">Compare with Past data</h3>
                <Switch
                  checked={compareEnabled}
                  onCheckedChange={setCompareEnabled}
                />
              </div>
              {compareEnabled && (
                <div className="space-y-2 flex flex-col">
                  {comparisonOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => setSelectedComparison(option)}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        selectedComparison === option && "bg-[#F2F2F2]"
                      )}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}