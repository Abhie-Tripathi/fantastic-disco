import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
interface DateRangePopupProps {
  type?: string;
  presets: { value: string; label: string }[];
  handlePresetChange: (value: string) => void;
  selectedPreset: string;
  dateRange: any;
  handleDateSelect: (selectedDay: Date) => void;
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
  enableCompareOptions: boolean;
  compareEnabled: boolean;
  setCompareEnabled: (enabled: boolean) => void;
}

const comparisonOptions = [
  {
    id: "preceding_period_match_dow",
    label: "Preceding Period (match day of the week)",
  },
  {
    id: "same_period_ly_match_dow",
    label: "Same period last year (match day of the week)",
  },
  { id: "preceding_period", label: "Preceding Period" },
  { id: "same_period_ly", label: "Same Period Last year" },
];

const DateRangePopup: React.FC<DateRangePopupProps> = ({
  presets,
  handlePresetChange,
  selectedPreset,
  dateRange,
  handleDateSelect,
  calendarDate,
  setCalendarDate,
  enableCompareOptions,
  compareEnabled,
  setCompareEnabled,
  type,
}) => {
  const url = usePathname();
  const { getFilterValue, setFilter } = useFilterState();
  const selectedComparison = getFilterValue("compare");

  // Filter out 'past' and 'upcoming' presets when the URL is '/internal/trends'
  const filterPresets =
    url === "/internal/trends"
      ? presets.filter(
          (preset) => preset.value !== "past" && preset.value !== "upcoming"
        )
      : presets;
  return (
    <div className="flex flex-col border rounded-md">
      {type === "T_LOCATION_DATE" && (
        <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Dates</span>
        </div>
      )}
      <ScrollArea className={cn("max-h-[400px]", compareEnabled && "h-[400px]")}>
        <div className="flex space-x-4 rounded-md p-4">
          <ScrollArea className="h-[300px] w-[150px]">
            <div className="space-y-2 flex flex-col justify-between pr-4">
              {filterPresets.map((preset) => (
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
              onSelect={(range, selectedDay) => handleDateSelect(selectedDay)}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              numberOfMonths={1}
            />
          </div>
        </div>
        {enableCompareOptions && (
          <div className="border-t pt-4 px-4 pb-4">
            <div
              className={`flex items-center justify-between ${
                compareEnabled ? "mb-3" : "mb-0"
              }`}
            >
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
                    key={option.id}
                    onClick={() => setFilter("compare", option.id)}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal py-2",
                      selectedComparison === option.id && "bg-[#F2F2F2]"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DateRangePopup;
