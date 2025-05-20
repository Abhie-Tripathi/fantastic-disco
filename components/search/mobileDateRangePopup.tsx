"use client";

import type * as React from "react";
import { format, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface MobileDateRangePopupProps {
  presets: { value: string; label: string }[];
  handlePresetChange: (value: string) => void;
  selectedPreset: string;
  dateRange: any;
  handleDateSelect: (selectedDay: Date) => void;
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
  enableCompareOptions?: boolean;
  compareEnabled?: boolean;
  setCompareEnabled?: (enabled: boolean) => void;
  comparisonOptions?: string[];
  setSelectedComparison?: (option: string) => void;
  selectedComparison?: string;
  type?: string;
  onApply?: () => void;
}

const MobileDateRangePopup: React.FC<MobileDateRangePopupProps> = ({
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
  comparisonOptions,
  setSelectedComparison,
  selectedComparison,
  type,
  onApply,
}) => {
  const quickSelections = presets.filter((preset) =>
    ["this-week", "this-month", "3-months", "6-months", "12-months"].includes(preset.value)
  );

  const navigateMonth = (direction: "prev" | "next") => {
    setCalendarDate(addMonths(calendarDate, direction === "prev" ? -1 : 1));
  };

  return (
    <div className="flex flex-col h-full max-w-[300px]">
      {/* Quick selection buttons */}
      <div className="flex overflow-x-auto p-2">
        {quickSelections.map((preset) => (
          <Button
            key={preset.value}
            variant="ghost"
            className={cn(
              "whitespace-nowrap mx-1 text-xs border font-medium",
              selectedPreset === preset.value && "bg-primary/10 text-primary"
            )}
            onClick={() => handlePresetChange(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-y-auto px-4">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range, selectedDay) => handleDateSelect(selectedDay)}
          month={calendarDate}
          onMonthChange={setCalendarDate}
          numberOfMonths={1}
          className="w-full"
        />
      </div>

      {/* Compare options */}
      {/* {enableCompareOptions && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium">Compare with Past data</h3>
            <Switch
              disabled
              checked={compareEnabled}
              onCheckedChange={setCompareEnabled}
            />
          </div>
          {compareEnabled &&
            comparisonOptions &&
            setSelectedComparison &&
            selectedComparison && (
              <div className="mt-4 space-y-2">
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
      )} */}
    </div>
  );
};

export default MobileDateRangePopup;
