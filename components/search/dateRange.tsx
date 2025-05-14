"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterContext } from "@/context/filterContext";
import { GAEvent } from "@/utils/GAEvent";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import DateRangePopup from "./dateRangePopup";
import { useAuthContext } from "@/context";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { isEventeli } from "@/config";

const presets = [
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "3 months", value: "3-months" },
  { label: "6 months", value: "6-months" },
  { label: "9 Months", value: "9-months" },
  { label: "12 months", value: "12-months" },
  { label: "Past", value: "past" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Custom", value: "custom" },
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

const formatDateForFilter = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export default function DateRangeSelector({
  type,
  source,
}: {
  type?: string;
  source?: string;
}) {
  const pathName = usePathname();
  const isLowHeight = useMediaQuery({
    type: "down",
    start: "md",
    defaultState: false,
    dimension: "height",
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());
  const [selectedPreset, setSelectedPreset] = React.useState("");
  const {
    setMultipleLocalFilters,
    searchParams,
    getLocalFilterValue,
    applyFilters,
  } = useFilterContext();
  const viewParam = searchParams.get("view");
  const enableCompareOptions =
    pathName === "/internal/trends" &&
    viewParam !== "treemap" &&
    (isEventeli || viewParam !== null);

  const active_gte = getLocalFilterValue("active_gte");
  const active_lte = getLocalFilterValue("active_lte");

  const dateRange = React.useMemo(
    () => ({
      from: active_gte ? parseISO(active_gte) : undefined,
      to: active_lte ? parseISO(active_lte) : undefined,
    }),
    [active_gte, active_lte]
  );

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === "any") {
      setMultipleLocalFilters({ active_gte: "", active_lte: "" });
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
        to = new Date(currentDate.setDate(currentDate.getDate() - 1));
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

    const filters: { active_gte: string; active_lte: string } = {
      active_gte: "",
      active_lte: "",
    };

    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(5, 30, 0, 0);
      filters.active_gte = formatDateForFilter(fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(5, 30, 0, 0);
      filters.active_lte = formatDateForFilter(toDate);
    }
    setMultipleLocalFilters(filters);
    setCalendarDate(currentDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setSelectedPreset("custom");

    if (!dateRange.from && !dateRange.to) {
      const date = new Date(selectedDate);
      date.setHours(5, 30, 0, 0);
      setMultipleLocalFilters({
        active_gte: formatDateForFilter(date),
        active_lte: formatDateForFilter(date),
      });
      return;
    }

    if (
      dateRange.from &&
      dateRange.to &&
      dateRange.from.getTime() === dateRange.to.getTime()
    ) {
      const date = new Date(selectedDate);
      date.setHours(5, 30, 0, 0);
      if (selectedDate < dateRange.from) {
        setMultipleLocalFilters({
          active_gte: formatDateForFilter(date),
          active_lte: formatDateForFilter(dateRange.from),
        });
      } else {
        setMultipleLocalFilters({
          active_gte: formatDateForFilter(dateRange.from),
          active_lte: formatDateForFilter(date),
        });
      }
      return;
    }

    if (dateRange.from && dateRange.to) {
      const date = new Date(selectedDate);
      date.setHours(5, 30, 0, 0);
      setMultipleLocalFilters({
        active_gte: formatDateForFilter(date),
        active_lte: formatDateForFilter(date),
      });
      return;
    }

    if (dateRange.from && !dateRange.to) {
      const date = new Date(selectedDate);
      date.setHours(5, 30, 0, 0);
      if (selectedDate < dateRange.from) {
        setMultipleLocalFilters({
          active_gte: formatDateForFilter(date),
          active_lte: formatDateForFilter(dateRange.from),
        });
      } else {
        setMultipleLocalFilters({
          active_gte: formatDateForFilter(dateRange.from),
          active_lte: formatDateForFilter(date),
        });
      }
    }
  };

  const onOpenChange = (open: boolean) => {
    if (selectedPreset === "custom" && (!dateRange.from || !dateRange.to)) {
      handlePresetChange("3-months");
    }
    setIsOpen(open);

    // Auto apply date filter in case of coordinate
    if (!open && source === "coordinate") {
      applyFilters();
    }
  };
  useEffect(() => {
    if (type === "T_GEOTIME" && !isOpen) {
      onOpenChange(true);
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (source === "coordinate" && searchParams.get("active_gte"))
      GAEvent(
        "Coordinate",
        "Filter",
        "Coordinate",
        "Coordinate | Dates | Auto Applied"
      );
  }, [searchParams.get("active_gte")]);
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      {type !== "T_GEOTIME" && (
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
            <div className="flex items-center truncate">
              <span className="mr-2">Dates</span>
              <div className="max-w-[200px] overflow-hidden">
                <div className="text-xs truncate text-primary font-medium">
                  {(dateRange.from || dateRange.to) && (
                    <span className="text-primary">
                      {formatDateRange(dateRange.from, dateRange.to)}
                    </span>
                  )}
                  {enableCompareOptions &&
                    getLocalFilterValue("compare_from") &&
                    getLocalFilterValue("compare_to") && (
                      <>
                        <span className="mx-1 text-muted-foreground">vs</span>
                        <span className="text-muted-foreground">
                          {formatDateRange(
                            new Date(getLocalFilterValue("compare_from")),
                            new Date(getLocalFilterValue("compare_to"))
                          )}
                        </span>
                      </>
                    )}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180 transform" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
      )}
      {type === "T_GEOTIME" ? (
        <DateRangePopup
          type={type}
          presets={presets}
          handlePresetChange={handlePresetChange}
          selectedPreset={selectedPreset}
          dateRange={dateRange}
          handleDateSelect={handleDateSelect}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          enableCompareOptions={false}
        />
      ) : (
        <PopoverContent
          className="w-auto p-0"
          align={isLowHeight ? "center" : "start"}
          side={isLowHeight ? "right" : "bottom"}
        >
          <DateRangePopup
            presets={presets}
            handlePresetChange={handlePresetChange}
            selectedPreset={selectedPreset}
            dateRange={dateRange}
            handleDateSelect={handleDateSelect}
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
            enableCompareOptions={enableCompareOptions}
          />
        </PopoverContent>
      )}
    </Popover>
  );
}