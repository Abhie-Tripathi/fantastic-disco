import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; 
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils"; 
interface DateRangePopupProps {
    type?:string;
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
  comparisonOptions: string[];
  setSelectedComparison: (option: string) => void;
  selectedComparison: string;
}

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
  comparisonOptions,
  setSelectedComparison,
  selectedComparison,
  type
}) => {
  return (
    <div className="flex flex-col border rounded-md">
        {type==="T_LOCATION_DATE" &&
      <div className="flex justify-between items-center p-4 py-2 border-b">
        <span className="font-medium">Dates</span>
      </div>
        }
      <div className="flex space-x-4 rounded-md p-4">
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
            onSelect={(range, selectedDay) => handleDateSelect(selectedDay)}
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
  );
};

export default DateRangePopup;
