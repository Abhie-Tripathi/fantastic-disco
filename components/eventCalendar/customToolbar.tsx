"use client";

import React from "react";
import moment from "moment";
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
      : `${dateObj.startOf("week").format("D MMMM")} - ${dateObj
          .endOf("week")
          .format("D MMMM, YYYY")}`;
  };

  return (
    <div className="grid grid-cols-3 mb-4">
      <Select value={view} onValueChange={(newView) => setView(newView as any)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Display" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Views.WEEK}>Weekly</SelectItem>
          <SelectItem value={Views.MONTH}>Monthly</SelectItem>
          <SelectItem value={Views.YEAR}>Yearly</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-4 place-self-center">
        <Button variant="ghost" size="icon" onClick={goToBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">{label()}</span>
        <Button variant="ghost" size="icon" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {/* <Select
        value={filter}
        onValueChange={onFilterChange}
        disabled={view === Views.WEEK}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="social">Social Events</SelectItem>
          <SelectItem value="business">Business Events</SelectItem>
        </SelectContent>
      </Select> */}
    </div>
  );
};

export default CustomToolbar;
