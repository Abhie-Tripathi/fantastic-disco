"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filterContext";
import { Switch } from "@/components/ui/switch";
interface forecastInterface{
  isForecastedEnabled:boolean,
  toggleOpend:boolean,
}
interface ForecastedProps{
  enabledForecastData:forecastInterface;
  source:string;
  isEnabled?: boolean;
  setIsEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ForecastedStatusSelector({
  enabledForecastData,
  source,
  isEnabled: parentIsEnabled = false,
  setIsEnabled: parentSetIsEnabled,
}: ForecastedProps) {
  const { setLocalFilter, getLocalFilterValue } = useFilterContext();
  const [localIsEnabled, setLocalIsEnabled] = useState(false);
  const isEnabled = source === "tracker" ? parentIsEnabled : localIsEnabled;
  const setIsEnabled = source === "tracker" ? parentSetIsEnabled : setLocalIsEnabled;
  useEffect(() => {
    if(source!=="tracker"){
    const showFilters = getLocalFilterValue("show").split(",");
    setIsEnabled?.(showFilters.includes("forecasted"));
    }
  }, [getLocalFilterValue]);

  const handleToggle = (checked: boolean) => {
    setIsEnabled?.(checked);
    const showFilters = getLocalFilterValue("show").split(",");
    console.log(showFilters);
    if (checked) {
      setLocalFilter(
        "show",
        [...showFilters, "forecasted"].join(",").replace(/^,|,$/g, "")
      );
    } else {
      setLocalFilter(
        "show",
        showFilters
          .filter((filter) => filter !== "forecasted")
          .join(",")
          .replace(/^,|,$/g, "")
      );
    }
  };

  return (
    <Button
      variant="outline"
      disabled={enabledForecastData && !enabledForecastData?.isForecastedEnabled}
      className="w-full justify-between px-3 py-5 text-base font-normal"
    >
      <div className="flex items-center">
        <span className="mr-2">Forecasted Status</span>
      </div>
      <Switch
        id="forecasted-status"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
    </Button>
  );
}
