"use client";

import React from "react";
import moment, { duration } from "moment";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Views } from "./constants";
import { isEventeli } from "@/config";
import { formattedDateRange } from "@/utils/date";
import { useFilterState } from "@/hooks/useFilterState";
import { groupedEventTypes } from "@/constants";

interface CustomToolbarProps {
  date: Date;
  view: string;
  onNavigate: (action: "PREV" | "NEXT") => void;
  setView: (view: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const CustomToolbar = ({
  date,
  view,
  onNavigate,
  setView,
  filter,
  onFilterChange,
}: CustomToolbarProps) => {
  const { getFilterValue } = useFilterState();

  const eventTypes = getFilterValue("eventTypes").split(",");
  const isBusinessEnabled = eventTypes.some((eventType: string) =>
    groupedEventTypes.business.includes(eventType)
  );
  const isSocialEnabled = eventTypes.some((eventType: string) =>
    groupedEventTypes.social.includes(eventType)
  );
  const isAttendedEnabled = eventTypes.some((eventType: string) =>
    groupedEventTypes.unAttended.includes(eventType)
  );

  console.log(
    "b",
    isBusinessEnabled,
    "s",
    isSocialEnabled,
    "a",
    isAttendedEnabled
  );

  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const label = () => {
    const dateObj = moment(date);
    if (view === Views.YEAR) {
      return dateObj.format("YYYY");
    }
    return view === Views.MONTH
      ? dateObj.format("MMMM YYYY")
      : formattedDateRange(
          dateObj.startOf("week").toString(),
          dateObj.endOf("week").toString(),
          false
        );
  };

  return (
    <div className="grid grid-cols-10 my-4">
      <div className="col-span-2">
        <Select
          value={view}
          onValueChange={(newView) => setView(newView as any)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Views.WEEK}>Weekly</SelectItem>
            <SelectItem value={Views.MONTH}>Monthly</SelectItem>
            <SelectItem value={Views.YEAR}>Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4 place-self-center col-span-6">
        <Button variant="ghost" size="icon" onClick={goToBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">{label()}</span>
        <Button variant="ghost" size="icon" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {isEventeli && (
        <div className="place-self-end col-span-2">
          <Select
            value={filter}
            onValueChange={onFilterChange}
            disabled={view === Views.WEEK}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem disabled={!isSocialEnabled} value="social">
                Social Events
              </SelectItem>
              <SelectItem disabled={!isBusinessEnabled} value="business">
                Business Events
              </SelectItem>
              <SelectItem disabled={!isAttendedEnabled} value="unattended">
                Unattended Events
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CustomToolbar;
