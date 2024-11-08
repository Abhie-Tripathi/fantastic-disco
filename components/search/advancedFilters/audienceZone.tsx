"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";
interface AudienceZoneProps{
  source:string;
  isEnabled?: boolean;
  setIsEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function AudienceZoneSatusSelector({
  source,
  isEnabled: parentIsEnabled = false,
  setIsEnabled: parentSetIsEnabled,
}: AudienceZoneProps) {
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const [localIsEnabled, setLocalIsEnabled] = useState(false);
  const isEnabled = source === "tracker" ? parentIsEnabled : localIsEnabled;
  const setIsEnabled = source === "tracker" ? parentSetIsEnabled : setLocalIsEnabled;
  useEffect(() => {
    if(source!=="tracker"){
    const showFilters = getLocalFilterValue("show").split(",");
    setIsEnabled?.(showFilters.includes("audienceZone"));
    }
  }, [getLocalFilterValue]);

  const handleToggle = (checked: boolean) => {
    setIsEnabled?.(checked);
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
