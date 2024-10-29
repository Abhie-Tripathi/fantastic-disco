"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";

export default function AudienceZoneSatusSelector() {
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const showFilters = getLocalFilterValue("show").split(",");
    setIsEnabled(showFilters.includes("audienceZone"));
  }, [getLocalFilterValue]);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    const showFilters = getLocalFilterValue("show").split(",");
    console.log(showFilters);
    if (checked) {
      setLocalFilter(
        "show",
        [...showFilters, "audienceZone"].join(",").replace(/^,|,$/g, "")
      );
    } else {
      setLocalFilter(
        "show",
        showFilters
          .filter((filter) => filter !== "audienceZone")
          .join(",")
          .replace(/^,|,$/g, "")
      );
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-between px-3 py-5 text-base font-normal"
    >
      <div className="flex items-center">
        <span className="mr-2">Audience Zone</span>
      </div>
      <Switch
        id="forecasted-status"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </Button>
  );
}
