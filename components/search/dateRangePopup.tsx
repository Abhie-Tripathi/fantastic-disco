import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useFilterContext } from "@/context/filterContext";
import { cn } from "@/lib/utils";
import { format, subDays, subYears } from "date-fns";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Label } from "../ui/label";

interface DateRangePopupProps {
  type?: string;
  presets: { value: string; label: string }[];
  handlePresetChange: (value: string) => void;
  selectedPreset: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  handleDateSelect: (selectedDay: Date) => void;
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
  enableCompareOptions: boolean;
}

const comparisonOptions = [
  {
    id: "preceding_period_match_dow",
    label: (
      <>
        Preceding period
        <br />
        (match day of week)
      </>
    ),
  },
  {
    id: "same_period_ly_match_dow",
    label: (
      <>
        Same period last year
        <br />
        (match day of week)
      </>
    ),
  },
  { id: "preceding_period", label: "Preceding period" },
  { id: "same_period_ly", label: "Same period last year" },
  { id: "custom", label: "Custom" },
] as const;

type ComparisonType = (typeof comparisonOptions)[number]["id"] | "";

const DateRangePopup: React.FC<DateRangePopupProps> = ({
  presets,
  handlePresetChange,
  selectedPreset,
  dateRange,
  handleDateSelect,
  calendarDate,
  setCalendarDate,
  enableCompareOptions,
  type,
}) => {
  const url = usePathname();
  const searchParams = useSearchParams();
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const compareFrom = getLocalFilterValue("compare_from");
  const compareTo = getLocalFilterValue("compare_to");

  // Initialize comparison type based on URL parameters
  const [comparisonType, setComparisonType] = React.useState<ComparisonType>(
    () => {
      if (!enableCompareOptions) return "";
      if (compareFrom && compareTo) {
        // If compare dates exist, initialize with custom type
        return "custom";
      }
      return "";
    }
  );

  React.useEffect(() => {
    // Reset comparison if compare is disabled
    if (!enableCompareOptions) {
      setComparisonType("");
      setLocalFilter("compare_from", "");
      setLocalFilter("compare_to", "");
    }
  }, [enableCompareOptions, setLocalFilter, searchParams]);

  const calculateComparisonDates = (
    from: Date | undefined,
    to: Date | undefined,
    type: ComparisonType
  ) => {
    if (!from || !to) return { from: undefined, to: undefined };

    const duration = to.getTime() - from.getTime();

    switch (type) {
      case "preceding_period_match_dow":
        // Move back by the duration plus 1 day to match day of week
        const precedingFrom = new Date(from.getTime() - duration - 86400000);
        const precedingTo = new Date(from.getTime() - 86400000);
        return { from: precedingFrom, to: precedingTo };

      case "same_period_ly_match_dow":
        // Same dates but one year before
        return {
          from: subYears(from, 1),
          to: subYears(to, 1),
        };

      case "preceding_period":
        // Simply move back by the duration
        return {
          from: new Date(from.getTime() - duration),
          to: subDays(from, 1),
        };

      case "same_period_ly":
        // Exactly one year before
        return {
          from: subYears(from, 1),
          to: subYears(to, 1),
        };

      case "custom":
        // Use the manually set comparison dates
        return {
          from: compareFrom ? new Date(compareFrom) : undefined,
          to: compareTo ? new Date(compareTo) : undefined,
        };

      default:
        return { from: undefined, to: undefined };
    }
  };

  const compareRange = React.useMemo(
    () =>
      calculateComparisonDates(dateRange.from, dateRange.to, comparisonType),
    [dateRange.from, dateRange.to, comparisonType, compareFrom, compareTo]
  );

  // Filter out 'past' and 'upcoming' presets when the URL is '/internal/trends'
  const filterPresets =
    url === "/internal/trends"
      ? presets.filter(
          (preset) => preset.value !== "past" && preset.value !== "upcoming"
        )
      : presets;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      handleDateSelect(date);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      handleDateSelect(date);
    }
  };

  const handleCompareChange = (checked: boolean) => {
    if (!enableCompareOptions) return;
    if (!checked) {
      setComparisonType("");
      setLocalFilter("compare_from", "");
      setLocalFilter("compare_to", "");
    } else {
      setComparisonType("preceding_period_match_dow");
      if (dateRange.from && dateRange.to) {
        const { from, to } = calculateComparisonDates(
          dateRange.from,
          dateRange.to,
          "preceding_period_match_dow"
        );
        if (from && to) {
          setLocalFilter("compare_from", format(from, "yyyy-MM-dd"));
          setLocalFilter("compare_to", format(to, "yyyy-MM-dd"));
        }
      }
    }
  };

  const handleComparisonTypeChange = (type: ComparisonType) => {
    setComparisonType(type);
    if (dateRange.from && dateRange.to) {
      const { from, to } = calculateComparisonDates(
        dateRange.from,
        dateRange.to,
        type
      );
      if (from && to) {
        setLocalFilter("compare_from", format(from, "yyyy-MM-dd"));
        setLocalFilter("compare_to", format(to, "yyyy-MM-dd"));
      }
    }
  };

  const handleCompareStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setLocalFilter("compare_from", format(date, "yyyy-MM-dd"));
    }
  };

  const handleCompareEndDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setLocalFilter("compare_to", format(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex flex-col border rounded-md bg-white shadow-sm">
      {type === "T_LOCATION_DATE" && (
        <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Dates</span>
        </div>
      )}
      <div className="flex p-4 overflow-y-scroll max-h-[420px]">
        <div className="w-[200px] pr-4">
          <div>
            <div className="space-y-0.5">
              {filterPresets.map((preset) => (
                <Button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal text-sm transition-colors hover:bg-gray-100",
                    selectedPreset === preset.value &&
                      "bg-blue-50 text-blue-600 hover:bg-blue-50"
                  )}
                >
                  {preset.label}
                </Button>
              ))}

              {enableCompareOptions && (
                <>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50">
                    <span className="text-sm">Compare</span>
                    <Switch
                      checked={!!comparisonType}
                      onCheckedChange={handleCompareChange}
                    />
                  </div>
                  {comparisonType && (
                    <div className="space-y-0.5 mt-2">
                      {comparisonOptions.map((option) => (
                        <Button
                          key={option.id}
                          onClick={() => handleComparisonTypeChange(option.id)}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left font-normal text-sm transition-colors text-wrap hover:bg-gray-100",
                            comparisonType === option.id &&
                              "bg-blue-50 text-blue-600 hover:bg-blue-50"
                          )}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col pl-4 border-l h-full">
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex flex-col">
                  <Label className="text-xs mb-1.5 text-muted-foreground font-medium">
                    Start date
                  </Label>
                  <Input
                    type="date"
                    value={
                      dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""
                    }
                    onChange={handleStartDateChange}
                    className="w-[140px] pr-8"
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs mb-1.5 text-muted-foreground font-medium">
                    End date
                  </Label>
                  <Input
                    type="date"
                    value={
                      dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""
                    }
                    onChange={handleEndDateChange}
                    className="w-[140px] pr-8"
                  />
                </div>
              </div>
            </div>

            {!!comparisonType && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Compare
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <Label className="text-xs mb-1.5 text-muted-foreground font-medium">
                      Start date
                    </Label>
                    <Input
                      type="date"
                      value={
                        compareRange.from
                          ? format(compareRange.from, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={handleCompareStartDateChange}
                      className="w-[140px] pr-8"
                      disabled={comparisonType !== "custom"}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs mb-1.5 text-muted-foreground font-medium">
                      End date
                    </Label>
                    <Input
                      type="date"
                      value={
                        compareRange.to
                          ? format(compareRange.to, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={handleCompareEndDateChange}
                      className="w-[140px] pr-8"
                      disabled={comparisonType !== "custom"}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range, selectedDay) => handleDateSelect(selectedDay)}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              numberOfMonths={1}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePopup;
