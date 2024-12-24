"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  parseISO,
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
import { useFilterContext } from "@/context/filterContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const presets = [
  { label: "Past", value: "past" },
  { label: "Upcoming", value: "upcoming" },
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "3 months", value: "3-months" },
  { label: "6 months", value: "6-months" },
  { label: "9 Months", value: "9-months" },
  { label: "12 months", value: "12-months" },
  { label: "Custom", value: "custom" },
];

const comparisonOptions = [
  "Preceding Period (match day of the week)",
  "Same period last year (match day of the week)",
  "Preceding Period",
  "Same Period Last year",
];

const formatDateRange = (from: Date | undefined, to: Date | undefined) => {
  if (!from && !to) return "";
  if (from && !to) return "Upcoming";
  if (!from && to) return "Past";
  if (from && to) {
    if (from.getTime() === to.getTime()) {
      return format(from, "d MMM, yyyy");
    }
    if (from.getFullYear() === to.getFullYear()) {
      if (from.getMonth() === to.getMonth()) {
        return `${format(from, "d")} - ${format(to, "d MMM, yyyy")}`;
      }
      return `${format(from, "d MMM")} - ${format(to, "d MMM, yyyy")}`;
    }
    return `${format(from, "d MMM, yyyy")} - ${format(to, "d MMM, yyyy")}`;
  }
  return "";
};

interface DateRangeProps {
  source: string;
  enabledDateRange?:any;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange?: React.Dispatch<
    React.SetStateAction<{
      from: Date | undefined;
      to: Date | undefined;
    }>
  >;
}

export default function DateRangeSelector({
  source,
  enabledDateRange,
  dateRange: parentDateRange,
  setDateRange: setParentDateRange,
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
  const dateRange =
    source === "tracker" && parentDateRange ? parentDateRange : localDateRange;
  const setDateRange =
    source === "tracker" && setParentDateRange
      ? setParentDateRange
      : setLocalDateRange;
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());
  const [selectedPreset, setSelectedPreset] = React.useState("");
  const [compareEnabled, setCompareEnabled] = React.useState(false);
  const { setMultipleLocalFilters, searchParams, localFilters, applyFilters } =
    useFilterContext();
  const [selectedComparison, setSelectedComparison] = React.useState(
    comparisonOptions[0]
  );
  const enableCompareOptions = pathName === "/trends";

  React.useEffect(() => {
    if (source !== "tracker") {
      const active_gte = localFilters.active_gte;
      const active_lte = localFilters.active_lte;

      if (active_gte && !active_lte) {
        const fromDate = parseISO(active_gte);
        setDateRange({ from: fromDate, to: undefined });
        setSelectedPreset("upcoming");
        return;
      }

      if (!active_gte && active_lte) {
        const toDate = parseISO(active_lte);
        setDateRange({ from: undefined, to: toDate });
        setSelectedPreset("past");
        return;
      }

      if (active_gte && active_lte) {
        const fromDate = parseISO(active_gte);
        const toDate = parseISO(active_lte);
        setDateRange({ from: fromDate, to: toDate });

        const currentDate = new Date();
        const diffInDays = Math.round(
          (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (
          diffInDays === 6 &&
          fromDate.getDay() === 0 &&
          toDate.getDay() === 6
        ) {
          setSelectedPreset("this-week");
        } else if (
          fromDate.getDate() === 1 &&
          toDate.getDate() ===
            new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0).getDate()
        ) {
          const monthsDiff =
            (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
            toDate.getMonth() -
            fromDate.getMonth() +
            1;
          if (monthsDiff === 1) setSelectedPreset("this-month");
          else if (monthsDiff === 3) setSelectedPreset("3-months");
          else if (monthsDiff === 6) setSelectedPreset("6-months");
          else if (monthsDiff === 9) setSelectedPreset("9-months");
          else if (monthsDiff === 12) setSelectedPreset("12-months");
          else setSelectedPreset("custom");
        } else {
          setSelectedPreset("custom");
        }
      } else {
        setDateRange({ from: undefined, to: undefined });
        setSelectedPreset("custom");
      }
    }
  }, [searchParams, localFilters]);

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === "any") {
      setDateRange({ from: undefined, to: undefined });
      return;
    }
    const currentDate = new Date();
    let from: Date | undefined, to: Date | undefined;
    switch (preset) {
      case "upcoming":
        from = currentDate;
        to = undefined;
        break;
      case "past":
        from = undefined;
        to = currentDate;
        break;
      case "custom":
        from = undefined;
        to = undefined;
        break;
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
    setCalendarDate(currentDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setSelectedPreset("custom");
    if (!dateRange.from && !dateRange.to) {
      setDateRange({ from: selectedDate, to: selectedDate });
      return;
    }

    if (
      dateRange.from &&
      dateRange.to &&
      dateRange.from.getTime() === dateRange.to.getTime()
    ) {
      if (selectedDate < dateRange.from) {
        setDateRange({ from: selectedDate, to: dateRange.from });
      } else {
        setDateRange({ from: dateRange.from, to: selectedDate });
      }
      return;
    }
    if (dateRange.from && dateRange.to) {
      setDateRange({ from: selectedDate, to: selectedDate });
      return;
    }
    if (dateRange.from && !dateRange.to) {
      if (selectedDate < dateRange.from) {
        setDateRange({ from: selectedDate, to: dateRange.from });
      } else {
        setDateRange({ from: dateRange.from, to: selectedDate });
      }
      return;
    }
  };

  const applyHandler = () => {
    if (source !== "tracker") {
      const filters: { active_gte?: string; active_lte?: string } = {};

      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(5, 30, 0, 0);
        filters.active_gte = fromDate.toISOString();
      }

      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(5, 30, 0, 0);
        filters.active_lte = toDate.toISOString();
      }

      if (dateRange.from == undefined) {
        filters.active_gte = "";
      }
      if (dateRange.to == undefined) {
        filters.active_lte = "";
      }
      setMultipleLocalFilters(filters);

      if (source === "coordinate") {
        applyFilters();
      }
    }
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      applyHandler();
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
            <span className="mr-2">Dates</span>
            {(dateRange.from || dateRange.to) && (
              <span className="text-xs text-primary truncate">
                {formatDateRange(dateRange.from, dateRange.to)}
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
        <div className="flex flex-col">
          <div className="flex space-x-4 rounded-md p-4">
            <ScrollArea className="h-[300px] w-[150px]">
              <div className="space-y-2 flex flex-col justify-between pr-4">
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
            </ScrollArea>
            <div className="border-l" />
            <div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range, selectedDay) => {
                  handleDateSelect(selectedDay);
                }}
                month={calendarDate}
                onMonthChange={setCalendarDate}
                numberOfMonths={1}
              />
            </div>
          </div>
          {enableCompareOptions && (
            <div className="space-y-4 p-4 py-2 pt-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">Compare with Past data</h3>
                <Switch
                  disabled
                  checked={compareEnabled}
                  onCheckedChange={setCompareEnabled}
                />
                <span className="ml-2 bg-[#EBF5FF] text-[#0062D1] font-medium rounded text-[10px] whitespace-nowrap p-1">
                  Coming Soon
                </span>
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
