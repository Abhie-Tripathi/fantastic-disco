"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useFilterContext } from "@/context/filterContext";

export default function AttendanceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const [fromAttendance, setFromAttendance] = useState<string>();
  const [toAttendance, setToAttendance] = useState<string>();

  useEffect(() => {
    const fromValue = getLocalFilterValue("total_attendance_gte");
    const toValue = getLocalFilterValue("total_attendance_lte");
    if (fromValue) setFromAttendance(fromValue);
    if (toValue) setToAttendance(toValue);
  }, []);

  const handleApply = () => {
    if (fromAttendance) setLocalFilter("total_attendance_gte", fromAttendance);
    if (toAttendance) setLocalFilter("total_attendance_lte", toAttendance);
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleApply();
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
            <span className="mr-2">Event Attendance</span>
            {fromAttendance && (
              <span className="truncate ml-1 text-xs text-primary font-medium">
                {`${fromAttendance} +`}
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
      <PopoverContent className="w-full max-w-[350px] p-0" align="start">
        <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Event Attendance</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label
                htmlFor="from-attendance"
                className="text-sm text-gray-500 mb-1 block"
              >
                From
              </label>
              <Input
                id="from-attendance"
                type="number"
                value={fromAttendance}
                onChange={(e) => setFromAttendance(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-none pt-5">-</div>
            <div className="flex-1">
              <label
                htmlFor="to-attendance"
                className="text-sm text-gray-500 mb-1 block"
              >
                To
              </label>
              <Input
                id="to-attendance"
                type="number"
                placeholder="Unlimited"
                value={toAttendance}
                onChange={(e) => setToAttendance(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}