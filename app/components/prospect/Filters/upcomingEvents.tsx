"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";
import { LockClosedSmall } from "geist-icons";
import { cn } from "@/lib/utils";
export default function UpcomingEvents() {
  const { setLocalFilter, getLocalFilterValue, morphedData, deleteMultipleLocalFilters } =
    useFilterContext();
      const [isMounted, setIsMounted] = useState(false);
        useEffect(() => {
          setIsMounted(true);
        }, []);
  const isEnabled = useMemo(() => {
    return getLocalFilterValue("upcomingEvents") || false;
  }, [getLocalFilterValue]);
  const handleToggle = (checked: boolean) => {
    const showFilters = getLocalFilterValue("upcomingEvents");

    if (checked) {
      setLocalFilter("upcomingEvents", "true");
    } else {
      deleteMultipleLocalFilters(["upcomingEvents"]);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-between px-3 py-5 text-base font-normal"
    >
      <div className="flex items-center">
        {/* {!enabled && <LockClosedSmall color="var(--secondary-text-color)" />} */}
        <span className="mr-2">Upcoming Events</span>
      </div>
      {isMounted &&
      <Switch
        id="upcoming-event"
        checked={Boolean(isEnabled)}
        onCheckedChange={handleToggle}
      />}
    </Button>
  );
}
